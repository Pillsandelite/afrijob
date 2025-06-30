import {
  Box,
  Flex,
  Text,
  IconButton,
  Button,
  Stack,
  Collapse,
  useColorModeValue,
  useDisclosure,
  Link as ChakraLink,
  Container,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons';

interface NavItem {
  label: string;
  href: string;
}

const NAV_ITEMS: Array<NavItem> = [
  {
    label: 'Marketplace',
    href: '/marketplace',
  },
];

export const Navigation = () => {
  const { isOpen, onToggle } = useDisclosure();
  const [scrolled, setScrolled] = useState(false);

  // Theme-aware colors
  const bgScrolled = useColorModeValue('white', 'gray.800');
  const borderColorScrolled = useColorModeValue('gray.200', 'gray.700');
  const logoColorScrolled = useColorModeValue('teal.700', 'teal.300');
  const textColorScrolled = useColorModeValue('gray.600', 'gray.300');
  const hoverBgScrolled = useColorModeValue('gray.100', 'gray.700');
  const mobileBg = useColorModeValue('white', 'gray.800');
  const textAlign = useColorModeValue('left', 'center');

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    
    // Check initial scroll position
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <Box
      position="fixed"
      top={0}
      left={0}
      right={0}
      zIndex={1000}
      bg={scrolled ? bgScrolled : "transparent"}
      boxShadow={scrolled ? 'sm' : 'none'}
      borderBottom={scrolled ? '1px' : 'none'}
      borderColor={scrolled ? borderColorScrolled : 'transparent'}
      transition="all 0.3s ease-in-out"
      backdropFilter={scrolled ? 'none' : 'blur(10px)'}
      WebkitBackdropFilter={scrolled ? 'none' : 'blur(10px)'}
    >
      <Container maxW="7xl">
        <Flex
          minH={'60px'}
          py={{ base: 2 }}
          px={{ base: 4 }}
          align={'center'}
        >
          <Flex
            flex={{ base: 1, md: 'auto' }}
            ml={{ base: -2 }}
            display={{ base: 'flex', md: 'none' }}
          >
            <IconButton
              onClick={onToggle}
              icon={isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />}
              variant={'ghost'}
              aria-label={'Toggle Navigation'}
              color={scrolled ? 'gray.600' : 'white'}
              _hover={{
                bg: scrolled ? 'gray.100' : 'whiteAlpha.200'
              }}
            />
          </Flex>
          
          <Flex flex={{ base: 1 }} justify={{ base: 'center', md: 'start' }}>
            <Text
              textAlign={textAlign}
              fontFamily={'heading'}
              color={scrolled ? logoColorScrolled : 'white'}
              fontSize="2xl"
              fontWeight="bold"
              transition="color 0.3s ease-in-out"
            >
              AfriWork
            </Text>

            <Flex display={{ base: 'none', md: 'flex' }} ml={10}>
              <DesktopNav scrolled={scrolled} />
            </Flex>
          </Flex>

          <Stack
            flex={{ base: 1, md: 0 }}
            justify={'flex-end'}
            direction={'row'}
            spacing={6}
            display={{ base: 'none', md: 'flex' }}
          >
            <Button
              as={ChakraLink}
              fontSize={'sm'}
              fontWeight={400}
              variant={'link'}
              href={'/signin'}
              color={scrolled ? textColorScrolled : "white"}
              transition="color 0.3s ease-in-out"
            >
              Sign In
            </Button>
            <Button
              as={ChakraLink}
              display={{ base: 'none', md: 'inline-flex' }}
              fontSize={'sm'}
              fontWeight={600}
              color={'white'}
              bg={'brand.teal'}
              href={'/signup'}
              _hover={{
                bg: 'brand.600',
                transform: 'translateY(-2px)',
                boxShadow: 'lg',
              }}
              transition="all 0.2s"
            >
              Sign Up
            </Button>
          </Stack>
        </Flex>

        <Collapse in={isOpen} animateOpacity>
          <MobileNav scrolled={scrolled} />
        </Collapse>
      </Container>
    </Box>
  );
};

const DesktopNav = ({ scrolled }: { scrolled: boolean }) => {
  const textColorScrolled = useColorModeValue('gray.600', 'gray.300');

  return (
    <Stack direction={'row'} spacing={4}>
      {NAV_ITEMS.map((navItem) => (
        <Box key={navItem.label}>
          <ChakraLink
            p={2}
            href={navItem.href}
            fontSize={'sm'}
            fontWeight={500}
            color={scrolled ? textColorScrolled : 'white'}
            _hover={{
              textDecoration: 'none',
              color: 'brand.teal',
            }}
            transition="color 0.3s ease-in-out"
          >
            {navItem.label}
          </ChakraLink>
        </Box>
      ))}
    </Stack>
  );
};

const MobileNav = ({ scrolled }: { scrolled: boolean }) => {
  const mobileBg = useColorModeValue('white', 'gray.800');
  const textColorScrolled = useColorModeValue('gray.600', 'gray.300');

  return (
    <Stack
      bg={scrolled ? mobileBg : 'whiteAlpha.900'} 
      p={4} 
      display={{ md: 'none' }}
      backdropFilter="blur(10px)"
      WebkitBackdropFilter="blur(10px)"
    >
      {NAV_ITEMS.map((navItem) => (
        <MobileNavItem key={navItem.label} {...navItem} scrolled={scrolled} />
      ))}
      <Stack spacing={4} mt={4}>
        <Button
          as={ChakraLink}
          href="/signin"
          variant="ghost"
          color={scrolled ? textColorScrolled : "white"}
          _hover={{ color: 'brand.teal' }}
          w="full"
        >
          Sign In
        </Button>
        <Button
          as={ChakraLink}
          href="/signup"
          colorScheme="teal"
          w="full"
        >
          Sign Up
        </Button>
      </Stack>
    </Stack>
  );
};

const MobileNavItem = ({ label, href, scrolled }: NavItem & { scrolled: boolean }) => {
  const textColorScrolled = useColorModeValue('gray.600', 'gray.300');

  return (
    <Stack spacing={4}>
      <Box
        py={2}
        as={ChakraLink}
        href={href}
        justifyContent="space-between"
        alignItems="center"
        _hover={{
          textDecoration: 'none',
        }}
      >
        <Text 
          fontWeight={600} 
          color={scrolled ? textColorScrolled : "white"} 
          _hover={{ color: 'brand.teal' }}
        >
          {label}
        </Text>
      </Box>
    </Stack>
  );
};