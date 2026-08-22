import React, { useState } from 'react';
import {
  IonPage,
  IonContent,
  IonButton,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonTextarea,
  IonToast,
  IonSpinner,
  IonDatetime,
  IonModal,
  IonChip,
  IonText,
} from '@ionic/react';
import {
  arrowForwardOutline,
  arrowBackOutline,
  cameraOutline,
  imagesOutline,
  locationOutline,
  checkmarkCircleOutline,
  trashOutline,
} from 'ionicons/icons';
import { useNavigate } from 'react-router-dom';
import { profileApi } from '@services/api';
import { capturePhoto, pickPhoto, getApproximateLocation } from '@platform';
import useAppStore from '@store/useAppStore';

const PRESET_INTERESTS = [
  'Afrobeats', 'Fashion', 'Football', 'Foodie', 'Travel', 'Faith',
  'Movies', 'Fitness', 'Music', 'Dancing', 'Reading', 'Tech',
];

const INTENT_OPTIONS = [
  { value: 'marriage', label: 'Marriage' },
  { value: 'serious_relationship', label: 'Serious relationship' },
  { value: 'long_term', label: 'Long-term partner' },
  { value: 'friendship_first', label: 'Friendship first' },
];

const LANGUAGES = ['English', 'Yoruba', 'Igbo', 'Hausa', 'Pidgin', 'French', 'Other'];

const STEP_LABELS = ['Basic Info', 'Photos', 'About You', 'Preferences'];

const ProfileWizard = () => {
  const navigate = useNavigate();
  const gender = useAppStore((s) => s.onboarding.gender);
  const seeking = useAppStore((s) => s.onboarding.seeking);
  const setProfile = useAppStore((s) => s.setProfile);

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ open: false, message: '', color: 'danger' });
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Step 1 — Basic Info
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [location, setLocation] = useState(null); // { lat, lng, name }
  const [locating, setLocating] = useState(false);

  // Step 2 — Photos (V0: base64 data URL stored as s3Key; S3 swap in Phase 2)
  const [photos, setPhotos] = useState([]); // [{ dataUrl, order }]

  // Step 3 — About You
  const [bio, setBio] = useState('');
  const [interests, setInterests] = useState([]);
  const [ethnicity, setEthnicity] = useState('');
  const [religion, setReligion] = useState('');

  // Step 4 — Preferences
  const [intent, setIntent] = useState('');
  const [heightCm, setHeightCm] = useState('');
  const [languages, setLanguages] = useState([]);

  const isAge18Plus = (isoDate) => {
    const d = new Date(isoDate);
    if (Number.isNaN(d.getTime())) return false;
    const now = new Date();
    let age = now.getFullYear() - d.getFullYear();
    const m = now.getMonth() - d.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < d.getDate())) age -= 1;
    return age >= 18;
  };

  const handleLocate = async () => {
    setLocating(true);
    try {
      const pos = await getApproximateLocation();
      setLocation({ lat: pos.lat, lng: pos.lng, name: 'Lagos, Nigeria' });
      setToast({ open: true, message: 'Location set', color: 'success' });
    } catch {
      setToast({ open: true, message: 'Could not get location. You can skip this step.', color: 'danger' });
    } finally {
      setLocating(false);
    }
  };

  const addPhotoFromCamera = async () => {
    try {
      const dataUrl = await capturePhoto({ quality: 70, targetWidth: 800, targetHeight: 800 });
      setPhotos((prev) => [...prev, { dataUrl, order: prev.length }]);
    } catch (err) {
      setToast({ open: true, message: err.message || 'Camera unavailable', color: 'danger' });
    }
  };

  const addPhotoFromLibrary = async () => {
    try {
      const dataUrl = await pickPhoto({ quality: 70, targetWidth: 800, targetHeight: 800 });
      setPhotos((prev) => [...prev, { dataUrl, order: prev.length }]);
    } catch (err) {
      if (err.message !== 'No file selected') {
        setToast({ open: true, message: err.message || 'Photo picker unavailable', color: 'danger' });
      }
    }
  };

  const removePhoto = (index) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index).map((p, i) => ({ ...p, order: i })));
  };

  const toggleInterest = (interest) => {
    setInterests((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]
    );
  };

  const toggleLanguage = (lang) => {
    setLanguages((prev) =>
      prev.includes(lang) ? prev.filter((l) => l !== lang) : [...prev, lang]
    );
  };

  const canContinue = () => {
    if (step === 1) return name.trim().length >= 2 && dob && isAge18Plus(dob);
    if (step === 2) return photos.length > 0;
    if (step === 3) return bio.trim().length > 0;
    return intent !== '';
  };

  const nextStep = () => {
    if (!canContinue()) {
      const msg =
        step === 1
          ? 'Enter your name, birthdate (must be 18+), and location'
          : step === 2
          ? 'Add at least one photo'
          : step === 3
          ? 'Write a short bio'
          : 'Choose your relationship intent';
      setToast({ open: true, message: msg, color: 'danger' });
      return;
    }
    setStep((s) => Math.min(s + 1, 4));
  };

  const uploadPhotos = async () => {
    for (const photo of photos) {
      // V0: store data URL as s3Key (media serving arrives with S3 in Phase 2)
      await profileApi.addPhoto(photo.dataUrl, photo.order);
    }
  };

  const handleFinish = async () => {
    setLoading(true);
    try {
      const payload = {
        name: name.trim(),
        dob,
        gender: gender || 'female',
        seeking: seeking ? [seeking] : ['men'],
        bio: bio.trim(),
        ethnicity: ethnicity.trim() || null,
        religion: religion.trim() || null,
        relationshipIntent: intent,
        heightCm: heightCm ? Number(heightCm) : null,
        languages,
        interests,
        locationLat: location?.lat ?? null,
        locationLng: location?.lng ?? null,
        locationName: location?.name ?? null,
        onboardingStep: 4,
        onboardingComplete: true,
      };

      await profileApi.updateMe(payload);
      await uploadPhotos();
      const { data: profile } = await profileApi.getMe();
      setProfile(profile);
      setToast({ open: true, message: 'Profile created! Welcome to Dinanwuye.', color: 'success' });
      setTimeout(() => navigate('/discover', { replace: true }), 800);
    } catch (err) {
      const msg =
        err?.response?.data?.message ??
        (Array.isArray(err?.response?.data?.message) ? err.response.data.message[0] : null) ??
        err?.message ??
        'Could not save profile';
      setToast({ open: true, message: Array.isArray(msg) ? msg[0] : msg, color: 'danger' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <IonPage>
      <IonContent className="ion-padding">
        <div className="max-w-md mx-auto">
          {/* Progress header */}
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-500 mb-2">
              <span>
                Step {step} of 4 — {STEP_LABELS[step - 1]}
              </span>
              <span>{Math.round((step / 4) * 100)}% Complete</span>
            </div>
            <div className="bg-gray-100 rounded-full h-2">
              <div className="bg-primary h-2 rounded-full" style={{ width: `${(step / 4) * 100}%` }} />
            </div>
          </div>

          {/* STEP 1 — Basic Info */}
          {step === 1 && (
            <>
              <h1 className="text-2xl font-bold text-center mb-2">Basic Information</h1>
              <p className="text-gray-600 text-center mb-8">Let&apos;s start with the basics</p>
              <div className="space-y-4 mb-8">
                <IonItem lines="none">
                  <IonLabel position="stacked">Full name</IonLabel>
                  <IonInput
                    placeholder="e.g. Ada Obi"
                    value={name}
                    onIonChange={(e) => setName(e.detail.value ?? '')}
                    maxLength={60}
                  />
                </IonItem>
                <IonItem lines="none" button onClick={() => setShowDatePicker(true)}>
                  <IonLabel position="stacked">Birthdate (18+)</IonLabel>
                  <IonText className={dob ? '' : 'text-gray-400'}>
                    {dob ? new Date(dob).toLocaleDateString() : 'Select your birthdate'}
                  </IonText>
                </IonItem>
                <IonItem lines="none">
                  <IonIcon icon={locationOutline} slot="start" color="medium" />
                  <IonLabel>
                    {location ? location.name : 'Location not set'}
                    {location && (
                      <p className="text-xs text-gray-400">
                        {location.lat.toFixed(2)}, {location.lng.toFixed(2)}
                      </p>
                    )}
                  </IonLabel>
                  <IonButton slot="end" fill="clear" size="small" onClick={handleLocate} disabled={locating}>
                    {locating ? <IonSpinner name="crescent" /> : 'Use my location'}
                  </IonButton>
                </IonItem>
              </div>
            </>
          )}

          {/* STEP 2 — Photos */}
          {step === 2 && (
            <>
              <h1 className="text-2xl font-bold text-center mb-2">Your Photos</h1>
              <p className="text-gray-600 text-center mb-8">Add at least one photo to get started</p>
              <div className="grid grid-cols-3 gap-3 mb-8">
                {photos.map((photo, i) => (
                  <div key={i} className="relative aspect-square rounded-xl overflow-hidden border border-gray-100">
                    <img src={photo.dataUrl} alt={`Photo ${i + 1}`} className="w-full h-full object-cover" />
                    {i === 0 && (
                      <span className="absolute top-1 left-1 bg-primary text-white text-[10px] px-2 py-0.5 rounded-full">
                        Main
                      </span>
                    )}
                    <button
                      className="absolute bottom-1 right-1 bg-black/60 text-white rounded-full p-1"
                      onClick={() => removePhoto(i)}
                      aria-label="Remove photo"
                    >
                      <IonIcon icon={trashOutline} size="small" />
                    </button>
                  </div>
                ))}
                {photos.length < 6 && (
                  <>
                    <button
                      className="aspect-square rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400"
                      onClick={addPhotoFromCamera}
                    >
                      <IonIcon icon={cameraOutline} size="large" />
                      <span className="text-xs mt-1">Camera</span>
                    </button>
                    <button
                      className="aspect-square rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400"
                      onClick={addPhotoFromLibrary}
                    >
                      <IonIcon icon={imagesOutline} size="large" />
                      <span className="text-xs mt-1">Gallery</span>
                    </button>
                  </>
                )}
              </div>
            </>
          )}

          {/* STEP 3 — About You */}
          {step === 3 && (
            <>
              <h1 className="text-2xl font-bold text-center mb-2">About You</h1>
              <p className="text-gray-600 text-center mb-8">Tell your matches who you are</p>
              <div className="space-y-4 mb-8">
                <IonItem lines="none">
                  <IonLabel position="stacked">Bio</IonLabel>
                  <IonTextarea
                    placeholder="A short introduction..."
                    value={bio}
                    onIonChange={(e) => setBio(e.detail.value ?? '')}
                    maxLength={500}
                    autoGrow
                    rows={4}
                  />
                </IonItem>
                <div>
                  <IonText className="text-sm text-gray-500 font-medium">Interests</IonText>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {PRESET_INTERESTS.map((interest) => (
                      <IonChip
                        key={interest}
                        outline={!interests.includes(interest)}
                        color="primary"
                        onClick={() => toggleInterest(interest)}
                      >
                        {interest}
                      </IonChip>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <IonItem lines="none">
                    <IonLabel position="stacked">Ethnicity</IonLabel>
                    <IonInput
                      placeholder="e.g. Igbo"
                      value={ethnicity}
                      onIonChange={(e) => setEthnicity(e.detail.value ?? '')}
                      maxLength={40}
                    />
                  </IonItem>
                  <IonItem lines="none">
                    <IonLabel position="stacked">Religion</IonLabel>
                    <IonInput
                      placeholder="e.g. Christian"
                      value={religion}
                      onIonChange={(e) => setReligion(e.detail.value ?? '')}
                      maxLength={40}
                    />
                  </IonItem>
                </div>
              </div>
            </>
          )}

          {/* STEP 4 — Preferences */}
          {step === 4 && (
            <>
              <h1 className="text-2xl font-bold text-center mb-2">Preferences</h1>
              <p className="text-gray-600 text-center mb-8">What matters to you in a partner?</p>
              <div className="space-y-4 mb-8">
                <div>
                  <IonText className="text-sm text-gray-500 font-medium">Relationship intent</IonText>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {INTENT_OPTIONS.map((opt) => (
                      <IonChip
                        key={opt.value}
                        outline={intent !== opt.value}
                        color="primary"
                        onClick={() => setIntent(opt.value)}
                      >
                        {opt.label}
                      </IonChip>
                    ))}
                  </div>
                </div>
                <IonItem lines="none">
                  <IonLabel position="stacked">Height (cm)</IonLabel>
                  <IonInput
                    type="number"
                    placeholder="e.g. 168"
                    value={heightCm}
                    onIonChange={(e) => setHeightCm(e.detail.value ?? '')}
                    maxLength={3}
                  />
                </IonItem>
                <div>
                  <IonText className="text-sm text-gray-500 font-medium">Languages</IonText>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {LANGUAGES.map((lang) => (
                      <IonChip
                        key={lang}
                        outline={!languages.includes(lang)}
                        color="primary"
                        onClick={() => toggleLanguage(lang)}
                      >
                        {lang}
                      </IonChip>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Nav buttons */}
          <div className="flex gap-3">
            {step > 1 && (
              <IonButton
                fill="outline"
                size="large"
                color="primary"
                className="touch-target-comfortable flex-1"
                onClick={() => setStep((s) => s - 1)}
                disabled={loading}
              >
                <IonIcon icon={arrowBackOutline} slot="start" />
                Back
              </IonButton>
            )}
            {step < 4 ? (
              <IonButton
                expand="block"
                size="large"
                color="primary"
                className="touch-target-comfortable flex-1"
                onClick={nextStep}
              >
                <IonIcon icon={arrowForwardOutline} slot="end" />
                Continue
              </IonButton>
            ) : (
              <IonButton
                expand="block"
                size="large"
                color="primary"
                className="touch-target-comfortable flex-1"
                onClick={handleFinish}
                disabled={loading}
              >
                {loading ? <IonSpinner name="crescent" /> : <IonIcon icon={checkmarkCircleOutline} slot="start" />}
                {loading ? 'Saving...' : 'Finish & Discover'}
              </IonButton>
            )}
          </div>
        </div>

        {/* Date picker modal */}
        <IonModal isOpen={showDatePicker} onDidDismiss={() => setShowDatePicker(false)}>
          <IonContent className="ion-padding">
            <IonDatetime
              presentation="date"
              max={new Date().toISOString()}
              min="1950-01-01"
              value={dob || undefined}
              onIonChange={(e) => {
                const iso = e.detail.value;
                if (iso) {
                  const d = new Date(iso);
                  setDob(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`);
                }
                setShowDatePicker(false);
              }}
            />
            <IonButton expand="block" fill="outline" onClick={() => setShowDatePicker(false)}>
              Cancel
            </IonButton>
          </IonContent>
        </IonModal>

        <IonToast
          isOpen={toast.open}
          onDidDismiss={() => setToast({ ...toast, open: false })}
          message={toast.message}
          duration={4000}
          position="bottom"
          color={toast.color}
        />
      </IonContent>
    </IonPage>
  );
};

export default ProfileWizard;
