import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Compass, ChatCircle, User, Flame } from '@phosphor-icons/react';
import useAppStore from '@store/useAppStore';

const NAV = [
  { path: '/discover', label: 'Discover', icon: Flame },
  { path: '/explore', label: 'Explore', icon: Compass },
  { path: '/matches', label: 'Chats', icon: ChatCircle },
  { path: '/profile', label: 'Profile', icon: User },
];

export default function BottomNav({ unread = 0, streak = 0 }) {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;

  return (
    <>
      {/* ── MOBILE: floating bottom bar (hidden on lg+) ── */}
      <nav className="lg:hidden pointer-events-none absolute inset-x-0 bottom-0 z-40 mx-auto flex w-full justify-center pb-[max(env(safe-area-inset-bottom),0.75rem)]">
        <div className="pointer-events-auto flex w-full max-w-md items-center justify-around rounded-3xl border border-gray-200/70 bg-background/95 px-2 py-2 shadow-2xl shadow-foreground/10 backdrop-blur-xl dark:border-gray-700">
          {NAV.map((n) => {
            const active = currentPath.startsWith(n.path);
            const Icon = n.icon;
            return (
              <button
                key={n.path}
                onClick={() => navigate(n.path)}
                className="relative flex flex-col items-center gap-0.5 px-4 py-1 transition active:scale-90"
                aria-label={n.label}
              >
                <span className="relative">
                  <Icon size={22} weight={active ? 'fill' : 'regular'} className={active ? 'text-primary' : 'text-gray-500 dark:text-gray-400'} />
                  {n.path === '/matches' && unread > 0 && (
                    <span className="absolute -right-2 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-primary px-1 text-[9px] font-bold text-white">
                      {unread}
                    </span>
                  )}
                </span>
                {active && (
                  <motion.span
                    layoutId="nav-dot"
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    className="h-1 w-1 rounded-full bg-primary"
                  />
                )}
                <span className={`text-[10px] font-semibold ${active ? 'text-primary' : 'text-gray-500 dark:text-gray-400'}`}>{n.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* ── DESKTOP: fixed left sidebar (hidden on mobile) ── */}
      <aside className="hidden lg:flex fixed left-0 top-0 h-full w-64 flex-col border-r border-gray-200/70 bg-background/95 backdrop-blur-xl dark:border-gray-800 dark:bg-onyx/95 z-40 shadow-xl">
        {/* Brand */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-100 dark:border-gray-800">
          <div className="h-10 w-10 overflow-hidden rounded-2xl shadow-md">
            <img src="/logo-symbol.png" alt="Dinanwuye" className="h-full w-full object-contain" />
          </div>
          <div>
            <p className="text-base font-black tracking-tight text-foreground">Dinanwuye</p>
            <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest">Find Your Other Half</p>
          </div>
        </div>

        {/* Nav items */}
        <nav className="flex flex-col gap-1 px-3 py-4 flex-1">
          {NAV.map((n) => {
            const active = currentPath.startsWith(n.path);
            const Icon = n.icon;
            return (
              <button
                key={n.path}
                onClick={() => navigate(n.path)}
                className={`relative flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition-all active:scale-[0.98] ${
                  active
                    ? 'bg-primary/10 text-primary dark:bg-primary/15'
                    : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
                }`}
                aria-label={n.label}
              >
                {active && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-full bg-primary"
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
                <span className="relative">
                  <Icon size={20} weight={active ? 'fill' : 'regular'} />
                  {n.path === '/matches' && unread > 0 && (
                    <span className="absolute -right-2 -top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-primary px-1 text-[9px] font-bold text-white">
                      {unread}
                    </span>
                  )}
                </span>
                {n.label}
              </button>
            );
          })}
        </nav>

        {/* Streak badge at bottom */}
        {streak > 0 && (
          <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-2 rounded-2xl bg-secondary/10 px-3 py-2.5">
              <span className="grid h-5 w-5 place-items-center rounded-full bg-gradient-to-tr from-primary to-secondary text-[10px] font-black text-white shadow-sm">
                {streak}
              </span>
              <span className="text-xs font-bold text-secondary dark:text-blue-300">day streak 🔥</span>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
