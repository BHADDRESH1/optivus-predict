import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
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

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactElement; roles?: Role[] }> = ({ children, roles }) => {
  const { user, isAuthenticated } = useAuth();

  // 1. Check Authentication
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // 2. Check Role Authorization
  if (roles && user && !roles.includes(user.role as Role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Route */}
      <Route path="/" element={<Login />} />

      {/* Protected Routes */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Layout><Dashboard /></Layout>
        </ProtectedRoute>
      } />
      
      {/* Medicine Inventory Routes */}
      <Route path="/admin/medicine-inventory" element={
        <ProtectedRoute>
          <Layout><MedicineInventory /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/inventory" element={<Navigate to="/admin/medicine-inventory" replace />} />
      <Route path="/equipment" element={<Navigate to="/admin/medicine-inventory" replace />} />
      <Route path="/equipment/*" element={<Navigate to="/admin/medicine-inventory" replace />} />
      
      {/* AI Stockout Prediction */}
      <Route path="/admin/stockout-prediction" element={
        <ProtectedRoute>
          <Layout><StockoutPrediction /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/predictive" element={<Navigate to="/admin/stockout-prediction" replace />} />
      
      {/* Consumption Analytics */}
      <Route path="/admin/analytics" element={
        <ProtectedRoute>
          <Layout><ConsumptionAnalytics /></Layout>
        </ProtectedRoute>
      } />
      
      {/* Smart Redistribution Module */}
      <Route path="/admin/redistribution" element={
        <ProtectedRoute roles={[Role.ADMIN, Role.HOSPITAL_HEAD, Role.SUPERVISOR]}>
          <Layout><Redistribution /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/tasks" element={<Navigate to="/admin/redistribution" replace />} />
      <Route path="/calendar" element={<Navigate to="/admin/analytics" replace />} />
      <Route path="/verification" element={<Navigate to="/admin/analytics" replace />} />
      
      {/* Alerts */}
      <Route path="/admin/alerts" element={
        <ProtectedRoute roles={[Role.ADMIN, Role.HOSPITAL_HEAD, Role.SUPERVISOR]}>
          <Layout><AlertsPage /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/alerts" element={<Navigate to="/admin/alerts" replace />} />
      
      {/* Reports */}
      <Route path="/admin/reports" element={
        <ProtectedRoute roles={[Role.ADMIN, Role.HOSPITAL_HEAD, Role.SUPERVISOR]}>
          <Layout><ReportsPage /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/reports" element={<Navigate to="/admin/reports" replace />} />
      
      {/* Facilities Network Module */}
      <Route path="/admin/facilities" element={
        <ProtectedRoute roles={[Role.ADMIN, Role.HOSPITAL_HEAD, Role.SUPERVISOR]}>
          <Layout><FacilitiesPage /></Layout>
        </ProtectedRoute>
      } />
      
      {/* Users / Administration */}
      <Route path="/admin/users" element={
        <ProtectedRoute roles={[Role.ADMIN, Role.HOSPITAL_HEAD]}>
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