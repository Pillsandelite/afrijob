import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  Card,
  CardBody,
  VStack,
  HStack,
  Button,
  Badge,
  Icon,
  useToast,
  Spinner,
  Center,
  useColorModeValue,
  Divider,
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
  Building,
  FileText
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { ProposalModal } from './ProposalModal';

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

export const JobFeed: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user, profile } = useAuth();
  const toast = useToast();
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('is_active', true)
        .order('posted_date', { ascending: false });

      if (error) {
        throw error;
      }

      setJobs(data || []);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      toast({
        title: 'Error Loading Jobs',
        description: 'Failed to load job postings. Please refresh the page.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApplyClick = (job: Job) => {
    if (!user) {
      toast({
        title: 'Please Sign In',
        description: 'You need to be signed in to apply for jobs',
        status: 'warning',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    if (profile?.user_type !== 'freelancer') {
      toast({
        title: 'Freelancer Account Required',
        description: 'Only freelancers can apply for jobs',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    setSelectedJob(job);
    setIsModalOpen(true);
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

  const getEmploymentTypeColor = (type: string) => {
    const colors: { [key: string]: string } = {
      full_time: 'green',
      part_time: 'blue',
      contract: 'purple',
      internship: 'orange',
      remote: 'teal'
    };
    return colors[type] || 'gray';
  };

  const getExperienceLevelColor = (level: string) => {
    const colors: { [key: string]: string } = {
      entry: 'green',
      mid: 'blue',
      senior: 'purple',
      executive: 'red'
    };
    return colors[level] || 'gray';
  };

  const formatEmploymentType = (type: string) => {
    return type.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const formatExperienceLevel = (level: string) => {
    return level.charAt(0).toUpperCase() + level.slice(1) + ' Level';
  };

  if (loading) {
    return (
      <Center h="50vh">
        <VStack spacing={4}>
          <Spinner size="xl" color="brand.teal" thickness="4px" />
          <Text color="gray.500">Loading job opportunities...</Text>
        </VStack>
      </Center>
    );
  }

  return (
    <Container maxW="6xl" py={8}>
      <VStack spacing={8}>
        {/* Header */}
        <Box textAlign="center">
          <Heading size="xl" mb={4} color="gray.800">
            Available Job Opportunities
          </Heading>
          <Text color="gray.600" fontSize="lg">
            Discover projects that match your skills and expertise
          </Text>
          <HStack justify="center" mt={4}>
            <Icon as={Briefcase} color="brand.teal" />
            <Text color="gray.500">
              {jobs.length} active {jobs.length === 1 ? 'opportunity' : 'opportunities'}
            </Text>
          </HStack>
        </Box>

        {/* Jobs Grid */}
        {jobs.length === 0 ? (
          <Card bg={cardBg} borderColor={borderColor} w="full">
            <CardBody textAlign="center" py={16}>
              <Icon as={FileText} w={16} h={16} color="gray.400" mb={4} />
              <Heading size="lg" mb={4} color="gray.600">
                No Jobs Available
              </Heading>
              <Text color="gray.500">
                Check back soon for new opportunities or create an alert to be notified.
              </Text>
            </CardBody>
          </Card>
        ) : (
          <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6} w="full">
            {jobs.map((job) => (
              <Card
                key={job.id}
                bg={cardBg}
                borderColor={borderColor}
                boxShadow="md"
                _hover={{
                  transform: 'translateY(-4px)',
                  boxShadow: 'xl',
                }}
                transition="all 0.3s"
                h="fit-content"
              >
                <CardBody p={6}>
                  <VStack align="stretch" spacing={4}>
                    {/* Job Header */}
                    <Box>
                      <HStack justify="space-between" align="start" mb={2}>
                        <VStack align="start" spacing={1} flex={1}>
                          <Heading size="md" color="gray.800" noOfLines={2}>
                            {job.title}
                          </Heading>
                          <HStack>
                            <Icon as={Building} color="gray.500" size="sm" />
                            <Text color="gray.600" fontSize="sm">
                              {job.company}
                            </Text>
                          </HStack>
                        </VStack>
                        <VStack spacing={2} align="end">
                          <Badge
                            colorScheme={getEmploymentTypeColor(job.employment_type)}
                            variant="subtle"
                            fontSize="xs"
                          >
                            {formatEmploymentType(job.employment_type)}
                          </Badge>
                          <Badge
                            colorScheme={getExperienceLevelColor(job.experience_level)}
                            variant="outline"
                            fontSize="xs"
                          >
                            {formatExperienceLevel(job.experience_level)}
                          </Badge>
                        </VStack>
                      </HStack>

                      {/* Job Details */}
                      <HStack spacing={4} mb={3} flexWrap="wrap">
                        <HStack>
                          <Icon as={DollarSign} color="green.500" size="sm" />
                          <Text fontSize="sm" fontWeight="medium" color="green.600">
                            {formatCurrency(job.budget, job.budget_currency)}
                          </Text>
                        </HStack>
                        <HStack>
                          <Icon as={MapPin} color="blue.500" size="sm" />
                          <Text fontSize="sm" color="blue.600">
                            {job.location}
                          </Text>
                        </HStack>
                        <HStack>
                          <Icon as={Calendar} color="purple.500" size="sm" />
                          <Text fontSize="sm" color="purple.600">
                            Due {formatDate(job.deadline)}
                          </Text>
                        </HStack>
                      </HStack>
                    </Box>

                    <Divider />

                    {/* Description */}
                    <Text color="gray.600" fontSize="sm" noOfLines={3}>
                      {job.description}
                    </Text>

                    {/* Skills */}
                    {job.skills_required && job.skills_required.length > 0 && (
                      <Box>
                        <Text fontSize="xs" color="gray.500" mb={2} fontWeight="medium">
                          Required Skills:
                        </Text>
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
                      </Box>
                    )}

                    <Divider />

                    {/* Footer */}
                    <HStack justify="space-between" align="center">
                      <HStack>
                        <Icon as={Clock} color="gray.400" size="sm" />
                        <Text fontSize="xs" color="gray.500">
                          Posted {formatDate(job.posted_date)}
                        </Text>
                      </HStack>
                      
                      <Button
                        size="sm"
                        colorScheme="brand"
                        bg="brand.teal"
                        onClick={() => handleApplyClick(job)}
                        leftIcon={<Icon as={User} />}
                        _hover={{
                          bg: 'brand.600',
                          transform: 'translateY(-1px)',
                        }}
                        transition="all 0.2s"
                        isDisabled={profile?.user_type !== 'freelancer'}
                      >
                        Apply Now
                      </Button>
                    </HStack>
                  </VStack>
                </CardBody>
              </Card>
            ))}
          </SimpleGrid>
        )}
      </VStack>

      {/* Proposal Modal */}
      <ProposalModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedJob(null);
        }}
        job={selectedJob}
        onSuccess={() => {
          setIsModalOpen(false);
          setSelectedJob(null);
        }}
      />
    </Container>
  );
};