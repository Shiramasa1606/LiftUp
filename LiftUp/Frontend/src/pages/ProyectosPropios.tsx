import React, { useEffect, useState } from 'react';
import { IonPage, IonContent, IonGrid, IonRow, IonCol } from '@ionic/react';
import { ProyectosInterface } from '../utils/interface';
import { useHistory } from 'react-router-dom'; // Importa useHistory
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProyectoCard from '../components/ProyectoCard';

const Proyectos: React.FC = () => {
  const [proyectos, setProyectos] = useState<ProyectosInterface[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);  // Guardamos el ID del usuario
  const history = useHistory(); // Usa el hook useHistory para la navegación

  useEffect(() => {
    // Obtener el ID del usuario desde el token JWT
    const token = localStorage.getItem('access_token');
    if (token) {
      const decodedToken = JSON.parse(atob(token.split('.')[1])); // Decodificar el JWT
      setUserId(decodedToken.id); // Asignar el ID del usuario actual
    }

    const fetchProyectos = async () => {
      try {
        const response = await fetch('http://localhost:3000/mis-proyectos', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`, // Envía el token en el encabezado
          },
        });

        if (!response.ok) {
          throw new Error('Error al cargar los proyectos');
        }

        const data: ProyectosInterface[] = await response.json();
        setProyectos(data);
      } catch (error) {
        console.error('Error fetching proyectos:', error);
        setError('Hubo un problema al cargar los proyectos.');
      }
    };

    fetchProyectos();
  }, []);

  const onUpdate = (id: number, isFavorito: boolean, isSeguido: boolean) => {
    setProyectos(prevProyectos =>
      prevProyectos.map(proyecto =>
        proyecto.id === id
          ? { ...proyecto, esFavorito: isFavorito, esSeguido: isSeguido }
          : proyecto
      )
    );
    console.log(`Proyecto con ID ${id} actualizado: Favorito - ${isFavorito}, Seguido - ${isSeguido}`);
  };

  const onCardClick = (proyecto: ProyectosInterface) => {
    console.log(`Proyecto seleccionado: ${proyecto.nombre}`);
    // Redirigir a la página de visualización del proyecto
    history.push(`/visualizacion-proyecto/${proyecto.id}`);
  };

  return (
    <IonPage>
      <Header title='Mis Proyectos' />
      <IonContent>
        {error && <div style={{ color: 'red', textAlign: 'center' }}>{error}</div>}
        <IonGrid>
          <IonRow>
            {proyectos.map((proyecto: ProyectosInterface) => (
              <IonCol key={proyecto.id}>
                <ProyectoCard 
                  proyecto={proyecto} 
                  showIcons={true} // Mostrar los íconos (Visualizar, Modificar, Eliminar) si es el creador
                  onUpdate={onUpdate} 
                  onCardClick={onCardClick} 
                  currentUserId={userId!}  // Pasar el ID del usuario actual a ProyectoCard
                />
              </IonCol>
            ))}
          </IonRow>
        </IonGrid>
      </IonContent>
      <Footer />
    </IonPage>
  );
};

export default Proyectos;
