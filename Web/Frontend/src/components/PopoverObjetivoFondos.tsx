import React, { useState } from 'react';
import { IonPopover, IonContent, IonInput, IonButton, IonLabel } from '@ionic/react';

interface PopoverObjetivoFondosProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (valor: number) => void; // Recibe la función para manejar la selección
}

const PopoverObjetivoFondos: React.FC<PopoverObjetivoFondosProps> = ({ isOpen, onClose, onSelect }) => {
  const [valor, setValor] = useState<number | ''>('');

  const handleAceptar = () => {
    if (valor !== '') {
      onSelect(valor); // Llamamos a onSelect con el valor elegido
    }
    onClose(); // Cierra el popover, independientemente de si seleccionaron o no
  };

  return (
    <IonPopover isOpen={isOpen} onDidDismiss={onClose}>
      <IonContent className="ion-padding">
        <IonLabel>Introduce el objetivo de fondos</IonLabel>
        <IonInput 
          type="number" 
          value={valor !== '' ? valor : ''} 
          onIonChange={e => setValor(parseFloat(e.detail.value!) || '')} 
          placeholder="Ej: 1000" 
        />
        <IonButton expand="full" onClick={handleAceptar}>Aceptar</IonButton>
        <IonButton expand="full" color="light" onClick={onClose}>Cancelar</IonButton>
      </IonContent>
    </IonPopover>
  );
};

export default PopoverObjetivoFondos;
