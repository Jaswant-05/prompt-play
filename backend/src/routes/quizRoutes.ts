import express, { Request, Response } from "express";
import { OpenAiHandler } from "../services/OpenAiHandler";
import { openai } from "../lib/openai";

const quizRouter = express.Router();
const openAiHandler = new OpenAiHandler(openai);

quizRouter.post('/', async(req : Request, res : Response) => {
  try{

    const { title, difficulty, prompt } = req.body || {};

    if (!title || !difficulty || !prompt) {
      return res.status(400).json({
        error: "Missing required fields: title, difficulty, prompt",
      });
    }

    const quiz = await openAiHandler.createQuiz({ title, difficulty, prompt });
    console.log(quiz);

    return res.status(201).json({
      success: true,
      quiz,
    });

  }catch(err: any){
    res.status(400).json({
      err : err.message
    })
  }
})

export default quizRouter;