import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';

import { LoginPage, RegisterPage } from './pages/auth/AuthPages';

import AdminDashboard from './pages/admin/AdminDashboard';
import { UsersPage, IntervenantsPage } from './pages/admin/AdminUsers';
import { FormationsPage, PlanificationPage } from './pages/admin/AdminFormations';
import { StatsPage } from './pages/admin/AdminStats';

import { RegionalDashboard, RegionalFormations, RegionalPlans, RegionalAffectation, RegionalSuivi } from './pages/regional/RegionalPages';

import { LocalDashboard, LocalPlanning, LocalSessions, LocalSuivi } from './pages/local/LocalPages';

import { CompanyDashboard, CataloguePage, CompanyPlanificationPage, MesFormationsPage, HistoriquePage } from './pages/company/CompanyPages';

import { IntervenantDashboard, IntervenantProfil, IntervenantCompetences, IntervenantOffres, IntervenantMissions } from './pages/intervenant/IntervenantPages';

import { ProfilPage, NotificationsPage } from './pages/SharedPages';

function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth();
  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#fff' }}>
      <div style={{ textAlign: 'center' }}>
        <img src="https://cdn.brandfetch.io/id0UtA99bn/w/400/h/400/theme/dark/icon.jpeg?k=id64Mup7ac&t=1726639084841" alt="OFPPT" style={{ width: 80, height: 80, borderRadius: 16, marginBottom: '1.5rem', objectFit: 'cover' }} />
        <div style={{ width: 40, height: 40, border: '4px solid #f3f3f3', borderTop: '4px solid #C8102E', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto' }}></div>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  );
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    const defaultRoutes = { admin: '/admin/dashboard', regional: '/regional/dashboard', local: '/local/dashboard', company: '/company/dashboard', intervenant: '/intervenant/dashboard' };
    return <Navigate to={defaultRoutes[user.role] || '/login'} replace />;
  }
  return children;
}

function PublicRoute({ children }) {
  const { user } = useAuth();
  if (user) {
    const defaultRoutes = { admin: '/admin/dashboard', regional: '/regional/dashboard', local: '/local/dashboard', company: '/company/dashboard', intervenant: '/intervenant/dashboard' };
    return <Navigate to={defaultRoutes[user.role] || '/admin/dashboard'} replace />;
  }
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />

      {/* Admin */}
      <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/users" element={<ProtectedRoute allowedRoles={['admin']}><UsersPage /></ProtectedRoute>} />
      <Route path="/admin/intervenants" element={<ProtectedRoute allowedRoles={['admin']}><IntervenantsPage /></ProtectedRoute>} />
      <Route path="/admin/formations" element={<ProtectedRoute allowedRoles={['admin']}><FormationsPage /></ProtectedRoute>} />
      <Route path="/admin/planification" element={<ProtectedRoute allowedRoles={['admin']}><PlanificationPage /></ProtectedRoute>} />
      <Route path="/admin/stats" element={<ProtectedRoute allowedRoles={['admin']}><StatsPage /></ProtectedRoute>} />
      <Route path="/admin/notifications" element={<ProtectedRoute allowedRoles={['admin']}><NotificationsPage /></ProtectedRoute>} />
      <Route path="/admin/profil" element={<ProtectedRoute allowedRoles={['admin']}><ProfilPage /></ProtectedRoute>} />

      {/* Regional */}
      <Route path="/regional/dashboard" element={<ProtectedRoute allowedRoles={['regional']}><RegionalDashboard /></ProtectedRoute>} />
      <Route path="/regional/formations" element={<ProtectedRoute allowedRoles={['regional']}><RegionalFormations /></ProtectedRoute>} />
      <Route path="/regional/plans" element={<ProtectedRoute allowedRoles={['regional']}><RegionalPlans /></ProtectedRoute>} />
      <Route path="/regional/affectation" element={<ProtectedRoute allowedRoles={['regional']}><RegionalAffectation /></ProtectedRoute>} />
      <Route path="/regional/suivi" element={<ProtectedRoute allowedRoles={['regional']}><RegionalSuivi /></ProtectedRoute>} />
      <Route path="/regional/notifications" element={<ProtectedRoute allowedRoles={['regional']}><NotificationsPage /></ProtectedRoute>} />
      <Route path="/regional/profil" element={<ProtectedRoute allowedRoles={['regional']}><ProfilPage /></ProtectedRoute>} />

      {/* Local */}
      <Route path="/local/dashboard" element={<ProtectedRoute allowedRoles={['local']}><LocalDashboard /></ProtectedRoute>} />
      <Route path="/local/planning" element={<ProtectedRoute allowedRoles={['local']}><LocalPlanning /></ProtectedRoute>} />
      <Route path="/local/sessions" element={<ProtectedRoute allowedRoles={['local']}><LocalSessions /></ProtectedRoute>} />
      <Route path="/local/suivi" element={<ProtectedRoute allowedRoles={['local']}><LocalSuivi /></ProtectedRoute>} />
      <Route path="/local/notifications" element={<ProtectedRoute allowedRoles={['local']}><NotificationsPage /></ProtectedRoute>} />
      <Route path="/local/profil" element={<ProtectedRoute allowedRoles={['local']}><ProfilPage /></ProtectedRoute>} />

      {/* Company */}
      <Route path="/company/dashboard" element={<ProtectedRoute allowedRoles={['company']}><CompanyDashboard /></ProtectedRoute>} />
      <Route path="/company/catalogue" element={<ProtectedRoute allowedRoles={['company']}><CataloguePage /></ProtectedRoute>} />
      <Route path="/company/planification" element={<ProtectedRoute allowedRoles={['company']}><CompanyPlanificationPage /></ProtectedRoute>} />
      <Route path="/company/mes-formations" element={<ProtectedRoute allowedRoles={['company']}><MesFormationsPage /></ProtectedRoute>} />
      <Route path="/company/historique" element={<ProtectedRoute allowedRoles={['company']}><HistoriquePage /></ProtectedRoute>} />
      <Route path="/company/notifications" element={<ProtectedRoute allowedRoles={['company']}><NotificationsPage /></ProtectedRoute>} />
      <Route path="/company/profil" element={<ProtectedRoute allowedRoles={['company']}><ProfilPage /></ProtectedRoute>} />

      {/* Intervenant */}
      <Route path="/intervenant/dashboard" element={<ProtectedRoute allowedRoles={['intervenant']}><IntervenantDashboard /></ProtectedRoute>} />
      <Route path="/intervenant/profil" element={<ProtectedRoute allowedRoles={['intervenant']}><IntervenantProfil /></ProtectedRoute>} />
      <Route path="/intervenant/competences" element={<ProtectedRoute allowedRoles={['intervenant']}><IntervenantCompetences /></ProtectedRoute>} />
      <Route path="/intervenant/offres" element={<ProtectedRoute allowedRoles={['intervenant']}><IntervenantOffres /></ProtectedRoute>} />
      <Route path="/intervenant/missions" element={<ProtectedRoute allowedRoles={['intervenant']}><IntervenantMissions /></ProtectedRoute>} />
      <Route path="/intervenant/notifications" element={<ProtectedRoute allowedRoles={['intervenant']}><NotificationsPage /></ProtectedRoute>} />

      {/* 404 */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <DataProvider>
          <AppRoutes />
        </DataProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
