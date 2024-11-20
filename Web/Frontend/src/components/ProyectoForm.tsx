import React, { useState, useEffect } from 'react';
import { IonContent, IonInput, IonLabel, IonTextarea, IonCard, IonCardContent, IonButton } from '@ionic/react';
import Calendario from '../components/Calendario';
import PopoverObjetivoFondos from '../components/PopoverObjetivoFondos';
import SeleccionarCategoria from '../components/SeleccionarCategoria';
import './ProyectoForm.css'; // Asegúrate de importar el CSS

interface ProyectoFormProps {
  initialData?: {
    titulo: string;
    categoria: string;
    descripcion: string;
    objetivoFondos: number | '';
    fechaTermino?: string;
  };
  onSubmit: (proyecto: any) => void;
  setSubmitDisabled: (disabled: boolean) => void;
  submitButtonLabel: string;
  onCancel: () => void;
}

const ProyectoForm: React.FC<ProyectoFormProps> = ({ initialData, onSubmit, setSubmitDisabled, submitButtonLabel, onCancel }) => {
  const [titulo, setTitulo] = useState(initialData?.titulo || '');
  const [categoria, setCategoria] = useState(initialData?.categoria || '');
  const [descripcion, setDescripcion] = useState(initialData?.descripcion || '');
  const [objetivoFondos, setObjetivoFondos] = useState<number | ''>(initialData?.objetivoFondos || ''); 
  const [fechaTermino, setFechaTermino] = useState<string | undefined>(initialData?.fechaTermino);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showPopover, setShowPopover] = useState(false);
  const [formMessage, setFormMessage] = useState<string>(''); // Estado para el mensaje de la respuesta del POST
  const [categorias, setCategorias] = useState<{ id: number, nombre: string }[]>([]);
  const [apiUrl, setApiUrl] = useState('http://localhost:3000/crear-proyecto'); // Estado para gestionar la URL de la API

  // Cargar categorías cuando se cambia la URL temporalmente
  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await fetch('http://localhost:3000/categorias'); // Usamos la URL para categorías
        const data = await response.json();
        setCategorias(data); // Aquí estamos asumiendo que las categorías vienen directamente en el array
      } catch (error) {
        console.error('Error al cargar las categorías:', error);
      }
    };

    if (apiUrl === 'http://localhost:3000/categorias') {
      fetchCategorias(); // Cargar categorías si estamos en la URL temporal
    }
  }, [apiUrl]); // Solo se ejecuta cuando `apiUrl` cambia

  // Actualizar el estado de submitDisabled
  useEffect(() => {
    setSubmitDisabled(!titulo || !categoria || !descripcion || objetivoFondos === '');
  }, [titulo, categoria, descripcion, objetivoFondos, setSubmitDisabled]);

  // Función para manejar cuando el usuario selecciona una categoría
  const handleCategoriaSelect = (selectedCategoria: string) => {
    setCategoria(selectedCategoria);
    setApiUrl('http://localhost:3000/crear-proyecto'); // Restablecemos la URL a /crear-proyecto
  };

  // Función para manejar cuando el usuario selecciona un objetivo de fondos
  const handleObjetivoSelect = (selectedObjetivo: number) => {
    setObjetivoFondos(selectedObjetivo);  // Actualizamos el objetivo de fondos
    setShowPopover(false);  // Cerramos el popover después de seleccionar el valor
  };

  // Función para manejar el envío del formulario
  const handleSubmit = () => {
    // Validación de campos obligatorios
    if (!titulo || !categoria || !descripcion || objetivoFondos === '' || objetivoFondos === null) {
      setFormMessage('Por favor, completa todos los campos obligatorios.');
      return;
    }

    // Enviar los datos, asegurándonos de que `fechaTermino` sea null si no se seleccionó
    const proyecto = {
      titulo,
      categoria,
      descripcion,
      objetivoFondos,
      fechaTermino: fechaTermino ? fechaTermino : null,  // Si no hay fecha, enviamos null
    };

    // Llamar al onSubmit del componente padre
    onSubmit(proyecto);
  };

  return (
    <IonContent className="ion-padding centered-form">
      <IonCard className="centered-card">
        <IonCardContent className="ion-text-center">
          {/* Campos del formulario */}
          <div className="ion-margin-vertical">
            <IonLabel className="label-strong ion-text-center">Título del Proyecto</IonLabel>
            <IonInput 
              value={titulo} 
              onIonChange={e => setTitulo(e.detail.value!)} 
              placeholder="Escribe el título" 
              clearInput 
            />
          </div>

          {/* No modificar este bloque */}
          <SeleccionarCategoria 
            value={categoria} 
            onChange={handleCategoriaSelect} // Cuando se seleccione la categoría, llamamos a esta función
            onClick={() => setApiUrl('http://localhost:3000/categorias')} // Cambiar la URL temporalmente a /categorias cuando se haga clic
          />
          {/* Fin de bloque no modificado */}

          <div className="ion-margin-vertical">
            <IonLabel className="label-strong ion-text-center">Descripción del Proyecto</IonLabel>
            <IonTextarea 
              value={descripcion} 
              onIonChange={e => setDescripcion(e.detail.value!)} 
              placeholder="Escribe una descripción" 
            />
          </div>

          <div className="ion-margin-vertical">
            <IonLabel className="label-strong ion-text-center">Objetivo de Fondos</IonLabel>
            <IonInput 
              value={objetivoFondos !== '' ? `${objetivoFondos} $` : ''}
              readonly 
              placeholder="Selecciona el objetivo de fondos"
              onClick={() => setShowPopover(true)} 
            />
          </div>

          <div className="ion-margin-vertical">
            <IonLabel className="label-strong ion-text-center">Fecha de Término (opcional)</IonLabel>
            <IonInput
              value={fechaTermino ? new Date(fechaTermino).toLocaleDateString() : ''}
              placeholder="Selecciona una fecha"
              onClick={() => setShowCalendar(true)}
              readonly 
            />
            {showCalendar && (
              <Calendario
                isOpen={showCalendar}
                onClose={() => setShowCalendar(false)} 
                onDateSelected={(date) => {
                  setFechaTermino(date);
                  setShowCalendar(false);
                }} 
              />
            )}
          </div>

          {/* Botones de acción en la misma fila */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
            <IonButton color="danger" onClick={onCancel}>
              Cancelar
            </IonButton>
            <IonButton onClick={handleSubmit} disabled={!titulo || !categoria || !descripcion || objetivoFondos === ''}>
              {submitButtonLabel}
            </IonButton>
          </div>

          {/* Mostrar el mensaje debajo de los botones */}
          {formMessage && (
            <div style={{ marginTop: '20px', textAlign: 'center' }}>
              <p>{formMessage}</p>
            </div>
          )}
        </IonCardContent>
      </IonCard>

      <PopoverObjetivoFondos 
        isOpen={showPopover} 
        onClose={() => setShowPopover(false)} 
        onSelect={handleObjetivoSelect}  // Pasamos la función para manejar la selección del objetivo de fondos
      />
    </IonContent>
  );
};

export default ProyectoForm;
