import React from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  SimpleGrid,
  Card,
  CardBody,
  CardHeader,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Progress,
  Badge,
  HStack,
  Icon,
  Button,
  Divider,
  useColorModeValue,
  List,
  ListItem,
  ListIcon,
  Flex,
} from '@chakra-ui/react';
import { 
  FiBriefcase, 
  FiDollarSign, 
  FiMail, 
  FiUser, 
  FiClock,
  FiTrendingUp,
  FiCheck,
  FiEye
} from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import { DashboardNavbar } from './DashboardNavbar';

export const FreelancerDashboard: React.FC = () => {
  const { profile } = useAuth();
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  // Mock data for demonstration
  const activeJobs = [
    { id: 1, title: 'E-commerce Website Development', client: 'TechCorp Ltd', deadline: '2025-01-15', status: 'In Progress', progress: 65 },
    { id: 2, title: 'Mobile App UI Design', client: 'StartupXYZ', deadline: '2025-01-20', status: 'Review', progress: 90 },
    { id: 3, title: 'Logo Design Project', client: 'Creative Agency', deadline: '2025-01-10', status: 'In Progress', progress: 40 }
  ];

  const proposalsSent = [
    { id: 1, title: 'React Dashboard Development', status: 'Pending', sentDate: '2025-01-05' },
    { id: 2, title: 'WordPress Theme Customization', status: 'Accepted', sentDate: '2025-01-03' },
    { id: 3, title: 'API Integration Project', status: 'Declined', sentDate: '2025-01-02' },
    { id: 4, title: 'Database Optimization', status: 'Under Review', sentDate: '2025-01-04' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'In Progress': return 'blue';
      case 'Review': return 'orange';
      case 'Completed': return 'green';
      case 'Accepted': return 'green';
      case 'Pending': return 'yellow';
      case 'Under Review': return 'blue';
      case 'Declined': return 'red';
      default: return 'gray';
    }
  };

  return (
    <Box minH="100vh" bg={bgColor}>
      <DashboardNavbar userType="freelancer" />
      
      <Container maxW="7xl" py={8}>
        <VStack spacing={8} align="stretch">
          {/* Welcome Header */}
          <Box>
            <Heading size="lg" mb={2}>
              Welcome back, {profile?.first_name || 'Freelancer'}! 👋
            </Heading>
            <Text color="gray.500">
              Here's what's happening with your freelance business today
            </Text>
          </Box>

          {/* Stats Overview */}
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
            <Card bg={cardBg} borderColor={borderColor}>
              <CardBody>
                <Stat>
                  <HStack justify="space-between" mb={2}>
                    <StatLabel fontSize="sm" color="gray.500">Total Earnings</StatLabel>
                    <Icon as={FiDollarSign} color="green.500" />
                  </HStack>
                  <StatNumber fontSize="2xl" color="green.500">$12,450</StatNumber>
                  <StatHelpText>
                    <Icon as={FiTrendingUp} color="green.500" mr={1} />
                    +23% from last month
                  </StatHelpText>
                </Stat>
              </CardBody>
            </Card>

            <Card bg={cardBg} borderColor={borderColor}>
              <CardBody>
                <Stat>
                  <HStack justify="space-between" mb={2}>
                    <StatLabel fontSize="sm" color="gray.500">Active Jobs</StatLabel>
                    <Icon as={FiBriefcase} color="blue.500" />
                  </HStack>
                  <StatNumber fontSize="2xl" color="blue.500">{activeJobs.length}</StatNumber>
                  <StatHelpText>2 due this week</StatHelpText>
                </Stat>
              </CardBody>
            </Card>

            <Card bg={cardBg} borderColor={borderColor}>
              <CardBody>
                <Stat>
                  <HStack justify="space-between" mb={2}>
                    <StatLabel fontSize="sm" color="gray.500">Proposals Sent</StatLabel>
                    <Icon as={FiMail} color="purple.500" />
                  </HStack>
                  <StatNumber fontSize="2xl" color="purple.500">{proposalsSent.length}</StatNumber>
                  <StatHelpText>1 accepted this week</StatHelpText>
                </Stat>
              </CardBody>
            </Card>

            <Card bg={cardBg} borderColor={borderColor}>
              <CardBody>
                <Stat>
                  <HStack justify="space-between" mb={2}>
                    <StatLabel fontSize="sm" color="gray.500">Success Rate</StatLabel>
                    <Icon as={FiTrendingUp} color="teal.500" />
                  </HStack>
                  <StatNumber fontSize="2xl" color="teal.500">87%</StatNumber>
                  <StatHelpText>Above average</StatHelpText>
                </Stat>
              </CardBody>
            </Card>
          </SimpleGrid>

          {/* Main Content Grid */}
          <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8}>
            {/* Active Jobs */}
            <Card bg={cardBg} borderColor={borderColor}>
              <CardHeader>
                <HStack justify="space-between">
                  <HStack>
                    <Icon as={FiBriefcase} color="blue.500" />
                    <Heading size="md">Active Jobs</Heading>
                  </HStack>
                  <Button size="sm" variant="ghost" rightIcon={<Icon as={FiEye} />}>
                    View All
                  </Button>
                </HStack>
              </CardHeader>
              <CardBody pt={0}>
                <VStack spacing={4} align="stretch">
                  {activeJobs.map((job) => (
                    <Box key={job.id} p={4} border="1px" borderColor={borderColor} borderRadius="md">
                      <VStack align="stretch" spacing={3}>
                        <Flex justify="space-between" align="start">
                          <Box flex={1}>
                            <Text fontWeight="semibold" noOfLines={1}>
                              {job.title}
                            </Text>
                            <Text fontSize="sm" color="gray.500">
                              {job.client}
                            </Text>
                          </Box>
                          <Badge colorScheme={getStatusColor(job.status)} variant="subtle">
                            {job.status}
                          </Badge>
                        </Flex>
                        
                        <Box>
                          <HStack justify="space-between" mb={2}>
                            <Text fontSize="sm" color="gray.500">Progress</Text>
                            <Text fontSize="sm" color="gray.600">{job.progress}%</Text>
                          </HStack>
                          <Progress value={job.progress} colorScheme="blue" size="sm" borderRadius="full" />
                        </Box>
                        
                        <HStack justify="space-between" fontSize="sm" color="gray.500">
                          <HStack>
                            <Icon as={FiClock} />
                            <Text>Due {job.deadline}</Text>
                          </HStack>
                        </HStack>
                      </VStack>
                    </Box>
                  ))}
                </VStack>
              </CardBody>
            </Card>

            {/* Proposals Sent */}
            <Card bg={cardBg} borderColor={borderColor}>
              <CardHeader>
                <HStack justify="space-between">
                  <HStack>
                    <Icon as={FiMail} color="purple.500" />
                    <Heading size="md">Recent Proposals</Heading>
                  </HStack>
                  <Button size="sm" variant="ghost" rightIcon={<Icon as={FiEye} />}>
                    View All
                  </Button>
                </HStack>
              </CardHeader>
              <CardBody pt={0}>
                <List spacing={3}>
                  {proposalsSent.map((proposal) => (
                    <ListItem key={proposal.id}>
                      <Flex justify="space-between" align="center" p={3} border="1px" borderColor={borderColor} borderRadius="md">
                        <Box flex={1}>
                          <Text fontWeight="medium" noOfLines={1}>
                            {proposal.title}
                          </Text>
                          <Text fontSize="sm" color="gray.500">
                            Sent {proposal.sentDate}
                          </Text>
                        </Box>
                        <Badge colorScheme={getStatusColor(proposal.status)} variant="subtle">
                          {proposal.status}
                        </Badge>
                      </Flex>
                    </ListItem>
                  ))}
                </List>
              </CardBody>
            </Card>
          </SimpleGrid>

          {/* Profile Completion */}
          <Card bg={cardBg} borderColor={borderColor}>
            <CardHeader>
              <HStack>
                <Icon as={FiUser} color="teal.500" />
                <Heading size="md">Profile Completion</Heading>
              </HStack>
            </CardHeader>
            <CardBody pt={0}>
              <VStack spacing={4} align="stretch">
                <HStack justify="space-between">
                  <Text>Complete your profile to get more opportunities</Text>
                  <Text fontWeight="bold" color="teal.500">70%</Text>
                </HStack>
                
                <Progress value={70} colorScheme="teal" size="lg" borderRadius="full" />
                
                <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                  <HStack>
                    <Icon as={FiCheck} color="green.500" />
                    <Text fontSize="sm">Basic Info Complete</Text>
                  </HStack>
                  <HStack>
                    <Icon as={FiCheck} color="green.500" />
                    <Text fontSize="sm">Portfolio Added</Text>
                  </HStack>
                  <HStack>
                    <Icon as={FiClock} color="orange.500" />
                    <Text fontSize="sm">Skills Assessment Pending</Text>
                  </HStack>
                </SimpleGrid>
                
                <Button colorScheme="teal" size="sm" w="fit-content">
                  Complete Profile
                </Button>
              </VStack>
            </CardBody>
          </Card>
        </VStack>
      </Container>
    </Box>
  );
};