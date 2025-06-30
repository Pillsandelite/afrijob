import { useEffect } from 'react';
import { useToast } from '@chakra-ui/react';

/**
 * Global error handler component that catches unhandled promise rejections
 * and other global errors that might not be caught by React Error Boundaries
 */
export const GlobalErrorHandler: React.FC = () => {
  const toast = useToast();

  useEffect(() => {
    // Handle unhandled promise rejections
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('Unhandled promise rejection:', event.reason);
      
      // Prevent the default browser behavior (logging to console)
      event.preventDefault();
      
      // Show user-friendly error message
      toast({
        title: 'Connection Error',
        description: 'There was a problem connecting to our services. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    };

    // Handle global JavaScript errors
    const handleGlobalError = (event: ErrorEvent) => {
      console.error('Global error:', event.error);
      
      // Only show toast for errors that seem to be from our application
      // (not from browser extensions or injected scripts)
      if (event.filename && event.filename.includes(window.location.origin)) {
        toast({
          title: 'Application Error',
          description: 'An unexpected error occurred. Please refresh the page if problems persist.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    };

    // Add event listeners
    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    window.addEventListener('error', handleGlobalError);

    // Cleanup event listeners on unmount
    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      window.removeEventListener('error', handleGlobalError);
    };
  }, [toast]);

  // This component doesn't render anything
  return null;
};