import React, { useState } from 'react';
import {
  Box,
  Container,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  VStack,
  useColorModeValue,
  Icon,
  HStack,
  Text,
} from '@chakra-ui/react';
import { User, Briefcase, Settings, Star, FileText } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { DashboardNavbar } from '../shared/DashboardNavbar';
import { BasicInfoTab } from './tabs/BasicInfoTab';
import { SkillsTab } from './tabs/SkillsTab';
import { PortfolioTab } from './tabs/PortfolioTab';
import { AccountSettingsTab } from './tabs/AccountSettingsTab';

export const ProfileManagement: React.FC = () => {
  const { profile } = useAuth();
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const tabBg = useColorModeValue('white', 'gray.800');

  if (!profile) return null;

  const freelancerTabs = [
    { id: 'basic', label: 'Basic Info', icon: User, component: BasicInfoTab },
    { id: 'skills', label: 'Skills & Expertise', icon: Star, component: SkillsTab },
    { id: 'portfolio', label: 'Portfolio', icon: Briefcase, component: PortfolioTab },
    { id: 'settings', label: 'Account Settings', icon: Settings, component: AccountSettingsTab },
  ];

  const clientTabs = [
    { id: 'basic', label: 'Company Info', icon: User, component: BasicInfoTab },
    { id: 'preferences', label: 'Hiring Preferences', icon: Star, component: SkillsTab },
    { id: 'projects', label: 'Past Projects', icon: Briefcase, component: PortfolioTab },
    { id: 'settings', label: 'Account Settings', icon: Settings, component: AccountSettingsTab },
  ];

  const tabs = profile.user_type === 'freelancer' ? freelancerTabs : clientTabs;

  return (
    <Box minH="100vh" bg={bgColor}>
      <DashboardNavbar />
      
      <Container maxW="6xl" py={8}>
        <VStack spacing={8}>
          {/* Header */}
          <Box textAlign="center">
            <Text fontSize="2xl" fontWeight="bold" color="gray.800" mb={2}>
              {profile.role === 'freelancer' ? 'Freelancer Profile' : 'Client Profile'}
            </Text>
            <Text color="gray.600">
              Complete your profile to get the most out of AfriWork
            </Text>
          </Box>

          {/* Profile Tabs */}
          <Box w="full">
            <Tabs variant="enclosed" colorScheme="brand" bg={tabBg} borderRadius="lg">
              <TabList p={1}>
                {tabs.map((tab) => (
                  <Tab 
                    key={tab.id}
                    flex={1}
                    _selected={{ 
                      bg: profile.role === 'freelancer' ? 'brand.teal' : 'maroon.500',
                      color: 'white' 
                    }}
                    borderRadius="md"
                    mr={1}
                  >
                    <HStack spacing={2}>
                      <Icon as={tab.icon} boxSize={4} />
                      <Text fontSize="sm" display={{ base: 'none', md: 'block' }}>
                        {tab.label}
                      </Text>
                    </HStack>
                  </Tab>
                ))}
              </TabList>
              
              <TabPanels>
                {tabs.map((tab, index) => (
                  <TabPanel key={tab.id} px={0} py={6}>
                    <tab.component />
                  </TabPanel>
                ))}
              </TabPanels>
            </Tabs>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
};