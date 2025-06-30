import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  colors: {
    brand: {
      teal: '#008080',
      maroon: '#800000',
      50: '#e6f2f2',
      100: '#ccdfdf',
      200: '#99bfbf',
      300: '#66a0a0',
      400: '#338080',
      500: '#008080',
      600: '#006666',
      700: '#004d4d',
      800: '#003333',
      900: '#001a1a',
    },
    maroon: {
      50: '#f2e6e6',
      100: '#dfcccc',
      200: '#bf9999',
      300: '#a06666',
      400: '#803333',
      500: '#800000',
      600: '#660000',
      700: '#4d0000',
      800: '#330000',
      900: '#1a0000',
    }
  },
  fonts: {
    heading: 'Inter, sans-serif',
    body: 'Inter, sans-serif',
  },
  styles: {
    global: {
      body: {
        fontFamily: 'Inter, sans-serif',
      },
    },
  },
  components: {
    Button: {
      variants: {
        primary: {
          bg: 'brand.teal',
          color: 'white',
          _hover: {
            bg: 'brand.600',
            transform: 'translateY(-2px)',
            boxShadow: 'lg',
          },
          _active: {
            bg: 'brand.700',
            transform: 'translateY(0)',
          },
          transition: 'all 0.2s',
        },
        secondary: {
          bg: 'white',
          color: 'maroon.500',
          border: '2px solid',
          borderColor: 'maroon.500',
          _hover: {
            bg: 'maroon.50',
            transform: 'translateY(-2px)',
            boxShadow: 'lg',
          },
          _active: {
            bg: 'maroon.100',
            transform: 'translateY(0)',
          },
          transition: 'all 0.2s',
        },
      },
    },
  },
});

export default theme;