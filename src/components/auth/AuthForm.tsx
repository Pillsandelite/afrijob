import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  Text,
  RadioGroup,
  Radio,
  useColorModeValue,
  Link,
  Spinner,
  InputGroup,
  InputRightElement,
  IconButton,
  useToast,
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { useAuth } from '../../contexts/AuthContext';

interface AuthFormProps {
  mode: 'signin' | 'signup';
}

export const AuthForm: React.FC<AuthFormProps> = ({ mode }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'freelancer' | 'client'>('freelancer');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { signUp, signIn } = useAuth();
  const toast = useToast();

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (mode === 'signup') {
        if (!name.trim()) {
          toast({
            title: 'Name is required',
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
          return;
        }
        
        const { data, error } = await signUp(email, password, role, name.trim());
        
        if (error) {
          if (error.message.includes("User already registered")) {
            toast({
              title: "Account already exists.",
              description: "Please log in instead.",
              status: "info",
              duration: 5000,
              isClosable: true,
            });
          } else {
            toast({
              title: "Error signing up.",
              description: error.message,
              status: "error",
              duration: 5000,
              isClosable: true,
            });
          }
        } else {
          toast({
            title: "Account created successfully!",
            description: "Please check your email to verify your account.",
            status: "success",
            duration: 5000,
            isClosable: true,
          });
        }
      } else {
        const { error } = await signIn(email, password);
        if (error) {
          // Handle specific error cases with more helpful messages
          if (error.message.includes('Invalid login credentials') || error.message.includes('invalid_credentials')) {
            toast({
              title: "Invalid credentials",
              description: "Please check your email and password. If you haven't signed up yet, create an account first. If you recently signed up, please check your email for a verification link.",
              status: "error",
              duration: 8000,
              isClosable: true,
            });
          } else if (error.message.includes('Email not confirmed')) {
            toast({
              title: "Email not verified",
              description: "Please check your email and click the verification link before signing in.",
              status: "warning",
              duration: 8000,
              isClosable: true,
            });
          } else {
            toast({
              title: "Error signing in",
              description: error.message,
              status: "error",
              duration: 5000,
              isClosable: true,
            });
          }
        }
      }
    } catch (err) {
      toast({
        title: "Unexpected error",
        description: "An unexpected error occurred. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const isSignUp = mode === 'signup';

  return (
    <Container maxW="md" py={8}>
      <Box
        bg={bgColor}
        p={8}
        rounded="xl"
        boxShadow="lg"
        borderWidth="1px"
        borderColor={borderColor}
      >
        <VStack spacing={6}>
          <VStack spacing={2} textAlign="center">
            <Heading size="lg" color="gray.800">
              {isSignUp ? 'Join AfriWork' : 'Welcome Back'}
            </Heading>
            <Text color="gray.500">
              {isSignUp 
                ? 'Create your account and start your freelancing journey'
                : 'Sign in to your AfriWork account'
              }
            </Text>
          </VStack>

          <Box w="100%">
            <form onSubmit={handleSubmit}>
              <VStack spacing={4}>
                {isSignUp && (
                  <FormControl isRequired>
                    <FormLabel>Full Name</FormLabel>
                    <Input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your full name"
                      bg="white"
                    />
                  </FormControl>
                )}

                <FormControl isRequired>
                  <FormLabel>Email</FormLabel>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    bg="white"
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Password</FormLabel>
                  <InputGroup>
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      bg="white"
                    />
                    <InputRightElement>
                      <IconButton
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                        icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                        onClick={() => setShowPassword(!showPassword)}
                        variant="ghost"
                        size="sm"
                      />
                    </InputRightElement>
                  </InputGroup>
                </FormControl>

                {isSignUp && (
                  <FormControl isRequired>
                    <FormLabel>I want to:</FormLabel>
                    <RadioGroup value={role} onChange={(value) => setRole(value as 'freelancer' | 'client')}>
                      <VStack align="start" spacing={3}>
                        <Radio value="freelancer" colorScheme="teal">
                          <VStack align="start" spacing={1} ml={2}>
                            <Text fontWeight="medium">Work as a Freelancer</Text>
                            <Text fontSize="sm" color="gray.500">
                              Offer your skills and services to clients worldwide
                            </Text>
                          </VStack>
                        </Radio>
                        <Radio value="client" colorScheme="teal">
                          <VStack align="start" spacing={1} ml={2}>
                            <Text fontWeight="medium">Hire Freelancers</Text>
                            <Text fontSize="sm" color="gray.500">
                              Find talented professionals for your projects
                            </Text>
                          </VStack>
                        </Radio>
                      </VStack>
                    </RadioGroup>
                  </FormControl>
                )}

                <Button
                  type="submit"
                  colorScheme="teal"
                  size="lg"
                  width="100%"
                  isLoading={isLoading}
                  loadingText={isSignUp ? 'Creating Account...' : 'Signing In...'}
                  spinner={<Spinner size="sm" />}
                >
                  {isSignUp ? 'Create Account' : 'Sign In'}
                </Button>
              </VStack>
            </form>
          </Box>

          <Text textAlign="center" color="gray.500">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
            <Link
              as={RouterLink}
              to={isSignUp ? '/signin' : '/signup'}
              color="brand.teal"
              fontWeight="medium"
              _hover={{ textDecoration: 'underline' }}
            >
              {isSignUp ? 'Sign In' : 'Sign Up'}
            </Link>
          </Text>
        </VStack>
      </Box>
    </Container>
  );
};