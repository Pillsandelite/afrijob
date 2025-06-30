import React, { useState } from 'react';
import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  VStack,
  Heading,
  Text,
  Select,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  useToast,
  Card,
  CardBody,
  FormHelperText,
  HStack,
  Icon,
  useColorModeValue,
} from '@chakra-ui/react';
import { Briefcase, DollarSign, Calendar, FileText } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

export const JobPostingForm: React.FC = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    company: '',
    location: '',
    employment_type: 'full_time',
    experience_level: 'mid',
    budget: '',
    budget_currency: 'USD',
    deadline: '',
    skills_required: '',
    requirements: '',
    benefits: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, profile } = useAuth();
  const toast = useToast();
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || profile?.role !== 'client') {
      toast({
        title: 'Access Denied',
        description: 'Only clients can post jobs',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    if (!formData.title || !formData.description || !formData.budget || !formData.deadline) {
      toast({
        title: 'Missing Required Fields',
        description: 'Please fill in all required fields',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const skillsArray = formData.skills_required
        ? formData.skills_required.split(',').map(skill => skill.trim()).filter(Boolean)
        : [];

      const requirementsArray = formData.requirements
        ? formData.requirements.split('\n').filter(req => req.trim())
        : [];

      const benefitsArray = formData.benefits
        ? formData.benefits.split('\n').filter(benefit => benefit.trim())
        : [];

      const { error } = await supabase
        .from('jobs')
        .insert({
          title: formData.title,
          description: formData.description,
          company: formData.company || 'AfriWork Client',
          location: formData.location || 'Remote',
          employment_type: formData.employment_type,
          experience_level: formData.experience_level,
          budget: parseInt(formData.budget),
          budget_currency: formData.budget_currency,
          deadline: new Date(formData.deadline).toISOString(),
          skills_required: skillsArray,
          requirements: requirementsArray,
          benefits: benefitsArray,
          posted_date: new Date().toISOString(),
          client_id: user.id,
          is_active: true,
        });

      if (error) {
        throw error;
      }

      toast({
        title: 'Job Posted Successfully!',
        description: 'Your job posting is now live and visible to freelancers',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      // Reset form
      setFormData({
        title: '',
        description: '',
        company: '',
        location: '',
        employment_type: 'full_time',
        experience_level: 'mid',
        budget: '',
        budget_currency: 'USD',
        deadline: '',
        skills_required: '',
        requirements: '',
        benefits: '',
      });

    } catch (error) {
      console.error('Error posting job:', error);
      toast({
        title: 'Error Posting Job',
        description: 'There was an error posting your job. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user || profile?.role !== 'client') {
    return (
      <Container maxW="4xl" py={8}>
        <Card bg={cardBg} borderColor={borderColor}>
          <CardBody textAlign="center" py={16}>
            <Icon as={Briefcase} w={16} h={16} color="gray.400" mb={4} />
            <Heading size="lg" mb={4} color="gray.600">
              Client Access Required
            </Heading>
            <Text color="gray.500">
              Only registered clients can post job opportunities. Please sign up as a client to access this feature.
            </Text>
          </CardBody>
        </Card>
      </Container>
    );
  }

  return (
    <Container maxW="4xl" py={8}>
      <VStack spacing={8}>
        {/* Header */}
        <Box textAlign="center">
          <Heading size="xl" mb={4} color="gray.800">
            Post a New Job
          </Heading>
          <Text color="gray.600" fontSize="lg">
            Find the perfect freelancer for your project
          </Text>
        </Box>

        {/* Form */}
        <Card w="full" bg={cardBg} borderColor={borderColor} boxShadow="lg">
          <CardBody p={8}>
            <form onSubmit={handleSubmit}>
              <VStack spacing={6}>
                {/* Job Title */}
                <FormControl isRequired>
                  <FormLabel display="flex" alignItems="center" gap={2}>
                    <Icon as={FileText} color="brand.teal" />
                    Job Title
                  </FormLabel>
                  <Input
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="e.g., Senior React Developer"
                    size="lg"
                    bg="white"
                  />
                </FormControl>

                {/* Company and Location */}
                <HStack w="full" spacing={4}>
                  <FormControl>
                    <FormLabel>Company</FormLabel>
                    <Input
                      value={formData.company}
                      onChange={(e) => handleInputChange('company', e.target.value)}
                      placeholder="Your company name"
                      bg="white"
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Location</FormLabel>
                    <Input
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      placeholder="e.g., Remote, Lagos, Nigeria"
                      bg="white"
                    />
                  </FormControl>
                </HStack>

                {/* Employment Type and Experience Level */}
                <HStack w="full" spacing={4}>
                  <FormControl>
                    <FormLabel>Employment Type</FormLabel>
                    <Select
                      value={formData.employment_type}
                      onChange={(e) => handleInputChange('employment_type', e.target.value)}
                      bg="white"
                    >
                      <option value="full_time">Full Time</option>
                      <option value="part_time">Part Time</option>
                      <option value="contract">Contract</option>
                      <option value="internship">Internship</option>
                      <option value="remote">Remote</option>
                    </Select>
                  </FormControl>
                  <FormControl>
                    <FormLabel>Experience Level</FormLabel>
                    <Select
                      value={formData.experience_level}
                      onChange={(e) => handleInputChange('experience_level', e.target.value)}
                      bg="white"
                    >
                      <option value="entry">Entry Level</option>
                      <option value="mid">Mid Level</option>
                      <option value="senior">Senior Level</option>
                      <option value="executive">Executive</option>
                    </Select>
                  </FormControl>
                </HStack>

                {/* Budget and Currency */}
                <HStack w="full" spacing={4}>
                  <FormControl isRequired>
                    <FormLabel display="flex" alignItems="center" gap={2}>
                      <Icon as={DollarSign} color="green.500" />
                      Budget
                    </FormLabel>
                    <NumberInput
                      value={formData.budget}
                      onChange={(value) => handleInputChange('budget', value)}
                      min={0}
                      bg="white"
                    >
                      <NumberInputField placeholder="Enter budget amount" />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  </FormControl>
                  <FormControl w="40%">
                    <FormLabel>Currency</FormLabel>
                    <Select
                      value={formData.budget_currency}
                      onChange={(e) => handleInputChange('budget_currency', e.target.value)}
                      bg="white"
                    >
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="GBP">GBP (£)</option>
                      <option value="NGN">NGN (₦)</option>
                      <option value="KES">KES (KSh)</option>
                      <option value="ZAR">ZAR (R)</option>
                    </Select>
                  </FormControl>
                </HStack>

                {/* Deadline */}
                <FormControl isRequired>
                  <FormLabel display="flex" alignItems="center" gap={2}>
                    <Icon as={Calendar} color="purple.500" />
                    Project Deadline
                  </FormLabel>
                  <Input
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => handleInputChange('deadline', e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    bg="white"
                  />
                  <FormHelperText>
                    When do you need this project completed?
                  </FormHelperText>
                </FormControl>

                {/* Description */}
                <FormControl isRequired>
                  <FormLabel>Job Description</FormLabel>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Describe the project, what you're looking for, and any specific requirements..."
                    rows={6}
                    bg="white"
                  />
                  <FormHelperText>
                    Provide a detailed description to attract the right freelancers
                  </FormHelperText>
                </FormControl>

                {/* Skills Required */}
                <FormControl>
                  <FormLabel>Required Skills</FormLabel>
                  <Input
                    value={formData.skills_required}
                    onChange={(e) => handleInputChange('skills_required', e.target.value)}
                    placeholder="React, Node.js, TypeScript, UI/UX Design"
                    bg="white"
                  />
                  <FormHelperText>
                    Separate skills with commas
                  </FormHelperText>
                </FormControl>

                {/* Requirements */}
                <FormControl>
                  <FormLabel>Additional Requirements</FormLabel>
                  <Textarea
                    value={formData.requirements}
                    onChange={(e) => handleInputChange('requirements', e.target.value)}
                    placeholder="• 3+ years of experience&#10;• Portfolio required&#10;• Available for video calls"
                    rows={4}
                    bg="white"
                  />
                  <FormHelperText>
                    List specific requirements (one per line)
                  </FormHelperText>
                </FormControl>

                {/* Benefits */}
                <FormControl>
                  <FormLabel>Benefits & Perks</FormLabel>
                  <Textarea
                    value={formData.benefits}
                    onChange={(e) => handleInputChange('benefits', e.target.value)}
                    placeholder="• Flexible working hours&#10;• Long-term partnership opportunity&#10;• Performance bonuses"
                    rows={3}
                    bg="white"
                  />
                  <FormHelperText>
                    What makes this opportunity attractive? (one per line)
                  </FormHelperText>
                </FormControl>

                {/* Submit Button */}
                <Button
                  type="submit"
                  size="lg"
                  colorScheme="brand"
                  bg="brand.teal"
                  w="full"
                  isLoading={isSubmitting}
                  loadingText="Posting Job..."
                  _hover={{
                    bg: 'brand.600',
                    transform: 'translateY(-2px)',
                    boxShadow: 'lg',
                  }}
                  transition="all 0.2s"
                >
                  Post Job Opportunity
                </Button>
              </VStack>
            </form>
          </CardBody>
        </Card>
      </VStack>
    </Container>
  );
};