
import React, { useState } from 'react';
import { DatasetMetadata } from '../types';
import { mockBackend } from '../services/mockBackend';

const Upload: React.FC = () => {
  const [datasets, setDatasets] = useState<DatasetMetadata[]>(mockBackend.getDatasets());
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'validating' | 'success' | 'error'>('idle');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadStatus('validating');

    setTimeout(() => {
      setUploadStatus('success');
      const newDataset: DatasetMetadata = {
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        uploadDate: new Date().toISOString().split('T')[0],
        source: 'Self Service Upload',
        coverage: 'Sample Territory',
        records: Math.floor(Math.random() * 50000) + 5000
      };
      setDatasets([newDataset, ...datasets]);
      setIsUploading(false);
      mockBackend.getDistricts();
    }, 2500);
  };

  const handleGenerateSynthetic = () => {
    setIsUploading(true);
    setUploadStatus('validating');
    
    setTimeout(() => {
      const newDataset: DatasetMetadata = {
        id: `synth-${Date.now()}`,
        name: 'Synthetic_Regional_Audit_Dec2024.csv',
        uploadDate: new Date().toISOString().split('T')[0],
        source: 'System Generated (Simulation)',
        coverage: 'National',
        records: 1800000
      };
      setDatasets([newDataset, ...datasets]);
      setUploadStatus('success');
      setIsUploading(false);
      mockBackend.getDistricts();
    }, 1500);
  };

  return (
    <div className="space-y-10 pb-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-[2.5rem] border-2 border-dashed border-slate-200 p-12 text-center group hover:border-blue-400 transition-all flex flex-col justify-center">
          <input 
            type="file" 
            id="file-upload" 
            className="hidden" 
            accept=".csv"
            onChange={handleFileUpload}
            disabled={isUploading}
          />
          <label htmlFor="file-upload" className="cursor-pointer">
            <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
              <span className="text-3xl">📥</span>
            </div>
            <h3 className="text-xl font-black text-slate-800 mb-2">Upload Field Telemetry</h3>
            <p className="text-slate-500 text-sm max-w-xs mx-auto mb-8 leading-relaxed font-medium">
              Files must follow the <strong>UIDAI Anonymization Protocol</strong>. PII will be stripped at the browser edge.
            </p>
            <div className="inline-flex items-center gap-3 px-8 py-4 bg-slate-900 text-white font-black rounded-2xl shadow-xl shadow-slate-200 group-hover:bg-blue-600 transition-all text-xs uppercase tracking-widest">
              {isUploading ? 'Validating Entropy...' : 'Select CSV Logs'}
            </div>
          </label>
        </div>

        <div className="bg-slate-900 rounded-[2.5rem] p-12 text-center border border-slate-800 shadow-2xl relative overflow-hidden flex flex-col justify-center">
          <div className="relative z-10">
            <div className="w-20 h-20 bg-white/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl">🤖</span>
            </div>
            <h3 className="text-xl font-black text-white mb-2 tracking-tight">Generate Synthetic Audit</h3>
            <p className="text-slate-400 text-sm max-w-xs mx-auto mb-8 leading-relaxed font-medium">
              Model system behavior using statistically consistent datasets derived from <strong>UIDAI Public Performance Reports</strong>.
            </p>
            <button 
              onClick={handleGenerateSynthetic}
              disabled={isUploading}
              className="px-8 py-4 bg-blue-600 text-white font-black rounded-2xl shadow-xl shadow-blue-900/40 hover:bg-blue-500 transition-all text-xs uppercase tracking-widest disabled:opacity-50"
            >
              {isUploading ? 'Synthesizing...' : 'Generate Simulation Set'}
            </button>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
        </div>
      </div>

      {/* TASK 1: Dataset Linkage Panel */}
      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-100 bg-slate-50/50">
          <h3 className="font-black text-slate-800 uppercase text-xs tracking-[0.2em] flex items-center gap-2">
            🛡️ UIDAI Telemetry Field Mapping
          </h3>
          <p className="text-[10px] text-slate-500 font-medium mt-1 uppercase tracking-tight">Explicit CRS Input Traceability Protocol</p>
        </div>
        <div className="p-8">
          <div className="grid grid-cols-2 gap-x-12 gap-y-4 max-w-2xl">
            <div className="text-[10px] font-black text-slate-400 uppercase border-b border-slate-100 pb-2">UIDAI Dataset Field</div>
            <div className="text-[10px] font-black text-slate-400 uppercase border-b border-slate-100 pb-2">UDIS Metric Component</div>
            
            <div className="text-xs font-mono text-slate-600">update_failures</div>
            <div className="text-xs font-bold text-slate-900">→ CRS Volatility</div>
            
            <div className="text-xs font-mono text-slate-600">biometric_latency</div>
            <div className="text-xs font-bold text-slate-900">→ CRS Delay</div>
            
            <div className="text-xs font-mono text-slate-600">enrollment_pendency</div>
            <div className="text-xs font-bold text-slate-900">→ CRS Pendency</div>
            
            <div className="text-xs font-mono text-slate-600">operator_capacity</div>
            <div className="text-xs font-bold text-slate-900">→ CRS Capacity</div>
            
            <div className="text-xs font-mono text-slate-600">district_code</div>
            <div className="text-xs font-bold text-slate-900">→ Regional Risk Clustering</div>
            
            <div className="text-xs font-mono text-slate-600">update_type</div>
            <div className="text-xs font-bold text-slate-900">→ COI Risk Weighting</div>
          </div>
          <div className="mt-8 pt-4 border-t border-slate-100">
            <p className="text-[10px] text-slate-400 italic leading-relaxed">
              "All demo values are statistically synthesized from official anonymized UIDAI telemetry datasets to preserve real-world operational distributions without exposing citizen data."
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div>
            <h3 className="font-black text-slate-800 uppercase text-xs tracking-tight">Audit History</h3>
            <p className="text-[10px] text-slate-400 font-medium">Compliance Log — Protocol v4.2</p>
          </div>
          <span className="px-3 py-1 bg-white border border-slate-200 text-slate-500 rounded-full text-[9px] font-black uppercase tracking-widest">
            {datasets.length} Active Records
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] uppercase tracking-wider text-slate-400 font-black">
                <th className="p-8">Anonymized Identifier</th>
                <th className="p-8">Timestamp</th>
                <th className="p-8">Source Attribution</th>
                <th className="p-8">Granularity</th>
                <th className="p-8">Log Integrity</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {datasets.map((d) => (
                <tr key={d.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors group">
                  <td className="p-8">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-lg">📄</div>
                      <div>
                        <span className="font-black text-slate-800 block leading-none mb-1">{d.name}</span>
                        <span className="text-[10px] text-slate-400 font-mono tracking-tighter uppercase">{d.id}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-8 text-slate-500 font-medium">{d.uploadDate}</td>
                  <td className="p-8">
                     <span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-[9px] font-black rounded uppercase tracking-tighter">{d.source}</span>
                  </td>
                  <td className="p-8 text-slate-800 font-black tracking-tight">{d.records.toLocaleString()} Points</td>
                  <td className="p-8">
                    <div className="flex items-center gap-2">
                       <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                       <span className="text-[10px] font-black text-emerald-600 uppercase">VERIFIED</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Upload;
