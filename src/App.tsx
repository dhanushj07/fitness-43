import React, { useState, useEffect, useCallback } from 'react';
import {
  NavigationTab,
  UserRole,
  User,
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
  AppNotification,
} from './types';
import { fitFlowApi } from './services/api';
import { subscribeToRealtimeUpdates } from './services/socket';
import { useToast } from './hooks/useToast';
import { Toast } from './components/common/Toast';
import { Sidebar } from './components/layout/Sidebar';
import { Navbar } from './components/layout/Navbar';
import {
  auth,
  testFirestoreConnection,
  signOutFirebase,
  getMembersFromFirestore,
  getTrainersFromFirestore,
  getWorkoutPlansFromFirestore,
  getMembershipPlansFromFirestore,
  getAttendanceFromFirestore,
  getSessionsFromFirestore,
  saveMemberToFirestore,
  deleteMemberFromFirestore,
  saveTrainerToFirestore,
  deleteTrainerFromFirestore,
  saveWorkoutPlanToFirestore,
  deleteWorkoutPlanFromFirestore,
  addAttendanceToFirestore,
  saveSessionToFirestore,
  updateSessionStatusInFirestore,
  saveMetricToFirestore,
  seedInitialFirestoreData,
} from './services/firebase';
import { onAuthStateChanged } from 'firebase/auth';

// Pages
import { LandingPage } from './pages/LandingPage';
import { AuthPage } from './pages/AuthPage';
import { MemberDashboard } from './pages/MemberDashboard';
import { WorkoutPlansPage } from './pages/WorkoutPlansPage';
import { AttendancePage } from './pages/AttendancePage';
import { TrainerSchedulePage } from './pages/TrainerSchedulePage';
import { SubscriptionsPage } from './pages/SubscriptionsPage';
import { PerformancePage } from './pages/PerformancePage';
import { TrainerDashboard } from './pages/TrainerDashboard';

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
    attendanceRatePercent: 88.5,
  });

  const [isCheckedInToday, setIsCheckedInToday] = useState(false);
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        let detectedRole: UserRole = 'member';
        if (fbUser.email === 'admin@fitflow.io' || fbUser.email === 'dhanushj2007@gmail.com') {
          detectedRole = currentUserRole === 'trainer' ? 'trainer' : currentUserRole === 'admin' ? 'admin' : 'member';
        }
        const appU: User = {
          id: fbUser.uid,
          name: fbUser.displayName || 'FitFlow Member',
          email: fbUser.email || '',
          role: detectedRole,
          avatarUrl: fbUser.photoURL || undefined,
          joinedDate: new Date().toISOString().split('T')[0],
        };
        setFirebaseUser(appU);

        // Fetch user data from Firestore now that auth credentials are confirmed
        try {
          const [fsMembers, fsSessions, fsAttendance] = await Promise.all([
            getMembersFromFirestore().catch(() => []),
            getSessionsFromFirestore().catch(() => []),
            getAttendanceFromFirestore().catch(() => []),
          ]);

          if (fsMembers.length > 0) {
            setAllMembers(fsMembers);
            const curMem = fsMembers.find((m) => m.id === fbUser.uid || m.email === fbUser.email);
            if (curMem) setMember(curMem);
          }
          if (fsSessions.length > 0) setTrainerSessions(fsSessions);
          if (fsAttendance.length > 0) {
            setAllAttendanceRecords(fsAttendance);
            setAttendanceRecords(
              fsAttendance.filter((a) => a.memberId === fbUser.uid || a.memberId === 'mem-101')
            );
          }
        } catch (authSyncErr) {
          console.warn('Authenticated Firestore sync note:', authSyncErr);
        }
      } else {
        setFirebaseUser(null);
      }
    });
    return () => unsubscribe();
  }, [currentUserRole]);

  // Real-time Notifications
  const [notifications, setNotifications] = useState<AppNotification[]>([
    {
      id: 'notif-1',
      title: 'Workout Scheduled Today',
      message: 'Push-Pull Upper Protocol is queued up for this evening.',
      type: 'workout',
      timestamp: '10 mins ago',
      read: false,
    },
    {
      id: 'notif-2',
      title: 'PT Session Confirmed',
      message: 'Coaching slot with Marcus Vance confirmed for 6:00 PM.',
      type: 'session',
      timestamp: '1 hour ago',
      read: false,
    },
    {
      id: 'notif-3',
      title: 'Turnstile Check-In Verified',
      message: 'Front turnstile gate entry logged at 07:15 AM.',
      type: 'attendance',
      timestamp: '2 hours ago',
      read: true,
    },
  ]);

  // Load initial data from api & sync with Firestore
  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        await testFirestoreConnection();

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
          fitFlowApi.getMember('mem-101'),
          fitFlowApi.getAllMembers(),
          fitFlowApi.getTrainers(),
          fitFlowApi.getWorkoutPlans(),
          fitFlowApi.getTrainerSessions(),
          fitFlowApi.getAttendance('mem-101'),
          fitFlowApi.getAllAttendance(),
          fitFlowApi.getPerformanceMetrics('mem-101'),
          fitFlowApi.getMembershipPlans(),
          fitFlowApi.getPayments('mem-101'),
          fitFlowApi.getFitnessGoals('mem-101'),
          fitFlowApi.getAdminStats(),
        ]);

        // Sync with Firestore database
        try {
          // Public gym catalogs (trainers, workout plans, membership plans)
          const [fsTrainers, fsPlans, fsMembershipPlans] = await Promise.all([
            getTrainersFromFirestore().catch(() => []),
            getWorkoutPlansFromFirestore().catch(() => []),
            getMembershipPlansFromFirestore().catch(() => []),
          ]);

          if (fsTrainers.length > 0) setTrainers(fsTrainers);
          else setTrainers(trainersRes);

          if (fsPlans.length > 0) {
            setWorkoutPlans(fsPlans);
            setActivePlanId(fsPlans[0].id);
          } else {
            setWorkoutPlans(plansRes);
            if (plansRes.length > 0) setActivePlanId(plansRes[0].id);
          }

          if (fsMembershipPlans.length > 0) setMembershipPlans(fsMembershipPlans);
          else setMembershipPlans(membershipPlansRes);

          // Authenticated collections (members, private sessions, attendance logs)
          if (auth.currentUser) {
            await seedInitialFirestoreData(
              allMembersRes,
              trainersRes,
              plansRes,
              membershipPlansRes,
              allAttendanceRes,
              sessionsRes,
              metricsRes
            );

            const [fsMembers, fsSessions, fsAttendance] = await Promise.all([
              getMembersFromFirestore().catch(() => []),
              getSessionsFromFirestore().catch(() => []),
              getAttendanceFromFirestore().catch(() => []),
            ]);

            if (fsMembers.length > 0) {
              setAllMembers(fsMembers);
              const curMem = fsMembers.find(
                (m) => m.id === auth.currentUser?.uid || m.email === auth.currentUser?.email
              );
              if (curMem) setMember(curMem);
              else if (memberRes) setMember(memberRes);
            } else {
              if (memberRes) setMember(memberRes);
              setAllMembers(allMembersRes);
            }

            if (fsSessions.length > 0) setTrainerSessions(fsSessions);
            else setTrainerSessions(sessionsRes);

            if (fsAttendance.length > 0) {
              setAllAttendanceRecords(fsAttendance);
              setAttendanceRecords(
                fsAttendance.filter(
                  (a) => a.memberId === auth.currentUser?.uid || a.memberId === 'mem-101'
                )
              );
            } else {
              setAttendanceRecords(attendanceRes);
              setAllAttendanceRecords(allAttendanceRes);
            }
          } else {
            // Guest or demo mode: default to baseline seed dataset
            if (memberRes) setMember(memberRes);
            setAllMembers(allMembersRes);
            setTrainerSessions(sessionsRes);
            setAttendanceRecords(attendanceRes);
            setAllAttendanceRecords(allAttendanceRes);
          }
        } catch (fsErr) {
          console.warn('Firestore initial load note:', fsErr);
          if (memberRes) setMember(memberRes);
          setAllMembers(allMembersRes);
          setTrainers(trainersRes);
          setWorkoutPlans(plansRes);
          if (plansRes.length > 0) setActivePlanId(plansRes[0].id);
          setTrainerSessions(sessionsRes);
          setAttendanceRecords(attendanceRes);
          setAllAttendanceRecords(allAttendanceRes);
        }

        setPerformanceMetrics(metricsRes);
        setMembershipPlans(membershipPlansRes);
        setPaymentRecords(paymentsRes);
        setFitnessGoals(goalsRes);
        setAdminStats(statsRes);

        // Check if checked in today
        const todayRecord = attendanceRes.find(
          (r) => r.date === new Date().toISOString().split('T')[0] && r.status === 'present'
        );
        if (todayRecord) setIsCheckedInToday(true);
      } catch (err) {
        console.error('Failed to load initial data:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  // Connect Socket.IO for Real-time event broadcasting
  useEffect(() => {
    const unsubscribe = subscribeToRealtimeUpdates({
      onAttendance: (data) => {
        setAllAttendanceRecords((prev) => [data.record, ...prev]);
        setAdminStats((prev) => ({
          ...prev,
          todayAttendance: prev.todayAttendance + 1,
        }));
        showToast(data.message, 'info');
      },
      onSessionBooked: (data) => {
        setTrainerSessions((prev) => [data.session, ...prev]);
        showToast(data.message, 'success');
      },
      onSessionCancelled: (data) => {
        setTrainerSessions((prev) =>
          prev.map((s) => (s.id === data.sessionId ? { ...s, status: 'cancelled' } : s))
        );
        showToast(data.message, 'info');
      },
      onNewNotification: (notif) => {
        setNotifications((prev) => [notif, ...prev]);
      },
    });

    return () => {
      unsubscribe();
    };
  }, [showToast]);

  // Handlers
  const handleLogin = (role: UserRole, email: string, user?: User) => {
    setCurrentUserRole(role);
    if (user) {
      setFirebaseUser(user);
    }
    setViewMode('app');
    if (role === 'admin') {
      setCurrentTab('admin-dashboard');
      showToast('Logged in as FitFlow Administrator (Sarah Jenkins)', 'info');
    } else if (role === 'trainer') {
      setCurrentTab('trainer-dashboard');
      showToast('Logged in as Coach Marcus Vance (Head Trainer)', 'info');
    } else {
      setCurrentTab('member-dashboard');
      showToast(`Welcome back, ${user?.name || 'Dhanush'}!`, 'success');
    }
  };

  const handleSwitchRole = (newRole: UserRole) => {
    setCurrentUserRole(newRole);
    if (newRole === 'admin') {
      setCurrentTab('admin-dashboard');
      showToast('Switched to Gym Director & Staff Mode (Sarah Jenkins)', 'info');
    } else if (newRole === 'trainer') {
      setCurrentTab('trainer-dashboard');
      showToast('Switched to Trainer & Coach Mode (Marcus Vance)', 'info');
    } else {
      setCurrentTab('member-dashboard');
      showToast('Switched to Club Member Mode (Dhanush)', 'info');
    }
  };

  const handleLogout = async () => {
    try {
      await signOutFirebase();
    } catch (e) {
      console.warn('Sign out note:', e);
    }
    setFirebaseUser(null);
    setViewMode('landing');
    showToast('Signed out safely', 'info');
  };

  // Check in
  const handleCheckIn = async (location = 'Main Gym Floor') => {
    if (!member) return;
    try {
      const newRecord = await fitFlowApi.checkInAttendance(member.id, member.name, location);
      setAttendanceRecords((prev) => [newRecord, ...prev]);
      setAllAttendanceRecords((prev) => [newRecord, ...prev]);
      setIsCheckedInToday(true);

      // increment member active sessions
      setMember((prev) =>
        prev
          ? {
              ...prev,
              activeSessionsAttended: (prev.activeSessionsAttended || 18) + 1,
            }
          : null
      );

      setAdminStats((prev) => ({ ...prev, todayAttendance: prev.todayAttendance + 1 }));

      // Sync into Firestore
      try {
        await addAttendanceToFirestore(newRecord);
      } catch (fErr) {
        console.warn('Firestore attendance log note:', fErr);
      }

      const notif: AppNotification = {
        id: `notif-${Date.now()}`,
        title: 'Check-In Confirmed',
        message: `Turnstile pass approved at ${location}. Enjoy your session!`,
        type: 'attendance',
        timestamp: 'Just now',
        read: false,
      };
      setNotifications((prev) => [notif, ...prev]);

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
        setWorkoutPlans((prev) => prev.map((p) => (p.id === planId ? updated : p)));
        const ex = updated.exercises.find((e) => e.id === exerciseId);
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
        setWorkoutPlans((prev) => prev.map((p) => (p.id === planId ? reset : p)));
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
      setTrainerSessions((prev) => [newSession, ...prev]);

      try {
        await saveSessionToFirestore(newSession);
      } catch (fsErr) {
        console.warn('Firestore session sync note:', fsErr);
      }

      const notif: AppNotification = {
        id: `notif-${Date.now()}`,
        title: 'PT Session Confirmed',
        message: `Booked with ${sessionData.trainerName} for ${sessionData.date} at ${sessionData.timeSlot}.`,
        type: 'session',
        timestamp: 'Just now',
        read: false,
      };
      setNotifications((prev) => [notif, ...prev]);
      showToast(`Booked 1-on-1 session with ${sessionData.trainerName} on ${sessionData.date}!`, 'success');
    } catch (e) {
      showToast('Failed to book session', 'error');
    }
  };

  const handleCancelSession = async (sessionId: string) => {
    try {
      await fitFlowApi.cancelTrainerSession(sessionId);
      setTrainerSessions((prev) =>
        prev.map((s) => (s.id === sessionId ? { ...s, status: 'cancelled' } : s))
      );
      try {
        await updateSessionStatusInFirestore(sessionId, 'cancelled');
      } catch (fsErr) {
        console.warn('Firestore cancel session sync note:', fsErr);
      }
      showToast('Session cancelled', 'info');
    } catch (e) {
      showToast('Failed to cancel session', 'error');
    }
  };

  const handleCompleteSession = (sessionId: string) => {
    setTrainerSessions((prev) =>
      prev.map((s) => (s.id === sessionId ? { ...s, status: 'completed' as const } : s))
    );
    try {
      updateSessionStatusInFirestore(sessionId, 'completed');
    } catch (fsErr) {
      console.warn('Firestore complete session sync note:', fsErr);
    }
    showToast('Coaching session marked as completed!', 'success');
  };

  // Subscription renew
  const handleRenewSubscription = async (
    planId: string,
    paymentMethod: PaymentRecord['paymentMethod']
  ) => {
    if (!member) return;
    try {
      const result = await fitFlowApi.renewSubscription(member.id, planId, paymentMethod);
      setMember(result.member);
      setPaymentRecords((prev) => [result.payment, ...prev]);
      setAllMembers((prev) => prev.map((m) => (m.id === member.id ? result.member : m)));
      try {
        await saveMemberToFirestore(result.member);
      } catch (fsErr) {
        console.warn('Firestore renew member sync note:', fsErr);
      }
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
      setPerformanceMetrics((prev) => [...prev, saved]);
      setMember((prev) => (prev ? { ...prev, weightKg: saved.weightKg } : null));
      try {
        await saveMetricToFirestore(saved);
      } catch (fsErr) {
        console.warn('Firestore metric save note:', fsErr);
      }
      showToast('New biometric measurements & 1RM PRs saved!', 'success');
    } catch (e) {
      showToast('Failed to save metric', 'error');
    }
  };

  // Admin: Add member
  const handleAdminAddMember = async (memberData: Omit<Member, 'id'>) => {
    try {
      const newM = await fitFlowApi.addMember(memberData);
      setAllMembers((prev) => [newM, ...prev]);
      setAdminStats((prev) => ({
        ...prev,
        totalMembers: prev.totalMembers + 1,
        activeMemberships: prev.activeMemberships + 1,
      }));
      try {
        await saveMemberToFirestore(newM);
      } catch (fsErr) {
        console.warn('Firestore add member note:', fsErr);
      }
      showToast(`Enrolled new member: ${newM.name}`, 'success');
    } catch (e) {
      showToast('Failed to add member', 'error');
    }
  };

  const handleAdminUpdateMember = async (id: string, updates: Partial<Member>) => {
    try {
      const updated = await fitFlowApi.updateMember(id, updates);
      if (updated) {
        setAllMembers((prev) => prev.map((m) => (m.id === id ? updated : m)));
        if (member?.id === id) setMember(updated);
        try {
          await saveMemberToFirestore(updated);
        } catch (fsErr) {
          console.warn('Firestore update member note:', fsErr);
        }
        showToast(`Updated member record: ${updated.name}`, 'success');
      }
    } catch (e) {
      showToast('Failed to update member', 'error');
    }
  };

  const handleAdminDeleteMember = async (id: string) => {
    try {
      await fitFlowApi.deleteMember(id);
      setAllMembers((prev) => prev.filter((m) => m.id !== id));
      setAdminStats((prev) => ({
        ...prev,
        totalMembers: Math.max(0, prev.totalMembers - 1),
      }));
      try {
        await deleteMemberFromFirestore(id);
      } catch (fsErr) {
        console.warn('Firestore delete member note:', fsErr);
      }
      showToast('Member removed from directory', 'info');
    } catch (e) {
      showToast('Failed to delete member', 'error');
    }
  };

  // Admin: Trainer CRUD
  const handleAdminAddTrainer = async (trainerData: Omit<Trainer, 'id'>) => {
    try {
      const newTr = await fitFlowApi.addTrainer(trainerData);
      setTrainers((prev) => [...prev, newTr]);
      setAdminStats((prev) => ({ ...prev, totalTrainers: prev.totalTrainers + 1 }));
      try {
        await saveTrainerToFirestore(newTr);
      } catch (fsErr) {
        console.warn('Firestore add trainer note:', fsErr);
      }
      showToast(`Coach ${newTr.name} registered`, 'success');
    } catch (e) {
      showToast('Failed to add coach', 'error');
    }
  };

  const handleAdminUpdateTrainer = async (id: string, updates: Partial<Trainer>) => {
    try {
      const updated = await fitFlowApi.updateTrainer(id, updates);
      if (updated) {
        setTrainers((prev) => prev.map((t) => (t.id === id ? updated : t)));
        try {
          await saveTrainerToFirestore(updated);
        } catch (fsErr) {
          console.warn('Firestore update trainer note:', fsErr);
        }
        showToast(`Coach profile updated: ${updated.name}`, 'success');
      }
    } catch (e) {
      showToast('Failed to update coach', 'error');
    }
  };

  const handleAdminDeleteTrainer = async (id: string) => {
    try {
      await fitFlowApi.deleteTrainer(id);
      setTrainers((prev) => prev.filter((t) => t.id !== id));
      setAdminStats((prev) => ({ ...prev, totalTrainers: Math.max(0, prev.totalTrainers - 1) }));
      try {
        await deleteTrainerFromFirestore(id);
      } catch (fsErr) {
        console.warn('Firestore delete trainer note:', fsErr);
      }
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
        setMembershipPlans((prev) => prev.map((p) => (p.id === id ? updated : p)));
        showToast(`Plan ${updated.name} updated`, 'success');
      }
    } catch (e) {
      showToast('Failed to update plan', 'error');
    }
  };

  const handleAdminAddPlan = async (planData: Omit<MembershipPlan, 'id'>) => {
    try {
      const newP = await fitFlowApi.addMembershipPlan(planData);
      setMembershipPlans((prev) => [...prev, newP]);
      showToast(`New tier created: ${newP.name}`, 'success');
    } catch (e) {
      showToast('Failed to create plan tier', 'error');
    }
  };

  // Admin: Workout CRUD
  const handleAdminAddWorkoutPlan = async (planData: Omit<WorkoutPlan, 'id'>) => {
    try {
      const newW = await fitFlowApi.addWorkoutPlan(planData);
      setWorkoutPlans((prev) => [newW, ...prev]);
      try {
        await saveWorkoutPlanToFirestore(newW);
      } catch (fsErr) {
        console.warn('Firestore add workout note:', fsErr);
      }
      showToast(`Workout routine "${newW.title}" created`, 'success');
    } catch (e) {
      showToast('Failed to add routine', 'error');
    }
  };

  const handleAdminDeleteWorkoutPlan = async (id: string) => {
    try {
      await fitFlowApi.deleteWorkoutPlan(id);
      setWorkoutPlans((prev) => prev.filter((p) => p.id !== id));
      try {
        await deleteWorkoutPlanFromFirestore(id);
      } catch (fsErr) {
        console.warn('Firestore delete workout note:', fsErr);
      }
      showToast('Workout plan deleted', 'info');
    } catch (e) {
      showToast('Failed to delete routine', 'error');
    }
  };

  // Admin: Manual Check-in
  const handleAdminManualCheckIn = async (memberId: string, location: string) => {
    const targetMember = allMembers.find((m) => m.id === memberId);
    if (!targetMember) return;
    try {
      const rec = await fitFlowApi.checkInAttendance(targetMember.id, targetMember.name, location);
      setAllAttendanceRecords((prev) => [rec, ...prev]);
      if (member?.id === targetMember.id) {
        setAttendanceRecords((prev) => [rec, ...prev]);
        setIsCheckedInToday(true);
      }
      setAdminStats((prev) => ({ ...prev, todayAttendance: prev.todayAttendance + 1 }));
      try {
        await addAttendanceToFirestore(rec);
      } catch (fsErr) {
        console.warn('Firestore admin checkin note:', fsErr);
      }
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
        setAllMembers((prev) => prev.map((m) => (m.id === memberId ? updated : m)));
        if (member?.id === memberId) setMember(updated);
        try {
          await saveMemberToFirestore(updated);
        } catch (fsErr) {
          console.warn('Firestore admin renew note:', fsErr);
        }
        showToast(`Membership extended for ${updated.name} (+${daysToAdd} days)`, 'success');
      }
    } catch (e) {
      showToast('Failed to renew member', 'error');
    }
  };

  const handleAdminSendReminder = (memberId: string) => {
    const target = allMembers.find((m) => m.id === memberId);
    showToast(`Automated renewal reminder email dispatched to ${target?.email || 'member'}`, 'info');
  };

  // Notification handlers
  const handleMarkNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleMarkAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    showToast('All notifications marked as read', 'info');
  };

  // Active User object according to current perspective
  const currentUser: User =
    firebaseUser && firebaseUser.role === currentUserRole
      ? firebaseUser
      : currentUserRole === 'admin'
      ? {
          id: firebaseUser?.role === 'admin' ? firebaseUser.id : 'adm-01',
          name: firebaseUser?.role === 'admin' ? firebaseUser.name : 'Sarah Jenkins',
          email: firebaseUser?.role === 'admin' ? firebaseUser.email : 'admin@fitflow.io',
          role: 'admin',
          avatarUrl:
            firebaseUser?.role === 'admin'
              ? firebaseUser.avatarUrl
              : 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250',
          joinedDate: '2023-01-15',
        }
      : currentUserRole === 'trainer'
      ? {
          id: firebaseUser?.role === 'trainer' ? firebaseUser.id : 'tr-01',
          name: firebaseUser?.role === 'trainer' ? firebaseUser.name : 'Marcus Vance',
          email: firebaseUser?.role === 'trainer' ? firebaseUser.email : 'marcus.vance@fitflow.io',
          role: 'trainer',
          avatarUrl:
            firebaseUser?.role === 'trainer'
              ? firebaseUser.avatarUrl
              : 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&q=80&w=250',
          joinedDate: '2024-02-01',
        }
      : {
          id: firebaseUser ? firebaseUser.id : member?.id || 'mem-101',
          name: firebaseUser ? firebaseUser.name : member?.name || 'Dhanush',
          email: firebaseUser ? firebaseUser.email : member?.email || 'dhanushj2007@gmail.com',
          role: 'member',
          avatarUrl:
            firebaseUser?.avatarUrl ||
            member?.avatarUrl ||
            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
          joinedDate: member?.joinedDate || '2024-03-15',
        };

  // Active Plan & Trainer
  const currentActivePlan = workoutPlans.find((p) => p.id === activePlanId) || workoutPlans[0] || null;
  const latestMetric = performanceMetrics[performanceMetrics.length - 1] || null;
  const currentTrainer = trainers.find((t) => t.id === 'tr-01') || trainers[0];

  // -------------------------------------------------------------
  // View Routing
  // -------------------------------------------------------------

  if (viewMode === 'landing') {
    return (
      <>
        <LandingPage
          onNavigate={(tab) => {
            if (tab === 'login') {
              setViewMode('auth');
            } else if (tab === 'api-docs') {
              setViewMode('app');
              setCurrentTab('api-docs');
            } else {
              setViewMode('app');
              setCurrentTab(tab as NavigationTab);
            }
          }}
          onLoginAs={(role) => {
            handleLogin(role, role === 'admin' ? 'admin@fitflow.io' : 'dhanushj2007@gmail.com');
          }}
          onGetStarted={() => setViewMode('auth')}
          onLogin={() => setViewMode('auth')}
        />
        <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
          {toasts.map((t) => (
            <Toast key={t.id} id={t.id} message={t.message} type={t.type} onClose={removeToast} />
          ))}
        </div>
      </>
    );
  }

  if (viewMode === 'auth') {
    return (
      <>
        <AuthPage onLogin={handleLogin} onBackToLanding={() => setViewMode('landing')} />
        <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
          {toasts.map((t) => (
            <Toast key={t.id} id={t.id} message={t.message} type={t.type} onClose={removeToast} />
          ))}
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B1120] text-slate-100 flex flex-col selection:bg-[#22C55E] selection:text-black font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Toast notifications container */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map((t) => (
          <Toast key={t.id} id={t.id} message={t.message} type={t.type} onClose={removeToast} />
        ))}
      </div>

      <div className="flex flex-1 relative overflow-hidden">
        {/* Desktop & Mobile Sidebar */}
        <Sidebar
          currentTab={currentTab}
          onSelectTab={(tab) => {
            setCurrentTab(tab);
            setIsMobileMenuOpen(false);
          }}
          currentUser={currentUser}
          onLogout={handleLogout}
          onSwitchRole={handleSwitchRole}
          isMobileOpen={isMobileMenuOpen}
          onCloseMobile={() => setIsMobileMenuOpen(false)}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto max-h-screen lg:pl-64">
          <Navbar
            currentTab={currentTab}
            onOpenMobile={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            currentUser={currentUser}
            onQuickCheckIn={() => handleCheckIn()}
            isCheckedInToday={isCheckedInToday}
            onSwitchRole={handleSwitchRole}
            notifications={notifications}
            onMarkNotificationRead={handleMarkNotificationRead}
            onMarkAllNotificationsRead={handleMarkAllNotificationsRead}
            isSocketConnected={true}
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

            {currentTab === 'trainer-schedule' && (
              <TrainerSchedulePage
                trainers={trainers}
                sessions={trainerSessions}
                onBookSession={handleBookSession}
                onCancelSession={handleCancelSession}
                currentMemberName={member?.name || 'Dhanush'}
                currentMemberId={member?.id || 'mem-101'}
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
                onUpdateGoal={(id, u) =>
                  setFitnessGoals((prev) =>
                    prev.map((g) => (g.id === id ? { ...g, ...u } : g))
                  )
                }
                heightCm={member.heightCm || 180}
              />
            )}

            {/* Trainer Views */}
            {currentTab === 'trainer-dashboard' && currentTrainer && (
              <TrainerDashboard
                trainer={currentTrainer}
                assignedMembers={allMembers}
                sessions={trainerSessions}
                onCompleteSession={handleCompleteSession}
                onCancelSession={handleCancelSession}
                onAddPerformanceNote={(memberId, note) => {
                  showToast(`Biometric performance note logged for member!`, 'success');
                }}
                onNavigate={(tab) => setCurrentTab(tab)}
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

            {(currentTab === 'tech-docs' || currentTab === 'api-docs') && <TechDocsView />}
          </main>
        </div>
      </div>
    </div>
  );
}
