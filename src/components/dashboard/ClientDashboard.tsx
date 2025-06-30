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
  Badge,
  HStack,
  Icon,
  Button,
  useColorModeValue,
  List,
  ListItem,
  Flex,
  Progress,
} from '@chakra-ui/react';
import { 
  FiBriefcase, 
  FiMail, 
  FiDollarSign,
  FiPlusCircle,
  FiEye,
  FiUsers,
  FiClock,
  FiTrendingUp
} from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import { DashboardNavbar } from './DashboardNavbar';

export const ClientDashboard: React.FC = () => {
  const { profile } = useAuth();
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  // Mock data for demonstration
  const postedJobs = [
    { id: 1, title: 'Full-Stack Web Application', status: 'Open', proposals: 12, budget: 5000, deadline: '2025-02-15' },
    { id: 2, title: 'Mobile App Design', status: 'In Progress', proposals: 8, budget: 3000, deadline: '2025-01-30' },
    { id: 3, title: 'API Development', status: 'In Progress', proposals: 15, budget: 2500, deadline: '2025-02-10' },
    { id: 4, title: 'Database Migration', status: 'Completed', proposals: 6, budget: 1500, deadline: '2025-01-05' }
  ];

  const escrowMilestones = [
    { id: 1, project: 'Mobile App Design', amount: 1500, status: 'Funded', freelancer: 'John Doe' },
    { id: 2, project: 'API Development', amount: 1250, status: 'In Progress', freelancer: 'Jane Smith' },
    { id: 3, project: 'Database Migration', amount: 750, status: 'Released', freelancer: 'Mike Johnson' }
  ];

  const getJobStatusColor = (status: string) => {
    switch (status) {
      case 'Open': return 'green';
      case 'In Progress': return 'blue';
      case 'Completed': return 'gray';
      case 'Closed': return 'red';
      default: return 'gray';
    }
  };

  const getEscrowStatusColor = (status: string) => {
    switch (status) {
      case 'Funded': return 'green';
      case 'In Progress': return 'blue';
      case 'Released': return 'gray';
      case 'Pending': return 'yellow';
      default: return 'gray';
    }
  };

  const totalProposals = postedJobs.reduce((sum, job) => sum + job.proposals, 0);
  const fundedAmount = escrowMilestones.reduce((sum, milestone) => sum + milestone.amount, 0);

  return (
    <Box minH="100vh" bg={bgColor}>
      <DashboardNavbar userType="client" />
      
      <Container maxW="7xl" py={8}>
        <VStack spacing={8} align="stretch">
          {/* Welcome Header */}
          <Flex justify="space-between" align="start" wrap="wrap" gap={4}>
            <Box>
              <Heading size="lg" mb={2}>
                Welcome back, {profile?.first_name || 'Client'}! 👋
              </Heading>
              <Text color="gray.500">
                Manage your projects and discover amazing talent
              </Text>
            </Box>
            <Button 
              colorScheme="blue" 
              leftIcon={<Icon as={FiPlusCircle} />}
              size="lg"
              _hover={{ transform: 'translateY(-2px)', boxShadow: 'lg' }}
              transition="all 0.2s"
            >
              Post New Job
            </Button>
          </Flex>

          {/* Stats Overview */}
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
            <Card bg={cardBg} borderColor={borderColor}>
              <CardBody>
                <Stat>
                  <HStack justify="space-between" mb={2}>
                    <StatLabel fontSize="sm" color="gray.500">Active Jobs</StatLabel>
                    <Icon as={FiBriefcase} color="blue.500" />
                  </HStack>
                  <StatNumber fontSize="2xl" color="blue.500">
                    {postedJobs.filter(job => job.status !== 'Completed').length}
                  </StatNumber>
                  <StatHelpText>2 need attention</StatHelpText>
                </Stat>
              </CardBody>
            </Card>

            <Card bg={cardBg} borderColor={borderColor}>
              <CardBody>
                <Stat>
                  <HStack justify="space-between" mb={2}>
                    <StatLabel fontSize="sm" color="gray.500">Proposals Received</StatLabel>
                    <Icon as={FiMail} color="purple.500" />
                  </HStack>
                  <StatNumber fontSize="2xl" color="purple.500">{totalProposals}</StatNumber>
                  <StatHelpText>
                    <Icon as={FiTrendingUp} color="green.500" mr={1} />
                    +5 new today
                  </StatHelpText>
                </Stat>
              </CardBody>
            </Card>

            <Card bg={cardBg} borderColor={borderColor}>
              <CardBody>
                <Stat>
                  <HStack justify="space-between" mb={2}>
                    <StatLabel fontSize="sm" color="gray.500">Escrow Funded</StatLabel>
                    <Icon as={FiDollarSign} color="green.500" />
                  </HStack>
                  <StatNumber fontSize="2xl" color="green.500">${fundedAmount.toLocaleString()}</StatNumber>
                  <StatHelpText>3 active milestones</StatHelpText>
                </Stat>
              </CardBody>
            </Card>

            <Card bg={cardBg} borderColor={borderColor}>
              <CardBody>
                <Stat>
                  <HStack justify="space-between" mb={2}>
                    <StatLabel fontSize="sm" color="gray.500">Freelancers Hired</StatLabel>
                    <Icon as={FiUsers} color="teal.500" />
                  </HStack>
                  <StatNumber fontSize="2xl" color="teal.500">8</StatNumber>
                  <StatHelpText>This month</StatHelpText>
                </Stat>
              </CardBody>
            </Card>
          </SimpleGrid>

          {/* Main Content Grid */}
          <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8}>
            {/* Posted Jobs */}
            <Card bg={cardBg} borderColor={borderColor}>
              <CardHeader>
                <HStack justify="space-between">
                  <HStack>
                    <Icon as={FiBriefcase} color="blue.500" />
                    <Heading size="md">Posted Jobs</Heading>
                  </HStack>
                  <Button size="sm" variant="ghost" rightIcon={<Icon as={FiEye} />}>
                    View All
                  </Button>
                </HStack>
              </CardHeader>
              <CardBody pt={0}>
                <VStack spacing={4} align="stretch">
                  {postedJobs.map((job) => (
                    <Box key={job.id} p={4} border="1px" borderColor={borderColor} borderRadius="md">
                      <VStack align="stretch" spacing={3}>
                        <Flex justify="space-between" align="start">
                          <Box flex={1}>
                            <Text fontWeight="semibold" noOfLines={1}>
                              {job.title}
                            </Text>
                            <HStack spacing={4} fontSize="sm" color="gray.500" mt={1}>
                              <Text>${job.budget.toLocaleString()}</Text>
                              <Text>•</Text>
                              <Text>{job.proposals} proposals</Text>
                            </HStack>
                          </Box>
                          <Badge colorScheme={getJobStatusColor(job.status)} variant="subtle">
                            {job.status}
                          </Badge>
                        </Flex>
                        
                        <HStack justify="space-between" fontSize="sm" color="gray.500">
                          <HStack>
                            <Icon as={FiClock} />
                            <Text>Due {job.deadline}</Text>
                          </HStack>
                          {job.status === 'Open' && (
                            <Button size="xs" colorScheme="blue" variant="outline">
                              Review Proposals
                            </Button>
                          )}
                        </HStack>
                      </VStack>
                    </Box>
                  ))}
                </VStack>
              </CardBody>
            </Card>

            {/* Escrow Summary */}
            <Card bg={cardBg} borderColor={borderColor}>
              <CardHeader>
                <HStack justify="space-between">
                  <HStack>
                    <Icon as={FiDollarSign} color="green.500" />
                    <Heading size="md">Escrow Summary</Heading>
                  </HStack>
                  <Button size="sm" variant="ghost" rightIcon={<Icon as={FiEye} />}>
                    View All
                  </Button>
                </HStack>
              </CardHeader>
              <CardBody pt={0}>
                <VStack spacing={4} align="stretch">
                  {escrowMilestones.map((milestone) => (
                    <Box key={milestone.id} p={4} border="1px" borderColor={borderColor} borderRadius="md">
                      <VStack align="stretch" spacing={3}>
                        <Flex justify="space-between" align="start">
                          <Box flex={1}>
                            <Text fontWeight="semibold" noOfLines={1}>
                              {milestone.project}
                            </Text>
                            <Text fontSize="sm" color="gray.500">
                              {milestone.freelancer}
                            </Text>
                          </Box>
                          <VStack align="end" spacing={1}>
                            <Text fontWeight="bold" color="green.600">
                              ${milestone.amount.toLocaleString()}
                            </Text>
                            <Badge colorScheme={getEscrowStatusColor(milestone.status)} variant="subtle" fontSize="xs">
                              {milestone.status}
                            </Badge>
                          </VStack>
                        </Flex>
                        
                        {milestone.status === 'In Progress' && (
                          <Box>
                            <HStack justify="space-between" mb={2}>
                              <Text fontSize="sm" color="gray.500">Milestone Progress</Text>
                              <Text fontSize="sm" color="gray.600">75%</Text>
                            </HStack>
                            <Progress value={75} colorScheme="blue" size="sm" borderRadius="full" />
                          </Box>
                        )}
                      </VStack>
                    </Box>
                  ))}
                </VStack>
              </CardBody>
            </Card>
          </SimpleGrid>

          {/* Quick Actions */}
          <Card bg={cardBg} borderColor={borderColor}>
            <CardHeader>
              <Heading size="md">Quick Actions</Heading>
            </CardHeader>
            <CardBody pt={0}>
              <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                <Button 
                  leftIcon={<Icon as={FiPlusCircle} />} 
                  colorScheme="blue" 
                  variant="outline"
                  h="60px"
                  _hover={{ transform: 'translateY(-2px)', boxShadow: 'lg' }}
                  transition="all 0.2s"
                >
                  Post New Job
                </Button>
                <Button 
                  leftIcon={<Icon as={FiUsers} />} 
                  colorScheme="purple" 
                  variant="outline"
                  h="60px"
                  _hover={{ transform: 'translateY(-2px)', boxShadow: 'lg' }}
                  transition="all 0.2s"
                >
                  Browse Freelancers
                </Button>
                <Button 
                  leftIcon={<Icon as={FiMail} />} 
                  colorScheme="teal" 
                  variant="outline"
                  h="60px"
                  _hover={{ transform: 'translateY(-2px)', boxShadow: 'lg' }}
                  transition="all 0.2s"
                >
                  Review Proposals
                </Button>
              </SimpleGrid>
            </CardBody>
          </Card>
        </VStack>
      </Container>
    </Box>
  );
};