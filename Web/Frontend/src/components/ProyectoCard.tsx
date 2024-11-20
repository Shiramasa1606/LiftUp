import React, { useEffect, useState } from 'react';
import { IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonProgressBar, IonImg, IonIcon } from '@ionic/react';
import { starOutline, star, bookmarkOutline, bookmark } from 'ionicons/icons';
import { ProyectosInterface } from '../utils/interface';

interface ProyectoCardProps {
    proyecto: ProyectosInterface;
    showIcons: boolean;
    onUpdate: (id: number, isFavorito: boolean, isSeguido: boolean) => void;
    onCardClick: (proyecto: ProyectosInterface) => void;
}

const ProyectoCard: React.FC<ProyectoCardProps> = ({ proyecto, showIcons, onUpdate, onCardClick }) => {
    const porcentajeRecaudado = (proyecto.recaudado / proyecto.meta) * 100;

    const [isStarred, setIsStarred] = useState(proyecto.esFavorito);
    const [isBookmarked, setIsBookmarked] = useState(proyecto.esSeguido);

    useEffect(() => {
        setIsStarred(proyecto.esFavorito);
        setIsBookmarked(proyecto.esSeguido);
    }, [proyecto.esFavorito, proyecto.esSeguido]);

    const formatoCLP = new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', minimumFractionDigits: 0 });

    const handleStarClick = () => {
        const updatedFavorito = !isStarred;
        setIsStarred(updatedFavorito);
        onUpdate(proyecto.id, updatedFavorito, isBookmarked);
    };

    const handleBookmarkClick = () => {
        const updatedSeguido = !isBookmarked;
        setIsBookmarked(updatedSeguido);
        onUpdate(proyecto.id, isStarred, updatedSeguido);
    };

    return (
        <IonCard onClick={() => onCardClick(proyecto)}>
            <IonImg src="https://via.placeholder.com/600x200" alt="Imagen del Proyecto" />

            <IonCardHeader>
                <IonCardTitle>{proyecto.nombre}</IonCardTitle>
                <IonCardSubtitle>{proyecto.categoria}</IonCardSubtitle>
            </IonCardHeader>

            <IonCardContent>
                <div className="revenue-amount" style={{ fontSize: '24px', textAlign: 'center' }}>
                    {"CLP " + formatoCLP.format(proyecto.recaudado)}
                </div>

                <IonProgressBar
                    value={porcentajeRecaudado / 100}
                    style={{ marginTop: '10px' }}
                    color="success"
                />

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '5px' }}>
                    <span>{porcentajeRecaudado.toFixed(0)}%</span>
                    <span>{"CLP " + formatoCLP.format(proyecto.meta)}</span>
                </div>

                {showIcons && (
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginTop: '10px',
                            height: '50px'
                        }}
                    >
                        <IonIcon
                            icon={isStarred ? star : starOutline}
                            style={{ fontSize: '24px', marginRight: '15px', cursor: 'pointer', color: isStarred ? 'gold' : 'black' }}
                            onClick={(e) => { e.stopPropagation(); handleStarClick(); }}
                        />
                        <IonIcon
                            icon={isBookmarked ? bookmark : bookmarkOutline}
                            style={{ fontSize: '24px', cursor: 'pointer', color: isBookmarked ? 'blue' : 'black' }}
                            onClick={(e) => { e.stopPropagation(); handleBookmarkClick(); }}
                        />
                    </div>
                )}

                <div
                    style={{
                        marginTop: '20px',
                        padding: '10px',
                        borderTop: '1px solid #e0e0e0',
                        fontSize: '14px',
                        color: '#666'
                    }}
                >
                    {proyecto.descripcion}
                </div>
            </IonCardContent>
        </IonCard>
    );
};

export default ProyectoCard;
