import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, BookOpen, Zap, Target, 
  Send, Loader2, Trophy, Users, X
} from 'lucide-react';
import Button from '../ui/Button';
import Card from '../ui/Card';
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
    {
      value: 'Easy',
      label: 'Easy',
      description: 'Perfect for beginners and casual learning',
      icon: BookOpen,
      color: 'from-emerald-500 to-emerald-600'
    },
    {
      value: 'Medium',
      label: 'Medium',
      description: 'Balanced challenge for most learners',
      icon: Target,
      color: 'from-yellow-500 to-yellow-600'
    },
    {
      value: 'Hard',
      label: 'Hard',
      description: 'Advanced concepts and challenging questions',
      icon: Zap,
      color: 'from-red-500 to-red-600'
    }
  ];


  useEffect(() => {
    console.log("reached here")
    if (createdQuiz) {
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            navigate(`/quiz?code=${createdQuiz.code}`);
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
    setFormData(prev => ({
      ...prev,
      difficulty
    }));
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
        {
          title: formData.title,
          difficulty: formData.difficulty,
          prompt: formData.prompt
        },
        {
          headers: {
            'Authorization': `${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        console.log(response.data);
        setCreatedQuiz(response.data.data.quiz);
        onQuizCreated?.(response.data.data.quiz);
        setFormData({ title: '', difficulty: '', prompt: '' });
      } else {
        setError(response.data.message || 'Failed to create quiz');
      }
    } catch (err: any) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Something went wrong. Please try again.');
      }
    }

    setIsLoading(false);
  };

  // const getDifficultyIcon = (difficulty: string) => {
  //   const difficultyData = difficulties.find(d => d.value === difficulty);
  //   return difficultyData?.icon || Brain;
  // };

  // const getDifficultyColor = (difficulty: string) => {
  //   const difficultyData = difficulties.find(d => d.value === difficulty);
  //   return difficultyData?.color || 'from-gray-500 to-gray-600';
  // };

  return (
    <div className="max-w-4xl mx-auto p-8">
      {/* Header */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center mb-12"
      >
        <div className="flex items-center justify-center space-x-2 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-emerald-600 rounded-xl flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Quiz Hub</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Create new AI-powered quizzes or join existing ones with a quiz code.
        </p>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="flex items-center justify-center space-x-4 mb-12"
      >
        <Button
          onClick={() => setShowJoinModal(true)}
          variant="outline"
          size="lg"
        >
          <Users className="w-5 h-5 mr-2" />
          Join Quiz
        </Button>
        <div className="text-gray-400">or</div>
        <div className="text-purple-600 font-medium">Create a new quiz below</div>
      </motion.div>

      {!createdQuiz ? (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Create New Quiz</h2>
              <p className="text-gray-600">Let AI generate engaging questions for your topic</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Quiz Title */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Quiz Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g., World History, JavaScript Basics, Science Trivia..."
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-lg"
                  disabled={isLoading}
                />
              </div>

              {/* Difficulty Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-4">
                  Difficulty Level
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {difficulties.map((diff) => (
                    <button
                      key={diff.value}
                      type="button"
                      onClick={() => handleDifficultySelect(diff.value)}
                      disabled={isLoading}
                      className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                        formData.difficulty === diff.value
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center space-x-3 mb-2">
                        <div className={`w-8 h-8 bg-gradient-to-r ${diff.color} rounded-lg flex items-center justify-center`}>
                          <diff.icon className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-semibold text-gray-900">{diff.label}</span>
                      </div>
                      <p className="text-sm text-gray-600">{diff.description}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Prompt */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Quiz Description & Prompt
                </label>
                <textarea
                  name="prompt"
                  value={formData.prompt}
                  onChange={handleInputChange}
                  placeholder="Describe what you want your quiz to cover. Be specific about topics, themes, or learning objectives. For example: 'Create questions about European history from 1800-1900, focusing on major wars and political changes.'"
                  rows={5}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 resize-none"
                  disabled={isLoading}
                />
                <p className="text-xs text-gray-500 mt-2">
                  Tip: The more specific you are, the better questions our AI will generate.
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-50 border border-red-200 rounded-lg p-4"
                >
                  <p className="text-red-600 text-sm font-medium">{error}</p>
                </motion.div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading || !formData.title.trim() || !formData.difficulty || !formData.prompt.trim()}
                size="lg"
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Generating Quiz...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    Generate Quiz
                  </>
                )}
              </Button>
            </form>
          </Card>
        </motion.div>
      ) : (
        /* Success State */
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <Card className="p-8">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Trophy className="w-8 h-8 text-white" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Quiz Created Successfully!</h2>
            <p className="text-gray-600 mb-6">
              Your AI-powered quiz "{createdQuiz.topic}" has been generated with {createdQuiz.questions?.length || 0} questions.
            </p>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Quiz Code:</span>
                <span className="font-mono font-bold text-lg text-purple-600">{createdQuiz.code}</span>
              </div>
            </div>
            
            <div className="text-center">
              <p className="text-gray-600 mb-4">
                Redirecting to your quiz in <span className="font-bold text-purple-600">{countdown}</span> seconds...
              </p>
              <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Join Quiz Modal */}
      <AnimatePresence>
        {showJoinModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowJoinModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-xl p-8 max-w-md w-full"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Join Quiz</h3>
                <button
                  onClick={() => setShowJoinModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Enter Quiz Code
                </label>
                <input
                  type="text"
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value)}
                  placeholder="ABC123"
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-center text-lg font-mono tracking-wider"
                  maxLength={6}
                />
                <p className="text-xs text-gray-500 mt-2 text-center">
                  Quiz codes are 6 characters long
                </p>
              </div>
              
              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setShowJoinModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleJoinQuiz}
                  disabled={!joinCode.trim() || joinCode.length !== 6}
                  className="flex-1"
                >
                  <Users className="w-4 h-4 mr-2" />
                  Join Quiz
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}