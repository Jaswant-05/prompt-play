import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, Mail, User as UserIcon, Lock, ArrowLeft, Sparkles } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import axios from "axios"
import { useNavigate } from 'react-router-dom';
import type { User } from "@jaswant5ingh/prompt-play-zod"

type formError = {
  message? : string
}

export default function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<User>({
    firstName: '',
    lastName: '',
    username: '',
    password: ''
  });
  const[error, setError] = useState<formError>({})
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError({})
    setIsLoading(true);

    try { 
      const result = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/auth/signup`,
        {
          username: formData.username,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!result.data.success) {
        setError({ message: result.data.message });
      } else {
        console.log("User created:", result.data.user);
        navigate('/signin')
      }
    } catch (err: any) {
      if (err.response?.data?.message) {
        setError({ message: err.response.data.message });
      } else {
        setError({ message: "Something went wrong. Please try again." });
      }
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <Link to="/" className="inline-flex items-center space-x-2 text-gray-500 hover:text-gray-700 transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to home</span>
          </Link>
          
          <div className="flex items-center justify-center space-x-2 mb-6">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-emerald-600 rounded-md flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-semibold bg-gradient-to-r from-purple-600 to-emerald-600 bg-clip-text text-transparent">
              PromptPlay
            </span>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create your account</h1>
          <p className="text-gray-600">Start creating amazing quizzes with AI</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="First Name"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  icon={<UserIcon className="w-5 h-5" />}
                  required
                />
                
                <Input
                  label="Last Name"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  icon={<UserIcon className="w-5 h-5" />}
                  required
                />
              </div>

              <Input
                label="Email"
                type="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                icon={<Mail className="w-5 h-5" />}
                required
              />

              <div className="relative">
                <Input
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  icon={<Lock className="w-5 h-5" />}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-8 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full"
                size="lg"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Creating account...
                  </>
                ) : (
                  'Create Account'
                )}
              </Button>
            </form>
            {error.message && (
              <div className="mt-4 text-red-600 text-sm text-center">
                {error.message}
              </div>
            )}

            <div className="mt-8 text-center">
              <p className="text-gray-600">
                Already have an account?{' '}
                <Link to="/signin" className="text-purple-600 font-medium hover:underline">
                  Sign in
                </Link>
              </p>
            </div>
          </Card>

          <div className="mt-6 text-center text-sm text-gray-500">
            By creating an account, you agree to our{' '}
            <a href="/terms" className="hover:text-gray-700 transition-colors underline">Terms of Service</a>
            {' '}and{' '}
            <a href="/privacy" className="hover:text-gray-700 transition-colors underline">Privacy Policy</a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}