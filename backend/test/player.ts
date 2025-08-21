import { io } from "socket.io-client";
const URL = "http://localhost:3000";
const CODE = "ABC123";

// src/shims.d.ts (or src/global.d.ts)
declare var process: {
  env: { [key: string]: string | undefined };
  argv: string[];
  cwd(): string;
  exit(code?: number): never;
  stdout: { write: (chunk: any) => boolean };
  stderr: { write: (chunk: any) => boolean };
};

const USER_ID = Number(process.argv[2] || 2);

const s = io(URL, { auth: { userId: USER_ID }, transports: ["websocket"] });

s.on("connect", () => {
  console.log(`P${USER_ID} connected`, s.id);
  s.emit("joinRoom", CODE);
});

s.on("question", ({ question }: any) => {
  console.log(`P${USER_ID} question:`, question.title);
  const choice = question.options[Math.floor(Math.random() * question.options.length)];
  setTimeout(() => {
    s.emit("submit_answer", { code: CODE, questionId: question.id, optionId: choice.id });
    console.log(`P${USER_ID} answered:`, choice.id);
  }, 800 + Math.random() * 1200);
});

s.on("reveal", (p:any) => console.log(`P${USER_ID} reveal:`, p));
s.on("leaderboard", (p:any) => console.log(`P${USER_ID} leaderboard:`, p));
s.on("quizEnded", () => console.log(`P${USER_ID} quizEnded`));
s.on("error", (e:any) => console.error(`P${USER_ID} error:`, e.message));

