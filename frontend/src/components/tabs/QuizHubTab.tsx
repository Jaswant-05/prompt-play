import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, Zap, Target, 
  Send, Loader2, Trophy, Users, X, Plus,
  ArrowRight
} from 'lucide-react';
import Button from '../ui/Button';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface QuizHubTabProps {
  onQuizCreated?: (quiz: any) => void;
}

export default function QuizHubTab({ onQuizCreated }: QuizHubTabProps) {
  const [formData, setFormData] = useState({
    title: '',
    difficulty: '',
    prompt: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdQuiz, setCreatedQuiz] = useState<any>(null);
  const [countdown, setCountdown] = useState(3);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [joinCode, setJoinCode] = useState('');
  const navigate = useNavigate();

  const difficulties = [
    { value: 'Easy', label: 'Easy', icon: BookOpen, color: 'emerald' },
    { value: 'Medium', label: 'Medium', icon: Target, color: 'amber' },
    { value: 'Hard', label: 'Hard', icon: Zap, color: 'red' }
  ];

  useEffect(() => {
    if (createdQuiz) {
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            setInterval(() => {
              navigate(`/quiz?code=${createdQuiz.code}`);
            }, 1000);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [createdQuiz, navigate]);

  const handleJoinQuiz = () => {
    if (joinCode.trim()) {
      navigate(`/quiz?code=${joinCode.trim()}`);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleDifficultySelect = (difficulty: string) => {
    setFormData(prev => ({ ...prev, difficulty }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.difficulty || !formData.prompt.trim()) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please log in to create a quiz');
        setIsLoading(false);
        return;
      }

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/quiz/`,
        { title: formData.title, difficulty: formData.difficulty, prompt: formData.prompt },
        { headers: { Authorization: `${token}`, 'Content-Type': 'application/json' } }
      );

      if (response.data.success) {
        setCreatedQuiz(response.data.data.quiz);
        onQuizCreated?.(response.data.data.quiz);
        setFormData({ title: '', difficulty: '', prompt: '' });
      } else {
        setError(response.data.message || 'Failed to create quiz');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    }

    setIsLoading(false);
  };

  const getColorClasses = (color: string) => {
    const colors = {
      emerald: { bg: 'bg-emerald-50', border: 'border-emerald-500', text: 'text-emerald-600', icon: 'bg-emerald-500' },
      amber: { bg: 'bg-amber-50', border: 'border-amber-500', text: 'text-amber-600', icon: 'bg-amber-500' },
      red: { bg: 'bg-red-50', border: 'border-red-500', text: 'text-red-600', icon: 'bg-red-500' }
    };
    return colors[color as keyof typeof colors];
  };

  return (
    <div className="h-full w-full p-4 sm:p-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 mb-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">PromptPlay</h1>
            <p className="text-gray-600 text-base sm:text-lg">Create intelligent quizzes or join existing ones</p>
          </div>
        </div>
      </motion.div>

      {/* Quick Join */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-8 sm:mb-10">
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg px-6 sm:px-8 py-5 sm:py-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
            <div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1">Have a quiz code?</h3>
              <p className="text-gray-600 text-sm sm:text-base">Join an existing quiz session instantly</p>
            </div>
            <Button onClick={() => setShowJoinModal(true)} variant="outline" size="lg" className="w-full sm:w-auto group px-6 sm:px-8">
              <Users className="w-5 h-5 mr-2" />
              Join Quiz
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </motion.div>

      {!createdQuiz ? (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="flex-1">
          <div className="bg-white border border-gray-200 rounded-lg p-6 sm:p-10">
            <div className="flex items-center space-x-4 mb-6 sm:mb-10">
              <div className="w-10 sm:w-12 h-10 sm:h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Plus className="w-5 sm:w-6 h-5 sm:h-6 text-purple-600" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">Create New Quiz</h2>
                <p className="text-gray-600 text-sm sm:text-base">Let AI generate engaging questions</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-10">
              {/* Title */}
              <div>
                <label className="block text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-4">Quiz Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g., JavaScript Fundamentals, World War II History"
                  className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-gray-50 border-2 border-gray-200 rounded-md focus:outline-none focus:border-purple-500 text-base sm:text-lg transition-all"
                  disabled={isLoading}
                />
              </div>

              {/* Difficulty */}
              <div>
                <label className="block text-base sm:text-lg font-semibold text-gray-900 mb-4">Difficulty Level</label>
                <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-3 sm:space-y-0">
                  {difficulties.map((diff) => {
                    const colors = getColorClasses(diff.color);
                    const isSelected = formData.difficulty === diff.value;
                    return (
                      <button
                        key={diff.value}
                        type="button"
                        onClick={() => handleDifficultySelect(diff.value)}
                        disabled={isLoading}
                        className={`flex items-center space-x-3 px-5 sm:px-6 py-3 rounded-md border-2 transition-all ${
                          isSelected ? `${colors.bg} ${colors.border}` : 'bg-gray-50 border-gray-200 hover:border-gray-300 hover:bg-gray-100'
                        }`}
                      >
                        <div className={`w-6 h-6 ${colors.icon} rounded-md flex items-center justify-center`}>
                          <diff.icon className="w-4 h-4 text-white" />
                        </div>
                        <span className={`font-semibold text-sm sm:text-base ${isSelected ? colors.text : 'text-gray-700'}`}>
                          {diff.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Prompt */}
              <div>
                <label className="block text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-4">Quiz Description</label>
                <textarea
                  name="prompt"
                  value={formData.prompt}
                  onChange={handleInputChange}
                  rows={6}
                  placeholder="Describe what you want your quiz to cover..."
                  className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-gray-50 border-2 border-gray-200 rounded-md focus:outline-none focus:border-purple-500 resize-none text-base sm:text-lg transition-all"
                  disabled={isLoading}
                />
                <p className="text-xs sm:text-sm text-gray-500 mt-2 sm:mt-3">💡 More specific descriptions lead to better quiz questions</p>
              </div>

              {/* Error */}
              {error && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-red-50 border border-red-200 rounded-md px-4 sm:px-6 py-3 sm:py-4">
                  <p className="text-red-700 font-medium text-sm sm:text-base">{error}</p>
                </motion.div>
              )}

              {/* Submit */}
              <div className="pt-4 sm:pt-6">
                <Button
                  type="submit"
                  disabled={isLoading || !formData.title.trim() || !formData.difficulty || !formData.prompt.trim()}
                  size="lg"
                  className="w-full h-14 sm:h-16 text-lg sm:text-xl font-semibold group"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 sm:w-6 h-5 sm:h-6 mr-2 sm:mr-3 animate-spin" />
                      Generating Your Quiz...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 sm:w-6 h-5 sm:h-6 mr-2 sm:mr-3" />
                      Create AI Quiz
                      <ArrowRight className="w-5 sm:w-6 h-5 sm:h-6 ml-2 sm:ml-3 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </motion.div>
      ) : (
        /* Success State */
        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="flex-1">
          <div className="bg-gradient-to-r from-emerald-50 to-green-50 border-l-4 border-emerald-400 p-6 sm:p-12 text-center">
            <motion.div animate={{ rotate: [0, 5, -5, 0] }} transition={{ duration: 0.6, delay: 0.2 }} className="w-20 sm:w-24 h-20 sm:h-24 bg-emerald-500 flex items-center justify-center mx-auto mb-6 sm:mb-8">
              <Trophy className="w-10 sm:w-12 h-10 sm:h-12 text-white" />
            </motion.div>
            <h2 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">Quiz Created! 🎉</h2>
            <p className="text-gray-700 text-base sm:text-xl mb-6 sm:mb-10 max-w-xl sm:max-w-2xl mx-auto">
              Your AI quiz <span className="font-semibold text-emerald-700">"{createdQuiz.topic}"</span> is ready with <span className="font-semibold">{createdQuiz.questions?.length || 0} questions</span>
            </p>
            <div className="bg-white border border-emerald-200 rounded-md p-6 sm:p-8 mb-6 sm:mb-10 max-w-sm mx-auto">
              <div className="text-sm sm:text-lg text-gray-600 mb-2 sm:mb-3">Your Quiz Code</div>
              <div className="font-mono font-bold text-2xl sm:text-4xl text-emerald-600">{createdQuiz.code}</div>
            </div>
            <div className="text-lg sm:text-xl text-gray-700">
              Starting in{" "}
              <motion.span animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 0.5, repeat: Infinity }} className="font-bold text-2xl sm:text-3xl text-emerald-600">
                {countdown}
              </motion.span>{" "}
              seconds
            </div>
          </div>
        </motion.div>
      )}

      {/* Join Modal */}
      <AnimatePresence>
        {showJoinModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur flex items-center justify-center z-50 p-4" onClick={() => setShowJoinModal(false)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} onClick={(e) => e.stopPropagation()} className="bg-white p-6 sm:p-10 w-full max-w-sm sm:max-w-lg rounded-lg">
              <div className="flex items-center justify-between mb-6 sm:mb-10">
                <div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-gray-900">Join Quiz</h3>
                  <p className="text-gray-600 mt-1 sm:mt-2 text-base sm:text-lg">Enter your 6-character code</p>
                </div>
                <button onClick={() => setShowJoinModal(false)} className="p-2 sm:p-3 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors">
                  <X className="w-5 sm:w-6 h-5 sm:h-6" />
                </button>
              </div>
              <div className="mb-6 sm:mb-10">
                <input
                  type="text"
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value)}
                  placeholder="ABC123"
                  className="w-full px-6 sm:px-8 py-4 sm:py-6 bg-gray-50 border-2 border-gray-200 rounded-md focus:outline-none focus:border-purple-500 text-center font-mono text-2xl sm:text-3xl tracking-wider font-bold transition-all"
                  maxLength={6}
                />
              </div>
              <div className="flex flex-col sm:flex-row sm:space-x-6 space-y-3 sm:space-y-0">
                <Button variant="outline" onClick={() => setShowJoinModal(false)} className="flex-1 h-12 sm:h-14 text-base sm:text-lg">
                  Cancel
                </Button>
                <Button onClick={handleJoinQuiz} disabled={!joinCode.trim() || joinCode.length !== 6} className="flex-1 h-12 sm:h-14 text-base sm:text-lg group">
                  <Users className="w-5 h-5 mr-2" />
                  Join Quiz
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
