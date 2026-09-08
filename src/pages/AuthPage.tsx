import React, { useState } from 'react';
import {
  Mail,
  Lock,
  User,
  Shield,
  ArrowRight,
  Activity,
  CheckCircle2,
  Dumbbell,
  HelpCircle,
  ExternalLink,
  Key,
  Globe,
  AlertCircle,
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Modal } from '../components/common/Modal';
import { UserRole, User as AppUser } from '../types';
import { signInWithGoogleFirebase } from '../services/firebase';

interface AuthPageProps {
  onLogin: (role: UserRole, email: string, user?: AppUser) => void;
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
  const [authError, setAuthError] = useState<string | null>(null);

  // Modals
  const [isGoogleOAuthModalOpen, setIsGoogleOAuthModalOpen] = useState(false);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);

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
      if (demoRole === 'admin') {
        onLogin('admin', 'admin@fitflow.io');
      } else if (demoRole === 'trainer') {
        onLogin('trainer', 'marcus.vance@fitflow.io');
      } else {
        onLogin('member', 'dhanushj2007@gmail.com');
      }
    }, 250);
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setAuthError(null);
    try {
      const { user } = await signInWithGoogleFirebase(role);
      setIsLoading(false);
      onLogin(user.role, user.email, user);
    } catch (err: any) {
      setIsLoading(false);
      if (err?.code === 'auth/popup-closed-by-user' || err?.code === 'auth/cancelled-popup-request') {
        return;
      }
      console.warn('Firebase popup attempt:', err);
      // Fallback modal with details and 1-click option
      setIsGoogleOAuthModalOpen(true);
    }
  };

  const handleSimulateGoogleLogin = () => {
    setIsGoogleOAuthModalOpen(false);
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLogin('member', 'dhanushj2007@gmail.com');
    }, 400);
  };

  const handleSendResetLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail) return;
    setResetSent(true);
    setTimeout(() => {
      setResetSent(false);
      setIsForgotPasswordOpen(false);
      setResetEmail('');
    }, 2500);
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
              Your Fitness. Your Progress. Your Future.
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed mb-6">
              Complete fitness center operating system powering member tracking, trainer calendars, floor check-ins, and club recurring revenue.
            </p>

            <div className="space-y-2.5">
              {[
                'Interactive workouts & exercise sets/reps',
                'Real-time turnstile attendance with Socket.IO',
                '1-on-1 coach booking & schedule management',
                'PostgreSQL relational schema & Redis caching',
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-[#22C55E] shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Demo Logins for 3 Roles */}
          <div className="mt-8 pt-6 border-t border-white/10">
            <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Instant 1-Click Role Testing
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                id="quick-demo-member-btn"
                onClick={() => handleQuickDemo('member')}
                className="px-2.5 py-2 rounded-xl bg-white/5 hover:bg-[#22C55E]/20 text-slate-200 hover:text-[#22C55E] border border-white/10 hover:border-[#22C55E]/40 text-xs font-semibold flex flex-col items-center justify-center gap-1 transition-all cursor-pointer"
              >
                <User className="w-4 h-4 text-[#22C55E]" />
                <span className="text-[11px]">Member</span>
              </button>
              <button
                type="button"
                id="quick-demo-trainer-btn"
                onClick={() => handleQuickDemo('trainer')}
                className="px-2.5 py-2 rounded-xl bg-white/5 hover:bg-purple-500/20 text-slate-200 hover:text-purple-400 border border-white/10 hover:border-purple-500/40 text-xs font-semibold flex flex-col items-center justify-center gap-1 transition-all cursor-pointer"
              >
                <Dumbbell className="w-4 h-4 text-purple-400" />
                <span className="text-[11px]">Trainer</span>
              </button>
              <button
                type="button"
                id="quick-demo-admin-btn"
                onClick={() => handleQuickDemo('admin')}
                className="px-2.5 py-2 rounded-xl bg-white/5 hover:bg-emerald-500/20 text-slate-200 hover:text-emerald-400 border border-white/10 hover:border-emerald-500/40 text-xs font-semibold flex flex-col items-center justify-center gap-1 transition-all cursor-pointer"
              >
                <Shield className="w-4 h-4 text-emerald-400" />
                <span className="text-[11px]">Admin</span>
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
                : 'Enter your credentials or authenticate via Google OAuth'}
            </p>
          </div>

          {/* Continue with Google Button */}
          <div className="mb-5">
            <button
              type="button"
              id="google-signin-btn"
              onClick={handleGoogleSignIn}
              className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs flex items-center justify-center gap-3 transition-all shadow-md cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            <div className="flex items-center gap-3 my-4">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                Or continue with email
              </span>
              <div className="flex-1 h-px bg-white/10" />
            </div>
          </div>

          {/* Role selector */}
          <div className="mb-5">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
              Select Role
            </label>
            <div className="grid grid-cols-3 gap-1.5 p-1 bg-[#0B1120] rounded-xl border border-white/10">
              <button
                type="button"
                id="auth-role-member"
                onClick={() => setRole('member')}
                className={`py-2 px-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                  role === 'member'
                    ? 'bg-[#22C55E] text-black shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>Member</span>
              </button>
              <button
                type="button"
                id="auth-role-trainer"
                onClick={() => setRole('trainer')}
                className={`py-2 px-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                  role === 'trainer'
                    ? 'bg-[#22C55E] text-black shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Dumbbell className="w-3.5 h-3.5" />
                <span>Trainer</span>
              </button>
              <button
                type="button"
                id="auth-role-admin"
                onClick={() => setRole('admin')}
                className={`py-2 px-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                  role === 'admin'
                    ? 'bg-[#22C55E] text-black shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Admin</span>
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <Input
                label="Full Name"
                placeholder={role === 'trainer' ? 'e.g. Marcus Vance' : 'e.g. Dhanush'}
                value={name}
                onChange={(e) => setName(e.target.value)}
                error={errors.name}
                leftIcon={<User className="w-4 h-4" />}
              />
            )}

            <Input
              label="Email Address"
              type="email"
              placeholder={
                role === 'admin'
                  ? 'admin@fitflow.io'
                  : role === 'trainer'
                  ? 'marcus.vance@fitflow.io'
                  : 'dhanushj2007@gmail.com'
              }
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
              leftIcon={<Mail className="w-4 h-4" />}
            />

            <div>
              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={errors.password}
                leftIcon={<Lock className="w-4 h-4" />}
              />
              {!isRegister && (
                <div className="flex justify-end mt-1">
                  <button
                    type="button"
                    onClick={() => setIsForgotPasswordOpen(true)}
                    className="text-[11px] text-slate-400 hover:text-[#22C55E] transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>
              )}
            </div>

            <Button
              id="auth-submit-btn"
              type="submit"
              variant="primary"
              size="lg"
              className="w-full mt-2"
              isLoading={isLoading}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              {isRegister
                ? 'Register & Continue'
                : `Log In as ${role === 'admin' ? 'Admin' : role === 'trainer' ? 'Coach' : 'Member'}`}
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

      {/* Google OAuth Configuration Guide Modal */}
      <Modal
        isOpen={isGoogleOAuthModalOpen}
        onClose={() => setIsGoogleOAuthModalOpen(false)}
        title="Google OAuth 2.0 Integration Setup"
      >
        <div className="space-y-4">
          <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="text-xs text-slate-200 leading-relaxed">
              <strong className="text-white font-bold block mb-1">Google Credentials Required</strong>
              To activate live Google Sign-In with real accounts, configure your OAuth Client credentials in your environment variables.
            </div>
          </div>

          <div className="space-y-3 text-xs text-slate-300">
            <div className="font-semibold text-white">Google Cloud Console Steps:</div>
            <ol className="list-decimal pl-4 space-y-2 leading-relaxed">
              <li>
                Open <span className="text-sky-400 font-mono">console.cloud.google.com/apis/credentials</span>
              </li>
              <li>
                Create an <strong>OAuth 2.0 Client ID</strong> (Web application).
              </li>
              <li>
                Add Authorized JavaScript Origins:
                <div className="mt-1 p-2 rounded-lg bg-[#0B1120] font-mono text-emerald-400">
                  http://localhost:3000
                </div>
              </li>
              <li>
                Add Authorized Redirect URI:
                <div className="mt-1 p-2 rounded-lg bg-[#0B1120] font-mono text-emerald-400">
                  http://localhost:3000/api/auth/google/callback
                </div>
              </li>
              <li>
                Add to your <span className="font-mono text-white">.env.example</span> / <span className="font-mono text-white">.env</span>:
                <pre className="mt-1 p-2.5 rounded-lg bg-[#0B1120] font-mono text-slate-300 overflow-x-auto">
{`GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
VITE_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com`}
                </pre>
              </li>
            </ol>
          </div>

          <div className="pt-2 flex justify-between items-center border-t border-white/5">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsGoogleOAuthModalOpen(false)}
            >
              Close
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleSimulateGoogleLogin}
            >
              Simulate Google Sign-In (Dhanush)
            </Button>
          </div>
        </div>
      </Modal>

      {/* Forgot Password Modal */}
      <Modal
        isOpen={isForgotPasswordOpen}
        onClose={() => setIsForgotPasswordOpen(false)}
        title="Reset Account Password"
      >
        <form onSubmit={handleSendResetLink} className="space-y-4">
          <p className="text-xs text-slate-300">
            Enter your email address and we'll send you an encrypted password recovery link.
          </p>

          {resetSent ? (
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Password reset link sent! Check your inbox.</span>
            </div>
          ) : (
            <Input
              label="Email Address"
              type="email"
              placeholder="e.g. dhanushj2007@gmail.com"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              required
              leftIcon={<Mail className="w-4 h-4" />}
            />
          )}

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsForgotPasswordOpen(false)}
            >
              Cancel
            </Button>
            {!resetSent && (
              <Button type="submit" variant="primary" size="sm">
                Send Recovery Link
              </Button>
            )}
          </div>
        </form>
      </Modal>
    </div>
  );
};
