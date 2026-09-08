/**
 * FitFlow REST API Service Layer
 * 
 * Designed to connect smoothly to Express.js REST API:
 * React -> Express REST API -> PostgreSQL + Redis
 * 
 * In prototype mode, this layer manages mock in-memory & localStorage state
 * while exposing the exact async REST signature expected by a production client.
 */

import {
  Member,
  Trainer,
  WorkoutPlan,
  MembershipPlan,
  PaymentRecord,
  AttendanceRecord,
  TrainerSession,
  PerformanceMetric,
  FitnessGoal,
  AdminStats,
} from '../types';
import {
  INITIAL_MEMBERS,
  INITIAL_TRAINERS,
  INITIAL_WORKOUT_PLANS,
  INITIAL_MEMBERSHIP_PLANS,
  INITIAL_PAYMENTS,
  INITIAL_ATTENDANCE,
  INITIAL_TRAINER_SESSIONS,
  PERFORMANCE_HISTORY,
  INITIAL_GOALS,
  INITIAL_ADMIN_STATS,
} from '../data/mockData';

const STORAGE_KEYS = {
  MEMBERS: 'fitflow_members',
  TRAINERS: 'fitflow_trainers',
  WORKOUT_PLANS: 'fitflow_workout_plans',
  MEMBERSHIP_PLANS: 'fitflow_membership_plans',
  PAYMENTS: 'fitflow_payments',
  ATTENDANCE: 'fitflow_attendance',
  TRAINER_SESSIONS: 'fitflow_trainer_sessions',
  PERFORMANCE: 'fitflow_performance',
  GOALS: 'fitflow_goals',
  ADMIN_STATS: 'fitflow_admin_stats',
};

// Helper to initialize or retrieve from localStorage
function getStore<T>(key: string, defaultData: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(defaultData));
      return defaultData;
    }
    return JSON.parse(raw) as T;
  } catch {
    return defaultData;
  }
}

function setStore<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error('Failed to save to localStorage:', err);
  }
}

// Simulate realistic REST latency
const delay = (ms = 180) => new Promise(res => setTimeout(res, ms));

export const fitFlowApi = {
  // -------------------------------------------------------------
  // MEMBERS (GET /api/members, POST, PUT, DELETE)
  // -------------------------------------------------------------
  async getMembers(): Promise<Member[]> {
    await delay();
    return getStore<Member[]>(STORAGE_KEYS.MEMBERS, INITIAL_MEMBERS);
  },

  async getMemberById(id: string): Promise<Member | null> {
    await delay();
    const members = getStore<Member[]>(STORAGE_KEYS.MEMBERS, INITIAL_MEMBERS);
    return members.find(m => m.id === id) || null;
  },

  async createMember(memberData: Omit<Member, 'id'>): Promise<Member> {
    await delay();
    const members = getStore<Member[]>(STORAGE_KEYS.MEMBERS, INITIAL_MEMBERS);
    const newMember: Member = {
      ...memberData,
      id: `mem-${Date.now()}`,
    };
    const updated = [newMember, ...members];
    setStore(STORAGE_KEYS.MEMBERS, updated);
    return newMember;
  },

  async updateMember(id: string, updates: Partial<Member>): Promise<Member> {
    await delay();
    const members = getStore<Member[]>(STORAGE_KEYS.MEMBERS, INITIAL_MEMBERS);
    const index = members.findIndex(m => m.id === id);
    if (index === -1) throw new Error(`Member with id ${id} not found`);
    const updatedMember = { ...members[index], ...updates };
    members[index] = updatedMember;
    setStore(STORAGE_KEYS.MEMBERS, members);
    return updatedMember;
  },

  async deleteMember(id: string): Promise<boolean> {
    await delay();
    const members = getStore<Member[]>(STORAGE_KEYS.MEMBERS, INITIAL_MEMBERS);
    const filtered = members.filter(m => m.id !== id);
    setStore(STORAGE_KEYS.MEMBERS, filtered);
    return true;
  },

  // -------------------------------------------------------------
  // TRAINERS (GET /api/trainers, POST, PUT, DELETE)
  // -------------------------------------------------------------
  async getTrainers(): Promise<Trainer[]> {
    await delay();
    return getStore<Trainer[]>(STORAGE_KEYS.TRAINERS, INITIAL_TRAINERS);
  },

  async createTrainer(trainerData: Omit<Trainer, 'id'>): Promise<Trainer> {
    await delay();
    const trainers = getStore<Trainer[]>(STORAGE_KEYS.TRAINERS, INITIAL_TRAINERS);
    const newTrainer: Trainer = {
      ...trainerData,
      id: `tr-${Date.now()}`,
    };
    const updated = [newTrainer, ...trainers];
    setStore(STORAGE_KEYS.TRAINERS, updated);
    return newTrainer;
  },

  async updateTrainer(id: string, updates: Partial<Trainer>): Promise<Trainer> {
    await delay();
    const trainers = getStore<Trainer[]>(STORAGE_KEYS.TRAINERS, INITIAL_TRAINERS);
    const index = trainers.findIndex(t => t.id === id);
    if (index === -1) throw new Error(`Trainer with id ${id} not found`);
    trainers[index] = { ...trainers[index], ...updates };
    setStore(STORAGE_KEYS.TRAINERS, trainers);
    return trainers[index];
  },

  async deleteTrainer(id: string): Promise<boolean> {
    await delay();
    const trainers = getStore<Trainer[]>(STORAGE_KEYS.TRAINERS, INITIAL_TRAINERS);
    const filtered = trainers.filter(t => t.id !== id);
    setStore(STORAGE_KEYS.TRAINERS, filtered);
    return true;
  },

  // -------------------------------------------------------------
  // WORKOUT PLANS (GET /api/workouts, POST, PUT, DELETE)
  // -------------------------------------------------------------
  async getWorkoutPlans(): Promise<WorkoutPlan[]> {
    await delay();
    return getStore<WorkoutPlan[]>(STORAGE_KEYS.WORKOUT_PLANS, INITIAL_WORKOUT_PLANS);
  },

  async toggleExerciseCompletion(planId: string, exerciseId: string): Promise<WorkoutPlan> {
    await delay(120);
    const plans = getStore<WorkoutPlan[]>(STORAGE_KEYS.WORKOUT_PLANS, INITIAL_WORKOUT_PLANS);
    const planIndex = plans.findIndex(p => p.id === planId);
    if (planIndex === -1) throw new Error('Plan not found');
    
    const plan = { ...plans[planIndex] };
    plan.exercises = plan.exercises.map(ex => 
      ex.id === exerciseId ? { ...ex, completed: !ex.completed } : ex
    );
    plans[planIndex] = plan;
    setStore(STORAGE_KEYS.WORKOUT_PLANS, plans);
    return plan;
  },

  async createWorkoutPlan(plan: Omit<WorkoutPlan, 'id' | 'createdDate'>): Promise<WorkoutPlan> {
    await delay();
    const plans = getStore<WorkoutPlan[]>(STORAGE_KEYS.WORKOUT_PLANS, INITIAL_WORKOUT_PLANS);
    const newPlan: WorkoutPlan = {
      ...plan,
      id: `wp-${Date.now()}`,
      createdDate: new Date().toISOString().split('T')[0],
      assignedMemberCount: 0,
    };
    const updated = [newPlan, ...plans];
    setStore(STORAGE_KEYS.WORKOUT_PLANS, updated);
    return newPlan;
  },

  async deleteWorkoutPlan(id: string): Promise<boolean> {
    await delay();
    const plans = getStore<WorkoutPlan[]>(STORAGE_KEYS.WORKOUT_PLANS, INITIAL_WORKOUT_PLANS);
    const filtered = plans.filter(p => p.id !== id);
    setStore(STORAGE_KEYS.WORKOUT_PLANS, filtered);
    return true;
  },

  // -------------------------------------------------------------
  // ATTENDANCE (GET /api/attendance, POST /api/attendance/check-in)
  // -------------------------------------------------------------
  async getAttendance(_memberId?: string): Promise<AttendanceRecord[]> {
    await delay();
    return getStore<AttendanceRecord[]>(STORAGE_KEYS.ATTENDANCE, INITIAL_ATTENDANCE);
  },

  async checkInMember(memberId: string, memberName: string, location = 'Main Gym Floor'): Promise<AttendanceRecord> {
    await delay(250);
    const attendance = getStore<AttendanceRecord[]>(STORAGE_KEYS.ATTENDANCE, INITIAL_ATTENDANCE);
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    // Check if already checked in today
    const existing = attendance.find(a => a.memberId === memberId && a.date === dateStr);
    if (existing) {
      return existing;
    }

    const newRecord: AttendanceRecord = {
      id: `att-${Date.now()}`,
      memberId,
      memberName,
      date: dateStr,
      checkInTime: timeStr,
      status: 'present',
      location,
    };

    const updated = [newRecord, ...attendance];
    setStore(STORAGE_KEYS.ATTENDANCE, updated);

    // Also bump activeSessionsAttended in member object
    const members = getStore<Member[]>(STORAGE_KEYS.MEMBERS, INITIAL_MEMBERS);
    const mIdx = members.findIndex(m => m.id === memberId);
    if (mIdx !== -1) {
      members[mIdx].activeSessionsAttended = (members[mIdx].activeSessionsAttended || 0) + 1;
      setStore(STORAGE_KEYS.MEMBERS, members);
    }

    return newRecord;
  },

  // -------------------------------------------------------------
  // TRAINER SESSIONS (GET /api/trainer-sessions, POST, CANCEL)
  // -------------------------------------------------------------
  async getTrainerSessions(): Promise<TrainerSession[]> {
    await delay();
    return getStore<TrainerSession[]>(STORAGE_KEYS.TRAINER_SESSIONS, INITIAL_TRAINER_SESSIONS);
  },

  async bookTrainerSession(sessionData: Omit<TrainerSession, 'id' | 'status'>): Promise<TrainerSession> {
    await delay(250);
    const sessions = getStore<TrainerSession[]>(STORAGE_KEYS.TRAINER_SESSIONS, INITIAL_TRAINER_SESSIONS);
    const newSession: TrainerSession = {
      ...sessionData,
      id: `ses-${Date.now()}`,
      status: 'confirmed',
    };
    const updated = [newSession, ...sessions];
    setStore(STORAGE_KEYS.TRAINER_SESSIONS, updated);
    return newSession;
  },

  async cancelTrainerSession(sessionId: string): Promise<boolean> {
    await delay();
    const sessions = getStore<TrainerSession[]>(STORAGE_KEYS.TRAINER_SESSIONS, INITIAL_TRAINER_SESSIONS);
    const updated = sessions.map(s => s.id === sessionId ? { ...s, status: 'cancelled' as const } : s);
    setStore(STORAGE_KEYS.TRAINER_SESSIONS, updated);
    return true;
  },

  // -------------------------------------------------------------
  // SUBSCRIPTIONS & PAYMENTS (GET /api/subscriptions, POST /api/subscriptions/renew)
  // -------------------------------------------------------------
  async getMembershipPlans(): Promise<MembershipPlan[]> {
    await delay();
    return getStore<MembershipPlan[]>(STORAGE_KEYS.MEMBERSHIP_PLANS, INITIAL_MEMBERSHIP_PLANS);
  },

  async getPayments(_memberId?: string): Promise<PaymentRecord[]> {
    await delay();
    return getStore<PaymentRecord[]>(STORAGE_KEYS.PAYMENTS, INITIAL_PAYMENTS);
  },

  async renewSubscription(
    memberId: string,
    planId: string,
    paymentMethod: PaymentRecord['paymentMethod']
  ): Promise<{ member: Member; payment: PaymentRecord; updatedExpiry: string }> {
    await delay(350);
    const plans = getStore<MembershipPlan[]>(STORAGE_KEYS.MEMBERSHIP_PLANS, INITIAL_MEMBERSHIP_PLANS);
    const members = getStore<Member[]>(STORAGE_KEYS.MEMBERS, INITIAL_MEMBERS);
    const payments = getStore<PaymentRecord[]>(STORAGE_KEYS.PAYMENTS, INITIAL_PAYMENTS);

    const plan = plans.find(p => p.id === planId) || plans[1];
    const member = members.find(m => m.id === memberId) || members[0];

    // Compute new expiry date (+30 days from now or current expiry)
    const currentExp = new Date(member.membershipExpiry || new Date());
    const baseDate = currentExp > new Date() ? currentExp : new Date();
    baseDate.setDate(baseDate.getDate() + 30);
    const newExpiry = baseDate.toISOString().split('T')[0];

    // Update member
    member.membershipExpiry = newExpiry;
    member.membershipStatus = 'active';
    member.membershipPlanId = plan.id;
    setStore(STORAGE_KEYS.MEMBERS, members);

    // Create payment receipt
    const newPayment: PaymentRecord = {
      id: `pay-${Date.now()}`,
      invoiceNumber: `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      memberId: member.id,
      memberName: member.name,
      planName: `FitFlow ${plan.name} Membership`,
      amount: plan.priceMonthly,
      date: new Date().toISOString().split('T')[0],
      paymentMethod,
      status: 'succeeded',
    };

    setStore(STORAGE_KEYS.PAYMENTS, [newPayment, ...payments]);
    return { member, payment: newPayment, updatedExpiry: newExpiry };
  },

  // -------------------------------------------------------------
  // PERFORMANCE & GOALS (GET /api/performance, POST)
  // -------------------------------------------------------------
  async getPerformanceHistory(): Promise<PerformanceMetric[]> {
    await delay();
    return getStore<PerformanceMetric[]>(STORAGE_KEYS.PERFORMANCE, PERFORMANCE_HISTORY);
  },

  async addPerformanceMetric(metricOrId: PerformanceMetric | string, metricObj?: PerformanceMetric): Promise<PerformanceMetric> {
    await delay();
    const metric = typeof metricOrId === 'object' ? metricOrId : (metricObj as PerformanceMetric);
    const history = getStore<PerformanceMetric[]>(STORAGE_KEYS.PERFORMANCE, PERFORMANCE_HISTORY);
    const updated = [...history, metric];
    setStore(STORAGE_KEYS.PERFORMANCE, updated);
    return metric;
  },

  async getFitnessGoals(_memberId?: string): Promise<FitnessGoal[]> {
    await delay();
    return getStore<FitnessGoal[]>(STORAGE_KEYS.GOALS, INITIAL_GOALS);
  },

  async updateGoal(id: string, updates: Partial<FitnessGoal>): Promise<FitnessGoal[]> {
    await delay();
    const goals = getStore<FitnessGoal[]>(STORAGE_KEYS.GOALS, INITIAL_GOALS);
    const updated = goals.map(g => g.id === id ? { ...g, ...updates } : g);
    setStore(STORAGE_KEYS.GOALS, updated);
    return updated;
  },

  async createGoal(goal: Omit<FitnessGoal, 'id'>): Promise<FitnessGoal[]> {
    await delay();
    const goals = getStore<FitnessGoal[]>(STORAGE_KEYS.GOALS, INITIAL_GOALS);
    const newGoal: FitnessGoal = {
      ...goal,
      id: `goal-${Date.now()}`,
    };
    const updated = [...goals, newGoal];
    setStore(STORAGE_KEYS.GOALS, updated);
    return updated;
  },

  // -------------------------------------------------------------
  // ADMIN STATS (GET /api/admin/stats)
  // -------------------------------------------------------------
  async getAdminStats(): Promise<AdminStats> {
    await delay();
    return getStore<AdminStats>(STORAGE_KEYS.ADMIN_STATS, INITIAL_ADMIN_STATS);
  },

  // Convenience aliases and extensions
  async getMember(id: string): Promise<Member | null> {
    return this.getMemberById(id);
  },

  async getAllMembers(): Promise<Member[]> {
    return this.getMembers();
  },

  async addMember(memberData: Omit<Member, 'id'>): Promise<Member> {
    return this.createMember(memberData);
  },

  async getAllAttendance(): Promise<AttendanceRecord[]> {
    return this.getAttendance();
  },

  async checkInAttendance(memberId: string, memberName: string, location?: string): Promise<AttendanceRecord> {
    return this.checkInMember(memberId, memberName, location);
  },

  async toggleExerciseProgress(planId: string, exerciseId: string): Promise<WorkoutPlan> {
    return this.toggleExerciseCompletion(planId, exerciseId);
  },

  async resetPlanProgress(planId: string): Promise<WorkoutPlan> {
    await delay(100);
    const plans = getStore<WorkoutPlan[]>(STORAGE_KEYS.WORKOUT_PLANS, INITIAL_WORKOUT_PLANS);
    const planIndex = plans.findIndex(p => p.id === planId);
    if (planIndex === -1) throw new Error('Plan not found');
    plans[planIndex].exercises = plans[planIndex].exercises.map(e => ({ ...e, completed: false }));
    setStore(STORAGE_KEYS.WORKOUT_PLANS, plans);
    return plans[planIndex];
  },

  async getPerformanceMetrics(_memberId?: string): Promise<PerformanceMetric[]> {
    return this.getPerformanceHistory();
  },

  async addTrainer(trainerData: Omit<Trainer, 'id'>): Promise<Trainer> {
    return this.createTrainer(trainerData);
  },

  async addWorkoutPlan(plan: Omit<WorkoutPlan, 'id' | 'createdDate'>): Promise<WorkoutPlan> {
    return this.createWorkoutPlan(plan);
  },

  async updateMembershipPlan(id: string, updates: Partial<MembershipPlan>): Promise<MembershipPlan> {
    await delay();
    const plans = getStore<MembershipPlan[]>(STORAGE_KEYS.MEMBERSHIP_PLANS, INITIAL_MEMBERSHIP_PLANS);
    const idx = plans.findIndex(p => p.id === id);
    if (idx === -1) throw new Error('Plan not found');
    plans[idx] = { ...plans[idx], ...updates };
    setStore(STORAGE_KEYS.MEMBERSHIP_PLANS, plans);
    return plans[idx];
  },

  async addMembershipPlan(planData: Omit<MembershipPlan, 'id'>): Promise<MembershipPlan> {
    await delay();
    const plans = getStore<MembershipPlan[]>(STORAGE_KEYS.MEMBERSHIP_PLANS, INITIAL_MEMBERSHIP_PLANS);
    const newPlan: MembershipPlan = {
      ...planData,
      id: `plan-${Date.now()}`,
    };
    const updated = [...plans, newPlan];
    setStore(STORAGE_KEYS.MEMBERSHIP_PLANS, updated);
    return newPlan;
  },

  async adminRenewMember(memberId: string, planId: string, daysToAdd = 30): Promise<Member> {
    await delay(200);
    const members = getStore<Member[]>(STORAGE_KEYS.MEMBERS, INITIAL_MEMBERS);
    const mIdx = members.findIndex(m => m.id === memberId);
    if (mIdx === -1) throw new Error('Member not found');
    
    const currentExp = new Date(members[mIdx].membershipExpiry || new Date());
    const baseDate = currentExp > new Date() ? currentExp : new Date();
    baseDate.setDate(baseDate.getDate() + daysToAdd);

    members[mIdx].membershipExpiry = baseDate.toISOString().split('T')[0];
    members[mIdx].membershipStatus = 'active';
    members[mIdx].membershipPlanId = planId;
    setStore(STORAGE_KEYS.MEMBERS, members);
    return members[mIdx];
  },

  // Reset to initial defaults
  resetAllData(): void {
    Object.values(STORAGE_KEYS).forEach(k => localStorage.removeItem(k));
  }
};
