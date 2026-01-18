
import React from 'react';
import { DecisionSignal } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface DecisionCardProps {
  signal: DecisionSignal;
  onExport: (id: string) => void;
}

const DecisionCard: React.FC<DecisionCardProps> = ({ signal, onExport }) => {
  const severityColors = {
    HIGH: 'border-red-500 bg-red-50 text-red-700',
    MEDIUM: 'border-orange-400 bg-orange-50 text-orange-700',
    LOW: 'border-blue-400 bg-blue-50 text-blue-700',
  };

  const severityDot = {
    HIGH: 'bg-red-500',
    MEDIUM: 'bg-orange-500',
    LOW: 'bg-blue-500',
  };

  // Dummy chart data related to the signal
  const chartData = [
    { name: 'District Avg', value: signal.metricValue * 0.8 },
    { name: 'Target', value: 85 },
    { name: 'Current', value: signal.metricValue },
  ];

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col md:flex-row">
      <div className={`w-2 md:w-3 shrink-0 ${severityDot[signal.severity]}`}></div>
      
      <div className="p-6 flex-1">
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${severityColors[signal.severity]}`}>
                {signal.severity} Priority {signal.type}
              </span>
              <span className="text-slate-400 text-xs font-medium">{signal.district}</span>
            </div>
            <h3 className="text-xl font-bold text-slate-800">{signal.title}</h3>
          </div>
          <button 
            onClick={() => onExport(signal.id)}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors"
          >
            Export Brief
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">What the data shows</h4>
              <p className="text-slate-600 leading-relaxed text-sm bg-slate-50 p-3 rounded-lg border border-slate-100 italic">
                "{signal.dataSummary}"
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-slate-100 bg-white">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Impact Assessment</h4>
                <p className="text-slate-700 text-sm font-medium leading-snug">
                  {signal.whyItMatters}
                </p>
              </div>
              <div className="p-4 rounded-xl border border-blue-100 bg-blue-50">
                <h4 className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-2">Policy Recommendation</h4>
                <p className="text-slate-800 text-sm font-bold leading-snug">
                  {signal.recommendedAction}
                </p>
              </div>
            </div>
          </div>

          <div className="h-48 lg:h-auto min-h-[200px] border border-slate-100 rounded-xl p-4 bg-slate-50/30">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Visualization: Gap Analysis</h4>
            <ResponsiveContainer width="100%" height="80%">
              <BarChart data={chartData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={80} style={{ fontSize: '10px', fontWeight: 'bold' }} />
                <Tooltip />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={24}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 2 ? '#3b82f6' : '#94a3b8'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div className="text-[10px] text-center text-slate-400 font-medium mt-2">
              Metric: {signal.metricValue}% achievement against benchmark
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DecisionCard;
