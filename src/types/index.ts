export type UserRole = 'member' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  phone?: string;
  joinedDate: string;
  membershipPlanId?: string;
  membershipStatus?: 'active' | 'expiring' | 'expired' | 'frozen';
  membershipExpiry?: string;
}

export interface Member extends User {
  emergencyContact?: string;
  heightCm?: number;
  weightKg?: number;
  targetWeightKg?: number;
  attendanceGoalWeekly?: number;
  assignedTrainerId?: string;
  trainerName?: string;
  assignedWorkoutPlanId?: string;
  activeSessionsAttended?: number;
  totalSessionsExpected?: number;
}

export interface Trainer {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatarUrl: string;
  specialization: string[];
  experienceYears: number;
  rating: number;
  activeClientsCount: number;
  clientsCount?: number;
  bio: string;
  availableSlots: string[]; // e.g. ["09:00 AM", "11:00 AM", "02:00 PM", "05:00 PM"]
  availableDays: string[]; // e.g. ["Mon", "Tue", "Wed", "Thu", "Fri"]
}

export interface Exercise {
  id: string;
  name: string;
  category: 'Chest' | 'Back' | 'Legs' | 'Shoulders' | 'Arms' | 'Cardio' | 'Core';
  sets: number;
  reps: number | string;
  durationMinutes?: number;
  restSeconds?: number;
  targetMuscle: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  notes?: string;
  completed?: boolean;
}

export interface WorkoutPlan {
  id: string;
  title: string;
  category: 'Chest' | 'Back' | 'Legs' | 'Shoulders' | 'Arms' | 'Cardio' | 'Full Body';
  description: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  durationWeeks: number;
  daysPerWeek: number;
  exercises: Exercise[];
  assignedMemberCount?: number;
  createdDate: string;
}

export interface WorkoutLog {
  id: string;
  date: string;
  planTitle: string;
  category: string;
  durationMinutes: number;
  caloriesBurned: number;
  exercisesCompleted: number;
  totalExercises: number;
  rating: number; // 1-5
  notes?: string;
}

export interface AttendanceRecord {
  id: string;
  memberId: string;
  memberName: string;
  date: string; // YYYY-MM-DD
  checkInTime: string; // HH:mm AM/PM
  checkOutTime?: string;
  status: 'present' | 'absent' | 'leave';
  location?: string;
}

export interface TrainerSession {
  id: string;
  trainerId: string;
  trainerName: string;
  trainerSpecialty: string;
  memberId: string;
  memberName: string;
  date: string;
  timeSlot: string;
  sessionType: '1-on-1 PT' | 'HIIT Coaching' | 'Strength Assessment' | 'Nutrition Consultation';
  status: 'confirmed' | 'completed' | 'cancelled' | 'rescheduled';
  location: string;
}

export interface MembershipPlan {
  id: string;
  name: string; // 'Basic' | 'Premium' | 'Pro'
  priceMonthly: number;
  priceYearly?: number;
  billingPeriod?: 'monthly' | 'quarterly' | 'annual';
  badge?: string;
  isPopular?: boolean;
  features: string[];
  maxSessionsPerMonth?: number;
  trainerIncluded?: boolean;
  lockerAccess?: boolean;
  saunaAccess?: boolean;
}

export interface PaymentRecord {
  id: string;
  invoiceNumber: string;
  memberId: string;
  memberName: string;
  planName: string;
  amount: number;
  date: string;
  paymentMethod: 'Credit Card' | 'Debit Card' | 'Apple Pay' | 'Bank Transfer';
  status: 'succeeded' | 'pending' | 'failed' | 'paid';
  receiptUrl?: string;
}

export interface PerformanceMetric {
  date: string;
  weightKg: number;
  bmi: number;
  bodyFatPercent: number;
  chestCm: number;
  waistCm: number;
  bicepCm: number;
  thighCm: number;
  benchPressKg: number;
  squatKg: number;
  deadliftKg: number;
}

export interface FitnessGoal {
  id: string;
  title: string;
  targetValue: string;
  currentValue: string;
  deadline: string;
  progressPercent: number;
  category: 'Weight' | 'Strength' | 'Attendance' | 'Cardio';
}

export interface AdminStats {
  totalMembers: number;
  activeMemberships: number;
  expiringSubscriptions: number;
  totalTrainers: number;
  todayAttendance: number;
  monthlyRevenue: number;
  revenueGrowthPercent: number;
  attendanceRatePercent?: number;
}

export type NavigationTab = 
  | 'landing'
  | 'login'
  | 'member-dashboard'
  | 'workout-plans'
  | 'attendance'
  | 'trainer-schedule'
  | 'subscriptions'
  | 'performance'
  | 'admin-dashboard'
  | 'admin-members'
  | 'admin-trainers'
  | 'admin-plans'
  | 'admin-workouts'
  | 'admin-attendance'
  | 'admin-renewals'
  | 'tech-docs'
  | 'api-docs';
