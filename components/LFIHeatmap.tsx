
import React from 'react';
import { DistrictALDPI } from '../types';

interface LFIHeatmapProps {
  districts: DistrictALDPI[];
  onSelect: (d: DistrictALDPI) => void;
  selectedId?: string;
}

export const LFIHeatmap: React.FC<LFIHeatmapProps> = ({ districts, onSelect, selectedId }) => {
  // 10x10 Grid Stylized Map
  const grid = Array(10).fill(null).map(() => Array(10).fill(null));

  districts.forEach(d => {
    if (d.coords.x >= 0 && d.coords.x < 10 && d.coords.y >= 0 && d.coords.y < 10) {
      grid[d.coords.y][d.coords.x] = d;
    }
  });

  const getHeatColor = (lfi: number) => {
    if (lfi > 0.6) return 'bg-red-500 shadow-lg shadow-red-500/30';
    if (lfi > 0.45) return 'bg-orange-500 shadow-md shadow-orange-500/20';
    if (lfi > 0.3) return 'bg-yellow-400 shadow-sm shadow-yellow-400/10';
    return 'bg-emerald-500 shadow-sm shadow-emerald-500/10';
  };

  const isSaturated = (d: DistrictALDPI) => {
    // Check neighbors to see if we have 3+ adjacent high-friction districts
    const neighbors = districts.filter(other => 
      other.id !== d.id && 
      other.lfi > 0.55 &&
      Math.abs(other.coords.x - d.coords.x) <= 1 &&
      Math.abs(other.coords.y - d.coords.y) <= 1
    );
    return neighbors.length >= 2; // Self + 2 neighbors = 3
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            National Friction Heatmap
            <span className="text-[10px] font-normal text-slate-400"> (Stylized Geo-Grid)</span>
          </h3>
          <p className="text-[10px] text-slate-500 font-medium">ALDPI Real-time Operational Telemetry</p>
        </div>
        <div className="flex gap-2">
           <div className="flex items-center gap-1">
             <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
             <span className="text-[9px] text-slate-400 font-bold">HEALTHY</span>
           </div>
           <div className="flex items-center gap-1">
             <div className="w-2 h-2 rounded-full bg-red-500"></div>
             <span className="text-[9px] text-slate-400 font-bold">CRITICAL</span>
           </div>
        </div>
      </div>

      <div className="relative aspect-square md:aspect-auto md:h-[400px] grid grid-cols-10 grid-rows-10 gap-1.5 p-2 bg-slate-50 rounded-xl border border-slate-100">
        {grid.map((row, y) => 
          row.map((district, x) => {
            if (!district) return <div key={`${x}-${y}`} className="bg-slate-100/50 rounded-md"></div>;
            
            const saturated = district.lfi > 0.6 && isSaturated(district);
            
            return (
              <button
                key={district.id}
                onClick={() => onSelect(district)}
                className={`group relative rounded-md transition-all duration-300 transform hover:scale-110 hover:z-10 ${getHeatColor(district.lfi)} 
                  ${selectedId === district.id ? 'ring-2 ring-blue-600 ring-offset-2 scale-105 z-10' : ''}
                  ${saturated ? 'animate-pulse ring-1 ring-red-400 ring-offset-1' : ''}`}
                title={`${district.name} (${district.state}): LFI ${district.lfi.toFixed(2)}`}
              >
                {/* Saturation Mode Indicator */}
                {saturated && (
                  <div className="absolute inset-0 bg-red-400/20 blur-md rounded-full pointer-events-none"></div>
                )}
                
                {/* Tooltip Overlay */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-32 hidden group-hover:block z-50 pointer-events-none">
                  <div className="bg-slate-900 text-white text-[9px] p-2 rounded-lg shadow-xl border border-slate-700">
                    <p className="font-black uppercase">{district.name}</p>
                    <p className="text-slate-400">LFI: {district.lfi.toFixed(2)}</p>
                    <div className="mt-1 h-1 w-full bg-slate-700 rounded-full overflow-hidden">
                      <div className="h-full bg-white" style={{ width: `${district.lfi * 100}%` }}></div>
                    </div>
                  </div>
                  <div className="w-2 h-2 bg-slate-900 rotate-45 mx-auto -mt-1 border-r border-b border-slate-700"></div>
                </div>
              </button>
            );
          })
        )}
      </div>

      <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded-lg flex items-center gap-3">
        <div className="w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
        <p className="text-[10px] text-red-700 font-bold leading-tight uppercase tracking-tight">
          Saturation Detected: Maharashtra & North Clusters show high regional friction (LFI > 0.60)
        </p>
      </div>
    </div>
  );
};
