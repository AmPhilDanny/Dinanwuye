import React, { useState } from 'react';
import { IonPage, IonContent } from '@ionic/react';
import HeaderNav from '@components/HeaderNav';
import BottomNav from '@components/BottomNav';
import ProfileAndSettings from '@components/ProfileAndSettings';
import { DEFAULT_USER } from '@utils/constants';

const Profile = () => {
  const [user, setUser] = useState(DEFAULT_USER);

  return (
    <IonPage>
      <IonContent className="ion-padding">
        <HeaderNav activeTab="profile" unread={0} streak={1} />
        <div className="pt-2">
          <ProfileAndSettings user={user} onChange={setUser} />
        </div>
      </IonContent>
      <BottomNav />
    </IonPage>
  );
};

export default Profile;