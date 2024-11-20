// src/pages/Auth.tsx

import React, { useState, useEffect } from 'react';
import { IonContent, IonPage, IonSegment, IonSegmentButton, IonLabel, IonFooter } from '@ionic/react';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './Auth.css';

interface AuthProps {
  mode: 'login' | 'register'; // Recibe la prop "mode" para saber qué formulario mostrar
}

const Auth: React.FC<AuthProps> = ({ mode }) => {
  const [currentMode, setCurrentMode] = useState<'login' | 'register'>(mode);

  useEffect(() => {
    // Solo actualiza la URL sin recargar la página
    const newUrl = currentMode === 'login' ? '/login' : '/register';
    window.history.pushState({}, '', newUrl);
  }, [currentMode]);

  const handleSegmentChange = (e: CustomEvent) => {
    setCurrentMode(e.detail.value as 'login' | 'register');
  };

  return (
    <IonPage>
      <Header title='' /> {/* Sin isLoggedIn */}

      <IonContent className="ion-padding">
        <IonSegment value={currentMode} onIonChange={handleSegmentChange}>
          <IonSegmentButton value="login">
            <IonLabel>Iniciar Sesión</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="register">
            <IonLabel>Registrarse</IonLabel>
          </IonSegmentButton>
        </IonSegment>
        <div className="form-container">
          {currentMode === 'login' ? <LoginForm mode={currentMode} /> : <RegisterForm mode={currentMode} />}
        </div>
      </IonContent>

      <IonFooter>
        <Footer />
      </IonFooter>
    </IonPage>
  );
};

export default Auth;
