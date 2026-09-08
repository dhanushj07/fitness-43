import React, { useState, useRef, useEffect } from 'react';
import {
  Menu,
  CalendarCheck,
  Sparkles,
  User,
  Shield,
  Dumbbell,
  Bell,
  CheckCircle2,
  Clock,
  Radio,
  X,
  ArrowRight,
} from 'lucide-react';
import { NavigationTab, User as UserType, AppNotification, UserRole } from '../../types';
import { Button } from '../common/Button';

interface NavbarProps {
  currentTab: NavigationTab;
  onOpenMobile: () => void;
  currentUser: UserType | null;
  onQuickCheckIn: () => void;
  isCheckedInToday: boolean;
  onSwitchRole: (role: UserRole) => void;
  notifications: AppNotification[];
  onMarkNotificationRead: (id: string) => void;
  onMarkAllNotificationsRead: () => void;
  isSocketConnected?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onOpenMobile,
  currentUser,
  onQuickCheckIn,
  isCheckedInToday,
  onSwitchRole,
  notifications,
  onMarkNotificationRead,
  onMarkAllNotificationsRead,
  isSocketConnected = true,
}) => {
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getPageTitle = (tab: NavigationTab): { title: string; subtitle: string } => {
    switch (tab) {
      case 'member-dashboard':
        return { title: 'Member Dashboard', subtitle: `Welcome back, ${currentUser?.name || 'Athlete'}` };
      case 'workout-plans':
        return { title: 'Workout Protocols', subtitle: 'Targeted routines & exercise tracking' };
      case 'attendance':
        return { title: 'Attendance & Calendar', subtitle: 'Check-in log, consistency & streaks' };
      case 'trainer-schedule':
        return { title: 'Personal Trainers', subtitle: 'Book 1-on-1 coaching & assessments' };
      case 'subscriptions':
        return { title: 'Membership & Billing', subtitle: 'Plan management & invoice history' };
      case 'performance':
        return { title: 'Biometric Analytics', subtitle: 'Body composition & progressive strength' };
      case 'trainer-dashboard':
        return { title: 'Coach Dashboard', subtitle: `Welcome back, Coach ${currentUser?.name || 'Trainer'}` };
      case 'trainer-clients':
        return { title: 'Assigned Trainees', subtitle: 'Monitor member routines & biometrics' };
      case 'trainer-workouts':
        return { title: 'Workout Curriculum Builder', subtitle: 'Design exercise sets & rest intervals' };
      case 'admin-dashboard':
        return { title: 'Center Command Center', subtitle: 'Live capacity, revenue & key metrics' };
      case 'admin-members':
        return { title: 'Member Management', subtitle: 'Directory, roster & status oversight' };
      case 'admin-trainers':
        return { title: 'Trainer Management', subtitle: 'Staff assignments, capacity & reviews' };
      case 'admin-plans':
        return { title: 'Membership Tier Config', subtitle: 'Tier pricing, benefits & quotas' };
      case 'admin-workouts':
        return { title: 'Workout Curriculum', subtitle: 'Curate protocols for members' };
      case 'admin-attendance':
        return { title: 'Center Attendance Logs', subtitle: 'Daily turnstile check-in verification' };
      case 'admin-renewals':
        return { title: 'Subscription Renewals', subtitle: 'Expiring memberships & retention' };
      case 'api-docs':
        return { title: 'Enterprise Architecture', subtitle: 'PostgreSQL, Prisma, Redis & Docker Specs' };
      default:
        return { title: 'FitFlow', subtitle: 'Fitness Center Operating System' };
    }
  };

  const { title, subtitle } = getPageTitle(currentTab);
  const currentRole = currentUser?.role || 'member';

  const cycleRole = () => {
    if (currentRole === 'member') onSwitchRole('trainer');
    else if (currentRole === 'trainer') onSwitchRole('admin');
    else onSwitchRole('member');
  };

  return (
    <header
      id="main-navbar"
      className="sticky top-0 z-30 h-16 bg-[#0B1120]/85 backdrop-blur-md border-b border-white/10 px-4 sm:px-6 flex items-center justify-between"
    >
      {/* Left title & mobile hamburger */}
      <div className="flex items-center gap-3">
        <button
          id="mobile-nav-toggle"
          onClick={onOpenMobile}
          className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-base sm:text-lg font-bold text-white tracking-tight leading-tight">
            {title}
          </h1>
          <p className="hidden sm:block text-xs text-slate-400 -mt-0.5">{subtitle}</p>
        </div>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Firebase Connection Status */}
        <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-400 font-medium" title="Firestore Database & Firebase Auth active">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
          <span>Firebase DB</span>
        </div>

        {/* Real-time Socket Connection Status */}
        <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-400 font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>Live Sync</span>
        </div>

        {/* Quick Check-in (for members) */}
        {currentRole === 'member' && (
          <Button
            id="navbar-quick-checkin-btn"
            size="sm"
            variant={isCheckedInToday ? 'secondary' : 'primary'}
            onClick={onQuickCheckIn}
            disabled={isCheckedInToday}
            leftIcon={<CalendarCheck className="w-4 h-4" />}
          >
            {isCheckedInToday ? 'Checked-in' : 'Check-In'}
          </Button>
        )}

        {/* Real-time Notifications Popover */}
        <div className="relative" ref={notifRef}>
          <button
            id="navbar-notifications-btn"
            type="button"
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="p-2 rounded-xl bg-[#0F172A] hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-colors relative cursor-pointer"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#22C55E] text-black font-black text-[10px] flex items-center justify-center shadow-md">
                {unreadCount}
              </span>
            )}
          </button>

          {isNotifOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-[#0F172A] border border-white/10 shadow-2xl z-50 overflow-hidden">
              <div className="p-3.5 border-b border-white/10 flex items-center justify-between bg-[#0B1120]">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-[#22C55E]" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    Real-time Alerts
                  </span>
                  {unreadCount > 0 && (
                    <span className="px-1.5 py-0.5 rounded-full bg-[#22C55E]/20 text-[#22C55E] text-[10px] font-bold">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={onMarkAllNotificationsRead}
                    className="text-[11px] text-slate-400 hover:text-[#22C55E] transition-colors"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-white/5">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-400">
                    No notifications right now
                  </div>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => onMarkNotificationRead(notif.id)}
                      className={`p-3.5 transition-colors cursor-pointer flex items-start gap-3 ${
                        notif.read ? 'bg-transparent opacity-75' : 'bg-white/[0.02] hover:bg-white/[0.04]'
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center ${
                          notif.type === 'attendance'
                            ? 'bg-emerald-500/10 text-emerald-400'
                            : notif.type === 'session'
                            ? 'bg-purple-500/10 text-purple-400'
                            : notif.type === 'workout'
                            ? 'bg-sky-500/10 text-sky-400'
                            : 'bg-amber-500/10 text-amber-400'
                        }`}
                      >
                        {notif.type === 'attendance' ? (
                          <CalendarCheck className="w-4 h-4" />
                        ) : notif.type === 'session' ? (
                          <Clock className="w-4 h-4" />
                        ) : (
                          <Dumbbell className="w-4 h-4" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <h4 className="text-xs font-bold text-white truncate">{notif.title}</h4>
                          <span className="text-[10px] text-slate-500 shrink-0">{notif.timestamp}</span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">{notif.message}</p>
                      </div>
                      {!notif.read && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] shrink-0 mt-1" />
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Role Toggle Button (Member -> Trainer -> Admin) */}
        <button
          id="navbar-toggle-role-btn"
          onClick={cycleRole}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#0F172A] hover:bg-white/5 border border-white/10 text-slate-200 transition-colors cursor-pointer"
          title="Click to cycle role: Member -> Trainer -> Admin"
        >
          {currentRole === 'admin' ? (
            <>
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Role:</span>
              <span className="text-emerald-400 font-bold">Admin</span>
            </>
          ) : currentRole === 'trainer' ? (
            <>
              <Dumbbell className="w-3.5 h-3.5 text-purple-400" />
              <span className="hidden sm:inline">Role:</span>
              <span className="text-purple-400 font-bold">Trainer</span>
            </>
          ) : (
            <>
              <User className="w-3.5 h-3.5 text-sky-400" />
              <span className="hidden sm:inline">Role:</span>
              <span className="text-sky-400 font-bold">Member</span>
            </>
          )}
          <Sparkles className="w-3 h-3 text-slate-500" />
        </button>
      </div>
    </header>
  );
};
