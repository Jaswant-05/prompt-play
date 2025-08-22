import Button from "../ui/Button";

interface User {
  userId: string;
  socketId: string;
}

interface RoomTabProps {
  users: User[];
  isQuizOwner: boolean;
  quizStatus?: string;
  onStartQuiz: () => void;
}

export default function RoomTab({ users, isQuizOwner, quizStatus, onStartQuiz }: RoomTabProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Waiting Room</h2>
      <div className="bg-gray-100 p-4 rounded-lg">
        <h3 className="font-medium mb-2">Players in room:</h3>
        <div className="space-y-2">
          {users.map(user => (
            <div key={user.socketId} className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Player {user.userId}</span>
            </div>
          ))}
        </div>
      </div>
      
      {isQuizOwner && quizStatus === "DRAFT" && (
        <Button onClick={onStartQuiz} className="w-full">
          Start Quiz
        </Button>
      )}
      
      {!isQuizOwner && (
        <p className="text-center text-gray-600">
          Waiting for the quiz owner to start the quiz...
        </p>
      )}
    </div>
  );
}