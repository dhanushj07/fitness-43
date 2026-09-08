import React, { useState } from 'react';
import {
  CalendarCheck,
  Search,
  Plus,
  MapPin,
  Clock,
  User,
  Filter,
  CheckCircle2,
} from 'lucide-react';
import { AttendanceRecord, Member } from '../../types';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Modal } from '../../components/common/Modal';
import { StatusBadge } from '../../components/common/StatusBadge';
import { formatDate } from '../../utils/formatters';

interface AttendanceLogPageProps {
  records: AttendanceRecord[];
  members: Member[];
  onManualCheckIn: (memberId: string, location: string) => void;
}

export const AttendanceLogPage: React.FC<AttendanceLogPageProps> = ({
  records,
  members,
  onManualCheckIn,
}) => {
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState(members[0]?.id || '');
  const [selectedLocation, setSelectedLocation] = useState('Main Gym Floor');

  const filteredRecords = records.filter(r =>
    r.memberName.toLowerCase().includes(search.toLowerCase()) ||
    (r.location && r.location.toLowerCase().includes(search.toLowerCase()))
  );

  const handleManualCheckInSubmit = () => {
    if (!selectedMemberId) return;
    onManualCheckIn(selectedMemberId, selectedLocation);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-[#22C55E] uppercase tracking-wider">
            Turnstile & Check-In Log
          </span>
          <h2 className="text-2xl font-black text-white mt-1">Gym Floor Attendance Feed</h2>
          <p className="text-xs text-slate-400">Live facility access, badge scans, and manual check-ins</p>
        </div>

        <Button
          id="manual-checkin-staff-btn"
          variant="primary"
          size="md"
          onClick={() => setIsModalOpen(true)}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Manual Check-In Override
        </Button>
      </div>

      {/* Search & Location Filter */}
      <div className="p-4 rounded-2xl bg-[#0F172A] border border-white/10 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="w-full sm:w-80">
          <Input
            placeholder="Search attendee by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
          />
        </div>

        <div className="text-xs text-slate-400 flex items-center gap-2">
          <span>Total Logged Entries:</span>
          <span className="font-bold text-[#22C55E]">{records.length} records</span>
        </div>
      </div>

      {/* Attendance Feed Table */}
      <div className="rounded-3xl bg-[#0F172A] border border-white/10 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-[#0B1120] text-slate-400 uppercase tracking-wider font-semibold border-b border-white/10">
              <tr>
                <th className="py-3.5 px-4">Athlete</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Time Scanned</th>
                <th className="py-3.5 px-4">Turnstile Zone</th>
                <th className="py-3.5 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredRecords.map((rec) => (
                <tr key={rec.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 font-bold">
                        {rec.memberName.charAt(0)}
                      </div>
                      <span className="font-bold text-white">{rec.memberName}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-300">{formatDate(rec.date)}</td>
                  <td className="py-3.5 px-4 font-mono text-slate-300 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#22C55E]" />
                    <span>{rec.checkInTime}</span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-300 flex items-center gap-1 mt-3 sm:mt-0">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    <span>{rec.location || 'Main Floor'}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <StatusBadge status={rec.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manual Check-in Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Staff Check-In Override"
        subtitle="Manually record a member presence at reception"
        maxWidth="md"
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleManualCheckInSubmit}>
              Log Check-In
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
              Select Member
            </label>
            <select
              value={selectedMemberId}
              onChange={(e) => setSelectedMemberId(e.target.value)}
              className="w-full bg-[#0B1120] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-[#22C55E]"
            >
              {members.map(m => (
                <option key={m.id} value={m.id}>{m.name} ({m.email})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
              Facility Zone
            </label>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full bg-[#0B1120] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-[#22C55E]"
            >
              <option value="Front Desk Turnstile">Front Desk Turnstile</option>
              <option value="Main Gym Floor">Main Gym Floor</option>
              <option value="Free Weights Zone">Free Weights Zone</option>
              <option value="Olympic Lifting Room">Olympic Lifting Room</option>
              <option value="Cardio Deck">Cardio Deck</option>
            </select>
          </div>
        </div>
      </Modal>
    </div>
  );
};
