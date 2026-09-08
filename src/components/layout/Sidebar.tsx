import React from 'react';
import {
  LayoutDashboard,
  Dumbbell,
  CalendarCheck,
  UserCheck,
  CreditCard,
  LineChart,
  Users,
  ShieldCheck,
  Layers,
  Clock,
  RefreshCw,
  LogOut,
  Sparkles,
  Terminal,
  Activity,
} from 'lucide-react';
import { NavigationTab, User } from '../../types';

interface SidebarProps {
  currentTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  currentUser: User | null;
  onLogout: () => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  currentUser,
  onLogout,
  isMobileOpen,
  onCloseMobile,
}) => {
  const isAdmin = currentUser?.role === 'admin';

  const memberNavItems: { tab: NavigationTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    { tab: 'member-dashboard', label: 'Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
    { tab: 'workout-plans', label: 'Workout Plans', icon: <Dumbbell className="w-4 h-4" /> },
    { tab: 'attendance', label: 'Attendance & Check-in', icon: <CalendarCheck className="w-4 h-4" /> },
    { tab: 'trainer-schedule', label: 'Trainer Sessions', icon: <UserCheck className="w-4 h-4" /> },
    { tab: 'subscriptions', label: 'Plans & Payments', icon: <CreditCard className="w-4 h-4" /> },
    { tab: 'performance', label: 'Performance Analytics', icon: <LineChart className="w-4 h-4" /> },
  ];

  const adminNavItems: { tab: NavigationTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    { tab: 'admin-dashboard', label: 'Admin Metrics', icon: <ShieldCheck className="w-4 h-4" /> },
    { tab: 'admin-members', label: 'Member Directory', icon: <Users className="w-4 h-4" /> },
    { tab: 'admin-trainers', label: 'Trainers Staff', icon: <UserCheck className="w-4 h-4" /> },
    { tab: 'admin-plans', label: 'Membership Tiers', icon: <Layers className="w-4 h-4" /> },
    { tab: 'admin-workouts', label: 'Workout Protocols', icon: <Dumbbell className="w-4 h-4" /> },
    { tab: 'admin-attendance', label: 'Daily Attendance Log', icon: <Clock className="w-4 h-4" /> },
    { tab: 'admin-renewals', label: 'Renewals & Invoices', icon: <RefreshCw className="w-4 h-4" /> },
  ];

  const handleNav = (tab: NavigationTab) => {
    onSelectTab(tab);
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        id="main-sidebar"
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-[#0B1120] border-r border-white/10 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-5 border-b border-white/10 flex items-center justify-between">
          <div
            onClick={() => handleNav('landing')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-[#22C55E] flex items-center justify-center text-black font-black shadow-[0_0_15px_rgba(34,197,94,0.4)] group-hover:scale-105 transition-transform">
              <Activity className="w-5 h-5 text-black stroke-[2.5]" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-white font-['Outfit',sans-serif]">
                Fit<span className="text-[#22C55E]">Flow</span>
              </span>
              <span className="block text-[10px] text-slate-400 font-medium uppercase tracking-widest -mt-1">
                Fitness OS
              </span>
            </div>
          </div>
          {isAdmin && (
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold uppercase tracking-wider">
              Admin
            </span>
          )}
        </div>

        {/* User Card */}
        {currentUser && (
          <div className="p-4 mx-3 my-3 rounded-xl bg-[#0F172A] border border-white/5 flex items-center gap-3">
            <img
              src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'}
              alt={currentUser.name}
              className="w-10 h-10 rounded-lg object-cover border border-white/10"
            />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-white truncate">{currentUser.name}</p>
              <p className="text-xs text-slate-400 truncate capitalize">{currentUser.role} Account</p>
            </div>
          </div>
        )}

        {/* Navigation links */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-6">
          {/* Main Role Section */}
          <div>
            <div className="px-3 mb-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              {isAdmin ? 'Administration' : 'Member Portal'}
            </div>
            <nav className="space-y-1">
              {(isAdmin ? adminNavItems : memberNavItems).map(item => {
                const isActive = currentTab === item.tab;
                return (
                  <button
                    key={item.tab}
                    id={`nav-${item.tab}`}
                    onClick={() => handleNav(item.tab)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-[#22C55E]/15 text-[#22C55E] border border-[#22C55E]/30 font-semibold shadow-[0_0_15px_rgba(34,197,94,0.1)]'
                        : 'text-slate-300 hover:bg-white/5 hover:text-white border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={isActive ? 'text-[#22C55E]' : 'text-slate-400'}>
                        {item.icon}
                      </span>
                      <span>{item.label}</span>
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Quick Switch View (Demo Helper) */}
          <div>
            <div className="px-3 mb-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Role Perspective
            </div>
            <div className="grid grid-cols-2 gap-1.5 p-1 bg-[#0D1527] rounded-xl border border-white/5">
              <button
                id="sidebar-role-member"
                onClick={() => {
                  onSelectTab('member-dashboard');
                }}
                className={`py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  !isAdmin
                    ? 'bg-[#22C55E] text-black shadow-sm font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Member
              </button>
              <button
                id="sidebar-role-admin"
                onClick={() => {
                  onSelectTab('admin-dashboard');
                }}
                className={`py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  isAdmin
                    ? 'bg-[#22C55E] text-black shadow-sm font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Admin
              </button>
            </div>
          </div>

          {/* System & API Specs */}
          <div>
            <div className="px-3 mb-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Developer & Specs
            </div>
            <button
              id="nav-api-docs"
              onClick={() => handleNav('api-docs')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                currentTab === 'api-docs'
                  ? 'bg-sky-500/15 text-sky-400 border border-sky-500/30'
                  : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Terminal className="w-4 h-4 text-sky-400" />
                <span>API & PostgreSQL Schema</span>
              </div>
              <Sparkles className="w-3 h-3 text-sky-400" />
            </button>
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-3 border-t border-white/10 space-y-1">
          <button
            id="sidebar-logout"
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-3 py-2 text-xs font-medium text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out / Landing</span>
          </button>
        </div>
      </aside>
    </>
  );
};
