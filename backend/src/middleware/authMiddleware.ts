import jwt from "jsonwebtoken"
import { NextFunction, Request, Response } from "express"
import { ExtendedError, Socket } from "socket.io";

export const authMiddleware = async(req : Request, res : Response, next : NextFunction) => {
  const authorization = req.headers.authorization;
  if(!authorization || !authorization.startsWith(`Bearer`)){
    return res.status(403).json({
      message : "Not Authorized"
    })
  }
  console.log(authorization)
  const authPayload = authorization.split(" ");
  const token = authPayload[1];
  console.log(token)

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

export const wsMiddleware = (
  socket: Socket,
  next: (err?: ExtendedError) => void
): void => {
  console.log('Socket middleware - auth:', socket.handshake.auth)
  const token = socket.handshake.auth?.token;
  if (!token) {
    return next(new Error("Not Authorized"));
  }

  const JWT_SECRET = process.env.JWT_SECRET;
  if (!JWT_SECRET) {
    return next(new Error("Server Misconfigured"));
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string, username: string };

    if (!decoded?.id || !decoded.username) {
      return next(new Error("Invalid Token"));
    }

    console.log('Socket authenticated for userId:', decoded.username);

    socket.data.userId = decoded.id;
    socket.data.username = decoded.username
    next();
  } catch (err) {
    return next(new Error("Invalid Token"));
  }
};