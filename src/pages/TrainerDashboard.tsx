import React, { useState } from 'react';
import {
  Calendar,
  Users,
  Dumbbell,
  CheckCircle2,
  Clock,
  Star,
  Plus,
  TrendingUp,
  MapPin,
  ChevronRight,
  Filter,
  Search,
} from 'lucide-react';
import { Trainer, Member, TrainerSession } from '../types';
import { Button } from '../components/common/Button';
import { StatusBadge } from '../components/common/StatusBadge';
import { Modal } from '../components/common/Modal';
import { Input } from '../components/common/Input';

interface TrainerDashboardProps {
  trainer: Trainer;
  assignedMembers: Member[];
  sessions: TrainerSession[];
  onCompleteSession: (sessionId: string) => void;
  onCancelSession: (sessionId: string) => void;
  onAddPerformanceNote: (memberId: string, note: string) => void;
  onNavigate: (tab: any) => void;
}

export const TrainerDashboard: React.FC<TrainerDashboardProps> = ({
  trainer,
  assignedMembers,
  sessions,
  onCompleteSession,
  onCancelSession,
  onAddPerformanceNote,
  onNavigate,
}) => {
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [coachNote, setCoachNote] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter today's sessions
  const todaySessions = sessions.filter((s) => s.trainerId === trainer.id || s.trainerName === trainer.name);
  const filteredMembers = assignedMembers.filter((m) =>
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenNoteModal = (m: Member) => {
    setSelectedMember(m);
    setCoachNote('');
    setIsNoteModalOpen(true);
  };

  const handleSaveNote = () => {
    if (selectedMember && coachNote.trim()) {
      onAddPerformanceNote(selectedMember.id, coachNote);
      setIsNoteModalOpen(false);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Trainer Header / Profile Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#0F172A] via-[#0D1527] to-[#0B1120] border border-white/10 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <img
              src={trainer.avatarUrl}
              alt={trainer.name}
              className="w-20 h-20 rounded-2xl object-cover ring-2 ring-[#22C55E]/40 shadow-lg"
            />
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-black text-white font-['Outfit',sans-serif]">
                  Coach {trainer.name}
                </h1>
                <span className="px-3 py-0.5 rounded-full bg-[#22C55E]/10 border border-[#22C55E]/30 text-[#22C55E] text-xs font-bold uppercase tracking-wider">
                  Lead Performance Coach
                </span>
              </div>
              <p className="text-sm text-slate-400 mt-1 max-w-xl">
                {trainer.bio}
              </p>
              <div className="flex items-center gap-4 mt-3 text-xs text-slate-300 flex-wrap">
                <div className="flex items-center gap-1 text-amber-400 font-semibold">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <span>{trainer.rating} (48 Member Reviews)</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-400">
                  <Users className="w-4 h-4 text-sky-400" />
                  <span>{trainer.activeClientsCount || 16} Active Trainees</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-400">
                  <Clock className="w-4 h-4 text-emerald-400" />
                  <span>{trainer.experienceYears} Years Experience</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Dumbbell className="w-4 h-4" />}
              onClick={() => onNavigate('admin-workouts')}
            >
              Workout Protocols
            </Button>
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Calendar className="w-4 h-4" />}
              onClick={() => onNavigate('trainer-schedule')}
            >
              Manage Schedule
            </Button>
          </div>
        </div>

        {/* Specialization tags */}
        <div className="mt-6 pt-5 border-t border-white/5 flex items-center gap-2 flex-wrap">
          <span className="text-xs text-slate-400 font-medium mr-1">Specializations:</span>
          {trainer.specialization.map((spec) => (
            <span
              key={spec}
              className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-xs text-slate-200"
            >
              {spec}
            </span>
          ))}
        </div>
      </div>

      {/* Trainer Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-5 rounded-2xl bg-[#0F172A] border border-white/5 shadow-md flex items-center gap-4">
          <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-white">{todaySessions.length}</div>
            <div className="text-xs text-slate-400 font-medium">Scheduled Sessions Today</div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0F172A] border border-white/5 shadow-md flex items-center gap-4">
          <div className="p-3 rounded-xl bg-[#22C55E]/10 text-[#22C55E] border border-[#22C55E]/20">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-white">{assignedMembers.length}</div>
            <div className="text-xs text-slate-400 font-medium">Assigned Athletes</div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0F172A] border border-white/5 shadow-md flex items-center gap-4">
          <div className="p-3 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-white">92.4%</div>
            <div className="text-xs text-slate-400 font-medium">Workout Completion Rate</div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0F172A] border border-white/5 shadow-md flex items-center gap-4">
          <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Star className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-white">{trainer.rating} / 5.0</div>
            <div className="text-xs text-slate-400 font-medium">Client Satisfaction</div>
          </div>
        </div>
      </div>

      {/* Main Grid: Sessions & Trainees */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Today's Coaching Schedule (2 Columns) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 rounded-3xl bg-[#0F172A] border border-white/10 shadow-xl space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Upcoming 1-on-1 Sessions</h3>
                  <p className="text-xs text-slate-400">Manage client check-in status and completions</p>
                </div>
              </div>
              <span className="text-xs text-slate-400 font-medium bg-white/5 px-3 py-1 rounded-full border border-white/5">
                {todaySessions.length} bookings
              </span>
            </div>

            {todaySessions.length === 0 ? (
              <div className="p-8 text-center rounded-2xl bg-[#0B1120] border border-white/5">
                <Calendar className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                <p className="text-sm text-slate-300 font-semibold">No Sessions Booked for Today</p>
                <p className="text-xs text-slate-500 mt-1">Available slots are open for member reservations.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {todaySessions.map((session) => (
                  <div
                    key={session.id}
                    className="p-4 rounded-2xl bg-[#0B1120] border border-white/5 hover:border-white/10 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-3.5">
                      <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex flex-col items-center justify-center text-purple-400 shrink-0">
                        <Clock className="w-4 h-4 mb-0.5" />
                        <span className="text-[10px] font-bold">{session.timeSlot.split(' ')[0]}</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-white">{session.memberName}</h4>
                          <StatusBadge
                            status={session.status === 'confirmed' ? 'active' : session.status === 'completed' ? 'active' : 'expired'}
                            label={session.status}
                          />
                        </div>
                        <div className="text-xs text-slate-400 mt-1 flex items-center gap-3">
                          <span className="text-emerald-400 font-medium">{session.sessionType}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-slate-500" />
                            {session.location}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      {session.status === 'confirmed' && (
                        <>
                          <Button
                            variant="primary"
                            size="sm"
                            leftIcon={<CheckCircle2 className="w-3.5 h-3.5" />}
                            onClick={() => onCompleteSession(session.id)}
                          >
                            Mark Done
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onCancelSession(session.id)}
                          >
                            Cancel
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Assigned Athletes / Clients Table */}
          <div className="p-6 rounded-3xl bg-[#0F172A] border border-white/10 shadow-xl space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-[#22C55E]/10 text-[#22C55E] border border-[#22C55E]/20">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Assigned Athletes & Trainees</h3>
                  <p className="text-xs text-slate-400">Monitor compliance, biometric progression, and attendance</p>
                </div>
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter athlete name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-[#0B1120] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#22C55E]"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-[#0B1120] text-slate-400 uppercase tracking-wider font-semibold border-b border-white/10">
                  <tr>
                    <th className="py-3 px-4">Member</th>
                    <th className="py-3 px-4">Attendance</th>
                    <th className="py-3 px-4">Weight</th>
                    <th className="py-3 px-4">Goal Weekly</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredMembers.map((m) => (
                    <tr key={m.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={m.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150'}
                            alt={m.name}
                            className="w-9 h-9 rounded-xl object-cover border border-white/10"
                          />
                          <div>
                            <div className="font-bold text-white text-sm">{m.name}</div>
                            <div className="text-[11px] text-slate-400">{m.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="font-semibold text-white">
                            {m.activeSessionsAttended || 18} / {m.totalSessionsExpected || 24}
                          </div>
                          <span className="text-[10px] text-[#22C55E] font-bold">
                            ({Math.round(((m.activeSessionsAttended || 18) / (m.totalSessionsExpected || 24)) * 100)}%)
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-200">
                          {m.weightKg ? `${m.weightKg} kg` : '78.5 kg'}
                        </div>
                        <div className="text-[10px] text-slate-500">
                          Target: {m.targetWeightKg ? `${m.targetWeightKg} kg` : '75.0 kg'}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-md bg-white/5 text-slate-300 font-medium">
                          {m.attendanceGoalWeekly || 4} days/wk
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenNoteModal(m)}
                        >
                          Log Biometrics
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Weekly Availability & Guidelines */}
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-[#0F172A] border border-white/10 shadow-xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Weekly Availability Window</h3>
                <p className="text-xs text-slate-400">Open coaching slots available to club members</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Available Days</div>
              <div className="flex flex-wrap gap-1.5">
                {trainer.availableDays.map((day) => (
                  <span
                    key={day}
                    className="px-3 py-1 rounded-lg bg-[#22C55E]/10 border border-[#22C55E]/30 text-[#22C55E] text-xs font-bold"
                  >
                    {day}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Daily Hours</div>
              <div className="grid grid-cols-2 gap-2">
                {trainer.availableSlots.map((slot) => (
                  <div
                    key={slot}
                    className="p-2.5 rounded-xl bg-[#0B1120] border border-white/5 text-xs text-slate-300 flex items-center justify-between"
                  >
                    <span>{slot}</span>
                    <span className="w-2 h-2 rounded-full bg-[#22C55E]"></span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-gradient-to-br from-[#1E293B] to-[#0F172A] border border-white/10 shadow-xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Dumbbell className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Coaching Directives</h3>
            </div>
            <ul className="text-xs text-slate-300 space-y-2.5 list-disc pl-4 leading-relaxed">
              <li>Ensure all 1-on-1 sessions are marked completed in real time to update turnstile logs.</li>
              <li>Log progressive overload PR updates under Member Performance to trigger real-time streak points.</li>
              <li>Coordinate routine modifications with the Gym Administrator before assigning high-volume regimens.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Log Performance Modal */}
      <Modal
        isOpen={isNoteModalOpen}
        onClose={() => setIsNoteModalOpen(false)}
        title={`Log Performance Note for ${selectedMember?.name}`}
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-400">
            Record coaching notes, form corrections, or 1RM milestone achievements for {selectedMember?.name}.
          </p>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300">Coaching Assessment / Note</label>
            <textarea
              rows={4}
              value={coachNote}
              onChange={(e) => setCoachNote(e.target.value)}
              placeholder="e.g. Completed 4x8 Barbell Bench at 100kg with clean lockout. Recommend increasing warm-up mobility sets next week."
              className="w-full p-3 rounded-xl bg-[#0B1120] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#22C55E]"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={() => setIsNoteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleSaveNote}>
              Save Note
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
