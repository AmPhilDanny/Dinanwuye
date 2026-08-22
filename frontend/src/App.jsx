import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { IonPage, IonLoading } from '@ionic/react';

// Lazy-loaded page components (code splitting)
const Landing = lazy(() => import('@pages/Landing'));
const Onboarding = lazy(() => import('@pages/Onboarding'));
const Auth = lazy(() => import('@pages/Auth'));
const ProfileWizard = lazy(() => import('@pages/ProfileWizard'));
const Discover = lazy(() => import('@pages/Discover'));
const Explore = lazy(() => import('@pages/Explore'));
const Matches = lazy(() => import('@pages/Matches'));
const Chat = lazy(() => import('@pages/Chat'));
const Profile = lazy(() => import('@pages/Profile'));
const Settings = lazy(() => import('@pages/Settings'));
const Premium = lazy(() => import('@pages/Premium'));
const NotFound = lazy(() => import('@pages/NotFound'));

// Loading fallback for Suspense
const PageLoading = () => (
  <IonPage>
    <IonLoading
      message="Loading..."
      spinner="crescent"
      color="primary"
      showBackdrop
      duration={10000}
    />
  </IonPage>
);

const App = () => (
  <Suspense fallback={<PageLoading />}>
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Landing />} />
      <Route path="/onboarding" element={<Onboarding />} />
      <Route path="/auth" element={<Auth />} />

      {/* Protected routes (require auth) */}
      <Route path="/profile-wizard" element={<ProfileWizard />} />
      <Route path="/discover" element={<Discover />} />
      <Route path="/explore" element={<Explore />} />
      <Route path="/matches" element={<Matches />} />
      <Route path="/chat/:conversationId" element={<Chat />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/premium" element={<Premium />} />

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  </Suspense>
);

export default App;