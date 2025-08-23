import { motion, AnimatePresence } from 'framer-motion';
import { Users, Crown, Clock, Play } from 'lucide-react';
import Button from "../ui/Button";

interface User {
  userId: string;
  socketId: string;
  username: string;
}

interface RoomTabProps {
  users: User[];
  isQuizOwner: boolean;
  quizStatus?: string;
  onStartQuiz: () => void;
}

export default function RoomTab({ users, isQuizOwner, quizStatus, onStartQuiz }: RoomTabProps) {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-2"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-100 to-emerald-100 rounded-full mb-4">
          <Users className="w-8 h-8 text-purple-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900">Waiting Room</h2>
        <p className="text-gray-600">
          {users.length} {users.length === 1 ? 'player' : 'players'} ready to play
        </p>
      </motion.div>

      {/* Players List */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm"
      >
        <div className="flex items-center space-x-2 mb-4">
          <Users className="w-5 h-5 text-gray-500" />
          <h3 className="font-semibold text-gray-900">Players in Room</h3>
        </div>
        
        <div className="space-y-3">
          <AnimatePresence>
            {users.map((user, index) => (
              <motion.div
                key={user.socketId}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-emerald-400 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">
                        {user.userId}
                      </span>
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                  </div>
                  <div>
                    <span className="font-medium text-gray-900">{user.username}</span>
                    <div className="flex items-center space-x-1 text-xs text-green-600">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                      <span>Online</span>
                    </div>
                  </div>
                </div>
                
                {index === 0 && isQuizOwner && (
                  <div className="flex items-center space-x-1 text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">
                    <Crown className="w-3 h-3" />
                    <span>Host</span>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Action Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-center space-y-4"
      >
        {isQuizOwner && quizStatus === "DRAFT" ? (
          <div className="space-y-3">
            <Button 
              onClick={onStartQuiz} 
              size="lg"
              className="w-full max-w-sm mx-auto group"
            >
              <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
              Start Quiz
            </Button>
            <p className="text-sm text-gray-500">
              All players are ready. Click to begin the quiz!
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-center space-x-2 text-gray-500">
              <Clock className="w-5 h-5 animate-pulse" />
              <span className="font-medium">Waiting for host...</span>
            </div>
            <p className="text-sm text-gray-500 max-w-sm mx-auto">
              The quiz owner will start the game when everyone is ready
            </p>
          </div>
        )}
      </motion.div>

      {/* Room Info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="bg-gradient-to-r from-purple-50 to-emerald-50 border border-purple-100 rounded-xl p-4"
      >
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Share this room with friends to invite them to play
          </p>
          <div className="mt-2 inline-flex items-center space-x-2 bg-white px-3 py-1 rounded-full text-sm font-mono text-gray-700">
            <span>Room ID: </span>
            <span className="font-semibold text-purple-600">#{}</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}