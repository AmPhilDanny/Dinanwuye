import React from 'react';
import { IonPage, IonContent, IonButton, IonIcon, IonText, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCardSubtitle, IonGrid, IonRow, IonCol, IonBadge, IonItem, IonLabel } from '@ionic/react';
import { flashOutline, heartOutline, personAddOutline, eyeOutline, chatbubblesOutline, trophyOutline, lockClosedOutline, sparklesOutline } from 'ionicons/icons';

const Premium = () => {
  const plans = [
    {
      id: 'monthly',
      name: 'Monthly',
      price: '$9.99',
      period: '/month',
      features: [
        'Unlimited likes',
        'See who likes you',
        '5 Super Likes/week',
        '1 Boost/month',
        'Read receipts',
        'Incognito mode',
        'Advanced filters',
      ],
      popular: false,
    },
    {
      id: 'quarterly',
      name: 'Quarterly',
      price: '$24.99',
      period: '/3 months',
      features: [
        'Everything in Monthly',
        'Save 17%',
        'Priority support',
        'Profile highlight',
      ],
      popular: true,
    },
    {
      id: 'yearly',
      name: 'Yearly',
      price: '$79.99',
      period: '/year',
      features: [
        'Everything in Quarterly',
        'Save 33%',
        '2 Boosts/month',
        '10 Super Likes/week',
        'Match guarantee',
      ],
      popular: false,
    },
  ];

  const aLaCarte = [
    { id: 'boost', name: 'Boost', price: '$2.99', icon: flashOutline, desc: 'Be top profile for 30 min' },
    { id: 'superlikes', name: 'Super Likes (5)', price: '$4.99', icon: heartOutline, desc: 'Stand out from the crowd' },
    { id: 'see_likes', name: 'See Who Likes You', price: '$9.99', icon: eyeOutline, desc: 'Instantly view your admirers' },
  ];

  return (
    <IonPage>
      <IonContent className="ion-padding">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <IonIcon icon={sparklesOutline} size="large" color="primary" className="mb-2" style={{ fontSize: '3rem' }} />
            <h1 className="text-2xl font-bold">Dinanwuye Premium</h1>
            <p className="text-gray-600 mt-1">Unlock the full experience</p>
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-500 uppercase tracking-wide mb-3">Subscription Plans</h2>
            <IonGrid>
              {plans.map((plan) => (
                <IonCol key={plan.id} size="12" size-md="4">
                  <IonCard className={`h-full ${plan.popular ? 'border-2 border-primary relative' : ''}`}>
                    {plan.popular && (
                      <IonBadge color="primary" className="absolute -top-2 left-1/2 -translate-x-1/2">
                        Most Popular
                      </IonBadge>
                    )}
                    <IonCardHeader className="text-center pb-2">
                      <IonCardTitle>{plan.name}</IonCardTitle>
                      <IonCardSubtitle className="text-3xl font-bold text-primary">
                        {plan.price}<span className="text-base font-normal text-gray-500">{plan.period}</span>
                      </IonCardSubtitle>
                    </IonCardHeader>
                    <IonCardContent>
                      <ul className="space-y-2 mb-4">
                        {plan.features.map((feature, i) => (
                          <li key={i} className="flex items-center gap-2 text-sm">
                            <IonIcon icon={sparklesOutline} size="small" color="success" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                      <IonButton
                        expand="block"
                        size="large"
                        color={plan.popular ? 'primary' : 'light'}
                        className="touch-target-comfortable"
                        onClick={() => console.log('Subscribe:', plan.id)}
                      >
                        {plan.popular ? 'Get Started' : 'Select'}
                      </IonButton>
                    </IonCardContent>
                  </IonCard>
                </IonCol>
              ))}
            </IonGrid>
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-500 uppercase tracking-wide mb-3">À La Carte</h2>
            <IonGrid>
              {aLaCarte.map((item) => (
                <IonCol key={item.id} size="12" size-md="4">
                  <IonCard className="h-full">
                    <IonCardContent className="text-center py-4">
                      <IonIcon icon={item.icon} size="large" color="primary" className="mb-2" />
                      <IonCardTitle>{item.name}</IonCardTitle>
                      <IonCardSubtitle className="text-2xl font-bold text-primary">{item.price}</IonCardSubtitle>
                      <p className="text-sm text-gray-500 mt-1">{item.desc}</p>
                      <IonButton
                        expand="block"
                        fill="outline"
                        color="primary"
                        className="mt-3 touch-target-comfortable"
                        onClick={() => console.log('Buy:', item.id)}
                      >
                        Purchase
                      </IonButton>
                    </IonCardContent>
                  </IonCard>
                </IonCol>
              ))}
            </IonGrid>
          </div>

          <IonText className="text-center text-xs text-gray-500">
            Payments processed securely via Stripe & Paystack. Auto-renews unless cancelled 24h before period ends.
          </IonText>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Premium;