import React from 'react';
import {
  Box,
  VStack,
  Text,
  Icon,
  Button,
  useColorModeValue,
} from '@chakra-ui/react';
import { MessageCircle, Users, Zap } from 'lucide-react';

export const EmptyChatState: React.FC = () => {
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');

  return (
    <Box
      bg={bgColor}
      h="full"
      display="flex"
      alignItems="center"
      justifyContent="center"
      p={8}
    >
      <VStack spacing={6} textAlign="center" maxW="400px">
        {/* Icon */}
        <Box
          p={6}
          bg={cardBg}
          borderRadius="full"
          boxShadow="lg"
        >
          <Icon as={MessageCircle} w={16} h={16} color="brand.teal" />
        </Box>

        {/* Main message */}
        <VStack spacing={3}>
          <Text fontSize="xl" fontWeight="bold" color="gray.800">
            Welcome to AfriWork Messaging
          </Text>
          <Text color="gray.500" fontSize="md" lineHeight="tall">
            Start conversations with clients and freelancers. 
            Select a chat from the sidebar to begin messaging.
          </Text>
        </VStack>

        {/* Features */}
        <VStack spacing={4} w="full">
          <Box
            p={4}
            bg={cardBg}
            borderRadius="lg"
            border="1px"
            borderColor={useColorModeValue('gray.200', 'gray.600')}
            w="full"
          >
            <VStack spacing={3}>
              <Icon as={Zap} color="yellow.500" w={6} h={6} />
              <VStack spacing={1}>
                <Text fontSize="sm" fontWeight="semibold">
                  Real-time Translation
                </Text>
                <Text fontSize="xs" color="gray.500" textAlign="center">
                  Communicate in your preferred language with automatic translation
                </Text>
              </VStack>
            </VStack>
          </Box>

          <Box
            p={4}
            bg={cardBg}
            borderRadius="lg"
            border="1px"
            borderColor={useColorModeValue('gray.200', 'gray.600')}
            w="full"
          >
            <VStack spacing={3}>
              <Icon as={Users} color="blue.500" w={6} h={6} />
              <VStack spacing={1}>
                <Text fontSize="sm" fontWeight="semibold">
                  Project Context
                </Text>
                <Text fontSize="xs" color="gray.500" textAlign="center">
                  Organized conversations linked to specific projects
                </Text>
              </VStack>
            </VStack>
          </Box>
        </VStack>

        {/* Call to action */}
        <VStack spacing={3} w="full">
          <Button
            colorScheme="brand"
            bg="brand.teal"
            size="lg"
            w="full"
            _hover={{ bg: 'brand.600' }}
          >
            Browse Projects
          </Button>
          <Text fontSize="xs" color="gray.400">
            Find projects and start building professional relationships
          </Text>
        </VStack>
      </VStack>
    </Box>
  );
};