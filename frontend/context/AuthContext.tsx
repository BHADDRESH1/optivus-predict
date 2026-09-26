import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Role } from '../types';

interface User {
  name: string;
  email: string;
  role: Role;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, role: Role) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = (email: string, role: Role) => {
    let name = 'Admin User';
    if (role === Role.TECHNICIAN) name = 'John Doe (Tech)';
    if (role === Role.SUPERVISOR) name = 'Dr. Sarah (Sup)';
    if (role === Role.HOSPITAL_HEAD) name = 'Dr. Chief (Head)';

    setUser({ name, email, role });
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
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
