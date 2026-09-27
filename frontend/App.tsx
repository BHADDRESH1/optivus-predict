import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { AccessDenied } from './components/AccessDenied';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { MedicineInventory } from './pages/MedicineInventory';
import { StockoutPrediction } from './pages/StockoutPrediction';
import { ConsumptionAnalytics } from './pages/ConsumptionAnalytics';
import { Redistribution } from './pages/Redistribution';
import { AlertsPage } from './pages/Alerts';
import { ReportsPage } from './pages/Reports';
import { FacilitiesPage } from './pages/Facilities';
import { UsersAdminPage, SettingsPage } from './pages/Admin';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Role } from './types';
import { normalizeRole } from './permissions';

// Reusable Protected Route Component with RBAC & Access Denied handling
const ProtectedRoute: React.FC<{ 
  children: React.ReactElement; 
  roles?: Role[];
  moduleName?: string;
}> = ({ children, roles, moduleName = 'this module' }) => {
  const { user, isAuthenticated } = useAuth();

  // 1. Check Authentication
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // 2. Check Role Authorization
  if (roles && user) {
    const userRole = normalizeRole(user.role);
    const isAuthorized = roles.includes(userRole);
    if (!isAuthorized) {
      return (
        <Layout>
          <AccessDenied 
            moduleName={moduleName} 
            userRole={user.role} 
            allowedRoles={roles} 
          />
        </Layout>
      );
    }
  }

  return children;
};

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Route */}
      <Route path="/" element={<Login />} />

      {/* Protected Routes */}
      {/* Dashboard - Accessible to all authorized roles */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Layout><Dashboard /></Layout>
        </ProtectedRoute>
      } />
      
      {/* Medicine Inventory - Accessible to all 4 roles (with role-tailored view/actions) */}
      <Route path="/admin/medicine-inventory" element={
        <ProtectedRoute roles={[Role.ADMIN, Role.HOSPITAL_HEAD, Role.SUPERVISOR, Role.PHARMACIST]} moduleName="Medicine Inventory">
          <Layout><MedicineInventory /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/inventory" element={<Navigate to="/admin/medicine-inventory" replace />} />
      <Route path="/equipment" element={<Navigate to="/admin/medicine-inventory" replace />} />
      <Route path="/equipment/*" element={<Navigate to="/admin/medicine-inventory" replace />} />
      
      {/* AI Stockout Prediction - Admin, Hospital Head, Pharmacy Supervisor */}
      <Route path="/admin/stockout-prediction" element={
        <ProtectedRoute roles={[Role.ADMIN, Role.HOSPITAL_HEAD, Role.SUPERVISOR]} moduleName="AI Stockout Prediction">
          <Layout><StockoutPrediction /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/predictive" element={<Navigate to="/admin/stockout-prediction" replace />} />
      
      {/* Consumption Analytics - Admin, Hospital Head, Pharmacy Supervisor */}
      <Route path="/admin/analytics" element={
        <ProtectedRoute roles={[Role.ADMIN, Role.HOSPITAL_HEAD, Role.SUPERVISOR]} moduleName="Consumption Analytics">
          <Layout><ConsumptionAnalytics /></Layout>
        </ProtectedRoute>
      } />
      
      {/* Smart Redistribution Module - Admin, Hospital Head, Pharmacy Supervisor */}
      <Route path="/admin/redistribution" element={
        <ProtectedRoute roles={[Role.ADMIN, Role.HOSPITAL_HEAD, Role.SUPERVISOR]} moduleName="Smart Stock Redistribution">
          <Layout><Redistribution /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/tasks" element={<Navigate to="/admin/redistribution" replace />} />
      <Route path="/calendar" element={<Navigate to="/admin/analytics" replace />} />
      <Route path="/verification" element={<Navigate to="/admin/analytics" replace />} />
      
      {/* Alerts - Accessible to all roles */}
      <Route path="/admin/alerts" element={
        <ProtectedRoute roles={[Role.ADMIN, Role.HOSPITAL_HEAD, Role.SUPERVISOR, Role.PHARMACIST]} moduleName="Medicine Alerts">
          <Layout><AlertsPage /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/alerts" element={<Navigate to="/admin/alerts" replace />} />
      
      {/* Reports - Accessible to all roles */}
      <Route path="/admin/reports" element={
        <ProtectedRoute roles={[Role.ADMIN, Role.HOSPITAL_HEAD, Role.SUPERVISOR, Role.PHARMACIST]} moduleName="Reports & Intelligence Exports">
          <Layout><ReportsPage /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/reports" element={<Navigate to="/admin/reports" replace />} />
      
      {/* Facilities Network Module - Admin & Hospital Head */}
      <Route path="/admin/facilities" element={
        <ProtectedRoute roles={[Role.ADMIN, Role.HOSPITAL_HEAD]} moduleName="Facility Network Management">
          <Layout><FacilitiesPage /></Layout>
        </ProtectedRoute>
      } />
      
      {/* Users / Administration - System Admin ONLY */}
      <Route path="/admin/users" element={
        <ProtectedRoute roles={[Role.ADMIN]} moduleName="User Administration & System Controls">
          <Layout><UsersAdminPage /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/team" element={<Navigate to="/admin/users" replace />} />
      
      {/* Settings */}
      <Route path="/settings" element={
        <ProtectedRoute>
          <Layout><SettingsPage /></Layout>
        </ProtectedRoute>
      } />
      
      {/* Fallback */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
};

export default App;