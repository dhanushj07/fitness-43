import React, { useState } from 'react';
import {
  UserCheck,
  Plus,
  Star,
  Clock,
  Calendar,
  Users,
  Award,
  Edit2,
  Trash2,
} from 'lucide-react';
import { Trainer } from '../../types';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Modal } from '../../components/common/Modal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { StatusBadge } from '../../components/common/StatusBadge';

interface TrainerManagementPageProps {
  trainers: Trainer[];
  onAddTrainer: (trainerData: Omit<Trainer, 'id'>) => void;
  onUpdateTrainer: (id: string, updates: Partial<Trainer>) => void;
  onDeleteTrainer: (id: string) => void;
}

export const TrainerManagementPage: React.FC<TrainerManagementPageProps> = ({
  trainers,
  onAddTrainer,
  onUpdateTrainer,
  onDeleteTrainer,
}) => {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingTrainer, setEditingTrainer] = useState<Trainer | null>(null);
  const [deletingTrainer, setDeletingTrainer] = useState<Trainer | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    specialization: 'Hypertrophy & Powerlifting',
    experienceYears: 5,
    bio: '',
    rating: 4.9,
    clientsCount: 15,
  });

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      specialization: 'Hypertrophy & Powerlifting',
      experienceYears: 5,
      bio: '',
      rating: 4.9,
      clientsCount: 15,
    });
  };

  const handleOpenAdd = () => {
    resetForm();
    setIsAddOpen(true);
  };

  const handleOpenEdit = (t: Trainer) => {
    setEditingTrainer(t);
    setFormData({
      name: t.name,
      email: t.email,
      phone: t.phone || '',
      specialization: t.specialization.join(', '),
      experienceYears: t.experienceYears,
      bio: t.bio,
      rating: t.rating,
      clientsCount: t.clientsCount || t.activeClientsCount || 0,
    });
  };

  const handleSaveAdd = () => {
    if (!formData.name || !formData.email) return;

    onAddTrainer({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      specialization: formData.specialization.split(',').map(s => s.trim()),
      experienceYears: Number(formData.experienceYears),
      rating: Number(formData.rating),
      clientsCount: Number(formData.clientsCount),
      avatarUrl: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&q=80&w=250',
      availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      availableSlots: ['08:00 AM', '10:00 AM', '02:00 PM', '04:00 PM'],
      bio: formData.bio || 'Dedicated elite fitness trainer helping members unlock peak athletic performance.',
    });

    setIsAddOpen(false);
  };

  const handleSaveEdit = () => {
    if (!editingTrainer) return;

    onUpdateTrainer(editingTrainer.id, {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      specialization: formData.specialization.split(',').map(s => s.trim()),
      experienceYears: Number(formData.experienceYears),
      rating: Number(formData.rating),
      clientsCount: Number(formData.clientsCount),
      bio: formData.bio,
    });

    setEditingTrainer(null);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-[#22C55E] uppercase tracking-wider">
            Staff & Coaching Roster
          </span>
          <h2 className="text-2xl font-black text-white mt-1">Certified Coaches ({trainers.length})</h2>
          <p className="text-xs text-slate-400">Manage coaching personnel, client load, and shift allocations</p>
        </div>

        <Button
          id="add-trainer-btn"
          variant="primary"
          size="md"
          onClick={handleOpenAdd}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Add New Trainer
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {trainers.map(t => (
          <div
            key={t.id}
            className="p-6 rounded-3xl bg-[#0F172A] border border-white/10 shadow-xl flex flex-col justify-between hover:border-white/20 transition-all group"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <img
                    src={t.avatarUrl}
                    alt={t.name}
                    className="w-14 h-14 rounded-2xl object-cover border border-white/10 group-hover:scale-105 transition-transform"
                  />
                  <div>
                    <h3 className="text-base font-bold text-white">{t.name}</h3>
                    <span className="text-xs text-slate-400">{t.email}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-xs font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-lg border border-amber-400/20">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span>{t.rating.toFixed(1)}</span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex flex-wrap gap-1.5">
                  {t.specialization.map((spec, i) => (
                    <span
                      key={i}
                      className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-[#22C55E]/10 border border-[#22C55E]/20 text-[#22C55E]"
                    >
                      {spec}
                    </span>
                  ))}
                </div>

                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {t.bio}
                </p>

                <div className="grid grid-cols-2 gap-2 pt-3 border-t border-white/5 text-xs text-slate-400">
                  <div>
                    <span className="block text-[10px] uppercase font-bold text-slate-500">Experience</span>
                    <span className="font-bold text-white">{t.experienceYears} Years</span>
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase font-bold text-slate-500">Active Clients</span>
                    <span className="font-bold text-[#22C55E]">{t.clientsCount} Athletes</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
              <span className="text-xs text-slate-400">
                {t.availableDays.length} Days / Wk
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleOpenEdit(t)}
                  leftIcon={<Edit2 className="w-3.5 h-3.5" />}
                >
                  Edit
                </Button>
                <button
                  onClick={() => setDeletingTrainer(t)}
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Modal */}
      <Modal
        isOpen={isAddOpen || !!editingTrainer}
        onClose={() => {
          setIsAddOpen(false);
          setEditingTrainer(null);
        }}
        title={editingTrainer ? `Edit Coach: ${editingTrainer.name}` : 'Register New Trainer'}
        subtitle="Complete coach profile and credentials"
        maxWidth="md"
        footer={
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setIsAddOpen(false);
                setEditingTrainer(null);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={editingTrainer ? handleSaveEdit : handleSaveAdd}
            >
              {editingTrainer ? 'Save Changes' : 'Enroll Coach'}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="Full Name"
            placeholder="e.g. Marcus Vance"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <Input
            label="Email Address"
            type="email"
            placeholder="e.g. coach@fitflow.io"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          <Input
            label="Specializations (comma separated)"
            placeholder="Hypertrophy, Powerlifting, HIIT"
            value={formData.specialization}
            onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Years Experience"
              type="number"
              value={formData.experienceYears}
              onChange={(e) => setFormData({ ...formData, experienceYears: Number(e.target.value) })}
            />
            <Input
              label="Active Clients Count"
              type="number"
              value={formData.clientsCount}
              onChange={(e) => setFormData({ ...formData, clientsCount: Number(e.target.value) })}
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
              Coach Bio & Philosophy
            </label>
            <textarea
              rows={3}
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="w-full bg-[#0B1120] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-[#22C55E]"
            />
          </div>
        </div>
      </Modal>

      {/* Delete Trainer */}
      {deletingTrainer && (
        <ConfirmDialog
          isOpen={true}
          onClose={() => setDeletingTrainer(null)}
          onConfirm={() => {
            onDeleteTrainer(deletingTrainer.id);
            setDeletingTrainer(null);
          }}
          title="Remove Trainer"
          message={`Are you sure you want to remove ${deletingTrainer.name} from the active staff directory?`}
          confirmLabel="Remove Coach"
          isDestructive={true}
        />
      )}
    </div>
  );
};
