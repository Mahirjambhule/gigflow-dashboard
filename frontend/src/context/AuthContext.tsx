import { createContext, useState, ReactNode, useContext } from 'react';
import { User, AuthResponse } from '../types/auth';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (userData: AuthResponse) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // FIXED: Initialize state directly from localStorage so it's instantly available on refresh!
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('token') || null;
  });

  const login = (userData: AuthResponse) => {
    const { token: jwtToken, ...userInfo } = userData;
    setUser(userInfo);
    setToken(jwtToken);
    localStorage.setItem('user', JSON.stringify(userInfo));
    localStorage.setItem('token', jwtToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};