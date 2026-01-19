
import React from 'react';
import { User } from '../types';

interface LayoutProps {
  user: User;
  onLogout: () => void;
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ user, onLogout, children, activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'summary', label: 'Executive Command', icon: '🏛️' },
    { id: 'dashboard', label: 'Regional Intelligence', icon: '📊' },
    { id: 'simulation', label: 'Policy What-If', icon: '🧪' },
    { id: 'insights', label: 'Decision Lifecycle', icon: '💡' },
    { id: 'audit', label: 'Governance Trail', icon: '🛡️' },
    { id: 'upload', label: 'Data Ingestion', icon: '📥' },
    { id: 'compliance', label: 'Privacy Framework', icon: '🔐' },
  ];

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-72 bg-slate-900 text-white flex flex-col shadow-2xl z-20">
        <div className="p-8 border-b border-white/5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center font-black text-lg shadow-lg shadow-orange-600/30 border border-white/10">UA</div>
            <div>
              <h1 className="font-black text-xl tracking-tighter leading-none">DLAE</h1>
              <p className="text-[9px] text-slate-500 uppercase font-black tracking-widest mt-1">Decision Intelligence</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-6 space-y-2 overflow-y-auto custom-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-sm transition-all duration-300 ${
                activeTab === tab.id 
                ? 'bg-blue-600 text-white shadow-xl shadow-blue-900/40 translate-x-1' 
                : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <span className="text-xl">{tab.icon}</span>
              <span className="font-bold">{tab.label}</span>
              {activeTab === tab.id && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white animate-pulse"></div>}
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-white/5 bg-slate-950/40">
          <div className="flex items-center gap-4 mb-6 p-2 rounded-2xl bg-white/5 border border-white/5">
            <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-sm font-black border border-white/10 text-blue-400">
              {user.name.charAt(0)}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-black truncate">{user.name}</p>
              <p className="text-[9px] text-slate-500 uppercase tracking-tighter">{user.role} — Tier 1 Security</p>
            </div>
          </div>
          <button 
            onClick={onLogout}
            className="w-full py-3 text-xs font-black text-slate-500 hover:text-red-400 transition-all flex items-center justify-center gap-2 border border-white/5 rounded-xl hover:bg-red-400/5"
          >
            Terminate Session
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 px-10 py-5 flex justify-between items-center sticky top-0 z-10">
          <h2 className="text-lg font-black text-slate-800 uppercase tracking-tight">{activeTab.replace('-', ' ')}</h2>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
               <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">End-to-End Encrypted</span>
            </div>
            <div className="h-8 w-px bg-slate-200"></div>
            <div className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">
              Live Stream: {new Date().toLocaleDateString()}
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
          <div className="max-w-[1400px] mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Layout;
