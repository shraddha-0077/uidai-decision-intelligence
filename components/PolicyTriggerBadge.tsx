
import React from 'react';

interface PolicyTriggerBadgeProps {
  lfi: number;
  compact?: boolean;
}

export const PolicyTriggerBadge: React.FC<PolicyTriggerBadgeProps> = ({ lfi, compact = false }) => {
  const getTier = () => {
    if (lfi > 0.6) return {
      label: 'Immediate Intervention',
      tag: 'CRITICAL',
      color: 'bg-red-600 text-white',
      border: 'border-red-700',
      action: 'Dispatch mobile units & suspend failing operators.'
    };
    if (lfi > 0.3) return {
      label: 'Capacity Review',
      tag: 'MODERATE',
      color: 'bg-orange-500 text-white',
      border: 'border-orange-600',
      action: 'Initiate Registrar capacity audit and training.'
    };
    return {
      label: 'Routine Monitor',
      tag: 'HEALTHY',
      color: 'bg-emerald-600 text-white',
      border: 'border-emerald-700',
      action: 'Maintain baseline performance monitoring.'
    };
  };

  const tier = getTier();

  if (compact) {
    return (
      <div className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-tighter ${tier.color}`}>
        {tier.tag}
      </div>
    );
  }

  return (
    <div className={`p-3 rounded-xl border ${tier.color} ${tier.border} flex flex-col gap-1 shadow-sm`}>
      <div className="flex justify-between items-center">
        <span className="text-[10px] font-black uppercase tracking-widest opacity-80">Policy Trigger</span>
        <span className="text-[10px] font-bold">{tier.label}</span>
      </div>
      <p className="text-[11px] font-medium leading-tight">
        {tier.action}
      </p>
    </div>
  );
};
