import React, { useState } from 'react';
import {
  Users,
  Search,
  Filter,
  Plus,
  Edit2,
  Trash2,
  Mail,
  Phone,
  Calendar,
  CheckCircle2,
  ChevronDown,
} from 'lucide-react';
import { Member, MembershipPlan } from '../../types';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Modal } from '../../components/common/Modal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { StatusBadge } from '../../components/common/StatusBadge';
import { formatDate } from '../../utils/formatters';

interface MemberManagementPageProps {
  members: Member[];
  plans: MembershipPlan[];
  onAddMember: (memberData: Omit<Member, 'id'>) => void;
  onUpdateMember: (id: string, updates: Partial<Member>) => void;
  onDeleteMember: (id: string) => void;
}

export const MemberManagementPage: React.FC<MemberManagementPageProps> = ({
  members,
  plans,
  onAddMember,
  onUpdateMember,
  onDeleteMember,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'expiring' | 'expired'>('all');
  const [planFilter, setPlanFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'joined' | 'expiry'>('name');

  // Modals
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [deletingMember, setDeletingMember] = useState<Member | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    membershipPlanId: 'plan-premium',
    membershipStatus: 'active' as Member['membershipStatus'],
    membershipExpiry: '2026-10-02',
    heightCm: 178,
    weightKg: 75,
    assignedTrainerId: 'tr-01',
    trainerName: 'Marcus Vance',
  });

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      membershipPlanId: 'plan-premium',
      membershipStatus: 'active',
      membershipExpiry: '2026-10-02',
      heightCm: 178,
      weightKg: 75,
      assignedTrainerId: 'tr-01',
      trainerName: 'Marcus Vance',
    });
  };

  const handleOpenAdd = () => {
    resetForm();
    setIsAddOpen(true);
  };

  const handleOpenEdit = (m: Member) => {
    setEditingMember(m);
    setFormData({
      name: m.name,
      email: m.email,
      phone: m.phone || '',
      membershipPlanId: m.membershipPlanId || 'plan-premium',
      membershipStatus: m.membershipStatus || 'active',
      membershipExpiry: m.membershipExpiry || '2026-10-02',
      heightCm: m.heightCm || 175,
      weightKg: m.weightKg || 75,
      assignedTrainerId: m.assignedTrainerId || 'tr-01',
      trainerName: m.trainerName || 'Marcus Vance',
    });
  };

  const handleSaveAdd = () => {
    if (!formData.name || !formData.email) return;

    onAddMember({
      role: 'member',
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      joinedDate: new Date().toISOString().split('T')[0],
      membershipPlanId: formData.membershipPlanId,
      membershipStatus: formData.membershipStatus,
      membershipExpiry: formData.membershipExpiry,
      heightCm: Number(formData.heightCm),
      weightKg: Number(formData.weightKg),
      assignedTrainerId: formData.assignedTrainerId,
      trainerName: formData.trainerName,
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
      activeSessionsAttended: 0,
      totalSessionsExpected: 24,
    });

    setIsAddOpen(false);
  };

  const handleSaveEdit = () => {
    if (!editingMember) return;

    onUpdateMember(editingMember.id, {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      membershipPlanId: formData.membershipPlanId,
      membershipStatus: formData.membershipStatus,
      membershipExpiry: formData.membershipExpiry,
      heightCm: Number(formData.heightCm),
      weightKg: Number(formData.weightKg),
      trainerName: formData.trainerName,
    });

    setEditingMember(null);
  };

  // Filter & Search
  const filteredMembers = members.filter(m => {
    const matchesSearch =
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.phone && m.phone.includes(searchQuery));
    const matchesStatus = statusFilter === 'all' || m.membershipStatus === statusFilter;
    const matchesPlan = planFilter === 'all' || m.membershipPlanId === planFilter;
    return matchesSearch && matchesStatus && matchesPlan;
  }).sort((a, b) => {
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    if (sortBy === 'joined') return new Date(b.joinedDate).getTime() - new Date(a.joinedDate).getTime();
    if (sortBy === 'expiry') {
      return (
        new Date(a.membershipExpiry || '').getTime() - new Date(b.membershipExpiry || '').getTime()
      );
    }
    return 0;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-[#22C55E] uppercase tracking-wider">
            Directory & Access Control
          </span>
          <h2 className="text-2xl font-black text-white mt-1">Club Members ({members.length})</h2>
          <p className="text-xs text-slate-400">Search, filter, enroll and update membership records</p>
        </div>

        <Button
          id="add-new-member-btn"
          variant="primary"
          size="md"
          onClick={handleOpenAdd}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Add New Member
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-[#0F172A] border border-white/10 shadow-lg flex flex-col md:flex-row items-center gap-3">
        <div className="w-full md:w-80">
          <Input
            placeholder="Search by name, email, or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="bg-[#0B1120] border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-[#22C55E]"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="expiring">Expiring Soon</option>
            <option value="expired">Expired</option>
          </select>

          {/* Plan Filter */}
          <select
            value={planFilter}
            onChange={(e) => setPlanFilter(e.target.value)}
            className="bg-[#0B1120] border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-[#22C55E]"
          >
            <option value="all">All Plans</option>
            {plans.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-[#0B1120] border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-[#22C55E]"
          >
            <option value="name">Sort: Name (A-Z)</option>
            <option value="joined">Sort: Newest Joined</option>
            <option value="expiry">Sort: Expiration Date</option>
          </select>
        </div>
      </div>

      {/* Member Table */}
      <div className="rounded-3xl bg-[#0F172A] border border-white/10 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-[#0B1120] text-slate-400 uppercase tracking-wider font-semibold border-b border-white/10">
              <tr>
                <th className="py-3.5 px-4">Member Name</th>
                <th className="py-3.5 px-4">Contact Info</th>
                <th className="py-3.5 px-4">Plan Tier</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Expires</th>
                <th className="py-3.5 px-4">Assigned Coach</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredMembers.map(m => (
                <tr key={m.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={m.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150'}
                        alt={m.name}
                        className="w-9 h-9 rounded-xl object-cover border border-white/10"
                      />
                      <div>
                        <div className="font-bold text-white text-sm">{m.name}</div>
                        <span className="text-[10px] text-slate-400">ID: {m.id}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="text-slate-300">{m.email}</div>
                    <div className="text-[11px] text-slate-400">{m.phone || 'No phone'}</div>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-white">
                    {plans.find(p => p.id === m.membershipPlanId)?.name || 'Premium'}
                  </td>
                  <td className="py-3.5 px-4">
                    <StatusBadge status={m.membershipStatus || 'active'} />
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-300">
                    {formatDate(m.membershipExpiry || '2026-10-02')}
                  </td>
                  <td className="py-3.5 px-4 text-slate-300">
                    {m.trainerName || 'Unassigned'}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => handleOpenEdit(m)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                        title="Edit Member"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeletingMember(m)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                        title="Delete Member"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredMembers.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No members found matching your search and filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      <Modal
        isOpen={isAddOpen || !!editingMember}
        onClose={() => {
          setIsAddOpen(false);
          setEditingMember(null);
        }}
        title={editingMember ? `Edit Member: ${editingMember.name}` : 'Enroll New Club Member'}
        subtitle="Complete profile and membership details"
        maxWidth="lg"
        footer={
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setIsAddOpen(false);
                setEditingMember(null);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={editingMember ? handleSaveEdit : handleSaveAdd}
            >
              {editingMember ? 'Save Changes' : 'Enroll Member'}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Full Name"
              placeholder="e.g. Liam Gallagher"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <Input
              label="Email Address"
              type="email"
              placeholder="e.g. liam@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Phone Number"
              placeholder="+1 (555) 000-0000"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
                Membership Tier
              </label>
              <select
                value={formData.membershipPlanId}
                onChange={(e) => setFormData({ ...formData, membershipPlanId: e.target.value })}
                className="w-full bg-[#0B1120] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-[#22C55E]"
              >
                {plans.map(p => (
                  <option key={p.id} value={p.id}>{p.name} Tier (${p.priceMonthly}/mo)</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
                Status
              </label>
              <select
                value={formData.membershipStatus}
                onChange={(e) => setFormData({ ...formData, membershipStatus: e.target.value as any })}
                className="w-full bg-[#0B1120] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-[#22C55E]"
              >
                <option value="active">Active</option>
                <option value="expiring">Expiring</option>
                <option value="expired">Expired</option>
                <option value="frozen">Frozen</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
                Expiration Date
              </label>
              <input
                type="date"
                value={formData.membershipExpiry}
                onChange={(e) => setFormData({ ...formData, membershipExpiry: e.target.value })}
                className="w-full bg-[#0B1120] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-[#22C55E]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Height (cm)"
              type="number"
              value={formData.heightCm}
              onChange={(e) => setFormData({ ...formData, heightCm: Number(e.target.value) })}
            />
            <Input
              label="Weight (kg)"
              type="number"
              value={formData.weightKg}
              onChange={(e) => setFormData({ ...formData, weightKg: Number(e.target.value) })}
            />
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation */}
      {deletingMember && (
        <ConfirmDialog
          isOpen={true}
          onClose={() => setDeletingMember(null)}
          onConfirm={() => {
            onDeleteMember(deletingMember.id);
            setDeletingMember(null);
          }}
          title="Revoke Member Record"
          message={`Are you sure you want to permanently delete ${deletingMember.name}? This will remove all their workout logs and attendance histories.`}
          confirmLabel="Delete Member"
          isDestructive={true}
        />
      )}
    </div>
  );
};
