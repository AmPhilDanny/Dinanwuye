import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PaperPlaneRight, Sparkle, ArrowsClockwise, Flame, CheckCircle, MapPin } from '@phosphor-icons/react';
import { DATE_VENUES } from '@utils/constants';
import { photoUrl } from '@utils/photoUrl';

const DEFAULT_ICEBREAKERS = [
  "Hey! I noticed we both swiped right — what caught your eye?",
  "Your profile really stands out. What are you looking for here?",
  "I love your energy! What's been the highlight of your week?",
  "We seem to have a lot in common. What's your story?",
];

const generateIcebreakers = (profile) => {
  if (!profile) return DEFAULT_ICEBREAKERS;

  const icebreakers = [];
  const name = profile.name?.split(' ')[0] || 'there';

  if (profile.interests?.length > 0) {
    const interest = profile.interests[Math.floor(Math.random() * profile.interests.length)];
    icebreakers.push(`${name}, I see you're into ${interest}! What got you started with that?`);
  }

  if (profile.intention) {
    icebreakers.push(`I see you're here for ${profile.intention.toLowerCase()} — me too! What's your ideal first date?`);
  }

  if (profile.bio) {
    icebreakers.push(`Your bio caught my attention! Tell me more about yourself.`);
  }

  if (profile.locationName) {
    icebreakers.push(`Fellow ${profile.locationName} local here! What's your favorite spot in the city?`);
  }

  while (icebreakers.length < 4) {
    const fallback = DEFAULT_ICEBREAKERS[icebreakers.length % DEFAULT_ICEBREAKERS.length];
    if (!icebreakers.includes(fallback)) {
      icebreakers.push(fallback);
    } else {
      icebreakers.push(`Hey ${name}! What's something you're passionate about?`);
    }
  }

  return icebreakers.slice(0, 4);
};

export default function ChatAndDates({ matches, profiles, onSend }) {
  const [selectedId, setSelectedId] = useState(matches && matches[0] ? matches[0].id : null);
  const [draft, setDraft] = useState('');
  const [dateIdeas, setDateIdeas] = useState(false);
  const active = matches?.find((m) => m.id === selectedId);

  const profileOf = (m) => profiles?.find((p) => (p.id || p.user_id) === m.profileId);
  const activeProfile = active ? profileOf(active) : null;
  const icebreakers = generateIcebreakers(activeProfile);

  const handleSend = () => {
    if (!active || !draft.trim()) return;
    if (onSend) onSend(active.id, draft.trim());
    setDraft('');
  };

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-4 px-4 pb-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="flex items-center gap-1.5 text-lg font-extrabold text-foreground">
            <Flame size={18} weight="fill" className="text-primary" /> Matches & Chat
          </h2>
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400">{(matches || []).length} active matches, keep the streak alive</p>
        </div>
      </div>

      <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-1 [scrollbar-width:none]">
        {(matches || []).map((m) => {
          const p = profileOf(m);
          if (!p) return null;
          const imgSrc = photoUrl(p.photo || p.photo_url) || `https://ui-avatars.com/api/?name=${encodeURIComponent(p.name)}&size=600&background=random`;
          return (
            <button
              key={m.id}
              onClick={() => setSelectedId(m.id)}
              className={`flex shrink-0 items-center gap-2 rounded-full border p-1.5 pr-3 transition active:scale-95 ${
                selectedId === m.id
                  ? "border-primary bg-primary/10"
                  : "border-gray-200 bg-background hover:border-primary/40 dark:border-gray-600"
              }`}
            >
              <span className="relative">
                <img src={imgSrc} alt={p.name} className={"h-10 w-10 rounded-full object-cover ring-2 ring-offset-1 ring-offset-background " + (selectedId === m.id ? "ring-primary" : "ring-transparent")} />
                <span className="absolute -right-0.5 -bottom-0.5 grid h-4 w-4 place-items-center rounded-full bg-secondary text-[9px] font-black text-white shadow-sm">
                  {m.streak}
                </span>
              </span>
              <span className="text-left leading-tight">
                <span className="block text-sm font-bold text-foreground">{p.name}</span>
                <span className="block text-[10px] font-medium text-gray-500 dark:text-gray-400">{m.lastActive}</span>
              </span>
              {m.unread > 0 && (
                <span className="grid h-4 min-w-4 place-items-center rounded-full bg-primary px-1 text-[9px] font-bold text-white shadow-sm">
                  {m.unread}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="flex justify-end">
        <button
          onClick={() => setDateIdeas((v) => !v)}
          className="flex items-center gap-1.5 rounded-full bg-secondary-light px-3 py-2 text-xs font-bold text-secondary transition active:scale-95 dark:text-blue-300"
        >
          <Sparkle size={14} weight="fill" /> {dateIdeas ? "Hide date ideas" : "Date ideas"}
        </button>
      </div>

      <AnimatePresence>
        {dateIdeas && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-2 [scrollbar-width:none]">
              {DATE_VENUES.map((v, i) => (
                <motion.button
                  key={v.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => active && onSend && onSend(active.id, `Shall we try ${v.name}? It's got a ${v.vibe} vibe.`)}
                  className="w-40 shrink-0 rounded-2xl border border-gray-200 bg-background p-3 text-left shadow-sm transition hover:border-primary/40 dark:border-gray-600"
                >
                  <span className="text-2xl">{v.emoji}</span>
                  <p className="mt-1 text-sm font-bold leading-tight text-foreground">{v.name}</p>
                  <p className="mt-0.5 flex items-center gap-1 text-[11px] font-medium text-gray-500 dark:text-gray-400">
                    <MapPin size={10} weight="fill" />{v.area} · ⭐ {v.rating}
                  </p>
                  <span className="mt-1.5 inline-block rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
                    {v.category}
                  </span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-wrap gap-1.5">
        {icebreakers.map((ib) => (
          <button
            key={ib}
            onClick={() => active && onSend && onSend(active.id, ib)}
            className="rounded-full border border-dashed border-primary/50 bg-primary/5 px-2.5 py-1 text-[11px] font-semibold text-primary transition active:scale-95 hover:bg-primary/10"
          >
            💬 {ib}
          </button>
        ))}
      </div>

      <div className="rounded-3xl border border-gray-200 bg-background p-4 shadow-sm dark:border-gray-700">
        {active ? (
          <div className="flex min-h-[260px] flex-col">
            <div className="mb-3 flex items-center gap-2 border-b border-gray-100 pb-2 dark:border-gray-800">
              <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-bold text-emerald-700 dark:text-emerald-400">
                <CheckCircle size={12} weight="fill" /> Matched · {profileOf(active)?.intention}
              </span>
              <ArrowsClockwise size={13} className="text-gray-400 dark:text-gray-500" />
            </div>
            <div className="flex flex-1 flex-col gap-2 overflow-y-auto pb-3">
              {(active.messages || []).map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${
                    msg.sender === "me"
                      ? "self-end rounded-br-sm bg-gradient-to-br from-primary to-primary-pressed text-white shadow-sm"
                      : "self-start rounded-bl-sm border border-gray-200 bg-gray-50 text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                  }`}
                >
                  <span className="block text-[11px] font-medium">{msg.text}</span>
                  <span className={`block pt-0.5 text-right text-[9px] ${msg.sender === "me" ? "text-white/70" : "text-gray-400 dark:text-gray-500"}`}>
                    {msg.time}
                  </span>
                </motion.div>
              ))}
            </div>
            <div className="flex gap-2 pt-2">
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder={`Message ${profileOf(active)?.name || ''}...`}
                className="flex-1 rounded-full border border-gray-200 bg-background px-4 py-2.5 text-sm text-foreground outline-none transition focus:border-primary dark:border-gray-600"
              />
              <button
                onClick={handleSend}
                aria-label="Send"
                className="grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br from-primary to-secondary text-white shadow-lg shadow-primary/30 transition active:scale-90"
              >
                <PaperPlaneRight size={18} weight="fill" />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 py-14 text-center">
            <span className="text-3xl">💭</span>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-300">No active match selected. Keep swiping in Discovery to start a conversation.</p>
          </div>
        )}
      </div>
    </div>
  );
}
