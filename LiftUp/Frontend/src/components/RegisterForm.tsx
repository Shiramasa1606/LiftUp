import React, { useState } from 'react';
import { IonButton, IonInput, IonItem, IonLabel, IonText, IonContent, IonCard, IonCardHeader, IonCardContent, IonCardTitle } from '@ionic/react';
import { eye, eyeOff } from 'ionicons/icons';
import { IonIcon } from '@ionic/react';
import { useHistory } from 'react-router-dom';

interface RegisterFormProps {
  mode: 'login' | 'register';  // Agregado para recibir la prop "mode"
}

const RegisterForm: React.FC<RegisterFormProps> = ({ mode }) => {  // Aceptando la prop mode
  const history = useHistory();
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [rut, setRut] = useState('');
  const [email, setEmail] = useState('');
  const [region, setRegion] = useState('');
  const [comuna, setComuna] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateRut = (rut: string) => {
    const rutRegex = /^\d{1,8}-[0-9kK]$/;
    return rutRegex.test(rut);
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+[\]{};':"\\|,.<>?])(?=.{8,})/;
    return passwordRegex.test(password);
  };

  const handleSubmit = async () => {
    // Validaciones de campos vacíos
    if (!nombreUsuario || !rut || !email || !region || !comuna || !password || !confirmPassword) {
      setError('Por favor, completa todos los campos.');
      return;
    }
  
    // Verificar los valores antes de hacer el fetch
    console.log({ nombreUsuario, rut, email, password, region, comuna });
  
    // Validaciones de formato
    if (!validateRut(rut)) {
      setError('Formato de RUT inválido.');
      return;
    }
    if (!validateEmail(email)) {
      setError('Formato de correo electrónico inválido.');
      return;
    }
    if (!validatePassword(password)) {
      setError('La contraseña debe tener al menos 8 caracteres, incluyendo una mayúscula, una minúscula, un número y un carácter especial.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }
    if (!termsAccepted) {
      setError('Debes aceptar los términos y condiciones.');
      return;
    }
  
    try {
      const apiUrl = 'http://localhost:3000';  // URL correcta para Flask
  
      // Enviar la solicitud POST
      const response = await fetch(`${apiUrl}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombreUsuario,
          rut,
          email,
          password,
          region,
          comuna
        }),
      });
  
      // Verificar si la respuesta fue exitosa
      if (!response.ok) {
        // Manejar errores específicos de la respuesta (Error 400, 500, etc.)
        if (response.status === 400) {
          const errorData = await response.json();
          setError(errorData.error || 'Error desconocido');
        } else {
          const errorMessage = `Error: ${response.statusText}`;
          setError(errorMessage);
        }
        return;
      }
  
      // Intentar parsear la respuesta a JSON
      const data = await response.json();
  
      // Si no hay datos o el formato es incorrecto
      if (!data) {
        setError('La respuesta está vacía o no tiene un formato válido.');
        return;
      }
  
      // Verificar si hubo un error en la respuesta
      if (data && data.error) {
        setError(data.error);  // Mostrar el error que devuelve la API
        console.error(data.error);  // Para depuración en la consola
        return;
      }
  
      // Si la respuesta es exitosa, redirigir al usuario a la página de login
      history.push('/login');
      
    } catch (error) {
      // Manejo de errores en caso de que falle la solicitud
      console.error('Error al hacer la solicitud:', error);
      setError('Ocurrió un error al intentar registrar al usuario.');
    }
  };
  

  return (
    <IonContent>
      <IonCard>
        <IonCardHeader>
          <IonCardTitle>Registro</IonCardTitle>
        </IonCardHeader>
        <IonCardContent>
          <IonItem>
            <IonLabel position="stacked">Nombre de usuario</IonLabel>
            <IonInput value={nombreUsuario} onIonChange={e => setNombreUsuario(e.detail.value!)} />
          </IonItem>
          <IonItem>
            <IonLabel position="stacked">RUT</IonLabel>
            <IonInput value={rut} onIonChange={e => setRut(e.detail.value!)} />
          </IonItem>
          <IonItem>
            <IonLabel position="stacked">Correo Electrónico</IonLabel>
            <IonInput type="email" value={email} onIonChange={e => setEmail(e.detail.value!)} />
          </IonItem>
          <IonItem>
            <IonLabel position="stacked">Región</IonLabel>
            <IonInput value={region} onIonChange={e => setRegion(e.detail.value!)} />
          </IonItem>
          <IonItem>
            <IonLabel position="stacked">Comuna</IonLabel>
            <IonInput value={comuna} onIonChange={e => setComuna(e.detail.value!)} />
          </IonItem>
          <IonItem>
            <IonLabel position="stacked">Contraseña</IonLabel>
            <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
              <IonInput 
                type={showPassword ? 'text' : 'password'} 
                value={password} 
                onIonChange={e => setPassword(e.detail.value!)} 
                style={{ flex: 1 }} 
              />
              <IonButton onClick={() => setShowPassword(!showPassword)} fill="clear">
                <IonIcon icon={showPassword ? eyeOff : eye} />
              </IonButton>
            </div>
          </IonItem>
          <IonItem>
            <IonLabel position="stacked">Confirmar Contraseña</IonLabel>
            <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
              <IonInput 
                type={showConfirmPassword ? 'text' : 'password'} 
                value={confirmPassword} 
                onIonChange={e => setConfirmPassword(e.detail.value!)} 
                style={{ flex: 1 }} 
              />
              <IonButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} fill="clear">
                <IonIcon icon={showConfirmPassword ? eyeOff : eye} />
              </IonButton>
            </div>
          </IonItem>
          <IonItem>
            <IonLabel>
              <input
                type="checkbox"
                checked={termsAccepted}
                onChange={e => setTermsAccepted(e.target.checked)}
              />
              <span style={{ marginLeft: '8px' }}>Acepto los términos y condiciones</span>
            </IonLabel>
          </IonItem>
          {error && <IonText color="danger">{error}</IonText>}
          <IonButton expand="full" onClick={handleSubmit}>Registrarse</IonButton>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '16px' }}>
            <IonButton fill="clear" onClick={() => history.push('/recuperar-pass')}>
              ¿Olvidaste tu contraseña?
            </IonButton>
          </div>
        </IonCardContent>
      </IonCard>
    </IonContent>
  );
};

export default RegisterForm;
