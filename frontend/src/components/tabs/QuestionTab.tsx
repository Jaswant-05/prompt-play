import { motion, AnimatePresence } from 'framer-motion';
import { Clock, CheckCircle, XCircle, AlertCircle, Zap } from 'lucide-react';

interface Question {
  id: number;
  title: string;
  options: Array<{
    id: number;
    title: string;
  }>;
}

interface QuestionTabProps {
  question: Question;
  timeRemaining: number;
  selectedOption: number | null;
  correctOptionId: number | null;
  answerSubmitted: boolean;
  onSubmitAnswer: (optionId: number) => void;
}

export default function QuestionTab({
  question,
  timeRemaining,
  selectedOption,
  correctOptionId,
  answerSubmitted,
  onSubmitAnswer
}: QuestionTabProps) {

  const getTimeBackground = () => {
    if (timeRemaining > 15) return 'from-green-500 to-emerald-500';
    if (timeRemaining > 5) return 'from-yellow-500 to-orange-500';
    return 'from-red-500 to-pink-500';
  };

  const getOptionState = (optionId: number) => {
    if (correctOptionId !== null) {
      if (optionId === correctOptionId) return 'correct';
      if (optionId === selectedOption) return 'incorrect';
      return 'neutral';
    }
    if (selectedOption === optionId) return 'selected';
    return 'default';
  };

  const getOptionIcon = (optionId: number) => {
    const state = getOptionState(optionId);
    switch (state) {
      case 'correct':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'incorrect':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'selected':
        return <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
          <div className="w-2 h-2 bg-white rounded-full"></div>
        </div>;
      default:
        return <div className="w-5 h-5 border-2 border-gray-300 rounded-full"></div>;
    }
  };

  const getOptionClass = (optionId: number) => {
    const state = getOptionState(optionId);
    const baseClass = "w-full p-4 text-left border-2 rounded-xl transition-all duration-300 transform hover:scale-[1.02] ";
    
    switch (state) {
      case 'correct':
        return baseClass + "bg-gradient-to-r from-green-50 to-emerald-50 border-green-400 text-green-800 shadow-green-100 shadow-lg";
      case 'incorrect':
        return baseClass + "bg-gradient-to-r from-red-50 to-pink-50 border-red-400 text-red-800 shadow-red-100 shadow-lg";
      case 'selected':
        return baseClass + "bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-400 text-blue-800 shadow-blue-100 shadow-md";
      default:
        return baseClass + "bg-white border-gray-200 hover:border-blue-300 hover:bg-blue-50 hover:shadow-md text-gray-800";
    }
  };

  const optionLabels = ['A', 'B', 'C', 'D'];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header with Timer */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0"
      >
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-emerald-500 rounded-full flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Question {question.id}</h2>
        </div>
        
        <motion.div
          animate={{ scale: timeRemaining <= 5 ? [1, 1.05, 1] : 1 }}
          transition={{ repeat: timeRemaining <= 5 ? Infinity : 0, duration: 1 }}
          className={`flex items-center space-x-2 px-4 py-2 rounded-full bg-gradient-to-r ${getTimeBackground()} text-white font-bold shadow-lg`}
        >
          <Clock className="w-5 h-5" />
          <span className="text-lg">{timeRemaining}s</span>
        </motion.div>
      </motion.div>

      {/* Question Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl border-2 border-gray-100 p-8 shadow-xl"
      >
        <h3 className="text-xl font-semibold text-gray-900 mb-6 leading-relaxed">
          {question.title}
        </h3>

        <div className="space-y-4">
          <AnimatePresence>
            {question.options.map((option, index) => (
              <motion.button
                key={option.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
                whileHover={{ scale: answerSubmitted || correctOptionId !== null ? 1 : 1.02 }}
                whileTap={{ scale: answerSubmitted || correctOptionId !== null ? 1 : 0.98 }}
                onClick={() => onSubmitAnswer(option.id)}
                disabled={answerSubmitted || timeRemaining === 0 || correctOptionId !== null}
                className={getOptionClass(option.id)}
              >
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center font-bold text-gray-600">
                      {optionLabels[index]}
                    </div>
                    {getOptionIcon(option.id)}
                  </div>
                  <span className="font-medium text-left flex-1">{option.title}</span>
                </div>
              </motion.button>
            ))}
          </AnimatePresence>
        </div>

        {/* Status Messages */}
        <AnimatePresence>
          {answerSubmitted && correctOptionId === null && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-6 flex items-center justify-center space-x-2 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl"
            >
              <AlertCircle className="w-5 h-5 text-blue-600" />
              <p className="font-medium text-blue-800">
                Answer submitted! Waiting for results...
              </p>
            </motion.div>
          )}

          {correctOptionId !== null && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-6 text-center space-y-2"
            >
              {selectedOption === correctOptionId ? (
                <div className="flex items-center justify-center space-x-2 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  <span className="text-lg font-semibold text-green-800">Correct! Well done!</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2 p-4 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-xl">
                  <XCircle className="w-6 h-6 text-red-600" />
                  <span className="text-lg font-semibold text-red-800">
                    {selectedOption ? 'Incorrect answer' : 'Time\'s up!'}
                  </span>
                </div>
              )}
            </motion.div>
          )}

          {timeRemaining === 0 && correctOptionId === null && !answerSubmitted && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 flex items-center justify-center space-x-2 p-4 bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-xl"
            >
              <Clock className="w-5 h-5 text-orange-600" />
              <p className="font-medium text-orange-800">
                Time's up! Waiting for results...
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Progress Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-center text-sm text-gray-500"
      >
        Select your answer above • Time remaining: {timeRemaining} seconds
      </motion.div>
    </div>
  );
}