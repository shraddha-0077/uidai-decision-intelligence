
import React, { useState, useEffect } from 'react';
import { DistrictALDPI, UserRole } from '../types';
import { mockBackend } from '../services/mockBackend';
import { simulatePolicyScenario } from '../services/aldpiEngine';
import { GoogleGenAI, Type } from "@google/genai";

const SimulationLab: React.FC = () => {
  const [districts, setDistricts] = useState<DistrictALDPI[]>([]);
  const [selectedDistrict, setSelectedDistrict] = useState<DistrictALDPI | null>(null);
  const [delay, setDelay] = useState(0);
  const [resourceDelta, setResourceDelta] = useState(0);
  const [loading, setLoading] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<{ riskLevel: string; reasoning: string; fiscalImpact: string; provenance: string } | null>(null);

  useEffect(() => {
    const data = mockBackend.getDistricts();
    setDistricts(data);
    setSelectedDistrict(data[0]);
  }, []);

  const simResult = selectedDistrict ? simulatePolicyScenario(selectedDistrict, { delayDays: delay, resourceDelta }) : null;

  const runPolicyInference = async () => {
    if (!selectedDistrict || !simResult) return;
    setLoading(true);
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    try {
      const prompt = `UIDAI Strategic Policy Impact Analysis for District: ${selectedDistrict.name}.
      SCENARIO: Delay service delivery by ${delay} days; Shift kit inventory by ${resourceDelta} units.
      SIMULATED METRICS: New LFI: ${simResult.lfi.toFixed(2)}, Friction Delta: ${(simResult.impactDelta * 100).toFixed(1)}%.
      
      Provide a professional analysis including:
      1. Overall Risk Level (High, Moderate, Stable).
      2. Strategic reasoning for the friction escalation/decay based on biometric pendency.
      3. Projected operational overhead change.
      4. A data provenance note for RTI-compliance (Level-3 Disclosure).`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              riskLevel: { type: Type.STRING },
              reasoning: { type: Type.STRING },
              fiscalImpact: { type: Type.STRING },
              provenance: { type: Type.STRING }
            },
            required: ["riskLevel", "reasoning", "fiscalImpact", "provenance"]
          }
        }
      });
      
      setAiAnalysis(JSON.parse(response.text));
      
      mockBackend.addAuditLog({
        actor: 'Simulation Lab User',
        role: UserRole.ANALYST,
        action: `Executed Policy What-If Simulation for ${selectedDistrict.name}`,
        targetId: selectedDistrict.id,
        impact: 'LOW'
      });

    } catch (e) {
      console.error(e);
      setAiAnalysis({
        riskLevel: simResult.riskStatus,
        reasoning: "Projected friction escalation correlates with typical linear backlog growth observed in this regional cluster. Delay impacts biometric maintenance cycles disproportionately.",
        fiscalImpact: "Neutral to negative efficiency due to pendency surge.",
        provenance: "Logic: ALDPI-v2.1 Linear Friction Model; Source: District Operational Telemetry (Synthetic)."
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-800 tracking-tight">Policy 'What-If' Lab</h1>
          <p className="text-slate-500 font-medium text-sm mt-1 uppercase tracking-tight">Strategic Stress-Testing → Project Risk Escalation → Pre-emptive Policy</p>
        </div>
        <div className="px-5 py-2.5 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest border border-slate-700 shadow-xl shadow-slate-200">
           Sandboxed Simulation Active
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Scenario Controls */}
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm space-y-12">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Target Geography</label>
              <select 
                value={selectedDistrict?.id}
                onChange={(e) => {
                  const d = districts.find(dist => dist.id === e.target.value);
                  if (d) setSelectedDistrict(d);
                  setAiAnalysis(null);
                }}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-inner"
              >
                {districts.map(d => (
                  <option key={d.id} value={d.id}>{d.name} ({d.state})</option>
                ))}
              </select>
            </div>

            <div className="space-y-12">
               <div>
                  <div className="flex justify-between mb-4">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Biometric Camp Delay</label>
                    <span className="text-sm font-black text-red-600">+{delay} Days</span>
                  </div>
                  <input 
                    type="range" min="0" max="60" step="5" value={delay}
                    onChange={(e) => setDelay(parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-100 rounded-full appearance-none cursor-pointer accent-red-600"
                  />
                  <p className="mt-3 text-[10px] text-slate-400 font-medium italic leading-snug">Simulates the escalation risk of delaying scheduled regional maintenance cycles.</p>
               </div>

               <div>
                  <div className="flex justify-between mb-4">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Kit Redistribution</label>
                    <span className={`text-sm font-black ${resourceDelta >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                      {resourceDelta > 0 ? '+' : ''}{resourceDelta} Units
                    </span>
                  </div>
                  <input 
                    type="range" min="-10" max="10" step="1" value={resourceDelta}
                    onChange={(e) => setResourceDelta(parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-100 rounded-full appearance-none cursor-pointer accent-blue-600"
                  />
                  <p className="mt-3 text-[10px] text-slate-400 font-medium italic leading-snug">Positive shift improves throughput; Negative shift increases pendency.</p>
               </div>
            </div>

            <button 
              onClick={runPolicyInference}
              disabled={loading}
              className="w-full py-5 bg-slate-900 text-white font-black rounded-2xl shadow-2xl shadow-slate-300 uppercase text-[11px] tracking-widest transition-all hover:bg-blue-600 active:scale-95 disabled:opacity-50"
            >
              {loading ? 'Synthesizing Impact Report...' : 'Inference Scenario Report'}
            </button>
          </div>
        </div>

        {/* Impact Visualization */}
        <div className="lg:col-span-8 space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm relative overflow-hidden">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Current LFI Score</p>
                <div className="flex justify-between items-end mb-8">
                  <div>
                    <h3 className="text-5xl font-black text-slate-900 tracking-tighter">{selectedDistrict?.lfi.toFixed(2)}</h3>
                    <p className="text-xs font-bold text-slate-400 uppercase mt-1 tracking-tighter">Baseline Performance</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black border uppercase tracking-tight ${
                    selectedDistrict?.status === 'CRITICAL' ? 'bg-red-100 text-red-600 border-red-200 shadow-sm' : 'bg-emerald-100 text-emerald-600 border-emerald-200 shadow-sm'
                  }`}>
                    {selectedDistrict?.status}
                  </span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-slate-400 transition-all duration-700" style={{ width: `${(selectedDistrict?.lfi || 0) * 100}%` }}></div>
                </div>
             </div>

             <div className={`p-10 rounded-[3rem] border shadow-2xl transition-all duration-1000 transform ${
               simResult?.riskStatus === 'CRITICAL' ? 'bg-red-600 border-red-700 text-white shadow-red-200' : 'bg-slate-900 border-slate-800 text-white shadow-slate-300'
             }`}>
                <p className="text-[10px] font-black opacity-60 uppercase tracking-widest mb-6">Simulated Scenario Outcome</p>
                <div className="flex justify-between items-end mb-8">
                  <div>
                    <h3 className="text-6xl font-black tracking-tighter">{simResult?.lfi.toFixed(2)}</h3>
                    <p className="text-xs font-bold opacity-80 uppercase mt-1 tracking-tighter">Projected Friction Index</p>
                  </div>
                  <div className="text-right">
                    <span className="block text-[10px] font-black uppercase opacity-60 mb-1">Impact Level</span>
                    <span className="text-lg font-black uppercase tracking-tight">{simResult?.riskStatus}</span>
                  </div>
                </div>
                <div className="h-2 w-full bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full bg-white transition-all duration-1000" style={{ width: `${(simResult?.lfi || 0) * 100}%` }}></div>
                </div>
                <div className="mt-8 flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em]">
                   <span className="opacity-60">Friction Delta</span>
                   <span className={`text-lg font-black ${simResult && simResult.impactDelta > 0 ? 'text-red-200' : 'text-emerald-300'}`}>
                     {simResult && simResult.impactDelta > 0 ? '+' : ''}{((simResult?.impactDelta || 0) * 100).toFixed(1)}%
                   </span>
                </div>
             </div>
          </div>

          {/* AI Strategic Report */}
          <div className="bg-white rounded-[4rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col min-h-[500px]">
            <div className="bg-slate-50 px-12 py-8 border-b border-slate-100 flex justify-between items-center">
               <h3 className="font-black text-slate-800 uppercase text-xs tracking-[0.2em] flex items-center gap-4">
                 <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></div>
                 Strategic Impact Inference Report
               </h3>
               <div className="px-4 py-1.5 bg-white border border-slate-200 rounded-lg text-[9px] font-black text-slate-400 uppercase">
                  Seed Anchor: {Math.random().toString(36).substring(7).toUpperCase()}
               </div>
            </div>
            
            <div className="p-12 flex-1 flex flex-col justify-center">
              {aiAnalysis ? (
                <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-1000">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                     <div className="space-y-8">
                        <div>
                          <h4 className="text-[11px] font-black text-blue-600 uppercase tracking-widest mb-4">Strategic Reasoning</h4>
                          <p className="text-slate-800 font-bold text-xl leading-relaxed">
                            {aiAnalysis.reasoning}
                          </p>
                        </div>
                        <div className="p-6 bg-slate-50 rounded-3xl border border-slate-200 shadow-inner">
                          <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3">Operational Overhead Change</h4>
                          <p className="text-sm text-slate-600 font-medium italic leading-relaxed">
                            "{aiAnalysis.fiscalImpact}"
                          </p>
                        </div>
                     </div>
                     
                     <div className="space-y-8">
                        <div className={`p-10 rounded-[2.5rem] border-2 flex flex-col items-center justify-center text-center shadow-xl ${
                          aiAnalysis.riskLevel.toLowerCase().includes('high') || aiAnalysis.riskLevel.toLowerCase().includes('critical') 
                          ? 'bg-red-50 border-red-200 text-red-900 shadow-red-100' 
                          : 'bg-emerald-50 border-emerald-200 text-emerald-900 shadow-emerald-100'
                        }`}>
                           <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-3 opacity-60">Aggregate System Risk</p>
                           <p className="text-5xl font-black uppercase tracking-tight leading-none">{aiAnalysis.riskLevel}</p>
                        </div>
                        
                        <div className="p-8 bg-slate-950 rounded-[2.5rem] text-white border border-slate-800 shadow-2xl">
                          <h4 className="text-[11px] font-black text-slate-500 uppercase tracking-widest mb-4">RTI Data Provenance Log</h4>
                          <p className="text-[10px] font-mono text-slate-400 leading-relaxed bg-black/40 p-4 rounded-xl border border-white/5">
                            {aiAnalysis.provenance}
                          </p>
                          <div className="mt-8 flex gap-4">
                             <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[9px] font-black text-slate-500 uppercase">UIDAI-DI v2.1-Flash</span>
                             <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[9px] font-black text-blue-500 uppercase">Policy Sandbox v4</span>
                          </div>
                        </div>
                     </div>
                  </div>
                </div>
              ) : (
                <div className="text-center space-y-8 py-12">
                   <div className="w-24 h-24 bg-blue-50 rounded-[2.5rem] flex items-center justify-center text-5xl mx-auto shadow-inner border border-blue-100">🧪</div>
                   <h3 className="text-2xl font-black text-slate-300 uppercase tracking-[0.3em]">Ready for Inference</h3>
                   <p className="text-slate-400 text-sm max-w-sm mx-auto leading-relaxed font-medium">
                     Select regional cluster and adjust policy sliders to generate an AI-driven Strategic Impact Inference Report.
                   </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimulationLab;
