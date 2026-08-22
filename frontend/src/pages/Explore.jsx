import React, { useEffect } from 'react';
import { IonPage, IonContent, IonSpinner, IonToast } from '@ionic/react';
import HeaderNav from '@components/HeaderNav';
import BottomNav from '@components/BottomNav';
import ExploreGrid from '@components/ExploreGrid';
import useAppStore from '@store/useAppStore';

const Explore = () => {
  const deck = useAppStore((s) => s.discover.deck);
  const loading = useAppStore((s) => s.discover.loading);

  const handleLike = (p) => {
    // We would hook this up to the matching API. For now, it visually handles it.
  };

  return (
    <IonPage>
      <IonContent className="ion-padding">
        <HeaderNav activeTab="explore" unread={0} streak={1} />
        
        {loading && deck.length === 0 ? (
          <div className="flex items-center justify-center min-h-[60vh]">
            <IonSpinner name="crescent" />
          </div>
        ) : (
          <ExploreGrid profiles={deck} onLike={handleLike} />
        )}
      </IonContent>
      <BottomNav />
    </IonPage>
  );
};

export default Explore;
