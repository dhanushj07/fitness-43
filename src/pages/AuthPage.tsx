import React, { useState } from 'react';
import { Mail, Lock, User, Shield, ArrowRight, Activity, CheckCircle2 } from 'lucide-react';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { UserRole } from '../types';

interface AuthPageProps {
  onLogin: (role: UserRole, email: string) => void;
  onBackToLanding: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onLogin, onBackToLanding }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [role, setRole] = useState<UserRole>('member');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { name?: string; email?: string; password?: string } = {};

    if (isRegister && !name.trim()) {
      newErrors.name = 'Full name is required';
    }

    if (!email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      onLogin(role, email);
    }, 400);
  };

  const handleQuickDemo = (demoRole: UserRole) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLogin(
        demoRole,
        demoRole === 'admin' ? 'admin@fitflow.io' : 'alex.morgan@fitflow.io'
      );
    }, 200);
  };

  return (
    <div className="min-h-screen bg-[#0B1120] flex items-center justify-center p-4 selection:bg-[#22C55E] selection:text-black">
      {/* Background radial highlight */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(34,197,94,0.08),_transparent_50%)] pointer-events-none" />

      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-12 rounded-3xl border border-white/10 overflow-hidden shadow-2xl bg-[#0F172A] z-10">
        {/* Left Side: Brand & Visual Preview */}
        <div className="md:col-span-5 bg-gradient-to-br from-[#0B1120] to-[#0D1527] p-8 flex flex-col justify-between border-b md:border-b-0 md:border-r border-white/10 relative overflow-hidden">
          <div>
            <div
              onClick={onBackToLanding}
              className="flex items-center gap-2 cursor-pointer mb-8 group"
            >
              <div className="w-9 h-9 rounded-xl bg-[#22C55E] flex items-center justify-center text-black font-black">
                <Activity className="w-5 h-5 stroke-[2.5]" />
              </div>
              <span className="text-xl font-black text-white font-['Outfit',sans-serif]">
                Fit<span className="text-[#22C55E]">Flow</span>
              </span>
            </div>

            <h2 className="text-2xl font-black text-white leading-tight font-['Outfit',sans-serif] mb-3">
              Experience the Future of Fitness Center Management
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed mb-6">
              Empowering members to hit milestones and empowering gym directors to run profitable clubs with precision.
            </p>

            <div className="space-y-2.5">
              {[
                'Personalized daily workout tracking',
                'Interactive monthly attendance heatmaps',
                '1-on-1 certified trainer bookings',
                'Biometric weight & compound strength curves',
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-[#22C55E] shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Demo Logins */}
          <div className="mt-8 pt-6 border-t border-white/10">
            <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Instant 1-Click Demo Logins
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                id="quick-demo-member-btn"
                onClick={() => handleQuickDemo('member')}
                className="px-3 py-2 rounded-xl bg-white/5 hover:bg-[#22C55E]/20 text-slate-200 hover:text-[#22C55E] border border-white/10 hover:border-[#22C55E]/40 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <User className="w-3.5 h-3.5" />
                <span>Member Portal</span>
              </button>
              <button
                type="button"
                id="quick-demo-admin-btn"
                onClick={() => handleQuickDemo('admin')}
                className="px-3 py-2 rounded-xl bg-white/5 hover:bg-emerald-500/20 text-slate-200 hover:text-emerald-400 border border-white/10 hover:border-emerald-500/40 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Admin Portal</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Auth Form */}
        <div className="md:col-span-7 p-8 sm:p-10 flex flex-col justify-center">
          <div className="mb-6">
            <h3 className="text-2xl font-black text-white tracking-tight">
              {isRegister ? 'Create an Account' : 'Welcome Back'}
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              {isRegister
                ? 'Join FitFlow to track your workouts and personal training'
                : 'Enter your credentials to access your fitness center portal'}
            </p>
          </div>

          {/* Role selector */}
          <div className="mb-6">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
              Account Role
            </label>
            <div className="grid grid-cols-2 gap-2 p-1 bg-[#0B1120] rounded-xl border border-white/10">
              <button
                type="button"
                id="auth-role-member"
                onClick={() => setRole('member')}
                className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                  role === 'member'
                    ? 'bg-[#22C55E] text-black shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>Club Member</span>
              </button>
              <button
                type="button"
                id="auth-role-admin"
                onClick={() => setRole('admin')}
                className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                  role === 'admin'
                    ? 'bg-[#22C55E] text-black shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Gym Admin / Staff</span>
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <Input
                label="Full Name"
                placeholder="e.g. Alex Morgan"
                value={name}
                onChange={(e) => setName(e.target.value)}
                error={errors.name}
                leftIcon={<User className="w-4 h-4" />}
              />
            )}

            <Input
              label="Email Address"
              type="email"
              placeholder={role === 'admin' ? 'admin@fitflow.io' : 'alex.morgan@fitflow.io'}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
              leftIcon={<Mail className="w-4 h-4" />}
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
              leftIcon={<Lock className="w-4 h-4" />}
            />

            <Button
              id="auth-submit-btn"
              type="submit"
              variant="primary"
              size="lg"
              className="w-full mt-2"
              isLoading={isLoading}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              {isRegister ? 'Register & Continue' : `Log In as ${role === 'admin' ? 'Admin' : 'Member'}`}
            </Button>
          </form>

          {/* Toggle login vs register */}
          <div className="mt-6 text-center text-xs text-slate-400">
            {isRegister ? (
              <span>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setIsRegister(false)}
                  className="font-bold text-[#22C55E] hover:underline cursor-pointer"
                >
                  Sign in
                </button>
              </span>
            ) : (
              <span>
                Don't have a membership yet?{' '}
                <button
                  type="button"
                  onClick={() => setIsRegister(true)}
                  className="font-bold text-[#22C55E] hover:underline cursor-pointer"
                >
                  Register now
                </button>
              </span>
            )}
          </div>

          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={onBackToLanding}
              className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
            >
              ← Back to public homepage
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
