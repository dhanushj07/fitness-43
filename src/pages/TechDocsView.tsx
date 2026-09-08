import React, { useState } from 'react';
import {
  Database,
  Server,
  Zap,
  Box,
  GitBranch,
  Copy,
  Check,
  Code2,
  Terminal,
} from 'lucide-react';
import { Button } from '../components/common/Button';

export const TechDocsView: React.FC = () => {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const copyToClipboard = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(key);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const postgresSchema = `-- FitFlow PostgreSQL DDL Schema
-- Production Relational Architecture

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role VARCHAR(20) NOT NULL CHECK (role IN ('member', 'admin', 'trainer')),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE membership_plans (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    price_monthly NUMERIC(10, 2) NOT NULL,
    price_yearly NUMERIC(10, 2) NOT NULL,
    features JSONB NOT NULL DEFAULT '[]',
    badge VARCHAR(50),
    is_popular BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE members (
    id VARCHAR(50) PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    membership_plan_id VARCHAR(50) REFERENCES membership_plans(id),
    membership_status VARCHAR(30) NOT NULL DEFAULT 'active' CHECK (membership_status IN ('active', 'expiring', 'expired', 'frozen')),
    membership_expiry DATE NOT NULL,
    assigned_trainer_id VARCHAR(50),
    height_cm NUMERIC(5, 1),
    weight_kg NUMERIC(5, 1),
    active_sessions_attended INTEGER DEFAULT 0,
    total_sessions_expected INTEGER DEFAULT 24,
    joined_date DATE NOT NULL DEFAULT CURRENT_DATE
);

CREATE TABLE trainers (
    id VARCHAR(50) PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    specialization TEXT[] NOT NULL DEFAULT '{}',
    experience_years INTEGER NOT NULL DEFAULT 1,
    rating NUMERIC(2, 1) DEFAULT 5.0,
    clients_count INTEGER DEFAULT 0,
    avatar_url TEXT,
    bio TEXT,
    available_days TEXT[] DEFAULT '{"Mon","Tue","Wed","Thu","Fri"}',
    available_slots TEXT[] DEFAULT '{"08:00 AM","10:00 AM","02:00 PM","04:00 PM"}'
);

CREATE TABLE workout_plans (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(50) NOT NULL,
    level VARCHAR(30) NOT NULL,
    duration_weeks INTEGER NOT NULL DEFAULT 6,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE exercises (
    id VARCHAR(50) PRIMARY KEY,
    workout_plan_id VARCHAR(50) REFERENCES workout_plans(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL,
    sets INTEGER NOT NULL DEFAULT 4,
    reps VARCHAR(50) NOT NULL DEFAULT '8-10',
    target_muscle VARCHAR(100),
    rest_seconds INTEGER DEFAULT 90,
    difficulty VARCHAR(30) DEFAULT 'Intermediate',
    notes TEXT
);

CREATE TABLE member_exercise_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    member_id VARCHAR(50) REFERENCES members(id) ON DELETE CASCADE,
    exercise_id VARCHAR(50) REFERENCES exercises(id) ON DELETE CASCADE,
    completed BOOLEAN DEFAULT FALSE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE attendance (
    id VARCHAR(50) PRIMARY KEY,
    member_id VARCHAR(50) REFERENCES members(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    check_in_time VARCHAR(20) NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('present', 'absent', 'leave')),
    location VARCHAR(100) DEFAULT 'Main Gym Floor'
);

CREATE TABLE trainer_sessions (
    id VARCHAR(50) PRIMARY KEY,
    trainer_id VARCHAR(50) REFERENCES trainers(id) ON DELETE CASCADE,
    member_id VARCHAR(50) REFERENCES members(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    time_slot VARCHAR(20) NOT NULL,
    session_type VARCHAR(50) NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'completed', 'cancelled')),
    location VARCHAR(100)
);

CREATE TABLE payments (
    id VARCHAR(50) PRIMARY KEY,
    invoice_number VARCHAR(50) UNIQUE NOT NULL,
    member_id VARCHAR(50) REFERENCES members(id) ON DELETE CASCADE,
    plan_name VARCHAR(100) NOT NULL,
    amount NUMERIC(10, 2) NOT NULL,
    date DATE NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'paid' CHECK (status IN ('paid', 'pending', 'failed'))
);

CREATE TABLE performance_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    member_id VARCHAR(50) REFERENCES members(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    weight_kg NUMERIC(5, 1) NOT NULL,
    bmi NUMERIC(4, 1) NOT NULL,
    body_fat_percent NUMERIC(4, 1) NOT NULL,
    chest_cm NUMERIC(5, 1),
    waist_cm NUMERIC(5, 1),
    bicep_cm NUMERIC(5, 1),
    thigh_cm NUMERIC(5, 1),
    bench_press_kg NUMERIC(5, 1),
    squat_kg NUMERIC(5, 1),
    deadlift_kg NUMERIC(5, 1)
);

-- Indexes for ultra-fast query execution
CREATE INDEX idx_attendance_member_date ON attendance(member_id, date);
CREATE INDEX idx_trainer_sessions_date ON trainer_sessions(trainer_id, date);
CREATE INDEX idx_members_status ON members(membership_status);`;

  const redisCachingStrategy = `// FitFlow Redis Caching Strategy
// Cache Architecture & Invalidation Keys

const REDIS_TTL = {
  ADMIN_STATS: 60,              // 60 seconds TTL (near real-time analytics)
  MEMBER_DASHBOARD: 300,        // 5 minutes TTL
  WORKOUT_PLANS: 3600,          // 1 hour TTL (static curricula)
  TRAINER_SCHEDULE: 180,        // 3 minutes TTL (frequent booking updates)
  ATTENDANCE_HEATMAP: 600,      // 10 minutes TTL
};

// Cache Key Naming Convention:
// - fitflow:admin:stats
// - fitflow:member:{memberId}:dashboard
// - fitflow:member:{memberId}:attendance:{yearMonth}
// - fitflow:trainers:roster
// - fitflow:trainers:{trainerId}:schedule:{date}
// - fitflow:workout_plans:all

// Cache Invalidation Rules:
// 1. On Gym Check-In:
//    redis.del(\`fitflow:member:\${memberId}:dashboard\`);
//    redis.del(\`fitflow:member:\${memberId}:attendance:\${currentMonth}\`);
//    redis.del('fitflow:admin:stats');
//
// 2. On Trainer Booking / Cancellation:
//    redis.del(\`fitflow:trainers:\${trainerId}:schedule:\${date}\`);
//    redis.del(\`fitflow:member:\${memberId}:dashboard\`);
//
// 3. On Subscription Renewal:
//    redis.del(\`fitflow:member:\${memberId}:dashboard\`);
//    redis.del('fitflow:admin:stats');`;

  const dockerSetup = `# Dockerfile for Express.js + Node.js Backend API
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm ci --only=production
COPY --from=builder /app/dist ./dist
EXPOSE 4000
CMD ["node", "dist/server.js"]

---

# docker-compose.yml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - PORT=3000
      - DATABASE_URL=postgres://fitflow:fitflow_pass@postgres:5432/fitflow_db
      - REDIS_URL=redis://redis:6379
      - JWT_SECRET=fitflow_super_secret_jwt_key
    depends_on:
      - postgres
      - redis

  postgres:
    image: postgres:16-alpine
    restart: always
    environment:
      POSTGRES_USER: fitflow
      POSTGRES_PASSWORD: fitflow_pass
      POSTGRES_DB: fitflow_db
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    restart: always
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:`;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#0F172A] via-[#0D1527] to-[#0B1120] border border-white/10 shadow-xl">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#22C55E]/10 border border-[#22C55E]/30 text-[#22C55E] text-xs font-bold">
            <Code2 className="w-3.5 h-3.5" />
            <span>Full-Stack Architecture Blueprints</span>
          </div>
          <h2 className="text-3xl font-black text-white font-['Outfit',sans-serif]">
            FitFlow Technical Specifications & Schemas
          </h2>
          <p className="text-sm text-slate-300 max-w-2xl">
            Designed for turnkey connection to Node.js / Express.js REST APIs, PostgreSQL relational data persistence, Redis micro-caching, and Docker containers.
          </p>
        </div>
      </div>

      {/* API Endpoints Mapping Table */}
      <div className="p-6 rounded-3xl bg-[#0F172A] border border-white/10 shadow-xl space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <Server className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Express.js REST API Service Contract</h3>
            <p className="text-xs text-slate-400">All frontend services map 1-to-1 with these endpoints</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-[#0B1120] text-slate-400 uppercase tracking-wider font-semibold border-b border-white/10">
              <tr>
                <th className="py-3 px-4">Method</th>
                <th className="py-3 px-4">Endpoint</th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4">Auth Required</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-mono">
              <tr>
                <td className="py-2.5 px-4"><span className="text-sky-400 font-bold">POST</span></td>
                <td className="py-2.5 px-4 text-white">/api/auth/login</td>
                <td className="py-2.5 px-4 font-sans text-slate-400">Authenticate user & issue JWT token</td>
                <td className="py-2.5 px-4 font-sans text-slate-400">Public</td>
              </tr>
              <tr>
                <td className="py-2.5 px-4"><span className="text-emerald-400 font-bold">GET</span></td>
                <td className="py-2.5 px-4 text-white">/api/members/:id/dashboard</td>
                <td className="py-2.5 px-4 font-sans text-slate-400">Fetch member membership, streak, today's workout</td>
                <td className="py-2.5 px-4 font-sans text-[#22C55E]">Bearer JWT (Member)</td>
              </tr>
              <tr>
                <td className="py-2.5 px-4"><span className="text-sky-400 font-bold">POST</span></td>
                <td className="py-2.5 px-4 text-white">/api/attendance/check-in</td>
                <td className="py-2.5 px-4 font-sans text-slate-400">Record turnstile entry and update monthly attendance</td>
                <td className="py-2.5 px-4 font-sans text-[#22C55E]">Bearer JWT (Member/Admin)</td>
              </tr>
              <tr>
                <td className="py-2.5 px-4"><span className="text-sky-400 font-bold">POST</span></td>
                <td className="py-2.5 px-4 text-white">/api/trainers/book-session</td>
                <td className="py-2.5 px-4 font-sans text-slate-400">Reserve 1-on-1 coaching time slot</td>
                <td className="py-2.5 px-4 font-sans text-[#22C55E]">Bearer JWT (Member)</td>
              </tr>
              <tr>
                <td className="py-2.5 px-4"><span className="text-sky-400 font-bold">POST</span></td>
                <td className="py-2.5 px-4 text-white">/api/subscriptions/renew</td>
                <td className="py-2.5 px-4 font-sans text-slate-400">Process tier extension & record payment invoice</td>
                <td className="py-2.5 px-4 font-sans text-[#22C55E]">Bearer JWT (Member/Admin)</td>
              </tr>
              <tr>
                <td className="py-2.5 px-4"><span className="text-emerald-400 font-bold">GET</span></td>
                <td className="py-2.5 px-4 text-white">/api/admin/metrics/summary</td>
                <td className="py-2.5 px-4 font-sans text-slate-400">Aggregated revenue, retention, and capacity figures</td>
                <td className="py-2.5 px-4 font-sans text-amber-400">Bearer JWT (Admin)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* PostgreSQL DDL Schema */}
      <div className="p-6 rounded-3xl bg-[#0F172A] border border-white/10 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">PostgreSQL Relational Schema (DDL)</h3>
              <p className="text-xs text-slate-400">Normalized database tables with relational foreign keys and indexes</p>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => copyToClipboard('postgres', postgresSchema)}
            leftIcon={copiedSection === 'postgres' ? <Check className="w-3.5 h-3.5 text-[#22C55E]" /> : <Copy className="w-3.5 h-3.5" />}
          >
            {copiedSection === 'postgres' ? 'Copied' : 'Copy DDL'}
          </Button>
        </div>

        <pre className="p-4 rounded-2xl bg-[#0B1120] border border-white/5 text-xs text-slate-300 font-mono overflow-x-auto max-h-96">
          {postgresSchema}
        </pre>
      </div>

      {/* Redis Strategy */}
      <div className="p-6 rounded-3xl bg-[#0F172A] border border-white/10 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Redis Caching & Invalidation Architecture</h3>
              <p className="text-xs text-slate-400">Sub-millisecond dashboard acceleration rules</p>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => copyToClipboard('redis', redisCachingStrategy)}
            leftIcon={copiedSection === 'redis' ? <Check className="w-3.5 h-3.5 text-[#22C55E]" /> : <Copy className="w-3.5 h-3.5" />}
          >
            {copiedSection === 'redis' ? 'Copied' : 'Copy Spec'}
          </Button>
        </div>

        <pre className="p-4 rounded-2xl bg-[#0B1120] border border-white/5 text-xs text-slate-300 font-mono overflow-x-auto">
          {redisCachingStrategy}
        </pre>
      </div>

      {/* Docker Deployment */}
      <div className="p-6 rounded-3xl bg-[#0F172A] border border-white/10 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
              <Box className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Docker & Containerization Compose</h3>
              <p className="text-xs text-slate-400">Multi-container setup with Node.js, PostgreSQL 16, and Redis 7</p>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => copyToClipboard('docker', dockerSetup)}
            leftIcon={copiedSection === 'docker' ? <Check className="w-3.5 h-3.5 text-[#22C55E]" /> : <Copy className="w-3.5 h-3.5" />}
          >
            {copiedSection === 'docker' ? 'Copied' : 'Copy Docker Compose'}
          </Button>
        </div>

        <pre className="p-4 rounded-2xl bg-[#0B1120] border border-white/5 text-xs text-slate-300 font-mono overflow-x-auto">
          {dockerSetup}
        </pre>
      </div>
    </div>
  );
};
