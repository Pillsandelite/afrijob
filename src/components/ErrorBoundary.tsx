import React, { Component, ErrorInfo, ReactNode } from 'react';
import {
  Box,
  VStack,
  Heading,
  Text,
  Button,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Code,
  Collapse,
  useDisclosure,
  Container,
  Icon,
} from '@chakra-ui/react';
import { RefreshCw, AlertTriangle, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error details for debugging
    console.error('Error Boundary caught an error:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo,
    });

    // You can also log the error to an error reporting service here
    // For example: logErrorToService(error, errorInfo);
  }

  handleReload = () => {
    // Clear the error state and reload the page
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
    window.location.reload();
  };

  handleGoHome = () => {
    // Clear the error state and navigate to home
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return <ErrorFallback 
        error={this.state.error} 
        errorInfo={this.state.errorInfo}
        onReload={this.handleReload}
        onGoHome={this.handleGoHome}
      />;
    }

    return this.props.children;
  }
}

interface ErrorFallbackProps {
  error: Error | null;
  errorInfo: ErrorInfo | null;
  onReload: () => void;
  onGoHome: () => void;
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({ 
  error, 
  errorInfo, 
  onReload, 
  onGoHome 
}) => {
  const { isOpen, onToggle } = useDisclosure();

  return (
    <Box minH="100vh" bg="gray.50" display="flex" alignItems="center" justifyContent="center">
      <Container maxW="2xl">
        <VStack spacing={8} textAlign="center">
          {/* Error Icon */}
          <Box
            p={6}
            bg="red.100"
            borderRadius="full"
            color="red.500"
          >
            <Icon as={AlertTriangle} w={16} h={16} />
          </Box>

          {/* Main Error Message */}
          <VStack spacing={4}>
            <Heading size="xl" color="gray.800">
              Oops! Something went wrong
            </Heading>
            <Text color="gray.600" fontSize="lg" maxW="600px">
              We encountered an unexpected error. This might be caused by a browser extension 
              or temporary issue. Don't worry - your data is safe.
            </Text>
          </VStack>

          {/* Error Alert */}
          <Alert status="error" borderRadius="lg" maxW="600px">
            <AlertIcon />
            <Box>
              <AlertTitle>Error Details</AlertTitle>
              <AlertDescription>
                {error?.message || 'An unknown error occurred'}
              </AlertDescription>
            </Box>
          </Alert>

          {/* Action Buttons */}
          <VStack spacing={4} w="full" maxW="400px">
            <Button
              size="lg"
              colorScheme="brand"
              bg="brand.teal"
              leftIcon={<RefreshCw size={20} />}
              onClick={onReload}
              w="full"
              _hover={{ bg: 'brand.600' }}
            >
              Reload Page
            </Button>
            
            <Button
              size="lg"
              variant="outline"
              leftIcon={<Home size={20} />}
              onClick={onGoHome}
              w="full"
            >
              Go to Homepage
            </Button>
          </VStack>

          {/* Technical Details (Collapsible) */}
          <VStack spacing={4} w="full" maxW="600px">
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggle}
              color="gray.500"
            >
              {isOpen ? 'Hide' : 'Show'} Technical Details
            </Button>
            
            <Collapse in={isOpen}>
              <Box
                p={4}
                bg="gray.100"
                borderRadius="md"
                border="1px"
                borderColor="gray.200"
                w="full"
                textAlign="left"
              >
                <VStack spacing={3} align="stretch">
                  {error && (
                    <Box>
                      <Text fontSize="sm" fontWeight="bold" color="gray.700" mb={2}>
                        Error Message:
                      </Text>
                      <Code p={2} bg="red.50" color="red.700" fontSize="xs" w="full">
                        {error.message}
                      </Code>
                    </Box>
                  )}
                  
                  {error?.stack && (
                    <Box>
                      <Text fontSize="sm" fontWeight="bold" color="gray.700" mb={2}>
                        Stack Trace:
                      </Text>
                      <Code 
                        p={2} 
                        bg="gray.50" 
                        color="gray.600" 
                        fontSize="xs" 
                        w="full"
                        whiteSpace="pre-wrap"
                        maxH="200px"
                        overflowY="auto"
                      >
                        {error.stack}
                      </Code>
                    </Box>
                  )}
                  
                  {errorInfo?.componentStack && (
                    <Box>
                      <Text fontSize="sm" fontWeight="bold" color="gray.700" mb={2}>
                        Component Stack:
                      </Text>
                      <Code 
                        p={2} 
                        bg="blue.50" 
                        color="blue.700" 
                        fontSize="xs" 
                        w="full"
                        whiteSpace="pre-wrap"
                        maxH="200px"
                        overflowY="auto"
                      >
                        {errorInfo.componentStack}
                      </Code>
                    </Box>
                  )}
                </VStack>
              </Box>
            </Collapse>
          </VStack>

          {/* Help Text */}
          <Box p={4} bg="blue.50" borderRadius="lg" border="1px" borderColor="blue.200" maxW="600px">
            <Text fontSize="sm" color="blue.700">
              <strong>Common causes:</strong> Browser extensions, ad blockers, or injected scripts. 
              Try disabling extensions or using an incognito window if the problem persists.
            </Text>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
};

export default ErrorBoundary;