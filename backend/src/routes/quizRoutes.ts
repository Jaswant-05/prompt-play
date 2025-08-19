import express, { Request, Response } from "express";
import { OpenAiHandler } from "../services/OpenAiHandler";
import { openai } from "../lib/openai";
import { QuizHandler } from "../services/QuizHandler";
import { prisma } from "../lib/db";

const quizRouter = express.Router();
const openAiHandler = new OpenAiHandler(openai);
const quizHandler = new QuizHandler(prisma);

quizRouter.post('/', async (req: Request, res: Response) => {
  try {
    const { userId, code, topic, status = "DRAFT", title, difficulty, prompt } = req.body || {};

    if (!userId || !code || !topic || !title || !difficulty || !prompt) {
      return res.status(400).json({
        error: "Missing required fields: userId, code, topic, title, difficulty, prompt",
      });
    }

    const aiQuiz = await openAiHandler.createQuiz({ title, difficulty, prompt });

    if (!aiQuiz.questions) {
      return res.status(500).json({ error: "Failed to generate quiz from AI" });
    }

    const savedQuiz = await quizHandler.createQuiz({
      userId,
      code,
      topic,
      status,
      questions: aiQuiz.questions,
    });

    return res.status(201).json({
      success: true,
      data: savedQuiz,
    });

  } catch (err: any) {
    res.status(400).json({
      err: err.message,
    });
  }
});

quizRouter.get("/:quizId", async (req: Request, res: Response) => {
  try {
    const quizId = Number(req.params.quizId);
    if (!quizId) {
      return res.status(400).json({ error: "quizId is required" });
    }

    const data = await quizHandler.getQuiz(quizId);
    return res.status(200).json({ success: true, data });
  } catch (err: any) {
    res.status(400).json({ err: err.message });
  }
});

quizRouter.get("/", async (req: Request, res: Response) => {
  try {
    const { userId, status, code, topic } = req.query;

    const data = await quizHandler.getQuizzes({
      userId: userId as string | undefined,
      status: status as any,
      code: code as string | undefined,
      topic: topic as string | undefined,
    });

    return res.status(200).json({ success: true, data });
  } catch (err: any) {
    res.status(400).json({ err: err.message });
  }
});

quizRouter.delete("/:quizId", async (req: Request, res: Response) => {
  try {
    const quizId = Number(req.params.quizId);
    if (!quizId) {
      return res.status(400).json({ error: "quizId is required" });
    }

    const data = await quizHandler.deleteQuiz(quizId);
    return res.status(200).json({ success: true, data });
  } catch (err: any) {
    res.status(400).json({ err: err.message });
  }
});


export default quizRouter;