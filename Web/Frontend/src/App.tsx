// src/App.tsx
import React, { lazy, Suspense } from 'react'; // Importa Suspense y lazy para la carga dinámica
import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import Home from './pages/Home';
import Auth from './pages/Auth'; 
import EditProfile from './pages/EditProfile';
import Profile from './pages/Profile';
import RecuperarPass from './pages/RecuperarPass';
import { AuthProvider } from './context/AuthContext'; // Asegúrate de importar el contexto de autenticación

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';
import '@ionic/react/css/palettes/dark.system.css';
import './theme/variables.css';
import BuscadorProyectos from './pages/BuscadorProyectos';
import CrearProyecto from './pages/crearProyecto';
import ModificarProyecto from './pages/ModificarProyecto';
import VisualizacionProyecto from './pages/VisualizacionProyecto';

setupIonicReact();

// Importación dinámica de las páginas
const ProyectosPropios = lazy(() => import('./pages/ProyectosPropios'));
const ProyectosSeguidos = lazy(() => import('./pages/ProyectosSeguidos'));

const App: React.FC = () => (
  <IonApp>
    <AuthProvider>
      <IonReactRouter>
        <IonRouterOutlet>
          <Suspense fallback={<div>Cargando...</div>}>
            <Route exact path="/home">
              <Home />
            </Route>
            <Route exact path="/login">
              <Auth mode="login" /> {/* Aquí pasamos "login" */}
            </Route>
            <Route exact path="/register">
              <Auth mode="register" /> {/* Aquí pasamos "register" */}
            </Route>
            <Route exact path="/">
              <Redirect to="/home" />
            </Route>
            <Route exact path="/profile">
              <Profile />
            </Route>
            <Route exact path="/edit-profile">
              <EditProfile />
            </Route>
            <Route exact path="/recuperar-pass">
              <RecuperarPass />
            </Route>
            <Route exact path="/misProyectos">
              <ProyectosPropios />
            </Route>
            <Route exact path="/proyectosSeguidos">
              <ProyectosSeguidos />
            </Route>
            <Route exact path="/buscador-proyectos">
              <BuscadorProyectos />
            </Route>
            <Route exact path="/crear-proyecto">
              <CrearProyecto />
            </Route>
            <Route exact path="/modificar-proyecto">
              <ModificarProyecto />
            </Route>
            <Route exact path="/visualizar-proyecto">
              <VisualizacionProyecto proyectoId={1} />
            </Route>
          </Suspense>
        </IonRouterOutlet>
      </IonReactRouter>
    </AuthProvider>
  </IonApp>
);

export default App;
