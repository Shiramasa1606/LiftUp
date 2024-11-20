import React, { useState, useEffect } from 'react';
import { IonSelect, IonSelectOption, IonLabel } from '@ionic/react';

interface SeleccionarCategoriaProps {
  value: string;
  onChange: (value: string) => void;
  onClick: () => void;  // Añadimos esta función para cambiar la URL temporalmente
}

const SeleccionarCategoria: React.FC<SeleccionarCategoriaProps> = ({ value, onChange, onClick }) => {
  const [categorias, setCategorias] = useState<{ id: number, nombre: string }[]>([]);

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await fetch('http://localhost:3000/categorias');
        const data = await response.json();
        setCategorias(data || []); // Asegúrate de que la respuesta tenga el campo correcto
      } catch (error) {
        console.error('Error al cargar las categorías:', error);
      }
    };

    fetchCategorias();
  }, []);

  return (
    <div className="ion-margin-vertical">
      <IonLabel className="label-strong ion-text-center">Categoría del Proyecto</IonLabel>
      <IonSelect
        value={value}
        placeholder="Selecciona una categoría"
        onIonChange={e => {
          onChange(e.detail.value);
          onClick();  // Llamamos a la función onClick para cambiar la URL temporalmente
        }}
      >
        {categorias.map(categoria => (
          <IonSelectOption key={categoria.id} value={categoria.nombre}>
            {categoria.nombre}
          </IonSelectOption>
        ))}
      </IonSelect>
    </div>
  );
};

export default SeleccionarCategoria;
