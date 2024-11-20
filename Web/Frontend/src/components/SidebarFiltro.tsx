// src/components/SidebarFiltro.tsx
import React from 'react';
import { IonContent, IonHeader, IonList, IonItem, IonButton } from '@ionic/react';

interface FiltroSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onFilter: (filtro: string) => void;
}

const SidebarFiltro: React.FC<FiltroSidebarProps> = ({ isOpen, onClose, onFilter }) => {
  return (
    <IonContent style={{ display: isOpen ? 'block' : 'none' }}>
      <IonHeader>
        <IonButton onClick={onClose}>Cerrar</IonButton>
      </IonHeader>
      <IonList>
        <IonItem button onClick={() => onFilter('favoritos')}>
          Filtrar por Favoritos
        </IonItem>
        <IonItem button onClick={() => onFilter('seguido')}>
          Filtrar por Seguidos
        </IonItem>
        <IonItem button onClick={() => onFilter('categoria')}>
          Filtrar por Categoría
        </IonItem>
      </IonList>
    </IonContent>
  );
};

export default SidebarFiltro;
