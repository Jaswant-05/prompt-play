import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Medal, Award, Crown, Star, ArrowRight, Users } from 'lucide-react';
import Button from "../ui/Button";

interface LeaderboardEntry {
  userId: string;
  score: number;
  username: string;
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
  const getRankIcon = (position: number) => {
    switch (position) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Award className="w-6 h-6 text-orange-500" />;
      default:
        return <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
          <span className="text-xs font-bold text-gray-600">{position}</span>
        </div>;
    }
  };

  const getRankStyle = (position: number) => {
    const baseClass = "relative p-4 rounded-xl border-2 transition-all duration-300 ";
    switch (position) {
      case 1:
        return baseClass + "bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-300 shadow-yellow-100 shadow-lg";
      case 2:
        return baseClass + "bg-gradient-to-r from-gray-50 to-slate-50 border-gray-300 shadow-gray-100 shadow-md";
      case 3:
        return baseClass + "bg-gradient-to-r from-orange-50 to-red-50 border-orange-300 shadow-orange-100 shadow-md";
      default:
        return baseClass + "bg-white border-gray-200 hover:border-blue-200 hover:shadow-sm";
    }
  };

  const getScoreColor = (position: number) => {
    switch (position) {
      case 1:
        return "text-yellow-700 bg-yellow-100";
      case 2:
        return "text-gray-700 bg-gray-100";
      case 3:
        return "text-orange-700 bg-orange-100";
      default:
        return "text-blue-700 bg-blue-100";
    }
  };

  const maxScore = leaderboard.length > 0 ? Math.max(...leaderboard.map(entry => entry.score)) : 0;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <div className="flex items-center justify-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
            <Trophy className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Leaderboard</h2>
        </div>
        
        <div className="flex items-center justify-center space-x-4">
          <div className="flex items-center space-x-2 text-gray-600">
            <Users className="w-4 h-4" />
            <span className="text-sm">{leaderboard.length} Players</span>
          </div>
          
          {quizEnded && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="flex items-center space-x-2 bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg"
            >
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              <span>Quiz Ended</span>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Leaderboard */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl border-2 border-gray-100 p-6 shadow-xl"
      >
        {leaderboard.length > 0 ? (
          <div className="space-y-4">
            <AnimatePresence>
              {leaderboard.map((entry, index) => {
                const position = index + 1;
                const scorePercentage = maxScore > 0 ? (entry.score / maxScore) * 100 : 0;
                
                return (
                  <motion.div
                    key={entry.userId}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={getRankStyle(position)}
                  >
                    {/* Podium effect for top 3 */}
                    {position <= 3 && (
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-50 rounded-xl"></div>
                    )}
                    
                    <div className="relative flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-3">
                          {getRankIcon(position)}
                          <div className="flex flex-col">
                            <span className="font-bold text-lg text-gray-900">
                              {entry.username}
                            </span>
                            {position === 1 && (
                              <span className="text-xs text-yellow-600 font-medium flex items-center">
                                <Star className="w-3 h-3 mr-1" />
                                Winner!
                              </span>
                            )}
                            {position <= 3 && position > 1 && (
                              <span className="text-xs text-gray-500">
                                {position === 2 ? '2nd Place' : '3rd Place'}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        {/* Score Progress Bar */}
                        <div className="hidden sm:block w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${scorePercentage}%` }}
                            transition={{ delay: 0.5 + index * 0.1, duration: 0.8 }}
                            className="h-full bg-gradient-to-r from-blue-400 to-purple-500"
                          />
                        </div>
                        
                        <div className={`px-4 py-2 rounded-full font-bold text-lg ${getScoreColor(position)}`}>
                          {entry.score} pts
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 space-y-4"
          >
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
              <Trophy className="w-8 h-8 text-gray-400" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-gray-700">No scores yet</h3>
              <p className="text-gray-500">Start answering questions to see the leaderboard!</p>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Quiz End Section */}
      <AnimatePresence>
        {quizEnded && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center space-y-6"
          >
            <div className="bg-gradient-to-r from-purple-50 to-emerald-50 border border-purple-200 rounded-2xl p-8">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ repeat: Infinity, duration: 2, repeatDelay: 3 }}
                className="w-16 h-16 bg-gradient-to-br from-purple-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <Trophy className="w-8 h-8 text-white" />
              </motion.div>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Thanks for playing!
              </h3>
              <p className="text-gray-600 mb-6">
                {leaderboard.length > 0 
                  ? `Congratulations to ${leaderboard[0]?.username} for winning with ${leaderboard[0]?.score} points!`
                  : 'Hope you enjoyed the quiz experience!'
                }
              </p>
              
              <Button 
                onClick={onReturnToDashboard} 
                size="lg"
                className="group"
              >
                Return to Dashboard
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats Summary */}
      {leaderboard.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-3 gap-4 text-center"
        >
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="text-2xl font-bold text-purple-600">{leaderboard.length}</div>
            <div className="text-sm text-gray-500">Players</div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="text-2xl font-bold text-emerald-600">{maxScore}</div>
            <div className="text-sm text-gray-500">Top Score</div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="text-2xl font-bold text-blue-600">
              {Math.round(leaderboard.reduce((sum, entry) => sum + entry.score, 0) / leaderboard.length) || 0}
            </div>
            <div className="text-sm text-gray-500">Avg Score</div>
          </div>
        </motion.div>
      )}
    </div>
  );
}