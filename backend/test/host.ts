import { io } from "socket.io-client";
const URL = "http://localhost:3000";
const CODE = "ABC123"; // from seed

const host = io(URL, { auth: { userId: 1 }, transports: ["websocket"] });

host.on("connect", () => {
  console.log("HOST connected", host.id);
  host.emit("joinRoom", CODE);
});
host.on("joinedRoom", (p:any) => {
  console.log("HOST joinedRoom", p);
  setTimeout(() => {
    host.emit("start_quiz", "ABC123");
  }, 10000);
});
host.on("question", (p:any) => console.log("HOST question:", p.question.title));
host.on("reveal", (p:any) => console.log("HOST reveal:", p));
host.on("leaderboard", (p:any) => console.log("HOST leaderboard:", p));
host.on("quizEnded", () => console.log("HOST quizEnded"));
host.on("error", (e:any) => console.error("HOST error:", e.message));
