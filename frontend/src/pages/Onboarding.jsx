import React from 'react';
import { IonPage, IonContent } from '@ionic/react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle, User, Users, UserPlus } from '@phosphor-icons/react';
import { useNavigate } from 'react-router-dom';
import useAppStore from '@store/useAppStore';

const GENDER_OPTIONS = [
  { value: 'male', label: 'Man', icon: User },
  { value: 'female', label: 'Woman', icon: User },
  { value: 'non_binary', label: 'Non-binary', icon: Users },
];

const SEEKING_OPTIONS = [
  { value: 'women', label: 'Women', icon: User },
  { value: 'men', label: 'Men', icon: User },
  { value: 'everyone', label: 'Everyone', icon: Users },
];

const SelectCard = ({ option, selected, onSelect }) => (
  <motion.button
    whileTap={{ scale: 0.96 }}
    onClick={() => onSelect(option.value)}
    className={`flex w-full items-center justify-between rounded-2xl border-2 px-4 py-4 text-left transition ${
      selected === option.value
        ? 'border-primary bg-primary/5 shadow-sm shadow-primary/15'
        : 'border-gray-200 bg-background hover:border-primary/40 dark:border-gray-700'
    }`}
  >
    <div className="flex items-center gap-3">
      <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
        <option.icon size={20} weight="fill" />
      </div>
      <span className={`text-base font-bold ${selected === option.value ? 'text-primary' : 'text-foreground'}`}>
        {option.label}
      </span>
    </div>
    {selected === option.value && (
      <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}>
        <CheckCircle size={22} weight="fill" className="text-primary" />
      </motion.span>
    )}
  </motion.button>
);

const Onboarding = () => {
  const navigate = useNavigate();
  const gender = useAppStore((s) => s.onboarding.gender);
  const seeking = useAppStore((s) => s.onboarding.seeking);
  const setOnboardingGender = useAppStore((s) => s.setOnboardingGender);
  const setOnboardingSeeking = useAppStore((s) => s.setOnboardingSeeking);

  const handleContinue = () => {
    if (gender && seeking) navigate('/auth');
  };

  return (
    <IonPage>
      <IonContent fullscreen className="ion-padding">
        <div className="flex min-h-[100dvh]">

          {/* ── LEFT PANEL: Branding (tablet+) ── */}
          <div className="hidden sm:flex sm:w-1/2 lg:w-3/5 flex-col items-center justify-center relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #1B4CE0 0%, #0B0B1B 60%, #E4172B 100%)' }}>
            <img
              src="/landing-bg.jpg"
              alt=""
              className="absolute inset-0 w-full h-full object-cover opacity-30"
            />
            <div className="relative z-10 flex flex-col items-center text-center px-12">
              <div className="h-20 w-20 overflow-hidden rounded-3xl shadow-2xl shadow-primary/50 mb-6">
                <img src="/logo-symbol.png" alt="Dinanwuye" className="h-full w-full object-contain" />
              </div>
              <h1 className="text-4xl font-black text-white tracking-tight mb-3">Welcome to Dinanwuye</h1>
              <p className="text-lg font-semibold text-white/80 mb-2">Let's set up your profile.</p>
            </div>
          </div>

          {/* ── RIGHT PANEL: Form ── */}
          <div className="w-full sm:w-1/2 lg:w-2/5 flex flex-col items-center justify-center px-6 py-10">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="w-full max-w-md flex flex-col justify-between min-h-[70vh] sm:min-h-0 sm:gap-12"
            >
          <div>
            {/* Header */}
            <div className="mb-8 text-center">
              <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-3xl bg-gradient-to-br from-primary to-secondary shadow-xl shadow-primary/30">
                <span className="text-2xl">🎯</span>
              </div>
              <h1 className="text-2xl font-black text-foreground">Who are you looking for?</h1>
              <p className="mt-1.5 text-sm text-gray-600 dark:text-gray-300">Help us find intentional matches for you</p>
            </div>

            {/* My gender */}
            <div className="mb-6">
              <p className="mb-3 text-xs font-bold uppercase tracking-widest text-gray-500">My gender</p>
              <div className="flex flex-col gap-2.5">
                {GENDER_OPTIONS.map((opt) => (
                  <SelectCard key={opt.value} option={opt} selected={gender} onSelect={setOnboardingGender} />
                ))}
              </div>
            </div>

            {/* Seeking */}
            <div className="mb-8">
              <p className="mb-3 text-xs font-bold uppercase tracking-widest text-gray-500">I&apos;m open to</p>
              <div className="flex flex-col gap-2.5">
                {SEEKING_OPTIONS.map((opt) => (
                  <SelectCard key={opt.value} option={opt} selected={seeking} onSelect={setOnboardingSeeking} />
                ))}
              </div>
            </div>
          </div>

          {/* CTA */}
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleContinue}
            disabled={!gender || !seeking}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-primary to-primary-pressed py-4 text-base font-bold text-white shadow-xl shadow-primary/30 transition disabled:opacity-40"
          >
            Continue <ArrowRight size={18} weight="bold" />
          </motion.button>
        </motion.div>
        </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Onboarding;
