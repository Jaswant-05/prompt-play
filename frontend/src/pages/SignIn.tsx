import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, ArrowLeft, Sparkles } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import axios from "axios"
import type { User } from "@jaswant5ingh/prompt-play-zod"
import { useNavigate } from 'react-router-dom';

type formError = {
  message? : string
}

type message = {
  message? : string
}

export default function SignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<User>({
    username: '',
    password: ''
  });
  const [error, setError] = useState<formError>({})
  const [message, setMessage] = useState<message>({});
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
    
    try{
      const result = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/auth/signin`,{
        username : formData.username,
        password : formData.password
      },{
        headers : {
          "Content-Type" : "application/json"
        }
      })

      if (!result.data.success) {
        setError({ message: result.data.message });
      } else {
        localStorage.setItem('token', `Bearer ${result.data.token}`)
        localStorage.setItem('userId', result.data.userId)
        navigate("/dashboard")
      }

    } catch(err: any){
      if (err.response?.data?.message) {
        setError({ message: err.response.data.message });
      } else {
        setError({ message: "Something went wrong. Please try again." });
      }
    }
  
    setIsLoading(false);
  };

  const handleForgotPassword = async () => {
    setMessage({})
    if (!formData.username.trim()) {
      setMessage({ message: "Please enter your email address first" });
      return;
    }

    try {
      setIsLoading(true);
      
      const result = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/auth/request-reset`, {
        username: formData.username
      }, {
        headers: {
          "Content-Type": "application/json"
        }
      });

      if (result.data.success) {
        setMessage({ message: "Password reset email sent! Check your inbox." });
      } else {
        setError({ message: result.data.message });
      }
    } catch (err: any) {
      if (err.response?.data?.message) {
        setError({ message: err.response.data.message });
      } else {
        setError({ message: "Something went wrong. Please try again." });
      }
    } finally {
      setIsLoading(false);
    }
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
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back</h1>
          <p className="text-gray-600">Sign in to continue your quiz journey</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
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

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-sm text-gray-600 hover:text-purple-600 transition-colors underline"
                >
                  Forgot your password?
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
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>
            {error.message && (
              <div className="mt-4 text-red-600 text-sm text-center">
                {error.message}
              </div>
            )}
            {message.message && (
              <div className="mt-4 text-sm text-center">
                {message.message}
              </div>
            )}
            <div className="mt-8 text-center">
              <p className="text-gray-600">
                Don't have an account?{' '}
                <Link to="/signup" className="text-purple-600 font-medium hover:underline">
                  Sign up
                </Link>
              </p>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}