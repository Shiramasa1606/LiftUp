from flask import Flask, jsonify, request
from flask_jwt_extended import JWTManager, create_access_token, create_refresh_token, jwt_required, get_jwt_identity
import sqlite3
import bcrypt
import re
from dotenv import load_dotenv
import os
from flask_cors import CORS

# Cargar las variables de entorno desde el archivo .env
load_dotenv()
app = Flask(__name__)

# Configurar CORS con Flask-CORS
CORS(app, resources={r"/*": {"origins": "http://localhost:8100"}}, supports_credentials=True)

# Configuración de seguridad usando las variables de entorno
app.secret_key = os.getenv('FLASK_SECRET_KEY')  # Clave secreta de Flask
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY')  # Clave secreta de JWT

jwt = JWTManager(app)  # Manejo de JWT

def connect_db():
    try:
        BASE_DIR = os.path.dirname(os.path.abspath(__file__))
        DB_PATH = os.path.join(BASE_DIR, 'db', 'database.db')

        # Verifica si la base de datos realmente existe
        if not os.path.exists(DB_PATH):
            raise Exception(f"La base de datos no existe en {DB_PATH}")

        conn = sqlite3.connect(DB_PATH, check_same_thread=False)
        print(f"Conexión exitosa a la base de datos en {DB_PATH}.")
        return conn
    except Exception as e:
        print(f"Error al conectar a la base de datos: {e}")
        raise


# Helper para validar correos electrónicos
def validar_email(email):
    patron = r'^[\w\.-]+@[\w\.-]+\.\w+$'
    return re.match(patron, email) is not None


@app.route('/register', methods=['POST'])
def crear_usuario():
    data = request.json

    # Validación de los campos necesarios
    required_fields = ['email', 'password', 'nombreUsuario', 'rut', 'region', 'comuna']
    for field in required_fields:
        if field not in data:
            return jsonify({'error': f'El campo {field} es requerido'}), 400

    # Validación de email y contraseña
    if not validar_email(data['email']):
        return jsonify({'error': 'Email inválido'}), 400
    if len(data['password']) < 8:
        return jsonify({'error': 'La contraseña debe tener al menos 8 caracteres'}), 400

    # Verificar que el nombre de usuario no esté ya en uso
    try:
        conn = connect_db()
        cursor = conn.cursor()

        # Verificar si ya existe un usuario con el mismo email o nombre de usuario
        cursor.execute("SELECT COUNT(*) FROM usuarios WHERE email = ?", (data['email'],))
        if cursor.fetchone()[0] > 0:
            return jsonify({'error': 'El email ya está registrado'}), 400

        cursor.execute("SELECT COUNT(*) FROM usuarios WHERE nombreUsuario = ?", (data['nombreUsuario'],))
        if cursor.fetchone()[0] > 0:
            return jsonify({'error': 'El nombre de usuario ya está en uso'}), 400

        # Hash de la contraseña
        hashed_password = bcrypt.hashpw(data['password'].encode('utf-8'), bcrypt.gensalt())

        # Insertar el nuevo usuario con los nuevos campos
        query = """
        INSERT INTO usuarios (email, password, nombreUsuario, rut, region, comuna, proyectosPatrocinados, avatar, biografia)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        """
        cursor.execute(query, (
            data['email'], 
            hashed_password.decode('utf-8'), 
            data['nombreUsuario'], 
            data['rut'],  # Rut
            data['region'],  # Región
            data['comuna'],  # Comuna
            data.get('proyectosPatrocinados', 0),  # Proyectos patrocinados (default a 0)
            data.get('avatar', None),  # Avatar (puede ser None)
            data.get('biografia', None)  # Biografía (puede ser None)
        ))
        conn.commit()

        return jsonify({'message': 'Usuario creado exitosamente'}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500  # Error 500 para problemas internos
    finally:
        conn.close()


@app.route('/login', methods=['POST'])
def login():
    try:
        data = request.json
        
        # Validación de campos obligatorios
        if not data or ('email' not in data and 'nombreUsuario' not in data) or 'password' not in data:
            return jsonify({'error': 'Faltan campos obligatorios'}), 400
        
        conn = connect_db()
        cursor = conn.cursor()
        
        # Verifica si se recibe un email o un nombre de usuario y busca en la base de datos
        if 'email' in data:
            cursor.execute("SELECT * FROM usuarios WHERE email = ?", (data['email'],))
        else:
            cursor.execute("SELECT * FROM usuarios WHERE nombreUsuario = ?", (data['nombreUsuario'],))
        
        usuario = cursor.fetchone()
        conn.close()

        # Verifica si el usuario existe y si la contraseña es correcta
        if usuario and bcrypt.checkpw(data['password'].encode('utf-8'), usuario[2].encode('utf-8')):  # Índice 2 para la contraseña
            access_token = create_access_token(identity=usuario[0])  # Índice 0 para idUsuario
            refresh_token = create_refresh_token(identity=usuario[0])  # Crear un refresh token
            return jsonify({'access_token': access_token, 'refresh_token': refresh_token}), 200

        return jsonify({'error': 'Credenciales inválidas'}), 401
    except sqlite3.Error as e:
        return jsonify({'error': f'Error en la base de datos: {e}'}), 500
    except Exception as e:
        return jsonify({'error': f'Error desconocido: {e}'}), 500


@app.route('/refresh-token', methods=['POST'])
@jwt_required(refresh=True)  # Esta decorador asegura que el token usado para esta ruta es un refresh token
def refresh_token():
    current_user = get_jwt_identity()  # Obtiene el usuario actual a partir del refresh token
    try:
        # Genera un nuevo access token usando el identity del usuario
        new_access_token = create_access_token(identity=current_user)
        return jsonify({'access_token': new_access_token}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/categorias', methods=['GET'])
def obtener_categorias():
    try:
        conn = connect_db()
        cursor = conn.cursor()
        query = "SELECT idCategoria, nombre FROM categorias"
        cursor.execute(query)
        categorias = [{"idCategoria": row[0], "nombre": row[1]} for row in cursor.fetchall()]
        return jsonify(categorias), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()


@app.route('/proyectos', methods=['GET'])
@jwt_required()
def obtener_proyectos():
    try:
        conn = connect_db()
        cursor = conn.cursor()
        query = """
        SELECT p.idProyecto, p.nombre, p.descripcion, p.montoObjetivo, p.montoActual, 
               p.fechaCreacion, p.fechaLimite, u.nombreUsuario, c.nombre as categoria
        FROM proyectos p
        JOIN usuarios u ON p.idUsuario = u.idUsuario
        JOIN categorias c ON p.idCategoria = c.idCategoria
        """
        cursor.execute(query)
        proyectos = [
            {
                "id": row[0],                   # idProyecto
                "nombre": row[1],               # nombre
                "descripcion": row[2],          # descripción
                "meta": float(row[3]),          # montoObjetivo
                "recaudado": float(row[4]),     # montoActual
                "fechaCreacion": row[5],        # fechaCreacion
                "fechaLimite": row[6],          # fechaLimite
                "categoria": row[8],            # categoría
                "creador": row[7],              # nombreUsuario
                "esFavorito": False,            # valor por defecto
                "esSeguido": False              # valor por defecto
            }
            for row in cursor.fetchall()
        ]
        return jsonify(proyectos), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400
    finally:
        conn.close()



@app.route('/crear-proyecto', methods=['POST'])
@jwt_required()
def agregar_proyecto():
    usuario_actual = get_jwt_identity()
    data = request.json
    
    # Validar los campos obligatorios
    if 'titulo' not in data or 'objetivoFondos' not in data or 'categoria' not in data or 'descripcion' not in data:
        return jsonify({'error': 'Faltan campos obligatorios'}), 400

    try:
        conn = connect_db()
        cursor = conn.cursor()

        # Buscar el idCategoria basado en el nombre de la categoría proporcionada
        query_categoria = "SELECT idCategoria FROM categorias WHERE nombre = ?"
        cursor.execute(query_categoria, (data['categoria'],))
        categoria_resultado = cursor.fetchone()

        if categoria_resultado is None:
            return jsonify({'error': 'La categoría proporcionada no existe'}), 404

        idCategoria = categoria_resultado[0]

        # Si no se proporciona la fechaLimite, la dejamos como NULL
        fechaLimite = data.get('fechaTermino', None)

        # Insertar el proyecto en la base de datos
        query = """
        INSERT INTO proyectos (nombre, montoObjetivo, descripcion, montoActual, fechaCreacion, fechaLimite, idCategoria, idUsuario)
        VALUES (?, ?, ?, ?, CURRENT_DATE, ?, ?, ?)
        """
        cursor.execute(query, (
            data['titulo'],  # El título es el nombre del proyecto
            data['objetivoFondos'], 
            data.get('descripcion', ''),  # Si no hay descripción, se coloca un string vacío
            0,  # montoActual inicializado en 0
            fechaLimite,  # Si no se pasa fechaLimite, será None
            idCategoria, 
            usuario_actual
        ))
        conn.commit()

        return jsonify({'message': 'Proyecto creado exitosamente'}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

#-------------------
@app.route('/mis-proyectos', methods=['GET'])
@jwt_required()  # Requiere autenticación
def obtener_mis_proyectos():
    usuario_actual = get_jwt_identity()
    try:
        conn = connect_db()
        cursor = conn.cursor()

        # Consulta para obtener proyectos creados por el usuario actual
        query = """
        SELECT p.idProyecto, p.nombre, p.descripcion, p.montoObjetivo, p.montoActual, p.fechaCreacion, 
               p.fechaLimite, c.nombre as categoria
        FROM proyectos p
        JOIN categorias c ON p.idCategoria = c.idCategoria
        WHERE p.idUsuario = ?
        """
        cursor.execute(query, (usuario_actual,))
        proyectos = [
            {
                "id": row[0],                      # id del proyecto
                "nombre": row[1],                  # nombre del proyecto
                "descripcion": row[2],             # descripción
                "meta": row[3],                    # montoObjetivo
                "recaudado": row[4],               # montoActual
                "categoria": row[7],               # nombre de la categoría
                "esFavorito": False,               # Valor inicial (puedes ajustarlo si tienes lógica para esto)
                "esSeguido": False,                # Valor inicial (puedes ajustarlo si tienes lógica para esto)
                "idCreador": usuario_actual        # ID del usuario creador
            }
            for row in cursor.fetchall()
        ]
        return jsonify(proyectos), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()


# endpoints para proyectosSeguidos---------

@app.route('/proyectos-seguidos', methods=['GET'])
@jwt_required()
def obtener_proyectos_seguidos():
    """
    Devuelve los proyectos que el usuario actual está siguiendo.
    """
    usuario_actual = get_jwt_identity()
    try:
        conn = connect_db()
        cursor = conn.cursor()

        # Consulta para obtener los proyectos seguidos por el usuario
        query = """
        SELECT p.idProyecto, p.nombre, p.descripcion, p.montoObjetivo, p.montoActual, p.fechaCreacion,
               p.fechaLimite, c.nombre as categoria
        FROM proyectos p
        JOIN categorias c ON p.idCategoria = c.idCategoria
        JOIN seguidores s ON p.idProyecto = s.idProyecto
        WHERE s.idUsuario = ?
        """
        cursor.execute(query, (usuario_actual,))
        proyectos_seguidos = [
            {
                "id": row[0],
                "nombre": row[1],
                "descripcion": row[2],
                "meta": row[3],
                "recaudado": row[4],
                "fechaCreacion": row[5],
                "fechaLimite": row[6],
                "categoria": row[7]
            }
            for row in cursor.fetchall()
        ]
        return jsonify(proyectos_seguidos), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()


@app.route('/seguir-proyecto', methods=['POST'])
@jwt_required()
def seguir_proyecto():
    """
    Permite a un usuario seguir un proyecto.
    """
    usuario_actual = get_jwt_identity()
    data = request.json

    # Validar que el campo idProyecto esté presente
    if 'idProyecto' not in data:
        return jsonify({'error': 'El campo idProyecto es obligatorio'}), 400

    try:
        conn = connect_db()
        cursor = conn.cursor()

        # Verificar si el usuario ya sigue el proyecto
        query_verificar = "SELECT * FROM seguidores WHERE idUsuario = ? AND idProyecto = ?"
        cursor.execute(query_verificar, (usuario_actual, data['idProyecto']))
        if cursor.fetchone():
            return jsonify({'error': 'Ya estás siguiendo este proyecto'}), 400

        # Insertar el seguidor
        query = "INSERT INTO seguidores (idUsuario, idProyecto, fechaSeguido) VALUES (?, ?, CURRENT_DATE)"
        cursor.execute(query, (usuario_actual, data['idProyecto']))
        conn.commit()

        return jsonify({'message': 'Proyecto seguido exitosamente'}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()


@app.route('/dejar-de-seguir', methods=['DELETE'])
@jwt_required()
def dejar_de_seguir():
    """
    Permite a un usuario dejar de seguir un proyecto.
    """
    usuario_actual = get_jwt_identity()
    data = request.json

    # Validar que el campo idProyecto esté presente
    if 'idProyecto' not in data:
        return jsonify({'error': 'El campo idProyecto es obligatorio'}), 400

    try:
        conn = connect_db()
        cursor = conn.cursor()

        # Eliminar el registro de seguimiento
        query = "DELETE FROM seguidores WHERE idUsuario = ? AND idProyecto = ?"
        cursor.execute(query, (usuario_actual, data['idProyecto']))
        conn.commit()

        if cursor.rowcount == 0:
            return jsonify({'error': 'No estás siguiendo este proyecto'}), 404

        return jsonify({'message': 'Has dejado de seguir el proyecto exitosamente'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()


# -------------------


@app.route('/user-profile', methods=['GET'])
@jwt_required()
def user_profile():
    try:
        usuario_id = get_jwt_identity()
        conn = connect_db()
        cursor = conn.cursor()
        query = "SELECT email, nombreUsuario, rut, region, comuna, avatar, biografia FROM usuarios WHERE idUsuario = ?"
        cursor.execute(query, (usuario_id,))
        usuario = cursor.fetchone()
        if usuario:
            return jsonify({
                'email': usuario[0],
                'nombreUsuario': usuario[1],
                'rut': usuario[2],
                'region': usuario[3],
                'comuna': usuario[4],
                'avatar': usuario[5],
                'biografia': usuario[6]
            }), 200
        return jsonify({'error': 'Usuario no encontrado'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()


@app.route('/edit-profile', methods=['PUT'])
@jwt_required()
def edit_profile():
    data = request.json
    usuario_id = get_jwt_identity()
    
    # Validar los campos que se pueden actualizar
    updates = []
    values = []

    if 'email' in data:
        updates.append("email = ?")
        values.append(data['email'])
    if 'nombreUsuario' in data:
        updates.append("nombreUsuario = ?")
        values.append(data['nombreUsuario'])
    if 'rut' in data:
        updates.append("rut = ?")
        values.append(data['rut'])
    if 'region' in data:
        updates.append("region = ?")
        values.append(data['region'])
    if 'comuna' in data:
        updates.append("comuna = ?")
        values.append(data['comuna'])
    if 'avatar' in data:
        updates.append("avatar = ?")
        values.append(data['avatar'])
    if 'biografia' in data:
        updates.append("biografia = ?")
        values.append(data['biografia'])
    
    # Si socialLinks están presentes, actualizamos los campos correspondientes
    if 'socialLinks' in data:
        social_updates = []
        for field, value in data['socialLinks'].items():
            if value:
                social_updates.append(f"{field} = ?")
                values.append(value)
        
        if social_updates:
            updates.extend(social_updates)

    if not updates:
        return jsonify({'error': 'No hay datos para actualizar'}), 400
    
    set_clause = ", ".join(updates)
    values.append(usuario_id)  # Agregar el id del usuario al final para la cláusula WHERE
    
    try:
        conn = connect_db()
        cursor = conn.cursor()
        query = f"UPDATE usuarios SET {set_clause} WHERE idUsuario = ?"
        cursor.execute(query, tuple(values))
        conn.commit()
        return jsonify({'message': 'Perfil actualizado exitosamente'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()



if __name__ == '__main__':
    app.run(debug=True, port=3000)
