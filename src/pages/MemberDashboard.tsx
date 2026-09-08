import React from 'react';
import {
  CreditCard,
  CalendarCheck,
  Dumbbell,
  Clock,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
  Calendar,
  Flame,
  ChevronRight,
  UserCheck,
  Zap,
} from 'lucide-react';
import { Member, WorkoutPlan, TrainerSession, PerformanceMetric, NavigationTab } from '../types';
import { StatusBadge } from '../components/common/StatusBadge';
import { Button } from '../components/common/Button';
import { ProgressDonut } from '../components/charts/ProgressDonut';
import { formatDate } from '../utils/formatters';

interface MemberDashboardProps {
  member: Member;
  workoutPlan: WorkoutPlan | null;
  upcomingSessions: TrainerSession[];
  latestMetric: PerformanceMetric | null;
  isCheckedInToday: boolean;
  onQuickCheckIn: () => void;
  onNavigate: (tab: NavigationTab) => void;
  onToggleExercise: (planId: string, exerciseId: string) => void;
}

export const MemberDashboard: React.FC<MemberDashboardProps> = ({
  member,
  workoutPlan,
  upcomingSessions,
  latestMetric,
  isCheckedInToday,
  onQuickCheckIn,
  onNavigate,
  onToggleExercise,
}) => {
  // Calculate completed exercises percentage
  const totalExercises = workoutPlan?.exercises.length || 0;
  const completedExercises = workoutPlan?.exercises.filter(e => e.completed).length || 0;
  const workoutProgress = totalExercises > 0 ? Math.round((completedExercises / totalExercises) * 100) : 72;

  // Next session
  const nextSession = upcomingSessions.find(s => s.status === 'confirmed');

  // Days remaining calculation
  const getDaysRemaining = (dateStr?: string) => {
    if (!dateStr) return 24;
    const diff = new Date(dateStr).getTime() - new Date().getTime();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };
  const daysRemaining = getDaysRemaining(member.membershipExpiry);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-[#0F172A] via-[#0D1527] to-[#0B1120] border border-white/10 overflow-hidden shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#22C55E]/10 border border-[#22C55E]/30 text-[#22C55E] text-xs font-bold">
              <Zap className="w-3.5 h-3.5 fill-[#22C55E]" />
              <span>Premium Tier Athlete</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-['Outfit',sans-serif]">
              Welcome back, {member.name}!
            </h2>
            <p className="text-sm text-slate-300 max-w-xl">
              You are currently on an <span className="text-[#22C55E] font-semibold">18-session streak</span> this cycle. Your assigned trainer is{' '}
              <span className="text-white font-semibold">{member.trainerName || 'Marcus Vance'}</span>.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant={isCheckedInToday ? 'secondary' : 'primary'}
              size="md"
              onClick={onQuickCheckIn}
              disabled={isCheckedInToday}
              leftIcon={<CalendarCheck className="w-4 h-4" />}
            >
              {isCheckedInToday ? 'Checked in Today' : 'Gym Check-In'}
            </Button>
            <Button
              variant="outline"
              size="md"
              onClick={() => onNavigate('workout-plans')}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Start Workout
            </Button>
          </div>
        </div>
      </div>

      {/* 4 Required Key Dashboard Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Membership */}
        <div
          onClick={() => onNavigate('subscriptions')}
          className="p-5 rounded-2xl bg-[#0D1527] border border-white/5 hover:border-white/20 transition-all cursor-pointer group shadow-lg flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Membership</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <StatusBadge status="active" />
              <span className="text-xs font-bold text-white">Premium Tier</span>
            </div>
            <div className="text-2xl font-black text-white mt-2">
              {daysRemaining} <span className="text-sm font-semibold text-slate-400">days remaining</span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Expires {formatDate(member.membershipExpiry || '2026-10-02')}
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-slate-400 group-hover:text-[#22C55E]">
            <span>Manage billing</span>
            <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Card 2: Attendance */}
        <div
          onClick={() => onNavigate('attendance')}
          className="p-5 rounded-2xl bg-[#0D1527] border border-white/5 hover:border-white/20 transition-all cursor-pointer group shadow-lg flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Attendance</span>
            <div className="p-2 rounded-xl bg-[#22C55E]/10 text-[#22C55E] border border-[#22C55E]/20">
              <CalendarCheck className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-white">
              {member.activeSessionsAttended || 18}{' '}
              <span className="text-sm font-normal text-slate-400">
                / {member.totalSessionsExpected || 24} sessions
              </span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mt-3">
              <div
                className="bg-[#22C55E] h-full rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]"
                style={{
                  width: `${Math.round(
                    ((member.activeSessionsAttended || 18) / (member.totalSessionsExpected || 24)) * 100
                  )}%`,
                }}
              />
            </div>
            <p className="text-xs text-slate-400 mt-2 flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>Goal: 4 sessions / week</span>
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-slate-400 group-hover:text-[#22C55E]">
            <span>View monthly log</span>
            <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Card 3: Workout Progress */}
        <div
          onClick={() => onNavigate('workout-plans')}
          className="p-5 rounded-2xl bg-[#0D1527] border border-white/5 hover:border-white/20 transition-all cursor-pointer group shadow-lg flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Workout Progress</span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Dumbbell className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="shrink-0">
              <ProgressDonut percentage={workoutProgress} size={64} strokeWidth={6} />
            </div>
            <div>
              <div className="text-xl font-black text-white">{workoutProgress}%</div>
              <p className="text-xs text-slate-400 leading-tight mt-0.5">
                {completedExercises} of {totalExercises} exercises completed today
              </p>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-slate-400 group-hover:text-[#22C55E]">
            <span>Open workout list</span>
            <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Card 4: Next Session */}
        <div
          onClick={() => onNavigate('trainer-schedule')}
          className="p-5 rounded-2xl bg-[#0D1527] border border-white/5 hover:border-white/20 transition-all cursor-pointer group shadow-lg flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Next Session</span>
            <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-lg font-black text-white">
              {nextSession ? `${nextSession.timeSlot}` : 'Today, 6:00 PM'}
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs font-semibold text-[#22C55E]">
                {nextSession ? nextSession.trainerName : 'Marcus Vance'}
              </span>
              <span className="text-slate-500">•</span>
              <span className="text-xs text-slate-400">
                {nextSession ? nextSession.sessionType : '1-on-1 PT'}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-2">Olympic Lifting Platform 2</p>
          </div>
          <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-slate-400 group-hover:text-[#22C55E]">
            <span>Book / Reschedule</span>
            <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>

      {/* Interactive Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Today's Assigned Routine */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-6 rounded-3xl bg-[#0F172A] border border-white/10 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-xs font-bold text-[#22C55E] uppercase tracking-wider">
                  Active Routine
                </span>
                <h3 className="text-lg font-black text-white mt-0.5">
                  {workoutPlan?.title || 'Hypertrophy Upper Body Power'}
                </h3>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onNavigate('workout-plans')}
              >
                All Protocols
              </Button>
            </div>

            <p className="text-xs text-slate-400 mb-4">
              Click checkboxes to mark sets as completed in real time.
            </p>

            <div className="space-y-2.5">
              {workoutPlan?.exercises.map((ex) => (
                <div
                  key={ex.id}
                  onClick={() => onToggleExercise(workoutPlan.id, ex.id)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    ex.completed
                      ? 'bg-[#22C55E]/10 border-[#22C55E]/30 text-white'
                      : 'bg-[#0B1120] border-white/5 hover:border-white/15 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div
                      className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-colors ${
                        ex.completed
                          ? 'bg-[#22C55E] border-[#22C55E] text-black'
                          : 'border-white/20 hover:border-[#22C55E]'
                      }`}
                    >
                      {ex.completed && <CheckCircle2 className="w-4 h-4 stroke-[3]" />}
                    </div>
                    <div className="min-w-0">
                      <div className={`text-sm font-bold truncate ${ex.completed ? 'line-through text-slate-400' : 'text-white'}`}>
                        {ex.name}
                      </div>
                      <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                        <span className="text-[#22C55E] font-medium">{ex.category}</span>
                        <span>•</span>
                        <span>{ex.sets} sets × {ex.reps} reps</span>
                        <span>•</span>
                        <span>{ex.restSeconds}s rest</span>
                      </div>
                    </div>
                  </div>

                  <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-slate-300 shrink-0">
                    {ex.difficulty}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Biometric Snapshot & Upcoming Schedule */}
        <div className="lg:col-span-5 space-y-6">
          {/* Biometrics card */}
          <div className="p-6 rounded-3xl bg-[#0F172A] border border-white/10 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Biometrics & 1RM PRs
                </span>
                <h3 className="text-base font-bold text-white mt-0.5">Current Fitness State</h3>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onNavigate('performance')}
                rightIcon={<TrendingUp className="w-3.5 h-3.5 text-[#22C55E]" />}
              >
                Analytics
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-2xl bg-[#0B1120] border border-white/5">
                <span className="text-[11px] font-semibold text-slate-400">Current Weight</span>
                <div className="text-xl font-extrabold text-white mt-1">
                  {latestMetric?.weightKg || member.weightKg} <span className="text-xs text-slate-400">kg</span>
                </div>
                <span className="text-[10px] text-[#22C55E] font-semibold">-6.1 kg since start</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#0B1120] border border-white/5">
                <span className="text-[11px] font-semibold text-slate-400">Body Mass Index (BMI)</span>
                <div className="text-xl font-extrabold text-white mt-1">
                  {latestMetric?.bmi || 24.2}
                </div>
                <span className="text-[10px] text-emerald-400 font-semibold">Normal Range</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#0B1120] border border-white/5">
                <span className="text-[11px] font-semibold text-slate-400">Bench Press 1RM</span>
                <div className="text-xl font-extrabold text-sky-400 mt-1">
                  {latestMetric?.benchPressKg || 100} <span className="text-xs text-slate-400">kg</span>
                </div>
                <span className="text-[10px] text-slate-400 font-medium">+20 kg progress</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#0B1120] border border-white/5">
                <span className="text-[11px] font-semibold text-slate-400">Deadlift 1RM</span>
                <div className="text-xl font-extrabold text-amber-400 mt-1">
                  {latestMetric?.deadliftKg || 165} <span className="text-xs text-slate-400">kg</span>
                </div>
                <span className="text-[10px] text-slate-400 font-medium">+35 kg progress</span>
              </div>
            </div>
          </div>

          {/* Upcoming Trainer Sessions list */}
          <div className="p-6 rounded-3xl bg-[#0F172A] border border-white/10 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white">Upcoming Trainer Sessions</h3>
              <button
                onClick={() => onNavigate('trainer-schedule')}
                className="text-xs font-semibold text-[#22C55E] hover:underline"
              >
                Book Session
              </button>
            </div>

            <div className="space-y-3">
              {upcomingSessions.slice(0, 2).map((ses) => (
                <div
                  key={ses.id}
                  className="p-3.5 rounded-2xl bg-[#0B1120] border border-white/5 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#22C55E]">
                      <UserCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">{ses.trainerName}</div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                        <Calendar className="w-3 h-3" />
                        <span>{formatDate(ses.date)} at {ses.timeSlot}</span>
                      </div>
                    </div>
                  </div>
                  <StatusBadge status={ses.status} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
