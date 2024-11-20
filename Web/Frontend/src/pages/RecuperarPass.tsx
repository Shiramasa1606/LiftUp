import React, { useState } from 'react';
import { IonContent, IonPage, IonInput, IonButton, IonLabel, IonItem, IonFooter, IonText, IonCard, IonCardHeader, IonCardContent, IonCardTitle } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const RecuperarPass: React.FC = () => {
  const [email, setEmail] = useState('');
  const history = useHistory();
  const [message, setMessage] = useState('');

  const handleRecoverPassword = () => {
    // Lógica para enviar correo de recuperación (a implementar más adelante)
    // Aquí simplemente simularemos un mensaje de éxito
    setMessage('Correo de recuperación enviado');
  };

  const handleCancel = () => {
    setEmail(''); // Limpiar el input de email
    setMessage(''); // Borrar el mensaje
    history.push('/login'); // Cambia '/login' si tu ruta de autenticación es diferente
  };

  return (
    <IonPage>
      <Header title="Recuperar Contraseña" />
      <IonContent className="ion-padding">
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Recuperar Contraseña</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonItem>
              <IonLabel position="stacked">Correo Electrónico</IonLabel>
              <IonInput
                type="email"
                value={email}
                onIonChange={e => setEmail(e.detail.value!)}
                placeholder="Introduce tu correo electrónico"
              />
            </IonItem>

            {message && (
              <IonText color="success" style={{ marginTop: '16px', display: 'block', textAlign: 'center' }}>
                {message}
              </IonText>
            )}

            <IonButton expand="full" onClick={handleRecoverPassword} style={{ marginTop: '16px' }}>
              Recuperar Contraseña
            </IonButton>
            <IonButton expand="full" fill="clear" onClick={handleCancel} style={{ marginTop: '8px' }}>
              Cancelar
            </IonButton>
          </IonCardContent>
        </IonCard>
      </IonContent>
      <IonFooter>
        <Footer />
      </IonFooter>
    </IonPage>
  );
};

export default RecuperarPass;
