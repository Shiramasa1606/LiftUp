import sqlite3
import os

# Construye la ruta absoluta basada en la ubicación del script
base_dir = os.path.dirname(os.path.abspath(__file__))  # Directorio actual del script
db_path = os.path.join(base_dir, 'db', 'database.db')

# Asegúrate de que el directorio exista
os.makedirs(os.path.dirname(db_path), exist_ok=True)


schema = """
INSERT INTO categorias (nombre)
VALUES 
  ('Tecnología'),
  ('Salud'),
  ('Educación'),
  ('Negocios'),
  ('Arte y Cultura'),
  ('Deportes'),
  ('Medio Ambiente'),
  ('Ciencias Sociales');
"""
conn = sqlite3.connect(db_path)
cursor = conn.cursor()
cursor.executescript(schema)
conn.commit()
conn.close()

print("Se cargaron con exito las categorias")