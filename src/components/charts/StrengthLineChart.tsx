import React, { useState } from 'react';
import { PerformanceMetric } from '../../types';

interface StrengthLineChartProps {
  data: PerformanceMetric[];
}

export const StrengthLineChart: React.FC<StrengthLineChartProps> = ({ data }) => {
  const [activeLift, setActiveLift] = useState<'all' | 'bench' | 'squat' | 'deadlift'>('all');

  if (!data || data.length === 0) return null;

  const width = 500;
  const height = 220;
  const paddingX = 45;
  const paddingY = 30;

  const innerW = width - paddingX * 2;
  const innerH = height - paddingY * 2;

  const maxVal = 180;
  const minVal = 70;
  const range = maxVal - minVal;

  const getY = (val: number) => height - paddingY - ((val - minVal) / range) * innerH;
  const getX = (index: number) => paddingX + (index / (data.length - 1)) * innerW;

  const benchPoints = data.map((d, i) => ({ x: getX(i), y: getY(d.benchPressKg), val: d.benchPressKg, date: d.date }));
  const squatPoints = data.map((d, i) => ({ x: getX(i), y: getY(d.squatKg), val: d.squatKg, date: d.date }));
  const deadliftPoints = data.map((d, i) => ({ x: getX(i), y: getY(d.deadliftKg), val: d.deadliftKg, date: d.date }));

  const makePath = (pts: { x: number; y: number }[]) =>
    pts.reduce((acc, p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`), '');

  return (
    <div className="w-full">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div>
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Compound Lifts (1RM in kg)</span>
          <div className="text-sm text-slate-300">Progressive overload across 6 months</div>
        </div>
        <div className="flex items-center gap-2 bg-[#0D1527] p-1 rounded-lg border border-white/5 text-xs">
          <button
            onClick={() => setActiveLift('all')}
            className={`px-2.5 py-1 rounded-md transition-colors ${activeLift === 'all' ? 'bg-white/10 text-white font-semibold' : 'text-slate-400 hover:text-white'}`}
          >
            All
          </button>
          <button
            onClick={() => setActiveLift('deadlift')}
            className={`px-2.5 py-1 rounded-md transition-colors ${activeLift === 'deadlift' ? 'bg-amber-500/20 text-amber-400 font-semibold' : 'text-slate-400 hover:text-white'}`}
          >
            Deadlift
          </button>
          <button
            onClick={() => setActiveLift('squat')}
            className={`px-2.5 py-1 rounded-md transition-colors ${activeLift === 'squat' ? 'bg-[#22C55E]/20 text-[#22C55E] font-semibold' : 'text-slate-400 hover:text-white'}`}
          >
            Squat
          </button>
          <button
            onClick={() => setActiveLift('bench')}
            className={`px-2.5 py-1 rounded-md transition-colors ${activeLift === 'bench' ? 'bg-sky-500/20 text-sky-400 font-semibold' : 'text-slate-400 hover:text-white'}`}
          >
            Bench
          </button>
        </div>
      </div>

      <div className="w-full overflow-hidden">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-48 overflow-visible">
          {/* Grid */}
          {[minVal, 100, 140, maxVal].map((val, i) => {
            const y = getY(val);
            return (
              <g key={i}>
                <line x1={paddingX} y1={y} x2={width - paddingX} y2={y} stroke="#1E293B" strokeDasharray="3 3" />
                <text x={paddingX - 8} y={y + 3} fill="#64748B" fontSize="10" textAnchor="end">
                  {val}kg
                </text>
              </g>
            );
          })}

          {/* Dates */}
          {data.map((d, i) => (
            <text
              key={i}
              x={getX(i)}
              y={height - paddingY + 16}
              fill="#94A3B8"
              fontSize="10"
              textAnchor="middle"
            >
              {d.date.slice(5)}
            </text>
          ))}

          {/* Deadlift Line (Amber) */}
          {(activeLift === 'all' || activeLift === 'deadlift') && (
            <>
              <path d={makePath(deadliftPoints)} fill="none" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" />
              {deadliftPoints.map((p, i) => (
                <circle key={i} cx={p.x} cy={p.y} r="3.5" fill="#0B1120" stroke="#F59E0B" strokeWidth="2" />
              ))}
            </>
          )}

          {/* Squat Line (Electric Green) */}
          {(activeLift === 'all' || activeLift === 'squat') && (
            <>
              <path d={makePath(squatPoints)} fill="none" stroke="#22C55E" strokeWidth="2.5" strokeLinecap="round" />
              {squatPoints.map((p, i) => (
                <circle key={i} cx={p.x} cy={p.y} r="3.5" fill="#0B1120" stroke="#22C55E" strokeWidth="2" />
              ))}
            </>
          )}

          {/* Bench Line (Sky Blue) */}
          {(activeLift === 'all' || activeLift === 'bench') && (
            <>
              <path d={makePath(benchPoints)} fill="none" stroke="#38BDF8" strokeWidth="2.5" strokeLinecap="round" />
              {benchPoints.map((p, i) => (
                <circle key={i} cx={p.x} cy={p.y} r="3.5" fill="#0B1120" stroke="#38BDF8" strokeWidth="2" />
              ))}
            </>
          )}
        </svg>
      </div>

      <div className="flex items-center justify-center gap-6 mt-3 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <span className="w-3 h-1 bg-[#F59E0B] rounded-full" />
          <span>Deadlift ({data[data.length - 1].deadliftKg} kg)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-1 bg-[#22C55E] rounded-full" />
          <span>Squat ({data[data.length - 1].squatKg} kg)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-1 bg-[#38BDF8] rounded-full" />
          <span>Bench ({data[data.length - 1].benchPressKg} kg)</span>
        </div>
      </div>
    </div>
  );
};
