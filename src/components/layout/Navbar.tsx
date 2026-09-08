import React from 'react';
import { Menu, CalendarCheck, Sparkles, User, Shield } from 'lucide-react';
import { NavigationTab, User as UserType } from '../../types';
import { Button } from '../common/Button';

interface NavbarProps {
  currentTab: NavigationTab;
  onOpenMobile: () => void;
  currentUser: UserType | null;
  onQuickCheckIn: () => void;
  isCheckedInToday: boolean;
  onToggleRole: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onOpenMobile,
  currentUser,
  onQuickCheckIn,
  isCheckedInToday,
  onToggleRole,
}) => {
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
        return { title: 'Center Attendance Logs', subtitle: 'Daily check-in verification' };
      case 'admin-renewals':
        return { title: 'Subscription Renewals', subtitle: 'Expiring memberships & retention' };
      case 'api-docs':
        return { title: 'Architecture & REST Specs', subtitle: 'PostgreSQL, Redis, Express & Docker' };
      default:
        return { title: 'FitFlow', subtitle: 'Fitness Center Operating System' };
    }
  };

  const { title, subtitle } = getPageTitle(currentTab);
  const isAdmin = currentUser?.role === 'admin';

  return (
    <header
      id="main-navbar"
      className="sticky top-0 z-30 h-16 bg-[#0B1120]/80 backdrop-blur-md border-b border-white/10 px-4 sm:px-6 flex items-center justify-between"
    >
      {/* Left title & hamburger */}
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
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick Check-in (for members) */}
        {!isAdmin && (
          <Button
            id="navbar-quick-checkin-btn"
            size="sm"
            variant={isCheckedInToday ? 'secondary' : 'primary'}
            onClick={onQuickCheckIn}
            disabled={isCheckedInToday}
            leftIcon={<CalendarCheck className="w-4 h-4" />}
          >
            {isCheckedInToday ? 'Checked-in Today' : 'Gym Check-In'}
          </Button>
        )}

        {/* Role Switch Button */}
        <button
          id="navbar-toggle-role-btn"
          onClick={onToggleRole}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#0F172A] hover:bg-white/5 border border-white/10 text-slate-200 transition-colors cursor-pointer"
          title="Switch between Member and Admin view"
        >
          {isAdmin ? (
            <>
              <Shield className="w-3.5 h-3.5 text-[#22C55E]" />
              <span className="hidden md:inline">Mode:</span>
              <span className="text-[#22C55E]">Admin</span>
            </>
          ) : (
            <>
              <User className="w-3.5 h-3.5 text-sky-400" />
              <span className="hidden md:inline">Mode:</span>
              <span className="text-sky-400">Member</span>
            </>
          )}
          <Sparkles className="w-3 h-3 text-slate-500" />
        </button>
      </div>
    </header>
  );
};
