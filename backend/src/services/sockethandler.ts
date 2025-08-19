import {Socket, Server} from "socket.io"
import { ClientToServerEvents, InterServerEvents, ServerToClientEvents, SocketData } from "../types/types"
import type { PrismaClient } from "@prisma/client"

type IOServer = Server<ServerToClientEvents, ClientToServerEvents, InterServerEvents, SocketData>
type IOSocket = Socket<ServerToClientEvents, ClientToServerEvents, InterServerEvents, SocketData>

export class SocketHandler {
    constructor(private io : IOServer, private prisma : PrismaClient) {}

    register(socket : IOSocket){
        console.log(`Socket ID is ${socket.id}`)

        socket.on("joinRoom", (code : string) => {
            this.joinRoom(socket, code)
        })

    }

    joinRoom(socket : IOSocket, roomId : string){
        socket.join(roomId)
        console.log(`Socket ${socket.id} joined room ${roomId}`);
    }

    async startQuiz(socket: IOSocket, roomId: string) {
        const userId = socket.data.userId;

        const quiz = await this.prisma.quiz.findFirst({
            where: { code: roomId },
            include: {
            questions: { include: { options: true } }
            }
        });

        if (!quiz) {
            socket.emit("error", { message: "Quiz not found" });
            return;
        }

        if (Number(userId) !== quiz.userId) {
            socket.emit("error", { message: "Only the quiz owner can start" });
            return;
        }

        if (quiz.status === "ACTIVE") {
            socket.emit("error", { message: "Quiz already active" });
            return;
        }

        await this.prisma.quiz.update({
            where: { id: quiz.id },
            data: { status: "ACTIVE" }
        });

        const safeQuestion = {
            id: quiz.questions[0].id,
            title: quiz.questions[0].title,
            options: quiz.questions[0].options.map(o => ({
                id: o.id,
                title: o.title
            }))
        }

        this.io.to(roomId).emit("start", {
            question: safeQuestion,
            startTime: Date.now(),
            duration: 30000
        });
    }
 
    submitAnswer({ code, questionId} : {code: string, questionId: string}){

    }

}