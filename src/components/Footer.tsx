import {
  Box,
  Container,
  Stack,
  Text,
  useColorModeValue,
  Divider,
  HStack,
  Link,
  Icon,
} from '@chakra-ui/react';
import { Heart } from 'lucide-react';

export const Footer = () => {
  return (
    <Box
      bg={useColorModeValue('gray.900', 'gray.900')}
      color={useColorModeValue('gray.200', 'gray.200')}
      py={8}
    >
      <Container maxW={'6xl'} centerContent>
        <Stack spacing={8} w="full">
          <Divider borderColor="gray.700" />
          <Stack
            direction={{ base: 'column', md: 'row' }}
            spacing={4}
            justify={{ base: 'center', md: 'space-between' }}
            align={{ base: 'center', md: 'center' }}
            w="full"
          >
            <HStack spacing={2} justify="center">
              <Text fontSize="sm" textAlign="center">
                © 2025 AfriWork. Built with
              </Text>
              <Icon as={Heart} w={4} h={4} color="red.400" />
              <Text fontSize="sm" textAlign="center">
                in Africa.
              </Text>
            </HStack>
            
            <Stack 
              direction={'row'} 
              spacing={6} 
              justify="center"
              flexWrap="wrap"
            >
              <Link 
                href="#" 
                fontSize="sm" 
                _hover={{ color: 'brand.teal' }}
                transition="color 0.2s"
                textAlign="center"
              >
                Privacy Policy
              </Link>
              <Link 
                href="#" 
                fontSize="sm" 
                _hover={{ color: 'brand.teal' }}
                transition="color 0.2s"
                textAlign="center"
              >
                Terms of Service
              </Link>
              <Link 
                href="#" 
                fontSize="sm" 
                _hover={{ color: 'brand.teal' }}
                transition="color 0.2s"
                textAlign="center"
              >
                Support
              </Link>
            </Stack>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
};