import React, { useState } from 'react';
import {
  Dumbbell,
  CheckCircle2,
  Clock,
  RotateCcw,
  Flame,
  CheckCheck,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { WorkoutPlan } from '../types';
import { Button } from '../components/common/Button';

interface WorkoutPlansPageProps {
  plans: WorkoutPlan[];
  activePlanId: string;
  onSelectPlan: (planId: string) => void;
  onToggleExercise: (planId: string, exerciseId: string) => void;
  onResetCompleted: (planId: string) => void;
}

export const WorkoutPlansPage: React.FC<WorkoutPlansPageProps> = ({
  plans,
  activePlanId,
  onSelectPlan,
  onToggleExercise,
  onResetCompleted,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const activePlan = plans.find(p => p.id === activePlanId) || plans[0];

  const categories = ['All', 'Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Cardio'];

  const filteredPlans = selectedCategory === 'All'
    ? plans
    : plans.filter(p => p.category === selectedCategory || p.exercises.some(e => e.category === selectedCategory));

  const totalEx = activePlan?.exercises.length || 0;
  const completedEx = activePlan?.exercises.filter(e => e.completed).length || 0;
  const completionPercent = totalEx > 0 ? Math.round((completedEx / totalEx) * 100) : 0;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              selectedCategory === cat
                ? 'bg-[#22C55E] text-black shadow-md font-extrabold'
                : 'bg-[#0D1527] text-slate-300 hover:text-white border border-white/5 hover:border-white/15'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Main Grid: Plan Selector & Active Routine Exercises */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Workout Plans list */}
        <div className="lg:col-span-4 space-y-3">
          <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider px-1">
            Curated Protocols ({filteredPlans.length})
          </h3>
          {filteredPlans.map(plan => {
            const isCurrent = plan.id === activePlan?.id;
            const completedCount = plan.exercises.filter(e => e.completed).length;
            const pct = Math.round((completedCount / plan.exercises.length) * 100);

            return (
              <div
                key={plan.id}
                onClick={() => onSelectPlan(plan.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  isCurrent
                    ? 'bg-[#0F172A] border-[#22C55E]/60 shadow-[0_0_20px_rgba(34,197,94,0.15)] ring-1 ring-[#22C55E]/40'
                    : 'bg-[#0D1527] border-white/5 hover:border-white/20'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[#22C55E]">
                      {plan.category}
                    </span>
                    <h4 className="text-sm font-bold text-white mt-1.5">{plan.title}</h4>
                  </div>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-white/5 text-slate-400">
                    {plan.level}
                  </span>
                </div>

                <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                  {plan.description}
                </p>

                <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                  <span className="text-slate-400">
                    {plan.exercises.length} exercises • {plan.durationWeeks} weeks
                  </span>
                  <span className="font-bold text-[#22C55E]">{pct}% Done</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Active Routine Details & Interactive Exercise Checkboxes */}
        <div className="lg:col-span-8 space-y-6">
          {activePlan && (
            <div className="p-6 rounded-3xl bg-[#0F172A] border border-white/10 shadow-xl space-y-6">
              {/* Header with progress */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#22C55E] uppercase tracking-wider">
                      {activePlan.category} Protocol
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-md bg-white/5 text-slate-400">
                      {activePlan.level}
                    </span>
                  </div>
                  <h2 className="text-2xl font-black text-white mt-1">{activePlan.title}</h2>
                  <p className="text-xs text-slate-300 mt-1 max-w-xl">{activePlan.description}</p>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onResetCompleted(activePlan.id)}
                    leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
                  >
                    Reset Progress
                  </Button>
                </div>
              </div>

              {/* Progress bar */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <Flame className="w-4 h-4 text-[#22C55E]" />
                    <span className="font-bold text-white">{completedEx}</span> of {totalEx} exercises logged
                  </span>
                  <span className="font-bold text-[#22C55E]">{completionPercent}% Complete</span>
                </div>
                <div className="w-full bg-[#0B1120] h-2.5 rounded-full overflow-hidden border border-white/5">
                  <div
                    className="bg-[#22C55E] h-full rounded-full transition-all duration-500 shadow-[0_0_12px_rgba(34,197,94,0.5)]"
                    style={{ width: `${completionPercent}%` }}
                  />
                </div>
              </div>

              {/* Exercise List */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Target Exercises
                </h4>
                {activePlan.exercises.map((ex, idx) => (
                  <div
                    key={ex.id}
                    onClick={() => onToggleExercise(activePlan.id, ex.id)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                      ex.completed
                        ? 'bg-[#22C55E]/10 border-[#22C55E]/30 text-white'
                        : 'bg-[#0B1120] border-white/5 hover:border-white/15 text-slate-200'
                    }`}
                  >
                    <div className="flex items-start gap-3.5 min-w-0">
                      <div
                        className={`w-6 h-6 rounded-lg border mt-0.5 flex items-center justify-center transition-colors shrink-0 ${
                          ex.completed
                            ? 'bg-[#22C55E] border-[#22C55E] text-black'
                            : 'border-white/20 hover:border-[#22C55E]'
                        }`}
                      >
                        {ex.completed && <CheckCircle2 className="w-4 h-4 stroke-[3]" />}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono text-slate-400">#{idx + 1}</span>
                          <span className={`text-sm font-bold truncate ${ex.completed ? 'line-through text-slate-400' : 'text-white'}`}>
                            {ex.name}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-1">
                          <span className="text-slate-300 font-semibold">{ex.targetMuscle}</span>
                          <span>•</span>
                          <span className="text-white font-bold">{ex.sets} Sets</span>
                          <span>•</span>
                          <span className="text-white font-bold">{ex.reps} Reps</span>
                          {ex.restSeconds && (
                            <>
                              <span>•</span>
                              <span className="flex items-center gap-1 text-slate-400">
                                <Clock className="w-3 h-3 text-[#22C55E]" />
                                {ex.restSeconds}s rest
                              </span>
                            </>
                          )}
                        </div>
                        {ex.notes && (
                          <p className="text-xs text-slate-400 italic mt-1.5 bg-white/[0.02] p-2 rounded-lg border border-white/5">
                            Form cue: {ex.notes}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-slate-300">
                        {ex.category}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Workout History / Tips Banner */}
              <div className="p-4 rounded-2xl bg-[#0B1120] border border-white/5 flex items-start gap-3 text-xs text-slate-300">
                <div className="p-2 rounded-xl bg-[#22C55E]/10 text-[#22C55E] shrink-0">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="font-bold text-white mb-0.5">Progressive Overload Rule</h5>
                  <p className="text-slate-400 leading-relaxed">
                    Once you hit the top of the rep target for all {activePlan.exercises[0]?.sets || 4} sets with strict form, increase resistance by 2.5 kg next week.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
