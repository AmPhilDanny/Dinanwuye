import React, { useEffect, useState } from 'react';
import { IonPage, IonContent, IonSpinner, IonToast } from '@ionic/react';
import HeaderNav from '@components/HeaderNav';
import BottomNav from '@components/BottomNav';
import ExploreGrid from '@components/ExploreGrid';
import useAppStore from '@store/useAppStore';
import { matchingApi } from '@services/api';
import { DeckResponseSchema } from '@utils/schemas';

const Explore = () => {
  const deck = useAppStore((s) => (Array.isArray(s.discover?.deck) ? s.discover.deck : []));
  const loading = useAppStore((s) => s.discover?.loading ?? false);
  const setDiscoverDeck = useAppStore((s) => s.setDiscoverDeck);
  const setDiscoverLoading = useAppStore((s) => s.setDiscoverLoading);
  const [error, setError] = useState('');
  const [unreadCount, setUnreadCount] = useState(0);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    if (deck.length > 0) return;
    let active = true;
    setDiscoverLoading(true);
    matchingApi
      .getDeck({ limit: 20 })
      .then(({ data }) => {
        if (active) setDiscoverDeck(DeckResponseSchema.parse(data).items);
      })
      .catch((err) => {
        if (active) setError(err?.response?.data?.detail || err?.message || 'Could not load profiles');
      })
      .finally(() => {
        if (active) setDiscoverLoading(false);
      });
    return () => {
      active = false;
    };
  }, [deck.length, setDiscoverDeck, setDiscoverLoading]);

  useEffect(() => {
    let active = true;
    import('@services/api').then(({ messagingApi }) =>
      messagingApi.listConversations().then(({ data }) => {
        if (!active) return;
        const total = Array.isArray(data)
          ? data.reduce((sum, c) => sum + (c.unreadCount || 0), 0)
          : 0;
        setUnreadCount(total);
      })
    ).catch(() => {});
    return () => { active = false; };
  }, []);

  const handleLike = (p) => {
    // We would hook this up to the matching API. For now, it visually handles it.
  };

  return (
    <IonPage>
      <IonContent className="ion-padding">
        <HeaderNav activeTab="explore" unread={unreadCount} streak={streak} />
        
        {loading && deck.length === 0 ? (
          <div className="flex items-center justify-center min-h-[60vh]">
            <IonSpinner name="crescent" />
          </div>
        ) : error ? (
          <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 text-center text-gray-600">
            <p>{error}</p>
          </div>
        ) : (
          <ExploreGrid profiles={deck} onLike={handleLike} />
        )}
      </IonContent>
      <BottomNav unread={unreadCount} />
    </IonPage>
  );
};

export default Explore;
