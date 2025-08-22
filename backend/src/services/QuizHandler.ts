import { Quiz, QuizSchema } from "@jaswant5ingh/prompt-play-zod";
import type { PrismaClient } from "@prisma/client";
import { QUIZ_STATUS } from "../types/types";

export class QuizHandler{
  private prisma;

  constructor(prisma : PrismaClient){
    this.prisma = prisma
  }

  async createQuiz({userId, code, topic, status = "DRAFT", questions} : Quiz) {
    
    const payload = QuizSchema.safeParse({
      userId,
      code,
      topic,
      status,
      questions
    });

    console.log(payload.data);

    if(!userId){
      throw new Error("Missing userId")
    }
    if(!payload.success){
      throw new Error(`Invalid Inputs ${payload.error.message}`);
    }

    const quiz = await this.prisma.quiz.create({
      data : {
        userId,
        code,
        topic,
        status,
        questions: {
          create: questions.map(q => ({
            title: q.title,
            options: {
              create: q.options.map(o => ({
                title: o.title,
                isCorrect: o.isCorrect
              }))
            }
          }))
        }
      },
      include: {
        questions: {
          include: {
            options: true
          }
        }
      }
    }) 

    if(!quiz){
      throw new Error(`Error creating a quiz record`);
    }

    return ({
      success : true,
      quiz
    })
  }

  async getQuiz(code : string){

    if(!code){
      throw new Error(`quizId not found`)
    }

    const quiz = await this.prisma.quiz.findFirst({
      where : {
        code : code
      },
      include: {
        questions: {
          include: {
            options: true
          }
        }
      }
    })

    if(!quiz) throw new Error(`Error Finding Quiz`);

    return({
      success: true,
      quiz
    })

  }

  async getQuizzes(
    {userId, status, code, topic} : 
    {userId : String | undefined, status: QUIZ_STATUS | undefined, code: String | undefined, topic: String | undefined}
  ){
    const filter : any = {}

    if(userId) filter.userId = Number(userId)
    if(status) filter.status = status
    if(code) filter.code = code
    if(topic) filter.topic = topic

    const quizzes = await this.prisma.quiz.findMany({
      where: filter,
        include: {
          questions: {
            include: { options: true },
          },
        },
    });

  return({
    success : true,
    quizzes
  });

  }

  async deleteQuiz(quizId : number){
    const result = await this.prisma.quiz.delete({
      where : {
        id : quizId
      }
    })

    if(!result){
      throw new Error(`Error deleting quiz`);
    }

    return({
      success : true,
      message : "Quiz deleted successfully"
    })
  }
}