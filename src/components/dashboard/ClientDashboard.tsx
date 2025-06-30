import React, { useState, useEffect } from 'react';
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
  Spinner,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Avatar,
  Divider,
  Tag,
  TagLabel,
  Wrap,
  WrapItem,
} from '@chakra-ui/react';
import { 
  Briefcase, 
  Mail, 
  DollarSign,
  PlusCircle,
  Eye,
  Users,
  Clock,
  TrendingUp,
  Calendar,
  MapPin,
  Building,
  FileText,
  User
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { DashboardNavbar } from './DashboardNavbar';
import { supabase } from '../../lib/supabase';

interface Job {
  id: string;
  title: string;
  description: string;
  company: string;
  location: string;
  employment_type: string;
  experience_level: string;
  budget: number;
  budget_currency: string;
  deadline: string;
  skills_required: string[];
  requirements: string[];
  benefits: string[];
  posted_date: string;
  client_id: string;
  is_active: boolean;
}

interface Application {
  id: string;
  user_id: string;
  job_id: string;
  status: string;
  applied_date: string;
  cover_letter: string;
  user_profiles?: {
    first_name: string;
    last_name: string;
    avatar_url?: string;
  };
}

export const ClientDashboard: React.FC = () => {
  const { profile, user } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingApplications, setLoadingApplications] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  useEffect(() => {
    if (user) {
      fetchClientJobs();
    }
  }, [user]);

  const fetchClientJobs = async () => {
    try {
      setLoading(true);
      
      const { data: jobsData, error: jobsError } = await supabase
        .from('jobs')
        .select('*')
        .eq('client_id', user?.id)
        .order('posted_date', { ascending: false });

      if (jobsError) throw jobsError;

      setJobs(jobsData || []);

    } catch (error) {
      console.error('Error fetching client jobs:', error);
      toast({
        title: 'Error Loading Jobs',
        description: 'Failed to load your job postings. Please refresh the page.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchJobApplications = async (jobId: string) => {
    try {
      setLoadingApplications(true);
      
      const { data: applicationsData, error: applicationsError } = await supabase
        .from('job_applications')
        .select(`
          *,
          user_profiles (
            first_name,
            last_name,
            avatar_url
          )
        `)
        .eq('job_id', jobId)
        .order('applied_date', { ascending: false });

      if (applicationsError) throw applicationsError;

      setApplications(applicationsData || []);

    } catch (error) {
      console.error('Error fetching applications:', error);
      toast({
        title: 'Error Loading Applications',
        description: 'Failed to load job applications.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoadingApplications(false);
    }
  };

  const handleViewProposals = (job: Job) => {
    setSelectedJob(job);
    fetchJobApplications(job.id);
    onOpen();
  };

  const formatCurrency = (amount: number, currency: string) => {
    const symbols: { [key: string]: string } = {
      USD: '$',
      EUR: '€',
      GBP: '£',
      NGN: '₦',
      KES: 'KSh',
      ZAR: 'R'
    };
    return `${symbols[currency] || currency} ${amount.toLocaleString()}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getJobStatusColor = (job: Job) => {
    if (!job.is_active) return 'gray';
    const deadline = new Date(job.deadline);
    const now = new Date();
    const daysUntilDeadline = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysUntilDeadline < 0) return 'red';
    if (daysUntilDeadline <= 7) return 'orange';
    return 'green';
  };

  const getJobStatusLabel = (job: Job) => {
    if (!job.is_active) return 'Closed';
    const deadline = new Date(job.deadline);
    const now = new Date();
    const daysUntilDeadline = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysUntilDeadline < 0) return 'Overdue';
    if (daysUntilDeadline <= 7) return 'Closing Soon';
    return 'Active';
  };

  const getApplicationStatusColor = (status: string) => {
    switch (status) {
      case 'applied': return 'blue';
      case 'in_review': return 'yellow';
      case 'interview_scheduled': return 'purple';
      case 'offer': return 'green';
      case 'rejected': return 'red';
      case 'withdrawn': return 'gray';
      default: return 'gray';
    }
  };

  const getApplicationStatusLabel = (status: string) => {
    switch (status) {
      case 'applied': return 'Applied';
      case 'in_review': return 'Under Review';
      case 'interview_scheduled': return 'Interview Scheduled';
      case 'offer': return 'Offer Sent';
      case 'rejected': return 'Rejected';
      case 'withdrawn': return 'Withdrawn';
      default: return status;
    }
  };

  // Calculate stats
  const activeJobs = jobs.filter(job => job.is_active).length;
  const totalBudget = jobs.reduce((sum, job) => sum + (job.budget || 0), 0);
  const totalApplications = jobs.reduce((sum, job) => {
    // This would need to be fetched separately for accurate count
    return sum;
  }, 0);

  if (loading) {
    return (
      <Box minH="100vh" bg={bgColor}>
        <DashboardNavbar userType="client" />
        <Container maxW="7xl" py={8}>
          <VStack spacing={8}>
            <Flex justify="center" align="center" h="50vh">
              <VStack spacing={4}>
                <Spinner size="xl" color="maroon.500" thickness="4px" />
                <Text color="gray.500">Loading your dashboard...</Text>
              </VStack>
            </Flex>
          </VStack>
        </Container>
      </Box>
    );
  }

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
              colorScheme="red"
              bg="maroon.500"
              leftIcon={<Icon as={PlusCircle} />}
              size="lg"
              _hover={{ 
                bg: 'maroon.600',
                transform: 'translateY(-2px)', 
                boxShadow: 'lg' 
              }}
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
                    <Icon as={Briefcase} color="maroon.500" />
                  </HStack>
                  <StatNumber fontSize="2xl" color="maroon.500">
                    {activeJobs}
                  </StatNumber>
                  <StatHelpText>{jobs.length - activeJobs} completed</StatHelpText>
                </Stat>
              </CardBody>
            </Card>

            <Card bg={cardBg} borderColor={borderColor}>
              <CardBody>
                <Stat>
                  <HStack justify="space-between" mb={2}>
                    <StatLabel fontSize="sm" color="gray.500">Total Budget</StatLabel>
                    <Icon as={DollarSign} color="green.500" />
                  </HStack>
                  <StatNumber fontSize="2xl" color="green.500">
                    ${totalBudget.toLocaleString()}
                  </StatNumber>
                  <StatHelpText>Across all projects</StatHelpText>
                </Stat>
              </CardBody>
            </Card>

            <Card bg={cardBg} borderColor={borderColor}>
              <CardBody>
                <Stat>
                  <HStack justify="space-between" mb={2}>
                    <StatLabel fontSize="sm" color="gray.500">Applications</StatLabel>
                    <Icon as={Mail} color="purple.500" />
                  </HStack>
                  <StatNumber fontSize="2xl" color="purple.500">-</StatNumber>
                  <StatHelpText>View job details</StatHelpText>
                </Stat>
              </CardBody>
            </Card>

            <Card bg={cardBg} borderColor={borderColor}>
              <CardBody>
                <Stat>
                  <HStack justify="space-between" mb={2}>
                    <StatLabel fontSize="sm" color="gray.500">Success Rate</StatLabel>
                    <Icon as={TrendingUp} color="teal.500" />
                  </HStack>
                  <StatNumber fontSize="2xl" color="teal.500">95%</StatNumber>
                  <StatHelpText>Project completion</StatHelpText>
                </Stat>
              </CardBody>
            </Card>
          </SimpleGrid>

          {/* Posted Jobs */}
          <Card bg={cardBg} borderColor={borderColor}>
            <CardHeader>
              <HStack justify="space-between">
                <HStack>
                  <Icon as={Briefcase} color="maroon.500" />
                  <Heading size="md">Your Job Postings</Heading>
                </HStack>
                <Button size="sm" variant="ghost" rightIcon={<Icon as={Eye} />}>
                  View All
                </Button>
              </HStack>
            </CardHeader>
            <CardBody pt={0}>
              <VStack spacing={4} align="stretch">
                {jobs.length === 0 ? (
                  <Box textAlign="center" py={8}>
                    <Icon as={Briefcase} w={12} h={12} color="gray.300" mb={4} />
                    <Heading size="lg" mb={4} color="gray.600">
                      No Jobs Posted Yet
                    </Heading>
                    <Text color="gray.500" mb={6}>
                      Start by posting your first job to find talented freelancers
                    </Text>
                    <Button 
                      colorScheme="red"
                      bg="maroon.500"
                      leftIcon={<Icon as={PlusCircle} />}
                      _hover={{ bg: 'maroon.600' }}
                    >
                      Post Your First Job
                    </Button>
                  </Box>
                ) : (
                  jobs.map((job) => (
                    <Box key={job.id} p={4} border="1px" borderColor={borderColor} borderRadius="md">
                      <VStack align="stretch" spacing={3}>
                        <Flex justify="space-between" align="start">
                          <Box flex={1}>
                            <Text fontWeight="semibold" noOfLines={1} mb={1}>
                              {job.title}
                            </Text>
                            <HStack spacing={4} fontSize="sm" color="gray.500" mb={2}>
                              <HStack>
                                <Icon as={DollarSign} color="green.500" size="sm" />
                                <Text color="green.600" fontWeight="medium">
                                  {formatCurrency(job.budget, job.budget_currency)}
                                </Text>
                              </HStack>
                              <HStack>
                                <Icon as={MapPin} color="blue.500" size="sm" />
                                <Text color="blue.600">{job.location}</Text>
                              </HStack>
                              <HStack>
                                <Icon as={Calendar} color="purple.500" size="sm" />
                                <Text color="purple.600">Due {formatDate(job.deadline)}</Text>
                              </HStack>
                            </HStack>
                          </Box>
                          <Badge colorScheme={getJobStatusColor(job)} variant="subtle">
                            {getJobStatusLabel(job)}
                          </Badge>
                        </Flex>
                        
                        <Text fontSize="sm" color="gray.600" noOfLines={2}>
                          {job.description}
                        </Text>

                        {job.skills_required && job.skills_required.length > 0 && (
                          <Wrap>
                            {job.skills_required.slice(0, 4).map((skill, index) => (
                              <WrapItem key={index}>
                                <Tag size="sm" variant="subtle" colorScheme="teal">
                                  <TagLabel>{skill}</TagLabel>
                                </Tag>
                              </WrapItem>
                            ))}
                            {job.skills_required.length > 4 && (
                              <WrapItem>
                                <Tag size="sm" variant="subtle" colorScheme="gray">
                                  <TagLabel>+{job.skills_required.length - 4} more</TagLabel>
                                </Tag>
                              </WrapItem>
                            )}
                          </Wrap>
                        )}
                        
                        <HStack justify="space-between" fontSize="sm" color="gray.500">
                          <HStack>
                            <Icon as={Clock} />
                            <Text>Posted {formatDate(job.posted_date)}</Text>
                          </HStack>
                          <Button
                            size="sm"
                            colorScheme="red"
                            bg="maroon.500"
                            onClick={() => handleViewProposals(job)}
                            leftIcon={<Icon as={Eye} />}
                            _hover={{ bg: 'maroon.600' }}
                          >
                            View Proposals
                          </Button>
                        </HStack>
                      </VStack>
                    </Box>
                  ))
                )}
              </VStack>
            </CardBody>
          </Card>

          {/* Quick Actions */}
          <Card bg={cardBg} borderColor={borderColor}>
            <CardHeader>
              <Heading size="md">Quick Actions</Heading>
            </CardHeader>
            <CardBody pt={0}>
              <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                <Button 
                  leftIcon={<Icon as={PlusCircle} />} 
                  colorScheme="red"
                  bg="maroon.500"
                  variant="outline"
                  h="60px"
                  _hover={{ 
                    bg: 'maroon.50',
                    transform: 'translateY(-2px)', 
                    boxShadow: 'lg' 
                  }}
                  transition="all 0.2s"
                >
                  Post New Job
                </Button>
                <Button 
                  leftIcon={<Icon as={Users} />} 
                  colorScheme="purple" 
                  variant="outline"
                  h="60px"
                  _hover={{ transform: 'translateY(-2px)', boxShadow: 'lg' }}
                  transition="all 0.2s"
                >
                  Browse Freelancers
                </Button>
                <Button 
                  leftIcon={<Icon as={Mail} />} 
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

      {/* Proposals Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <HStack>
              <Icon as={Mail} color="maroon.500" />
              <Text>Job Applications</Text>
            </HStack>
          </ModalHeader>
          <ModalCloseButton />
          
          <ModalBody>
            {selectedJob && (
              <VStack spacing={6} align="stretch">
                {/* Job Summary */}
                <Box>
                  <Text fontSize="lg" fontWeight="bold" mb={2}>
                    {selectedJob.title}
                  </Text>
                  <HStack spacing={4} flexWrap="wrap" mb={4}>
                    <HStack>
                      <Icon as={DollarSign} color="green.500" size="sm" />
                      <Text fontSize="sm" color="green.600">
                        {formatCurrency(selectedJob.budget, selectedJob.budget_currency)}
                      </Text>
                    </HStack>
                    <HStack>
                      <Icon as={Calendar} color="purple.500" size="sm" />
                      <Text fontSize="sm" color="purple.600">
                        Due {formatDate(selectedJob.deadline)}
                      </Text>
                    </HStack>
                  </HStack>
                </Box>

                <Divider />

                {/* Applications List */}
                <Box>
                  <Text fontSize="md" fontWeight="semibold" mb={4}>
                    Applications ({applications.length})
                  </Text>
                  
                  {loadingApplications ? (
                    <Box textAlign="center" py={8}>
                      <Spinner size="lg" color="maroon.500" />
                      <Text mt={4} color="gray.500" fontSize="sm">
                        Loading applications...
                      </Text>
                    </Box>
                  ) : applications.length === 0 ? (
                    <Box textAlign="center" py={8}>
                      <Icon as={Mail} w={12} h={12} color="gray.300" mb={4} />
                      <Text color="gray.500">No applications yet</Text>
                      <Text fontSize="sm" color="gray.400" mt={2}>
                        Applications will appear here as freelancers apply
                      </Text>
                    </Box>
                  ) : (
                    <VStack spacing={4} align="stretch">
                      {applications.map((application) => (
                        <Box key={application.id} p={4} border="1px" borderColor={borderColor} borderRadius="md">
                          <VStack align="stretch" spacing={3}>
                            <Flex justify="space-between" align="start">
                              <HStack spacing={3}>
                                <Avatar
                                  size="sm"
                                  name={`${application.user_profiles?.first_name} ${application.user_profiles?.last_name}`}
                                  src={application.user_profiles?.avatar_url}
                                />
                                <VStack align="start" spacing={0}>
                                  <Text fontWeight="medium" fontSize="sm">
                                    {application.user_profiles?.first_name} {application.user_profiles?.last_name}
                                  </Text>
                                  <Text fontSize="xs" color="gray.500">
                                    Applied {formatDate(application.applied_date)}
                                  </Text>
                                </VStack>
                              </HStack>
                              <Badge colorScheme={getApplicationStatusColor(application.status)} variant="subtle">
                                {getApplicationStatusLabel(application.status)}
                              </Badge>
                            </Flex>
                            
                            <Text fontSize="sm" color="gray.600" noOfLines={3}>
                              {application.cover_letter}
                            </Text>
                            
                            <HStack spacing={2}>
                              <Button size="xs" colorScheme="green" variant="outline">
                                Accept
                              </Button>
                              <Button size="xs" colorScheme="red" variant="outline">
                                Decline
                              </Button>
                              <Button size="xs" variant="ghost">
                                View Profile
                              </Button>
                            </HStack>
                          </VStack>
                        </Box>
                      ))}
                    </VStack>
                  )}
                </Box>
              </VStack>
            )}
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};