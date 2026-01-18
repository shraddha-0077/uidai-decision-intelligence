
import React from 'react';
import { User, UserRole } from '../types';

interface LayoutProps {
  user: User;
  onLogout: () => void;
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ user, onLogout, children, activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'dashboard', label: 'Overview', icon: '📊' },
    { id: 'insights', label: 'Decision Signals', icon: '💡' },
    { id: 'upload', label: 'Data Ingestion', icon: '📥' },
    { id: 'compliance', label: 'Compliance & Ethics', icon: '🛡️' },
  ];

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col shadow-xl">
        <div className="p-6 border-b border-slate-700">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-orange-500 rounded-md flex items-center justify-center font-bold text-xs">UA</div>
            <h1 className="font-bold text-lg tracking-tight">UIDAI DI</h1>
          </div>
          <p className="text-[10px] text-slate-400 uppercase font-semibold tracking-wider">Decision Intelligence</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all ${
                activeTab === tab.id 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <span>{tab.icon}</span>
              <span className="font-medium">{tab.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-700 bg-slate-950/50">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-slate-600 flex items-center justify-center text-xs font-bold">
              {user.name.charAt(0)}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-semibold truncate">{user.name}</p>
              <p className="text-[10px] text-slate-500 uppercase">{user.role}</p>
            </div>
          </div>
          <button 
            onClick={onLogout}
            className="w-full py-2 text-xs font-medium text-slate-400 hover:text-red-400 transition-colors flex items-center justify-center gap-2 border border-slate-700 rounded-md"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <header className="sticky top-0 z-10 bg-white border-b border-slate-200 px-8 py-4 flex justify-between items-center shadow-sm">
          <h2 className="text-xl font-bold text-slate-800 capitalize">{activeTab.replace('-', ' ')}</h2>
          <div className="flex items-center gap-4">
            <div className="px-3 py-1 bg-green-100 text-green-700 text-[10px] font-bold rounded-full border border-green-200 uppercase tracking-wide">
              System Live
            </div>
            <div className="text-slate-400 text-xs font-medium">
              Last Sync: {new Date().toLocaleTimeString()}
            </div>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
