import { useState, useEffect, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { io, Socket } from "socket.io-client";
import Button from "../components/ui/Button";
import RoomTab from "../components/tabs/RoomTab";
import QuestionTab from "../components/tabs/QuestionTab";
import LeaderboardTab from "../components/tabs/Leaderboard";

export type tab = "room" | "question" | "leaderboard";

interface User {
  userId: string;
  socketId: string;
}

interface Question {
  id: number;
  title: string;
  options: Array<{
    id: number;
    title: string;
  }>;
}

interface QuestionEvent {
  question: Question;
  startTime: number;
  duration: number;
}

interface LeaderboardEntry {
  userId: string;
  score: number;
}

interface JoinedRoomEvent {
  roomId: string;
  quizId: number;
  topic: string;
  status: string;
  playersCount: number;
  ownerId: number;
}

export default function Quiz() {
  const [searchParams] = useSearchParams();
  const code = searchParams.get("code");
  const [activeTab, setActiveTab] = useState<tab>("room");
  const [socket, setSocket] = useState<Socket | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [quizInfo, setQuizInfo] = useState<{
    topic: string;
    status: string;
    playersCount: number;
    quizId: number;
  } | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isQuizOwner, setIsQuizOwner] = useState(false); //Todo get the owner logic fixed
  const [quizEnded, setQuizEnded] = useState(false);
  const [correctOptionId, setCorrectOptionId] = useState<number | null>(null);
  const [answerSubmitted, setAnswerSubmitted] = useState(false);
  
  const navigate = useNavigate();
  const timerRef = useRef<number | null>(null);
  const auth = localStorage.getItem('token');

  if(!auth){
    navigate('/')
  }
  const token = auth?.split(" ")[1] 

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      navigate("/login");
      return;
    }

    if (!code) return;
    const newSocket = io("http://localhost:3000", {
      auth: {
        token
      }
    });

    setSocket(newSocket);
    console.log(newSocket);
    newSocket.emit("joinRoom", code);

    newSocket.on("joinedRoom", (data: JoinedRoomEvent) => {
      console.log("Join room")
      setQuizInfo({
        topic: data.topic,
        status: data.status,
        playersCount: data.playersCount,
        quizId: data.quizId
      });

      console.log(userId)
      console.log(data.ownerId)
      const currentUserId = Number(localStorage.getItem("userId"));
      setIsQuizOwner(currentUserId === data.ownerId);
    });

    newSocket.on("playerJoined", (data: { userId: string; socketId: string }) => {
      console.log("player Joined")
      setUsers(prev => [...prev, data]);
      setQuizInfo(prev => prev ? { ...prev, playersCount: prev.playersCount + 1 } : null);
    });

    newSocket.on("question", (data: QuestionEvent) => {
      setCurrentQuestion(data.question);
      setActiveTab("question");
      setSelectedOption(null);
      setCorrectOptionId(null);
      setAnswerSubmitted(false);
      
      const endTime = data.startTime + data.duration;
      const updateTimer = () => {
        const now = Date.now();
        const remaining = Math.max(0, Math.ceil((endTime - now) / 1000));
        setTimeRemaining(remaining);
        
        if (remaining > 0) {
          timerRef.current = setTimeout(updateTimer, 1000);
        }
      };
      updateTimer();
    });

    newSocket.on("reveal", (data: { questionId: number; correctOptionId: number }) => {
      setCorrectOptionId(data.correctOptionId);
    });

    newSocket.on("leaderboard", (data: { leaderboard: LeaderboardEntry[] }) => {
      setLeaderboard(data.leaderboard);
      setActiveTab("leaderboard");
    });

    newSocket.on("answer_received", (_data: { questionId: number; optionId: number }) => {
      setAnswerSubmitted(true);
    });

    newSocket.on("quizEnded", () => {
      setQuizEnded(true);
      setActiveTab("leaderboard");
    });

    newSocket.on("error", (error: { message: string }) => {
      console.error(error.message)
    });

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      newSocket.disconnect();
    };
  }, [code]);

  const startQuiz = () => {
    if (socket && code) {
      socket.emit("start_quiz", code);
    }
  };

  const submitAnswer = (optionId: number) => {
    if (socket && code && currentQuestion && !answerSubmitted && timeRemaining > 0) {
      setSelectedOption(optionId);
      socket.emit("submit_answer", {
        code,
        questionId: currentQuestion.id,
        optionId
      });
    }
  };

  if (!code) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold mb-4">Invalid Quiz Code</h1>
        <Button variant="outline" onClick={() => navigate("/dashboard")}>
          Return to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Quiz: {quizInfo?.topic || "Loading..."}</h1>
        <p className="text-gray-600">Code: {code} | Players: {quizInfo?.playersCount || 0}</p>
      </div>

      {activeTab === "room" && (
        <RoomTab
          users={users}
          isQuizOwner={isQuizOwner}
          quizStatus={quizInfo?.status}
          onStartQuiz={startQuiz}
        />
      )}

      {activeTab === "question" && currentQuestion && (
        <QuestionTab
          question={currentQuestion}
          timeRemaining={timeRemaining}
          selectedOption={selectedOption}
          correctOptionId={correctOptionId}
          answerSubmitted={answerSubmitted}
          onSubmitAnswer={submitAnswer}
        />
      )}

      {activeTab === "leaderboard" && (
        <LeaderboardTab
          leaderboard={leaderboard}
          quizEnded={quizEnded}
          onReturnToDashboard={() => navigate("/dashboard")}
        />
      )}
    </div>
  );
}