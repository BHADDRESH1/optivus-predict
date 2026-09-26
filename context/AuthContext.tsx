import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Role } from '../types';
import { authAPI, usersAPI } from '../utils/api';

interface User {
  _id?: string;
  name: string;
  email: string;
  role: Role | string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, demoMode?: boolean, demoRole?: Role) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check if user is already logged in on mount
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      // Try to get current user info
      // For now, we'll just check if token exists
      // In a real app, you'd verify the token and fetch user data
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string, demoMode?: boolean, demoRole?: Role) => {
    try {
      // Demo mode fallback (for when backend is not available)
      if (demoMode && demoRole) {
        let name = 'Admin User';
        if (demoRole === Role.TECHNICIAN) name = 'John Doe (Tech)';
        if (demoRole === Role.SUPERVISOR) name = 'Dr. Sarah (Sup)';
        if (demoRole === Role.HOSPITAL_HEAD) name = 'Dr. Chief (Head)';

        setUser({
          name,
          email,
          role: demoRole
        });
        return;
      }

      // Real API login
      const data = await authAPI.login(email, password);
      if (data.user) {
        // Map backend role to frontend Role enum if needed
        let role: Role = Role.TECHNICIAN;
        const backendRole = data.user.role?.toLowerCase();
        
        if (backendRole === 'admin') role = Role.ADMIN;
        else if (backendRole === 'supervisor') role = Role.SUPERVISOR;
        else if (backendRole === 'technician') role = Role.TECHNICIAN;
        else if (backendRole === 'hospital head') role = Role.HOSPITAL_HEAD;
        
        setUser({
          _id: data.user.id,
          name: data.user.name || email,
          email: data.user.email || email,
          role: role
        });
      }
    } catch (error: any) {
      // If backend is not available, suggest demo mode
      if (error.message?.includes('not available')) {
        throw new Error('Backend server is not running. Please start it or use demo mode.');
      }
      throw new Error(error.message || 'Login failed');
    }
  };

  const logout = async () => {
    try {
      // Only call API logout if we have a token (real login)
      const token = localStorage.getItem('accessToken');
      if (token) {
        await authAPI.logout();
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user, loading }}>
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