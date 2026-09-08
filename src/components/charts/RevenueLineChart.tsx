import React from 'react';
import { formatCurrency } from '../../utils/formatters';

interface RevenueLineChartProps {
  currentMonthly: number;
  growth: number;
}

export const RevenueLineChart: React.FC<RevenueLineChartProps> = ({ currentMonthly, growth }) => {
  const months = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];
  const values = [24500, 26800, 28900, 31200, 32600, currentMonthly];

  const width = 500;
  const height = 180;
  const padX = 45;
  const padY = 25;

  const innerW = width - padX * 2;
  const innerH = height - padY * 2;

  const minV = 20000;
  const maxV = 40000;
  const range = maxV - minV;

  const points = values.map((v, i) => {
    const x = padX + (i / (values.length - 1)) * innerW;
    const y = height - padY - ((v - minV) / range) * innerH;
    return { x, y, v, month: months[i] };
  });

  const pathD = points.reduce((acc, p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`), '');
  const areaD = `${pathD} L ${points[points.length - 1].x} ${height - padY} L ${points[0].x} ${height - padY} Z`;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <div>
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Monthly Recurring Revenue</span>
          <div className="text-2xl font-black text-white">{formatCurrency(currentMonthly)}</div>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
          <span>+{growth}% vs last month</span>
        </div>
      </div>

      <div className="w-full overflow-hidden">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-40 overflow-visible">
          <defs>
            <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#22C55E" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#22C55E" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Guidelines */}
          {[20000, 30000, 40000].map((val, idx) => {
            const y = height - padY - ((val - minV) / range) * innerH;
            return (
              <g key={idx}>
                <line x1={padX} y1={y} x2={width - padX} y2={y} stroke="#1E293B" strokeDasharray="3 3" />
                <text x={padX - 8} y={y + 3} fill="#64748B" fontSize="10" textAnchor="end">
                  ${val / 1000}k
                </text>
              </g>
            );
          })}

          {/* Area */}
          <path d={areaD} fill="url(#revenueGradient)" />

          {/* Line */}
          <path d={pathD} fill="none" stroke="#22C55E" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

          {/* Dots */}
          {points.map((p, i) => (
            <g key={i}>
              <circle cx={p.x} cy={p.y} r="4" fill="#0B1120" stroke="#22C55E" strokeWidth="2.5" />
              <text x={p.x} y={height - padY + 15} fill="#94A3B8" fontSize="10" textAnchor="middle">
                {p.month}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
};
