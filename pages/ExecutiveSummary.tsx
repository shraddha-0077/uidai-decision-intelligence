
import React, { useState, useEffect } from 'react';
import { DistrictALDPI, DecisionSignal } from '../types';
import { mockBackend } from '../services/mockBackend';

const ExecutiveSummary: React.FC = () => {
  const [districts, setDistricts] = useState<DistrictALDPI[]>([]);
  const [signals, setSignals] = useState<DecisionSignal[]>([]);

  useEffect(() => {
    setDistricts(mockBackend.getDistricts());
    setSignals(mockBackend.getSignals());
  }, []);

  const avgCrs = districts.reduce((acc, d) => acc + d.crs, 0) / (districts.length || 1);
  const nri = avgCrs * 100;
  const highRiskSignals = signals.filter(s => s.severity === 'HIGH').length;
  const inactionThreats = signals.filter(s => s.inactionRisk.projection30d > 0.8).length;

  // Simulated Impact Metrics for the Advisory Card
  const projectedBacklogReduction = 22.4; // %
  const interactionsOptimized = 1450000; // Count
  const delayReductionDays = 3.8; // Days

  return (
    <div className="space-y-10 pb-20">
      {/* COMMAND HERO */}
      <div className="bg-slate-900 text-white p-16 rounded-[4rem] shadow-2xl relative overflow-hidden border border-white/5">
        <div className="relative z-10 grid grid-cols-1 xl:grid-cols-12 gap-16 items-start">
          <div className="xl:col-span-5 space-y-8">
            <div className="inline-flex items-center gap-3 px-5 py-2 bg-blue-600/20 border border-blue-500/30 text-blue-400 text-[10px] font-black uppercase tracking-[0.3em] rounded-full">
              <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
              National Command Dashboard
            </div>
            <h1 className="text-6xl font-black tracking-tighter leading-none">
              National Risk Index: <span className={nri > 50 ? 'text-orange-500' : 'text-emerald-500'}>{nri.toFixed(1)}</span>
            </h1>
            <div className="space-y-4">
              <p className="text-slate-400 text-xl leading-relaxed font-medium max-w-lg">
                Composite Risk metrics indicate <span className="text-orange-400 font-bold uppercase underline underline-offset-4 decoration-orange-400/30">Stable Friction</span> across primary regional offices. {highRiskSignals} high-priority clusters require intervention logic review.
              </p>
              <p className="text-slate-500 text-xs font-medium italic opacity-80 border-l border-slate-700 pl-4">
                This system shifts UIDAI from reactive backlog management to pre-emptive, region-specific intervention planning.
              </p>
            </div>
            <div className="flex flex-wrap gap-4 pt-4">
              <button className="px-10 py-5 bg-white text-slate-900 font-black rounded-2xl text-[11px] uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-white/10 active:scale-95">Review Composite Signals</button>
              <button className="px-10 py-5 bg-slate-800 text-slate-400 font-black rounded-2xl text-[11px] uppercase tracking-widest border border-white/5 hover:bg-slate-700 transition-all">Download Audit Digest</button>
            </div>
          </div>
          
          <div className="xl:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-8">
             <div className="bg-white/5 p-10 rounded-[2.5rem] border border-white/10 backdrop-blur-3xl shadow-inner group hover:bg-white/10 transition-all cursor-default">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Critical Inaction Threats</p>
                <p className="text-6xl font-black text-white">{inactionThreats}</p>
                <div className="flex items-center gap-2 mt-4 text-[10px] font-bold">
                   <div className="w-2 h-2 rounded-full bg-red-500 animate-ping"></div>
                   <span className="text-red-400 uppercase tracking-tighter">Immediate Policy Trigger</span>
                </div>
             </div>

             <div className="bg-white/5 p-10 rounded-[2.5rem] border border-white/10 backdrop-blur-3xl shadow-inner group hover:bg-white/10 transition-all cursor-default">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Resolution Velocity</p>
                <p className="text-6xl font-black text-blue-400">1.4<span className="text-xl">d</span></p>
                <p className="text-[10px] text-slate-500 font-bold mt-4 uppercase tracking-tighter">Cycle-time: +8% Efficiency</p>
             </div>

             {/* FEATURE: National Impact Projection (Advisory) Card */}
             <div className="md:col-span-2 bg-gradient-to-br from-blue-600/20 to-emerald-600/10 p-10 rounded-[2.5rem] border border-blue-500/30 backdrop-blur-3xl shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-6 opacity-20">
                  <div className="w-24 h-24 bg-blue-500 rounded-full blur-3xl"></div>
                </div>
                
                <div className="relative z-10 space-y-8">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xs font-black text-blue-400 uppercase tracking-[0.2em] flex items-center gap-2">
                      <span className="text-lg">📈</span>
                      National Impact Projection (Advisory)
                    </h3>
                    <div className="px-3 py-1 bg-blue-500/20 border border-blue-400/30 rounded-lg text-[8px] font-black text-blue-300 uppercase">
                      Tier-1 Forecast
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                    <div className="space-y-2">
                      <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Backlog Reduction</p>
                      <p className="text-4xl font-black text-emerald-400">-{projectedBacklogReduction}%</p>
                      <p className="text-[8px] text-slate-500 font-bold">Est. Lifecycle Recovery</p>
                    </div>
                    <div className="space-y-2 border-l border-white/5 pl-8">
                      <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Citizen Optimization</p>
                      <p className="text-4xl font-black text-white">{(interactionsOptimized/1000000).toFixed(1)}M</p>
                      <p className="text-[8px] text-slate-500 font-bold">Interactions Harmonized</p>
                    </div>
                    <div className="space-y-2 border-l border-white/5 pl-8">
                      <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Delay Reduction</p>
                      <p className="text-4xl font-black text-blue-400">-{delayReductionDays}d</p>
                      <p className="text-[8px] text-slate-500 font-bold">Avg Service Flow Delta</p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/5">
                    <p className="text-[9px] text-slate-500 font-medium leading-relaxed italic">
                      <strong>Compliance Note:</strong> All projections are derived from anonymized and synthetic datasets and are advisory only, requiring human administrative approval for policy inception.
                    </p>
                  </div>
                </div>
             </div>
             
             {/* SUBTLE ADVISORY LINE */}
             <div className="md:col-span-2 -mt-4 px-4">
               <p className="text-[10px] text-slate-500/50 font-medium italic">
                 Advisory Insight: Without calibrated intervention, operational backlog growth is projected to exceed processing capacity in three high-risk regional clusters within the next 60 days.
               </p>
             </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-600/10 via-transparent to-transparent opacity-50"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-10">
           <div className="flex justify-between items-center">
             <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight flex items-center gap-4">
               <div className="w-3 h-8 bg-blue-600 rounded-full shadow-lg shadow-blue-600/30"></div>
               Priority CRS Divergences
             </h3>
             <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Decision Support Active</span>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             {signals.slice(0, 2).map(sig => (
               <div key={sig.id} className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm hover:border-blue-300 hover:shadow-xl transition-all group cursor-pointer">
                 <div className="flex justify-between items-start mb-8">
                    <div className="space-y-1">
                      <h4 className="text-2xl font-black text-slate-900 tracking-tight">{sig.district}</h4>
                      <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{sig.type} BREACH</p>
                    </div>
                    <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase ${
                      sig.severity === 'HIGH' ? 'bg-red-600 text-white shadow-lg shadow-red-200' : 'bg-slate-900 text-white'
                    }`}>
                      {sig.severity}
                    </span>
                 </div>
                 
                 <div className="space-y-6">
                    <div className="flex justify-between items-end">
                       <span className="text-[10px] text-slate-400 font-black uppercase tracking-tighter">Composite Score (CRS)</span>
                       <span className="text-2xl font-black text-slate-800">{sig.crs.toFixed(2)}</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                       <div className={`h-full transition-all duration-1000 ${sig.severity === 'HIGH' ? 'bg-red-600' : 'bg-orange-500'}`} style={{ width: `${sig.crs * 100}%` }}></div>
                    </div>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed italic border-l-2 border-slate-100 pl-4">
                      "{sig.whyItMatters}"
                    </p>
                    <button className="w-full py-4 bg-slate-50 text-slate-600 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] group-hover:bg-slate-900 group-hover:text-white transition-all shadow-sm">
                      View Rule Trace
                    </button>
                 </div>
               </div>
             ))}
           </div>
        </div>

        <div className="space-y-10">
          <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight flex items-center gap-4">
            <div className="w-3 h-8 bg-orange-600 rounded-full shadow-lg shadow-orange-600/30"></div>
            Governance Health
          </h3>
          
          <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm space-y-10 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4">
               <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
            </div>
            {districts.slice(0, 5).map((d, i) => (
              <div key={d.id} className="group cursor-pointer">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-4">
                    <span className="text-[10px] font-black text-slate-300">#{i+1}</span>
                    <span className="text-base font-black text-slate-800 group-hover:text-blue-600 transition-colors">{d.name}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${d.crs > 0.6 ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'}`}>
                    {d.status}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-1 bg-slate-50 rounded-full overflow-hidden">
                    <div className={`h-full transition-all duration-700 ${d.crs > 0.6 ? 'bg-red-600' : 'bg-emerald-500'}`} style={{ width: `${d.crs * 100}%` }}></div>
                  </div>
                  <span className="text-[9px] font-black text-slate-500 font-mono">{(d.crs).toFixed(2)}</span>
                </div>
                {i < 4 && <div className="mt-6 border-b border-slate-50"></div>}
              </div>
            ))}
            
            <div className="pt-4">
               <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                  <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Avg National CRS</p>
                  <p className="text-xl font-black text-slate-900">{avgCrs.toFixed(2)}</p>
               </div>
               <button className="w-full py-5 mt-4 bg-slate-900 text-white font-black rounded-2xl text-[10px] uppercase tracking-widest shadow-2xl shadow-slate-300 hover:bg-blue-600 active:scale-95 transition-all">
                 Generate Performance Report
               </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExecutiveSummary;
