CREATE TABLE usuarios (
  idUsuario INTEGER PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  nombreUsuario TEXT NOT NULL,
  proyectosPatrocinados INTEGER,
  avatar TEXT,
  biografia TEXT
);

CREATE TABLE donaciones (
  idDonacion INTEGER PRIMARY KEY,
  monto REAL NOT NULL,
  fechaDonacion DATE NOT NULL
);

CREATE TABLE seguidores (
  idSeguidor INTEGER PRIMARY KEY,
  fechaSeguido DATE NOT NULL
);

CREATE TABLE redesSociales (
  idRedSocial INTEGER PRIMARY KEY,
  nombre TEXT NOT NULL
);

CREATE TABLE categorias (
  idCategoria INTEGER PRIMARY KEY,
  nombre TEXT NOT NULL
);

CREATE TABLE usuarioRedSocial (
  idUsuario INTEGER,
  idRedSocial INTEGER,
  PRIMARY KEY (idUsuario, idRedSocial),
  FOREIGN KEY (idUsuario) REFERENCES usuarios(idUsuario),
  FOREIGN KEY (idRedSocial) REFERENCES redesSociales(idRedSocial)
);

CREATE TABLE proyectos (
  idProyecto INTEGER PRIMARY KEY,
  nombre TEXT NOT NULL,
  montoObjetivo REAL NOT NULL,
  descripcion TEXT NOT NULL,
  montoActual REAL NOT NULL,
  novedad TEXT,
  idUsuario INTEGER,
  idCategoria INTEGER,
  FOREIGN KEY (idUsuario) REFERENCES usuarios(idUsuario),
  FOREIGN KEY (idCategoria) REFERENCES categorias(idCategoria)
);

CREATE TABLE imagenes (
  idImagen INTEGER PRIMARY KEY,
  url TEXT NOT NULL,
  idProyecto INTEGER,
  FOREIGN KEY (idProyecto) REFERENCES proyectos(idProyecto)
);

CREATE TABLE donacionesProyecto (
  idProyecto INTEGER,
  idDonacion INTEGER,
  PRIMARY KEY (idProyecto, idDonacion),
  FOREIGN KEY (idProyecto) REFERENCES proyectos(idProyecto),
  FOREIGN KEY (idDonacion) REFERENCES donaciones(idDonacion)
);

CREATE TABLE seguidorProyecto (
  idProyecto INTEGER,
  idSeguidor INTEGER,
  PRIMARY KEY (idProyecto, idSeguidor),
  FOREIGN KEY (idProyecto) REFERENCES proyectos(idProyecto),
  FOREIGN KEY (idSeguidor) REFERENCES seguidores(idSeguidor)
);

CREATE TABLE proyectosFavoritos (
  idUsuario INTEGER,
  idProyecto INTEGER,
  PRIMARY KEY (idUsuario, idProyecto),
  FOREIGN KEY (idProyecto) REFERENCES proyectos(idProyecto)
);
