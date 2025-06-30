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
  Textarea,
  FormControl,
  FormLabel,
  NumberInput,
  NumberInputField,
  Tag,
  TagLabel,
  Wrap,
  WrapItem,
} from '@chakra-ui/react';
import { 
  Briefcase, 
  DollarSign, 
  Calendar, 
  MapPin, 
  User, 
  Clock,
  TrendingUp,
  Check,
  Eye,
  Send,
  Building,
  FileText
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
  job_id: string;
  status: string;
  applied_date: string;
  cover_letter: string;
  jobs?: {
    title: string;
    company: string;
    budget: number;
    budget_currency: string;
  };
}

export const FreelancerDashboard: React.FC = () => {
  const { profile, user } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [bidAmount, setBidAmount] = useState<number>(0);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch available jobs
      const { data: jobsData, error: jobsError } = await supabase
        .from('jobs')
        .select('*')
        .eq('is_active', true)
        .order('posted_date', { ascending: false })
        .limit(10);

      if (jobsError) throw jobsError;

      // Fetch user's applications
      const { data: applicationsData, error: applicationsError } = await supabase
        .from('job_applications')
        .select(`
          *,
          jobs (
            title,
            company,
            budget,
            budget_currency
          )
        `)
        .eq('user_id', user?.id)
        .order('applied_date', { ascending: false });

      if (applicationsError) throw applicationsError;

      setJobs(jobsData || []);
      setApplications(applicationsData || []);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast({
        title: 'Error Loading Data',
        description: 'Failed to load dashboard data. Please refresh the page.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApplyClick = (job: Job) => {
    setSelectedJob(job);
    setBidAmount(job.budget || 0);
    setCoverLetter('');
    onOpen();
  };

  const submitApplication = async () => {
    if (!selectedJob || !user || !coverLetter.trim()) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all required fields.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setApplying(true);
    try {
      const { error } = await supabase
        .from('job_applications')
        .insert({
          user_id: user.id,
          job_id: selectedJob.id,
          cover_letter: coverLetter,
          applied_date: new Date().toISOString(),
          status: 'applied',
        });

      if (error) throw error;

      toast({
        title: 'Application Submitted',
        description: 'Your job application has been sent successfully!',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      onClose();
      fetchDashboardData(); // Refresh data

    } catch (error: any) {
      console.error('Error submitting application:', error);
      
      if (error.code === '23505') {
        toast({
          title: 'Already Applied',
          description: 'You have already applied for this job.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } else {
        toast({
          title: 'Submission Failed',
          description: 'Failed to submit your application. Please try again.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    } finally {
      setApplying(false);
    }
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

  const getStatusColor = (status: string) => {
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

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'applied': return 'Applied';
      case 'in_review': return 'Under Review';
      case 'interview_scheduled': return 'Interview Scheduled';
      case 'offer': return 'Offer Received';
      case 'rejected': return 'Rejected';
      case 'withdrawn': return 'Withdrawn';
      default: return status;
    }
  };

  // Calculate stats
  const totalEarnings = applications
    .filter(app => app.status === 'offer')
    .reduce((sum, app) => sum + (app.jobs?.budget || 0), 0);
  
  const successRate = applications.length > 0 
    ? Math.round((applications.filter(app => app.status === 'offer').length / applications.length) * 100)
    : 0;

  if (loading) {
    return (
      <Box minH="100vh" bg={bgColor}>
        <DashboardNavbar userType="freelancer" />
        <Container maxW="7xl" py={8}>
          <VStack spacing={8}>
            <Flex justify="center" align="center" h="50vh">
              <VStack spacing={4}>
                <Spinner size="xl" color="brand.teal" thickness="4px" />
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
                    <Icon as={DollarSign} color="green.500" />
                  </HStack>
                  <StatNumber fontSize="2xl" color="green.500">
                    ${totalEarnings.toLocaleString()}
                  </StatNumber>
                  <StatHelpText>
                    <Icon as={TrendingUp} color="green.500" mr={1} />
                    From accepted proposals
                  </StatHelpText>
                </Stat>
              </CardBody>
            </Card>

            <Card bg={cardBg} borderColor={borderColor}>
              <CardBody>
                <Stat>
                  <HStack justify="space-between" mb={2}>
                    <StatLabel fontSize="sm" color="gray.500">Available Jobs</StatLabel>
                    <Icon as={Briefcase} color="blue.500" />
                  </HStack>
                  <StatNumber fontSize="2xl" color="blue.500">{jobs.length}</StatNumber>
                  <StatHelpText>Active opportunities</StatHelpText>
                </Stat>
              </CardBody>
            </Card>

            <Card bg={cardBg} borderColor={borderColor}>
              <CardBody>
                <Stat>
                  <HStack justify="space-between" mb={2}>
                    <StatLabel fontSize="sm" color="gray.500">Applications Sent</StatLabel>
                    <Icon as={FileText} color="purple.500" />
                  </HStack>
                  <StatNumber fontSize="2xl" color="purple.500">{applications.length}</StatNumber>
                  <StatHelpText>Total proposals</StatHelpText>
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
                  <StatNumber fontSize="2xl" color="teal.500">{successRate}%</StatNumber>
                  <StatHelpText>Proposal acceptance</StatHelpText>
                </Stat>
              </CardBody>
            </Card>
          </SimpleGrid>

          {/* Main Content Grid */}
          <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8}>
            {/* Available Jobs */}
            <Card bg={cardBg} borderColor={borderColor}>
              <CardHeader>
                <HStack justify="space-between">
                  <HStack>
                    <Icon as={Briefcase} color="blue.500" />
                    <Heading size="md">Available Jobs</Heading>
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
                      <Text color="gray.500">No jobs available at the moment</Text>
                    </Box>
                  ) : (
                    jobs.slice(0, 5).map((job) => (
                      <Box key={job.id} p={4} border="1px" borderColor={borderColor} borderRadius="md">
                        <VStack align="stretch" spacing={3}>
                          <Flex justify="space-between" align="start">
                            <Box flex={1}>
                              <Text fontWeight="semibold" noOfLines={1} mb={1}>
                                {job.title}
                              </Text>
                              <HStack spacing={2} mb={2}>
                                <Icon as={Building} color="gray.500" size="sm" />
                                <Text fontSize="sm" color="gray.600">
                                  {job.company}
                                </Text>
                              </HStack>
                              <HStack spacing={4} fontSize="sm" color="gray.500">
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
                              </HStack>
                            </Box>
                            <Badge colorScheme="blue" variant="subtle">
                              {job.employment_type.replace('_', ' ')}
                            </Badge>
                          </Flex>
                          
                          <Text fontSize="sm" color="gray.600" noOfLines={2}>
                            {job.description}
                          </Text>

                          {job.skills_required && job.skills_required.length > 0 && (
                            <Wrap>
                              {job.skills_required.slice(0, 3).map((skill, index) => (
                                <WrapItem key={index}>
                                  <Tag size="sm" variant="subtle" colorScheme="teal">
                                    <TagLabel>{skill}</TagLabel>
                                  </Tag>
                                </WrapItem>
                              ))}
                              {job.skills_required.length > 3 && (
                                <WrapItem>
                                  <Tag size="sm" variant="subtle" colorScheme="gray">
                                    <TagLabel>+{job.skills_required.length - 3} more</TagLabel>
                                  </Tag>
                                </WrapItem>
                              )}
                            </Wrap>
                          )}
                          
                          <HStack justify="space-between" fontSize="sm" color="gray.500">
                            <HStack>
                              <Icon as={Calendar} />
                              <Text>Due {formatDate(job.deadline)}</Text>
                            </HStack>
                            <Button
                              size="sm"
                              colorScheme="brand"
                              bg="brand.teal"
                              onClick={() => handleApplyClick(job)}
                              leftIcon={<Icon as={Send} />}
                              _hover={{ bg: 'brand.600' }}
                            >
                              Apply
                            </Button>
                          </HStack>
                        </VStack>
                      </Box>
                    ))
                  )}
                </VStack>
              </CardBody>
            </Card>

            {/* Recent Applications */}
            <Card bg={cardBg} borderColor={borderColor}>
              <CardHeader>
                <HStack justify="space-between">
                  <HStack>
                    <Icon as={FileText} color="purple.500" />
                    <Heading size="md">Recent Applications</Heading>
                  </HStack>
                  <Button size="sm" variant="ghost" rightIcon={<Icon as={Eye} />}>
                    View All
                  </Button>
                </HStack>
              </CardHeader>
              <CardBody pt={0}>
                <VStack spacing={4} align="stretch">
                  {applications.length === 0 ? (
                    <Box textAlign="center" py={8}>
                      <Icon as={FileText} w={12} h={12} color="gray.300" mb={4} />
                      <Text color="gray.500">No applications yet</Text>
                      <Text fontSize="sm" color="gray.400" mt={2}>
                        Start applying to jobs to see your applications here
                      </Text>
                    </Box>
                  ) : (
                    applications.slice(0, 5).map((application) => (
                      <Box key={application.id} p={4} border="1px" borderColor={borderColor} borderRadius="md">
                        <VStack align="stretch" spacing={3}>
                          <Flex justify="space-between" align="start">
                            <Box flex={1}>
                              <Text fontWeight="semibold" noOfLines={1}>
                                {application.jobs?.title || 'Job Title'}
                              </Text>
                              <Text fontSize="sm" color="gray.500">
                                {application.jobs?.company || 'Company'}
                              </Text>
                            </Box>
                            <Badge colorScheme={getStatusColor(application.status)} variant="subtle">
                              {getStatusLabel(application.status)}
                            </Badge>
                          </Flex>
                          
                          <HStack justify="space-between" fontSize="sm" color="gray.500">
                            <HStack>
                              <Icon as={Calendar} />
                              <Text>Applied {formatDate(application.applied_date)}</Text>
                            </HStack>
                            {application.jobs?.budget && (
                              <Text color="green.600" fontWeight="medium">
                                {formatCurrency(application.jobs.budget, application.jobs.budget_currency || 'USD')}
                              </Text>
                            )}
                          </HStack>
                        </VStack>
                      </Box>
                    ))
                  )}
                </VStack>
              </CardBody>
            </Card>
          </SimpleGrid>

          {/* Profile Completion */}
          <Card bg={cardBg} borderColor={borderColor}>
            <CardHeader>
              <HStack>
                <Icon as={User} color="teal.500" />
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
                    <Icon as={Check} color="green.500" />
                    <Text fontSize="sm">Basic Info Complete</Text>
                  </HStack>
                  <HStack>
                    <Icon as={Check} color="green.500" />
                    <Text fontSize="sm">Portfolio Added</Text>
                  </HStack>
                  <HStack>
                    <Icon as={Clock} color="orange.500" />
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

      {/* Application Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <HStack>
              <Icon as={Send} color="brand.teal" />
              <Text>Apply for Job</Text>
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
                  <Text color="gray.600" mb={3}>
                    {selectedJob.company}
                  </Text>
                  
                  <HStack spacing={4} flexWrap="wrap">
                    <HStack>
                      <Icon as={DollarSign} color="green.500" size="sm" />
                      <Text fontSize="sm" color="green.600">
                        {formatCurrency(selectedJob.budget, selectedJob.budget_currency)}
                      </Text>
                    </HStack>
                    <HStack>
                      <Icon as={MapPin} color="blue.500" size="sm" />
                      <Text fontSize="sm" color="blue.600">
                        {selectedJob.location}
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

                {/* Application Form */}
                <VStack spacing={4} align="stretch">
                  <FormControl isRequired>
                    <FormLabel>Cover Letter</FormLabel>
                    <Textarea
                      value={coverLetter}
                      onChange={(e) => setCoverLetter(e.target.value)}
                      placeholder="Write a compelling cover letter explaining why you're the best fit for this job..."
                      minH="150px"
                      resize="vertical"
                    />
                  </FormControl>
                </VStack>
              </VStack>
            )}
          </ModalBody>

          <ModalFooter>
            <HStack spacing={3}>
              <Button variant="ghost" onClick={onClose}>
                Cancel
              </Button>
              <Button
                colorScheme="brand"
                bg="brand.teal"
                onClick={submitApplication}
                isLoading={applying}
                loadingText="Submitting..."
                leftIcon={<Icon as={Send} />}
                isDisabled={!coverLetter.trim()}
              >
                Submit Application
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};