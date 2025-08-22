  import express, { NextFunction } from "express";
  import cors from "cors";
  import { createServer } from "http";
  import dotenv from "dotenv";
  import { Server, Socket } from "socket.io";
  import {
    ClientToServerEvents, ServerToClientEvents,
    InterServerEvents, SocketData
  } from "./types/types";
  import { SocketHandler } from "./services/SocketHandler";
  import authRouter from "./routes/authRoutes";
  import quizRouter from "./routes/quizRoutes";
  import { wsMiddleware } from "./middleware/authMiddleware";
  import { prisma } from "./lib/db";

  dotenv.config();

  const PORT = parseInt(process.env.BACKEND_PORT || "3000", 10);
  const app = express();
  const httpServer = createServer(app);

  const io: Server< ServerToClientEvents, ClientToServerEvents, InterServerEvents, SocketData> =
    new Server(httpServer, {
      cors: { origin: "*", methods: ["GET", "POST"] }
    });

  app.use(express.json());
  app.use(cors());
  app.use("/api/v1/auth", authRouter);
  app.use("/api/v1/quiz", quizRouter)

  const handler = new SocketHandler(io, prisma);

  io.use(wsMiddleware);

  // io.use((socket, next) => {
  //   const userId = socket.handshake.auth?.userId;
  //   if (!userId) return next(new Error("Missing userId"));
  //   socket.data.userId = userId;
  //   next();
  // });

  io.on("connection", (socket: Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>) => {
    handler.register(socket);
  });

  httpServer.listen(PORT, () => console.log(`listening on ${PORT}`));
