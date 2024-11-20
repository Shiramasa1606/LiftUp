import React, { useEffect, useState } from 'react';
import { IonContent, IonPage, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonProgressBar } from '@ionic/react';
import { ProyectosInterface, VisualizacionProyectoProps } from '../utils/interface';
import Header from '../components/Header'; // Importa el Header
import Footer from '../components/Footer'; // Importa el Footer

const VisualizacionProyecto: React.FC<VisualizacionProyectoProps> = ({ proyectoId }) => {
  const [proyecto, setProyecto] = useState<ProyectosInterface | null>(null);

  useEffect(() => {
    const fetchProyecto = async () => {
      try {
        const response = await fetch('/proyectos.json');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        const foundProyecto = data.find((p: ProyectosInterface) => p.id === proyectoId);
        setProyecto(foundProyecto || null);
      } catch (error) {
        console.error('Error fetching proyecto:', error);
      }
    };

    fetchProyecto();
  }, [proyectoId]);

  if (!proyecto) {
    return <IonContent>Cargando proyecto...</IonContent>;
  }

  return (
    <IonPage>
      <Header title= {proyecto.nombre}/> {/* Agrega el Header aquí */}
      <IonContent>
        <div className="container mt-4 text-center">
          

          {/* Imagen Placeholder en su propio IonCard */}
          <IonCard className="mt-4">
            <IonCardContent>
              <img src="https://via.placeholder.com/1200x500" alt="Placeholder" style={{ width: '100%' }} />
            </IonCardContent>
          </IonCard>

          {/* Cantidad Recaudada */}
          <IonCard className="mt-4">
            <IonCardHeader>
              <IonCardTitle style={{ fontSize: '24px', fontWeight: 'bold' }}>
                Cantidad Recaudada
              </IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <div style={{ fontSize: '36px', fontWeight: 'bold' }} className="revenue-amount">
                ${proyecto.recaudado} US$
              </div>
              
              {/* Barra de Progreso */}
              <div style={{ position: 'relative', marginTop: '20px' }}>
                <IonProgressBar 
                  value={proyecto.recaudado / proyecto.meta} 
                  style={{ height: '20px', backgroundColor: '#ccc' }} 
                  color="success" // Parte llena de la barra en verde
                />
                <div style={{ position: 'absolute', width: '100%', top: '0', display: 'flex', justifyContent: 'space-between', padding: '0 5px' }}>
                  <span style={{ color: 'white', fontWeight: 'bold' }}>
                    {((proyecto.recaudado / proyecto.meta) * 100).toFixed(0)}%
                  </span>
                  <span style={{ color: 'white', fontWeight: 'bold' }}>
                    Objetivo: ${proyecto.meta} US$
                  </span>
                </div>
              </div>
            </IonCardContent>
          </IonCard>

          {/* Descripción del Proyecto */}
          <IonCard className="mt-4">
            <IonCardHeader>
              <IonCardTitle>Descripción del Proyecto</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <p>{proyecto.descripcion}</p>
            </IonCardContent>
          </IonCard>

          {/* Información del Creador del Proyecto */}
          <div className="creator-container mt-4 text-center">
            <img src="https://via.placeholder.com/40" alt="Imagen del Creador" className="creator-image" />
            <span className="creator-name">{proyecto.creador}</span> 
          </div>
        </div>
      </IonContent>
      <Footer /> {/* Agrega el Footer aquí */}
    </IonPage>
  );
};

export default VisualizacionProyecto;
