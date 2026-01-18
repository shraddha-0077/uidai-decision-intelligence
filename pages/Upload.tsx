
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

    // Simulate multi-step validation
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
    }, 2500);
  };

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-2xl border-2 border-dashed border-slate-200 p-12 text-center">
        <input 
          type="file" 
          id="file-upload" 
          className="hidden" 
          accept=".csv"
          onChange={handleFileUpload}
          disabled={isUploading}
        />
        <label 
          htmlFor="file-upload"
          className="cursor-pointer group"
        >
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-100 transition-colors">
            <span className="text-2xl">📥</span>
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-1">Upload Anonymized Dataset</h3>
          <p className="text-slate-500 text-sm max-w-sm mx-auto mb-6">
            Files must be strictly CSV format and follow the UIDAI Anonymization Protocol (Level 3).
          </p>
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-200 group-hover:bg-blue-700 transition-all">
            {isUploading ? 'Validating Schema...' : 'Select CSV File'}
          </div>
        </label>

        {uploadStatus === 'validating' && (
          <div className="mt-6 flex flex-col items-center gap-3">
            <div className="w-48 h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 animate-[progress_2s_ease-in-out_infinite]" style={{ width: '40%' }}></div>
            </div>
            <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">Running Anomaly Check & Schema Validation...</p>
          </div>
        )}

        {uploadStatus === 'success' && !isUploading && (
          <div className="mt-6 p-4 bg-green-50 text-green-700 border border-green-200 rounded-xl inline-flex items-center gap-3">
            <span className="text-xl">✅</span>
            <div className="text-left">
              <p className="text-xs font-bold uppercase tracking-tight">Dataset Verified</p>
              <p className="text-[10px]">Data ingested and Decision Intelligence Engine initialized.</p>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h3 className="font-bold text-slate-800">Dataset History</h3>
          <span className="text-slate-400 text-xs">Aadhaar Data Governance Protocol v4.2</span>
        </div>
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-slate-100 text-[10px] uppercase tracking-wider text-slate-400 font-bold">
              <th className="p-6">Dataset Name</th>
              <th className="p-6">Ingestion Date</th>
              <th className="p-6">Source/Office</th>
              <th className="p-6">Record Count</th>
              <th className="p-6">Status</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {datasets.map((d) => (
              <tr key={d.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors">
                <td className="p-6">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">📄</span>
                    <span className="font-semibold text-slate-700">{d.name}</span>
                  </div>
                </td>
                <td className="p-6 text-slate-500">{d.uploadDate}</td>
                <td className="p-6 text-slate-500">{d.source}</td>
                <td className="p-6 text-slate-800 font-medium">{d.records.toLocaleString()}</td>
                <td className="p-6">
                  <span className="px-2 py-1 bg-green-50 text-green-600 rounded text-[10px] font-bold border border-green-100">
                    CLEANED
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <style>{`
        @keyframes progress {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(250%); }
        }
      `}</style>
    </div>
  );
};

export default Upload;
