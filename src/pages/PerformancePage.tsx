import React, { useState } from 'react';
import {
  TrendingUp,
  Activity,
  Flame,
  Scale,
  Ruler,
  Target,
  Plus,
  Dumbbell,
  CheckCircle2,
  Calendar,
} from 'lucide-react';
import { PerformanceMetric, FitnessGoal } from '../types';
import { WeightChart } from '../components/charts/WeightChart';
import { StrengthLineChart } from '../components/charts/StrengthLineChart';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { Input } from '../components/common/Input';
import { calculateBMI } from '../utils/formatters';

interface PerformancePageProps {
  metrics: PerformanceMetric[];
  goals: FitnessGoal[];
  onAddMetric: (metric: PerformanceMetric) => void;
  onUpdateGoal: (id: string, updates: Partial<FitnessGoal>) => void;
  heightCm: number;
}

export const PerformancePage: React.FC<PerformancePageProps> = ({
  metrics,
  goals,
  onAddMetric,
  onUpdateGoal,
  heightCm,
}) => {
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [newWeight, setNewWeight] = useState('78.0');
  const [newBench, setNewBench] = useState('102.5');
  const [newSquat, setNewSquat] = useState('137.5');
  const [newDeadlift, setNewDeadlift] = useState('167.5');
  const [newWaist, setNewWaist] = useState('79.5');

  const latest = metrics[metrics.length - 1] || {
    date: '2026-09-08',
    weightKg: 78.4,
    bmi: 24.2,
    bodyFatPercent: 15.2,
    chestCm: 108.5,
    waistCm: 80,
    bicepCm: 38.5,
    thighCm: 61.5,
    benchPressKg: 100,
    squatKg: 135,
    deadliftKg: 165,
  };

  const initial = metrics[0] || latest;
  const weightLost = (initial.weightKg - latest.weightKg).toFixed(1);
  const bmiInfo = calculateBMI(latest.weightKg, heightCm);

  const handleSaveMetric = () => {
    const w = parseFloat(newWeight) || latest.weightKg;
    const computedBmi = calculateBMI(w, heightCm).bmi;

    const newMetric: PerformanceMetric = {
      date: new Date().toISOString().split('T')[0],
      weightKg: w,
      bmi: computedBmi,
      bodyFatPercent: Math.max(10, latest.bodyFatPercent - 0.2),
      chestCm: latest.chestCm,
      waistCm: parseFloat(newWaist) || latest.waistCm,
      bicepCm: latest.bicepCm,
      thighCm: latest.thighCm,
      benchPressKg: parseFloat(newBench) || latest.benchPressKg,
      squatKg: parseFloat(newSquat) || latest.squatKg,
      deadliftKg: parseFloat(newDeadlift) || latest.deadliftKg,
    };

    onAddMetric(newMetric);
    setIsLogModalOpen(false);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-[#0F172A] border border-white/10 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-[#22C55E] uppercase tracking-wider">
            Biometric & Progressive Performance
          </span>
          <h2 className="text-2xl font-black text-white mt-1">Athletic Evolution Tracker</h2>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            Monitor body composition shifts, circumference measurements, and progressive overload on compound lifts.
          </p>
        </div>

        <Button
          id="log-new-biometrics-btn"
          variant="primary"
          size="md"
          onClick={() => setIsLogModalOpen(true)}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Log New Biometrics
        </Button>
      </div>

      {/* 4 Summary Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#0D1527] border border-white/5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400">Current Weight</span>
            <Scale className="w-4 h-4 text-[#22C55E]" />
          </div>
          <div>
            <div className="text-2xl font-black text-white">{latest.weightKg} kg</div>
            <p className="text-xs text-[#22C55E] font-medium mt-1">-{weightLost} kg total change</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0D1527] border border-white/5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400">BMI Index</span>
            <Activity className="w-4 h-4 text-sky-400" />
          </div>
          <div>
            <div className="text-2xl font-black text-white">{latest.bmi}</div>
            <p className={`text-xs font-bold mt-1 ${bmiInfo.color}`}>{bmiInfo.category}</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0D1527] border border-white/5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400">Estimated Body Fat</span>
            <Flame className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <div className="text-2xl font-black text-amber-400">{latest.bodyFatPercent}%</div>
            <p className="text-xs text-slate-400 mt-1">Down from {initial.bodyFatPercent}%</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0D1527] border border-white/5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400">Total 3-Lift Total</span>
            <Dumbbell className="w-4 h-4 text-purple-400" />
          </div>
          <div>
            <div className="text-2xl font-black text-white">
              {latest.benchPressKg + latest.squatKg + latest.deadliftKg} kg
            </div>
            <p className="text-xs text-emerald-400 font-semibold mt-1">
              +{(latest.benchPressKg + latest.squatKg + latest.deadliftKg) - (initial.benchPressKg + initial.squatKg + initial.deadliftKg)} kg overall PR
            </p>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weight Curve */}
        <div className="p-6 rounded-3xl bg-[#0F172A] border border-white/10 shadow-xl">
          <WeightChart data={metrics} />
        </div>

        {/* Strength Curve */}
        <div className="p-6 rounded-3xl bg-[#0F172A] border border-white/10 shadow-xl">
          <StrengthLineChart data={metrics} />
        </div>
      </div>

      {/* Body Measurements & Goals Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Body Circumference Measurements */}
        <div className="lg:col-span-6 p-6 rounded-3xl bg-[#0F172A] border border-white/10 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Ruler className="w-5 h-5 text-[#22C55E]" />
              <h3 className="text-base font-bold text-white">Body Circumference Tape Measurements</h3>
            </div>
            <span className="text-xs text-slate-400">Centimeters (cm)</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-2xl bg-[#0B1120] border border-white/5 text-center">
              <span className="text-[11px] font-semibold text-slate-400 block mb-1">Chest</span>
              <span className="text-xl font-black text-white">{latest.chestCm} cm</span>
              <span className="text-[10px] text-[#22C55E] block mt-1">+4.5 cm</span>
            </div>

            <div className="p-4 rounded-2xl bg-[#0B1120] border border-white/5 text-center">
              <span className="text-[11px] font-semibold text-slate-400 block mb-1">Waist</span>
              <span className="text-xl font-black text-white">{latest.waistCm} cm</span>
              <span className="text-[10px] text-[#22C55E] block mt-1">-9.0 cm</span>
            </div>

            <div className="p-4 rounded-2xl bg-[#0B1120] border border-white/5 text-center">
              <span className="text-[11px] font-semibold text-slate-400 block mb-1">Arms / Biceps</span>
              <span className="text-xl font-black text-white">{latest.bicepCm} cm</span>
              <span className="text-[10px] text-[#22C55E] block mt-1">+2.5 cm</span>
            </div>

            <div className="p-4 rounded-2xl bg-[#0B1120] border border-white/5 text-center">
              <span className="text-[11px] font-semibold text-slate-400 block mb-1">Thighs</span>
              <span className="text-xl font-black text-white">{latest.thighCm} cm</span>
              <span className="text-[10px] text-[#22C55E] block mt-1">+2.5 cm</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#0B1120] border border-white/5 text-xs text-slate-400 flex items-center justify-between">
            <span>Next InBody medical scan scheduled:</span>
            <span className="font-bold text-white">September 22, 2026</span>
          </div>
        </div>

        {/* Personal Fitness Goals */}
        <div className="lg:col-span-6 p-6 rounded-3xl bg-[#0F172A] border border-white/10 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-[#22C55E]" />
              <h3 className="text-base font-bold text-white">Quarterly Milestones & Goals</h3>
            </div>
            <span className="text-xs text-slate-400">{goals.length} Active</span>
          </div>

          <div className="space-y-3">
            {goals.map(goal => (
              <div
                key={goal.id}
                className="p-4 rounded-2xl bg-[#0B1120] border border-white/5 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-bold text-white">{goal.title}</span>
                    <span className="text-xs text-slate-400 block mt-0.5">
                      Target: {goal.targetValue} • Current: {goal.currentValue}
                    </span>
                  </div>
                  <span className={`text-xs font-black ${goal.progressPercent >= 100 ? 'text-[#22C55E]' : 'text-slate-300'}`}>
                    {goal.progressPercent}%
                  </span>
                </div>

                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      goal.progressPercent >= 100 ? 'bg-[#22C55E] shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-sky-400'
                    }`}
                    style={{ width: `${Math.min(100, goal.progressPercent)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Log Metric Modal */}
      <Modal
        isOpen={isLogModalOpen}
        onClose={() => setIsLogModalOpen(false)}
        title="Log Today's Biometric Assessment"
        subtitle="Record your updated weight and 1RM lifts"
        maxWidth="md"
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setIsLogModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleSaveMetric}>
              Save Metrics
            </Button>
          </>
        }
      >
        <div className="space-y-3.5">
          <Input
            label="Body Weight (kg)"
            type="number"
            step="0.1"
            value={newWeight}
            onChange={(e) => setNewWeight(e.target.value)}
          />
          <div className="grid grid-cols-3 gap-2">
            <Input
              label="Bench 1RM (kg)"
              type="number"
              value={newBench}
              onChange={(e) => setNewBench(e.target.value)}
            />
            <Input
              label="Squat 1RM (kg)"
              type="number"
              value={newSquat}
              onChange={(e) => setNewSquat(e.target.value)}
            />
            <Input
              label="Deadlift 1RM (kg)"
              type="number"
              value={newDeadlift}
              onChange={(e) => setNewDeadlift(e.target.value)}
            />
          </div>
          <Input
            label="Waist Circumference (cm)"
            type="number"
            step="0.5"
            value={newWaist}
            onChange={(e) => setNewWaist(e.target.value)}
          />
        </div>
      </Modal>
    </div>
  );
};
