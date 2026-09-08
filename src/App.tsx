import React, { useState, useEffect } from 'react';
import {
  NavigationTab,
  UserRole,
  Member,
  Trainer,
  WorkoutPlan,
  TrainerSession,
  AttendanceRecord,
  PerformanceMetric,
  MembershipPlan,
  PaymentRecord,
  FitnessGoal,
  AdminStats,
} from './types';
import { fitFlowApi } from './services/api';
import { useToast } from './hooks/useToast';
import { Toast } from './components/common/Toast';
import { Sidebar } from './components/layout/Sidebar';
import { Navbar } from './components/layout/Navbar';

// Pages
import { LandingPage } from './pages/LandingPage';
import { AuthPage } from './pages/AuthPage';
import { MemberDashboard } from './pages/MemberDashboard';
import { WorkoutPlansPage } from './pages/WorkoutPlansPage';
import { AttendancePage } from './pages/AttendancePage';
import { TrainerSchedulePage } from './pages/TrainerSchedulePage';
import { SubscriptionsPage } from './pages/SubscriptionsPage';
import { PerformancePage } from './pages/PerformancePage';

// Admin Pages
import { AdminDashboard } from './pages/AdminDashboard';
import { MemberManagementPage } from './pages/admin/MemberManagementPage';
import { TrainerManagementPage } from './pages/admin/TrainerManagementPage';
import { MembershipPlansPage } from './pages/admin/MembershipPlansPage';
import { WorkoutManagementPage } from './pages/admin/WorkoutManagementPage';
import { AttendanceLogPage } from './pages/admin/AttendanceLogPage';
import { RenewalsManagementPage } from './pages/admin/RenewalsManagementPage';
import { TechDocsView } from './pages/TechDocsView';

export default function App() {
  const { toasts, showToast, removeToast } = useToast();

  // App view state: 'landing' | 'auth' | 'app'
  const [viewMode, setViewMode] = useState<'landing' | 'auth' | 'app'>('landing');
  const [currentUserRole, setCurrentUserRole] = useState<UserRole>('member');
  const [currentTab, setCurrentTab] = useState<NavigationTab>('member-dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Data states
  const [isLoading, setIsLoading] = useState(true);
  const [member, setMember] = useState<Member | null>(null);
  const [allMembers, setAllMembers] = useState<Member[]>([]);
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [workoutPlans, setWorkoutPlans] = useState<WorkoutPlan[]>([]);
  const [activePlanId, setActivePlanId] = useState<string>('plan-01');
  const [trainerSessions, setTrainerSessions] = useState<TrainerSession[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [allAttendanceRecords, setAllAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetric[]>([]);
  const [membershipPlans, setMembershipPlans] = useState<MembershipPlan[]>([]);
  const [paymentRecords, setPaymentRecords] = useState<PaymentRecord[]>([]);
  const [fitnessGoals, setFitnessGoals] = useState<FitnessGoal[]>([]);
  const [adminStats, setAdminStats] = useState<AdminStats>({
    totalMembers: 482,
    activeMemberships: 418,
    expiringSubscriptions: 28,
    totalTrainers: 14,
    todayAttendance: 142,
    monthlyRevenue: 28450,
    revenueGrowthPercent: 12.4,
  });

  const [isCheckedInToday, setIsCheckedInToday] = useState(false);

  // Load initial data from api
  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const [
          memberRes,
          allMembersRes,
          trainersRes,
          plansRes,
          sessionsRes,
          attendanceRes,
          allAttendanceRes,
          metricsRes,
          membershipPlansRes,
          paymentsRes,
          goalsRes,
          statsRes,
        ] = await Promise.all([
          fitFlowApi.getMember('mem-01'),
          fitFlowApi.getAllMembers(),
          fitFlowApi.getTrainers(),
          fitFlowApi.getWorkoutPlans(),
          fitFlowApi.getTrainerSessions(),
          fitFlowApi.getAttendance('mem-01'),
          fitFlowApi.getAllAttendance(),
          fitFlowApi.getPerformanceMetrics('mem-01'),
          fitFlowApi.getMembershipPlans(),
          fitFlowApi.getPayments('mem-01'),
          fitFlowApi.getFitnessGoals('mem-01'),
          fitFlowApi.getAdminStats(),
        ]);

        setMember(memberRes);
        setAllMembers(allMembersRes);
        setTrainers(trainersRes);
        setWorkoutPlans(plansRes);
        if (plansRes.length > 0) setActivePlanId(plansRes[0].id);
        setTrainerSessions(sessionsRes);
        setAttendanceRecords(attendanceRes);
        setAllAttendanceRecords(allAttendanceRes);
        setPerformanceMetrics(metricsRes);
        setMembershipPlans(membershipPlansRes);
        setPaymentRecords(paymentsRes);
        setFitnessGoals(goalsRes);
        setAdminStats(statsRes);

        // Check if checked in today (Sept 8 2026)
        const todayRecord = attendanceRes.find(r => r.date === '2026-09-08' && r.status === 'present');
        if (todayRecord) setIsCheckedInToday(true);
      } catch (err) {
        console.error('Failed to load initial data:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  // Handlers
  const handleLogin = (role: UserRole, email: string) => {
    setCurrentUserRole(role);
    setViewMode('app');
    if (role === 'admin') {
      setCurrentTab('admin-dashboard');
      showToast('Logged in as FitFlow Administrator (Sarah Jenkins)', 'info');
    } else {
      setCurrentTab('member-dashboard');
      showToast(`Welcome back, ${member?.name || 'Alex Morgan'}!`, 'success');
    }
  };

  const handleSwitchRole = (newRole: UserRole) => {
    setCurrentUserRole(newRole);
    if (newRole === 'admin') {
      setCurrentTab('admin-dashboard');
      showToast('Switched to Gym Director & Staff Mode', 'info');
    } else {
      setCurrentTab('member-dashboard');
      showToast('Switched to Club Member Mode (Alex Morgan)', 'info');
    }
  };

  const handleLogout = () => {
    setViewMode('landing');
    showToast('Signed out safely', 'info');
  };

  // Check in
  const handleCheckIn = async (location = 'Main Gym Floor') => {
    if (!member) return;
    try {
      const newRecord = await fitFlowApi.checkInAttendance(member.id, member.name, location);
      setAttendanceRecords(prev => [newRecord, ...prev]);
      setAllAttendanceRecords(prev => [newRecord, ...prev]);
      setIsCheckedInToday(true);

      // increment member active sessions
      setMember(prev => prev ? {
        ...prev,
        activeSessionsAttended: (prev.activeSessionsAttended || 18) + 1,
      } : null);

      setAdminStats(prev => ({ ...prev, todayAttendance: prev.todayAttendance + 1 }));
      showToast(`Gym check-in logged at ${location}! Keep the streak alive 🔥`, 'success');
    } catch (e) {
      showToast('Failed to check in', 'error');
    }
  };

  // Toggle workout exercise
  const handleToggleExercise = async (planId: string, exerciseId: string) => {
    try {
      const updated = await fitFlowApi.toggleExerciseProgress(planId, exerciseId);
      if (updated) {
        setWorkoutPlans(prev => prev.map(p => p.id === planId ? updated : p));
        const ex = updated.exercises.find(e => e.id === exerciseId);
        if (ex?.completed) {
          showToast(`Completed: ${ex.name}! Great effort 💪`, 'success');
        }
      }
    } catch (e) {
      showToast('Failed to update exercise', 'error');
    }
  };

  // Reset workout plan progress
  const handleResetExercises = async (planId: string) => {
    try {
      const reset = await fitFlowApi.resetPlanProgress(planId);
      if (reset) {
        setWorkoutPlans(prev => prev.map(p => p.id === planId ? reset : p));
        showToast('Routine progress reset for this workout protocol', 'info');
      }
    } catch (e) {
      showToast('Failed to reset routine', 'error');
    }
  };

  // Book trainer session
  const handleBookSession = async (sessionData: Omit<TrainerSession, 'id' | 'status'>) => {
    try {
      const newSession = await fitFlowApi.bookTrainerSession(sessionData);
      setTrainerSessions(prev => [newSession, ...prev]);
      showToast(`Booked 1-on-1 session with ${sessionData.trainerName} on ${sessionData.date}!`, 'success');
    } catch (e) {
      showToast('Failed to book session', 'error');
    }
  };

  const handleCancelSession = async (sessionId: string) => {
    try {
      await fitFlowApi.cancelTrainerSession(sessionId);
      setTrainerSessions(prev => prev.map(s => s.id === sessionId ? { ...s, status: 'cancelled' } : s));
      showToast('Session cancelled', 'info');
    } catch (e) {
      showToast('Failed to cancel session', 'error');
    }
  };

  // Subscription renew
  const handleRenewSubscription = async (planId: string, paymentMethod: PaymentRecord['paymentMethod']) => {
    if (!member) return;
    try {
      const result = await fitFlowApi.renewSubscription(member.id, planId, paymentMethod);
      setMember(result.member);
      setPaymentRecords(prev => [result.payment, ...prev]);
      setAllMembers(prev => prev.map(m => m.id === member.id ? result.member : m));
      showToast(`Subscription renewed! New expiration: ${result.member.membershipExpiry}`, 'success');
    } catch (e) {
      showToast('Failed to renew subscription', 'error');
    }
  };

  // Biometrics
  const handleAddMetric = async (metric: PerformanceMetric) => {
    if (!member) return;
    try {
      const saved = await fitFlowApi.addPerformanceMetric(member.id, metric);
      setPerformanceMetrics(prev => [...prev, saved]);
      setMember(prev => prev ? { ...prev, weightKg: saved.weightKg } : null);
      showToast('New biometric measurements & 1RM PRs saved!', 'success');
    } catch (e) {
      showToast('Failed to save metric', 'error');
    }
  };

  // Admin: Add member
  const handleAdminAddMember = async (memberData: Omit<Member, 'id'>) => {
    try {
      const newM = await fitFlowApi.addMember(memberData);
      setAllMembers(prev => [newM, ...prev]);
      setAdminStats(prev => ({
        ...prev,
        totalMembers: prev.totalMembers + 1,
        activeMemberships: prev.activeMemberships + 1,
      }));
      showToast(`Enrolled new member: ${newM.name}`, 'success');
    } catch (e) {
      showToast('Failed to add member', 'error');
    }
  };

  const handleAdminUpdateMember = async (id: string, updates: Partial<Member>) => {
    try {
      const updated = await fitFlowApi.updateMember(id, updates);
      if (updated) {
        setAllMembers(prev => prev.map(m => m.id === id ? updated : m));
        if (member?.id === id) setMember(updated);
        showToast(`Updated member record: ${updated.name}`, 'success');
      }
    } catch (e) {
      showToast('Failed to update member', 'error');
    }
  };

  const handleAdminDeleteMember = async (id: string) => {
    try {
      await fitFlowApi.deleteMember(id);
      setAllMembers(prev => prev.filter(m => m.id !== id));
      setAdminStats(prev => ({
        ...prev,
        totalMembers: Math.max(0, prev.totalMembers - 1),
      }));
      showToast('Member removed from directory', 'info');
    } catch (e) {
      showToast('Failed to delete member', 'error');
    }
  };

  // Admin: Trainer CRUD
  const handleAdminAddTrainer = async (trainerData: Omit<Trainer, 'id'>) => {
    try {
      const newTr = await fitFlowApi.addTrainer(trainerData);
      setTrainers(prev => [...prev, newTr]);
      setAdminStats(prev => ({ ...prev, totalTrainers: prev.totalTrainers + 1 }));
      showToast(`Coach ${newTr.name} registered`, 'success');
    } catch (e) {
      showToast('Failed to add coach', 'error');
    }
  };

  const handleAdminUpdateTrainer = async (id: string, updates: Partial<Trainer>) => {
    try {
      const updated = await fitFlowApi.updateTrainer(id, updates);
      if (updated) {
        setTrainers(prev => prev.map(t => t.id === id ? updated : t));
        showToast(`Coach profile updated: ${updated.name}`, 'success');
      }
    } catch (e) {
      showToast('Failed to update coach', 'error');
    }
  };

  const handleAdminDeleteTrainer = async (id: string) => {
    try {
      await fitFlowApi.deleteTrainer(id);
      setTrainers(prev => prev.filter(t => t.id !== id));
      setAdminStats(prev => ({ ...prev, totalTrainers: Math.max(0, prev.totalTrainers - 1) }));
      showToast('Coach removed from roster', 'info');
    } catch (e) {
      showToast('Failed to delete coach', 'error');
    }
  };

  // Admin: Membership Plan CRUD
  const handleAdminUpdatePlan = async (id: string, updates: Partial<MembershipPlan>) => {
    try {
      const updated = await fitFlowApi.updateMembershipPlan(id, updates);
      if (updated) {
        setMembershipPlans(prev => prev.map(p => p.id === id ? updated : p));
        showToast(`Plan ${updated.name} updated`, 'success');
      }
    } catch (e) {
      showToast('Failed to update plan', 'error');
    }
  };

  const handleAdminAddPlan = async (planData: Omit<MembershipPlan, 'id'>) => {
    try {
      const newP = await fitFlowApi.addMembershipPlan(planData);
      setMembershipPlans(prev => [...prev, newP]);
      showToast(`New tier created: ${newP.name}`, 'success');
    } catch (e) {
      showToast('Failed to create plan tier', 'error');
    }
  };

  // Admin: Workout CRUD
  const handleAdminAddWorkoutPlan = async (planData: Omit<WorkoutPlan, 'id'>) => {
    try {
      const newW = await fitFlowApi.addWorkoutPlan(planData);
      setWorkoutPlans(prev => [newW, ...prev]);
      showToast(`Workout routine "${newW.title}" created`, 'success');
    } catch (e) {
      showToast('Failed to add routine', 'error');
    }
  };

  const handleAdminDeleteWorkoutPlan = async (id: string) => {
    try {
      await fitFlowApi.deleteWorkoutPlan(id);
      setWorkoutPlans(prev => prev.filter(p => p.id !== id));
      showToast('Workout plan deleted', 'info');
    } catch (e) {
      showToast('Failed to delete routine', 'error');
    }
  };

  // Admin: Manual Check-in
  const handleAdminManualCheckIn = async (memberId: string, location: string) => {
    const targetMember = allMembers.find(m => m.id === memberId);
    if (!targetMember) return;
    try {
      const rec = await fitFlowApi.checkInAttendance(targetMember.id, targetMember.name, location);
      setAllAttendanceRecords(prev => [rec, ...prev]);
      if (member?.id === targetMember.id) {
        setAttendanceRecords(prev => [rec, ...prev]);
        setIsCheckedInToday(true);
      }
      setAdminStats(prev => ({ ...prev, todayAttendance: prev.todayAttendance + 1 }));
      showToast(`Turnstile override: ${targetMember.name} checked in at ${location}`, 'success');
    } catch (e) {
      showToast('Failed to log check-in', 'error');
    }
  };

  // Admin: Renew member
  const handleAdminRenewMember = async (memberId: string, planId: string, daysToAdd: number) => {
    try {
      const updated = await fitFlowApi.adminRenewMember(memberId, planId, daysToAdd);
      if (updated) {
        setAllMembers(prev => prev.map(m => m.id === memberId ? updated : m));
        if (member?.id === memberId) setMember(updated);
        showToast(`Membership extended for ${updated.name} (+${daysToAdd} days)`, 'success');
      }
    } catch (e) {
      showToast('Failed to renew member', 'error');
    }
  };

  const handleAdminSendReminder = (memberId: string) => {
    const target = allMembers.find(m => m.id === memberId);
    showToast(`Automated renewal reminder email dispatched to ${target?.email || 'member'}`, 'info');
  };

  // -------------------------------------------------------------
  // View Routing
  // -------------------------------------------------------------

  if (viewMode === 'landing') {
    return (
      <>
        <LandingPage
          onGetStarted={() => setViewMode('auth')}
          onLogin={() => setViewMode('auth')}
        />
        <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
          {toasts.map(t => (
            <Toast key={t.id} id={t.id} message={t.message} type={t.type} onClose={removeToast} />
          ))}
        </div>
      </>
    );
  }

  if (viewMode === 'auth') {
    return (
      <>
        <AuthPage
          onLogin={handleLogin}
          onBackToLanding={() => setViewMode('landing')}
        />
        <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
          {toasts.map(t => (
            <Toast key={t.id} id={t.id} message={t.message} type={t.type} onClose={removeToast} />
          ))}
        </div>
      </>
    );
  }

  // Active Plan
  const currentActivePlan = workoutPlans.find(p => p.id === activePlanId) || workoutPlans[0] || null;
  const latestMetric = performanceMetrics[performanceMetrics.length - 1] || null;

  return (
    <div className="min-h-screen bg-[#0B1120] text-slate-100 flex flex-col selection:bg-[#22C55E] selection:text-black font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Toast notifications container */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map(t => (
          <Toast key={t.id} id={t.id} message={t.message} type={t.type} onClose={removeToast} />
        ))}
      </div>

      <div className="flex flex-1 relative overflow-hidden">
        {/* Desktop & Mobile Sidebar */}
        <Sidebar
          currentTab={currentTab}
          userRole={currentUserRole}
          onTabChange={(tab) => {
            setCurrentTab(tab);
            setIsMobileMenuOpen(false);
          }}
          onRoleChange={handleSwitchRole}
          onLogout={handleLogout}
          isMobileOpen={isMobileMenuOpen}
          onCloseMobile={() => setIsMobileMenuOpen(false)}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto max-h-screen">
          <Navbar
            currentTab={currentTab}
            userRole={currentUserRole}
            userName={currentUserRole === 'admin' ? 'Sarah Jenkins' : (member?.name || 'Alex Morgan')}
            userEmail={currentUserRole === 'admin' ? 'admin@fitflow.io' : (member?.email || 'alex.morgan@fitflow.io')}
            userAvatar={
              currentUserRole === 'admin'
                ? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250'
                : (member?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250')
            }
            onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            onRoleChange={handleSwitchRole}
            onLogout={handleLogout}
            onNavigate={(tab) => setCurrentTab(tab)}
          />

          <main className="flex-1 p-4 sm:p-6 lg:p-8">
            {/* Member Views */}
            {currentTab === 'member-dashboard' && member && (
              <MemberDashboard
                member={member}
                workoutPlan={currentActivePlan}
                upcomingSessions={trainerSessions}
                latestMetric={latestMetric}
                isCheckedInToday={isCheckedInToday}
                onQuickCheckIn={() => handleCheckIn()}
                onNavigate={(t) => setCurrentTab(t)}
                onToggleExercise={handleToggleExercise}
              />
            )}

            {currentTab === 'workout-plans' && (
              <WorkoutPlansPage
                plans={workoutPlans}
                activePlanId={activePlanId}
                onSelectPlan={(id) => setActivePlanId(id)}
                onToggleExercise={handleToggleExercise}
                onResetCompleted={handleResetExercises}
              />
            )}

            {currentTab === 'attendance' && (
              <AttendancePage
                attendanceRecords={attendanceRecords}
                onCheckIn={handleCheckIn}
                isCheckedInToday={isCheckedInToday}
                memberWeeklyGoal={4}
              />
            )}

            {currentTab === 'trainer-schedule' && member && (
              <TrainerSchedulePage
                trainers={trainers}
                sessions={trainerSessions}
                onBookSession={handleBookSession}
                onCancelSession={handleCancelSession}
                currentMemberName={member.name}
                currentMemberId={member.id}
              />
            )}

            {currentTab === 'subscriptions' && member && (
              <SubscriptionsPage
                member={member}
                plans={membershipPlans}
                payments={paymentRecords}
                onRenewSubscription={handleRenewSubscription}
              />
            )}

            {currentTab === 'performance' && member && (
              <PerformancePage
                metrics={performanceMetrics}
                goals={fitnessGoals}
                onAddMetric={handleAddMetric}
                onUpdateGoal={(id, u) => setFitnessGoals(prev => prev.map(g => g.id === id ? { ...g, ...u } : g))}
                heightCm={member.heightCm || 180}
              />
            )}

            {/* Admin Views */}
            {currentTab === 'admin-dashboard' && (
              <AdminDashboard
                stats={adminStats}
                members={allMembers}
                payments={paymentRecords}
                onNavigate={(t) => setCurrentTab(t)}
                onQuickAddMember={() => setCurrentTab('admin-members')}
              />
            )}

            {currentTab === 'admin-members' && (
              <MemberManagementPage
                members={allMembers}
                plans={membershipPlans}
                onAddMember={handleAdminAddMember}
                onUpdateMember={handleAdminUpdateMember}
                onDeleteMember={handleAdminDeleteMember}
              />
            )}

            {currentTab === 'admin-trainers' && (
              <TrainerManagementPage
                trainers={trainers}
                onAddTrainer={handleAdminAddTrainer}
                onUpdateTrainer={handleAdminUpdateTrainer}
                onDeleteTrainer={handleAdminDeleteTrainer}
              />
            )}

            {currentTab === 'admin-plans' && (
              <MembershipPlansPage
                plans={membershipPlans}
                onUpdatePlan={handleAdminUpdatePlan}
                onAddPlan={handleAdminAddPlan}
              />
            )}

            {currentTab === 'admin-workouts' && (
              <WorkoutManagementPage
                plans={workoutPlans}
                onAddPlan={handleAdminAddWorkoutPlan}
                onDeletePlan={handleAdminDeleteWorkoutPlan}
              />
            )}

            {currentTab === 'admin-attendance' && (
              <AttendanceLogPage
                records={allAttendanceRecords}
                members={allMembers}
                onManualCheckIn={handleAdminManualCheckIn}
              />
            )}

            {currentTab === 'admin-renewals' && (
              <RenewalsManagementPage
                members={allMembers}
                plans={membershipPlans}
                onRenewMember={handleAdminRenewMember}
                onSendReminder={handleAdminSendReminder}
              />
            )}

            {currentTab === 'tech-docs' && (
              <TechDocsView />
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
