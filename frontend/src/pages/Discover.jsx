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
import { photoUrl } from '@utils/photoUrl';

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
  const [matchedUser, setMatchedUser] = useState(null);
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [toast, setToast] = useState({ open: false, message: '', color: 'danger' });
  const [likesRemaining, setLikesRemaining] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [streak, setStreak] = useState(0);
  const [viewedProfiles, setViewedProfiles] = useState([]);
  const [showViewed, setShowViewed] = useState(false);
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

  const loadViewedProfiles = async () => {
    try {
      const { data } = await matchingApi.getViewed();
      setViewedProfiles(data || []);
      setShowViewed(true);
    } catch (err) {
      setToast({
        open: true,
        message: 'Could not load viewed profiles',
        color: 'danger',
      });
    }
  };

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
      <IonContent className="ion-padding" scrollY={false}>
        <div className="lg:pl-64">
          <HeaderNav activeTab="discover" unread={unreadCount} streak={streak} />
        </div>

        <div className="lg:pl-64">
        {showViewed ? (
          <div className="flex flex-col gap-3 px-4 pt-2">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-foreground">Previously Viewed</h2>
              <button
                onClick={() => setShowViewed(false)}
                className="text-sm font-semibold text-primary"
              >
                Back to Discover
              </button>
            </div>
            {viewedProfiles.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No viewed profiles yet</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {viewedProfiles.map((profile) => (
                  <div
                    key={profile.user_id}
                    className="relative overflow-hidden rounded-2xl bg-white shadow-md dark:bg-gray-800"
                  >
                    <div className="aspect-[3/4] w-full">
                      {profile.photo ? (
                        <img
                          src={photoUrl(profile.photo)}
                          alt={profile.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary to-secondary">
                          <span className="text-3xl font-bold text-white">
                            {(profile.name || '?').split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                      <p className="text-sm font-bold text-white">{profile.name}, {profile.age}</p>
                      <p className="text-xs text-white/80">{profile.location || 'Unknown'}</p>
                      <span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                        profile.action === 'like' ? 'bg-emerald-500/80 text-white' :
                        profile.action === 'superlike' ? 'bg-blue-500/80 text-white' :
                        'bg-gray-500/80 text-white'
                      }`}>
                        {profile.action === 'like' ? 'Liked' : profile.action === 'superlike' ? 'Super Liked' : 'Passed'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : loading && deck.length === 0 ? (
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
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center text-gray-600">
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
            <IonButton
              fill="clear"
              color="medium"
              className="mt-2"
              onClick={loadViewedProfiles}
            >
              View Previously Seen
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
        </div>{/* end lg:pl-64 */}
      </IonContent>
      <BottomNav unread={unreadCount} />
    </IonPage>
  );
};

export default Discover;
