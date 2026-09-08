import React from 'react';
import {
  Activity,
  Dumbbell,
  CalendarCheck,
  LineChart,
  Shield,
  CreditCard,
  CheckCircle2,
  ArrowRight,
  Flame,
  ChevronRight,
  Zap,
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { NavigationTab } from '../types';

interface LandingPageProps {
  onNavigate: (tab: NavigationTab) => void;
  onLoginAs: (role: 'member' | 'admin') => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate, onLoginAs }) => {
  return (
    <div className="min-h-screen bg-[#0B1120] text-slate-100 selection:bg-[#22C55E] selection:text-black">
      {/* Top Navigation */}
      <nav className="sticky top-0 z-40 bg-[#0B1120]/85 backdrop-blur-md border-b border-white/10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5 cursor-pointer">
            <div className="w-10 h-10 rounded-xl bg-[#22C55E] flex items-center justify-center text-black font-black shadow-[0_0_20px_rgba(34,197,94,0.4)]">
              <Activity className="w-6 h-6 stroke-[2.5]" />
            </div>
            <span className="text-2xl font-black tracking-tight text-white font-['Outfit',sans-serif]">
              Fit<span className="text-[#22C55E]">Flow</span>
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#features" className="hover:text-[#22C55E] transition-colors">Features</a>
            <a href="#benefits" className="hover:text-[#22C55E] transition-colors">Benefits</a>
            <a href="#plans" className="hover:text-[#22C55E] transition-colors">Memberships</a>
            <button
              onClick={() => onNavigate('api-docs')}
              className="hover:text-sky-400 transition-colors flex items-center gap-1 text-slate-400"
            >
              Tech Architecture
            </button>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onNavigate('login')}
            >
              Sign In
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => onLoginAs('member')}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Member Demo
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onLoginAs('admin')}
              className="hidden sm:inline-flex"
            >
              Admin Demo
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-16 pb-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Hero Copy */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#22C55E]/10 border border-[#22C55E]/30 text-[#22C55E] text-xs font-bold tracking-wide">
              <Zap className="w-3.5 h-3.5 fill-[#22C55E]" />
              <span>Next-Generation Fitness Center OS</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-[1.1] font-['Outfit',sans-serif]">
              Your Fitness. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#22C55E] via-emerald-400 to-lime-300">
                Your Progress.
              </span> <br />
              Your Future.
            </h1>

            <p className="text-lg text-slate-300 max-w-xl leading-relaxed">
              FitFlow empowers gyms, athletic clubs, and boutique studios with seamless membership management, trainer scheduling, individualized workout plans, automated check-ins, and biometric performance tracking.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Button
                size="lg"
                variant="primary"
                onClick={() => onNavigate('login')}
                rightIcon={<ChevronRight className="w-5 h-5" />}
              >
                Get Started Free
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => {
                  const el = document.getElementById('features');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Explore Features
              </Button>
            </div>

            {/* Quick Metrics preview */}
            <div className="pt-6 grid grid-cols-3 gap-4 border-t border-white/10 max-w-lg">
              <div>
                <div className="text-2xl font-black text-white">99.4%</div>
                <div className="text-xs text-slate-400">Attendance Uptime</div>
              </div>
              <div>
                <div className="text-2xl font-black text-[#22C55E]">4.9 / 5</div>
                <div className="text-xs text-slate-400">Trainer Satisfaction</div>
              </div>
              <div>
                <div className="text-2xl font-black text-white">&lt; 1 sec</div>
                <div className="text-xs text-slate-400">Kiosk Check-In</div>
              </div>
            </div>
          </div>

          {/* Fitness Visual Illustration */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-[#0F172A] p-3">
              <img
                src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=900"
                alt="FitFlow Athletic Training Facility"
                className="rounded-2xl object-cover w-full h-[380px] brightness-95 contrast-105"
              />
              
              {/* Floating interactive mock card 1 */}
              <div className="absolute top-8 -left-4 sm:-left-8 bg-[#0B1120]/90 backdrop-blur-md border border-white/15 p-3.5 rounded-2xl shadow-xl flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-[#22C55E] text-black">
                  <Flame className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Today's Streak</span>
                  <p className="text-sm font-extrabold text-white">18 of 24 Sessions</p>
                </div>
              </div>

              {/* Floating interactive mock card 2 */}
              <div className="absolute bottom-8 -right-4 sm:-right-6 bg-[#0B1120]/90 backdrop-blur-md border border-white/15 p-3.5 rounded-2xl shadow-xl flex items-center gap-3">
                <div className="w-10 h-10 rounded-full border-2 border-[#22C55E] p-0.5 overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1567013127542-490d757e51fc?auto=format&fit=crop&q=80&w=150"
                    alt="Marcus Vance"
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-[#22C55E] font-bold uppercase tracking-wider">Next Session</span>
                  <p className="text-xs font-bold text-white">Today 6:00 PM • Coach Marcus</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-[#0F172A]/50 border-y border-white/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold text-[#22C55E] uppercase tracking-widest">
              Unified Platform
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white mt-2 font-['Outfit',sans-serif]">
              Engineered for Modern Fitness Centers
            </h2>
            <p className="text-slate-400 mt-3 text-sm sm:text-base">
              Say goodbye to fragmented spreadsheets and legacy gym software. FitFlow centralizes all club operations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="p-6 rounded-2xl bg-[#0D1527] border border-white/5 hover:border-[#22C55E]/40 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-[#22C55E]/10 border border-[#22C55E]/20 text-[#22C55E] flex items-center justify-center mb-4 group-hover:bg-[#22C55E] group-hover:text-black transition-colors">
                <Dumbbell className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Tailored Workout Curriculum</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Assign muscle-group specific regimens (Chest, Back, Legs, Cardio) complete with target sets, rep tempos, and real-time exercise completion tracking.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-2xl bg-[#0D1527] border border-white/5 hover:border-[#22C55E]/40 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center mb-4 group-hover:bg-sky-400 group-hover:text-black transition-colors">
                <CalendarCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Automated Check-in & Streaks</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Frictionless kiosk check-ins, monthly attendance heatmaps, presence analytics, and automated retention alerts for slipping members.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-2xl bg-[#0D1527] border border-white/5 hover:border-[#22C55E]/40 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mb-4 group-hover:bg-amber-400 group-hover:text-black transition-colors">
                <LineChart className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Biometric & Strength Tracking</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Log progressive compound 1RMs (bench, squat, deadlift), track weight and BMI curves, and monitor circumference changes across time.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-6 rounded-2xl bg-[#0D1527] border border-white/5 hover:border-[#22C55E]/40 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center mb-4 group-hover:bg-purple-400 group-hover:text-black transition-colors">
                <Activity className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Trainer Calendars & 1-on-1s</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Enable members to browse certified coach profiles, examine specialties, and book or reschedule personal training slots in seconds.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-6 rounded-2xl bg-[#0D1527] border border-white/5 hover:border-[#22C55E]/40 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4 group-hover:bg-emerald-400 group-hover:text-black transition-colors">
                <CreditCard className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Flexible Subscription Management</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Multi-tier memberships (Basic, Premium, Pro), transparent expiration countdowns, automated renewal workflows, and receipts history.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-6 rounded-2xl bg-[#0D1527] border border-white/5 hover:border-[#22C55E]/40 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mb-4 group-hover:bg-rose-400 group-hover:text-black transition-colors">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Admin Command Center</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Real-time club capacity, MRR growth telemetry, expiring subscriber registries, trainer roster oversight, and comprehensive member directories.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-20">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-xs font-bold text-[#22C55E] uppercase tracking-widest">
              Why FitFlow
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white mt-2 mb-6 font-['Outfit',sans-serif]">
              Built for High-Performing Clubs & Motivated Members
            </h2>

            <div className="space-y-4">
              {[
                { title: 'Boost Member Retention by 34%', desc: 'Interactive workout plans and attendance gamification keep members engaged long beyond month 3.' },
                { title: 'Zero Friction Scheduling', desc: 'No phone calls or front-desk bottlenecks. Members book PT sessions directly from their phone.' },
                { title: 'Complete Financial Visibility', desc: 'Real-time billing dashboards track expiring subscriptions and recurring revenue growth.' },
                { title: 'Enterprise-Ready Architecture', desc: 'Designed with clean REST endpoints ready to back Postgres, Redis caching, and Docker containers.' }
              ].map((benefit, i) => (
                <div key={i} className="flex items-start gap-3.5 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                  <div className="p-1 rounded-lg bg-[#22C55E]/15 text-[#22C55E] mt-0.5 shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{benefit.title}</h4>
                    <p className="text-xs text-slate-400 mt-0.5">{benefit.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex items-center gap-4">
              <Button
                variant="primary"
                onClick={() => onLoginAs('member')}
              >
                Test Member Portal
              </Button>
              <Button
                variant="outline"
                onClick={() => onLoginAs('admin')}
              >
                Test Admin Portal
              </Button>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 overflow-hidden bg-[#0D1527] p-4 sm:p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500" />
                <span className="w-3 h-3 rounded-full bg-amber-500" />
                <span className="w-3 h-3 rounded-full bg-[#22C55E]" />
              </div>
              <span className="text-xs text-slate-400 font-mono">fitflow-live-dashboard.ts</span>
            </div>

            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-[#0B1120] border border-white/5 flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-400">Total Active Members</div>
                  <div className="text-2xl font-black text-white">418 Athletes</div>
                </div>
                <span className="text-xs px-2 py-1 rounded-md bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">
                  +12.4% MoM
                </span>
              </div>

              <div className="p-4 rounded-xl bg-[#0B1120] border border-white/5 flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-400">Today's Check-ins</div>
                  <div className="text-2xl font-black text-[#22C55E]">142 Checked In</div>
                </div>
                <span className="text-xs text-slate-400">Peak hour: 6:00 PM</span>
              </div>

              <div className="p-4 rounded-xl bg-[#0B1120] border border-white/5 flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-400">Monthly Recurring Revenue</div>
                  <div className="text-2xl font-black text-white">$34,850</div>
                </div>
                <span className="text-xs text-sky-400 font-medium">98.2% Collected</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call To Action */}
      <section className="py-20 bg-gradient-to-b from-[#0B1120] to-[#0F172A] border-t border-white/10 text-center">
        <div className="max-w-4xl mx-auto px-6 space-y-6">
          <div className="inline-block p-3 rounded-2xl bg-[#22C55E]/10 border border-[#22C55E]/30 text-[#22C55E]">
            <Activity className="w-8 h-8" />
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight font-['Outfit',sans-serif]">
            Ready to Transform Your Fitness Center?
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto text-base">
            Launch FitFlow today. Explore the member portal or step into the director's command center with instant one-click access.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Button
              size="lg"
              variant="primary"
              onClick={() => onLoginAs('member')}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Launch Member View
            </Button>
            <Button
              size="lg"
              variant="secondary"
              onClick={() => onLoginAs('admin')}
            >
              Launch Admin View
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-[#070B14] py-12 px-6 text-sm text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#22C55E] flex items-center justify-center text-black font-bold">
              <Activity className="w-4 h-4 stroke-[2.5]" />
            </div>
            <span className="text-lg font-bold text-white font-['Outfit',sans-serif]">
              Fit<span className="text-[#22C55E]">Flow</span>
            </span>
            <span className="text-xs text-slate-500 ml-2">© 2026 FitFlow Inc. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-6 text-xs text-slate-400">
            <button onClick={() => onNavigate('api-docs')} className="hover:text-white transition-colors">
              REST Architecture
            </button>
            <button onClick={() => onNavigate('login')} className="hover:text-white transition-colors">
              Member Sign-In
            </button>
            <button onClick={() => onLoginAs('admin')} className="hover:text-white transition-colors">
              Staff Portal
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
