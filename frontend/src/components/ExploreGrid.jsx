import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, ShieldCheck, Sparkle, Flame, Heart, Compass } from '@phosphor-icons/react';
import { photoUrl } from '@utils/photoUrl';

const CURATED_COLLECTIONS = [
  { label: "Value Aligned 90%+", icon: "💎", filter: (p) => (p.compatibility_score || 0) >= 90 },
  { label: "Ready for Marriage", icon: "💍", filter: (p) => p.intention === "Marriage / Life Partner" },
  { label: "Verified Pioneers", icon: "🛡️", filter: (p) => p.is_verified || p.verified },
  { label: "Cultural Roots", icon: "🌍", filter: (p) => true },
  { label: "Creative & Tech", icon: "🎨", filter: (p) => /esign|ech|rchitect|rtist|hef/i.test(p.job || "") },
  { label: "Instant Spark", icon: "⚡", filter: (p) => (p.match || p.compatibility_score || 0) >= 85 },
];

export default function ExploreGrid({ profiles, onLike }) {
  const categories = useMemo(
    () => Array.from(new Set(profiles.map((p) => p.heritage?.split(" ")[0] || "African"))).slice(0, 4),
    [profiles]
  );
  const [collection, setCollection] = useState(CURATED_COLLECTIONS[0]);
  const shown = useMemo(() => profiles.filter(collection.filter), [profiles, collection]);
  const [likedSet, setLikedSet] = useState(new Set());

  const toggleLike = (p) => {
    if (onLike) onLike(p);
    setLikedSet((s) => {
      const n = new Set(s);
      const id = p.id || p.user_id;
      if (n.has(id)) n.delete(id); else n.add(id);
      return n;
    });
  };

  return (
    <div className="mx-auto w-full max-w-md px-4 pb-4">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="flex items-center gap-1.5 text-lg font-extrabold text-foreground">
            <Sparkle size={18} weight="fill" className="text-secondary" /> Explore curated matches
          </h2>
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400">{profiles.length} intentional people near you</p>
        </div>
        <span className="rounded-full bg-primary/15 px-2.5 py-1 text-[11px] font-bold text-primary">Hand-picked</span>
      </div>

      <div className="-mx-4 mb-5 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none]">
        {CURATED_COLLECTIONS.map((c) => (
          <button
            key={c.label}
            onClick={() => setCollection(c)}
            className={`shrink-0 rounded-full px-3.5 py-2 text-xs font-bold transition active:scale-95 ${
              collection.label === c.label
                ? "bg-gradient-to-r from-primary to-secondary text-white shadow-md shadow-primary/25"
                : "border border-gray-200 bg-background text-gray-700 hover:border-primary/40 dark:border-gray-600 dark:text-gray-300"
            }`}
          >
            <span className="mr-1">{c.icon}</span>{c.label}
          </button>
        ))}
      </div>

      <div className="mb-4 flex flex-wrap gap-1.5">
        {categories.map((c) => (
          <span key={c} className="rounded-full border border-gray-200 bg-background px-2.5 py-1 text-[11px] font-semibold text-gray-700 dark:border-gray-600 dark:text-gray-300">
            {c} roots
          </span>
        ))}
        <span className="rounded-full bg-secondary-light px-2.5 py-1 text-[11px] font-bold text-secondary dark:text-blue-300">
          <Flame size={11} weight="fill" className="mr-0.5 inline" />Sorted by match
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {shown.map((p, i) => {
          const id = p.id || p.user_id;
          const imgSrc = photoUrl(p.photo || p.photo_url);
          const distance = p.distanceKm || p.distance_km || 0;
          const matchScore = p.match || p.compatibility_score || 0;
          const isVerified = p.verified || p.is_verified || false;

          return (
            <motion.button
              key={id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              onClick={() => toggleLike(p)}
              whileTap={{ scale: 0.97 }}
              className="group relative overflow-hidden rounded-3xl bg-foreground/5 text-left shadow-sm"
            >
              <div className="relative aspect-[4/5] overflow-hidden">
                {imgSrc ? (
                  <img src={imgSrc} alt={p.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" draggable={false} />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary to-secondary">
                    <span className="text-3xl font-extrabold text-white/90 select-none">{(p.name || '?').split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()}</span>
                  </div>
                )}
                <button
                  onClick={(e) => { e.stopPropagation(); toggleLike(p); }}
                  aria-label="Like"
                  className={`absolute right-2 top-2 grid h-9 w-9 place-items-center rounded-full backdrop-blur-sm transition active:scale-90 ${
                    likedSet.has(id) ? "bg-primary text-white shadow-md" : "bg-white/25 text-white"
                  }`}
                >
                  <Heart size={16} weight={likedSet.has(id) ? "fill" : "bold"} />
                </button>
                {isVerified && (
                  <span className="absolute left-2 top-2 flex items-center gap-0.5 rounded-full bg-secondary/90 px-1.5 py-0.5 text-[9px] font-bold text-white shadow-sm">
                    <ShieldCheck size={10} weight="fill" />
                  </span>
                )}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-onyx/90 to-transparent p-3 pt-8 text-white">
                  <p className="text-sm font-bold drop-shadow-sm">{p.name}, {p.age}</p>
                  <p className="flex items-center gap-0.5 text-[11px] text-white/90">
                    <MapPin size={10} weight="fill" />{p.city || p.location || 'Unknown'} · {Math.round(distance)}km
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between px-3 py-2">
                <span className="text-[11px] font-bold text-foreground">{matchScore}% match</span>
                <span className="flex items-center gap-0.5 text-[11px] font-medium text-gray-500 dark:text-gray-400">
                  <Compass size={11} weight="fill" className="text-secondary" />{(p.languages && p.languages[0]) || 'English'}
                </span>
              </div>
            </motion.button>
          )
        })}
      </div>

      {shown.length === 0 && (
        <div className="flex flex-col items-center gap-3 py-16 text-center">
          <span className="text-3xl">🔍</span>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-300">No profiles match this collection. Try another tab.</p>
        </div>
      )}
    </div>
  );
}
