import type { PrismaClient } from "@prisma/client"; 
import { UserSchema, User } from "@jaswant5ingh/prompt-play-zod"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import bcrypt from "bcryptjs";

dotenv.config()

export class AuthHandler{
  private prisma : PrismaClient 

  constructor(prisma : PrismaClient){
    this.prisma = prisma
  }

  async signup({ username, password, firstName, lastName } : User){

    const validation = UserSchema.safeParse({
      username,
      password,
      firstName,
      lastName
    })

    if(!validation.success){
      throw new Error(`Invalid Input ${validation.error.message}`);
    }

    const existingUser = await this.prisma.user.findFirst({
      where : {
        username
      }
    });

    if(existingUser){
      throw new Error("User Already Exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const payload = {
      username,
      password : hashedPassword,
      firstName,
      lastName
    };

    const newUser = await this.prisma.user.create({
      data : payload,
      select : {
        username : true,
        firstName : true,
        lastName : true
      }
    })

    return ({success : true, user : newUser})

  }

  async signIn({username, password} : User){
    const validation = UserSchema.safeParse({
      username,
      password
    })

    if(!validation.success){
      throw new Error(`Invalid Input ${validation.error.message}`);
    }

    const user = await this.prisma.user.findFirst({
      where : {
        username
      },
    });

    if(!user){
      throw new Error(`User not found`);
    }

    const compare = await bcrypt.compare(password, user.password)
    
    if(!compare){
      throw new Error(`Invalid Password`);
    }

    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) throw new Error(`JWT_SECRET is required`);

    const token = jwt.sign({ username, id : user.id }, JWT_SECRET)

    if(!token){
      throw new Error(`Error generating Token`)
    }

    return ({
      success : true,
      data : {
        token,
        username
      }
    })

  }
}