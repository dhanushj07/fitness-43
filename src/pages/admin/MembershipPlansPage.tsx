import React, { useState } from 'react';
import {
  CreditCard,
  Plus,
  CheckCircle2,
  Edit2,
  Users,
  Sparkles,
  DollarSign,
} from 'lucide-react';
import { MembershipPlan } from '../../types';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Modal } from '../../components/common/Modal';
import { formatCurrency } from '../../utils/formatters';

interface MembershipPlansPageProps {
  plans: MembershipPlan[];
  onUpdatePlan: (planId: string, updates: Partial<MembershipPlan>) => void;
  onAddPlan: (planData: Omit<MembershipPlan, 'id'>) => void;
}

export const MembershipPlansPage: React.FC<MembershipPlansPageProps> = ({
  plans,
  onUpdatePlan,
  onAddPlan,
}) => {
  const [editingPlan, setEditingPlan] = useState<MembershipPlan | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    priceMonthly: 59,
    priceYearly: 590,
    features: 'Gym Access, Locker Room, Free WiFi',
    isPopular: false,
    badge: '',
  });

  const handleOpenEdit = (p: MembershipPlan) => {
    setEditingPlan(p);
    setFormData({
      name: p.name,
      priceMonthly: p.priceMonthly,
      priceYearly: p.priceYearly || Math.round(p.priceMonthly * 10),
      features: p.features.join(', '),
      isPopular: p.isPopular || false,
      badge: p.badge || '',
    });
  };

  const handleOpenAdd = () => {
    setFormData({
      name: '',
      priceMonthly: 49,
      priceYearly: 490,
      features: 'Full Gym Access, Free Weights, Showers',
      isPopular: false,
      badge: '',
    });
    setIsAddOpen(true);
  };

  const handleSaveEdit = () => {
    if (!editingPlan) return;

    onUpdatePlan(editingPlan.id, {
      name: formData.name,
      priceMonthly: Number(formData.priceMonthly),
      priceYearly: Number(formData.priceYearly),
      features: formData.features.split(',').map(f => f.trim()),
      isPopular: formData.isPopular,
      badge: formData.badge,
    });

    setEditingPlan(null);
  };

  const handleSaveAdd = () => {
    if (!formData.name) return;

    onAddPlan({
      name: formData.name,
      priceMonthly: Number(formData.priceMonthly),
      priceYearly: Number(formData.priceYearly),
      features: formData.features.split(',').map(f => f.trim()),
      isPopular: formData.isPopular,
      badge: formData.badge,
    });

    setIsAddOpen(false);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-[#22C55E] uppercase tracking-wider">
            Revenue & Subscription Tiers
          </span>
          <h2 className="text-2xl font-black text-white mt-1">Membership Plan Architect</h2>
          <p className="text-xs text-slate-400">Configure pricing, monthly fee structures, and access benefits</p>
        </div>

        <Button
          id="add-plan-tier-btn"
          variant="primary"
          size="md"
          onClick={handleOpenAdd}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Create New Plan Tier
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map(p => (
          <div
            key={p.id}
            className="p-6 rounded-3xl bg-[#0F172A] border border-white/10 shadow-xl flex flex-col justify-between relative"
          >
            {p.badge && (
              <div className="absolute -top-3 left-6 px-3 py-0.5 rounded-full bg-[#22C55E] text-black text-[11px] font-black uppercase tracking-wider shadow-md">
                {p.badge}
              </div>
            )}

            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-bold text-white">{p.name}</h3>
                <span className="text-xs text-slate-400">Tier ID: {p.id}</span>
              </div>

              <div className="text-3xl font-black text-white mb-4">
                {formatCurrency(p.priceMonthly)}
                <span className="text-xs font-normal text-slate-400"> / month</span>
              </div>

              <div className="space-y-2.5 pt-4 border-t border-white/10">
                {p.features.map((feat, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-[#22C55E] shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-white/5 flex items-center justify-between">
              <span className="text-xs text-slate-400">
                Yearly: {formatCurrency(p.priceYearly)}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleOpenEdit(p)}
                leftIcon={<Edit2 className="w-3.5 h-3.5" />}
              >
                Edit Tier
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit / Add Modal */}
      <Modal
        isOpen={isAddOpen || !!editingPlan}
        onClose={() => {
          setIsAddOpen(false);
          setEditingPlan(null);
        }}
        title={editingPlan ? `Configure Tier: ${editingPlan.name}` : 'Create New Membership Plan'}
        subtitle="Set commercial terms and featured benefits"
        maxWidth="md"
        footer={
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setIsAddOpen(false);
                setEditingPlan(null);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={editingPlan ? handleSaveEdit : handleSaveAdd}
            >
              {editingPlan ? 'Update Plan' : 'Publish Plan'}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="Plan Name"
            placeholder="e.g. VIP Elite"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Monthly Fee ($)"
              type="number"
              value={formData.priceMonthly}
              onChange={(e) => setFormData({ ...formData, priceMonthly: Number(e.target.value) })}
            />
            <Input
              label="Yearly Fee ($)"
              type="number"
              value={formData.priceYearly}
              onChange={(e) => setFormData({ ...formData, priceYearly: Number(e.target.value) })}
            />
          </div>
          <Input
            label="Promotional Badge (optional)"
            placeholder="e.g. Most Popular"
            value={formData.badge}
            onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
          />
          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
              Features (comma separated)
            </label>
            <textarea
              rows={3}
              value={formData.features}
              onChange={(e) => setFormData({ ...formData, features: e.target.value })}
              className="w-full bg-[#0B1120] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-[#22C55E]"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};
