import { useState } from 'react';
import Sidebar from '../components/layout/Layout';
import MainContent from '../components/MainContent';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('create');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar 
        activeTab={activeTab} 
        onTabChange={setActiveTab}
        collapsed={sidebarCollapsed}
        onToggleCollapse={setSidebarCollapsed}
      />
      
      <div
        className="transition-all duration-300 ease-in-out"
        style={{ marginLeft: sidebarCollapsed ? 80 : 280 }}
      >
        <MainContent activeTab={activeTab} />
      </div>
    </div>
  );
}