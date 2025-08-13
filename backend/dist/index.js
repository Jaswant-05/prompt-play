"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const http_1 = require("http");
const dotenv_1 = __importDefault(require("dotenv"));
const socket_io_1 = require("socket.io");
dotenv_1.default.config();
const PORT = process.env.BACKEND_PORT;
const app = (0, express_1.default)();
const httpServer = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});
app.use(express_1.default.json());
app.use((0, cors_1.default)());
io.on("connection", (socket) => {
    socket.on("join", (data) => {
        console.log(data);
    });
});
httpServer.listen(PORT);
