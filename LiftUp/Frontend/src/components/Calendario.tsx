import React, { useState } from 'react';
import { IonDatetime, IonCard } from '@ionic/react';
import './Calendario.css'; // Estilos para el calendario

interface CalendarioProps {
  isOpen: boolean;
  onClose: () => void;
  onDateSelected: (date: string) => void;
}

const Calendario: React.FC<CalendarioProps> = ({ isOpen, onClose, onDateSelected }) => {
  const [fechaSeleccionada, setFechaSeleccionada] = useState<string | undefined>(undefined);

  const handleDateChange = (e: CustomEvent) => {
    const selectedDate = e.detail.value as string; // Obtén la fecha seleccionada
    setFechaSeleccionada(selectedDate); // Actualiza el estado con la fecha seleccionada
    onDateSelected(selectedDate); // Pasar la fecha seleccionada al padre
    onClose(); // Cerrar el calendario
  };

  const handleCancel = () => {
    setFechaSeleccionada(undefined); // Limpiar la fecha seleccionada
    onClose(); // Cerrar el calendario
  };

  return (
    <IonCard className="calendar-overlay" style={{ display: isOpen ? 'block' : 'none' }}>
      <IonDatetime
        value={fechaSeleccionada}
        onIonChange={handleDateChange} // Manejar el cambio de fecha
        presentation="date"
        showDefaultButtons={true} // Mostrar botones por defecto (Done y Cancel)
        showClearButton={true} // Mostrar botón de limpiar
        min={new Date().toISOString()} // Restringir fechas pasadas y la fecha actual
        onIonCancel={handleCancel} // Manejar evento de cancelación
      />
    </IonCard>
  );
};

export default Calendario;
