import React, { useState, useEffect } from 'react';
import { IonContent, IonPage, IonInput, IonButton, IonAvatar, IonItem, IonLabel, IonFooter, IonTextarea, IonRow, IonCol } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { UserInterface, SocialLinks } from '../utils/interface';
import './EditProfile.css';

const EditProfile: React.FC = () => {
  const [user, setUser] = useState<UserInterface | null>(null);
  const [newName, setNewName] = useState('');
  const [newBio, setNewBio] = useState('');
  const [newAvatarUrl, setNewAvatarUrl] = useState('');
  const [newSocialLinks, setNewSocialLinks] = useState<SocialLinks>({
    facebook: '',
    twitter: '',
    instagram: '',
    linkedin: '',
    project: '',
  });

  const history = useHistory();

  // Cargar datos del usuario
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('access_token'); // Obtén el token
      if (!token) {
        console.error('No se encontró el token. Redirigiendo al inicio de sesión.');
        history.push('/login'); // Redirige al login si no hay token
        return;
      }

      try {
        const response = await fetch('http://localhost:3000/user-profile', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`, // Incluye el token en los headers
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            console.error('Token inválido o expirado. Redirigiendo al inicio de sesión.');
            history.push('/login');
          } else {
            throw new Error(`Error HTTP! Estado: ${response.status}`);
          }
        }

        const data = await response.json();
        setUser(data);
        setNewName(data.name);
        setNewBio(data.bio);
        setNewAvatarUrl(data.avatarUrl);
        setNewSocialLinks(data.socialLinks || {});
      } catch (error) {
        console.error('Error al obtener los datos del usuario:', error);
      }
    };

    fetchUser();
  }, [history]);

  // Guardar cambios
  const handleSaveChanges = async () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      console.error('No se encontró el token.');
      return;
    }

    const updatedUser = {
      nombreUsuario: newName,
      biografia: newBio,
      avatar: newAvatarUrl,
      socialLinks: newSocialLinks,
    };

    try {
      const response = await fetch('http://localhost:3000/edit-profile', {
        method: 'PUT', // Usa PUT o PATCH según lo que soporte tu API
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedUser),
      });

      if (!response.ok) {
        throw new Error(`Error al guardar los cambios: ${response.status}`);
      }

      alert('Cambios guardados exitosamente');
      history.push('/profile'); // Redirige a la página de perfil
    } catch (error) {
      console.error('Error al guardar los cambios:', error);
      alert('Ocurrió un error al guardar los cambios.');
    }
  };

  // Manejar cambios en los enlaces sociales
  const handleSocialLinkChange = (field: keyof SocialLinks, value: string) => {
    setNewSocialLinks({ ...newSocialLinks, [field]: value });
  };

  // Cancelar y volver al perfil
  const handleCancel = () => {
    history.push('/profile');
  };

  return (
    <IonPage>
      <Header title="Editar Perfil" />
      <IonContent className="ion-padding">
        {user && (
          <div className="form-container">
            {/* Nombre */}
            <IonItem>
              <IonLabel position="stacked">Nombre</IonLabel>
              <IonInput value={newName} onIonChange={e => setNewName(e.detail.value!)} />
            </IonItem>

            {/* Biografía */}
            <IonItem>
              <IonLabel position="stacked">Biografía</IonLabel>
              <IonTextarea value={newBio} onIonChange={e => setNewBio(e.detail.value!)} />
            </IonItem>

            {/* Avatar */}
            <IonItem>
              <IonLabel position="stacked">Avatar</IonLabel>
              <IonAvatar style={{ marginTop: '10px' }}>
                <img src={newAvatarUrl} alt="Avatar" />
              </IonAvatar>
              <IonInput
                placeholder="URL de la imagen"
                value={newAvatarUrl}
                onIonChange={e => setNewAvatarUrl(e.detail.value!)}
              />
            </IonItem>

            {/* Redes sociales */}
            <IonLabel className="social-title">Redes Sociales</IonLabel>
            {['facebook', 'twitter', 'instagram', 'linkedin', 'project'].map(field => (
              <IonItem key={field}>
                <IonLabel position="stacked">{field.charAt(0).toUpperCase() + field.slice(1)}</IonLabel>
                <IonInput
                  placeholder={`URL de ${field.charAt(0).toUpperCase() + field.slice(1)}`}
                  value={(newSocialLinks as any)[field]} // Acceso dinámico al campo
                  onIonChange={e => handleSocialLinkChange(field as keyof SocialLinks, e.detail.value!)}
                />
              </IonItem>
            ))}

            {/* Botones */}
            <IonRow style={{ marginTop: '20px', justifyContent: 'space-between' }}>
              <IonCol>
                <IonButton expand="full" color="danger" onClick={handleCancel}>
                  Cancelar
                </IonButton>
              </IonCol>
              <IonCol>
                <IonButton expand="full" onClick={handleSaveChanges}>
                  Guardar Cambios
                </IonButton>
              </IonCol>
            </IonRow>
          </div>
        )}
      </IonContent>
      <IonFooter>
        <Footer />
      </IonFooter>
    </IonPage>
  );
};

export default EditProfile;
