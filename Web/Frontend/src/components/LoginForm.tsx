import React, { useState } from 'react';
import { IonButton, IonInput, IonItem, IonLabel, IonText, IonContent, IonCard, IonCardContent } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface LoginFormProps {
  mode: 'login' | 'register'; // Recibimos el modo como propiedad
}

const LoginForm: React.FC<LoginFormProps> = ({ mode }) => {
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();  // Suponiendo que tienes un contexto que maneja el login
  const history = useHistory();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async () => {
    setError(''); // Resetea el error al inicio

    // Arreglo de validaciones
    const validations = [
      { condition: !usernameOrEmail.trim() && !password.trim(), message: 'Por favor, completa ambos campos: "Nombre de Usuario / Correo Electrónico" y "Contraseña".' },
      { condition: !usernameOrEmail.trim(), message: 'Por favor, rellena el campo "Nombre de Usuario / Correo Electrónico".' },
      { condition: !password.trim(), message: 'Por favor, rellena el campo "Contraseña".' },
    ];

    // Itera sobre las validaciones
    for (const validation of validations) {
      if (validation.condition) {
        setError(validation.message);
        return; // Salir al encontrar el primer error
      }
    }

    // Determinar si se usa email o username, según el formato
    const identifier = usernameOrEmail.trim();
    const loginData = {
      identifier: validateEmail(identifier) ? identifier : '', // Si es email, lo usamos como email
      username: !validateEmail(identifier) ? identifier : '', // Si no es email, lo usamos como username
      password: password.trim(),
    };

    try {
      // Llamamos a login con el identificador (email o username)
      await login(identifier, password.trim());  // Ahora usamos solo dos parámetros, identificador y password
      history.push('/home');  // Redirige a la página principal después de iniciar sesión
    } catch (error) {
      console.error('Error al hacer la solicitud:', error);
      setError('Ocurrió un error al intentar iniciar sesión.');
    }
  };

  return (
    <IonContent>
      <IonCard>
        <IonCardContent>
          <IonItem>
            <IonLabel position="stacked">Nombre de usuario / Correo Electrónico</IonLabel>
            <IonInput value={usernameOrEmail} onIonInput={e => setUsernameOrEmail(e.detail.value!)} />
          </IonItem>
          <IonItem>
            <IonLabel position="stacked">Contraseña</IonLabel>
            <IonInput type="password" value={password} onIonInput={e => setPassword(e.detail.value!)} />
          </IonItem>
          {error && <IonText color="danger">{error}</IonText>}
          <IonButton expand="full" onClick={handleSubmit}>
            {mode === 'login' ? 'Iniciar sesión' : 'Registrarse'}
          </IonButton>
          <IonButton
            expand="full"
            fill="clear"
            routerLink={mode === 'login' ? "/recuperar-pass" : "/login"}
            style={{ marginTop: '16px' }}
          >
            {mode === 'login' ? '¿Olvidaste tu contraseña?' : '¿Ya tienes cuenta?'}
          </IonButton>
        </IonCardContent>
      </IonCard>
    </IonContent>
  );
};

export default LoginForm;
