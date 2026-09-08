import React, { useState } from 'react';
import {
  UserCheck,
  Star,
  Clock,
  Calendar,
  Award,
  CheckCircle2,
  XCircle,
  Plus,
  MapPin,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { Trainer, TrainerSession } from '../types';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { Input } from '../components/common/Input';
import { StatusBadge } from '../components/common/StatusBadge';
import { formatDate } from '../utils/formatters';

interface TrainerSchedulePageProps {
  trainers: Trainer[];
  sessions: TrainerSession[];
  onBookSession: (sessionData: Omit<TrainerSession, 'id' | 'status'>) => void;
  onCancelSession: (sessionId: string) => void;
  currentMemberName: string;
  currentMemberId: string;
}

export const TrainerSchedulePage: React.FC<TrainerSchedulePageProps> = ({
  trainers,
  sessions,
  onBookSession,
  onCancelSession,
  currentMemberName,
  currentMemberId,
}) => {
  const [selectedTrainer, setSelectedTrainer] = useState<Trainer | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState('2026-09-12');
  const [selectedSlot, setSelectedSlot] = useState('');
  const [selectedType, setSelectedType] = useState<TrainerSession['sessionType']>('1-on-1 PT');

  const openBookingModal = (trainer: Trainer) => {
    setSelectedTrainer(trainer);
    setSelectedSlot(trainer.availableSlots[0] || '09:00 AM');
    setIsModalOpen(true);
  };

  const handleConfirmBooking = () => {
    if (!selectedTrainer || !selectedSlot) return;

    onBookSession({
      trainerId: selectedTrainer.id,
      trainerName: selectedTrainer.name,
      trainerSpecialty: selectedTrainer.specialization[0],
      memberId: currentMemberId,
      memberName: currentMemberName,
      date: selectedDate,
      timeSlot: selectedSlot,
      sessionType: selectedType,
      location: 'FitFlow Private Training Studio',
    });

    setIsModalOpen(false);
  };

  const mySessions = sessions.filter(s => s.memberId === currentMemberId);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-[#0F172A] border border-white/10 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-[#22C55E] uppercase tracking-wider">
            Certified Coaching Staff
          </span>
          <h2 className="text-2xl font-black text-white mt-1">Book Personal Training Sessions</h2>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            Work 1-on-1 with elite coaches for progressive barbell technique, high-intensity conditioning, and biometric assessments.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-2 rounded-xl bg-[#0B1120] border border-white/10 text-xs">
            <span className="text-slate-400">Available Credits: </span>
            <span className="font-bold text-[#22C55E]">4 Sessions / month</span>
          </div>
        </div>
      </div>

      {/* Upcoming Member Sessions */}
      {mySessions.length > 0 && (
        <div className="p-6 rounded-3xl bg-[#0F172A] border border-white/10 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#22C55E]" />
              <h3 className="text-base font-bold text-white">Your Scheduled Coaching Sessions</h3>
            </div>
            <span className="text-xs text-slate-400">{mySessions.length} active bookings</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mySessions.map(s => {
              const isConfirmed = s.status === 'confirmed';
              return (
                <div
                  key={s.id}
                  className="p-4 rounded-2xl bg-[#0B1120] border border-white/5 flex flex-col justify-between gap-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white">{s.trainerName}</span>
                        <StatusBadge status={s.status} />
                      </div>
                      <p className="text-xs text-[#22C55E] font-medium mt-0.5">{s.sessionType}</p>
                    </div>
                    <span className="text-xs font-mono text-slate-400 bg-white/5 px-2 py-1 rounded-md">
                      {s.timeSlot}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-white/5">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{formatDate(s.date)}</span>
                    </div>
                    {isConfirmed && (
                      <button
                        onClick={() => onCancelSession(s.id)}
                        className="text-xs text-rose-400 hover:text-rose-300 transition-colors font-medium flex items-center gap-1"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Cancel</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Trainers Grid */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider px-1">
          Master Coaches & Specialists
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {trainers.map(tr => (
            <div
              key={tr.id}
              className="rounded-3xl bg-[#0F172A] border border-white/10 overflow-hidden shadow-xl flex flex-col justify-between hover:border-white/20 transition-all group"
            >
              <div>
                {/* Trainer Image & Rating */}
                <div className="relative h-48 w-full overflow-hidden bg-[#0B1120]">
                  <img
                    src={tr.avatarUrl}
                    alt={tr.name}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3 px-2 py-1 rounded-lg bg-black/75 backdrop-blur-md border border-white/10 flex items-center gap-1 text-xs font-bold text-amber-400">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{tr.rating.toFixed(1)}</span>
                  </div>
                </div>

                <div className="p-5 space-y-3">
                  <div>
                    <h4 className="text-base font-bold text-white">{tr.name}</h4>
                    <span className="text-xs text-slate-400">{tr.experienceYears} Years Experience</span>
                  </div>

                  {/* Specialization pills */}
                  <div className="flex flex-wrap gap-1.5">
                    {tr.specialization.map((spec, i) => (
                      <span
                        key={i}
                        className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-[#22C55E]/10 border border-[#22C55E]/20 text-[#22C55E]"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>

                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {tr.bio}
                  </p>

                  <div className="pt-2 border-t border-white/5 space-y-1 text-xs text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{tr.availableDays.join(', ')}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#22C55E]" />
                      <span>{tr.availableSlots.slice(0, 3).join(', ')}...</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0">
                <Button
                  id={`book-trainer-${tr.id}`}
                  variant="primary"
                  size="sm"
                  className="w-full"
                  onClick={() => openBookingModal(tr)}
                  leftIcon={<Plus className="w-3.5 h-3.5" />}
                >
                  Book Session
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Booking Modal */}
      {selectedTrainer && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={`Book 1-on-1 with ${selectedTrainer.name}`}
          subtitle={`${selectedTrainer.specialization.join(' • ')}`}
          maxWidth="md"
          footer={
            <>
              <Button variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={handleConfirmBooking}>
                Confirm Booking
              </Button>
            </>
          }
        >
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
                Session Type
              </label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value as TrainerSession['sessionType'])}
                className="w-full bg-[#0B1120] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-[#22C55E]"
              >
                <option value="1-on-1 PT">1-on-1 Personal Training</option>
                <option value="HIIT Coaching">HIIT & Conditioning Coaching</option>
                <option value="Strength Assessment">Strength & Form Assessment</option>
                <option value="Nutrition Consultation">Nutrition & Recovery Consultation</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
                Session Date
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full bg-[#0B1120] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-[#22C55E]"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
                Available Time Slot
              </label>
              <div className="grid grid-cols-2 gap-2">
                {selectedTrainer.availableSlots.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setSelectedSlot(slot)}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                      selectedSlot === slot
                        ? 'bg-[#22C55E] text-black border-[#22C55E]'
                        : 'bg-[#0B1120] text-slate-300 border-white/10 hover:border-white/30'
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-xs text-slate-400">
              <span className="font-semibold text-white">Included in your Premium plan:</span> No extra charge. Sessions can be cancelled up to 2 hours prior to start.
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
