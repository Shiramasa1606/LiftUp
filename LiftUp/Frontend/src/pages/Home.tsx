// src/pages/Home.tsx

import React, { useState } from 'react';
import { IonContent, IonPage, IonFooter, IonSearchbar } from '@ionic/react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import FooterSections from '../components/FooterSections';
import { useAuth } from '../context/AuthContext'; // Importa el contexto
import './Home.css'; // Asegúrate de tener un archivo CSS para los estilos personalizados

// Importa las imágenes desde la carpeta 'assets/images'
import image1 from '../assets/images/image1.png';
import image2 from '../assets/images/image2.png';
import image3 from '../assets/images/image3.png';

const Home: React.FC = () => {
  const { isLoggedIn } = useAuth(); // Obtener el estado de autenticación
  const [searchText, setSearchText] = useState(''); // Estado para almacenar el texto de búsqueda

  const handleSearchInput = (event: CustomEvent) => {
    setSearchText(event.detail.value!); // Actualiza el texto de búsqueda
  };

  return (
    <IonPage>
      <Header title="LiftUp" />
      <IonContent fullscreen>
        <div className="content-padding">
          {/* Barra de búsqueda que solo se muestra si el usuario está logueado */}
          {isLoggedIn && (
            <IonSearchbar
              value={searchText}
              onIonInput={handleSearchInput}
              placeholder="Escribe el nombre del Proyecto"
              animated={true}
              className="search-bar"
            />
          )}

          <section className="intro-section">
            <h2>¿Qué Ofrece LiftUp?</h2>

            <div className="feature">
              <h3>1. Crea y Gestiona Tu Proyecto de Donación</h3>
              <p>
                ¿Tienes una causa que te gustaría financiar? Con LiftUp, puedes crear un proyecto de recaudación
                de fondos de manera rápida y sencilla. Define tu meta, comparte tu historia y comienza a recibir apoyo
                de personas interesadas en tu causa.
              </p>
              {/* Imagen para Crear y Gestionar Tu Proyecto de Donación */}
              <img src={image1} alt="Crear y Gestionar Proyecto" className="feature-image" />
            </div>

            <div className="feature">
              <h3>2. Haz Donaciones a Causas que Te Apasionan</h3>
              <p>
                Si deseas hacer una diferencia, puedes explorar una variedad de proyectos en nuestra plataforma.
                Desde iniciativas locales hasta causas globales, en LiftUp encontrarás proyectos que necesitan tu apoyo.
                Con solo unos clics, puedes donar a las causas que más te tocan.
              </p>
              {/* Imagen para Haz Donaciones a Causas que Te Apasionan */}
              <img src={image2} alt="Haz Donaciones" className="feature-image" />
            </div>

            <div className="feature">
              <h3>3. Sigue y Apoya Proyectos</h3>
              <p>
                Además de donar, puedes seguir proyectos que te interesen y ser parte activa de su evolución.
                Recibe actualizaciones sobre el progreso de los proyectos que estás apoyando y haz seguimiento a las
                metas alcanzadas. Cada paso cuenta, y tú puedes ser parte de ese cambio.
              </p>
            </div>

            <div className="feature">
              <h3>4. Gestiona Tu Perfil y Proyectos</h3>
              <p>
                Tu perfil en LiftUp te permite ver y gestionar todos los proyectos que has creado o apoyado.
                Actualiza tu información, agrega una foto de perfil y mantente al tanto de los proyectos en los que estás
                involucrado.
              </p>
            </div>

            <h2>¿Por Qué Usar LiftUp?</h2>

            <div className="feature">
              <h3>Conectividad</h3>
              <p>
                LiftUp te conecta con personas y causas que realmente te importan. Puedes seguir y apoyar iniciativas
                que compartan tus valores.
              </p>
            </div>

            <div className="feature">
              <h3>Accesibilidad</h3>
              <p>
                Con un diseño fácil de usar, tanto si eres un donante como si estás iniciando un proyecto, LiftUp te
                permite gestionar tus acciones de manera rápida y eficiente.
              </p>
            </div>

            <div className="feature">
              <h3>Impacto</h3>
              <p>
                Cada proyecto que creas o apoyas tiene un verdadero impacto. LiftUp facilita que las ideas se conviertan
                en realidad con el apoyo de una comunidad comprometida.
              </p>
            </div>

            <section className="cta-section">
              <h2>Únete a LiftUp Hoy Mismo</h2>
              <p>
                Sea que desees recaudar fondos para tu proyecto o hacer una diferencia apoyando los de otros,
                LiftUp es la plataforma ideal para ti. Únete a nuestra comunidad de personas comprometidas con el cambio
                y ayuda a crear un futuro mejor para todos.
              </p>
              <p>
                Empieza a crear, donar y apoyar hoy mismo. ¡Juntos podemos lograr más!
              </p>
              {/* Imagen para Únete a LiftUp Hoy Mismo */}
              <img src={image3} alt="Únete a LiftUp" className="cta-image" />
            </section>
          </section>
        </div>
        <FooterSections />
      </IonContent>
      <IonFooter>
        <Footer />
      </IonFooter>
    </IonPage>
  );
};

export default Home;