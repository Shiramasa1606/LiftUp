// src/components/SocialLinks.tsx
import React from 'react';
import { IonIcon } from '@ionic/react';
import { SocialLinks as SocialLinksInterface } from '../utils/interface';

interface SocialLinksProps {
  links: SocialLinksInterface;
}

const SocialLinks: React.FC<SocialLinksProps> = ({ links }) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
      {links.facebook && (
        <a href={links.facebook} target="_blank" rel="noopener noreferrer">
          <IonIcon icon="logo-facebook" />
        </a>
      )}
      {links.twitter && (
        <a href={links.twitter} target="_blank" rel="noopener noreferrer">
          <IonIcon icon="logo-twitter" />
        </a>
      )}
      {links.instagram && (
        <a href={links.instagram} target="_blank" rel="noopener noreferrer">
          <IonIcon icon="logo-instagram" />
        </a>
      )}
      {links.linkedin && (
        <a href={links.linkedin} target="_blank" rel="noopener noreferrer">
          <IonIcon icon="logo-linkedin" />
        </a>
      )}
      {links.project && (
        <a href={links.project} target="_blank" rel="noopener noreferrer">
          <IonIcon icon="logo-github" />
        </a>
      )}
    </div>
  );
};

export default SocialLinks;
