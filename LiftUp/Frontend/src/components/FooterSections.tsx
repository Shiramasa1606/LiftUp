import React from 'react';
import { IonList, IonItem, IonLabel } from '@ionic/react';
import './FooterSections.css';

const FooterSections: React.FC = () => {
  return (
    <div className="footer-sections">
      <h2>Conoce más</h2>
      <IonList>
        <IonItem>
          <IonLabel>
            <a href="/faqs">Preguntas frecuentes</a>
          </IonLabel>
        </IonItem>
        <IonItem>
          <IonLabel>
            <a href="/politicas-privacidad">Políticas de privacidad</a>
          </IonLabel>
        </IonItem>
        <IonItem>
          <IonLabel>
            <a href="/terminos-uso">Términos de Uso</a>
          </IonLabel>
        </IonItem>
      </IonList>
      <h2>Sobre nosotros</h2>
      <IonList>
        <IonItem>
          <IonLabel>Liftup Inc.</IonLabel>
        </IonItem>
        <IonItem>
          <IonLabel>4623 Kaela Orchard, City. Bednarchester</IonLabel>
        </IonItem>
      </IonList>
      <h2>Ponte en contacto con nosotros</h2>
      <IonList>
        <IonItem>
          <IonLabel>
            <a href="mailto:info.contacto@liftup.com">info.contacto@liftup.com</a>
          </IonLabel>
        </IonItem>
      </IonList>
    </div>
  );
};

export default FooterSections;
