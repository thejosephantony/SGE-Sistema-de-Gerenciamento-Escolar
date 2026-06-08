import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api } from '../services/api';
import { jwtDecode } from 'jwt-decode';

interface User {
  id: number;
  nome: string;
  email: string;
  perfil: string;
}

interface AuthContextData {
  user: User | null;
  signed: boolean;
  signIn: (token: string, user: User) => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('@sge:token');
    const storedUser = localStorage.getItem('@sge:user');

    if (token && storedUser) {
      try {
        const decodedToken: any = jwtDecode(token);
        // Verifica se o token expirou (expiração em segundos)
        if (decodedToken.exp * 1000 < Date.now()) {
          signOut();
        } else {
          setUser(JSON.parse(storedUser));
        }
      } catch (e) {
        signOut();
      }
    }
  }, []);

  function signIn(token: string, loggedUser: User) {
    localStorage.setItem('@sge:token', token);
    localStorage.setItem('@sge:user', JSON.stringify(loggedUser));
    setUser(loggedUser);
  }

  function signOut() {
    localStorage.removeItem('@sge:token');
    localStorage.removeItem('@sge:user');
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ signed: !!user, user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  return context;
}
