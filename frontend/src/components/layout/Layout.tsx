import { motion, AnimatePresence } from 'framer-motion';
import { 
  LogOut, ChevronRight, X,
  Plus, History, Cog
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  collapsed: boolean;
  onToggleCollapse: (collapsed: boolean) => void;
}

export default function Sidebar({ activeTab, onTabChange, collapsed, onToggleCollapse }: SidebarProps) {

  const navigationItems = [
    { id: 'create', label: 'Create Quiz', icon: Plus },
    { id: 'past', label: 'Past Quizzes', icon: History },
    { id: 'settings', label: 'Settings', icon: Cog }
  ];
  const navigate = useNavigate();

  return (
    <motion.div
      animate={{ width: collapsed ? 80 : 280 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="fixed left-0 top-0 h-full bg-white border-r border-gray-200 z-40"
    >
      <div className="p-6">
        {/* Sidebar Toggle Button */}
        <div className={`flex ${collapsed ? 'justify-center' : 'justify-end'} mb-8`}>
          <button
            onClick={() => onToggleCollapse(!collapsed)}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-all duration-200"
          >
            {collapsed ? (
              <ChevronRight className="w-5 h-5" />
            ) : (
              <X className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="space-y-2">
          {navigationItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center ${collapsed ? 'justify-center' : 'space-x-3'} px-3 py-2 rounded-md transition-all duration-200 ${
                activeTab === item.id 
                  ? 'bg-purple-600 text-white' 
                  : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
              }`}
              title={collapsed ? item.label : undefined}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="font-medium"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          ))}
        </nav>
      </div>

      {/* Sidebar Footer */}
      <div className="absolute bottom-6 left-6 right-6 space-y-2">
        <button 
          className={`w-full flex items-center ${collapsed ? 'justify-center' : 'space-x-3'} px-3 py-2 text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-md transition-all duration-200`}
          title={collapsed ? 'Sign Out' : undefined}
          onClick={() => {
            localStorage.removeItem("token"),
            localStorage.removeItem("userId")
            navigate("/")
          }}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="font-medium"
              >
                Sign Out
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </motion.div>
  );
}