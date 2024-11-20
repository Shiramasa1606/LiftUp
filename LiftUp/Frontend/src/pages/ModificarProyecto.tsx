import React, { useState, useEffect } from 'react';
import { IonFooter, IonPage, IonLoading, IonToast } from '@ionic/react';
import Header from '../components/Header';
import ProyectoForm from '../components/ProyectoForm';
import { useHistory, useParams } from 'react-router-dom';
import Footer from '../components/Footer';

interface Params {
  id: string; // El ID del proyecto a modificar.
}

const ModificarProyecto: React.FC = () => {
  const [proyecto, setProyecto] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitDisabled, setSubmitDisabled] = useState(true);
  const { id } = useParams<Params>(); // Obtener el ID desde la URL.
  const history = useHistory();

  // Cargar los datos del proyecto.
  useEffect(() => {
    const fetchProyecto = async () => {
      try {
        const response = await fetch(`http://localhost:3000/proyectos/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('access_token')}`, // Asegúrate de pasar el token.
          },
        });
    
        if (!response.ok) {
          throw new Error('Error al obtener los datos del proyecto.');
        }
    
        const data = await response.json();
        setProyecto(data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Ha ocurrido un error desconocido al obtener los datos del proyecto.');
        }
      } finally {
        setLoading(false);
      }
    };
    

    fetchProyecto();
  }, [id]);

  // Actualizar el proyecto.
  const handleUpdateProject = async (proyecto: any) => {
    try {
      const response = await fetch('http://localhost:3000/proyectos', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`, // Ajusta según tu lógica de autenticación
        },
        body: JSON.stringify(proyecto),
      });
  
      if (!response.ok) {
        throw new Error(`Error en la solicitud: ${response.status}`);
      }
  
      const data = await response.json();
      console.log("Proyecto actualizado con éxito:", data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error("Error al actualizar el proyecto:", err.message);
      } else {
        console.error("Error desconocido:", err);
      }
    }
  };
  

  const handleCancel = () => {
    history.goBack();
  };

  if (loading) {
    return <IonLoading isOpen={loading} message="Cargando proyecto..." />;
  }

  if (error) {
    return (
      <IonToast
        isOpen={!!error}
        message={error}
        duration={3000}
        onDidDismiss={() => setError(null)}
      />
    );
  }

  return (
    <IonPage>
      <Header title="Modificar Proyecto" />
      {proyecto && (
        <ProyectoForm
          initialData={proyecto}
          onSubmit={handleUpdateProject}
          setSubmitDisabled={setSubmitDisabled}
          submitButtonLabel="Guardar Cambios"
          onCancel={handleCancel}
        />
      )}
      <IonFooter>
        <Footer />
      </IonFooter>
    </IonPage>
  );
};

export default ModificarProyecto;
