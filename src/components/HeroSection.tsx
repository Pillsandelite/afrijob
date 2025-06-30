import {
  Container,
  Stack,
  Flex,
  Box,
  Heading,
  Text,
  Button,
  Image,
  Icon,
  IconButton,
  createIcon,
  IconProps,
  useColorModeValue,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';

export const HeroSection = () => {
  // Move useColorModeValue calls to top level to ensure consistent hook order
  const afterElementHeight = useColorModeValue('20%', '30%');
  const blobColor = useColorModeValue('brand.50', 'brand.400');

  return (
    <Box 
      minH="100vh" 
      display="flex" 
      alignItems="center" 
      justifyContent="center"
      pt={{ base: '80px', md: '100px' }} // Account for fixed navigation
      pb={{ base: '40px', md: '60px' }}
    >
      <Container maxW={'7xl'} centerContent>
        <Stack
          align={'center'}
          spacing={{ base: 8, md: 10 }}
          py={{ base: 8, md: 12 }}
          direction={{ base: 'column', md: 'row' }}
          w="full"
          justify="center"
        >
          <Stack flex={1} spacing={{ base: 5, md: 10 }} textAlign={{ base: 'center', md: 'left' }}>
            <Heading
              lineHeight={1.1}
              fontWeight={600}
              fontSize={{ base: '3xl', sm: '4xl', lg: '6xl' }}
              color="gray.800"
              textAlign={{ base: 'center', md: 'left' }}
            >
              <Text
                as={'span'}
                position={'relative'}
                _after={{
                  content: "''",
                  width: 'full',
                  height: afterElementHeight,
                  position: 'absolute',
                  bottom: 1,
                  left: 0,
                  bg: 'brand.teal',
                  zIndex: -1,
                }}
              >
                Empowering Africa's Freelancers
              </Text>
            </Heading>
            <Text 
              color={'gray.500'} 
              fontSize={{ base: 'lg', md: 'xl' }}
              maxW="600px"
              textAlign={{ base: 'center', md: 'left' }}
              mx={{ base: 'auto', md: 0 }}
            >
              Connect. Work. Earn Globally.
            </Text>
            <Stack
              spacing={{ base: 4, sm: 6 }}
              direction={{ base: 'column', sm: 'row' }}
              justify={{ base: 'center', md: 'flex-start' }}
              align="center"
            >
              <Button
                rounded={'full'}
                size={'lg'}
                fontWeight={'normal'}
                px={6}
                colorScheme={'brand'}
                bg={'brand.teal'}
                as={RouterLink}
                to="/signup"
                _hover={{ 
                  bg: 'brand.600',
                  transform: 'translateY(-2px)',
                  boxShadow: 'lg',
                }}
                transition="all 0.2s"
              >
                Get Started
              </Button>
              <Button
                rounded={'full'}
                size={'lg'}
                fontWeight={'normal'}
                px={6}
                variant="secondary"
                as={RouterLink}
                to="/signin"
              >
                Sign In
              </Button>
            </Stack>
          </Stack>
          <Flex
            flex={1}
            justify={'center'}
            align={'center'}
            position={'relative'}
            w={'full'}
            maxW={{ base: '400px', md: 'full' }}
          >
            <Blob
              w={'150%'}
              h={'150%'}
              color={blobColor}
              position={'absolute'}
              top={'-20%'}
              left={0}
              zIndex={-1}
            />
            <Box
              position={'relative'}
              height={{ base: '250px', md: '300px' }}
              rounded={'2xl'}
              boxShadow={'2xl'}
              width={'full'}
              overflow={'hidden'}
            >
              <Image
                alt={'Hero Image'}
                fit={'cover'}
                align={'center'}
                w={'100%'}
                h={'100%'}
                src={'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=1600'}
                loading="lazy"
              />
            </Box>
          </Flex>
        </Stack>
      </Container>
    </Box>
  );
};

const Blob = (props: IconProps) => {
  return (
    <Icon
      width={'100%'}
      viewBox="0 0 578 440"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M239.184 439.443c-55.13-5.419-110.241-21.365-151.074-58.767C42.307 338.722-7.478 282.729.938 221.217c8.433-61.644 78.896-91.048 126.871-130.712 34.337-28.388 70.198-51.348 112.004-66.78C282.34 8.024 325.382-3.369 370.518.904c54.019 5.115 112.774 10.886 150.881 49.482 39.916 40.427 49.421 100.753 53.385 157.402 4.13 59.015 11.255 128.44-30.444 170.44-41.383 41.683-111.6 19.106-169.213 30.663-46.68 9.364-88.56 35.21-135.943 30.551z"
        fill="currentColor"
      />
    </Icon>
  );
};