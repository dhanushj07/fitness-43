import React, { useState } from 'react';
import {
  Dumbbell,
  Plus,
  Trash2,
  Edit2,
  Clock,
  Flame,
  CheckCircle2,
} from 'lucide-react';
import { WorkoutPlan, Exercise } from '../../types';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Modal } from '../../components/common/Modal';

interface WorkoutManagementPageProps {
  plans: WorkoutPlan[];
  onAddPlan: (planData: Omit<WorkoutPlan, 'id'>) => void;
  onDeletePlan: (planId: string) => void;
}

export const WorkoutManagementPage: React.FC<WorkoutManagementPageProps> = ({
  plans,
  onAddPlan,
  onDeletePlan,
}) => {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<WorkoutPlan['category']>('Full Body');
  const [level, setLevel] = useState<WorkoutPlan['level']>('Intermediate');
  const [durationWeeks, setDurationWeeks] = useState(6);

  // Exercise items in new plan
  const [exerciseName, setExerciseName] = useState('');
  const [targetMuscle, setTargetMuscle] = useState('');
  const [sets, setSets] = useState(4);
  const [reps, setReps] = useState('8-10');
  const [tempExercises, setTempExercises] = useState<Exercise[]>([]);

  const handleAddExerciseToTemp = () => {
    if (!exerciseName) return;
    const newEx: Exercise = {
      id: `ex-custom-${Date.now()}`,
      name: exerciseName,
      category: category === 'Full Body' ? 'Chest' : (category as any),
      sets: Number(sets),
      reps: reps,
      targetMuscle: targetMuscle || 'Major muscle groups',
      restSeconds: 90,
      difficulty: level,
      completed: false,
    };
    setTempExercises([...tempExercises, newEx]);
    setExerciseName('');
    setTargetMuscle('');
  };

  const handleSavePlan = () => {
    if (!title) return;

    onAddPlan({
      title,
      description: description || 'Targeted hypertrophy and strength protocol.',
      category,
      level,
      durationWeeks: Number(durationWeeks),
      exercises: tempExercises.length > 0 ? tempExercises : [
        {
          id: `ex-def-1`,
          name: 'Barbell Compound Movement',
          category: 'Chest',
          sets: 4,
          reps: '8-10',
          targetMuscle: 'Target Groups',
          restSeconds: 90,
          difficulty: 'Intermediate',
          completed: false,
        }
      ],
    });

    setIsAddOpen(false);
    setTitle('');
    setDescription('');
    setTempExercises([]);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-[#22C55E] uppercase tracking-wider">
            Curriculum & Protocols
          </span>
          <h2 className="text-2xl font-black text-white mt-1">Workout Plan Management</h2>
          <p className="text-xs text-slate-400">Design training routines, exercise splits, and volume assignments</p>
        </div>

        <Button
          id="create-workout-protocol-btn"
          variant="primary"
          size="md"
          onClick={() => setIsAddOpen(true)}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Create New Routine
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {plans.map(p => (
          <div
            key={p.id}
            className="p-6 rounded-3xl bg-[#0F172A] border border-white/10 shadow-xl flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/5 text-[#22C55E]">
                    {p.category}
                  </span>
                  <h3 className="text-lg font-bold text-white mt-1.5">{p.title}</h3>
                </div>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-white/5 text-slate-400">
                  {p.level}
                </span>
              </div>

              <p className="text-xs text-slate-300 mb-4">{p.description}</p>

              <div className="space-y-2 pt-3 border-t border-white/5">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Exercise Breakdown ({p.exercises.length})
                </span>
                {p.exercises.slice(0, 4).map((ex, i) => (
                  <div key={ex.id || i} className="flex items-center justify-between text-xs text-slate-300 py-1">
                    <span>{ex.name}</span>
                    <span className="font-mono text-slate-400">{ex.sets} sets × {ex.reps}</span>
                  </div>
                ))}
                {p.exercises.length > 4 && (
                  <span className="text-xs text-slate-500 italic block">
                    +{p.exercises.length - 4} more exercises in routine...
                  </span>
                )}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
              <span>{p.durationWeeks} Weeks Periodization</span>
              <button
                onClick={() => onDeletePlan(p.id)}
                className="text-rose-400 hover:text-rose-300 transition-colors p-1.5 rounded-lg hover:bg-rose-500/10 flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Plan Modal */}
      <Modal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Create New Training Protocol"
        subtitle="Specify movements, set/rep ranges, and target level"
        maxWidth="lg"
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setIsAddOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleSavePlan}>
              Save Routine
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="Routine Title"
            placeholder="e.g. Posterior Chain & Deadlift Specialization"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
                Category Split
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full bg-[#0B1120] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-[#22C55E]"
              >
                <option value="Full Body">Full Body</option>
                <option value="Chest">Chest</option>
                <option value="Back">Back</option>
                <option value="Legs">Legs</option>
                <option value="Shoulders">Shoulders</option>
                <option value="Arms">Arms</option>
                <option value="Cardio">Cardio</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
                Target Level
              </label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value as any)}
                className="w-full bg-[#0B1120] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-[#22C55E]"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>

            <Input
              label="Duration (Weeks)"
              type="number"
              value={durationWeeks}
              onChange={(e) => setDurationWeeks(Number(e.target.value))}
            />
          </div>

          {/* Add Exercise Subsection */}
          <div className="p-4 rounded-2xl bg-[#0B1120] border border-white/10 space-y-3">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              Add Exercise Movement
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <Input
                placeholder="Exercise Name (e.g. Romanian Deadlift)"
                value={exerciseName}
                onChange={(e) => setExerciseName(e.target.value)}
              />
              <Input
                placeholder="Target Muscle (e.g. Hamstrings, Glutes)"
                value={targetMuscle}
                onChange={(e) => setTargetMuscle(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="Sets"
                value={sets}
                onChange={(e) => setSets(Number(e.target.value))}
                className="w-24 bg-[#0F172A] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
              />
              <input
                type="text"
                placeholder="Reps (e.g. 8-10)"
                value={reps}
                onChange={(e) => setReps(e.target.value)}
                className="w-32 bg-[#0F172A] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
              />
              <Button
                variant="outline"
                size="sm"
                type="button"
                onClick={handleAddExerciseToTemp}
                leftIcon={<Plus className="w-3.5 h-3.5" />}
              >
                Add Movement
              </Button>
            </div>

            {tempExercises.length > 0 && (
              <div className="space-y-1 pt-2">
                {tempExercises.map((te, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs text-slate-300 bg-white/5 p-2 rounded-lg">
                    <span>{te.name} ({te.targetMuscle})</span>
                    <span>{te.sets} sets × {te.reps}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
};
