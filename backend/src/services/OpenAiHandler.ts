import type OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";
import { system_prompt } from "../utils/system_prompt";
import { AiQuizSchema } from "@jaswant5ingh/prompt-play-zod";

export class OpenAiHandler{
  private openai;

  constructor(openai : OpenAI){
    this.openai = openai;
  }

  async createQuiz({title, difficulty, prompt} : {title : string, difficulty : string, prompt: string}){

    const response = await this.openai.responses.create({
      model: "gpt-5",
      instructions:
        "You are an expert quiz generator. Return ONLY JSON that matches the provided schema.",
      input: [
        { role: "developer", content: system_prompt },
        { role: "user", content: `Topic: ${title}. Difficulty: ${difficulty} + ${prompt}` },
      ],
      text: {
        format: zodTextFormat(AiQuizSchema, "ai_quiz_schema"),
      },
    });

    const quiz = response.output_text;  
    return JSON.parse(quiz);
  }
}


