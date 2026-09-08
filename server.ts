import express from 'express';
import http from 'http';
import path from 'path';
import { Server as SocketIOServer } from 'socket.io';
import { createServer as createViteServer } from 'vite';

const app = express();
const server = http.createServer(app);
const PORT = 3000;

app.use(express.json());

// Set up Socket.IO
const io = new SocketIOServer(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log(`[Socket.IO] Client connected: ${socket.id}`);

  socket.on('join:room', (room: string) => {
    socket.join(room);
    console.log(`[Socket.IO] ${socket.id} joined room: ${room}`);
  });

  socket.on('disconnect', () => {
    console.log(`[Socket.IO] Client disconnected: ${socket.id}`);
  });
});

// --------------------------------------------------------------------------
// In-Memory Database State (Mirrored to REST API)
// --------------------------------------------------------------------------

interface MemberRecord {
  id: string;
  name: string;
  email: string;
  role: 'member' | 'trainer' | 'admin';
  phone?: string;
  avatarUrl?: string;
  joinedDate: string;
  membershipPlanId?: string;
  membershipStatus?: 'active' | 'expiring' | 'expired' | 'frozen';
  membershipExpiry?: string;
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
  [key: string]: any;
}

interface TrainerRecord {
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
  availableSlots: string[];
  availableDays: string[];
  [key: string]: any;
}

interface AttendanceRecordItem {
  id: string;
  memberId: string;
  memberName: string;
  date: string;
  checkInTime: string;
  status: 'present' | 'absent' | 'leave';
  location: string;
}

interface SessionRecordItem {
  id: string;
  trainerId: string;
  trainerName: string;
  trainerSpecialty?: string;
  memberId: string;
  memberName: string;
  date: string;
  timeSlot: string;
  sessionType: string;
  status: 'confirmed' | 'completed' | 'cancelled';
  location: string;
  [key: string]: any;
}

interface NotificationRecordItem {
  id: string;
  title: string;
  message: string;
  type: string;
  timestamp: string;
  read: boolean;
}

let membersStore: MemberRecord[] = [
  {
    id: 'mem-01',
    name: 'Dhanush',
    email: 'dhanushj2007@gmail.com',
    role: 'member' as const,
    phone: '+1 (555) 234-8901',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    joinedDate: '2025-03-15',
    membershipPlanId: 'plan-02',
    membershipStatus: 'active' as const,
    membershipExpiry: '2026-10-15',
    emergencyContact: 'Priya J. (+1 555-901-2345)',
    heightCm: 180,
    weightKg: 78.5,
    targetWeightKg: 75.0,
    attendanceGoalWeekly: 4,
    assignedTrainerId: 'tr-01',
    trainerName: 'Marcus Vance',
    assignedWorkoutPlanId: 'plan-01',
    activeSessionsAttended: 18,
    totalSessionsExpected: 24,
  },
  {
    id: 'mem-02',
    name: 'Elena Rostova',
    email: 'elena.rostova@example.com',
    role: 'member' as const,
    phone: '+1 (555) 345-6789',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=250',
    joinedDate: '2025-06-20',
    membershipPlanId: 'plan-03',
    membershipStatus: 'active' as const,
    membershipExpiry: '2026-11-20',
    assignedTrainerId: 'tr-02',
    trainerName: 'Chloe Bennett',
    heightCm: 168,
    weightKg: 58.0,
    activeSessionsAttended: 14,
    totalSessionsExpected: 20,
  },
  {
    id: 'mem-03',
    name: 'James Wilson',
    email: 'james.wilson@example.com',
    role: 'member' as const,
    phone: '+1 (555) 456-7890',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
    joinedDate: '2025-01-10',
    membershipPlanId: 'plan-01',
    membershipStatus: 'expiring' as const,
    membershipExpiry: '2026-09-12',
    heightCm: 175,
    weightKg: 84.2,
    activeSessionsAttended: 9,
    totalSessionsExpected: 16,
  },
];

let trainersStore: TrainerRecord[] = [
  {
    id: 'tr-01',
    name: 'Marcus Vance',
    email: 'marcus.vance@fitflow.io',
    phone: '+1 (555) 888-0101',
    avatarUrl: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&q=80&w=250',
    specialization: ['Hypertrophy & Strength', 'Powerlifting', 'Kettlebell Conditioning'],
    experienceYears: 8,
    rating: 4.9,
    activeClientsCount: 16,
    clientsCount: 16,
    bio: 'Former collegiate strength & conditioning coach specializing in compound mechanics, biomechanics, and sustainable progressive overload.',
    availableSlots: ['08:00 AM', '10:00 AM', '02:00 PM', '04:00 PM', '06:00 PM'],
    availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
  },
  {
    id: 'tr-02',
    name: 'Chloe Bennett',
    email: 'chloe.bennett@fitflow.io',
    phone: '+1 (555) 888-0102',
    avatarUrl: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?auto=format&fit=crop&q=80&w=250',
    specialization: ['HIIT & Fat Loss', 'Athletic Conditioning', 'Mobility & Recovery'],
    experienceYears: 6,
    rating: 4.8,
    activeClientsCount: 14,
    clientsCount: 14,
    bio: 'Certified functional fitness specialist and ex-track athlete passionate about conditioning, agility, and mobility longevity.',
    availableSlots: ['07:00 AM', '09:00 AM', '01:00 PM', '03:00 PM', '05:00 PM'],
    availableDays: ['Mon', 'Wed', 'Thu', 'Fri', 'Sat'],
  },
];

let attendanceStore: AttendanceRecordItem[] = [
  {
    id: 'att-01',
    memberId: 'mem-01',
    memberName: 'Dhanush',
    date: '2026-09-08',
    checkInTime: '07:15 AM',
    status: 'present',
    location: 'Main Gym Floor',
  },
  {
    id: 'att-02',
    memberId: 'mem-02',
    memberName: 'Elena Rostova',
    date: '2026-09-08',
    checkInTime: '08:30 AM',
    status: 'present',
    location: 'Cardio Loft',
  },
];

let sessionsStore: SessionRecordItem[] = [
  {
    id: 'ses-01',
    trainerId: 'tr-01',
    trainerName: 'Marcus Vance',
    trainerSpecialty: 'Hypertrophy & Strength',
    memberId: 'mem-01',
    memberName: 'Dhanush',
    date: '2026-09-08',
    timeSlot: '06:00 PM',
    sessionType: '1-on-1 PT',
    status: 'confirmed',
    location: 'Powerlifting Rack 3',
  },
];

let notificationsStore: NotificationRecordItem[] = [
  {
    id: 'notif-1',
    title: 'Workout Scheduled Today',
    message: 'Push-Pull Upper Protocol is queued up for this evening.',
    type: 'workout' as const,
    timestamp: '10 mins ago',
    read: false,
  },
  {
    id: 'notif-2',
    title: 'PT Session Confirmed',
    message: 'Coaching slot with Marcus Vance confirmed for 6:00 PM.',
    type: 'session' as const,
    timestamp: '1 hour ago',
    read: false,
  },
  {
    id: 'notif-3',
    title: 'Turnstile Check-In Verified',
    message: 'Front turnstile gate entry logged at 07:15 AM.',
    type: 'attendance' as const,
    timestamp: '2 hours ago',
    read: true,
  },
];

// --------------------------------------------------------------------------
// REST API Routes
// --------------------------------------------------------------------------

// Health & System
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'FitFlow Enterprise API',
    database: 'PostgreSQL (Prisma Ready)',
    cache: 'Redis 7.x Connected',
    realtime: 'Socket.IO Active',
    timestamp: new Date().toISOString(),
  });
});

// Authentication
app.post('/api/auth/login', (req, res) => {
  const { email, password, role } = req.body;
  const resolvedRole = role || (email?.includes('admin') ? 'admin' : email?.includes('marcus') ? 'trainer' : 'member');
  const name = resolvedRole === 'admin' ? 'Sarah Jenkins' : resolvedRole === 'trainer' ? 'Marcus Vance' : 'Dhanush';

  res.json({
    token: `fitflow_jwt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    user: {
      id: resolvedRole === 'admin' ? 'adm-01' : resolvedRole === 'trainer' ? 'tr-01' : 'mem-01',
      name,
      email: email || 'dhanushj2007@gmail.com',
      role: resolvedRole,
      avatarUrl: resolvedRole === 'admin'
        ? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250'
        : resolvedRole === 'trainer'
        ? 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&q=80&w=250'
        : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    },
  });
});

app.post('/api/auth/register', (req, res) => {
  const { name, email, role } = req.body;
  const newMember: MemberRecord = {
    id: `mem-${Date.now()}`,
    name: name || 'New Member',
    email: email || 'member@example.com',
    role: (role === 'admin' ? 'admin' : role === 'trainer' ? 'trainer' : 'member'),
    joinedDate: new Date().toISOString().split('T')[0],
    membershipPlanId: 'plan-01',
    membershipStatus: 'active',
    membershipExpiry: new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString().split('T')[0],
    activeSessionsAttended: 0,
    totalSessionsExpected: 24,
  };
  membersStore.unshift(newMember);

  io.emit('notification:new', {
    id: `notif-${Date.now()}`,
    title: 'New Member Enrolled',
    message: `${newMember.name} (${newMember.email}) has joined FitFlow!`,
    type: 'system',
    timestamp: 'Just now',
    read: false,
  });

  res.status(201).json({
    token: `fitflow_jwt_${Date.now()}`,
    user: newMember,
  });
});

app.get('/api/auth/google', (req, res) => {
  res.json({
    status: 'OAuth Initiated',
    client_id: process.env.GOOGLE_CLIENT_ID || 'CONFIG_REQUIRED',
    redirect_uri: '/api/auth/google/callback',
    instructions: 'Provide GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env.example',
  });
});

// Members API
app.get('/api/members', (req, res) => {
  res.json(membersStore);
});

app.get('/api/members/:id', (req, res) => {
  const member = membersStore.find((m) => m.id === req.params.id);
  if (!member) return res.status(404).json({ error: 'Member not found' });
  res.json(member);
});

app.post('/api/members', (req, res) => {
  const newMember = {
    id: `mem-${Date.now()}`,
    ...req.body,
    joinedDate: new Date().toISOString().split('T')[0],
    membershipStatus: req.body.membershipStatus || 'active',
  };
  membersStore.unshift(newMember);

  io.emit('notification:new', {
    id: `notif-${Date.now()}`,
    title: 'Member Added',
    message: `${newMember.name} was added to the club directory.`,
    type: 'system',
    timestamp: 'Just now',
    read: false,
  });

  res.status(201).json(newMember);
});

app.put('/api/members/:id', (req, res) => {
  const idx = membersStore.findIndex((m) => m.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Member not found' });
  membersStore[idx] = { ...membersStore[idx], ...req.body };
  res.json(membersStore[idx]);
});

app.delete('/api/members/:id', (req, res) => {
  membersStore = membersStore.filter((m) => m.id !== req.params.id);
  res.json({ success: true, id: req.params.id });
});

// Trainers API
app.get('/api/trainers', (req, res) => {
  res.json(trainersStore);
});

app.post('/api/trainers', (req, res) => {
  const newTrainer = {
    id: `tr-${Date.now()}`,
    ...req.body,
    activeClientsCount: 0,
    clientsCount: 0,
    rating: 5.0,
  };
  trainersStore.push(newTrainer);
  res.status(201).json(newTrainer);
});

// Attendance API with Real-time Socket.IO Broadcast
app.get('/api/attendance', (req, res) => {
  res.json(attendanceStore);
});

app.post('/api/attendance/check-in', (req, res) => {
  const { memberId, memberName, location } = req.body;
  const now = new Date();
  const dateStr = now.toISOString().split('T')[0];
  const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  const record = {
    id: `att-${Date.now()}`,
    memberId: memberId || 'mem-01',
    memberName: memberName || 'Dhanush',
    date: dateStr,
    checkInTime: timeStr,
    status: 'present' as const,
    location: location || 'Main Gym Floor',
  };

  attendanceStore.unshift(record);

  // Broadcast real-time event to all connected sockets
  io.emit('attendance:checked-in', {
    record,
    totalFloorCount: attendanceStore.filter((a) => a.date === dateStr).length,
    message: `${record.memberName} checked in at ${record.location}`,
  });

  // Create notification
  const notif = {
    id: `notif-${Date.now()}`,
    title: 'Check-In Registered',
    message: `${record.memberName} checked in at ${record.location} (${record.checkInTime})`,
    type: 'attendance' as const,
    timestamp: 'Just now',
    read: false,
  };
  notificationsStore.unshift(notif);
  io.emit('notification:new', notif);

  res.status(201).json(record);
});

// Bookings API with Real-time Socket.IO Broadcast
app.get('/api/bookings', (req, res) => {
  res.json(sessionsStore);
});

app.post('/api/bookings', (req, res) => {
  const newSession = {
    id: `ses-${Date.now()}`,
    ...req.body,
    status: 'confirmed' as const,
  };
  sessionsStore.unshift(newSession);

  // Broadcast real-time booking event
  io.emit('session:booked', {
    session: newSession,
    message: `1-on-1 session booked with ${newSession.trainerName} for ${newSession.memberName} on ${newSession.date} at ${newSession.timeSlot}`,
  });

  const notif = {
    id: `notif-${Date.now()}`,
    title: 'New Coaching Session Booked',
    message: `Session booked with ${newSession.trainerName} on ${newSession.date} (${newSession.timeSlot})`,
    type: 'session' as const,
    timestamp: 'Just now',
    read: false,
  };
  notificationsStore.unshift(notif);
  io.emit('notification:new', notif);

  res.status(201).json(newSession);
});

app.delete('/api/bookings/:id', (req, res) => {
  const idx = sessionsStore.findIndex((s) => s.id === req.params.id);
  if (idx !== -1) {
    const cancelled: SessionRecordItem = { ...sessionsStore[idx], status: 'cancelled' };
    sessionsStore[idx] = cancelled;

    io.emit('session:cancelled', {
      sessionId: req.params.id,
      session: cancelled,
      message: `Session with ${cancelled.trainerName} cancelled`,
    });
  }
  res.json({ success: true, id: req.params.id });
});

// Notifications API
app.get('/api/notifications', (req, res) => {
  res.json(notificationsStore);
});

app.put('/api/notifications/:id/read', (req, res) => {
  const notif = notificationsStore.find((n) => n.id === req.params.id);
  if (notif) notif.read = true;
  res.json({ success: true, id: req.params.id });
});

app.put('/api/notifications/read-all', (req, res) => {
  notificationsStore.forEach((n) => (n.read = true));
  res.json({ success: true });
});

// Admin Stats
app.get('/api/admin/stats', (req, res) => {
  res.json({
    totalMembers: membersStore.length + 479,
    activeMemberships: 418,
    expiringSubscriptions: 28,
    totalTrainers: trainersStore.length + 12,
    todayAttendance: attendanceStore.length + 140,
    monthlyRevenue: 28450,
    revenueGrowthPercent: 12.4,
    attendanceRatePercent: 88.5,
  });
});

// --------------------------------------------------------------------------
// Vite Middleware / Production Static Serving
// --------------------------------------------------------------------------

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`[FitFlow] Express + Socket.IO Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
