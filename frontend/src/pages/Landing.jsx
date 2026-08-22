import React from 'react';
import { IonPage, IonContent } from '@ionic/react';
import { motion } from 'framer-motion';
import { Heart, ShieldCheck, ChatCircle, ArrowRight, Star } from '@phosphor-icons/react';
import { useNavigate } from 'react-router-dom';
import { PHOTOS } from '@utils/constants';

const FEATURES = [
  { icon: ShieldCheck, label: 'ID Verified', sub: 'Every profile authenticated' },
  { icon: Heart, label: 'Intentional', sub: 'Serious people only' },
  { icon: Star, label: 'Curated Matches', sub: 'AI-powered compatibility' },
  { icon: ChatCircle, label: 'Real Conversations', sub: 'No ghosting culture' },
];

const Landing = () => {
  const navigate = useNavigate();

  return (
    <IonPage>
      <IonContent fullscreen>
        <div className="relative min-h-[100dvh] overflow-hidden">
          {/* Hero background — collage of real faces */}
          <div className="absolute inset-0 grid grid-cols-3 gap-0.5 opacity-40">
            {PHOTOS.slice(0, 9).map((src, i) => (
              <div key={i} className="overflow-hidden bg-gray-200">
                <img src={src} alt="" className="h-full w-full object-cover" draggable={false} />
              </div>
            ))}
          </div>
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-onyx/70 via-onyx/60 to-onyx/90" />

          <div className="relative z-10 flex min-h-[100dvh] flex-col items-center justify-between px-6 py-safe-top-6">
            {/* Top: Logo */}
            <motion.div
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mt-12 flex flex-col items-center gap-3 text-white"
            >
              <div className="grid h-16 w-16 place-items-center rounded-3xl bg-gradient-to-br from-primary to-secondary shadow-2xl shadow-primary/40">
                <Heart size={32} weight="fill" className="text-white" />
              </div>
              <div className="text-center">
                <h1 className="text-4xl font-black tracking-tight drop-shadow-lg">Dinanwuye</h1>
                <p className="mt-1 text-base font-semibold text-white/80">Find Your Other Half</p>
              </div>
            </motion.div>

            {/* Middle: Feature pills */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex w-full max-w-sm flex-col gap-3"
            >
              <div className="grid grid-cols-2 gap-2.5">
                {FEATURES.map(({ icon: Icon, label, sub }) => (
                  <div key={label} className="flex items-center gap-2.5 rounded-2xl bg-white/10 p-3 backdrop-blur-sm">
                    <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-primary to-secondary">
                      <Icon size={18} weight="fill" className="text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">{label}</p>
                      <p className="text-[10px] text-white/70">{sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Bottom: CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.35 }}
              className="mb-10 flex w-full max-w-sm flex-col gap-3"
            >
              <button
                onClick={() => navigate('/onboarding')}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-primary to-primary-pressed py-4 text-base font-bold text-white shadow-xl shadow-primary/40 transition active:scale-[0.98]"
              >
                Get Started <ArrowRight size={18} weight="bold" />
              </button>
              <button
                onClick={() => navigate('/auth')}
                className="flex w-full items-center justify-center gap-2 rounded-full border-2 border-white/30 bg-white/10 py-4 text-base font-semibold text-white backdrop-blur-sm transition active:scale-[0.98]"
              >
                I Already Have an Account
              </button>
              <p className="mt-1 text-center text-[11px] text-white/50">
                By continuing you agree to our Terms & Privacy Policy
              </p>
            </motion.div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Landing;