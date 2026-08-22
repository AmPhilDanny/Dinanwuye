import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, ShieldStar, Moon, Camera, Check, X, MapPin, PencilSimple } from '@phosphor-icons/react';

const VALUE_OPTIONS = ["Family", "Ambition", "Faith", "Creativity", "Growth", "Community", "Freedom", "Service"];
const INTENTIONS = ["Marriage / Life Partner", "Serious Dating", "Meaningful Connection"];

export default function ProfileAndSettings({ user, onChange }) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user.name);
  const [bio, setBio] = useState(user.bio);

  const toggleValue = (v) => {
    const has = (user.values || []).includes(v);
    if (onChange) onChange({ ...user, values: has ? user.values.filter((x) => x !== v) : [...(user.values || []), v] });
  };

  const toggleIncognito = () => {
    if (onChange) onChange({ ...user, incognito: !user.incognito });
  };

  const save = () => {
    if (onChange) onChange({ ...user, name, bio });
    setEditing(false);
  };

  return (
    <div className="mx-auto w-full max-w-md px-4 pb-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-extrabold text-foreground">Your Profile</h2>
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Edit how you show up to intentional matches</p>
        </div>
        <button
          onClick={() => (editing ? save() : setEditing(true))}
          className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-primary to-secondary px-4 py-2 text-xs font-bold text-white shadow-md shadow-primary/25 transition active:scale-95"
        >
          {editing ? <Check size={14} weight="bold" /> : <PencilSimple size={14} weight="bold" />}
          {editing ? "Save" : "Edit"}
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-4 overflow-hidden rounded-3xl bg-foreground/5 shadow-sm"
      >
        <div className="relative h-44">
          <img src={user.photo || user.photo_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&size=600`} alt={user.name} className="h-full w-full object-cover" />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-onyx/90 to-transparent p-4 text-white">
            {editing ? (
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg bg-white/20 px-2 py-1 text-lg font-extrabold text-white outline-none backdrop-blur focus:bg-white/30"
              />
            ) : (
              <h3 className="text-xl font-extrabold tracking-tight drop-shadow-sm">{user.name}, {user.age}</h3>
            )}
            <p className="flex items-center gap-1 text-sm text-white/90">
              <MapPin size={13} weight="fill" />{user.city || user.location}, {user.country || 'Nigeria'} · {user.job || 'Professional'}
            </p>
          </div>
          <button className="absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-full bg-white/25 text-white backdrop-blur-sm transition active:scale-90" aria-label="Change photo">
            <Camera size={16} weight="bold" />
          </button>
        </div>

        <div className="flex items-center justify-between px-4 py-3">
          <span className="flex items-center gap-1.5 text-sm font-bold text-sky-600 dark:text-sky-400">
            <ShieldCheck size={16} weight="fill" /> ID Verified
          </span>
          <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-1 text-xs font-bold text-emerald-700 dark:text-emerald-400">
            <ShieldStar size={14} weight="fill" /> Trust {user.trustScore || 100}
          </span>
        </div>

        <div className="px-4 pb-4">
          {editing ? (
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full rounded-2xl border border-gray-200 bg-background p-3 text-sm text-foreground outline-none focus:border-primary dark:border-gray-600"
              rows={3}
            />
          ) : (
            <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">{user.bio || 'Add a bio to let matches know more about you.'}</p>
          )}
        </div>
      </motion.div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-3xl border border-gray-200 bg-background p-4 dark:border-gray-700">
          <p className="mb-2 text-xs font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400">Intention</p>
          <motion.div layout className="flex flex-col gap-1">
            {INTENTIONS.map((int) => (
              <button
                key={int}
                onClick={() => onChange && onChange({ ...user, intention: int })}
                className={`flex items-center justify-between rounded-xl px-2.5 py-2 text-left text-xs font-semibold transition active:scale-95 ${
                  user.intention === int ? "bg-primary text-white shadow-sm" : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                }`}
              >
                {int}
                {user.intention === int && <Check size={12} weight="bold" />}
              </button>
            ))}
          </motion.div>
        </div>

        <div className="rounded-3xl border border-gray-200 bg-background p-4 dark:border-gray-700">
          <p className="mb-2 text-xs font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400">Cultural values</p>
          <div className="flex flex-wrap gap-1.5">
            {VALUE_OPTIONS.map((v) => {
              const has = (user.values || []).includes(v);
              return (
                <button
                  key={v}
                  onClick={() => toggleValue(v)}
                  className={`rounded-full px-2.5 py-1 text-[11px] font-bold transition active:scale-95 ${
                    has ? "bg-secondary text-white shadow-sm" : "border border-gray-200 bg-background text-gray-700 hover:border-secondary/40 dark:border-gray-600 dark:text-gray-300"
                  }`}
                >
                  {v}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mt-4 rounded-3xl border border-gray-200 bg-background p-4 dark:border-gray-700">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <p className="flex items-center gap-1.5 text-sm font-bold text-foreground">
              <Moon size={16} weight="fill" className="text-violet-500" /> Incognito mode
            </p>
            <p className="text-[11px] font-medium text-gray-500 dark:text-gray-400">Hide your profile from people you pass</p>
          </div>
          <button
            onClick={toggleIncognito}
            aria-label="Toggle incognito"
            className={`relative h-7 w-12 rounded-full transition ${user.incognito ? "bg-primary" : "bg-gray-300 dark:bg-gray-600"}`}
          >
            <motion.span
              layout
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow ${user.incognito ? "right-1" : "left-1"}`}
            />
          </button>
        </div>
        <div className="flex items-center gap-2 rounded-2xl bg-emerald-500/10 p-3 text-emerald-700 dark:text-emerald-400">
          <ShieldCheck size={18} weight="fill" />
          <p className="text-xs font-semibold">You&apos;ve pledged the community safety guidelines. Report anything that feels off, we take it seriously.</p>
        </div>
      </div>
    </div>
  );
}
