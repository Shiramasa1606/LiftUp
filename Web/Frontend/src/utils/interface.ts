// interface.ts
export interface ProyectosInterface {
  id: number;             // ID del proyecto
  nombre: string;        // Nombre del proyecto
  recaudado: number;     // Monto recaudado
  meta: number;          // Meta del proyecto
  categoria: string;     // Estado del proyecto
  esFavorito: boolean;    // Indica si el proyecto es favorito
  esSeguido: boolean;     // Indica si el proyecto es seguido
  novedad?: boolean;     // Campo opcional que indica si es una novedad
  idCreador: number;     // ID del creador del proyecto
  descripcion: string;    // Descripción del proyecto
  creador: number;       // Clave foránea al ID del usuario que creó el proyecto
}


export interface ProyectoCardProps {
  proyecto: ProyectosInterface;
  showIcons: boolean;
  onUpdate: (id: number, isFavorito: boolean, isSeguido: boolean) => void; // Definición de la función como prop
}

  
export interface VisualizacionProyectoProps {
	proyectoId: number; // ID del proyecto a visualizar
}



  export interface MenuItemProps {
	icon: string; // Ruta del ícono
	label: string; // Etiqueta del menú
	link: string; // Enlace
	className?: string; // Clase CSS opcional
  }

export interface HeaderProps {
	title: string;
	isLoggedIn?: boolean; // Añadido para manejar el estado de inicio de sesión
}

interface ProyectoFormProps {
  initialData?: {
    titulo: string;
    categoria: string;
    descripcion: string;
    objetivoFondos: number | '';
    fechaTermino?: string;
  };
  onSubmit: (proyecto: any) => void;
}

// Interfaz para los enlaces sociales
export interface SocialLinks {
  facebook?: string;
  twitter?: string;
  instagram?: string;
  linkedin?: string;
  project?: string;
}

// Interfaz para el perfil de usuario
export interface UserInterface {
  idUsuario: number;
  nombreUsuario: string;
  email: string;
  avatar: string;
  biografia: string;
  proyectosPatrocinados: number;
  socialLinks?: SocialLinks; // Si tienes enlaces sociales
}