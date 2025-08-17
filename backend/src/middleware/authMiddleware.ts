import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import { NextFunction, Request, Response } from "express"

export const authMiddleware = async(req : Request, res : Response, next : NextFunction) => {
  const authorization = req.headers.authorization;
  if(!authorization || !authorization.startsWith(`Bearer`)){
    return res.status(403).json({
      message : "Not Authorized"
    })
  }
  
  const authPayload = authorization.split(" ");
  const token = authPayload[1];

  if(!token){
    return res.status(403).json({
      message : "Not Authorized"
    })
  }

  const JWT_SECRET = process.env.JWT_SECRET
  if(!JWT_SECRET){
    return res.status(403).json({
      message: "Inavlid Token"
    })
  }

  const decoded = jwt.verify(token, JWT_SECRET)
    
    if (typeof decoded === 'string' || !decoded.id) {
      return res.status(403).json({
        message: "Invalid Token"
      });
    }

  req.userId = decoded.id
  
  next();
}