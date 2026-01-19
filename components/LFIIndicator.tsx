
import React from 'react';

export const LFIIndicator: React.FC<{ score: number; labelText?: string }> = ({ score, labelText = "Composite Risk Index (CRS)" }) => {
  const getColor = () => {
    if (score > 0.6) return 'bg-red-500';
    if (score > 0.3) return 'bg-orange-500';
    return 'bg-emerald-500';
  };

  const getLabel = () => {
    if (score > 0.6) return 'High Friction / Action Required';
    if (score > 0.3) return 'Moderate Latency';
    return 'Optimal Flow';
  };

  return (
    <div className="flex flex-col gap-1">
      <div className="flex justify-between items-center">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{labelText}</span>
        <span className={`text-xs font-black ${score > 0.6 ? 'text-red-600' : 'text-slate-700'}`}>
          {score.toFixed(2)}
        </span>
      </div>
      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
        <div 
          className={`h-full transition-all duration-1000 ${getColor()}`} 
          style={{ width: `${score * 100}%` }}
        />
      </div>
      <span className="text-[9px] font-medium text-slate-500 italic">{getLabel()}</span>
    </div>
  );
};
