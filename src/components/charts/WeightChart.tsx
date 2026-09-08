import React, { useState } from 'react';
import { PerformanceMetric } from '../../types';

interface WeightChartProps {
  data: PerformanceMetric[];
}

export const WeightChart: React.FC<WeightChartProps> = ({ data }) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  if (!data || data.length === 0) return null;

  const weights = data.map(d => d.weightKg);
  const minW = Math.min(...weights) - 2;
  const maxW = Math.max(...weights) + 2;
  const range = maxW - minW || 1;

  const width = 500;
  const height = 200;
  const paddingX = 40;
  const paddingY = 30;

  const innerW = width - paddingX * 2;
  const innerH = height - paddingY * 2;

  const points = data.map((d, i) => {
    const x = paddingX + (i / (data.length - 1)) * innerW;
    const y = height - paddingY - ((d.weightKg - minW) / range) * innerH;
    return { x, y, ...d };
  });

  const pathD = points.reduce((acc, p, i) => {
    return i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
  }, '');

  const areaD = `${pathD} L ${points[points.length - 1].x} ${height - paddingY} L ${points[0].x} ${height - paddingY} Z`;

  return (
    <div className="w-full relative">
      <div className="flex items-center justify-between mb-3">
        <div>
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Weight Progression</span>
          <div className="text-xl font-bold text-white flex items-baseline gap-2">
            <span>{data[data.length - 1].weightKg} kg</span>
            <span className="text-xs font-medium text-[#22C55E]">
              -{(data[0].weightKg - data[data.length - 1].weightKg).toFixed(1)} kg overall
            </span>
          </div>
        </div>
        <div className="text-xs text-slate-400">
          Target: <span className="font-semibold text-white">75.0 kg</span>
        </div>
      </div>

      <div className="w-full overflow-hidden">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-44 overflow-visible">
          <defs>
            <linearGradient id="weightGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#22C55E" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#22C55E" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[0, 0.5, 1].map((ratio, i) => {
            const yVal = height - paddingY - ratio * innerH;
            const wLabel = (minW + ratio * range).toFixed(0);
            return (
              <g key={i}>
                <line
                  x1={paddingX}
                  y1={yVal}
                  x2={width - paddingX}
                  y2={yVal}
                  stroke="#1E293B"
                  strokeDasharray="4 4"
                />
                <text x={paddingX - 10} y={yVal + 3} fill="#64748B" fontSize="10" textAnchor="end">
                  {wLabel}kg
                </text>
              </g>
            );
          })}

          {/* Filled Area */}
          <path d={areaD} fill="url(#weightGradient)" />

          {/* Stroke Line */}
          <path
            d={pathD}
            fill="none"
            stroke="#22C55E"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Interactive dots */}
          {points.map((p, i) => (
            <g
              key={i}
              className="cursor-pointer"
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              <circle
                cx={p.x}
                cy={p.y}
                r={hoveredIdx === i ? 6 : 4}
                fill={hoveredIdx === i ? '#22C55E' : '#0B1120'}
                stroke="#22C55E"
                strokeWidth="2.5"
                className="transition-all duration-150"
              />
              <text
                x={p.x}
                y={height - paddingY + 18}
                fill="#94A3B8"
                fontSize="10"
                textAnchor="middle"
              >
                {p.date.slice(5)}
              </text>
            </g>
          ))}
        </svg>
      </div>

      {hoveredIdx !== null && (
        <div
          className="absolute z-10 px-2.5 py-1.5 rounded-lg bg-[#0F172A] border border-white/20 text-xs shadow-xl pointer-events-none transform -translate-x-1/2 -translate-y-full"
          style={{
            left: `${(points[hoveredIdx].x / width) * 100}%`,
            top: `${(points[hoveredIdx].y / height) * 100 + 10}%`,
          }}
        >
          <span className="font-bold text-white">{points[hoveredIdx].weightKg} kg</span>
          <span className="text-slate-400 block text-[10px]">BMI {points[hoveredIdx].bmi}</span>
        </div>
      )}
    </div>
  );
};
