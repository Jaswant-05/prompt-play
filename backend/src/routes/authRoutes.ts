import express, { Request, Response } from "express";
import { AuthHandler } from "../services/AuthHandler";
import { prisma } from "../lib/db";
import z from "zod";

const passwordSchema = z.object({
  password1: z.string()
    .min(8)
    .regex(/[a-z]/, { message: "Add a lowercase letter" })
    .regex(/[A-Z]/, { message: "Add an uppercase letter" })
    .regex(/\d/, { message: "Add a number" })
    .regex(/[^A-Za-z0-9]/, { message: "Add a symbol" }),
  password2: z.string()
    .min(8)
    .regex(/[a-z]/, { message: "Add a lowercase letter" })
    .regex(/[A-Z]/, { message: "Add an uppercase letter" })
    .regex(/\d/, { message: "Add a number" })
    .regex(/[^A-Za-z0-9]/, { message: "Add a symbol" }),
  code: z.string().min(1, { message: "Reset code is required" })
}).refine((data) => data.password1 === data.password2, {
  message: "Passwords don't match",
  path: ["password2"], 
});

const authRouter = express.Router();
const authHandler = new AuthHandler(prisma);

authRouter.post('/signin', async (req: Request, res: Response) => {
  try{
    const { 
      username, 
      password 
    } = req.body;

    const result = await authHandler.signIn({username, password});

    if(!result.success){
      return res.status(400).json({
        success: false,
        message: "Sign-in failed",
      });
    }

    res.status(200).json({
      success : true,
      token : result.data.token,
      userId : result.data.userId
    })

  }catch(err : any){
    if (err.message.includes("Invalid Input")) {
      return res.status(400).json({ success: false, message: "Invalid username or password" });
    }
    if (err.message.includes("User not found")) {
      return res.status(404).json({ success: false, message: "User doesnot exist" });
    }
    if (err.message.includes("Email not verified")) {
      return res.status(403).json({ success: false, message: "Please verify your email before signing in" });
    }
    if (err.message.includes("Invalid Password")) {
      return res.status(401).json({ success: false, message: "Invalid username or password" });
    }
    if (err.message.includes("JWT_SECRET")) {
      return res.status(500).json({ success: false, message: "Server misconfiguration" });
    }
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}) 


authRouter.post('/signup', async (req: Request, res: Response) => {
  try{
    const {
      username,
      password,
      firstName,
      lastName
    } = req.body

    const result = await authHandler.signup({username, password, firstName, lastName});

    if(!result.success){
      return res.status(400).json({
        success: false,
        message: "Sign-up failed",
      });
    }

    res.status(200).json({
      success : true,
      user : result.user
    })
    
  }catch(err: any){
    if (err.message.includes("Invalid Input")) {
      return res.status(400).json({ success: false, message: "Invalid username or password" });
    }
    if (err.message.includes("User Already Exists")) {
      return res.status(409).json({ success: false, message: "Account Already Exists" });
    }
    if (err.message.includes("Invalid Password")) {
      return res.status(401).json({ success: false, message: "Invalid username or password" });
    }

    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
})

authRouter.put("/reset-password", async(req: Request, res: Response) => {
  const payload = passwordSchema.safeParse(req.body);
  
  if (!payload.success) {
    return res.status(400).json({
      success: false, 
      message: "Invalid input",
      errors: payload.error.errors
    });
  }

  try {
    const { password1, code } = payload.data;
    
    const result = await authHandler.resetPassword({
      code,
      newPassword: password1
    });
    
    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: "Password reset failed"
      });
    }
    
    res.status(200).json({
      success: true,
      message: "Password reset successfully"
    });
    
  } catch(err: any) {
    if (err.message.includes("Invalid Code")) {
      return res.status(400).json({ success: false, message: "Invalid or expired reset code" });
    }
    if (err.message.includes("User not found")) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

authRouter.post('/verify-email', async (req: Request, res: Response) => {
  try {
    const { code } = req.body;
    
    if (!code) {
      return res.status(400).json({
        success: false,
        message: "Verification code is required"
      });
    }

    const result = await authHandler.verifyEmail({ code });
    
    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: "Email verification failed"
      });
    }

    res.status(200).json({
      success: true,
      message: "Email verified successfully"
    });

  } catch (err: any) {
    if (err.message.includes("Invalid verification code")) {
      return res.status(400).json({ success: false, message: "Invalid verification code" });
    }
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

authRouter.post('/request-reset', async (req: Request, res: Response) => {
  try {
    const { username } = req.body;
    
    if (!username) {
      return res.status(400).json({
        success: false,
        message: "Email is required"
      });
    }

    const result = await authHandler.requestPasswordReset({ username });
    
    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: "Password reset request failed"
      });
    }

    res.status(200).json({
      success: true,
      message: "Password reset email sent"
    });

  } catch (err: any) {
    if (err.message.includes("User not found")) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

authRouter.post('/resend-verification', async (req: Request, res: Response) => {
  try {
    const { username } = req.body;
    
    if (!username) {
      return res.status(400).json({
        success: false,
        message: "Email is required"
      });
    }

    const result = await authHandler.resendVerificationCode({ username });
    
    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: "Failed to resend verification code"
      });
    }

    res.status(200).json({
      success: true,
      message: "Verification code sent"
    });

  } catch (err: any) {
    if (err.message.includes("User not found or already verified")) {
      return res.status(400).json({ success: false, message: "User not found or already verified" });
    }
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

export default authRouter;