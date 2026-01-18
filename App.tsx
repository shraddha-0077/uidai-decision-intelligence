
import React, { useState, useEffect } from 'react';
import { User, UserRole, DecisionSignal } from './types';
import Login from './pages/Login';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import DecisionCard from './components/DecisionCard';
import Upload from './pages/Upload';
import Compliance from './pages/Compliance';
import { mockBackend } from './services/mockBackend';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [signals, setSignals] = useState<DecisionSignal[]>([]);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    if (user) {
      setSignals(mockBackend.getSignals());
    }
  }, [user]);

  const handleLogin = (u: User) => {
    setUser(u);
  };

  const handleLogout = () => {
    setUser(null);
  };

  const handleExport = (id: string) => {
    setIsExporting(true);
    setTimeout(() => {
      alert(`Decision Report for Signal ID ${id} generated successfully. Download started.`);
      setIsExporting(false);
    }, 1500);
  };

  if (!user) {
    return <Login onLoginSuccess={handleLogin} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard signals={signals} />;
      case 'insights':
        return (
          <div className="space-y-8">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-2xl font-bold text-slate-800">Critical Policy Signals</h3>
                <p className="text-slate-500 text-sm">Priority actions identified by the Decision Intelligence Engine.</p>
              </div>
              <div className="flex gap-2">
                <select className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>All Severity</option>
                  <option>High Priority</option>
                </select>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-xs font-bold shadow-lg shadow-blue-200">
                  Generate Summary PDF
                </button>
              </div>
            </div>
            <div className="space-y-6">
              {signals.map(s => (
                <DecisionCard key={s.id} signal={s} onExport={handleExport} />
              ))}
            </div>
          </div>
        );
      case 'upload':
        return <Upload />;
      case 'compliance':
        return <Compliance />;
      default:
        return <Dashboard signals={signals} />;
    }
  };

  return (
    <Layout 
      user={user} 
      onLogout={handleLogout} 
      activeTab={activeTab} 
      setActiveTab={setActiveTab}
    >
      {isExporting && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white p-8 rounded-2xl text-center shadow-2xl">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="font-bold text-slate-800">Generating Secure PDF Brief...</p>
            <p className="text-xs text-slate-400 mt-2">Authenticating Signature & Encrypting Document</p>
          </div>
        </div>
      )}
      {renderContent()}
    </Layout>
  );
};

export default App;
