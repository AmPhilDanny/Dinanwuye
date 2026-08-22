import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Compass, ChatCircle, User, Flame } from '@phosphor-icons/react';
import useAppStore from '@store/useAppStore';

const NAV = [
  { path: '/discover', label: 'Discover', icon: Flame },
  { path: '/explore', label: 'Explore', icon: Compass },
  { path: '/matches', label: 'Chats', icon: ChatCircle },
  { path: '/profile', label: 'Profile', icon: User },
];

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  // We can hook this up to actual unread count later, for now mock it to show the UI
  const unread = 2; 

  // Hide on certain routes if needed, or if rendered at app level.
  // Since we are likely placing this in specific pages, we'll check the path
  const currentPath = location.pathname;

  return (
    <nav className="pointer-events-none absolute inset-x-0 bottom-0 z-40 mx-auto flex w-full justify-center pb-[max(env(safe-area-inset-bottom),0.75rem)]">
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
                <Icon size={22} weight={active ? "fill" : "regular"} className={active ? "text-primary" : "text-gray-400 dark:text-gray-500"} />
                {n.path === "/matches" && unread > 0 && (
                  <span className="absolute -right-2 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-primary px-1 text-[9px] font-bold text-white">
                    {unread}
                  </span>
                )}
              </span>
              {active && (
                <motion.span
                  layoutId="nav-dot"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  className="h-1 w-1 rounded-full bg-primary"
                />
              )}
              <span className={`text-[10px] font-semibold ${active ? "text-primary" : "text-gray-400 dark:text-gray-500"}`}>{n.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
