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
    style={{
      display: 'inline-flex', alignItems: 'center', gap: '6px',
      padding: '7px 13px', borderRadius: '999px',
      background: 'rgba(255,255,255,0.055)',
      border: '1px solid rgba(255,255,255,0.11)',
      backdropFilter: 'blur(10px)',
      fontSize: '11.5px', fontWeight: 600,
      color: 'rgba(255,255,255,0.78)',
      letterSpacing: '0.01em', whiteSpace: 'nowrap',
    }}
  >
    <span style={{ color: '#E4172B', display: 'flex', alignItems: 'center' }}>{icon}</span>
    {label}
  </motion.span>
);

const FeatureRow = ({ title, body, accent, delay }) => (
  <motion.div
    initial={{ opacity: 0, x: -14 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.48, delay, ease: [0.22, 1, 0.36, 1] }}
    style={{
      display: 'flex', alignItems: 'flex-start', gap: '14px',
      padding: '15px 16px', borderRadius: '18px',
      background: 'rgba(255,255,255,0.033)',
      border: '1px solid rgba(255,255,255,0.065)',
    }}
  >
    <div style={{
      width: '3px', alignSelf: 'stretch', minHeight: '40px',
      borderRadius: '999px', flexShrink: 0,
      background: 'linear-gradient(180deg, #E4172B 0%, #1B4CE0 100%)',
    }} />
    <div>
      <p style={{ margin: 0, fontSize: '13px', fontWeight: 700, color: 'rgba(255,255,255,0.9)', lineHeight: 1.35 }}>
        {title}
      </p>
      <p style={{ margin: '2px 0 0', fontSize: '11.5px', fontWeight: 500, color: 'rgba(255,255,255,0.42)', lineHeight: 1.4 }}>
        {body}
      </p>
      <p style={{ margin: '4px 0 0', fontSize: '10.5px', fontWeight: 700, color: '#E4172B', letterSpacing: '0.02em' }}>
        {accent}
      </p>
    </div>
  </motion.div>
);

/* ─────────────────────────────────────────────────────
   LANDING PAGE
───────────────────────────────────────────────────── */
const Landing = () => {
  const navigate = useNavigate();

  return (
    <IonPage style={{ background: '#08080F' }}>

      {/* Injected keyframes */}
      <style>{`
        @keyframes dw-float {
          0%, 100% { transform: translateY(0px) scale(1); opacity: 0.55; }
          50%       { transform: translateY(-13px) scale(1.2); opacity: 1; }
        }
        @keyframes dw-ring-pulse {
          0%, 100% { opacity: 0.35; transform: scale(1); }
          50%       { opacity: 0.1;  transform: scale(1.1); }
        }
        #dw-primary-btn:active { transform: scale(0.97) !important; }
        #dw-secondary-btn:active { transform: scale(0.97) !important; }
      `}</style>

      <div style={{
        position: 'absolute', inset: 0,
        overflowY: 'auto', WebkitOverflowScrolling: 'touch',
        background: 'linear-gradient(170deg, #07070F 0%, #0B0B1B 45%, #090612 80%, #08080F 100%)',
      }}>

        {/* ── AMBIENT GLOW ORBS (fixed, decorative) ── */}
        <div style={{
          position: 'fixed', top: '-22%', right: '-18%',
          width: '72vw', height: '72vw', maxWidth: '480px', maxHeight: '480px',
          borderRadius: '50%', pointerEvents: 'none', zIndex: 0,
          background: 'radial-gradient(circle, rgba(228,23,43,0.20) 0%, rgba(228,23,43,0.05) 50%, transparent 72%)',
        }} />
        <div style={{
          position: 'fixed', bottom: '-18%', left: '-18%',
          width: '68vw', height: '68vw', maxWidth: '440px', maxHeight: '440px',
          borderRadius: '50%', pointerEvents: 'none', zIndex: 0,
          background: 'radial-gradient(circle, rgba(27,76,224,0.17) 0%, rgba(27,76,224,0.04) 50%, transparent 72%)',
        }} />
        {/* Centre glow — glows behind the logo */}
        <div style={{
          position: 'fixed', top: '8%', left: '50%', transform: 'translateX(-50%)',
          width: '60vw', height: '60vw', maxWidth: '340px', maxHeight: '340px',
          borderRadius: '50%', pointerEvents: 'none', zIndex: 0,
          background: 'radial-gradient(circle, rgba(228,23,43,0.09) 0%, transparent 65%)',
        }} />

        {/* ── FLOATING PARTICLES ── */}
        {[
          { top: '17%', left: '7%',  size: 4, color: 'rgba(228,23,43,0.55)', delay: '0s',   dur: '6s'  },
          { top: '30%', right: '9%', size: 3, color: 'rgba(27,76,224,0.65)', delay: '1s',   dur: '8s'  },
          { top: '52%', left: '12%', size: 2, color: 'rgba(255,255,255,0.28)', delay: '2s', dur: '7s'  },
          { top: '68%', right: '6%', size: 3, color: 'rgba(228,23,43,0.38)', delay: '0.5s', dur: '9s'  },
          { top: '82%', left: '22%', size: 2, color: 'rgba(27,76,224,0.45)', delay: '1.5s', dur: '7.5s'},
        ].map(({ top, left, right, size, color, delay, dur }, i) => (
          <div key={i} style={{
            position: 'fixed', top, left, right,
            width: size, height: size, borderRadius: '50%',
            background: color, pointerEvents: 'none', zIndex: 0,
            animation: `dw-float ${dur} ease-in-out infinite ${delay}`,
          }} />
        ))}

        {/* ── PAGE CONTENT ── */}
        <div style={{
          position: 'relative', zIndex: 1,
          display: 'flex', flexDirection: 'column',
          minHeight: '100dvh',
          padding: '0 20px',
          maxWidth: '430px', margin: '0 auto',
        }}>

          {/* ── TOP LANGUAGE STRIP ── */}
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', paddingTop: '48px', paddingBottom: '2px' }}
          >
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: '7px',
              fontSize: '9.5px', fontWeight: 800, letterSpacing: '0.24em',
              color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase',
            }}>
              <span style={{ width: 20, height: 1, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.22))' }} />
              Igbo · Husband &amp; Wife
              <span style={{ width: 20, height: 1, background: 'linear-gradient(90deg, rgba(255,255,255,0.22), transparent)' }} />
            </span>
          </motion.div>

          {/* ── HERO ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.65, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              paddingTop: '22px', flex: 1,
            }}
          >

            {/* ── LOGO SYMBOL (icon only — red+blue infinity-heart) ── */}
            <div style={{ position: 'relative', marginBottom: '4px' }}>
              {/* Outer pulse ring */}
              <div style={{
                position: 'absolute', inset: '-20px', borderRadius: '50%',
                border: '1px solid rgba(228,23,43,0.18)',
                animation: 'dw-ring-pulse 3.6s ease-in-out infinite',
              }} />
              {/* Inner pulse ring */}
              <div style={{
                position: 'absolute', inset: '-9px', borderRadius: '50%',
                border: '1px solid rgba(27,76,224,0.15)',
                animation: 'dw-ring-pulse 3.6s ease-in-out infinite 0.9s',
              }} />

              <div style={{
                width: '160px', height: '160px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                /* Glow ONLY on the outer wrapper, not on the img itself — keeps logo colors pristine */
                filter: 'drop-shadow(0 0 28px rgba(228,23,43,0.5)) drop-shadow(0 0 56px rgba(27,76,224,0.28)) drop-shadow(0 10px 36px rgba(0,0,0,0.65))',
              }}>
                <img
                  src="/logo-symbol.png"
                  alt="Dinanwuye infinity-heart symbol"
                  draggable={false}
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
              </div>
            </div>

            {/* ── WORDMARK — rendered as HTML so it's always crisp on dark bg ── */}
            <div style={{ textAlign: 'center', marginTop: '18px' }}>
              <h1 style={{
                fontSize: '46px', fontWeight: 900, letterSpacing: '-1.8px',
                margin: 0, lineHeight: 1,
                /* White with a subtle luminance gradient for depth */
                background: 'linear-gradient(160deg, #FFFFFF 0%, rgba(255,255,255,0.82) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                Dinanwuye
              </h1>

              {/* Sub-headline — "Find Your Other Half." exactly from logo */}
              <p style={{
                margin: '10px 0 0', fontSize: '16.5px', fontWeight: 600,
                color: 'rgba(255,255,255,0.65)', letterSpacing: '0.01em', lineHeight: 1.3,
              }}>
                Find Your Other Half.
              </p>

              {/* Brand tagline — COMMITMENT-ORIENTED MATCHMAKING in brand gradient */}
              <p style={{
                margin: '8px 0 0', fontSize: '10px', fontWeight: 800,
                letterSpacing: '0.22em', textTransform: 'uppercase',
                background: 'linear-gradient(90deg, #E4172B 20%, #1B4CE0 80%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                Commitment-Oriented Matchmaking
              </p>
            </div>

            {/* ── RED-TO-BLUE DIVIDER ── */}
            <div style={{
              width: '48px', height: '2.5px', marginTop: '22px',
              background: 'linear-gradient(90deg, #E4172B, #1B4CE0)',
              borderRadius: '999px',
              boxShadow: '0 0 14px rgba(228,23,43,0.55)',
            }} />

            {/* ── TRUST BADGE ROW ── */}
            <div style={{
              display: 'flex', flexWrap: 'wrap', gap: '8px',
              justifyContent: 'center', marginTop: '20px', maxWidth: '360px',
            }}>
              <TrustBadge icon={<ShieldCheck size={13} weight="fill" />} label="ID Verified Profiles"   delay={0.32} />
              <TrustBadge icon={<UsersThree size={13} weight="fill" />}  label="Intentional People Only" delay={0.40} />
              <TrustBadge icon={<Sparkle    size={13} weight="fill" />}  label="AI-Curated Matches"     delay={0.48} />
            </div>

            {/* ── FEATURE ROWS ── */}
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '9px', marginTop: '22px' }}>
              <FeatureRow
                title="Every profile is government-verified"
                body="Real identity. Real commitment."
                accent="No catfishing. Ever."
                delay={0.52}
              />
              <FeatureRow
                title="Only meet people who want commitment"
                body="Everyone here is here for the same reason."
                accent="No casual encounters."
                delay={0.60}
              />
              <FeatureRow
                title="Your AI matchmaker learns your values"
                body="Deep compatibility — not just photos."
                accent="Not just your type. Your match."
                delay={0.68}
              />
            </div>

            {/* ── SOCIAL PROOF STRIP ── */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.55, delay: 0.82 }}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-around',
                width: '100%', marginTop: '24px',
                padding: '15px 20px', borderRadius: '18px',
                background: 'rgba(255,255,255,0.025)',
                border: '1px solid rgba(255,255,255,0.055)',
              }}
            >
              {[
                { num: '50K+', label: 'Members'      },
                { num: '12K+', label: 'Matches Made' },
                { num: '4.9★', label: 'User Rating'  },
              ].map(({ num, label }, i) => (
                <div key={label} style={{ textAlign: 'center' }}>
                  {i > 0 && (
                    /* divider */
                    <span style={{
                      position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)',
                      width: 1, height: 28, background: 'rgba(255,255,255,0.07)',
                    }} />
                  )}
                  <p style={{
                    margin: 0, fontSize: '19px', fontWeight: 800,
                    background: 'linear-gradient(150deg, #FFFFFF, rgba(255,255,255,0.72))',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}>{num}</p>
                  <p style={{
                    margin: 0, fontSize: '9.5px', fontWeight: 600,
                    color: 'rgba(255,255,255,0.32)', textTransform: 'uppercase', letterSpacing: '0.07em',
                  }}>{label}</p>
                </div>
              ))}
            </motion.div>

          </motion.div>

          {/* ── CTA SECTION ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
            style={{
              display: 'flex', flexDirection: 'column',
              gap: '11px', paddingBottom: '34px', paddingTop: '26px',
            }}
          >
            {/* Primary — Red CTA */}
            <button
              id="dw-primary-btn"
              onClick={() => navigate('/onboarding')}
              style={{
                width: '100%', padding: '17px 24px',
                borderRadius: '999px',
                background: 'linear-gradient(135deg, #E4172B 0%, #B00F1F 100%)',
                color: '#FFFFFF', fontWeight: 700, fontSize: '15.5px',
                border: 'none', cursor: 'pointer',
                boxShadow: '0 8px 36px rgba(228,23,43,0.48), 0 2px 6px rgba(0,0,0,0.35)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '9px',
                letterSpacing: '0.01em',
                transition: 'transform 0.14s ease, box-shadow 0.14s ease',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'scale(1.025)';
                e.currentTarget.style.boxShadow = '0 12px 48px rgba(228,23,43,0.6), 0 2px 6px rgba(0,0,0,0.35)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 8px 36px rgba(228,23,43,0.48), 0 2px 6px rgba(0,0,0,0.35)';
              }}
            >
              Create My Profile <ArrowRight size={19} weight="bold" />
            </button>

            {/* Secondary — ghost */}
            <button
              id="dw-secondary-btn"
              onClick={() => navigate('/auth')}
              style={{
                width: '100%', padding: '17px 24px',
                borderRadius: '999px',
                background: 'rgba(255,255,255,0.048)',
                border: '1.5px solid rgba(255,255,255,0.17)',
                color: 'rgba(255,255,255,0.80)', fontWeight: 600, fontSize: '14.5px',
                cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                letterSpacing: '0.01em',
                transition: 'background 0.14s ease, border-color 0.14s ease',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.085)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.28)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.048)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.17)';
              }}
            >
              Sign In to My Account
            </button>

            {/* Legal */}
            <p style={{
              textAlign: 'center', fontSize: '10.5px',
              color: 'rgba(255,255,255,0.22)', margin: 0, lineHeight: 1.5,
            }}>
              By continuing you agree to our{' '}
              <span style={{ color: 'rgba(255,255,255,0.42)', textDecoration: 'underline', cursor: 'pointer' }}>Terms</span>
              {' '}&amp;{' '}
              <span style={{ color: 'rgba(255,255,255,0.42)', textDecoration: 'underline', cursor: 'pointer' }}>Privacy Policy</span>
            </p>
          </motion.div>

        </div>
      </div>
    </IonPage>
  );
};

export default Landing;