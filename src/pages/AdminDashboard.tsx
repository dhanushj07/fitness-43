import React from 'react';
import {
  Users,
  ShieldCheck,
  CreditCard,
  CalendarCheck,
  UserCheck,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  Plus,
  Clock,
  Sparkles,
} from 'lucide-react';
import { AdminStats, Member, PaymentRecord, NavigationTab } from '../types';
import { RevenueLineChart } from '../components/charts/RevenueLineChart';
import { StatusBadge } from '../components/common/StatusBadge';
import { Button } from '../components/common/Button';
import { formatCurrency, formatDate } from '../utils/formatters';

interface AdminDashboardProps {
  stats: AdminStats;
  members: Member[];
  payments: PaymentRecord[];
  onNavigate: (tab: NavigationTab) => void;
  onQuickAddMember: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  stats,
  members,
  payments,
  onNavigate,
  onQuickAddMember,
}) => {
  const expiringMembers = members.filter(m => m.membershipStatus === 'expiring' || m.membershipStatus === 'expired');
  const recentMembers = [...members].slice(0, 5);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Admin Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#0F172A] via-[#0D1527] to-[#0B1120] border border-white/10 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Director Management Portal</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-['Outfit',sans-serif]">
            Club Operations & Command Center
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            Live capacity monitoring, subscriber lifecycle oversight, revenue trajectory, and staff coaching utilization.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button
            id="admin-quick-add-member-btn"
            variant="primary"
            size="md"
            onClick={onQuickAddMember}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Register New Member
          </Button>
          <Button
            variant="outline"
            size="md"
            onClick={() => onNavigate('admin-renewals')}
          >
            Review Expiring ({expiringMembers.length})
          </Button>
        </div>
      </div>

      {/* 6 Key Executive Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {/* Metric 1 */}
        <div
          onClick={() => onNavigate('admin-members')}
          className="p-4 rounded-2xl bg-[#0D1527] border border-white/5 hover:border-white/20 transition-all cursor-pointer shadow-md"
        >
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-semibold uppercase">Total Members</span>
            <Users className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl font-black text-white">{stats.totalMembers}</div>
          <span className="text-[10px] text-emerald-400 font-bold">+18 this month</span>
        </div>

        {/* Metric 2 */}
        <div
          onClick={() => onNavigate('admin-members')}
          className="p-4 rounded-2xl bg-[#0D1527] border border-white/5 hover:border-white/20 transition-all cursor-pointer shadow-md"
        >
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-semibold uppercase">Active Tiers</span>
            <ShieldCheck className="w-4 h-4 text-[#22C55E]" />
          </div>
          <div className="text-2xl font-black text-[#22C55E]">{stats.activeMemberships}</div>
          <span className="text-[10px] text-slate-400">86.7% retention</span>
        </div>

        {/* Metric 3 */}
        <div
          onClick={() => onNavigate('admin-renewals')}
          className="p-4 rounded-2xl bg-[#0D1527] border border-white/5 hover:border-white/20 transition-all cursor-pointer shadow-md"
        >
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-semibold uppercase">Expiring Soon</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-400">{stats.expiringSubscriptions}</div>
          <span className="text-[10px] text-amber-400 font-bold">Needs follow-up</span>
        </div>

        {/* Metric 4 */}
        <div
          onClick={() => onNavigate('admin-trainers')}
          className="p-4 rounded-2xl bg-[#0D1527] border border-white/5 hover:border-white/20 transition-all cursor-pointer shadow-md"
        >
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-semibold uppercase">Total Trainers</span>
            <UserCheck className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-black text-white">{stats.totalTrainers}</div>
          <span className="text-[10px] text-purple-400 font-medium">Full certified</span>
        </div>

        {/* Metric 5 */}
        <div
          onClick={() => onNavigate('admin-attendance')}
          className="p-4 rounded-2xl bg-[#0D1527] border border-white/5 hover:border-white/20 transition-all cursor-pointer shadow-md"
        >
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-semibold uppercase">Today Attended</span>
            <CalendarCheck className="w-4 h-4 text-[#22C55E]" />
          </div>
          <div className="text-2xl font-black text-white">{stats.todayAttendance}</div>
          <span className="text-[10px] text-slate-400">Peak 6-8 PM</span>
        </div>

        {/* Metric 6 */}
        <div
          onClick={() => onNavigate('admin-plans')}
          className="p-4 rounded-2xl bg-[#0D1527] border border-white/5 hover:border-white/20 transition-all cursor-pointer shadow-md"
        >
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-semibold uppercase">Monthly MRR</span>
            <CreditCard className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400">{formatCurrency(stats.monthlyRevenue)}</div>
          <span className="text-[10px] text-emerald-400 font-bold">+{stats.revenueGrowthPercent}% MoM</span>
        </div>
      </div>

      {/* Main Admin Interactive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Revenue Growth Chart */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-[#0F172A] border border-white/10 shadow-xl space-y-4">
          <RevenueLineChart currentMonthly={stats.monthlyRevenue} growth={stats.revenueGrowthPercent} />
        </div>

        {/* Expiring Subscriptions Attention List */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-[#0F172A] border border-white/10 shadow-xl space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span>Expiring Subscriptions</span>
              </h3>
              <button
                onClick={() => onNavigate('admin-renewals')}
                className="text-xs font-semibold text-[#22C55E] hover:underline"
              >
                View all
              </button>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              Members requiring renewal reminders to prevent lapse:
            </p>

            <div className="space-y-2.5">
              {expiringMembers.slice(0, 3).map(m => (
                <div
                  key={m.id}
                  className="p-3 rounded-2xl bg-[#0B1120] border border-white/5 flex items-center justify-between"
                >
                  <div>
                    <div className="text-xs font-bold text-white">{m.name}</div>
                    <div className="text-[10px] text-slate-400">{m.email}</div>
                  </div>
                  <div className="text-right">
                    <StatusBadge status={m.membershipStatus || 'expiring'} />
                    <span className="text-[10px] text-slate-400 block mt-1 font-mono">
                      {formatDate(m.membershipExpiry || '2026-09-15')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            className="w-full mt-3"
            onClick={() => onNavigate('admin-renewals')}
          >
            Launch Renewal Workflow
          </Button>
        </div>
      </div>

      {/* Recent Member Registrations Table */}
      <div className="p-6 rounded-3xl bg-[#0F172A] border border-white/10 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white">Recent Member Registrations</h3>
            <p className="text-xs text-slate-400">Newly onboarded club athletes</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavigate('admin-members')}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Full Member Directory
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-[#0B1120] text-slate-400 uppercase tracking-wider font-semibold border-b border-white/10">
              <tr>
                <th className="py-3 px-4">Member</th>
                <th className="py-3 px-4">Contact</th>
                <th className="py-3 px-4">Plan</th>
                <th className="py-3 px-4">Assigned Coach</th>
                <th className="py-3 px-4">Joined</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {recentMembers.map(m => (
                <tr key={m.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={m.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150'}
                        alt={m.name}
                        className="w-8 h-8 rounded-lg object-cover"
                      />
                      <span className="font-bold text-white">{m.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-slate-400">{m.email}</td>
                  <td className="py-3 px-4 font-semibold text-white">
                    {m.membershipPlanId === 'plan-pro' ? 'Pro Athlete' : m.membershipPlanId === 'plan-basic' ? 'Basic' : 'Premium'}
                  </td>
                  <td className="py-3 px-4 text-slate-300">{m.trainerName || 'Unassigned'}</td>
                  <td className="py-3 px-4 text-slate-400">{formatDate(m.joinedDate)}</td>
                  <td className="py-3 px-4">
                    <StatusBadge status={m.membershipStatus || 'active'} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
