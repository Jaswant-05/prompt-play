import { Socket, Server } from "socket.io";
import type { PrismaClient, QuizStatus } from "@prisma/client";
import {
  ClientToServerEvents,
  InterServerEvents,
  ServerToClientEvents,
  SocketData
} from "../types/types";

type IOServer = Server<ServerToClientEvents, ClientToServerEvents, InterServerEvents, SocketData>;
type IOSocket  = Socket<ServerToClientEvents, ClientToServerEvents, InterServerEvents, SocketData>;

const ANSWER_MS = 30_000;
const REVIEW_MS = 15_000;
const CODE_RE = /^[A-Z0-9]{6}$/i;
const POINTS = 10;

type CachedOption = { id: number; title: string; isCorrect: boolean };
type CachedQuestion = { id: number; title: string; options: CachedOption[] };

type Phase = "answering" | "review" | "ended";

type QuizState = {
  quizId: number;
  ownerId: number;
  code: string;
  phase: Phase;
  index: number;
  startedAt: number;
  timers: { end?: NodeJS.Timeout; next?: NodeJS.Timeout };
  answers: Map<number, number>;
  scores: Map<number, number>;
  questions: CachedQuestion[];
};

export class SocketHandler {
  private active = new Map<string, QuizState>();

  constructor(private io: IOServer, private prisma: PrismaClient) {}

  register(socket: IOSocket) {
    socket.on("joinRoom", (code: string) => this.joinRoom(socket, code));
    socket.on("start_quiz", (code: string) => this.startQuiz(socket, code));
    socket.on("submit_answer", (p: { code: string; questionId: number; optionId: number }) =>
      this.submitAnswer(socket, p)
    );
  }

  async joinRoom(socket: IOSocket, code: string) {
    if (!CODE_RE.test(code)) return socket.emit("error", { message: "Invalid code" });

    const quiz = await this.prisma.quiz.findFirst({
      where: { code },
      select: { id: true, topic: true, status: true, userId: true }
    });

    if (!quiz) return socket.emit("error", { message: "Quiz not found." });
    if (quiz.status !== "DRAFT") return socket.emit("error", { message: "Quiz already started." });

    socket.join(code);
    const count = this.io.sockets.adapter.rooms.get(code)?.size ?? 0;

    socket.emit("joinedRoom", {
      roomId: code,
      quizId: quiz.id,
      topic: quiz.topic,
      status: quiz.status,
      playersCount: count,
      ownerId: quiz.userId
    });

    socket.to(code).emit("playerJoined", { userId: socket.data.userId, socketId: socket.id });
  }

  async startQuiz(socket: IOSocket, code: string) {
    const userId = Number(socket.data.userId);
    if (!userId) return socket.emit("error", { message: "Unauthorized" });

    const quiz = await this.prisma.quiz.findFirst({
      where: { code },
      include: { questions: { orderBy: { id: "asc" }, include: { options: true } } }
    });

    if (!quiz) return socket.emit("error", { message: "Quiz not found" });
    if (quiz.status !== "DRAFT") return socket.emit("error", { message: "Quiz not joinable" });
    if (quiz.userId !== userId) return socket.emit("error", { message: "Only the owner can start" });
    if (quiz.questions.length === 0) return socket.emit("error", { message: "Quiz has no questions" });

    await this.prisma.quiz.update({ where: { id: quiz.id }, data: { status: "ACTIVE" as QuizStatus } });

    const state: QuizState = {
      quizId: quiz.id,
      ownerId: quiz.userId,
      code,
      phase: "answering",
      index: 0,
      startedAt: Date.now(),
      timers: {},
      answers: new Map(),
      scores: new Map(),
      questions: quiz.questions.map(q => ({
        id: q.id,
        title: q.title,
        options: q.options.map(o => ({ id: o.id, title: o.title, isCorrect: o.isCorrect }))
      }))
    };

    this.active.set(code, state);

    const q0 = state.questions[0];
    this.io.to(code).emit("question", {
      question: this.safe(q0),
      startTime: state.startedAt,
      duration: ANSWER_MS
    });

    state.timers.end = setTimeout(() => this.endAnswerWindow(code), ANSWER_MS);
  }

  submitAnswer(
    socket: IOSocket,
    { code, questionId, optionId }: { code: string; questionId: number; optionId: number }
  ) {
    const userId = Number(socket.data.userId);
    if (!userId) return;

    const s = this.active.get(code);
    if (!s || s.phase !== "answering") return;

    const q = s.questions[s.index];
    if (!q || q.id !== questionId) return;

    const deadline = s.startedAt + ANSWER_MS;
    if (Date.now() > deadline) return;

    if (!q.options.some(o => o.id === optionId)) return;

    s.answers.set(userId, optionId);
    socket.emit("answer_received", { questionId, optionId });
  }

  private async endAnswerWindow(code: string) {
    const s = this.active.get(code);
    if (!s || s.phase !== "answering") return;

    const q = s.questions[s.index];
    const correct = q.options.find(o => o.isCorrect)!;

    for (const [uid, oid] of s.answers.entries()) {
        if (oid === correct.id) {
            const newScore = (s.scores.get(uid) ?? 0) + POINTS;
            s.scores.set(uid, newScore);

            await this.prisma.point.upsert({
            where: { userId_quizId: { userId: uid, quizId: s.quizId } },
            update: { score: newScore },
            create: { userId: uid, quizId: s.quizId, score: newScore }
            });
        }
        }

    const leaderboard = Array.from(s.scores.entries())
      .map(([userId, score]) => ({ userId, score }))
      .sort((a, b) => b.score - a.score);

    this.io.to(code).emit("reveal", { questionId: q.id, correctOptionId: correct.id });
    this.io.to(code).emit("leaderboard", { leaderboard });

    s.phase = "review";
    s.answers.clear();
    s.timers.next = setTimeout(() => this.next(code), REVIEW_MS);
  }

  private async next(code: string) {
    const s = this.active.get(code);
    if (!s || s.phase === "ended") return;

    const nextIdx = s.index + 1;
    if (nextIdx >= s.questions.length) {
      s.phase = "ended";
      this.io.to(code).emit("quizEnded");
      for (const [uid, score] of s.scores.entries()) {
        await this.prisma.point.upsert({
            where: { userId_quizId: { userId: uid, quizId: s.quizId } },
            update: { score },
            create: { userId: uid, quizId: s.quizId, score }
        });
    }
      try { await this.prisma.quiz.update({ where: { id: s.quizId }, data: { status: "ENDED" as QuizStatus } }); } catch {}
      this.clear(s);
      this.active.delete(code);
      return;
    }

    s.phase = "answering";
    s.index = nextIdx;
    s.startedAt = Date.now();

    const q = s.questions[s.index];
    this.io.to(code).emit("question", {
      question: this.safe(q),
      startTime: s.startedAt,
      duration: ANSWER_MS
    });

    s.timers.end = setTimeout(() => this.endAnswerWindow(code), ANSWER_MS);
  }

  private safe(q: CachedQuestion) {
    return { id: q.id, title: q.title, options: q.options.map(o => ({ id: o.id, title: o.title })) };
  }

  private clear(s: QuizState) {
    if (s.timers.end) clearTimeout(s.timers.end);
    if (s.timers.next) clearTimeout(s.timers.next);
    s.timers.end = undefined;
    s.timers.next = undefined;
  }
}
