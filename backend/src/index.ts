import express from "express";
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

dotenv.config();

const PORT = parseInt(process.env.BACKEND_PORT || "3000", 10);
const app = express();
const httpServer = createServer(app);

const io: Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData> =
  new Server(httpServer, {
    cors: { origin: "*", methods: ["GET", "POST"] }
  });

app.use(express.json());
app.use(cors());

app.use("/api/v1/auth", authRouter)

const handler = new SocketHandler(io);

io.on("connection", (socket: Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>) => {
  handler.register(socket);
});

httpServer.listen(PORT, () => console.log(`listening on ${PORT}`));
