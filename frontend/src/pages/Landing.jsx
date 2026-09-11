import React from 'react';
import { IonPage } from '@ionic/react';
import { motion } from 'framer-motion';
import { ShieldCheck, UsersThree, Sparkle, ArrowRight } from '@phosphor-icons/react';
import { useNavigate } from 'react-router-dom';

/* ─────────────────────────────────────────────────────
   Sub-components
───────────────────────────────────────────────────── */
const TrustBadge = ({ icon, label, delay }) => (
  <motion.span
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.45, delay }}
    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-[11.5px] font-semibold text-white/80 tracking-wide whitespace-nowrap"
  >
    <span className="flex items-center text-primary">{icon}</span>
    {label}
  </motion.span>
);

/* ─────────────────────────────────────────────────────
   LANDING PAGE
───────────────────────────────────────────────────── */
const Landing = () => {
  const navigate = useNavigate();

  return (
    <IonPage className="bg-[#08080F]">
      {/* Injected keyframes */}
      <style>{`
        @keyframes dw-ring-pulse {
          0%, 100% { opacity: 0.35; transform: scale(1); }
          50%       { opacity: 0.1;  transform: scale(1.1); }
        }
        @keyframes float-blink {
          0%, 100% { opacity: 0; transform: translateY(10px) scale(0.8); }
          50%       { opacity: 0.7; transform: translateY(-20px) scale(1.2); }
        }
      `}</style>

      {/* Floating Love Icons (Mobile) */}
      <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden lg:hidden">
        <span className="absolute top-[35%] left-[15%] text-2xl" style={{ animation: 'float-blink 4s ease-in-out infinite 0s' }}>❤️</span>
        <span className="absolute top-[45%] right-[15%] text-3xl" style={{ animation: 'float-blink 5s ease-in-out infinite 1.5s' }}>💖</span>
        <span className="absolute top-[60%] left-[25%] text-xl" style={{ animation: 'float-blink 4.5s ease-in-out infinite 0.7s' }}>💕</span>
        <span className="absolute top-[70%] right-[25%] text-2xl" style={{ animation: 'float-blink 6s ease-in-out infinite 2s' }}>❤️</span>
      </div>

      {/* Main Container - splits on lg screens */}
      <div className="flex min-h-[100dvh] w-full overflow-hidden">

        {/* ── LEFT PANEL (Background/Image) ── */}
        <div className="absolute inset-0 lg:relative lg:flex lg:w-1/2 lg:flex-col overflow-hidden bg-[#08080F]">
          
          {/* Blurred base image */}
          <img
            src="/landing-bg.jpg"
            alt=""
            draggable={false}
            className="absolute inset-0 h-full w-full object-cover object-[center_25%] scale-110 blur-xl brightness-[0.35]"
          />
          {/* Sharp center using mask */}
          <img
            src="/landing-bg.jpg"
            alt=""
            draggable={false}
            className="absolute inset-0 h-full w-full object-cover object-[center_25%]"
            style={{
              WebkitMaskImage: 'radial-gradient(ellipse at center 35%, black 25%, transparent 70%)',
              maskImage: 'radial-gradient(ellipse at center 35%, black 25%, transparent 70%)',
            }}
          />
          
          {/* Fades for readability on mobile (hidden on lg where content is on right) */}
          <div className="absolute inset-x-0 top-0 h-[20%] bg-gradient-to-b from-[#08080F]/80 to-transparent lg:hidden" />
          <div className="absolute inset-x-0 bottom-0 h-[40%] bg-gradient-to-t from-[#08080F]/95 via-[#08080F]/60 to-transparent lg:hidden" />
          
          {/* Edge fade for lg screens to blend with right panel */}
          <div className="hidden lg:block absolute inset-y-0 right-0 w-[20%] bg-gradient-to-l from-[#08080F] to-transparent" />
        </div>

        {/* ── AMBIENT GLOW ORBS (Global) ── */}
        <div className="fixed -top-[10%] -right-[10%] w-[50vw] max-w-[300px] h-[50vw] max-h-[300px] rounded-full pointer-events-none z-0"
             style={{ background: 'radial-gradient(circle, rgba(228,23,43,0.15) 0%, transparent 70%)' }} />
        <div className="fixed -bottom-[10%] -left-[10%] w-[50vw] max-w-[300px] h-[50vw] max-h-[300px] rounded-full pointer-events-none z-0"
             style={{ background: 'radial-gradient(circle, rgba(27,76,224,0.15) 0%, transparent 70%)' }} />

        {/* ── RIGHT PANEL (Content) ── */}
        <div className="relative z-10 flex w-full flex-col justify-end px-5 pb-[2vh] lg:w-1/2 lg:justify-center lg:px-16 xl:px-24">
          <div className="mx-auto flex w-full max-w-[430px] flex-col lg:mx-0 lg:max-w-md">
            
            {/* TOP SECTION: Logo & Title */}
            <motion.div
              initial={{ opacity: 0, y: 150 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 2.0, ease: 'easeOut' }}
              className="flex flex-col items-center pt-[35vh] lg:pt-0 lg:items-start"
            >
              {/* LOGO */}
              <div className="relative h-[150px] w-[150px] lg:h-[120px] lg:w-[120px]">
                <div
                  className="absolute -inset-[15px] rounded-full border border-primary/20"
                  style={{ animation: 'dw-ring-pulse 3.6s ease-in-out infinite' }}
                />
                <img
                  src="/logo-symbol.png"
                  alt="Dinanwuye logo"
                  draggable={false}
                  className="h-full w-full object-contain drop-shadow-[0_0_12px_rgba(228,23,43,0.5)]"
                />
              </div>

              {/* WORDMARK */}
              <div className="mt-2 text-center lg:text-left">
                <h1 className="bg-gradient-to-br from-white to-white/80 bg-clip-text text-[36px] lg:text-[48px] font-black tracking-tight text-transparent">
                  Dinanwuye
                </h1>
                <p className="mt-1 text-[15px] lg:text-[18px] font-semibold tracking-wide text-white/85">
                  Find Your Other Half.
                </p>
                
                {/* Brand tagline */}
                <p className="mt-3 bg-gradient-to-r from-primary to-secondary bg-clip-text text-[10px] lg:text-[11px] font-extrabold uppercase tracking-[0.22em] text-transparent">
                  Commitment-Oriented Matchmaking
                </p>
              </div>
              
              {/* Divider */}
              <div className="my-4 h-[2.5px] w-12 rounded-full bg-gradient-to-r from-primary to-secondary shadow-[0_0_14px_rgba(228,23,43,0.55)] lg:my-6 lg:w-16" />

              {/* TRUST BADGE ROW */}
              <div className="flex flex-wrap justify-center gap-2 lg:justify-start">
                <TrustBadge icon={<ShieldCheck size={13} weight="fill" />} label="ID Verified Profiles" delay={0.32} />
                <TrustBadge icon={<UsersThree size={13} weight="fill" />} label="Intentional People Only" delay={0.40} />
                <TrustBadge icon={<Sparkle size={13} weight="fill" />} label="AI-Curated Matches" delay={0.48} />
              </div>
            </motion.div>

            <div className="mt-auto pt-10 lg:pt-16" />

            {/* BOTTOM SECTION: CTA */}
            <motion.div
              initial={{ opacity: 0, y: 150 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 2.0, delay: 0.2, ease: 'easeOut' }}
              className="flex flex-col gap-3"
            >
              <button
                onClick={() => navigate('/onboarding')}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-br from-primary to-primary-pressed p-4 text-[15px] font-bold text-white shadow-[0_8px_24px_rgba(228,23,43,0.4)] transition active:scale-95"
              >
                Create My Profile <ArrowRight size={18} weight="bold" />
              </button>

              <button
                onClick={() => navigate('/auth')}
                className="flex w-full items-center justify-center rounded-full border border-white/15 bg-white/5 p-4 text-[14px] font-semibold text-white/90 transition active:scale-95 hover:bg-white/10"
              >
                I Already Have an Account
              </button>
              
              {/* Legal */}
              <p className="relative z-10 mt-2 text-center text-[12px] font-medium leading-relaxed text-white/90">
                By continuing you agree to our{' '}
                <span className="cursor-pointer font-semibold text-white underline">Terms</span>
                {' '}&amp;{' '}
                <span className="cursor-pointer font-semibold text-white underline">Privacy Policy</span>
              </p>
            </motion.div>

          </div>
        </div>

      </div>
    </IonPage>
  );
};

export default Landing;