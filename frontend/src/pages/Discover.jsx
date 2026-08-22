import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  IonPage,
  IonContent,
  IonButton,
  IonIcon,
  IonText,
  IonSpinner,
  IonModal,
  IonToast,
  IonChip,
  IonFab,
  IonFabButton,
} from '@ionic/react';
import {
  heartOutline,
  closeOutline,
  flashOutline,
  personOutline,
  optionsOutline,
  locationOutline,
  shieldCheckmarkOutline,
  chatbubblesOutline,
} from 'ionicons/icons';
import { useNavigate } from 'react-router-dom';
import { matchingApi } from '@services/api';
import { DeckResponseSchema } from '@utils/schemas';
import useAppStore from '@store/useAppStore';
import DiscoveryFeed from '@components/DiscoveryFeed';
import HeaderNav from '@components/HeaderNav';
import BottomNav from '@components/BottomNav';

const DECK_PAGE_SIZE = 10;
const GENDER_LABELS = { male: 'Man', female: 'Woman', non_binary: 'Non-binary' };

const initials = (name) =>
  (name || '?')
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

const Discover = () => {
  const navigate = useNavigate();
  const currentIndex = useAppStore((s) => s.discover?.currentIndex ?? 0);
  const deck = useAppStore((s) => (Array.isArray(s.discover?.deck) ? s.discover.deck : []));
  const loading = useAppStore((s) => s.discover?.loading ?? false);
  const setDiscoverDeck = useAppStore((s) => s.setDiscoverDeck);
  const setDiscoverLoading = useAppStore((s) => s.setDiscoverLoading);
  const nextProfile = useAppStore((s) => s.nextProfile);

  const [cursor, setCursor] = useState(null);
  const [hasMore, setHasMore] = useState(false);
  const [swiping, setSwiping] = useState(false);
  const [matchedUser, setMatchedUser] = useState(null); // DeckItem of the mutual match
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [toast, setToast] = useState({ open: false, message: '', color: 'danger' });
  const [likesRemaining, setLikesRemaining] = useState(null);
  const fetchingRef = useRef(false);

  const loadDeck = useCallback(
    async (pageCursor) => {
      if (fetchingRef.current) return;
      fetchingRef.current = true;
      setDiscoverLoading(true);
      try {
        const { data } = await matchingApi.getDeck({
          limit: DECK_PAGE_SIZE,
          cursor: pageCursor || undefined,
        });
        const parsed = DeckResponseSchema.parse(data);
        setDiscoverDeck(pageCursor ? [...deck, ...parsed.items] : parsed.items);
        setCursor(parsed.next_cursor || null);
        setHasMore(parsed.has_more);
      } catch (err) {
        setToast({
          open: true,
          message: err?.response?.data?.detail || err?.message || 'Could not load profiles',
          color: 'danger',
        });
      } finally {
        setDiscoverLoading(false);
        fetchingRef.current = false;
      }
    },
    [deck, setDiscoverDeck, setDiscoverLoading]
  );

  useEffect(() => {
    loadDeck(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAction = async (action) => {
    const profile = deck[currentIndex];
    if (!profile || swiping) return;

    setSwiping(true);
    try {
      const { data } = await matchingApi.swipe(profile.user_id, action);
      if (data.remaining_likes !== undefined && data.remaining_likes !== null) {
        setLikesRemaining(data.remaining_likes);
      }
      if (data.matched) {
        setMatchedUser(profile);
        setShowMatchModal(true);
      }
      if (currentIndex + 1 >= deck.length) {
        if (hasMore) {
          loadDeck(cursor);
        } else {
          setDiscoverDeck([]);
        }
      } else {
        nextProfile();
      }
    } catch (err) {
      const status = err?.response?.status;
      if (status === 429) {
        setToast({ open: true, message: 'Daily like limit reached. Come back tomorrow!', color: 'warning' });
      } else {
        setToast({
          open: true,
          message: err?.response?.data?.detail || err?.message || 'Action failed',
          color: 'danger',
        });
      }
    } finally {
      setSwiping(false);
    }
  };

  const profile = deck[currentIndex];

  return (
    <IonPage>
      <IonContent className="ion-padding">
        <HeaderNav activeTab="discover" unread={2} streak={4} />

        {loading && deck.length === 0 ? (
          <div className="flex items-center justify-center min-h-[60vh]">
            <IonSpinner name="crescent" />
          </div>
        ) : profile ? (
          <DiscoveryFeed
            profiles={deck}
            onLike={(p) => handleAction('like')}
            onPass={(p) => handleAction('pass')}
            onSuperSpark={(p) => handleAction('superlike')}
            onExhausted={() => {
              if (hasMore) loadDeck(cursor);
              else setDiscoverDeck([]);
            }}
          />
        ) : (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center text-gray-500">
            <IonIcon icon={heartOutline} size="large" className="mb-4" />
            <h2 className="text-lg font-medium">No one new around you</h2>
            <p className="text-sm">Check back later or expand your filters</p>
            <IonButton
              fill="outline"
              color="primary"
              className="mt-6"
              onClick={() => loadDeck(null)}
              disabled={loading}
            >
              {loading ? <IonSpinner name="crescent" /> : 'Refresh'}
            </IonButton>
          </div>
        )}

        {/* "It's a Match!" modal */}
        <IonModal
          isOpen={showMatchModal}
          onDidDismiss={() => setShowMatchModal(false)}
          backdropDismiss={false}
        >
          <div
            className="h-full flex flex-col items-center justify-center text-white p-8 text-center"
            style={{ background: 'var(--gradient-match-vertical)' }}
          >
            <IonText className="text-5xl font-bold mb-2">It&apos;s a Match!</IonText>
            <p className="text-lg opacity-90 mb-8">
              You and {matchedUser?.name || 'your match'} liked each other
            </p>
            <div className="flex gap-4 w-full">
              <IonButton
                expand="block"
                size="large"
                fill="outline"
                color="light"
                className="flex-1"
                onClick={() => setShowMatchModal(false)}
              >
                Keep Swiping
              </IonButton>
              <IonButton
                expand="block"
                size="large"
                color="light"
                className="flex-1"
                onClick={() => {
                  setShowMatchModal(false);
                  navigate('/matches');
                }}
              >
                <IonIcon icon={chatbubblesOutline} slot="start" />
                Message
              </IonButton>
            </div>
          </div>
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
      <BottomNav />
    </IonPage>
  );
};

export default Discover;
