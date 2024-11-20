import React, { useState } from 'react';
import { IonFooter, IonPage } from '@ionic/react';
import Header from '../components/Header';
import ProyectoForm from '../components/ProyectoForm';
import { useHistory } from 'react-router-dom';
import Footer from '../components/Footer';

const ModificarProyecto: React.FC = () => {
  const proyectoExistente = {
    titulo: 'Proyecto de ejemplo',
    categoria: 'Tecnología',
    descripcion: 'Descripción de ejemplo del proyecto.',
    objetivoFondos: 5000,
    fechaTermino: '2023-12-31'
  };

  const [isSubmitDisabled, setSubmitDisabled] = useState(true);
  const history = useHistory();

  const handleUpdateProject = (proyecto: any) => {
    const jsonString = JSON.stringify(proyecto);
    console.log("Datos modificados del proyecto:", jsonString);
  };

  const handleCancel = () => {
    history.goBack();
  };

  return (
    <IonPage>
      <Header title="Modificar Proyecto" />
      <ProyectoForm 
        initialData={proyectoExistente} 
        onSubmit={handleUpdateProject} 
        setSubmitDisabled={setSubmitDisabled} 
        submitButtonLabel="Guardar Cambios" 
        onCancel={handleCancel} 
      />
	  <IonFooter>
    	<Footer />
      </IonFooter>
    </IonPage>
  );
};

export default ModificarProyecto;
