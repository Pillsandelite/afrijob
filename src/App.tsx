import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';

import theme from './theme';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LandingPage } from './components/LandingPage';
import { SimpleAuthForm } from './components/auth/SimpleAuthForm';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { FreelancerDashboard } from './pages/FreelancerDashboard';
import { ClientDashboard } from './pages/ClientDashboard';
import { MarketplacePage } from './components/marketplace/MarketplacePage';
import { MessagingPage } from './components/messaging/MessagingPage';
import { ProfileManagement } from './components/profile/ProfileManagement';

const AppRoutes: React.FC = () => {
  const { user, profile, loading, loadingProfile } = useAuth();

  if (loading || loadingProfile) {
    return <div>Loading...</div>;
  }

  // If user is authenticated, redirect to appropriate dashboard
  if (user && profile) {
    return (
      <Routes>
        <Route path="/" element={<Navigate to={`/${profile.role}/dashboard`} replace />} />
        <Route 
          path="/freelancer/dashboard" 
          element={
            <ProtectedRoute requiredRole="freelancer">
              <FreelancerDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/client/dashboard" 
          element={
            <ProtectedRoute requiredRole="client">
              <ClientDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/marketplace" 
          element={
            <ProtectedRoute>
              <MarketplacePage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/messages" 
          element={
            <ProtectedRoute>
              <MessagingPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <ProfileManagement />
            </ProtectedRoute>
          } 
        />
        <Route path="/signin" element={<Navigate to="/" replace />} />
        <Route path="/signup" element={<Navigate to="/" replace />} />
        <Route path="/auth" element={<Navigate to="/" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  }

  // If user is authenticated but no profile exists, redirect to profile setup
  if (user && !profile && !loadingProfile) {
    return (
      <Routes>
        <Route path="/" element={<Navigate to="/setup-profile" replace />} />
        <Route path="/setup-profile" element={<div>Profile setup needed</div>} />
        <Route path="*" element={<Navigate to="/setup-profile" replace />} />
      </Routes>
    );
  }
  // If user is not authenticated, show landing page or auth form
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/signin" element={<SimpleAuthForm />} />
      <Route path="/signup" element={<SimpleAuthForm />} />
      <Route path="/auth" element={<Navigate to="/signin" replace />} />
      <Route path="/freelancer/dashboard" element={<Navigate to="/signin" replace />} />
      <Route path="/client/dashboard" element={<Navigate to="/signin" replace />} />
      <Route path="/marketplace" element={<Navigate to="/signin" replace />} />
      <Route path="/messages" element={<Navigate to="/signin" replace />} />
      <Route path="/profile" element={<Navigate to="/signin" replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <ChakraProvider theme={theme}>
      <Router>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </Router>
    </ChakraProvider>
  );
}

export default App;