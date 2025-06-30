import React from 'react';
import { Box, Spinner, Center } from '@chakra-ui/react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'freelancer' | 'client';
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole 
}) => {
  const { user, profile, loading, loadingProfile } = useAuth();

  if (loading || loadingProfile) {
    return (
      <Center h="100vh">
        <Spinner size="xl" color="brand.teal" />
      </Center>
    );
  }

  if (!user || !profile) {
    return <Navigate to="/signin" replace />;
  }

  if (requiredRole && profile.role !== requiredRole) {
    return (
      <Center h="100vh">
        <Box textAlign="center">
          <p>Access denied. This area is only for {requiredRole}s.</p>
        </Box>
      </Center>
    );
  }

  return <>{children}</>;
};