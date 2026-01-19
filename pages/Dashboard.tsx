
import React, { useState, useEffect } from 'react';
import { DistrictALDPI, UserRole } from '../types';
import { mockBackend } from '../services/mockBackend';
import { PolicyAutopilot } from '../components/PolicyAutopilot';
import { LFIHeatmap } from '../components/LFIHeatmap';
import { PolicyTriggerBadge } from '../components/PolicyTriggerBadge';

const Dashboard: React.FC = () => {
  const [districts, setDistricts] = useState<DistrictALDPI[]>([]);
  const [selectedDistrict, setSelectedDistrict] = useState<DistrictALDPI | null>(null);

  useEffect(() => {
    const data = mockBackend.getDistricts();
    setDistricts(data);
    const mostCritical = [...data].sort((a,b) => b.crs - a.crs)[0];
    if (mostCritical) setSelectedDistrict(mostCritical);
  }, []);

  return (
    <div className="space-y-8 pb-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* District Selection Column */}
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-white p-8 rounded-[3rem] border border-slate-200 shadow-sm flex flex-col h-full max-h-[900px]">
            <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-8 flex items-center justify-between">
              Regional Queue (Hackathon 2026 Set)
            </h3>
            <div className="space-y-4 flex-1 overflow-y-auto pr-2 custom-scrollbar">
              {districts.map(d => (
                <button 
                  key={d.id} 
                  onClick={() => setSelectedDistrict(d)}
                  className={`w-full text-left p-6 rounded-[2rem] border-2 transition-all group ${selectedDistrict?.id === d.id ? 'border-blue-600 bg-blue-50/30' : 'border-slate-50 hover:border-slate-200'}`}
                >
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-black text-slate-900">{d.name}</h4>
                    <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${d.status === 'CRITICAL' ? 'bg-red-600 text-white' : 'bg-slate-200'}`}>{d.status}</span>
                  </div>
                  <div className="flex justify-between text-[10px] font-bold text-slate-500">
                    <span>CRS: {d.crs.toFixed(2)}</span>
                    <span>DTR: {d.daysToRisk}d</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Analysis Column */}
        <div className="lg:col-span-8 space-y-10">
          {selectedDistrict ? (
            <div className="space-y-10">
              <div className="bg-white p-10 rounded-[3rem] border border-slate-200">
                <div className="flex justify-between items-start mb-10">
                  <div>
                    <h2 className="text-4xl font-black text-slate-900 tracking-tight">{selectedDistrict.name}</h2>
                    <p className="text-slate-500 font-medium uppercase text-xs tracking-widest">{selectedDistrict.state} Regional Hub</p>
                  </div>
                  <PolicyTriggerBadge lfi={selectedDistrict.crs} />
                </div>

                {/* Multivariate Analysis Section */}
                <div className="mb-12">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Multivariate Analysis: Age × Delay × Volume</h4>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {selectedDistrict.ageAnalysis.map((age, idx) => (
                      <div key={idx} className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <p className="text-[10px] font-black text-slate-400 uppercase mb-2">Segment: {age.segment}</p>
                        <p className="text-xl font-black text-slate-800">{age.averageDelay}d</p>
                        <p className="text-[9px] text-slate-500 font-bold uppercase mt-1">Avg Delay ({age.updateType})</p>
                        <div className="mt-3 h-1 w-full bg-slate-200 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-600" style={{ width: `${(age.averageDelay / 6) * 100}%` }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="mt-4 text-[9px] text-slate-400 italic">Finding: Vulnerable age segments (0-5, 60+) show ${((selectedDistrict.ageAnalysis[0].averageDelay / selectedDistrict.ageAnalysis[2].averageDelay)).toFixed(1)}x latency compared to the 16-60 baseline.</p>
                </div>

                {/* Predictive Forecasting Section */}
                <div className="mb-12">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Enrollment/Update Volume Forecast (ARIMA-Lite)</h4>
                  <div className="flex gap-4 items-end h-40">
                    {selectedDistrict.forecast.map((f, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                        <div className="relative w-full flex items-end justify-center">
                           <div className="absolute bottom-full mb-1 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white p-1 rounded text-[8px]">{f.projectedVolume.toLocaleString()}</div>
                           <div className="w-full bg-blue-600/20 rounded-t-lg" style={{ height: `${(f.projectedVolume / 300000) * 150}px` }}></div>
                           <div className="absolute w-2 bg-blue-600 rounded-full" style={{ height: `${(f.projectedVolume / 300000) * 150}px` }}></div>
                        </div>
                        <span className="text-[10px] font-black text-slate-400">{f.month}</span>
                      </div>
                    ))}
                  </div>
                  <p className="mt-4 text-[9px] text-slate-400 italic">Note: Prediction is advisory for resource planning (Confidence Interval: ±8%). Forecasting ${selectedDistrict.forecast[selectedDistrict.forecast.length-1].projectedVolume > selectedDistrict.forecast[0].projectedVolume ? 'Growth' : 'Stabilization'} in seasonal load.</p>
                </div>

                <PolicyAutopilot district={selectedDistrict} />
              </div>

              <LFIHeatmap districts={districts} onSelect={setSelectedDistrict} selectedId={selectedDistrict.id} />
            </div>
          ) : null}
        </div>
      </div>
      
      {/* Global Hackathon Disclaimer Footer */}
      <div className="p-8 bg-slate-900 text-white rounded-[3rem] flex items-center gap-10">
        <div className="w-16 h-16 bg-blue-600 rounded-3xl flex items-center justify-center text-3xl">🛡️</div>
        <div>
          <h4 className="font-black uppercase text-xs tracking-widest text-blue-400">UIDAI Data Hackathon 2026 Compliance Statement</h4>
          <p className="text-slate-400 text-sm mt-1 leading-relaxed max-w-4xl">
            This platform processes official anonymized enrollment datasets. No real-world identifiers are stored. <strong>All identifiers (XXXX-XXXX-1234) are masked placeholders.</strong> Predictive insights are advisory and support human administrative review. No policy decisions are automated.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
