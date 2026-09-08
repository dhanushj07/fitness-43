import React from 'react';

export type BadgeVariant = 
  | 'active' 
  | 'expiring' 
  | 'expired' 
  | 'frozen' 
  | 'present' 
  | 'absent' 
  | 'leave' 
  | 'confirmed' 
  | 'completed' 
  | 'cancelled'
  | 'succeeded'
  | 'pending'
  | 'failed'
  | 'lime'
  | 'slate';

interface StatusBadgeProps {
  status: string;
  variant?: BadgeVariant;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, variant, className = '' }) => {
  const normalized = (variant || status.toLowerCase()) as BadgeVariant;

  const styleMap: Record<string, { bg: string; text: string; dot: string; label: string }> = {
    active: { bg: 'bg-emerald-500/10 border-emerald-500/30', text: 'text-emerald-400', dot: 'bg-emerald-400', label: 'Active' },
    expiring: { bg: 'bg-amber-500/10 border-amber-500/30', text: 'text-amber-400', dot: 'bg-amber-400', label: 'Expiring Soon' },
    expired: { bg: 'bg-rose-500/10 border-rose-500/30', text: 'text-rose-400', dot: 'bg-rose-400', label: 'Expired' },
    frozen: { bg: 'bg-sky-500/10 border-sky-500/30', text: 'text-sky-400', dot: 'bg-sky-400', label: 'Frozen' },
    
    present: { bg: 'bg-emerald-500/10 border-emerald-500/30', text: 'text-emerald-400', dot: 'bg-emerald-400', label: 'Present' },
    absent: { bg: 'bg-rose-500/10 border-rose-500/30', text: 'text-rose-400', dot: 'bg-rose-400', label: 'Absent' },
    leave: { bg: 'bg-indigo-500/10 border-indigo-500/30', text: 'text-indigo-400', dot: 'bg-indigo-400', label: 'Leave' },
    
    confirmed: { bg: 'bg-[#22C55E]/10 border-[#22C55E]/30', text: 'text-[#22C55E]', dot: 'bg-[#22C55E]', label: 'Confirmed' },
    completed: { bg: 'bg-cyan-500/10 border-cyan-500/30', text: 'text-cyan-400', dot: 'bg-cyan-400', label: 'Completed' },
    cancelled: { bg: 'bg-slate-700/30 border-slate-600', text: 'text-slate-400', dot: 'bg-slate-500', label: 'Cancelled' },
    
    succeeded: { bg: 'bg-emerald-500/10 border-emerald-500/30', text: 'text-emerald-400', dot: 'bg-emerald-400', label: 'Paid' },
    pending: { bg: 'bg-amber-500/10 border-amber-500/30', text: 'text-amber-400', dot: 'bg-amber-400', label: 'Pending' },
    failed: { bg: 'bg-rose-500/10 border-rose-500/30', text: 'text-rose-400', dot: 'bg-rose-400', label: 'Failed' },
    
    lime: { bg: 'bg-[#22C55E]/15 border-[#22C55E]/40', text: 'text-[#22C55E]', dot: 'bg-[#22C55E]', label: status },
    slate: { bg: 'bg-slate-800 border-slate-700', text: 'text-slate-300', dot: 'bg-slate-400', label: status },
  };

  const current = styleMap[normalized] || {
    bg: 'bg-slate-800 border-slate-700',
    text: 'text-slate-300',
    dot: 'bg-slate-400',
    label: status,
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border tracking-wide whitespace-nowrap ${current.bg} ${current.text} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${current.dot} shrink-0 animate-pulse`} />
      <span>{current.label}</span>
    </span>
  );
};
