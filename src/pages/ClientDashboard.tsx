import React from 'react';
import {
  Box,
  Spinner,
  VStack,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { useAuth } from '../contexts/AuthContext';
import { ClientDashboard as ClientDashboardComponent } from '../components/dashboard/ClientDashboard';

export const ClientDashboard: React.FC = () => {
  const { profile, loading, loadingProfile } = useAuth();
  const bgColor = useColorModeValue('gray.50', 'gray.900');

  // Show loading spinner while profile is being fetched
  if (loading || loadingProfile) {
    return (
      <Box minH="100vh" bg={bgColor} display="flex" alignItems="center" justifyContent="center">
        <VStack spacing={4}>
          <Spinner size="xl" color="blue.500" thickness="4px" />
          <Text color="gray.500">Loading your dashboard...</Text>
        </VStack>
      </Box>
    );
  }

  if (!profile || profile.role !== 'client') {
    return (
      <Box minH="100vh" bg={bgColor} display="flex" alignItems="center" justifyContent="center">
        <VStack spacing={4}>
          <Text color="gray.500">Access denied. Client account required.</Text>
        </VStack>
      </Box>
    );
  }

  return <ClientDashboardComponent />;
};