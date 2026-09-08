import React, { useEffect, useRef } from 'react';
import { IonPage } from '@ionic/react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ShieldCheck, UsersThree, Sparkle, ArrowRight, CheckCircle } from '@phosphor-icons/react';
import { useNavigate } from 'react-router-dom';

/* ─────────────────────────────────────────
   Floating particle — pure CSS animation
───────────────────────────────────────── */
const Particle = ({ style }) => (
  <div
    style={{
      position: 'absolute',
      borderRadius: '50%',
      pointerEvents: 'none',
      ...style,
    }}
  />
);

/* ─────────────────────────────────────────
   Trust badge pill
───────────────────────────────────────── */
const TrustBadge = ({ icon, label, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '7px',
      padding: '8px 14px',
      borderRadius: '999px',
      background: 'rgba(255,255,255,0.06)',
      border: '1px solid rgba(255,255,255,0.12)',
      backdropFilter: 'blur(12px)',
      fontSize: '12px',
      fontWeight: 600,
      color: 'rgba(255,255,255,0.82)',
      letterSpacing: '0.01em',
      whiteSpace: 'nowrap',
    }}
  >
    <span style={{ color: '#E4172B', display: 'flex' }}>{icon}</span>
    {label}
  </motion.div>
);

/* ─────────────────────────────────────────
   Feature row
───────────────────────────────────────── */
const Feature = ({ title, body, accent, delay }) => (
  <motion.div
    initial={{ opacity: 0, x: -12 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.5, delay }}
    style={{
      display: 'flex',
      alignItems: 'flex-start',
      gap: '14px',
      padding: '16px 18px',
      borderRadius: '20px',
      background: 'rgba(255,255,255,0.035)',
      border: '1px solid rgba(255,255,255,0.07)',
    }}
  >
    {/* Gradient side-bar */}
    <div style={{
      width: '3px',
      minHeight: '42px',
      borderRadius: '999px',
      flexShrink: 0,
      background: 'linear-gradient(180deg, #E4172B 0%, #1B4CE0 100%)',
      alignSelf: 'stretch',
    }} />
    <div>
      <p style={{ margin: 0, fontSize: '13.5px', fontWeight: 700, color: 'rgba(255,255,255,0.9)', lineHeight: 1.35 }}>
        {title}
      </p>
      <p style={{ margin: '3px 0 0', fontSize: '12px', fontWeight: 500, color: 'rgba(255,255,255,0.45)', lineHeight: 1.4 }}>
        {body}
      </p>
      <p style={{ margin: '4px 0 0', fontSize: '11px', fontWeight: 700, color: '#E4172B', letterSpacing: '0.02em' }}>
        {accent}
      </p>
    </div>
  </motion.div>
);

/* ─────────────────────────────────────────
   MAIN LANDING PAGE
───────────────────────────────────────── */
const Landing = () => {
  const navigate = useNavigate();

  return (
    <IonPage style={{ background: '#08080F' }}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          overflowY: 'auto',
          WebkitOverflowScrolling: 'touch',
          /* Deep navy-to-black gradient — brand-aligned */
          background: 'linear-gradient(175deg, #080812 0%, #0C0C1A 40%, #0A0614 80%, #08080F 100%)',
        }}
      >

        {/* ── AMBIENT GLOW ORBS ── */}
        {/* Red orb — top right */}
        <div style={{
          position: 'fixed', top: '-20%', right: '-15%',
          width: '70vw', height: '70vw', maxWidth: '460px', maxHeight: '460px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(228,23,43,0.18) 0%, rgba(228,23,43,0.06) 45%, transparent 70%)',
          pointerEvents: 'none', zIndex: 0,
        }} />
        {/* Blue orb — bottom left */}
        <div style={{
          position: 'fixed', bottom: '-15%', left: '-15%',
          width: '65vw', height: '65vw', maxWidth: '420px', maxHeight: '420px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(27,76,224,0.15) 0%, rgba(27,76,224,0.05) 45%, transparent 70%)',
          pointerEvents: 'none', zIndex: 0,
        }} />
        {/* Subtle red center pulse behind logo */}
        <div style={{
          position: 'fixed', top: '10%', left: '50%', transform: 'translateX(-50%)',
          width: '55vw', height: '55vw', maxWidth: '320px', maxHeight: '320px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(228,23,43,0.08) 0%, transparent 65%)',
          pointerEvents: 'none', zIndex: 0,
        }} />

        {/* ── FLOATING PARTICLES ── */}
        <Particle style={{ top: '18%', left: '8%', width: 4, height: 4, background: 'rgba(228,23,43,0.5)', animation: 'dw-float 6s ease-in-out infinite' }} />
        <Particle style={{ top: '32%', right: '10%', width: 3, height: 3, background: 'rgba(27,76,224,0.6)', animation: 'dw-float 8s ease-in-out infinite 1s' }} />
        <Particle style={{ top: '55%', left: '14%', width: 2, height: 2, background: 'rgba(255,255,255,0.3)', animation: 'dw-float 7s ease-in-out infinite 2s' }} />
        <Particle style={{ top: '70%', right: '7%', width: 3, height: 3, background: 'rgba(228,23,43,0.35)', animation: 'dw-float 9s ease-in-out infinite 0.5s' }} />

        {/* ── KEYFRAMES injected inline ── */}
        <style>{`
          @keyframes dw-float {
            0%, 100% { transform: translateY(0px) scale(1); opacity: 0.6; }
            50% { transform: translateY(-14px) scale(1.15); opacity: 1; }
          }
          @keyframes dw-shimmer {
            0% { background-position: -200% center; }
            100% { background-position: 200% center; }
          }
          @keyframes dw-pulse-ring {
            0% { transform: scale(1); opacity: 0.4; }
            50% { transform: scale(1.12); opacity: 0.15; }
            100% { transform: scale(1); opacity: 0.4; }
          }
          @keyframes dw-badge-glow {
            0%, 100% { box-shadow: 0 0 0 0 rgba(228,23,43,0); }
            50% { box-shadow: 0 0 16px 4px rgba(228,23,43,0.18); }
          }
        `}</style>

        {/* ── SCROLLABLE CONTENT ── */}
        <div style={{
          position: 'relative', zIndex: 1,
          display: 'flex', flexDirection: 'column',
          minHeight: '100dvh',
          padding: '0 22px',
          maxWidth: '430px',
          margin: '0 auto',
        }}>

          {/* ── HEADER: Language tag ── */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              paddingTop: '52px', paddingBottom: '4px',
            }}
          >
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              fontSize: '10px', fontWeight: 800, letterSpacing: '0.25em',
              color: 'rgba(255,255,255,0.28)', textTransform: 'uppercase',
            }}>
              <span style={{
                display: 'inline-block', width: '18px', height: '1px',
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.25))',
              }} />
              Igbo · "Husband &amp; Wife"
              <span style={{
                display: 'inline-block', width: '18px', height: '1px',
                background: 'linear-gradient(90deg, rgba(255,255,255,0.25), transparent)',
              }} />
            </span>
          </motion.div>

          {/* ── HERO SECTION ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            style={{
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', gap: '0px',
              paddingTop: '24px', flex: 1,
            }}
          >
            {/* ── LOGO with pulse ring ── */}
            <div style={{ position: 'relative', marginBottom: '8px' }}>
              {/* Outer pulse ring */}
              <div style={{
                position: 'absolute', inset: '-18px',
                borderRadius: '50%',
                border: '1px solid rgba(228,23,43,0.18)',
                animation: 'dw-pulse-ring 3.5s ease-in-out infinite',
              }} />
              {/* Inner pulse ring */}
              <div style={{
                position: 'absolute', inset: '-8px',
                borderRadius: '50%',
                border: '1px solid rgba(27,76,224,0.14)',
                animation: 'dw-pulse-ring 3.5s ease-in-out infinite 0.7s',
              }} />
              <div style={{
                width: '164px', height: '164px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                filter: 'drop-shadow(0 0 28px rgba(228,23,43,0.45)) drop-shadow(0 0 56px rgba(27,76,224,0.25)) drop-shadow(0 8px 32px rgba(0,0,0,0.6))',
              }}>
                <img
                  src="/logo-symbol.png"
                  alt="Dinanwuye — Find Your Other Half"
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
              </div>
            </div>

            {/* ── WORDMARK ── */}
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              {/* Main name — using the deep navy color from the logo itself on white bg,
                  but here on dark bg we use white with slight gradient */}
              <h1 style={{
                fontSize: '48px', fontWeight: 900, letterSpacing: '-2px',
                margin: 0, lineHeight: 1,
                background: 'linear-gradient(135deg, #FFFFFF 0%, rgba(255,255,255,0.85) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                Dinanwuye
              </h1>

              {/* Subtitle — exactly as on the logo */}
              <p style={{
                marginTop: '12px', marginBottom: 0,
                fontSize: '17px', fontWeight: 600,
                color: 'rgba(255,255,255,0.7)', letterSpacing: '0.01em',
                lineHeight: 1.3,
              }}>
                Find Your Other Half.
              </p>

              {/* Tagline — matches COMMITMENT-ORIENTED MATCHMAKING from logo */}
              <p style={{
                marginTop: '8px', marginBottom: 0,
                fontSize: '10.5px', fontWeight: 800,
                letterSpacing: '0.2em', textTransform: 'uppercase',
                background: 'linear-gradient(90deg, #E4172B, #1B4CE0)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                Commitment-Oriented Matchmaking
              </p>
            </div>

            {/* ── GRADIENT DIVIDER ── */}
            <div style={{
              width: '52px', height: '2.5px', marginTop: '24px',
              background: 'linear-gradient(90deg, #E4172B, #1B4CE0)',
              borderRadius: '999px',
              boxShadow: '0 0 12px rgba(228,23,43,0.5)',
            }} />

            {/* ── TRUST BADGES ── */}
            <div style={{
              display: 'flex', flexWrap: 'wrap', gap: '8px',
              justifyContent: 'center', marginTop: '22px',
              maxWidth: '360px',
            }}>
              <TrustBadge
                icon={<ShieldCheck size={14} weight="fill" />}
                label="ID Verified Profiles"
                delay={0.35}
              />
              <TrustBadge
                icon={<UsersThree size={14} weight="fill" />}
                label="Intentional People Only"
                delay={0.42}
              />
              <TrustBadge
                icon={<Sparkle size={14} weight="fill" />}
                label="AI-Curated Matches"
                delay={0.49}
              />
            </div>

            {/* ── FEATURE ROWS ── */}
            <div style={{
              width: '100%', display: 'flex', flexDirection: 'column',
              gap: '10px', marginTop: '24px',
            }}>
              <Feature
                title="Every profile is government-verified"
                body="Real identity. Real commitment."
                accent="No catfishing. Ever."
                delay={0.55}
              />
              <Feature
                title="Only meet people who want commitment"
                body="Everyone here is here for the same reason."
                accent="No casual encounters."
                delay={0.62}
              />
              <Feature
                title="Your AI matchmaker learns your values"
                body="Deep compatibility — not just photos."
                accent="Not just your type. Your match."
                delay={0.69}
              />
            </div>

            {/* ── SOCIAL PROOF NUMBER ── */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                gap: '24px', marginTop: '28px',
                padding: '16px 24px', borderRadius: '20px',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)',
                width: '100%',
              }}
            >
              {[
                { num: '50K+', label: 'Members' },
                { num: '12K+', label: 'Matches Made' },
                { num: '4.9★', label: 'User Rating' },
              ].map(({ num, label }) => (
                <div key={label} style={{ textAlign: 'center' }}>
                  <p style={{
                    margin: 0, fontSize: '20px', fontWeight: 800,
                    background: 'linear-gradient(135deg, #FFFFFF, rgba(255,255,255,0.75))',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}>{num}</p>
                  <p style={{
                    margin: 0, fontSize: '10px', fontWeight: 600,
                    color: 'rgba(255,255,255,0.35)', letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                  }}>{label}</p>
                </div>
              ))}
            </motion.div>

          </motion.div>

          {/* ── CTA SECTION ── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            style={{
              display: 'flex', flexDirection: 'column',
              gap: '12px', paddingBottom: '36px', paddingTop: '28px',
            }}
          >
            {/* Primary CTA */}
            <button
              id="landing-cta-primary"
              onClick={() => navigate('/onboarding')}
              style={{
                width: '100%', padding: '18px 24px',
                borderRadius: '999px',
                background: 'linear-gradient(135deg, #E4172B 0%, #B00F1F 100%)',
                color: '#FFFFFF', fontWeight: 700, fontSize: '16px',
                border: 'none', cursor: 'pointer',
                boxShadow: '0 8px 40px rgba(228,23,43,0.45), 0 2px 8px rgba(0,0,0,0.4)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                letterSpacing: '0.01em',
                transition: 'transform 0.15s ease, box-shadow 0.15s ease',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'scale(1.02)';
                e.currentTarget.style.boxShadow = '0 12px 48px rgba(228,23,43,0.55), 0 2px 8px rgba(0,0,0,0.4)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 8px 40px rgba(228,23,43,0.45), 0 2px 8px rgba(0,0,0,0.4)';
              }}
            >
              Create My Profile
              <ArrowRight size={20} weight="bold" />
            </button>

            {/* Secondary CTA */}
            <button
              id="landing-cta-signin"
              onClick={() => navigate('/auth')}
              style={{
                width: '100%', padding: '18px 24px',
                borderRadius: '999px',
                background: 'rgba(255,255,255,0.05)',
                border: '1.5px solid rgba(255,255,255,0.18)',
                color: 'rgba(255,255,255,0.82)', fontWeight: 600, fontSize: '15px',
                cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                letterSpacing: '0.01em',
                transition: 'background 0.15s ease, border-color 0.15s ease',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.09)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.28)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.18)';
              }}
            >
              Sign In to My Account
            </button>

            {/* Legal microcopy */}
            <p style={{
              textAlign: 'center', fontSize: '11px',
              color: 'rgba(255,255,255,0.25)', margin: 0, lineHeight: 1.5,
            }}>
              By continuing you agree to our{' '}
              <span style={{ color: 'rgba(255,255,255,0.45)', textDecoration: 'underline', cursor: 'pointer' }}>Terms</span>
              {' '}&amp;{' '}
              <span style={{ color: 'rgba(255,255,255,0.45)', textDecoration: 'underline', cursor: 'pointer' }}>Privacy Policy</span>
            </p>
          </motion.div>

        </div>
      </div>
    </IonPage>
  );
};

export default Landing;