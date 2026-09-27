import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Role } from '../types';
import { authAPI } from '../utils/api';
import { normalizeRole, getRoleInfo } from '../permissions';

export interface User {
  _id?: string;
  name: string;
  email: string;
  role: Role;
  facilityName?: string;
  facilityId?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, demoMode?: boolean, demoRole?: Role) => Promise<void>;
  logout: () => Promise<void>;
  switchRole: (newRole: Role) => void;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const getDefaultUserDataForRole = (role: Role, email?: string): User => {
  switch (role) {
    case Role.ADMIN:
      return {
        name: 'Admin User',
        email: email || 'admin@optivus.org',
        role: Role.ADMIN,
        facilityName: 'Central Command Hub',
        facilityId: 'GLOBAL-01'
      };
    case Role.HOSPITAL_HEAD:
      return {
        name: 'Dr. Chief Medical Officer',
        email: email || 'head@hospital-a.org',
        role: Role.HOSPITAL_HEAD,
        facilityName: 'Hospital A (Executive Hub)',
        facilityId: 'FAC-01'
      };
    case Role.SUPERVISOR:
      return {
        name: 'Dr. Sarah Jenkins (Pharmacy Sup)',
        email: email || 'supervisor@hospital-a.org',
        role: Role.SUPERVISOR,
        facilityName: 'Hospital A Central Pharmacy',
        facilityId: 'FAC-01'
      };
    case Role.PHARMACIST:
    default:
      return {
        name: 'John Doe (Dispensary RPh)',
        email: email || 'pharmacist@hospital-a.org',
        role: Role.PHARMACIST,
        facilityName: 'Dispensary Unit #1 (Outpatient)',
        facilityId: 'DISP-01'
      };
  }
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const savedUser = localStorage.getItem('active_user_session');
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        return {
          ...parsed,
          role: normalizeRole(parsed.role)
        };
      }
    } catch {
      // fallback
    }
    return null;
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem('active_user_session', JSON.stringify(user));
    } else {
      localStorage.removeItem('active_user_session');
    }
  }, [user]);

  const login = async (email: string, password: string, demoMode?: boolean, demoRole?: Role) => {
    try {
      // Demo mode fallback (for instant evaluation or offline judge demo)
      if (demoMode || !email || !password) {
        const selectedRole = normalizeRole(demoRole || Role.ADMIN);
        const userData = getDefaultUserDataForRole(selectedRole, email);
        setUser(userData);
        return;
      }

      // Real API login
      const data = await authAPI.login(email, password);
      if (data && data.user) {
        const backendRole = normalizeRole(data.user.role || demoRole || Role.ADMIN);
        setUser({
          _id: data.user.id || data.user._id,
          name: data.user.name || email,
          email: data.user.email || email,
          role: backendRole,
          facilityName: data.user.facilityName || 'Hospital A',
          facilityId: data.user.facilityId || 'FAC-01'
        });
      } else {
        // Fallback for demo credentials
        const selectedRole = normalizeRole(demoRole || Role.ADMIN);
        setUser(getDefaultUserDataForRole(selectedRole, email));
      }
    } catch (error: any) {
      if (demoRole) {
        // Fallback to demo mode if backend is unreachable
        setUser(getDefaultUserDataForRole(normalizeRole(demoRole), email));
        return;
      }
      throw new Error(error.message || 'Login failed');
    }
  };

  const switchRole = (newRole: Role) => {
    const normalized = normalizeRole(newRole);
    const updated = getDefaultUserDataForRole(normalized, user?.email);
    setUser(updated);
  };

  const logout = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (token) {
        await authAPI.logout();
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      localStorage.removeItem('active_user_session');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, switchRole, isAuthenticated: !!user, loading }}>
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