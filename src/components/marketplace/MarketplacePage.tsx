import React from 'react';
import {
  Box,
  Container,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Heading,
  Text,
  VStack,
  useColorModeValue,
  Icon,
  HStack,
  Badge,
  Spinner,
} from '@chakra-ui/react';
import { Briefcase, Plus, Search } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { JobPostingForm } from './JobPostingForm';
import { JobFeed } from './JobFeed';

export const MarketplacePage: React.FC = () => {
  const { profile, loadingProfile } = useAuth();
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const tabBg = useColorModeValue('white', 'gray.800');

  // Show loading spinner while profile is being fetched
  if (loadingProfile) {
    return (
      <Box minH="100vh" bg={bgColor} display="flex" alignItems="center" justifyContent="center">
        <VStack spacing={4}>
          <Spinner size="xl" color="brand.teal" thickness="4px" />
          <Text color="gray.500">Loading marketplace...</Text>
        </VStack>
      </Box>
    );
  }

  return (
    <Box minH="100vh" bg={bgColor}>
      <Container maxW="7xl" py={8}>
        <VStack spacing={8}>
          {/* Header */}
          <Box textAlign="center">
            <HStack justify="center" mb={4}>
              <Icon as={Briefcase} w={8} h={8} color="brand.teal" />
              <Heading size="xl" color="gray.800">
                AfriWork Marketplace
              </Heading>
            </HStack>
            <Text color="gray.600" fontSize="lg" maxW="600px">
              {profile?.role === 'client' 
                ? 'Post your projects and find talented freelancers across Africa'
                : 'Discover exciting opportunities and grow your freelancing career'
              }
            </Text>
          </Box>

          {/* Marketplace Tabs */}
          <Box w="full">
            {profile?.role === 'client' ? (
              <Tabs variant="enclosed" colorScheme="brand">
                <TabList bg={tabBg} borderRadius="lg" p={1}>
                  <Tab 
                    flex={1} 
                    _selected={{ 
                      bg: 'brand.teal', 
                      color: 'white' 
                    }}
                    borderRadius="md"
                  >
                    <HStack>
                      <Icon as={Search} />
                      <Text>Browse Talent</Text>
                    </HStack>
                  </Tab>
                  <Tab 
                    flex={1} 
                    _selected={{ 
                      bg: 'brand.teal', 
                      color: 'white' 
                    }}
                    borderRadius="md"
                  >
                    <HStack>
                      <Icon as={Plus} />
                      <Text>Post a Job</Text>
                      <Badge colorScheme="green" variant="subtle">
                        Popular
                      </Badge>
                    </HStack>
                  </Tab>
                </TabList>
                <TabPanels>
                  <TabPanel px={0} py={6}>
                    <JobFeed />
                  </TabPanel>
                  <TabPanel px={0} py={6}>
                    <JobPostingForm />
                  </TabPanel>
                </TabPanels>
              </Tabs>
            ) : (
              // Freelancer view - just show job feed
              <Box>
                <JobFeed />
              </Box>
            )}
          </Box>
        </VStack>
      </Container>
    </Box>
  );
};