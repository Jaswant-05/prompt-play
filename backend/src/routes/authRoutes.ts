import express, { Request, Response } from "express";
import { AuthHandler } from "../services/AuthHandler";
import { prisma } from "../lib/db";

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
      token : result.data.token
    })

  }catch(err : any){
    if (err.message.includes("Invalid Input")) {
      return res.status(400).json({ success: false, message: "Invalid username or password" });
    }
    if (err.message.includes("User not found")) {
      return res.status(404).json({ success: false, message: "User doesnot exist" });
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

// authRouter.put("/change-password", async(req: Request, res: Response) => {

// })

export default authRouter;