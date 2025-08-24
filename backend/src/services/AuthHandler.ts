import type { PrismaClient } from "@prisma/client"; 
import { UserSchema, User } from "@jaswant5ingh/prompt-play-zod"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import bcrypt from "bcryptjs";
import { generateCode } from "../utils/generateCode";
import { sendPasswordResetEmail, sendVerificationEmail } from "../utils/resend";

dotenv.config()

export class AuthHandler{
  private prisma; 

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
    const verificationCode = generateCode();

    const payload = {
      username,
      password : hashedPassword,
      firstName,
      lastName,
      code : verificationCode
    };

    const newUser = await this.prisma.user.create({
      data : payload,
      select : {
        username : true,
        firstName : true,
        lastName : true
      }
    })
 
    await sendVerificationEmail({
      code: verificationCode,
      to: username
    });

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

    if(!user.verified){
      throw new Error(`Email not verified`);
    }


    const compare = await bcrypt.compare(password, user.password)
    
    if(!compare){
      throw new Error(`Invalid Password`);
    }

    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) throw new Error(`JWT_SECRET is required`);

    const token = jwt.sign({ username : user.firstName, id : user.id }, JWT_SECRET)

    if(!token){
      throw new Error(`Error generating Token`)
    }

    return ({
      success : true,
      data : {
        token,
        userId : user.id
      }
    })

  }

  async verifyEmail({ code }: { code: string }) {
    if (!code) {
      throw new Error("Verification code is required");
    }

    const user = await this.prisma.user.findFirst({
      where: {
        code: code
      }
    });

    if (!user) {
      throw new Error("Invalid verification code");
    }

    await this.prisma.user.update({
      where: {
        id: user.id
      },
      data: {
        verified: true,
        code: null
      }
    });

    return { success: true, message: "Email verified successfully" };
  }

  async requestPasswordReset({ username }: { username: string }) {
    if (!username) {
      throw new Error("Username is required");
    }

    const user = await this.prisma.user.findFirst({
      where: {
        username
      }
    });

    if (!user) {
      throw new Error("User not found");
    }

    const resetCode = generateCode();
    const resetExpiry = new Date(Date.now() + 60 * 60 * 1000); 

    await this.prisma.user.update({
      where: {
        id: user.id
      },
      data: {
        resetcode: resetCode,
        resetexp: resetExpiry
      }
    });

    await sendPasswordResetEmail({
      code: resetCode,
      to: username
    });

    return { success: true, message: "Password reset email sent" };
  }

  async resetPassword({ code, newPassword }: { code: string; newPassword: string }) {
    if (!code || !newPassword) {
      throw new Error("Reset code and new password are required");
    }

    const user = await this.prisma.user.findFirst({
      where: {
        resetcode: code
      }
    });

    if (!user) {
      throw new Error("Invalid Code");
    }

    if (!user.resetexp || user.resetexp < new Date()) {
      throw new Error("Invalid Code");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await this.prisma.user.update({
      where: {
        id: user.id
      },
      data: {
        password: hashedPassword,
        resetcode: null,
        resetexp: null
      }
    });

    return { success: true, message: "Password reset successfully" };
  }

  async resendVerificationCode({ username }: { username: string }) {
    if (!username) {
      throw new Error("Username is required");
    }

    const user = await this.prisma.user.findFirst({
      where: {
        username,
        verified: false
      }
    });

    if (!user) {
      throw new Error("User not found or already verified");
    }

    const newCode = generateCode();

    await this.prisma.user.update({
      where: {
        id: user.id
      },
      data: {
        code: newCode
      }
    });

    await sendVerificationEmail({
      code: newCode,
      to: username
    });

    return { success: true, message: "New verification code sent" };
  }

}