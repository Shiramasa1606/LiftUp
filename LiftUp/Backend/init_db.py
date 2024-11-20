import sqlite3
import os

# Construye la ruta absoluta basada en la ubicación del script
base_dir = os.path.dirname(os.path.abspath(__file__))  # Directorio actual del script
db_path = os.path.join(base_dir, 'db', 'database.db')

# Asegúrate de que el directorio exista
os.makedirs(os.path.dirname(db_path), exist_ok=True)

# Conectar y ejecutar el esquema
schema = """
CREATE TABLE IF NOT EXISTS usuarios (
  idUsuario INTEGER PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  nombreUsuario TEXT NOT NULL,
  rut TEXT NOT NULL,  -- Agregado: RUT del usuario
  region TEXT NOT NULL,  -- Agregado: Región del usuario
  comuna TEXT NOT NULL,  -- Agregado: Comuna del usuario
  proyectosPatrocinados INTEGER DEFAULT 0,
  avatar TEXT,
  biografia TEXT,
  fechaCreacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- Fecha de creación del usuario
);

CREATE TABLE IF NOT EXISTS proyectos (
  idProyecto INTEGER PRIMARY KEY,
  nombre TEXT NOT NULL,
  montoObjetivo REAL NOT NULL,
  descripcion TEXT NOT NULL,
  montoActual REAL NOT NULL,
  novedad TEXT,
  idUsuario INTEGER,
  idCategoria INTEGER,
  fechaCreacion DATE DEFAULT CURRENT_DATE,  -- Fecha de creación, por defecto la fecha actual
  fechaLimite DATE,  -- Fecha límite (opcional)
  FOREIGN KEY (idUsuario) REFERENCES usuarios(idUsuario) ON DELETE CASCADE, -- Eliminación en cascada
  FOREIGN KEY (idCategoria) REFERENCES categorias(idCategoria) ON DELETE CASCADE -- Eliminación en cascada
);


CREATE TABLE IF NOT EXISTS categorias (
  idCategoria INTEGER PRIMARY KEY,
  nombre TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS donaciones (
  idDonacion INTEGER PRIMARY KEY,
  monto REAL NOT NULL,
  fechaDonacion DATE NOT NULL,
  idUsuario INTEGER,  -- Agregado para asociar la donación con un usuario
  FOREIGN KEY (idUsuario) REFERENCES usuarios(idUsuario) ON DELETE SET NULL -- Relacionado con usuarios, y se deja NULL si el usuario es eliminado
);

CREATE TABLE IF NOT EXISTS seguidores (
  idSeguidor INTEGER PRIMARY KEY,
  idUsuario INTEGER,  -- Id del usuario que sigue
  idProyecto INTEGER, -- Proyecto que está siendo seguido
  fechaSeguido DATE NOT NULL,
  FOREIGN KEY (idUsuario) REFERENCES usuarios(idUsuario) ON DELETE CASCADE,  -- Eliminación en cascada si el usuario se elimina
  FOREIGN KEY (idProyecto) REFERENCES proyectos(idProyecto) ON DELETE CASCADE -- Eliminación en cascada si el proyecto se elimina
);

CREATE TABLE IF NOT EXISTS redesSociales (
  idRedSocial INTEGER PRIMARY KEY,
  nombre TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS usuarioRedSocial (
  idUsuario INTEGER,
  idRedSocial INTEGER,
  PRIMARY KEY (idUsuario, idRedSocial),
  FOREIGN KEY (idUsuario) REFERENCES usuarios(idUsuario) ON DELETE CASCADE,
  FOREIGN KEY (idRedSocial) REFERENCES redesSociales(idRedSocial) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS imagenes (
  idImagen INTEGER PRIMARY KEY,
  url TEXT NOT NULL,
  idProyecto INTEGER,
  FOREIGN KEY (idProyecto) REFERENCES proyectos(idProyecto) ON DELETE CASCADE -- Eliminación en cascada si el proyecto se elimina
);

CREATE TABLE IF NOT EXISTS donacionesProyecto (
  idProyecto INTEGER,
  idDonacion INTEGER,
  PRIMARY KEY (idProyecto, idDonacion),
  FOREIGN KEY (idProyecto) REFERENCES proyectos(idProyecto) ON DELETE CASCADE,
  FOREIGN KEY (idDonacion) REFERENCES donaciones(idDonacion) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS seguidorProyecto (
  idProyecto INTEGER,
  idSeguidor INTEGER,
  PRIMARY KEY (idProyecto, idSeguidor),
  FOREIGN KEY (idProyecto) REFERENCES proyectos(idProyecto) ON DELETE CASCADE,
  FOREIGN KEY (idSeguidor) REFERENCES seguidores(idSeguidor) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS proyectosFavoritos (
  idUsuario INTEGER,
  idProyecto INTEGER,
  PRIMARY KEY (idUsuario, idProyecto),
  FOREIGN KEY (idProyecto) REFERENCES proyectos(idProyecto) ON DELETE CASCADE
);
"""

conn = sqlite3.connect(db_path)
cursor = conn.cursor()
cursor.executescript(schema)
conn.commit()
conn.close()

print(f"Base de datos inicializada correctamente en {db_path}.")
