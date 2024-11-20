import React, { useEffect, useState } from 'react';
import { IonPage, IonContent, IonGrid, IonRow, IonCol } from '@ionic/react';
import { ProyectosInterface } from '../utils/interface'; 
import Header from '../components/Header'; 
import Footer from '../components/Footer'; 
import ProyectoCard from '../components/ProyectoCard'; 

const Proyectos: React.FC = () => {
  const [proyectos, setProyectos] = useState<ProyectosInterface[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProyectos = async () => {
      try {
        const token = localStorage.getItem('access_token'); // Obtén el token JWT almacenado
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
    // Aquí puedes manejar la lógica de selección, como abrir un popover o redirigir
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
                  showIcons={false} 
                  onUpdate={onUpdate} 
                  onCardClick={onCardClick} // Pasando la función onCardClick
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
