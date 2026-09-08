import React, { useState } from 'react';
import {
  AlertTriangle,
  RotateCw,
  Mail,
  Calendar,
  CreditCard,
  CheckCircle2,
  Clock,
  Sparkles,
  Search,
} from 'lucide-react';
import { Member, MembershipPlan } from '../../types';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { StatusBadge } from '../../components/common/StatusBadge';
import { formatDate } from '../../utils/formatters';

interface RenewalsManagementPageProps {
  members: Member[];
  plans: MembershipPlan[];
  onRenewMember: (memberId: string, planId: string, daysToAdd: number) => void;
  onSendReminder: (memberId: string) => void;
}

export const RenewalsManagementPage: React.FC<RenewalsManagementPageProps> = ({
  members,
  plans,
  onRenewMember,
  onSendReminder,
}) => {
  const [search, setSearch] = useState('');
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [selectedPlanId, setSelectedPlanId] = useState('plan-premium');
  const [daysToAdd, setDaysToAdd] = useState(30);

  const expiringOrExpired = members.filter(m =>
    m.membershipStatus === 'expiring' ||
    m.membershipStatus === 'expired' ||
    m.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenRenewModal = (m: Member) => {
    setSelectedMember(m);
    setSelectedPlanId(m.membershipPlanId || 'plan-premium');
    setDaysToAdd(30);
  };

  const handleConfirmRenewal = () => {
    if (!selectedMember) return;
    onRenewMember(selectedMember.id, selectedPlanId, Number(daysToAdd));
    setSelectedMember(null);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
            Retention & Churn Prevention
          </span>
          <h2 className="text-2xl font-black text-white mt-1">Subscription Renewals Pipeline</h2>
          <p className="text-xs text-slate-400">Identify expiring athletes, issue extensions, and trigger renewal notices</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-[#0D1527] border border-white/5">
          <span className="text-xs font-semibold text-slate-400">Expiring in &lt;14 Days</span>
          <div className="text-2xl font-black text-amber-400 mt-1">
            {members.filter(m => m.membershipStatus === 'expiring').length} Accounts
          </div>
          <span className="text-[10px] text-amber-400 font-medium">Follow-up suggested</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#0D1527] border border-white/5">
          <span className="text-xs font-semibold text-slate-400">Lapsed / Expired</span>
          <div className="text-2xl font-black text-rose-400 mt-1">
            {members.filter(m => m.membershipStatus === 'expired').length} Accounts
          </div>
          <span className="text-[10px] text-slate-400">Win-back campaign ready</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#0D1527] border border-white/5">
          <span className="text-xs font-semibold text-slate-400">Monthly Retention Rate</span>
          <div className="text-2xl font-black text-[#22C55E] mt-1">94.2%</div>
          <span className="text-[10px] text-emerald-400 font-medium">+1.8% vs last cycle</span>
        </div>
      </div>

      {/* Expiring List Table */}
      <div className="rounded-3xl bg-[#0F172A] border border-white/10 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-[#0B1120] text-slate-400 uppercase tracking-wider font-semibold border-b border-white/10">
              <tr>
                <th className="py-3.5 px-4">Member</th>
                <th className="py-3.5 px-4">Current Tier</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Expiration Date</th>
                <th className="py-3.5 px-4">Contact</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {expiringOrExpired.map(m => (
                <tr key={m.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-white text-sm">{m.name}</div>
                    <span className="text-[10px] text-slate-400">{m.email}</span>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-white">
                    {plans.find(p => p.id === m.membershipPlanId)?.name || 'Premium'}
                  </td>
                  <td className="py-3.5 px-4">
                    <StatusBadge status={m.membershipStatus || 'active'} />
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-300">
                    {formatDate(m.membershipExpiry || '2026-09-15')}
                  </td>
                  <td className="py-3.5 px-4">
                    <button
                      onClick={() => onSendReminder(m.id)}
                      className="inline-flex items-center gap-1 text-[11px] text-[#22C55E] hover:underline"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>Send Reminder Email</span>
                    </button>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleOpenRenewModal(m)}
                      leftIcon={<RotateCw className="w-3 h-3" />}
                    >
                      Renew / Extend
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Renewal Modal */}
      {selectedMember && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedMember(null)}
          title={`Renew Membership for ${selectedMember.name}`}
          subtitle="Add duration and update subscription tier"
          maxWidth="md"
          footer={
            <>
              <Button variant="outline" size="sm" onClick={() => setSelectedMember(null)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={handleConfirmRenewal}>
                Confirm Extension
              </Button>
            </>
          }
        >
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
                Membership Tier
              </label>
              <select
                value={selectedPlanId}
                onChange={(e) => setSelectedPlanId(e.target.value)}
                className="w-full bg-[#0B1120] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-[#22C55E]"
              >
                {plans.map(p => (
                  <option key={p.id} value={p.id}>{p.name} Tier (${p.priceMonthly}/mo)</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
                Extension Duration
              </label>
              <select
                value={daysToAdd}
                onChange={(e) => setDaysToAdd(Number(e.target.value))}
                className="w-full bg-[#0B1120] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-[#22C55E]"
              >
                <option value={30}>+30 Days (1 Month)</option>
                <option value={90}>+90 Days (Quarterly)</option>
                <option value={180}>+180 Days (Half Year)</option>
                <option value={365}>+365 Days (1 Full Year)</option>
              </select>
            </div>

            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 text-xs text-slate-400">
              Upon confirmation, the member's status will instantly flip to{' '}
              <span className="text-[#22C55E] font-bold">Active</span> with turnstile clearance renewed.
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
