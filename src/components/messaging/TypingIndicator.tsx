import React from 'react';
import {
  HStack,
  Avatar,
  Box,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { keyframes } from '@emotion/react';

interface TypingIndicatorProps {
  firstName: string;
  lastName?: string;
  avatar?: string;
}

const bounce = keyframes`
  0%, 60%, 100% {
    transform: translateY(0);
  }
  30% {
    transform: translateY(-10px);
  }
`;

export const TypingIndicator: React.FC<TypingIndicatorProps> = ({
  firstName,
  lastName,
  avatar,
}) => {
  const bgColor = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  return (
    <HStack align="end" spacing={2} w="full">
      <Avatar size="xs" name={`${firstName} ${lastName || ''}`} src={avatar} />
      
      <Box
        bg={bgColor}
        p={3}
        borderRadius="lg"
        borderTopLeftRadius="sm"
        border="1px"
        borderColor={borderColor}
        boxShadow="sm"
        maxW="70%"
      >
        <HStack spacing={1} align="center">
          <Text fontSize="xs" color="gray.500">
            {firstName} is typing
          </Text>
          <HStack spacing={1}>
            {[0, 1, 2].map((index) => (
              <Box
                key={index}
                w="4px"
                h="4px"
                bg="gray.400"
                borderRadius="full"
                animation={`${bounce} 1.4s ease-in-out infinite`}
                style={{
                  animationDelay: `${index * 0.2}s`,
                }}
              />
            ))}
          </HStack>
        </HStack>
      </Box>
    </HStack>
  );
};