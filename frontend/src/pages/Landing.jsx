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
    <IonPage style={{ background: '#08080F', overflow: 'hidden' }}>

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
        background: '#08080F',
      }}>

        {/* ── BACKGROUND IMAGE — blurred edges, sharp couple ── */}
        <div style={{
          position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
          overflow: 'hidden',
        }}>
          {/* Blurred and darkened base image */}
          <img
            src="/landing-bg.jpg"
            alt=""
            draggable={false}
            style={{
              position: 'absolute', inset: 0,
              width: '100%', height: '100%',
              objectFit: 'cover',
              objectPosition: 'center 25%',
              filter: 'blur(12px) brightness(0.35)',
              transform: 'scale(1.1)', // prevent blurred edges showing bg
            }}
          />
          {/* Sharp, bright center using mask */}
          <img
            src="/landing-bg.jpg"
            alt=""
            draggable={false}
            style={{
              position: 'absolute', inset: 0,
              width: '100%', height: '100%',
              objectFit: 'cover',
              objectPosition: 'center 25%',
              WebkitMaskImage: 'radial-gradient(ellipse at center 35%, black 25%, transparent 70%)',
              maskImage: 'radial-gradient(ellipse at center 35%, black 25%, transparent 70%)',
            }}
          />
          {/* Top fade for header readability */}
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: '20%',
            background: 'linear-gradient(180deg, rgba(8,8,15,0.75) 0%, transparent 100%)',
          }} />
          {/* Bottom fade for CTA readability */}
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, height: '40%',
            background: 'linear-gradient(0deg, rgba(8,8,15,0.95) 0%, rgba(8,8,15,0.6) 60%, transparent 100%)',
          }} />
        </div>

        {/* ── AMBIENT GLOW ORBS ── */}
        <div style={{
          position: 'fixed', top: '-10%', right: '-10%',
          width: '50vw', height: '50vw', maxWidth: '300px', maxHeight: '300px',
          borderRadius: '50%', pointerEvents: 'none', zIndex: 0,
          background: 'radial-gradient(circle, rgba(228,23,43,0.15) 0%, transparent 70%)',
        }} />
        <div style={{
          position: 'fixed', bottom: '-10%', left: '-10%',
          width: '50vw', height: '50vw', maxWidth: '300px', maxHeight: '300px',
          borderRadius: '50%', pointerEvents: 'none', zIndex: 0,
          background: 'radial-gradient(circle, rgba(27,76,224,0.15) 0%, transparent 70%)',
        }} />

        {/* ── PAGE CONTENT ── */}
        <div style={{
          position: 'relative', zIndex: 1,
          display: 'flex', flexDirection: 'column',
          minHeight: '100dvh', // Use minHeight so it can scroll if screen is extremely small, but fits if normal
          padding: '2vh 20px',
          maxWidth: '430px', margin: '0 auto',
          justifyContent: 'flex-end', // Pushes everything towards the bottom naturally
        }}>
          
          {/* TOP SECTION: Logo & Title (Placed below head area) */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              paddingTop: '35vh', // Push below the couple's faces/chests
              marginBottom: 'auto', // Pushes the bottom section down
            }}
          >
            {/* LOGO */}
            <div style={{ position: 'relative', width: '150px', height: '150px', marginBottom: '0px' }}>
              <div style={{
                position: 'absolute', inset: '-15px', borderRadius: '50%',
                border: '1px solid rgba(228,23,43,0.18)',
                animation: 'dw-ring-pulse 3.6s ease-in-out infinite',
              }} />
              <img
                src="/logo-symbol.png"
                alt="Dinanwuye logo"
                draggable={false}
                style={{
                  width: '100%', height: '100%', objectFit: 'contain',
                  filter: 'drop-shadow(0 0 12px rgba(228,23,43,0.5)) drop-shadow(0 0 24px rgba(27,76,224,0.28))',
                }}
              />
            </div>

            {/* WORDMARK */}
            <div style={{ textAlign: 'center', marginTop: '0px' }}>
              <h1 style={{
                fontSize: '36px', fontWeight: 900, letterSpacing: '-1.5px', margin: 0,
                background: 'linear-gradient(160deg, #FFFFFF 0%, rgba(255,255,255,0.82) 100%)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              }}>
                Dinanwuye
              </h1>
              <p style={{
                margin: '4px 0 0', fontSize: '15px', fontWeight: 600,
                color: 'rgba(255,255,255,0.85)', letterSpacing: '0.01em',
              }}>
                Find Your Other Half.
              </p>
              
              {/* Brand tagline — COMMITMENT-ORIENTED MATCHMAKING in brand gradient */}
              <p style={{
                margin: '8px 0 0', fontSize: '10px', fontWeight: 800,
                letterSpacing: '0.22em', textTransform: 'uppercase',
                background: 'linear-gradient(90deg, #E4172B 20%, #1B4CE0 80%)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              }}>
                Commitment-Oriented Matchmaking
              </p>
            </div>
            
            {/* ── RED-TO-BLUE DIVIDER ── */}
            <div style={{
              width: '48px', height: '2.5px', margin: '12px 0',
              background: 'linear-gradient(90deg, #E4172B, #1B4CE0)',
              borderRadius: '999px',
              boxShadow: '0 0 14px rgba(228,23,43,0.55)',
            }} />

            {/* TRUST BADGE ROW */}
            <div style={{
              display: 'flex', flexWrap: 'wrap', gap: '8px',
              justifyContent: 'center', maxWidth: '360px',
            }}>
              <TrustBadge icon={<ShieldCheck size={13} weight="fill" />} label="ID Verified Profiles" delay={0.32} />
              <TrustBadge icon={<UsersThree size={13} weight="fill" />} label="Intentional People Only" delay={0.40} />
              <TrustBadge icon={<Sparkle size={13} weight="fill" />} label="AI-Curated Matches" delay={0.48} />
            </div>
          </motion.div>

          {/* BOTTOM SECTION: CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
            style={{
              display: 'flex', flexDirection: 'column',
              gap: '12px', paddingBottom: '2vh',
            }}
          >
            <button
              id="dw-primary-btn"
              onClick={() => navigate('/onboarding')}
              style={{
                width: '100%', padding: '16px',
                borderRadius: '999px',
                background: 'linear-gradient(135deg, #E4172B 0%, #B00F1F 100%)',
                color: '#FFFFFF', fontWeight: 700, fontSize: '15px',
                border: 'none', cursor: 'pointer',
                boxShadow: '0 8px 24px rgba(228,23,43,0.4)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                transition: 'transform 0.14s ease, box-shadow 0.14s ease',
              }}
            >
              Create My Profile <ArrowRight size={18} weight="bold" />
            </button>

            <button
              id="dw-secondary-btn"
              onClick={() => navigate('/auth')}
              style={{
                width: '100%', padding: '16px',
                borderRadius: '999px',
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.15)',
                color: 'rgba(255,255,255,0.9)', fontWeight: 600, fontSize: '14px',
                cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'background 0.14s ease',
              }}
            >
              I Already Have an Account
            </button>
            
            {/* Legal */}
            <p style={{
              textAlign: 'center', fontSize: '12px', fontWeight: 500,
              color: 'rgba(255,255,255,0.9)', margin: '8px 0 16px 0', lineHeight: 1.5,
              zIndex: 10, position: 'relative'
            }}>
              By continuing you agree to our{' '}
              <span style={{ color: '#FFFFFF', textDecoration: 'underline', cursor: 'pointer', fontWeight: 600 }}>Terms</span>
              {' '}&amp;{' '}
              <span style={{ color: '#FFFFFF', textDecoration: 'underline', cursor: 'pointer', fontWeight: 600 }}>Privacy Policy</span>
            </p>
          </motion.div>

        </div>
      </div>
    </IonPage>
  );
};

export default Landing;