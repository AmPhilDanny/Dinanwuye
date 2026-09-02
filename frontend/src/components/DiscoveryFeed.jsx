import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Heart, X, Star, MapPin, ShieldCheck, Play, Pause } from '@phosphor-icons/react';
import { photoUrl } from '@utils/photoUrl';

export default function DiscoveryFeed({ profiles, onLike, onPass, onSuperSpark, onExhausted }) {
  const [index, setIndex] = useState(0);
  const [exitX, setExitX] = useState(null);
  const reduced = useReducedMotion();
  const current = profiles[index];
  const [playing, setPlaying] = useState(false);

  const advance = (dir) => {
    setExitX(dir);
    window.setTimeout(() => {
      const nextIndex = index + 1;
      setIndex(Math.min(nextIndex, profiles.length));
      setExitX(null);
      if (nextIndex >= profiles.length && onExhausted) {
        onExhausted();
      }
    }, 260);
  };

  if (!current) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center gap-4 px-8 py-24 text-center"
      >
        <span className="grid h-16 w-16 place-items-center rounded-3xl bg-primary/15 text-3xl text-primary">💌</span>
        <h3 className="text-xl font-bold text-foreground">You caught up on everyone near you</h3>
        <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
          Tweak your filters to see more intentional people, or check your new matches in the chat tab.
        </p>
        <button
          onClick={() => { setIndex(0); if (onExhausted) onExhausted(); }}
          className="rounded-full bg-gradient-to-r from-primary to-secondary px-6 py-3 text-sm font-bold text-white shadow-lg shadow-primary/25 transition active:scale-95"
        >
          Re-enter discovery
        </button>
      </motion.div>
    );
  }

  const handleSwipe = (_, info) => {
    if (info.offset.x > 110) { 
      if (onLike) onLike(current); 
      advance(1); 
    }
    else if (info.offset.x < -110) { 
      if (onPass) onPass(current);
      advance(-1); 
    }
  };

  return (
    <div className="relative flex min-h-[72dvh] flex-col px-4 pb-4">
      <div className="relative mx-auto aspect-[3/4] w-full max-w-sm min-h-[480px]">
        {profiles.slice(index, index + 2).map((p, i) => {
          const isFront = i === 0;
          const photoSrc = photoUrl(p.photo || p.photo_url) || `https://ui-avatars.com/api/?name=${encodeURIComponent(p.name)}&size=600&background=random`;
          const distance = p.distanceKm || p.distance_km || 0;
          const matchScore = p.match || p.compatibility_score || 0;
          const isVerified = p.verified || p.is_verified || false;

          return (
            <motion.div
              key={p.id || p.user_id}
              drag={isFront ? 'x' : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.9}
              onDragEnd={handleSwipe}
              animate={
                isFront && exitX !== null
                  ? { x: exitX * 520, rotate: exitX * 14, opacity: 0 }
                  : { x: exitX !== null && !isFront ? 0 : 0 }
              }
              transition={reduced ? { duration: 0 } : { type: 'spring', stiffness: 320, damping: 26 }}
              className="absolute inset-0 overflow-hidden rounded-[2rem] bg-foreground/5 shadow-2xl shadow-foreground/10"
              style={{ zIndex: isFront ? 2 : 1, transform: isFront ? 'none' : `scale(${0.94 + 0.02 * i}) translateY(${8 * i}px)` }}
            >
              <img src={photoSrc} alt={p.name} className="absolute inset-0 h-full w-full object-cover" draggable={false} />
              <div className="absolute inset-0 bg-gradient-to-t from-onyx/95 via-onyx/30 to-transparent" />
              {isFront && exitX !== null && exitX > 0 && (
                <motion.div initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} className="absolute left-5 top-8 rotate-[-12deg] rounded-xl border-2 border-emerald-400 px-3 py-1 text-lg font-black text-emerald-400">
                  LIKE
                </motion.div>
              )}
              {isFront && exitX !== null && exitX < 0 && (
                <motion.div initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} className="absolute right-5 top-8 rotate-[12deg] rounded-xl border-2 border-gray-200 px-3 py-1 text-lg font-black text-gray-200">
                  PASS
                </motion.div>
              )}

              <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                <div className="mb-2 flex items-center gap-1.5">
                  <span className="rounded-full bg-white/20 px-2 py-0.5 text-[11px] font-semibold backdrop-blur-sm">{matchScore}% match</span>
                  {isVerified && (
                    <span className="flex items-center gap-1 rounded-full bg-secondary/90 px-2 py-0.5 text-[10px] font-bold shadow-sm">
                      <ShieldCheck size={11} weight="fill" /> Verified
                    </span>
                  )}
                </div>
                <div className="flex items-end justify-between">
                  <div>
                    <h3 className="text-2xl font-extrabold tracking-tight drop-shadow-sm">{p.name}, {p.age}</h3>
                    <p className="flex items-center gap-1 text-sm text-white/90">
                      <MapPin size={13} weight="fill" /> {p.city || p.location || 'Unknown'}, {p.country} · {Math.round(distance)}km
                    </p>
                    <p className="mt-1 text-xs font-bold text-secondary-light drop-shadow-sm">{p.job}</p>
                  </div>
                  <button
                    onClick={() => setPlaying((v) => !v)}
                    className="grid h-11 w-11 place-items-center rounded-full bg-white/25 text-white backdrop-blur-sm transition active:scale-90"
                    aria-label="Play voice intro"
                  >
                    {playing ? <Pause size={18} weight="fill" /> : <Play size={18} weight="fill" />}
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="mx-auto mt-4 flex w-full max-w-sm items-center justify-center gap-4 py-3">
        <motion.button
          whileTap={{ scale: 0.85 }}
          onClick={() => { if (onPass) onPass(current); advance(-1); }}
          aria-label="Pass"
          className="grid h-14 w-14 place-items-center rounded-full border-2 border-gray-300 bg-white text-gray-500 shadow-lg shadow-gray-900/10 transition active:scale-90 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400"
        >
          <X size={24} weight="bold" />
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.85 }}
          onClick={() => { if (onSuperSpark) onSuperSpark(current); advance(1); }}
          aria-label="Super spark"
          className="grid h-16 w-16 place-items-center rounded-full bg-gradient-to-tr from-secondary to-blue-400 text-white shadow-xl shadow-secondary/30 active:scale-90"
        >
          <Star size={28} weight="fill" />
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.85 }}
          onClick={() => { if (onLike) onLike(current); advance(1); }}
          aria-label="Like"
          className="grid h-14 w-14 place-items-center rounded-full bg-gradient-to-tr from-primary to-primary-pressed text-white shadow-lg shadow-primary/30 active:scale-90"
        >
          <Heart size={24} weight="fill" />
        </motion.button>
      </div>
    </div>
  );
}
