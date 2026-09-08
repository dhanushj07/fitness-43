import React, { useState } from 'react';
import {
  CalendarCheck,
  CheckCircle2,
  Clock,
  Flame,
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  MapPin,
  TrendingUp,
} from 'lucide-react';
import { AttendanceRecord } from '../types';
import { Button } from '../components/common/Button';
import { StatusBadge } from '../components/common/StatusBadge';
import { formatDate } from '../utils/formatters';

interface AttendancePageProps {
  attendanceRecords: AttendanceRecord[];
  onCheckIn: (location?: string) => void;
  isCheckedInToday: boolean;
  memberWeeklyGoal?: number;
}

export const AttendancePage: React.FC<AttendancePageProps> = ({
  attendanceRecords,
  onCheckIn,
  isCheckedInToday,
  memberWeeklyGoal = 4,
}) => {
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<'all' | 'present' | 'absent' | 'leave'>('all');
  const [selectedLocation, setSelectedLocation] = useState('Main Gym Floor');

  // Stats calculation
  const presentCount = attendanceRecords.filter(r => r.status === 'present').length;
  const absentCount = attendanceRecords.filter(r => r.status === 'absent').length;
  const leaveCount = attendanceRecords.filter(r => r.status === 'leave').length;
  const totalRecorded = attendanceRecords.length || 1;
  const attendancePercentage = Math.round((presentCount / totalRecorded) * 100);

  // Filter records
  const filteredRecords = selectedStatusFilter === 'all'
    ? attendanceRecords
    : attendanceRecords.filter(r => r.status === selectedStatusFilter);

  // Generate September 2026 Calendar grid (1 to 30)
  const daysInMonth = 30;
  const startDayOffset = 2; // Tuesday start for Sept 2026
  const calendarDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const getRecordForDay = (dayNum: number) => {
    const dayStr = dayNum < 10 ? `0${dayNum}` : `${dayNum}`;
    const dateStr = `2026-09-${dayStr}`;
    return attendanceRecords.find(r => r.date === dateStr);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Banner: Stats & Check-in Action */}
      <div className="p-6 rounded-3xl bg-[#0F172A] border border-white/10 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-[#22C55E] uppercase tracking-wider">
              Attendance & Consistency
            </span>
            {isCheckedInToday && (
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
                Checked in for today
              </span>
            )}
          </div>
          <h2 className="text-2xl font-black text-white">Monthly Attendance Summary</h2>
          <p className="text-xs text-slate-300 mt-1">
            Build athletic momentum by maintaining your target {memberWeeklyGoal} sessions per week.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="bg-[#0B1120] border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-[#22C55E]"
          >
            <option value="Main Gym Floor">Main Gym Floor</option>
            <option value="Free Weights Zone">Free Weights Zone</option>
            <option value="Cardio Loft">Cardio Loft</option>
            <option value="Olympic Platform">Olympic Platform</option>
          </select>

          <Button
            id="attendance-checkin-btn"
            size="md"
            variant={isCheckedInToday ? 'secondary' : 'primary'}
            onClick={() => onCheckIn(selectedLocation)}
            disabled={isCheckedInToday}
            leftIcon={<CalendarCheck className="w-4 h-4" />}
          >
            {isCheckedInToday ? 'Today Logged (Present)' : 'Record Gym Check-In'}
          </Button>
        </div>
      </div>

      {/* 4 Stat Indicators */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-[#0D1527] border border-white/5">
          <span className="text-xs font-semibold text-slate-400">Total Check-Ins</span>
          <div className="text-2xl font-black text-white mt-1">{presentCount} Days</div>
          <span className="text-[10px] text-[#22C55E] font-medium">Logged this month</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#0D1527] border border-white/5">
          <span className="text-xs font-semibold text-slate-400">Attendance Rate</span>
          <div className="text-2xl font-black text-[#22C55E] mt-1">{attendancePercentage}%</div>
          <span className="text-[10px] text-slate-400">Of scheduled training</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#0D1527] border border-white/5">
          <span className="text-xs font-semibold text-slate-400">Active Streak</span>
          <div className="text-2xl font-black text-amber-400 mt-1 flex items-center gap-1.5">
            <Flame className="w-5 h-5 fill-amber-400" />
            <span>5 Days</span>
          </div>
          <span className="text-[10px] text-slate-400">Consecutive workouts</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#0D1527] border border-white/5">
          <span className="text-xs font-semibold text-slate-400">Weekly Pace</span>
          <div className="text-2xl font-black text-white mt-1">4.2 / wk</div>
          <span className="text-[10px] text-emerald-400 font-medium">Ahead of {memberWeeklyGoal}/wk goal</span>
        </div>
      </div>

      {/* Main Grid: Calendar Heatmap & Recent History */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Calendar Grid */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-[#0F172A] border border-white/10 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-[#22C55E]" />
              <h3 className="text-base font-bold text-white">September 2026</h3>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5 text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full bg-[#22C55E]" />
                <span>Present</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <span>Absent</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-400" />
                <span>Rest/Leave</span>
              </div>
            </div>
          </div>

          {/* Weekday headers */}
          <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-slate-400 pb-1">
            <span>Sun</span>
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
          </div>

          {/* Days */}
          <div className="grid grid-cols-7 gap-2">
            {/* Blank offsets for start of month */}
            {Array.from({ length: startDayOffset }).map((_, i) => (
              <div key={`empty-${i}`} className="h-14 rounded-xl bg-[#0B1120]/40 border border-white/[0.02]" />
            ))}

            {calendarDays.map((day) => {
              const record = getRecordForDay(day);
              const isToday = day === 8; // Sept 8 2026 is current time in environment
              const isPresent = record?.status === 'present';
              const isAbsent = record?.status === 'absent';
              const isLeave = record?.status === 'leave';

              return (
                <div
                  key={day}
                  className={`h-14 p-1.5 rounded-xl border flex flex-col justify-between transition-all ${
                    isToday
                      ? 'ring-2 ring-[#22C55E] bg-[#22C55E]/10 border-[#22C55E]/40'
                      : isPresent
                      ? 'bg-emerald-500/10 border-emerald-500/20'
                      : isAbsent
                      ? 'bg-rose-500/10 border-rose-500/20'
                      : isLeave
                      ? 'bg-indigo-500/10 border-indigo-500/20'
                      : 'bg-[#0B1120] border-white/5'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-bold ${isToday ? 'text-[#22C55E]' : 'text-slate-300'}`}>
                      {day}
                    </span>
                    {isToday && (
                      <span className="text-[9px] uppercase font-bold text-[#22C55E]">Today</span>
                    )}
                  </div>

                  {record && (
                    <div className="flex items-center justify-between text-[10px]">
                      <span
                        className={`font-semibold capitalize truncate ${
                          isPresent
                            ? 'text-emerald-400'
                            : isAbsent
                            ? 'text-rose-400'
                            : 'text-indigo-400'
                        }`}
                      >
                        {record.status}
                      </span>
                      {record.checkInTime !== '-' && (
                        <span className="text-slate-400 font-mono text-[9px]">
                          {record.checkInTime.split(' ')[0]}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Attendance History Table */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-[#0F172A] border border-white/10 shadow-xl space-y-4 flex flex-col">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white">Recent Attendance Log</h3>
            <div className="flex items-center gap-1">
              {(['all', 'present', 'absent', 'leave'] as const).map(st => (
                <button
                  key={st}
                  onClick={() => setSelectedStatusFilter(st)}
                  className={`px-2 py-1 rounded-md text-[11px] font-semibold capitalize transition-colors ${
                    selectedStatusFilter === st
                      ? 'bg-white/10 text-white font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 max-h-[380px] pr-1">
            {filteredRecords.map((item) => (
              <div
                key={item.id}
                className="p-3 rounded-xl bg-[#0B1120] border border-white/5 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-300">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">{formatDate(item.date)}</div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-[#22C55E]" />
                      <span>{item.location || 'Main Floor'}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <StatusBadge status={item.status} />
                  <div className="text-[10px] text-slate-400 font-mono mt-1">
                    {item.checkInTime}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
