
import React from 'react';
import { DecisionSignal, LifecycleStatus, UserRole } from '../types';

interface DecisionCardProps {
  signal: DecisionSignal;
  currentUser: { name: string; role: UserRole };
  onStatusTransition: (id: string, next: LifecycleStatus, role: UserRole) => void;
}

const DecisionCard: React.FC<DecisionCardProps> = ({ signal, currentUser, onStatusTransition }) => {
  const lifecycleSteps = [
    { status: LifecycleStatus.DETECTED, role: UserRole.SYSTEM },
    { status: LifecycleStatus.EXPLAINED, role: UserRole.SYSTEM },
    { status: LifecycleStatus.REVIEWED, role: UserRole.ANALYST },
    { status: LifecycleStatus.ACTION_INITIATED, role: UserRole.STATE_NODAL_OFFICER },
    { status: LifecycleStatus.RESOLVED, role: UserRole.COMPLIANCE_OFFICER }
  ];

  const currentIdx = lifecycleSteps.findIndex(s => s.status === signal.lifecycleStatus);
  const nextStage = currentIdx < lifecycleSteps.length - 1 ? lifecycleSteps[currentIdx + 1] : null;
  const canAdvance = nextStage && (currentUser.role === nextStage.role || currentUser.role === UserRole.COMPLIANCE_OFFICER);

  return (
    <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col hover:border-blue-400 transition-all duration-300">
      {/* Header with Anomaly Alert */}
      {signal.anomalyDetected && (
        <div className="bg-red-50 px-8 py-3 border-b border-red-100 flex items-center gap-3">
          <span className="animate-pulse">🚨</span>
          <span className="text-[10px] font-black text-red-600 uppercase tracking-widest">
            Anomaly Detected: {signal.anomalyDetails} (Source: Baseline Deviation)
          </span>
        </div>
      )}

      <div className="bg-slate-50 px-8 py-5 border-b border-slate-100 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Responsibility:</span>
          <span className={`px-3 py-1 rounded-full text-[9px] font-black border uppercase tracking-tight shadow-sm bg-blue-100 text-blue-700 border-blue-200`}>
            {signal.assignedRole.replace('_', ' ')}
          </span>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-black text-slate-400 uppercase">Confidence:</span>
            <span className={`text-[10px] font-black uppercase text-emerald-600`}>{signal.confidenceLevel}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-black text-slate-400 uppercase">Freshness:</span>
            <span className="text-[10px] font-bold text-slate-600">{signal.freshness}</span>
          </div>
          <div className="h-4 w-px bg-slate-200"></div>
          <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-tighter">ANON-ID-{signal.id.split('-').pop()}</span>
        </div>
      </div>

      <div className="p-8">
        <div className="flex flex-col lg:flex-row justify-between items-start gap-8 mb-10">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${signal.severity === 'HIGH' ? 'bg-red-600 text-white' : 'bg-slate-900 text-white'}`}>
                {signal.severity} PRIORITY
              </span>
              <h3 className="text-3xl font-black text-slate-900 tracking-tight leading-none">{signal.title}</h3>
            </div>
            <p className="text-slate-500 font-medium text-sm flex items-center gap-2">
              📍 {signal.district} — Composite Risk Score: <span className="font-bold text-slate-900">{signal.crs.toFixed(2)}</span>
            </p>
          </div>
          <div className="flex flex-col items-end gap-3 w-full lg:w-auto">
            {nextStage && (
              <button 
                onClick={() => onStatusTransition(signal.id, nextStage.status, nextStage.role)}
                disabled={!canAdvance}
                className={`w-full lg:w-auto px-8 py-4 text-[11px] font-black rounded-2xl transition-all uppercase tracking-widest shadow-2xl active:scale-95 disabled:opacity-30 ${canAdvance ? 'bg-slate-900 text-white hover:bg-blue-600 shadow-slate-300' : 'bg-slate-100 text-slate-400 border border-slate-200 shadow-none'}`}
              >
                {canAdvance ? `Advance to ${nextStage.status.replace('_', ' ')}` : `Awaiting ${nextStage.role.replace('_', ' ')}`}
              </button>
            )}
            <p className="text-[10px] font-bold text-slate-400 italic">Lifecycle State: {signal.lifecycleStatus.replace('_', ' ')}</p>
          </div>
        </div>

        {/* COST OF INACTION (COI) PANEL */}
        <div className="p-6 bg-orange-50 border border-orange-100 rounded-3xl mb-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xl">⚠️</span>
            <h4 className="text-[11px] font-black text-orange-700 uppercase tracking-widest">Governance Reframing: Cost of Inaction</h4>
          </div>
          <p className="text-xs font-bold text-orange-900 leading-relaxed mb-6 italic">
            "{signal.inactionRisk.impactSummary}"
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/60 p-4 rounded-2xl border border-orange-100">
              <p className="text-[9px] font-black text-orange-500 uppercase mb-1">CRS Projection (14d)</p>
              <p className="text-2xl font-black text-orange-700">{signal.inactionRisk.projection14d.toFixed(2)}</p>
            </div>
            <div className="bg-white/60 p-4 rounded-2xl border border-orange-100">
              <p className="text-[9px] font-black text-red-500 uppercase mb-1">CRS Projection (30d)</p>
              <p className="text-2xl font-black text-red-700">{signal.inactionRisk.projection30d.toFixed(2)}</p>
            </div>
          </div>
        </div>

        {/* MULTIVARIATE RULE TRACE */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="p-6 bg-slate-50 border border-slate-200 rounded-3xl">
            <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4">Explainable Rule Trace (Multivariate)</h4>
            <ul className="space-y-3">
              {signal.ruleTrace.map((rule, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <div className="w-5 h-5 bg-white border border-slate-200 rounded-lg flex items-center justify-center text-[10px] font-black text-slate-400 flex-shrink-0">
                    {idx + 1}
                  </div>
                  <span className="text-xs font-semibold text-slate-700 leading-tight">{rule}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="p-6 bg-blue-50/50 border border-blue-100 rounded-3xl">
            <h4 className="text-[11px] font-black text-blue-600 uppercase tracking-widest mb-4">Policy Recommendation</h4>
            <p className="text-sm font-bold text-slate-800 italic mb-4">"{signal.recommendedAction}"</p>
            <div className="p-4 bg-white/60 rounded-xl border border-blue-100">
              <p className="text-[9px] font-black text-blue-400 uppercase mb-2">Audit/RTI Justification</p>
              <p className="text-[10px] text-slate-600 leading-relaxed">{signal.justification}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer Footer Labels */}
      <div className="px-8 py-3 bg-slate-50 border-t border-slate-100 flex justify-between">
        <span className="text-[8px] font-black text-slate-400 uppercase">Model logic: Composite Risk (Backlog, Delay, Capacity, Volatility)</span>
        <span className="text-[8px] font-black text-slate-400 uppercase">Dataset: Official_UIDAI_Hackathon_2026_V1</span>
      </div>
    </div>
  );
};

export default DecisionCard;
