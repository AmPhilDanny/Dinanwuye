import React from 'react';
import { IonPage, IonContent } from '@ionic/react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle } from '@phosphor-icons/react';
import { useNavigate } from 'react-router-dom';
import useAppStore from '@store/useAppStore';

const GENDER_OPTIONS = [
  { value: 'male', label: 'Man', emoji: '👨' },
  { value: 'female', label: 'Woman', emoji: '👩' },
  { value: 'non_binary', label: 'Non-binary', emoji: '🧑' },
];

const SEEKING_OPTIONS = [
  { value: 'women', label: 'Women', emoji: '💃' },
  { value: 'men', label: 'Men', emoji: '🕺' },
  { value: 'everyone', label: 'Everyone', emoji: '💑' },
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
      <span className="text-2xl">{option.emoji}</span>
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
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mx-auto flex min-h-[90dvh] max-w-md flex-col justify-between py-10"
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
      </IonContent>
    </IonPage>
  );
};

export default Onboarding;
