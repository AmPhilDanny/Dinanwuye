import React from 'react';
import { motion } from 'framer-motion';
import { Bell, SlidersHorizontal, Sun, Moon } from '@phosphor-icons/react';
import { useNavigate } from 'react-router-dom';
import { BRAND } from '@utils/constants';

export default function HeaderNav({ activeTab, unread, streak, dark, onToggleTheme, onOpenFilters }) {
  const navigate = useNavigate();
  const titles = {
    discover: "Discovery",
    explore: "Explore",
    chats: "Matches & Chat",
    profile: "Your Profile",
  };

  return (
    <header className="sticky top-0 z-30 border-b border-gray-200/70 bg-surface/90 backdrop-blur-xl dark:border-gray-800 dark:bg-onyx/90">
      <div className="mx-auto flex h-14 w-full max-w-md items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-xl bg-gradient-to-br from-primary to-secondary text-sm font-black text-white shadow-md">
            D
          </span>
          <div className="leading-tight">
            <p className="text-[11px] font-bold tracking-[0.18em] text-foreground">{BRAND}</p>
            <p className="text-[10px] font-semibold text-gray-500 dark:text-gray-400">{titles[activeTab] || titles.discover}</p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={onToggleTheme}
            aria-label="Toggle theme"
            className="grid h-9 w-9 place-items-center rounded-full text-gray-500 transition hover:bg-gray-200 active:scale-95 dark:text-gray-400 dark:hover:bg-gray-800"
          >
            {dark ? <Sun size={18} weight="bold" /> : <Moon size={18} weight="bold" />}
          </button>
          {activeTab === 'discover' && (
            <button
              onClick={onOpenFilters}
              aria-label="Open filters"
              className="grid h-9 w-9 place-items-center rounded-full text-gray-500 transition hover:bg-gray-200 active:scale-95 dark:text-gray-400 dark:hover:bg-gray-800"
            >
              <SlidersHorizontal size={18} weight="bold" />
            </button>
          )}
          <button
            onClick={() => navigate('/matches')}
            aria-label="Notifications"
            className="relative grid h-9 w-9 place-items-center rounded-full text-gray-500 transition hover:bg-gray-200 active:scale-95 dark:text-gray-400 dark:hover:bg-gray-800"
          >
            <Bell size={18} weight="bold" />
            {unread > 0 && (
              <span className="absolute right-1 top-1 grid h-4 min-w-4 place-items-center rounded-full bg-primary px-1 text-[9px] font-bold text-white">
                {unread}
              </span>
            )}
          </button>
          <div className="ml-1 flex items-center gap-1 rounded-full bg-secondary-light px-2.5 py-1.5">
            <span className="grid h-4 w-4 place-items-center rounded-full bg-gradient-to-tr from-primary to-secondary text-[9px] font-black text-white shadow-sm">
              {streak}
            </span>
            <span className="text-[10px] font-bold text-secondary dark:text-blue-300">streak</span>
          </div>
        </div>
      </div>
    </header>
  );
}
