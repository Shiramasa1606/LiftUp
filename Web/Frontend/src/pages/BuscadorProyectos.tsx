import React, { useEffect, useState } from 'react';
import { IonPage, IonContent, IonGrid, IonRow, IonCol, IonSearchbar } from '@ionic/react';
import { ProyectosInterface } from '../utils/interface'; 
import Header from '../components/Header'; 
import Footer from '../components/Footer'; 
import ProyectoCard from '../components/ProyectoCard'; 
import SidebarFiltro from '../components/SidebarFiltro'; 

const BuscadorProyectos: React.FC = () => {
  const [proyectos, setProyectos] = useState<ProyectosInterface[]>([]);
  const [filtro, setFiltro] = useState<string>(''); 
  const [error, setError] = useState<string | null>(null); 
  const [isSidebarOpen, setSidebarOpen] = useState(false); 

  useEffect(() => {
    const fetchProyectos = async () => {
      const token = localStorage.getItem('access_token');  // Asegúrate de que el token esté en localStorage
      if (!token) {
        setError('No estás autenticado. Por favor, inicia sesión.');
        return;
      }

      try {
        const response = await fetch('http://localhost:3000/proyectos', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`  // Enviar el token en las cabeceras
          }
        });

        if (!response.ok) {
          throw new Error('Error al cargar los proyectos');
        }

        const data: ProyectosInterface[] = await response.json();
        setProyectos(data); // Establece todos los proyectos desde el backend
      } catch (error) {
        console.error('Error fetching proyectos:', error);
        setError('Hubo un problema al cargar los proyectos.');
      }
    };

    fetchProyectos();
  }, []);

  const proyectosFiltrados = proyectos.filter(proyecto => 
    proyecto.nombre.toLowerCase().includes(filtro.toLowerCase())
  );

  const seguirProyecto = async (idProyecto: number) => {
    const token = localStorage.getItem('access_token'); // Obtener token nuevamente para la solicitud
    if (!token) {
      setError('No estás autenticado. No puedes seguir proyectos sin iniciar sesión.');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/seguir-proyecto', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Asegúrate de enviar el token
        },
        body: JSON.stringify({ idProyecto })
      });

      if (!response.ok) {
        throw new Error('Error al seguir el proyecto');
      }

      setProyectos(prevProyectos =>
        prevProyectos.map(proyecto =>
          proyecto.id === idProyecto ? { ...proyecto, esSeguido: true } : proyecto
        )
      );
    } catch (error) {
      console.error('Error al seguir el proyecto:', error);
      setError('Hubo un problema al seguir el proyecto.');
    }
  };

  const onUpdate = (id: number, isFavorito: boolean, isSeguido: boolean) => {
    if (isSeguido) {
      seguirProyecto(id); // Añade el proyecto a proyectos seguidos si es marcado como seguido
    }
    setProyectos(prevProyectos =>
      prevProyectos.map(proyecto =>
        proyecto.id === id
          ? { ...proyecto, esFavorito: isFavorito, esSeguido: isSeguido }
          : proyecto
      )
    );
    console.log(`Proyecto con ID ${id} actualizado: Favorito - ${isFavorito}, Seguido - ${isSeguido}`);
  };

  const handleFilter = (filtro: string) => {
    console.log(`Filtrando por: ${filtro}`);
    setSidebarOpen(false); 
  };

  const onCardClick = (proyecto: ProyectosInterface) => {
    console.log(`Proyecto clickeado: ${proyecto.nombre}`);
    // Aquí puedes redirigir o mostrar más detalles del proyecto si lo deseas
  };

  return (
    <IonPage>
      <Header 
        title="Buscar Proyectos" 
        onFilterClick={() => setSidebarOpen(true)} 
      />
      <IonContent>
        {error && <div style={{ color: 'red', textAlign: 'center' }}>{error}</div>}
        <IonSearchbar 
          value={filtro} 
          onIonInput={e => setFiltro(e.detail.value!)} 
          placeholder="Buscar proyectos..." 
        />
        <IonGrid>
          <IonRow>
            {proyectosFiltrados.length > 0 ? (
              proyectosFiltrados.map((proyecto: ProyectosInterface) => (
                <IonCol key={proyecto.id}>
                  <ProyectoCard 
                    proyecto={proyecto} 
                    showIcons={true} 
                    onUpdate={onUpdate}
                    onCardClick={() => onCardClick(proyecto)} 
                  />
                </IonCol>
              ))
            ) : (
              <IonCol>
                <div style={{ textAlign: 'center' }}>No se encontraron proyectos.</div>
              </IonCol>
            )}
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

export default BuscadorProyectos;
