import {
  Box,
  Container,
  Heading,
  SimpleGrid,
  Icon,
  Text,
  Stack,
  HStack,
  VStack,
  useColorModeValue,
} from '@chakra-ui/react';
import { MessageCircle, CheckCircle, Lock } from 'lucide-react';

interface FeatureProps {
  title: string;
  text: string;
  icon: any;
}

const Feature = ({ title, text, icon }: FeatureProps) => {
  return (
    <VStack 
      spacing={4} 
      p={8} 
      bg={useColorModeValue('white', 'gray.800')}
      rounded="xl"
      boxShadow="lg"
      borderWidth="1px"
      borderColor={useColorModeValue('gray.100', 'gray.700')}
      _hover={{
        transform: 'translateY(-4px)',
        boxShadow: 'xl',
      }}
      transition="all 0.3s"
      h="full"
      justify="center"
    >
      <Box
        p={4}
        bg="brand.50"
        rounded="full"
        color="brand.teal"
        _hover={{ bg: 'brand.100' }}
        transition="background 0.2s"
      >
        <Icon as={icon} w={8} h={8} />
      </Box>
      <VStack spacing={2} textAlign="center" flex={1} justify="center">
        <Text fontWeight={600} fontSize="lg" color="gray.800">
          {title}
        </Text>
        <Text color="gray.500" fontSize="md">
          {text}
        </Text>
      </VStack>
    </VStack>
  );
};

export const FeaturesSection = () => {
  return (
    <Box 
      py={16} 
      bg={useColorModeValue('gray.50', 'gray.900')} 
      id="features"
      minH="80vh"
      display="flex"
      alignItems="center"
    >
      <Container maxW={'6xl'} centerContent>
        <VStack spacing={12} w="full">
          <VStack spacing={4} textAlign="center" maxW="800px">
            <Heading
              fontSize={{ base: '2xl', sm: '3xl', md: '4xl' }}
              fontWeight="bold"
              color="gray.800"
              textAlign="center"
            >
              Why Choose{' '}
              <Text as="span" color="brand.teal">
                AfriWork
              </Text>
              ?
            </Heading>
            <Text 
              color="gray.500" 
              fontSize="lg" 
              maxW="600px"
              textAlign="center"
              mx="auto"
            >
              Empowering African talent with cutting-edge tools and global opportunities
            </Text>
          </VStack>

          <SimpleGrid 
            columns={{ base: 1, md: 3 }} 
            spacing={8}
            w="full"
            maxW="1000px"
            mx="auto"
          >
            <Feature
              icon={MessageCircle}
              title={'Smart Resume Matching'}
              text={
                'Our AI-powered system matches your skills with the perfect opportunities, ensuring you find work that fits your expertise.'
              }
            />
            <Feature
              icon={CheckCircle}
              title={'Multilingual Chat using LibreTranslate'}
              text={
                'Break language barriers with real-time translation. Communicate seamlessly with clients worldwide in your preferred language.'
              }
            />
            <Feature
              icon={Lock}
              title={'Escrow-Powered Milestones'}
              text={
                'Work with confidence knowing your payments are secured through our milestone-based escrow system. Get paid safely and on time.'
              }
            />
          </SimpleGrid>
        </VStack>
      </Container>
    </Box>
  );
};