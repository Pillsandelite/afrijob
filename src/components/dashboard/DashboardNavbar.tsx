import React from 'react';
import {
  Box,
  Flex,
  HStack,
  Button,
  Text,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useColorModeValue,
  Container,
  Badge,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { FiMessageCircle, FiSettings, FiLogOut, FiUser, FiHome, FiPlusCircle } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';

interface DashboardNavbarProps {
  userType: 'freelancer' | 'client';
}

export const DashboardNavbar: React.FC<DashboardNavbarProps> = ({ userType }) => {
  const { profile, signOut } = useAuth();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  return (
    <Box
      bg={bgColor}
      borderBottom="1px"
      borderColor={borderColor}
      boxShadow="sm"
      position="sticky"
      top={0}
      zIndex={100}
    >
      <Container maxW="7xl">
        <Flex h="16" alignItems="center" justifyContent="space-between">
          {/* Logo */}
          <Text
            fontSize="xl"
            fontWeight="bold"
            color={userType === 'freelancer' ? 'teal.500' : 'blue.500'}
          >
            AfriWork
          </Text>

          {/* Navigation Links */}
          <HStack spacing={6} display={{ base: 'none', md: 'flex' }}>
            <Button 
              as={RouterLink} 
              to={`/${userType}/dashboard`} 
              variant="ghost" 
              size="sm" 
              leftIcon={<FiHome />}
            >
              Dashboard
            </Button>
            
            {userType === 'client' && (
              <Button 
                as={RouterLink} 
                to="/post-job" 
                variant="ghost" 
                size="sm" 
                leftIcon={<FiPlusCircle />}
              >
                Post Job
              </Button>
            )}
            
            <Button 
              as={RouterLink} 
              to="/messages" 
              variant="ghost" 
              size="sm" 
              leftIcon={<FiMessageCircle />}
            >
              Messages
            </Button>
            
            <Button 
              as={RouterLink} 
              to="/profile" 
              variant="ghost" 
              size="sm" 
              leftIcon={<FiUser />}
            >
              Profile
            </Button>
          </HStack>

          {/* User Menu */}
          <Menu>
            <MenuButton>
              <HStack spacing={3} cursor="pointer">
                <Avatar
                  size="sm"
                  name={`${profile?.first_name} ${profile?.last_name}`}
                  bg={userType === 'freelancer' ? 'teal.500' : 'blue.500'}
                />
                <Box display={{ base: 'none', md: 'block' }}>
                  <Text fontSize="sm" fontWeight="medium">
                    {profile?.first_name || profile?.email?.split('@')[0]}
                  </Text>
                  <Badge
                    size="sm"
                    colorScheme={userType === 'freelancer' ? 'teal' : 'blue'}
                    variant="subtle"
                  >
                    {userType}
                  </Badge>
                </Box>
              </HStack>
            </MenuButton>
            <MenuList>
              <MenuItem as={RouterLink} to="/profile" icon={<FiUser />}>
                Profile
              </MenuItem>
              <MenuItem icon={<FiSettings />}>
                Settings
              </MenuItem>
              <MenuItem 
                as={RouterLink} 
                to="/messages" 
                icon={<FiMessageCircle />} 
                display={{ base: 'flex', md: 'none' }}
              >
                Messages
              </MenuItem>
              {userType === 'client' && (
                <MenuItem 
                  as={RouterLink} 
                  to="/post-job" 
                  icon={<FiPlusCircle />}
                  display={{ base: 'flex', md: 'none' }}
                >
                  Post Job
                </MenuItem>
              )}
              <MenuItem icon={<FiLogOut />} onClick={signOut}>
                Logout
              </MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </Container>
    </Box>
  );
};