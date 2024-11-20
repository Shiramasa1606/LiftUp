import React, { useEffect, useState } from 'react';
import { IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonProgressBar, IonImg, IonIcon, IonModal, IonButton, IonList, IonItem, IonAlert } from '@ionic/react';
import { starOutline, star, bookmarkOutline, bookmark } from 'ionicons/icons';
import { ProyectosInterface } from '../utils/interface';
import { useHistory } from 'react-router-dom';

interface ProyectoCardProps {
    proyecto: ProyectosInterface;
    showIcons: boolean;
    onUpdate: (id: number, isFavorito: boolean, isSeguido: boolean) => void;
    onCardClick: (proyecto: ProyectosInterface) => void;
    currentUserId: number; // Pasamos el id del usuario actual para comparar con el creador
}

const ProyectoCard: React.FC<ProyectoCardProps> = ({ proyecto, showIcons, onUpdate, onCardClick, currentUserId }) => {
    const porcentajeRecaudado = (proyecto.recaudado / proyecto.meta) * 100;
    const history = useHistory(); // Para la navegación
    const [isStarred, setIsStarred] = useState(proyecto.esFavorito);
    const [isBookmarked, setIsBookmarked] = useState(proyecto.esSeguido);
    const [showModal, setShowModal] = useState(false); // Estado para mostrar el modal
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false); // Estado para mostrar la confirmación de eliminación

    useEffect(() => {
        setIsStarred(proyecto.esFavorito);
        setIsBookmarked(proyecto.esSeguido);
    }, [proyecto.esFavorito, proyecto.esSeguido]);

    const formatoCLP = new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', minimumFractionDigits: 0 });

    const handleStarClick = async () => {
        const updatedFavorito = !isStarred;
        setIsStarred(updatedFavorito);

        try {
            const response = await fetch(`http://localhost:3000/proyectos/favorito/${proyecto.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                },
                body: JSON.stringify({ esFavorito: updatedFavorito }),
            });

            if (response.ok) {
                onUpdate(proyecto.id, updatedFavorito, isBookmarked);
            } else {
                alert('Error al actualizar favorito');
                setIsStarred(!updatedFavorito); // Revertir el cambio si la actualización falla
            }
        } catch (error) {
            alert('Hubo un error al actualizar el favorito');
            setIsStarred(!updatedFavorito); // Revertir el cambio si ocurre un error
        }
    };

    const handleBookmarkClick = async () => {
        const updatedSeguido = !isBookmarked;
        setIsBookmarked(updatedSeguido);

        try {
            const response = await fetch(`http://localhost:3000/proyectos/seguido/${proyecto.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                },
                body: JSON.stringify({ esSeguido: updatedSeguido }),
            });

            if (response.ok) {
                onUpdate(proyecto.id, isStarred, updatedSeguido);
            } else {
                alert('Error al actualizar seguimiento');
                setIsBookmarked(!updatedSeguido); // Revertir el cambio si la actualización falla
            }
        } catch (error) {
            alert('Hubo un error al actualizar el seguimiento');
            setIsBookmarked(!updatedSeguido); // Revertir el cambio si ocurre un error
        }
    };

    const handleModalClose = () => {
        setShowModal(false);
    };

    const handleVisualizar = () => {
        history.push(`/visualizacion-proyecto/${proyecto.id}`); // Redirige a la visualización del proyecto
        handleModalClose();
    };

    const handleModificar = () => {
        history.push(`/modificar-proyecto/${proyecto.id}`); // Redirige a la página de modificación
        handleModalClose();
    };

    const handleEliminar = () => {
        // Lógica para eliminar el proyecto, muestra la confirmación primero
        setShowDeleteConfirmation(true);
    };

    const confirmDelete = async () => {
        try {
            const response = await fetch(`http://localhost:3000/proyectos/${proyecto.id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                },
            });

            if (response.ok) {
                // Redirigir o actualizar el estado para reflejar la eliminación
                setShowDeleteConfirmation(false);
                alert('Proyecto eliminado con éxito');
                // Aquí podrías redirigir a una página de lista de proyectos, por ejemplo
                handleModalClose();
            } else {
                alert('Error al eliminar el proyecto');
            }
        } catch (error) {
            alert('Hubo un error al eliminar el proyecto');
        }
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

            {/* Modal para el creador */}
            {proyecto.creador === currentUserId && (
                <IonModal isOpen={showModal} onDidDismiss={handleModalClose}>
                    <IonList>
                        <IonItem button onClick={handleVisualizar}>Visualizar</IonItem>
                        <IonItem button onClick={handleModificar}>Modificar</IonItem>
                        <IonItem button onClick={handleEliminar}>Eliminar</IonItem>
                    </IonList>
                    <IonButton onClick={handleModalClose}>Cerrar</IonButton>
                </IonModal>
            )}

            {/* Confirmación de eliminación */}
            <IonAlert
                isOpen={showDeleteConfirmation}
                onDidDismiss={() => setShowDeleteConfirmation(false)}
                header="Confirmación"
                message="¿Estás seguro de que deseas eliminar este proyecto?"
                buttons={[
                    {
                        text: 'Cancelar',
                        role: 'cancel',
                        handler: () => setShowDeleteConfirmation(false),
                    },
                    {
                        text: 'Eliminar',
                        handler: confirmDelete,
                    },
                ]}
            />
        </IonCard>
    );
};

export default ProyectoCard;
