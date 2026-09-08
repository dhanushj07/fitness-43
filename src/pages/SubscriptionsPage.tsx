import React, { useState } from 'react';
import {
  CreditCard,
  CheckCircle2,
  Calendar,
  ShieldCheck,
  Zap,
  ArrowRight,
  Download,
  Clock,
  Sparkles,
  AlertCircle,
} from 'lucide-react';
import { MembershipPlan, PaymentRecord, Member } from '../types';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { StatusBadge } from '../components/common/StatusBadge';
import { formatCurrency, formatDate } from '../utils/formatters';

interface SubscriptionsPageProps {
  member: Member;
  plans: MembershipPlan[];
  payments: PaymentRecord[];
  onRenewSubscription: (planId: string, paymentMethod: PaymentRecord['paymentMethod']) => void;
}

export const SubscriptionsPage: React.FC<SubscriptionsPageProps> = ({
  member,
  plans,
  payments,
  onRenewSubscription,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState<string>(member.membershipPlanId || 'plan-premium');
  const [paymentMethod, setPaymentMethod] = useState<PaymentRecord['paymentMethod']>('Credit Card');
  const [cardNumber, setCardNumber] = useState('•••• •••• •••• 4242');
  const [isProcessing, setIsProcessing] = useState(false);

  const currentPlan = plans.find(p => p.id === member.membershipPlanId) || plans[1];

  const handleOpenRenew = (planId?: string) => {
    if (planId) setSelectedPlanId(planId);
    setIsModalOpen(true);
  };

  const handleConfirmRenew = () => {
    setIsProcessing(true);
    setTimeout(() => {
      onRenewSubscription(selectedPlanId, paymentMethod);
      setIsProcessing(false);
      setIsModalOpen(false);
    }, 450);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Current Subscription Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#0F172A] via-[#0D1527] to-[#0B1120] border border-white/10 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#22C55E] uppercase tracking-wider">
                Current Active Subscription
              </span>
              <StatusBadge status={member.membershipStatus || 'active'} />
            </div>
            <h2 className="text-3xl font-black text-white tracking-tight font-['Outfit',sans-serif]">
              {currentPlan.name} Membership Tier
            </h2>
            <div className="text-2xl font-black text-[#22C55E]">
              {formatCurrency(currentPlan.priceMonthly)} <span className="text-xs text-slate-400 font-normal">/ month</span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-3.5 rounded-xl bg-[#0B1120] border border-white/5">
              <span className="text-slate-400 block mb-1">Start Date</span>
              <span className="font-bold text-white">{formatDate(member.joinedDate)}</span>
            </div>
            <div className="p-3.5 rounded-xl bg-[#0B1120] border border-white/5">
              <span className="text-slate-400 block mb-1">Expiration Date</span>
              <span className="font-bold text-white">{formatDate(member.membershipExpiry || '2026-10-02')}</span>
            </div>
            <div className="p-3.5 rounded-xl bg-[#0B1120] border border-white/5 col-span-2 sm:col-span-1">
              <span className="text-slate-400 block mb-1">Auto-Renew</span>
              <span className="font-bold text-[#22C55E]">Enabled (Monthly)</span>
            </div>
          </div>

          <div>
            <Button
              id="renew-subscription-main-btn"
              variant="primary"
              size="lg"
              onClick={() => handleOpenRenew(currentPlan.id)}
              leftIcon={<CreditCard className="w-5 h-5" />}
            >
              Extend / Renew Subscription
            </Button>
          </div>
        </div>
      </div>

      {/* Available Plans Comparison */}
      <div className="space-y-4">
        <div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Membership Options</span>
          <h3 className="text-xl font-bold text-white mt-0.5">Available Club Tier Plans</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map(plan => {
            const isCurrent = plan.id === currentPlan.id;

            return (
              <div
                key={plan.id}
                className={`p-6 rounded-3xl border transition-all flex flex-col justify-between relative ${
                  plan.isPopular
                    ? 'bg-[#0F172A] border-[#22C55E]/60 shadow-[0_0_25px_rgba(34,197,94,0.15)] ring-1 ring-[#22C55E]/40'
                    : 'bg-[#0D1527] border-white/5 hover:border-white/20'
                }`}
              >
                {plan.badge && (
                  <div className="absolute -top-3 left-6 px-3 py-0.5 rounded-full bg-[#22C55E] text-black text-[11px] font-black uppercase tracking-wider shadow-md">
                    {plan.badge}
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-xl font-bold text-white">{plan.name}</h4>
                    {isCurrent && (
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                        Current
                      </span>
                    )}
                  </div>

                  <div className="text-3xl font-black text-white mb-4">
                    {formatCurrency(plan.priceMonthly)}
                    <span className="text-xs font-normal text-slate-400"> / month</span>
                  </div>

                  <div className="space-y-2.5 pt-4 border-t border-white/10">
                    {plan.features.map((feat, i) => (
                      <div key={i} className="flex items-start gap-2.5 text-xs text-slate-300">
                        <CheckCircle2 className="w-4 h-4 text-[#22C55E] shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-white/5">
                  <Button
                    variant={isCurrent ? 'secondary' : 'primary'}
                    size="md"
                    className="w-full"
                    onClick={() => handleOpenRenew(plan.id)}
                  >
                    {isCurrent ? 'Renew Current Plan' : `Switch to ${plan.name}`}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Payment History Table */}
      <div className="p-6 rounded-3xl bg-[#0F172A] border border-white/10 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white">Payment & Billing History</h3>
            <p className="text-xs text-slate-400">All recurring transactions and digital invoices</p>
          </div>
          <span className="text-xs text-slate-400 font-mono">Mock Payment Layer</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-[#0B1120] text-slate-400 uppercase tracking-wider font-semibold border-b border-white/10">
              <tr>
                <th className="py-3 px-4">Invoice #</th>
                <th className="py-3 px-4">Plan Item</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Method</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {payments.map(pay => (
                <tr key={pay.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-white">{pay.invoiceNumber}</td>
                  <td className="py-3 px-4">{pay.planName}</td>
                  <td className="py-3 px-4 text-slate-400">{formatDate(pay.date)}</td>
                  <td className="py-3 px-4 flex items-center gap-1.5 mt-2 sm:mt-0">
                    <CreditCard className="w-3.5 h-3.5 text-slate-400" />
                    <span>{pay.paymentMethod}</span>
                  </td>
                  <td className="py-3 px-4 font-bold text-white">{formatCurrency(pay.amount)}</td>
                  <td className="py-3 px-4">
                    <StatusBadge status={pay.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Renew / Payment Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Subscription Renewal Checkout"
        subtitle="Prototype payment gateway - no real charges will occur"
        maxWidth="md"
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setIsModalOpen(false)} disabled={isProcessing}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleConfirmRenew}
              isLoading={isProcessing}
            >
              Complete Renewal
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="p-3.5 rounded-2xl bg-[#0B1120] border border-white/10 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400">Selected Plan</span>
              <h4 className="text-base font-bold text-white">
                {plans.find(p => p.id === selectedPlanId)?.name} Tier
              </h4>
            </div>
            <div className="text-xl font-black text-[#22C55E]">
              {formatCurrency(plans.find(p => p.id === selectedPlanId)?.priceMonthly || 59)}
              <span className="text-xs text-slate-400 font-normal"> / month</span>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
              Select Plan Tier
            </label>
            <select
              value={selectedPlanId}
              onChange={(e) => setSelectedPlanId(e.target.value)}
              className="w-full bg-[#0B1120] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-[#22C55E]"
            >
              {plans.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name} — {formatCurrency(p.priceMonthly)}/mo
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
              Payment Method
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(['Credit Card', 'Apple Pay', 'Debit Card', 'Bank Transfer'] as const).map(m => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setPaymentMethod(m)}
                  className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all flex items-center justify-center gap-2 ${
                    paymentMethod === m
                      ? 'bg-[#22C55E] text-black border-[#22C55E] font-bold'
                      : 'bg-[#0B1120] text-slate-300 border-white/10 hover:border-white/30'
                  }`}
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>{m}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1.5 text-xs text-slate-400">
            <div className="flex items-center justify-between">
              <span>Billing Duration:</span>
              <span className="font-bold text-white">+30 Days Extension</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Next Renewal Date:</span>
              <span className="font-bold text-[#22C55E]">Automatically Calculated</span>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};
