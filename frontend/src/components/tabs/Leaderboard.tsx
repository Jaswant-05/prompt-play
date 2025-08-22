import Button from "../ui/Button";

interface LeaderboardEntry {
  userId: string;
  score: number;
}

interface LeaderboardTabProps {
  leaderboard: LeaderboardEntry[];
  quizEnded: boolean;
  onReturnToDashboard: () => void;
}

export default function LeaderboardTab({
  leaderboard,
  quizEnded,
  onReturnToDashboard
}: LeaderboardTabProps) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Leaderboard</h2>
        {quizEnded && (
          <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
            Quiz Ended
          </span>
        )}
      </div>
      
      <div className="bg-white rounded-lg border">
        {leaderboard.length > 0 ? (
          <div className="divide-y">
            {leaderboard.map((entry, index) => (
              <div key={entry.userId} className="p-4 flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <span className="font-bold text-lg text-gray-600">#{index + 1}</span>
                  <span className="font-medium">Player {entry.userId}</span>
                </div>
                <span className="font-bold text-blue-600">{entry.score} pts</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-gray-500">
            No scores yet. Start answering questions!
          </div>
        )}
      </div>
      
      {quizEnded && (
        <div className="text-center space-y-4">
          <h3 className="text-lg font-semibold">Thanks for playing!</h3>
          <Button onClick={onReturnToDashboard}>
            Return to Dashboard
          </Button>
        </div>
      )}
    </div>
  );
}