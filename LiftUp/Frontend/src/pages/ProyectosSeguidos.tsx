import React, { useEffect, useState } from 'react';
import { IonPage, IonContent, IonGrid, IonRow, IonCol, IonSearchbar } from '@ionic/react';
import { useHistory } from 'react-router-dom'; 
import { ProyectosInterface } from '../utils/interface'; 
import Header from '../components/Header'; 
import Footer from '../components/Footer'; 
import ProyectoCard from '../components/ProyectoCard'; 
import SidebarFiltro from '../components/SidebarFiltro'; 

const ProyectosSeguidos: React.FC = () => {
  const history = useHistory();
  const [proyectos, setProyectos] = useState<ProyectosInterface[]>([]);
  const [filtro, setFiltro] = useState<string>(''); 
  const [error, setError] = useState<string | null>(null); 
  const [isSidebarOpen, setSidebarOpen] = useState(false); 
  const [userId, setUserId] = useState<number | null>(null);  // Aquí guardamos el ID del usuario actual

  useEffect(() => {
    // Obtener el ID del usuario actual desde el localStorage (o desde donde lo tengas)
    const token = localStorage.getItem('access_token');
    if (token) {
      const decodedToken = JSON.parse(atob(token.split('.')[1])); // Decodificando el JWT (suponiendo que es un JWT)
      setUserId(decodedToken.id); // Asignamos el ID del usuario
    }

    const fetchProyectosSeguidos = async () => {
      try {
        const response = await fetch('http://localhost:3000/proyectos-seguidos', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}` // Token de autenticación
          }
        });

        if (!response.ok) {
          throw new Error('Error al cargar los proyectos seguidos');
        }

        const data: ProyectosInterface[] = await response.json();
        setProyectos(data); // El backend ya devuelve solo los proyectos seguidos
      } catch (error) {
        console.error('Error fetching proyectos seguidos:', error);
        setError('Hubo un problema al cargar los proyectos seguidos.');
      }
    };

    fetchProyectosSeguidos();
  }, []); 

  const proyectosFiltrados = proyectos.filter(proyecto => 
    proyecto.nombre.toLowerCase().includes(filtro.toLowerCase())
  );

  const dejarDeSeguir = async (idProyecto: number) => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch('http://localhost:3000/dejar-de-seguir', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ idProyecto })
      });

      if (!response.ok) {
        throw new Error('Error al dejar de seguir el proyecto');
      }

      setProyectos(prevProyectos => 
        prevProyectos.filter(proyecto => proyecto.id !== idProyecto)
      );
    } catch (error) {
      console.error('Error al dejar de seguir el proyecto:', error);
      setError('Hubo un problema al dejar de seguir el proyecto.');
    }
  };

  const handleFilter = (filtro: string) => {
    console.log(`Filtrando por: ${filtro}`);
    setSidebarOpen(false); 
  };

  const onCardClick = (proyecto: ProyectosInterface) => {
    console.log(`Proyecto clickeado: ${proyecto.nombre}`);
    history.push(`/visualizar-proyecto/${proyecto.id}`);
  };

  return (
    <IonPage>
      <Header 
        title="Proyectos Seguidos" 
        onFilterClick={() => setSidebarOpen(true)} 
      />
      <IonContent>
        {error && <div style={{ color: 'red', textAlign: 'center' }}>{error}</div>}
        <IonSearchbar 
          value={filtro} 
          onIonInput={e => setFiltro(e.detail.value!)} 
          placeholder="Buscar proyectos seguidos..." 
        />
        <IonGrid>
          <IonRow>
            {proyectosFiltrados.map((proyecto: ProyectosInterface) => (
              <IonCol key={proyecto.id}>
                {/* Ahora pasamos el ID del usuario actual a ProyectoCard */}
                <ProyectoCard 
                  proyecto={proyecto} 
                  showIcons={true} 
                  onUpdate={(isFavorito, isSeguido) => {
                    if (!isSeguido) {
                      dejarDeSeguir(proyecto.id);
                    }
                  }}
                  onCardClick={() => onCardClick(proyecto)} 
                  currentUserId={userId!}
                />
              </IonCol>
            ))}
          </IonRow>
        </IonGrid>
      </IonContent>
      <Footer /> 
      <SidebarFiltro 
        isOpen={isSidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
        onFilter={handleFilter} 
      />
    </IonPage>
  );
};

export default ProyectosSeguidos;
