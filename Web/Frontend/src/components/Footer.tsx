import React from 'react';
import { IonFooter, IonIcon, IonImg } from '@ionic/react';
import { logoTwitter, logoInstagram, logoYoutube, logoLinkedin } from 'ionicons/icons';
//import logoLiftUp from '../assets/images/logoLiftUp.png'; // Asegúrate de que la imagen esté en la ubicación correcta
import './Footer.css';

const Footer: React.FC = () => {
  return (
    <IonFooter className="footer">
      <div className="footer-top">
        
        <div className="footer-socials">
          <IonIcon icon={logoTwitter} size="large" className="social-icon" />
          <IonIcon icon={logoInstagram} size="large" className="social-icon" />
          <IonIcon icon={logoYoutube} size="large" className="social-icon" />
          <IonIcon icon={logoLinkedin} size="large" className="social-icon" />
        </div>
      </div>
      <p className="footer-copyright">© 2024 LiftUp Inc.</p>
    </IonFooter>
  );
};

export default Footer;
