import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut as fbSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  getDocFromServer,
  setDoc,
  updateDoc,
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  deleteDoc,
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import {
  UserRole,
  User,
  Member,
  Trainer,
  WorkoutPlan,
  TrainerSession,
  AttendanceRecord,
  PerformanceMetric,
  MembershipPlan,
  AppNotification,
} from '../types';

// Initialize Firebase App
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// CRITICAL: Initialize Firestore with database ID from config
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Error Handling Definition conforming to Firebase Skill
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Connection test on boot (Mandatory in Firebase Skill)
export async function testFirestoreConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase warning: client appears offline, checking configuration.');
    }
    return false;
  }
}

// -------------------------------------------------------------
// Authentication with Google
// -------------------------------------------------------------
export async function signInWithGoogleFirebase(assignedRole: UserRole = 'member'): Promise<{
  user: User;
  firebaseUser: FirebaseUser;
}> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const fbUser = result.user;

    const userRef = doc(db, 'users', fbUser.uid);
    let role = assignedRole;

    try {
      const existingDoc = await getDoc(userRef);
      if (existingDoc.exists()) {
        const data = existingDoc.data();
        if (data.role) {
          role = data.role as UserRole;
        }
      } else {
        // Auto-assign admin if email matches
        if (fbUser.email === 'admin@fitflow.io' || fbUser.email === 'dhanushj2007@gmail.com') {
          role = assignedRole === 'trainer' ? 'trainer' : 'admin';
        }
        await setDoc(userRef, {
          id: fbUser.uid,
          name: fbUser.displayName || 'FitFlow Member',
          email: fbUser.email || '',
          role: role,
          avatarUrl: fbUser.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
          joinedDate: new Date().toISOString().split('T')[0],
        });
      }
    } catch (e) {
      console.warn('Could not sync user to Firestore directly:', e);
    }

    const appUser: User = {
      id: fbUser.uid,
      name: fbUser.displayName || 'FitFlow User',
      email: fbUser.email || '',
      role: role,
      avatarUrl: fbUser.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
      joinedDate: new Date().toISOString().split('T')[0],
    };

    return { user: appUser, firebaseUser: fbUser };
  } catch (err) {
    console.error('Google Sign-In Error:', err);
    throw err;
  }
}

export async function signOutFirebase(): Promise<void> {
  await fbSignOut(auth);
}

// -------------------------------------------------------------
// Firestore Database Sync Operations
// -------------------------------------------------------------

// Members
export async function getMembersFromFirestore(): Promise<Member[]> {
  if (!auth.currentUser) return [];
  const path = 'members';
  try {
    const snap = await getDocs(collection(db, path));
    if (snap.empty) return [];
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Member));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return [];
  }
}

export async function saveMemberToFirestore(member: Member): Promise<void> {
  if (!auth.currentUser) return;
  const path = `members/${member.id}`;
  try {
    await setDoc(doc(db, 'members', member.id), member);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// Trainers
export async function getTrainersFromFirestore(): Promise<Trainer[]> {
  const path = 'trainers';
  try {
    const snap = await getDocs(collection(db, path));
    if (snap.empty) return [];
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Trainer));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return [];
  }
}

export async function saveTrainerToFirestore(trainer: Trainer): Promise<void> {
  if (!auth.currentUser) return;
  const path = `trainers/${trainer.id}`;
  try {
    await setDoc(doc(db, 'trainers', trainer.id), trainer);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// Workout Plans
export async function getWorkoutPlansFromFirestore(): Promise<WorkoutPlan[]> {
  const path = 'workoutPlans';
  try {
    const snap = await getDocs(collection(db, path));
    if (snap.empty) return [];
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as WorkoutPlan));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return [];
  }
}

export async function saveWorkoutPlanToFirestore(plan: WorkoutPlan): Promise<void> {
  if (!auth.currentUser) return;
  const path = `workoutPlans/${plan.id}`;
  try {
    await setDoc(doc(db, 'workoutPlans', plan.id), plan);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// Attendance
export async function getAttendanceFromFirestore(memberId?: string): Promise<AttendanceRecord[]> {
  if (!auth.currentUser) return [];
  const path = 'attendance';
  try {
    const coll = collection(db, path);
    const q = memberId ? query(coll, where('memberId', '==', memberId)) : coll;
    const snap = await getDocs(q);
    if (snap.empty) return [];
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as AttendanceRecord));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return [];
  }
}

export async function addAttendanceToFirestore(record: AttendanceRecord): Promise<void> {
  if (!auth.currentUser) return;
  const path = `attendance/${record.id}`;
  try {
    await setDoc(doc(db, 'attendance', record.id), record);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// Trainer Sessions
export async function getSessionsFromFirestore(): Promise<TrainerSession[]> {
  if (!auth.currentUser) return [];
  const path = 'sessions';
  try {
    const snap = await getDocs(collection(db, path));
    if (snap.empty) return [];
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as TrainerSession));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return [];
  }
}

export async function saveSessionToFirestore(session: TrainerSession): Promise<void> {
  if (!auth.currentUser) return;
  const path = `sessions/${session.id}`;
  try {
    await setDoc(doc(db, 'sessions', session.id), session);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function updateSessionStatusInFirestore(
  sessionId: string,
  status: TrainerSession['status']
): Promise<void> {
  if (!auth.currentUser) return;
  const path = `sessions/${sessionId}`;
  try {
    await updateDoc(doc(db, 'sessions', sessionId), { status });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

// Biometrics / Performance Metrics
export async function getMetricsFromFirestore(memberId: string): Promise<PerformanceMetric[]> {
  if (!auth.currentUser) return [];
  const path = 'metrics';
  try {
    const q = query(collection(db, path), where('memberId', '==', memberId));
    const snap = await getDocs(q);
    if (snap.empty) return [];
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as PerformanceMetric));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return [];
  }
}

export async function saveMetricToFirestore(metric: PerformanceMetric): Promise<void> {
  if (!auth.currentUser) return;
  const metricId = metric.id || `metric-${(metric.memberId || 'mem')}-${metric.date.replace(/[^a-zA-Z0-9]/g, '-')}`;
  const path = `metrics/${metricId}`;
  try {
    await setDoc(doc(db, 'metrics', metricId), { ...metric, id: metricId });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// Membership Plans
export async function getMembershipPlansFromFirestore(): Promise<MembershipPlan[]> {
  const path = 'membershipPlans';
  try {
    const snap = await getDocs(collection(db, path));
    if (snap.empty) return [];
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as MembershipPlan));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return [];
  }
}

export async function saveMembershipPlanToFirestore(plan: MembershipPlan): Promise<void> {
  if (!auth.currentUser) return;
  const path = `membershipPlans/${plan.id}`;
  try {
    await setDoc(doc(db, 'membershipPlans', plan.id), plan);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// Notifications
export async function getNotificationsFromFirestore(): Promise<AppNotification[]> {
  if (!auth.currentUser) return [];
  const path = 'notifications';
  try {
    const snap = await getDocs(collection(db, path));
    if (snap.empty) return [];
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as AppNotification));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return [];
  }
}

export async function saveNotificationToFirestore(notif: AppNotification): Promise<void> {
  if (!auth.currentUser) return;
  const path = `notifications/${notif.id}`;
  try {
    await setDoc(doc(db, 'notifications', notif.id), notif);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteMemberFromFirestore(id: string): Promise<void> {
  if (!auth.currentUser) return;
  const path = `members/${id}`;
  try {
    await deleteDoc(doc(db, 'members', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function deleteTrainerFromFirestore(id: string): Promise<void> {
  if (!auth.currentUser) return;
  const path = `trainers/${id}`;
  try {
    await deleteDoc(doc(db, 'trainers', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function deleteWorkoutPlanFromFirestore(id: string): Promise<void> {
  if (!auth.currentUser) return;
  const path = `workoutPlans/${id}`;
  try {
    await deleteDoc(doc(db, 'workoutPlans', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function seedInitialFirestoreData(
  members: Member[],
  trainers: Trainer[],
  workoutPlans: WorkoutPlan[],
  plans: MembershipPlan[],
  attendance: AttendanceRecord[],
  sessions: TrainerSession[],
  metrics: PerformanceMetric[]
): Promise<void> {
  if (!auth.currentUser) return;
  try {
    const existingSnap = await getDocs(collection(db, 'members'));
    if (!existingSnap.empty) {
      return; // Already populated
    }

    const promises: Promise<any>[] = [];
    members.forEach((m) => promises.push(setDoc(doc(db, 'members', m.id), m)));
    trainers.forEach((t) => promises.push(setDoc(doc(db, 'trainers', t.id), t)));
    workoutPlans.forEach((w) => promises.push(setDoc(doc(db, 'workoutPlans', w.id), w)));
    plans.forEach((p) => promises.push(setDoc(doc(db, 'membershipPlans', p.id), p)));
    attendance.forEach((a) => promises.push(setDoc(doc(db, 'attendance', a.id), a)));
    sessions.forEach((s) => promises.push(setDoc(doc(db, 'sessions', s.id), s)));
    metrics.forEach((m) => {
      const mId = m.id || `metric-${m.memberId || 'mem'}-${m.date.replace(/[^a-zA-Z0-9]/g, '-')}`;
      promises.push(setDoc(doc(db, 'metrics', mId), { ...m, id: mId }));
    });

    await Promise.all(promises);
    console.log('Successfully seeded initial FitFlow records into Firestore database');
  } catch (error) {
    console.warn('Firestore initial seeding note:', error);
  }
}

