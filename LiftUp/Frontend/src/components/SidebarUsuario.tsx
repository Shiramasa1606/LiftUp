// src/components/SidebarUsuario.tsx

import React from 'react';
import { IonContent, IonHeader, IonMenu, IonToolbar, IonTitle, IonItem, IonLabel } from '@ionic/react';
import MenuItem from './MenuItem'; // Asegúrate de que este componente existe
import { useAuth } from '../context/AuthContext'; // Importa el contexto de autenticación
import { useHistory } from 'react-router-dom'; // Importa el hook para redirección
import './SidebarUsuario.css'; // Asegúrate de que los estilos estén bien aplicados

const SidebarUsuario: React.FC = () => {
  const { logout } = useAuth(); // Obtén la función de logout
  const history = useHistory(); // Obtén el hook de history para redirigir

  const handleLogout = () => {
    const menu = document.querySelector('ion-menu');
    menu?.close(); // Cierra la sidebar antes de redirigir
    logout(); // Llama a la función de cierre de sesión
    history.push('/login'); // Redirige a la página de inicio de sesión
  };

  return (
    <IonMenu side="end" contentId="main-content">
      <IonHeader>
        <IonToolbar>
          <IonTitle>Menú</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div className="profile-header">
          <img src="Images/Profile Icon.svg" alt="Foto de Perfil" className="profile-pic" />
          <p className="profile-name">Nombre del Usuario</p>
          <p className="profile-email">correo@ejemplo.com</p>
        </div>
        <div className="profile-nav">
          <MenuItem icon="Images/person-fill.svg" label="Mi Perfil" link="/profile" />
          <MenuItem icon="Images/file-earmark.svg" label="Mis Proyectos" link="/misProyectos" />
          <MenuItem icon="Images/bookmarks.svg" label="Proyectos Seguidos" link="/proyectosSeguidos" />
          <MenuItem icon="Images/search.svg" label="Buscar Proyectos" link="/buscador-proyectos" />
          <MenuItem icon="Images/plus-circle.svg" label="Crear Proyecto" link="/crear-proyecto" />
          <MenuItem icon="Images/gear-fill.svg" label="Configuración" link="/configuracion" />
          <MenuItem icon="Images/envelope.svg" label="Contáctanos" link="/contacto" />
          <MenuItem icon="Images/question-circle.svg" label="Ayuda y FAQ" link="/ayuda" />

          <IonItem button onClick={handleLogout}>
            <IonLabel>Cerrar Sesión</IonLabel>
          </IonItem>
        </div>
      </IonContent>
    </IonMenu>
  );
};

export default SidebarUsuario;
