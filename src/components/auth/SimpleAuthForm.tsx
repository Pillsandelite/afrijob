import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Heading,
  useToast,
  RadioGroup,
  Radio,
  Stack,
  Text,
  Link,
  VStack,
  useColorModeValue,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";

export const SimpleAuthForm = () => {
  const { signIn, signUp, loading } = useAuth();
  const toast = useToast();

  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<'freelancer' | 'client'>('freelancer');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  const toggleMode = () => {
    setIsLogin((prev) => !prev);
    // Clear form when switching modes
    setEmail("");
    setPassword("");
    setName("");
    setError(null);
  };

  const validateForm = () => {
    if (!email.trim()) {
      toast({
        title: "Email is required",
        status: "error",
        duration: 3000,
      });
      return false;
    }
    
    if (!password || password.length < 6) {
      toast({
        title: "Password must be at least 6 characters",
        status: "error",
        duration: 3000,
      });
      return false;
    }

    if (!isLogin && !name.trim()) {
      toast({
        title: "Name is required",
        status: "error",
        duration: 3000,
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    setError(null);

    try {
      if (isLogin) {
        const { error } = await signIn(email.trim(), password);
        
        if (error) {
          setError(error.message);
          if (error.message.includes('Invalid login credentials')) {
            toast({
              title: "Invalid credentials",
              description: "Please check your email and password",
              status: "error",
              duration: 5000,
            });
          } else {
            toast({
              title: "Sign in failed",
              description: error.message,
              status: "error",
              duration: 5000,
            });
          }
        } else {
          // Success handled by AuthContext and routing
          toast({
            title: "Welcome back!",
            status: "success",
            duration: 3000,
          });
        }
      } else {
        const { error } = await signUp(email.trim(), password, role, name.trim());
        
        if (error) {
          setError(error.message);
          if (error.message.includes("User already registered")) {
            toast({
              title: "Account exists",
              description: "Please sign in instead",
              status: "info",
              duration: 5000,
            });
            setIsLogin(true);
          } else {
            toast({
              title: "Sign up failed",
              description: error.message,
              status: "error",
              duration: 5000,
            });
          }
        } else {
          toast({
            title: "Account created!",
            description: "Please check your email to verify your account",
            status: "success",
            duration: 5000,
          });
          // Keep them on signup form so they can verify and then sign in
        }
      }
    } catch (err) {
      setError("Unexpected error occurred");
      toast({
        title: "Unexpected error",
        description: "Please try again",
        status: "error",
        duration: 3000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box 
      maxW="md" 
      mx="auto" 
      mt={10} 
      p={8} 
      bg={bgColor}
      borderWidth="1px" 
      borderColor={borderColor}
      borderRadius="xl"
      boxShadow="lg"
    >
      <VStack spacing={6}>
        <Heading 
          fontSize="2xl" 
          textAlign="center"
          color="gray.800"
        >
          {isLogin ? "Sign In to AfriWork" : "Join AfriWork"}
        </Heading>

        {error && (
          <Alert status="error" borderRadius="md">
            <AlertIcon />
            {error}
          </Alert>
        )}

        <Box w="full">
          <form onSubmit={handleSubmit}>
            <VStack spacing={4}>
              {!isLogin && (
                <FormControl isRequired>
                  <FormLabel>Full Name</FormLabel>
                  <Input
                    type="text"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    bg="white"
                  />
                </FormControl>
              )}

              <FormControl isRequired>
                <FormLabel>Email</FormLabel>
                <Input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  bg="white"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Password</FormLabel>
                <Input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  bg="white"
                />
              </FormControl>

              {!isLogin && (
                <FormControl isRequired>
                  <FormLabel>I want to:</FormLabel>
                  <RadioGroup 
                    value={role} 
                    onChange={(value: string) => setRole(value as 'freelancer' | 'client')}
                  >
                    <Stack spacing={3}>
                      <Radio value="freelancer" colorScheme="teal">
                        Work as a Freelancer
                      </Radio>
                      <Radio value="client" colorScheme="teal">
                        Hire Freelancers
                      </Radio>
                    </Stack>
                  </RadioGroup>
                </FormControl>
              )}

              <Button 
                type="submit" 
                colorScheme="brand"
                bg="brand.teal"
                size="lg"
                width="full" 
                isLoading={isSubmitting || loading}
                loadingText={isLogin ? "Signing In..." : "Creating Account..."}
                _hover={{ bg: 'brand.600' }}
              >
                {isLogin ? "Sign In" : "Create Account"}
              </Button>
            </VStack>
          </form>
        </Box>

        <Text textAlign="center" color="gray.500">
          {isLogin ? (
            <>
              Don't have an account?{" "}
              <Link 
                color="brand.teal" 
                fontWeight="medium"
                onClick={toggleMode}
                _hover={{ textDecoration: 'underline' }}
              >
                Sign Up
              </Link>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <Link 
                color="brand.teal" 
                fontWeight="medium"
                onClick={toggleMode}
                _hover={{ textDecoration: 'underline' }}
              >
                Sign In
              </Link>
            </>
          )}
        </Text>
      </VStack>
    </Box>
  );
};