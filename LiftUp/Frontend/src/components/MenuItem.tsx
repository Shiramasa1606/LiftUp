import React from 'react';
import { IonItem, IonLabel, IonIcon } from '@ionic/react';
import { MenuItemProps } from '../utils/interface';

const MenuItem: React.FC<MenuItemProps> = ({ icon, label, link, className }) => {
	return (
	  <IonItem routerLink={link} className={className}>
		<IonIcon src={icon} slot="start" />
		<IonLabel>{label}</IonLabel>
	  </IonItem>
	);
  };

export default MenuItem;
