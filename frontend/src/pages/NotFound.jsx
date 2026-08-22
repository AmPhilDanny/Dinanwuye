import React from 'react';
import { IonPage, IonContent, IonButton, IonIcon, IonText } from '@ionic/react';
import { homeOutline, searchOutline, arrowBackOutline } from 'ionicons/icons';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <IonPage>
      <IonContent className="ion-padding" style={{ textAlign: 'center', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div className="mx-auto">
          <IonIcon icon={searchOutline} size="large" color="medium" style={{ fontSize: '4rem' }} className="mb-4" />
          <h1 className="text-3xl font-bold mb-2">Page Not Found</h1>
          <p className="text-gray-600 mb-6 max-w-sm mx-auto">
            Sorry, we couldn&apos;t find the page you&apos;re looking for. It might have been moved or doesn&apos;t exist.
          </p>
          <div className="flex flex-col gap-3 max-w-sm mx-auto">
            <IonButton
              expand="block"
              size="large"
              color="primary"
              className="touch-target-comfortable"
              onClick={() => navigate('/')}
            >
              <IonIcon icon={homeOutline} slot="start" />
              Go Home
            </IonButton>
            <IonButton
              expand="block"
              size="large"
              fill="outline"
              color="primary"
              className="touch-target-comfortable"
              onClick={() => navigate('/discover')}
            >
              <IonIcon icon={searchOutline} slot="start" />
              Browse Matches
            </IonButton>
            <IonButton
              expand="block"
              fill="clear"
              color="medium"
              onClick={() => window.history.back()}
            >
              <IonIcon icon={arrowBackOutline} slot="start" />
              Go Back
            </IonButton>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default NotFound;