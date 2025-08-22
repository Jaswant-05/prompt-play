import { motion } from 'framer-motion';
import { 
  Brain, User
} from 'lucide-react';
import Button from './ui/Button';
import QuizHubTab from './tabs/QuizHubTab';

interface MainContentProps {
  activeTab: string;
}

export default function MainContent({ activeTab }: MainContentProps) {

  const getTabTitle = () => {
    switch (activeTab) {
      case 'create': return 'Quiz Hub';
      case 'past': return 'Past Quizzes';
      case 'settings': return 'Settings';
      default: return 'Dashboard';
    }
  };

  const getTabDescription = () => {
    switch (activeTab) {
      case 'create': return 'Create new AI-powered quizzes or join existing ones.';
      case 'past': return 'View and manage your previously created quizzes.';
      case 'settings': return 'Manage your account and preferences.';
      default: return 'Dashboard';
    }
  };

  if (activeTab === 'create') {
    return <QuizHubTab />;
  }

  return (
    <div className="p-8">
      {/* Header */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex items-center justify-between mb-12"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">
            {getTabTitle()}
          </h1>
          <p className="text-gray-600">
            {getTabDescription()}
          </p>
        </div>
      </motion.div>

      {/* Tab Content */}
      {activeTab === 'past' && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center py-20"
        >
          <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-emerald-100 rounded-lg flex items-center justify-center mx-auto mb-8">
            <Brain className="w-10 h-10 text-purple-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Past Quizzes</h2>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            View and manage all your previously created quizzes. Track performance and reuse your favorite content.
          </p>
          <Button size="lg">
            <Brain className="w-5 h-5 mr-2" />
            Coming Soon
          </Button>
        </motion.div>
      )}

      {activeTab === 'settings' && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center py-20"
        >
          <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-emerald-100 rounded-lg flex items-center justify-center mx-auto mb-8">
            <User className="w-10 h-10 text-purple-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Settings</h2>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Manage your account settings, preferences, and profile information.
          </p>
          <Button size="lg">
            <User className="w-5 h-5 mr-2" />
            Coming Soon
          </Button>
        </motion.div>
      )}
    </div>
  );
}