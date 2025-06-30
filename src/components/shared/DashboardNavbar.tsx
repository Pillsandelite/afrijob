import React, { useState, useEffect } from 'react';
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
import { MessageCircle, Settings, LogOut, User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export const DashboardNavbar: React.FC = () => {
  const { profile, signOut } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 0;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    
    // Check initial scroll position
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <Box
      bg={scrolled ? bgColor : 'transparent'}
      borderBottom={scrolled ? '1px' : 'none'}
      borderColor={scrolled ? borderColor : 'transparent'}
      boxShadow={scrolled ? 'sm' : 'none'}
      position="sticky"
      top={0}
      zIndex={100}
      transition="all 0.3s ease-in-out"
      backdropFilter={scrolled ? 'none' : 'blur(10px)'}
      WebkitBackdropFilter={scrolled ? 'none' : 'blur(10px)'}
    >
      <Container maxW="6xl">
        <Flex h="16" alignItems="center" justifyContent="space-between">
          {/* Logo */}
          <Text
            fontSize="xl"
            fontWeight="bold"
            color="brand.teal"
          >
            AfriWork
          </Text>

          {/* Navigation Links */}
          <HStack spacing={8} display={{ base: 'none', md: 'flex' }}>
            <Button as={RouterLink} to="/marketplace" variant="ghost" size="sm" color="gray.600">
              Marketplace
            </Button>
            <Button as={RouterLink} to={`/${profile?.role}/dashboard`} variant="ghost" size="sm" color="gray.600">
              Dashboard
            </Button>
            <Button as={RouterLink} to="/messages" variant="ghost" size="sm" leftIcon={<MessageCircle size={16} />} color="gray.600">
              Messages
            </Button>
          </HStack>

          {/* User Menu */}
          <Menu>
            <MenuButton>
              <HStack spacing={3} cursor="pointer">
                <Avatar
                  size="sm"
                  name={`${profile?.first_name} ${profile?.last_name}`}
                  bg={profile?.role === 'freelancer' ? 'brand.teal' : 'maroon.500'}
                />
                <Box display={{ base: 'none', md: 'block' }}>
                  <Text fontSize="sm" fontWeight="medium">
                    {profile?.first_name || profile?.email?.split('@')[0]}
                  </Text>
                  <Badge
                    size="sm"
                    colorScheme={profile?.role === 'freelancer' ? 'teal' : 'red'}
                    variant="subtle"
                  >
                    {profile?.role}
                  </Badge>
                </Box>
              </HStack>
            </MenuButton>
            <MenuList>
              <MenuItem as={RouterLink} to="/profile" icon={<User size={16} />}>
                Profile
              </MenuItem>
              <MenuItem icon={<Settings size={16} />}>
                Settings
              </MenuItem>
              <MenuItem as={RouterLink} to="/messages" icon={<MessageCircle size={16} />} display={{ base: 'flex', md: 'none' }}>
                Messages
              </MenuItem>
              <MenuItem icon={<LogOut size={16} />} onClick={signOut}>
                Logout
              </MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </Container>
    </Box>
  );
};