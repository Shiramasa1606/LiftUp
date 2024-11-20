import React, { useState } from 'react';
import { IonHeader, IonToolbar, IonTitle, IonImg, IonButtons, IonIcon, IonButton, IonSearchbar } from '@ionic/react';
import { personCircle, filter } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SidebarUsuario from './SidebarUsuario';
import './Header.css';

const Header: React.FC<{ title: string; onFilterClick?: () => void }> = ({ title, onFilterClick }) => {
  const history = useHistory();
  const { isLoggedIn } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');

  const handleIconClick = () => {
    if (isLoggedIn) {
      const menu = document.querySelector('ion-menu');
      menu?.toggle();
    } else {
      history.push('/login');
    }
  };

  return (
    <>
      <IonHeader>
        <IonToolbar className="toolbar">
          <div className="logo-container">
            <IonImg 
              src="https://via.placeholder.com/150" 
              alt="LiftUp Placeholder Logo" 
              className="logo" 
              onClick={() => history.push('/home')}
            />
          </div>
          <IonTitle className="header-title">{title}</IonTitle>
          
          <IonButtons slot="end">
            <IonButton onClick={handleIconClick}>
              <IonIcon icon={personCircle} size="large" />
            </IonButton>
            {onFilterClick && (
              <IonButton onClick={onFilterClick}>
                <IonIcon icon={filter} size="large" />
              </IonButton>
            )}
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <SidebarUsuario />
    </>
  );
};

export default Header;
