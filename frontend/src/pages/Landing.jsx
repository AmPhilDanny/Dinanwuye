import React from 'react';
import { IonPage } from '@ionic/react';
import { motion } from 'framer-motion';
import { ShieldCheck, Target, ChatCircle, ArrowRight, Star } from '@phosphor-icons/react';
import { useNavigate } from 'react-router-dom';

const FEATURES = [
  { icon: ShieldCheck, label: 'ID Verified', sub: 'Every profile authenticated' },
  { icon: Target, label: 'Intentional', sub: 'Serious people only' },
  { icon: Star, label: 'Curated Matches', sub: 'AI-powered compatibility' },
  { icon: ChatCircle, label: 'Real Conversations', sub: 'No ghosting culture' },
];

const Landing = () => {
  const navigate = useNavigate();

  return (
    <IonPage style={{ background: '#1D1D1F' }}>
      {/* Plain div instead of IonContent — avoids Ionic shadow DOM painting white over our dark bg */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          overflowY: 'auto',
          background: '#1D1D1F',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        <div className="relative flex min-h-[100dvh] flex-col items-center justify-between px-6">
          {/* Top: Logo */}
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-12 flex flex-col items-center gap-3"
          >
            <div className="h-20 w-20 overflow-hidden rounded-3xl shadow-2xl shadow-primary/40">
              <img src="/logo-symbol.png" alt="Dinanwuye" className="h-full w-full object-contain" />
            </div>
            <div className="text-center">
              <h1 className="text-4xl font-black tracking-tight text-white drop-shadow-lg">Dinanwuye</h1>
              <p className="mt-1 text-base font-semibold" style={{ color: 'rgba(255,255,255,0.8)' }}>Find Your Other Half</p>
            </div>
          </motion.div>

          {/* Middle: Feature cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex w-full max-w-sm flex-col gap-3"
          >
            <div className="grid grid-cols-2 gap-2.5">
              {FEATURES.map(({ icon: Icon, label, sub }) => (
                <div
                  key={label}
                  className="flex items-center gap-2.5 rounded-2xl p-3"
                  style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.12)' }}
                >
                  <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-primary to-secondary">
                    <Icon size={18} weight="fill" className="text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">{label}</p>
                    <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.75)' }}>{sub}</p>
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
              className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-primary to-primary-pressed py-4 text-base font-bold text-white shadow-xl transition active:scale-[0.98]"
            >
              Get Started <ArrowRight size={18} weight="bold" />
            </button>
            <button
              onClick={() => navigate('/auth')}
              className="flex w-full items-center justify-center gap-2 rounded-full py-4 text-base font-semibold text-white transition active:scale-[0.98]"
              style={{ background: 'rgba(255,255,255,0.1)', border: '2px solid rgba(255,255,255,0.3)' }}
            >
              I Already Have an Account
            </button>
            <p className="mt-1 text-center text-[11px]" style={{ color: 'rgba(255,255,255,0.6)' }}>
              By continuing you agree to our Terms &amp; Privacy Policy
            </p>
          </motion.div>
        </div>
      </div>
    </IonPage>
  );
};

export default Landing;