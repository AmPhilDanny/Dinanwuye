import React, { useState, useEffect } from 'react';
import { IonPage, IonContent } from '@ionic/react';
import HeaderNav from '@components/HeaderNav';
import BottomNav from '@components/BottomNav';
import ProfileAndSettings from '@components/ProfileAndSettings';
import { profileApi, messagingApi } from '@services/api';
import useAppStore from '@store/useAppStore';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ open: false, message: '', color: 'success' });
  const [unreadCount, setUnreadCount] = useState(0);
  const [streak, setStreak] = useState(0);
  const setProfile = useAppStore((s) => s.setProfile);

  useEffect(() => {
    let active = true;
    const loadProfile = async () => {
      try {
        const { data } = await profileApi.getMe();
        if (!active) return;
        setUser({
          name: data.name || '',
          age: data.dob ? computeAge(data.dob) : null,
          photo: data.photos?.[0]?.s3Key || null,
          city: data.locationName || '',
          country: 'Nigeria',
          job: data.occupation || '',
          intention: data.relationshipIntent || '',
          verified: data.isVerified,
          bio: data.bio || '',
          interests: data.interests || [],
          values: [],
          incognito: false,
          trustScore: 100,
          gender: data.gender,
          ethnicity: data.ethnicity || '',
          religion: data.religion || '',
          heightCm: data.heightCm || '',
          languages: data.languages || [],
          _raw: data,
        });
        setProfile(data);
      } catch {
        if (active) setUser(null);
      } finally {
        if (active) setLoading(false);
      }
    };
    loadProfile();
    return () => { active = false; };
  }, []);

  useEffect(() => {
    let active = true;
    messagingApi.listConversations().then(({ data }) => {
      if (!active) return;
      const total = Array.isArray(data)
        ? data.reduce((sum, c) => sum + (c.unreadCount || 0), 0)
        : 0;
      setUnreadCount(total);
    }).catch(() => {});
    return () => { active = false; };
  }, []);

  const handleSave = async (updatedUser) => {
    setUser(updatedUser);
    try {
      const payload = {};
      if (updatedUser.name) payload.name = updatedUser.name;
      if (updatedUser.bio !== undefined) payload.bio = updatedUser.bio;
      if (updatedUser.job) payload.occupation = updatedUser.job;
      if (updatedUser.intention) payload.relationshipIntent = updatedUser.intention;
      if (updatedUser.interests) payload.interests = updatedUser.interests;
      if (updatedUser.ethnicity !== undefined) payload.ethnicity = updatedUser.ethnicity;
      if (updatedUser.religion !== undefined) payload.religion = updatedUser.religion;

      const { data } = await profileApi.updateMe(payload);
      setProfile(data);
      setToast({ open: true, message: 'Profile saved', color: 'success' });
    } catch {
      setToast({ open: true, message: 'Failed to save profile', color: 'danger' });
    }
  };

  return (
    <IonPage>
      <IonContent className="ion-padding">
        <HeaderNav activeTab="profile" unread={unreadCount} streak={streak} />
        <div className="pt-2">
          {loading ? (
            <div className="flex justify-center py-10 text-gray-400 text-sm">Loading profile...</div>
          ) : user ? (
            <ProfileAndSettings user={user} onChange={handleSave} toast={toast} onToastDismiss={() => setToast({ ...toast, open: false })} />
          ) : (
            <div className="flex justify-center py-10 text-gray-400 text-sm">Could not load profile</div>
          )}
        </div>
      </IonContent>
      <BottomNav unread={unreadCount} />
    </IonPage>
  );
};

function computeAge(dob) {
  const d = new Date(dob);
  const now = new Date();
  let age = now.getFullYear() - d.getFullYear();
  const m = now.getMonth() - d.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < d.getDate())) age -= 1;
  return age;
}

export default Profile;