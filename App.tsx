
import React, { useState } from 'react';
import { User } from './types';
import Login from './pages/Login';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Upload from './pages/Upload';
import Compliance from './pages/Compliance';
import ExecutiveSummary from './pages/ExecutiveSummary';
import DecisionSignals from './pages/DecisionSignals';
import SimulationLab from './pages/SimulationLab';
import AuditGovernance from './pages/AuditGovernance';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('summary');

  const handleLogin = (u: User) => {
    setUser(u);
  };

  const handleLogout = () => {
    setUser(null);
  };

  if (!user) {
    return <Login onLoginSuccess={handleLogin} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'summary':
        return <ExecutiveSummary />;
      case 'dashboard':
        return <Dashboard />;
      case 'upload':
        return <Upload />;
      case 'compliance':
        return <Compliance />;
      case 'insights':
        return <DecisionSignals currentUser={user} />;
      case 'simulation':
        return <SimulationLab />;
      case 'audit':
        return <AuditGovernance />;
      default:
        return <ExecutiveSummary />;
    }
  };

  return (
    <Layout 
      user={user} 
      onLogout={handleLogout} 
      activeTab={activeTab} 
      setActiveTab={setActiveTab}
    >
      {renderContent()}
    </Layout>
  );
};

export default App;
