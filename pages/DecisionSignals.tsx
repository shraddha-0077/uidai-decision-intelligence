
import React, { useState, useEffect } from 'react';
import { DecisionSignal, LifecycleStatus, UserRole, User } from '../types';
import { mockBackend } from '../services/mockBackend';
import DecisionCard from '../components/DecisionCard';

const DecisionSignals: React.FC<{ currentUser: User }> = ({ currentUser }) => {
  const [signals, setSignals] = useState<DecisionSignal[]>([]);
  const [filter, setFilter] = useState<UserRole | 'ALL'>(currentUser.role);

  useEffect(() => {
    setSignals(mockBackend.getSignals());
  }, []);

  const handleTransition = (id: string, nextStatus: LifecycleStatus, nextRole: UserRole) => {
    const sig = signals.find(s => s.id === id);
    if (!sig) return;

    const newHistoryEntry = {
      status: nextStatus,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      actor: currentUser.name,
      role: currentUser.role,
      note: `Signal advanced to ${nextStatus}. Responsibility shifted to ${nextRole}.`
    };

    const updated: DecisionSignal = {
      ...sig,
      lifecycleStatus: nextStatus,
      assignedRole: nextRole,
      history: [...sig.history, newHistoryEntry]
    };

    mockBackend.updateSignal(updated);
    mockBackend.addAuditLog({
      actor: currentUser.name,
      role: currentUser.role,
      action: `Executed lifecycle transition for signal ${id} to state: ${nextStatus}`,
      targetId: id,
      impact: sig.severity === 'HIGH' ? 'HIGH' : 'MEDIUM'
    });

    setSignals(prev => prev.map(s => s.id === id ? updated : s));
  };

  const filteredSignals = signals.filter(s => filter === 'ALL' || s.assignedRole === filter);

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        <div>
          <h1 className="text-4xl font-black text-slate-800 tracking-tight">Decision Lifecycle Panel</h1>
          <p className="text-slate-500 font-medium text-sm mt-1 uppercase tracking-widest">Digital Signature Workflow → Detection → Authorization → Resolution</p>
        </div>

        <div className="flex bg-white p-2 rounded-2xl border border-slate-200 shadow-sm overflow-x-auto w-full md:w-auto">
          {['ALL', UserRole.DISTRICT_OFFICER, UserRole.ANALYST, UserRole.STATE_NODAL_OFFICER, UserRole.COMPLIANCE_OFFICER].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f as any)}
              className={`px-6 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                filter === f ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {f.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-12">
        {filteredSignals.length > 0 ? (
          filteredSignals.map(sig => (
            <DecisionCard 
              key={sig.id} 
              signal={sig} 
              onStatusTransition={handleTransition} 
              currentUser={currentUser}
            />
          ))
        ) : (
          <div className="bg-white p-32 rounded-[4rem] border border-dashed border-slate-200 text-center">
            <div className="text-7xl mb-6 grayscale opacity-20">🛡️</div>
            <h3 className="text-2xl font-black text-slate-300 uppercase tracking-widest">Lifecycle Queue Empty</h3>
            <p className="text-slate-400 text-sm mt-2 max-w-sm mx-auto font-medium">No pending policy signals require authorization from the <strong>{filter.replace('_', ' ')}</strong> role at this moment.</p>
          </div>
        )}
      </div>

      {/* DLAE PROTOCOL SECTION */}
      <div className="bg-slate-950 rounded-[4rem] p-16 text-white relative overflow-hidden shadow-2xl border border-white/5">
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-16">
          <div className="w-24 h-24 bg-white/5 rounded-[2.5rem] flex items-center justify-center text-5xl border border-white/10 shadow-inner">
            ⚖️
          </div>
          <div className="flex-1 space-y-4">
            <h3 className="text-3xl font-black tracking-tight">Immutable Accountability Protocol (DLAE)</h3>
            <p className="text-slate-400 text-lg leading-relaxed max-w-3xl font-medium">
              The Decision Lifecycle & Accountability Engine ensures every policy trigger is backed by human justification. ALIS-v4 hashing prevents retrospective modification of detection seeds, guaranteeing 100% audit integrity for parliamentary oversight.
            </p>
            <div className="flex gap-4">
               <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-[9px] font-black text-slate-500 uppercase tracking-widest">Protocol v4.2.0-SEC</span>
               <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-[9px] font-black text-emerald-500 uppercase tracking-widest">Zero-Trust Active</span>
            </div>
          </div>
          <div className="text-center md:text-right hidden xl:block">
            <p className="text-[10px] font-black uppercase text-slate-500 mb-2">Hash Anchor</p>
            <p className="text-xl font-mono text-blue-500 font-bold">STQC_UIDAI_{Math.random().toString(36).substring(7).toUpperCase()}</p>
          </div>
        </div>
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-blue-600/5 via-transparent to-transparent opacity-50"></div>
      </div>
    </div>
  );
};

export default DecisionSignals;
