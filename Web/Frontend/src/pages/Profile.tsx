import React, { useState, useEffect } from 'react';
import { IonContent, IonPage, IonLabel, IonButton, IonAvatar, IonText, IonFooter, IonCard, IonCardContent } from '@ionic/react';
import { useHistory } from 'react-router-dom'; // Importa useHistory
import Header from '../components/Header';
import SocialLinks from '../components/SocialLinks';
import Footer from '../components/Footer';
import { UserInterface } from '../utils/interface';

const Profile: React.FC = () => {
  const [user, setUser] = useState<UserInterface | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const history = useHistory(); // Inicializa useHistory

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('access_token'); // Obtiene el token del almacenamiento local
      if (!token) {
        console.error('No se encontró el token. Redirigiendo al inicio de sesión.');
        history.push('/login'); // Redirige al inicio de sesión si no hay token
        return;
      }
  
      try {
        const response = await fetch('http://localhost:3000/user-profile', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`, // Incluye el token en el encabezado
          },
        });
  
        if (!response.ok) {
          if (response.status === 401) {
            console.error('Token inválido o expirado. Redirigiendo al inicio de sesión.');
            history.push('/login'); // Redirige si el token no es válido
          } else {
            throw new Error(`Error HTTP! Estado: ${response.status}`);
          }
        }
  
        const data = await response.json();
        setUser(data); // Carga los datos del usuario
        setIsLoading(false);
      } catch (error) {
        console.error('Error al cargar el usuario:', error);
        setIsLoading(false);
      }
    };
  
    fetchUser();
  }, [history]);
  

  if (isLoading) {
    return <IonText>Cargando...</IonText>;
  }

  if (!user) {
    return <IonText>Error al cargar el perfil</IonText>;
  }

  return (
    <IonPage>
      <Header title="Perfil" />
      <IonContent className="ion-padding">
        <IonCard>
          <IonCardContent style={{ textAlign: 'center' }}>
            {/* Muestra el nombre del usuario */}
            <div style={{ margin: '16px 0', fontSize: '24px', fontWeight: 'bold' }}>
              {user.nombreUsuario}
            </div>
            <IonButton expand="full" fill="clear" onClick={() => history.push('/edit-profile')}>
              Editar Perfil
            </IonButton>
            <div style={{ display: 'flex', justifyContent: 'center', margin: '20px 0' }}>
              <IonAvatar style={{ width: '100px', height: '100px' }}>
                <img src={user.avatar || 'https://via.placeholder.com/100'} alt="Avatar" />
              </IonAvatar>
            </div>
            <IonLabel style={{ display: 'block', marginBottom: '10px' }}>
              Proyectos Patrocinados
            </IonLabel>
            <IonText style={{ display: 'block', fontSize: '24px' }}>
              {user.proyectosPatrocinados}
            </IonText>
  
            {/* Sección de biografía */}
            <IonLabel style={{ display: 'block', marginTop: '20px', fontWeight: 'bold' }}>
              Biografía
            </IonLabel>
            <IonText style={{ display: 'block', marginTop: '10px', marginBottom: '20px' }}>
              {user.biografia || 'No se ha proporcionado una biografía.'}
            </IonText>
          </IonCardContent>
        </IonCard>
      </IonContent>
      <IonFooter>
        <Footer />
      </IonFooter>
    </IonPage>
  );
};
  
export default Profile;
