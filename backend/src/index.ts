import express from "express";
import cors from "cors";
import { createServer } from "http";
import dotenv from "dotenv";
import { Server, Socket } from "socket.io";
import { Prisma, PrismaClient } from "./generated/prisma";
import {
  ClientToServerEvents, ServerToClientEvents,
  InterServerEvents, SocketData
} from "./types/types";
import { SocketHandler } from "./services/SocketHandler";

dotenv.config();

const PORT = parseInt(process.env.BACKEND_PORT || "3000", 10);
const app = express();
const prisma = new PrismaClient();
const httpServer = createServer(app);

const io: Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData> =
  new Server(httpServer, {
    cors: { origin: "*", methods: ["GET", "POST"] }
  });

app.use(express.json());
app.use(cors());

const handler = new SocketHandler(io);

io.on("connection", (socket: Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>) => {
  handler.register(socket);
});

httpServer.listen(PORT, () => console.log(`listening on ${PORT}`));
