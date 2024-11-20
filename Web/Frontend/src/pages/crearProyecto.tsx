import React, { useState } from 'react';
import { IonPage, IonButton, IonFooter, IonToast, IonInput, IonLabel, IonDatetime } from '@ionic/react';
import { useHistory } from 'react-router-dom'; // Importamos useHistory
import Header from '../components/Header';
import ProyectoForm from '../components/ProyectoForm';
import Footer from '../components/Footer';

const CrearProyecto: React.FC = () => {
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [formData, setFormData] = useState({
    nombre: '',
    montoObjetivo: 0,
    descripcion: '',
    categoria: '',
    fechaLimite: '', // Deja el valor como vacío para ser opcional
  });
  const history = useHistory(); // Usamos useHistory para redirigir

  const handleCreateProject = async (proyecto: any) => {
    // Si fechaLimite está vacía, la omitimos en el cuerpo de la solicitud
    const proyectoConFechaLimite = {
      ...proyecto,
      fechaLimite: proyecto.fechaLimite ? proyecto.fechaLimite : null, // Si no se ingresa fecha, la dejamos como null
    };

    const jsonString = JSON.stringify(proyectoConFechaLimite);
    console.log(jsonString);

    try {
      const token = localStorage.getItem('access_token');
      console.log("Token desde localStorage:", token);

      if (!token) {
        console.error('No se encontró el token de acceso');
        return;
      }

      // Hacer la solicitud POST con el token JWT
      const response = await fetch('http://localhost:3000/crear-proyecto', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,  // Incluir el token si existe
        },
        body: jsonString,
      });

      const result = await response.json();
      console.log("Resultado del servidor:", result);

      if (response.ok) {
        // Mostrar el mensaje de éxito
        setToastMessage('Proyecto creado exitosamente!');
        setShowToast(true);

        // Redirigir al home después de unos segundos
        setTimeout(() => {
          history.push('/home');  // Redirigir a la página de inicio
        }, 2000); // 2 segundos de retraso para mostrar el toast
      } else {
        if (response.status === 401) {
          console.error('No autorizado. Por favor, inicia sesión nuevamente.');
        } else if (response.status === 500) {
          console.error('Error en el servidor. Intenta más tarde.');
        } else {
          console.error(`Error al crear proyecto: ${result.error || 'Desconocido'}`);
        }
      }
    } catch (error) {
      console.error('Error de red. No se pudo crear el proyecto.', error);
    }
  };

  const handleCancel = () => {
    // Aquí puedes redirigir a otra página o limpiar el formulario
    console.log('Cancelado');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <IonPage>
      <Header title={'Crear Proyecto'} />
      <ProyectoForm 
        onSubmit={handleCreateProject} 
        setSubmitDisabled={() => {}} 
        submitButtonLabel="Crear Proyecto" 
        onCancel={handleCancel} 
      />
      <IonFooter>
        <Footer />
      </IonFooter>

      {/* Toast para mostrar mensaje de éxito */}
      <IonToast
        isOpen={showToast}
        message={toastMessage}
        duration={2000}  // Duración de 2 segundos
        onDidDismiss={() => setShowToast(false)}  // Ocultar el toast después de que desaparezca
      />
    </IonPage>
  );
};

export default CrearProyecto;
