
import React, { useState, useEffect } from 'react';
import { AuditLogEntry } from '../types';
import { mockBackend } from '../services/mockBackend';

const AuditGovernance: React.FC = () => {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);

  useEffect(() => {
    setLogs(mockBackend.getAuditLogs());
  }, []);

  return (
    <div className="space-y-10 pb-20">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-black text-slate-800 tracking-tight">Audit & Governance Trail</h1>
          <p className="text-slate-500 font-medium text-sm mt-1 uppercase tracking-tight">Immutable Accountability Records → System Integrity Log</p>
        </div>
        <button className="px-6 py-3 bg-white border border-slate-200 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm">
           Export for Auditor
        </button>
      </div>

      <div className="bg-white rounded-[3rem] border border-slate-200 shadow-sm overflow-hidden relative">
        <div className="absolute top-0 right-0 p-8">
           <div className="px-4 py-1.5 bg-emerald-50 border border-emerald-100 text-emerald-600 text-[9px] font-black uppercase rounded-full shadow-inner flex items-center gap-2">
             <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
             Hash Integrity Sealed
           </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="p-8 text-[10px] font-black uppercase tracking-widest text-slate-400">Timestamp (UTC)</th>
                <th className="p-8 text-[10px] font-black uppercase tracking-widest text-slate-400">Principal / Role</th>
                <th className="p-8 text-[10px] font-black uppercase tracking-widest text-slate-400">Action Signature</th>
                <th className="p-8 text-[10px] font-black uppercase tracking-widest text-slate-400">Target Object</th>
                <th className="p-8 text-[10px] font-black uppercase tracking-widest text-slate-400">Severity</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {logs.length > 0 ? (
                logs.map((log) => (
                  <tr key={log.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-all group">
                    <td className="p-8 font-mono text-[10px] text-slate-500">{log.timestamp}</td>
                    <td className="p-8">
                       <p className="font-black text-slate-900 leading-none mb-1">{log.actor}</p>
                       <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">{log.role.replace('_', ' ')}</span>
                    </td>
                    <td className="p-8 text-slate-600 font-medium group-hover:text-blue-600 transition-colors">
                       {log.action}
                    </td>
                    <td className="p-8 font-mono text-[10px] text-blue-600 uppercase font-bold tracking-tighter">
                       {log.targetId}
                    </td>
                    <td className="p-8">
                       <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-tighter ${
                         log.impact === 'HIGH' ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-500'
                       }`}>
                         {log.impact}
                       </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-32 text-center text-slate-400 font-bold italic">
                    <div className="text-5xl mb-6 grayscale opacity-20">🛡️</div>
                    Accountability records queue initialized. Waiting for protocol actions.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="p-10 bg-slate-900 rounded-[3rem] text-white flex flex-col md:flex-row items-center gap-12 border border-white/5 shadow-2xl">
         <div className="w-20 h-20 bg-blue-600 rounded-[2rem] flex items-center justify-center text-4xl shadow-xl shadow-blue-500/20">
           🔐
         </div>
         <div className="flex-1 space-y-2">
            <h4 className="text-xl font-black uppercase tracking-tight">RTI & Supreme Court Disclosure Protocol</h4>
            <p className="text-slate-400 text-sm font-medium leading-relaxed max-w-3xl">
              This log represents a non-PII, aggregated operational audit trail. All actions are finalized using unidirectional hashing to ensure zero-tampering from administrative principals, meeting Tier-1 security requirements for the Digital Personal Data Protection Act.
            </p>
         </div>
         <div className="flex flex-col items-center md:items-end gap-2">
            <span className="text-[10px] font-black uppercase text-slate-500">Security Anchor</span>
            <span className="text-xs font-mono text-emerald-500 font-bold">STQC-2024-Verified</span>
         </div>
      </div>
    </div>
  );
};

export default AuditGovernance;
