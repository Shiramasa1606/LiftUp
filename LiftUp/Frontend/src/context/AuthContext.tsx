import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import jwt_decode, { jwtDecode } from 'jwt-decode'; // Usando import en lugar de require

interface AuthContextProps {
  isLoggedIn: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

interface DecodedToken {
  exp: number;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

const isTokenExpired = (token: string): boolean => {
  try {
    // Decodificar el token usando jwt_decode
    const decoded = jwtDecode<DecodedToken>(token);
    const currentTime = Date.now() / 1000; // Tiempo en segundos

    if (decoded && decoded.exp) {
      return decoded.exp < currentTime; // Verifica si el token ha expirado
    } else {
      console.error('Token no tiene campo "exp".');
      return true;
    }
  } catch (error) {
    console.error('Error al decodificar el token', error);
    return true; // Si no se puede decodificar, consideramos que está expirado
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [accessToken, setAccessToken] = useState<string | null>(localStorage.getItem('access_token'));
  const [refreshToken, setRefreshToken] = useState<string | null>(localStorage.getItem('refresh_token'));
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (accessToken && !isTokenExpired(accessToken)) {
      setIsLoggedIn(true);

      // Iniciar el intervalo para verificar la expiración del token
      intervalRef.current = setInterval(() => {
        if (accessToken && isTokenExpired(accessToken)) {
          refreshTokenRequest(refreshToken);
        }
      }, 5 * 60 * 1000); // Verificar cada 5 minutos

    } else {
      setIsLoggedIn(false);
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    }

    // Limpiar el intervalo cuando el componente se desmonte o cuando cambie el token
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [accessToken, refreshToken]); // Dependencias actualizadas cuando cambian los tokens

  const refreshTokenRequest = async (refreshToken: string | null) => {
    if (!refreshToken) return;

    try {
      const response = await fetch('http://localhost:3000/refresh-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });

      if (!response.ok) {
        throw new Error('No se pudo renovar el token');
      }

      const data = await response.json();
      localStorage.setItem('access_token', data.access_token); // Guarda el nuevo access token
      setAccessToken(data.access_token);
      setIsLoggedIn(true); // Se mantiene la sesión activa
    } catch (error) {
      console.error('Error al renovar el token:', error);
      logout(); // Si no se puede renovar, cerramos sesión
    }
  };

  const login = async (username: string, password: string) => {
    try {
      if (!username || !password) {
        throw new Error('Nombre de usuario y contraseña son requeridos.');
      }

      const isEmail = username.includes('@');
      const body = JSON.stringify({
        [isEmail ? 'email' : 'nombreUsuario']: username,
        password,
      });

      const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al iniciar sesión');
      }

      const data = await response.json();
      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('refresh_token', data.refresh_token); // Guarda también el refresh token
      setAccessToken(data.access_token);
      setRefreshToken(data.refresh_token);
      setIsLoggedIn(true);
    } catch (error) {
      throw error instanceof Error ? error : new Error('Error desconocido');
    }
  };

  const logout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
