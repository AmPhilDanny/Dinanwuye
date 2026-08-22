import React from 'react';
import { IonPage, IonContent, IonButton, IonIcon, IonItem, IonLabel, IonToggle, IonList, IonText, IonAvatar, IonGrid, IonRow, IonCol, IonBadge } from '@ionic/react';
import { personOutline, notificationsOutline, shieldOutline, lockClosedOutline, helpOutline, logOutOutline, moonOutline, languageOutline, cardOutline, heartOutline, cogOutline } from 'ionicons/icons';

const Settings = () => {
  const [notifications, setNotifications] = React.useState(true);
  const [darkMode, setDarkMode] = React.useState(false);
  const [showOnline, setShowOnline] = React.useState(true);
  const [showDistance, setShowDistance] = React.useState(true);

  return (
    <IonPage>
      <IonContent className="ion-padding">
        <div className="max-w-md mx-auto">
          <h1 className="text-2xl font-bold mb-6">Settings</h1>

          <IonList lines="inset" className="mb-6">
            <IonItem lines="none">
              <IonAvatar slot="start">
                <span className="text-2xl">👤</span>
              </IonAvatar>
              <IonLabel>
                <h3 className="font-semibold">Chinelo</h3>
                <p className="text-sm text-gray-500">chinelo@example.com</p>
              </IonLabel>
              <IonBadge color="primary">Premium</IonBadge>
            </IonItem>
          </IonList>

          <div className="space-y-4 mb-6">
            <h2 className="text-lg font-semibold text-gray-500 uppercase tracking-wide">Account</h2>
            <IonList lines="inset">
              <IonItem lines="none" button>
                <IonIcon icon={personOutline} slot="start" color="primary" />
                <IonLabel>Edit Profile</IonLabel>
                <IonIcon icon={heartOutline} slot="end" color="medium" />
              </IonItem>
              <IonItem lines="none" button>
                <IonIcon icon={cardOutline} slot="start" color="primary" />
                <IonLabel>Subscription</IonLabel>
                <IonIcon icon={heartOutline} slot="end" color="medium" />
              </IonItem>
              <IonItem lines="none" button>
                <IonIcon icon={shieldOutline} slot="start" color="primary" />
                <IonLabel>Verification</IonLabel>
                <IonIcon icon={heartOutline} slot="end" color="medium" />
              </IonItem>
              <IonItem lines="none" button>
                <IonIcon icon={lockClosedOutline} slot="start" color="primary" />
                <IonLabel>Privacy & Safety</IonLabel>
                <IonIcon icon={heartOutline} slot="end" color="medium" />
              </IonItem>
            </IonList>
          </div>

          <div className="space-y-4 mb-6">
            <h2 className="text-lg font-semibold text-gray-500 uppercase tracking-wide">Notifications</h2>
            <IonList lines="inset">
              <IonItem lines="none">
                <IonIcon icon={notificationsOutline} slot="start" color="primary" />
                <IonLabel>Push Notifications</IonLabel>
                <IonToggle slot="end" checked={notifications} onIonChange={(e) => setNotifications(e.detail.checked)} color="primary" />
              </IonItem>
              <IonItem lines="none">
                <IonIcon icon={notificationsOutline} slot="start" color="primary" />
                <IonLabel>Email Notifications</IonLabel>
                <IonToggle slot="end" checked={true} onIonChange={(e) => console.log(e.detail.checked)} color="primary" />
              </IonItem>
              <IonItem lines="none">
                <IonIcon icon={notificationsOutline} slot="start" color="primary" />
                <IonLabel>SMS Notifications</IonLabel>
                <IonToggle slot="end" checked={false} onIonChange={(e) => console.log(e.detail.checked)} color="primary" />
              </IonItem>
            </IonList>
          </div>

          <div className="space-y-4 mb-6">
            <h2 className="text-lg font-semibold text-gray-500 uppercase tracking-wide">Privacy</h2>
            <IonList lines="inset">
              <IonItem lines="none">
                <IonIcon icon={personOutline} slot="start" color="primary" />
                <IonLabel>Show Online Status</IonLabel>
                <IonToggle slot="end" checked={showOnline} onIonChange={(e) => setShowOnline(e.detail.checked)} color="primary" />
              </IonItem>
              <IonItem lines="none">
                <IonIcon icon={personOutline} slot="start" color="primary" />
                <IonLabel>Show Distance</IonLabel>
                <IonToggle slot="end" checked={showDistance} onIonChange={(e) => setShowDistance(e.detail.checked)} color="primary" />
              </IonItem>
              <IonItem lines="none" button>
                <IonIcon icon={shieldOutline} slot="start" color="primary" />
                <IonLabel>Blocked Users</IonLabel>
                <IonIcon icon={heartOutline} slot="end" color="medium" />
              </IonItem>
              <IonItem lines="none" button color="danger">
                <IonIcon icon={logOutOutline} slot="start" />
                <IonLabel>Delete Account</IonLabel>
              </IonItem>
            </IonList>
          </div>

          <div className="space-y-4 mb-6">
            <h2 className="text-lg font-semibold text-gray-500 uppercase tracking-wide">Preferences</h2>
            <IonList lines="inset">
              <IonItem lines="none">
                <IonIcon icon={moonOutline} slot="start" color="primary" />
                <IonLabel>Dark Mode</IonLabel>
                <IonToggle slot="end" checked={darkMode} onIonChange={(e) => setDarkMode(e.detail.checked)} color="primary" />
              </IonItem>
              <IonItem lines="none" button>
                <IonIcon icon={languageOutline} slot="start" color="primary" />
                <IonLabel>Language</IonLabel>
                <IonBadge slot="end" color="light">English</IonBadge>
              </IonItem>
            </IonList>
          </div>

          <div className="space-y-4 mb-6">
            <h2 className="text-lg font-semibold text-gray-500 uppercase tracking-wide">Support</h2>
            <IonList lines="inset">
              <IonItem lines="none" button>
                <IonIcon icon={helpOutline} slot="start" color="primary" />
                <IonLabel>Help Center</IonLabel>
                <IonIcon icon={heartOutline} slot="end" color="medium" />
              </IonItem>
              <IonItem lines="none" button>
                <IonIcon icon={helpOutline} slot="start" color="primary" />
                <IonLabel>Contact Support</IonLabel>
                <IonIcon icon={heartOutline} slot="end" color="medium" />
              </IonItem>
              <IonItem lines="none" button>
                <IonIcon icon={helpOutline} slot="start" color="primary" />
                <IonLabel>Terms of Service</IonLabel>
                <IonIcon icon={heartOutline} slot="end" color="medium" />
              </IonItem>
              <IonItem lines="none" button>
                <IonIcon icon={helpOutline} slot="start" color="primary" />
                <IonLabel>Privacy Policy</IonLabel>
                <IonIcon icon={heartOutline} slot="end" color="medium" />
              </IonItem>
            </IonList>
          </div>

          <IonButton
            expand="block"
            fill="outline"
            color="danger"
            className="touch-target-comfortable"
            onClick={() => console.log('Logout')}
          >
            <IonIcon icon={logOutOutline} slot="start" />
            Log Out
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Settings;