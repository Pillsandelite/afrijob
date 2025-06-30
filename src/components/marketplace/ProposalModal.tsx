import React, { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  VStack,
  Text,
  Textarea,
  FormControl,
  FormLabel,
  FormHelperText,
  Box,
  HStack,
  Badge,
  Icon,
  Divider,
  useToast,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import { Briefcase, DollarSign, Calendar, MapPin, Send } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

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

interface ProposalModalProps {
  isOpen: boolean;
  onClose: () => void;
  job: Job | null;
  onSuccess: () => void;
}

export const ProposalModal: React.FC<ProposalModalProps> = ({
  isOpen,
  onClose,
  job,
  onSuccess,
}) => {
  const [coverLetter, setCoverLetter] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const toast = useToast();

  const handleSubmit = async () => {
    if (!job || !user) return;

    if (!coverLetter.trim()) {
      toast({
        title: 'Cover Letter Required',
        description: 'Please write a cover letter for your application.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('job_applications')
        .insert({
          user_id: user.id,
          job_id: job.id,
          cover_letter: coverLetter,
          applied_date: new Date().toISOString(),
          status: 'applied',
        });

      if (error) {
        throw error;
      }

      toast({
        title: 'Application Submitted',
        description: 'Your job application has been sent successfully!',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      setCoverLetter('');
      onSuccess();
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
      setIsSubmitting(false);
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

  const formatEmploymentType = (type: string) => {
    return type.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <HStack>
            <Icon as={Briefcase} color="brand.teal" />
            <Text>Apply for Job</Text>
          </HStack>
        </ModalHeader>
        <ModalCloseButton />
        
        <ModalBody>
          {job && (
            <VStack spacing={6} align="stretch">
              {/* Job Summary */}
              <Box>
                <Text fontSize="lg" fontWeight="bold" mb={2}>
                  {job.title}
                </Text>
                <Text color="gray.600" mb={3}>
                  {job.company}
                </Text>
                
                <HStack spacing={4} flexWrap="wrap">
                  <HStack>
                    <Icon as={DollarSign} color="green.500" size="sm" />
                    <Text fontSize="sm" color="green.600">
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

                <HStack mt={2}>
                  <Badge colorScheme="blue" variant="subtle">
                    {formatEmploymentType(job.employment_type)}
                  </Badge>
                  <Badge colorScheme="purple" variant="outline">
                    {job.experience_level.charAt(0).toUpperCase() + job.experience_level.slice(1)} Level
                  </Badge>
                </HStack>
              </Box>

              <Divider />

              {/* Application Form */}
              <VStack spacing={4} align="stretch">
                <Alert status="info" borderRadius="md">
                  <AlertIcon />
                  <Text fontSize="sm">
                    Write a compelling cover letter explaining why you're the best fit for this job.
                  </Text>
                </Alert>

                <FormControl isRequired>
                  <FormLabel>Cover Letter</FormLabel>
                  <Textarea
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    placeholder="Dear Hiring Manager,

I am excited to apply for this position because...

• Highlight your relevant experience
• Explain why you're interested in this specific role
• Mention how you can add value to their project

I look forward to discussing this opportunity further.

Best regards,
[Your Name]"
                    minH="200px"
                    resize="vertical"
                  />
                  <FormHelperText>
                    {coverLetter.length}/1000 characters recommended
                  </FormHelperText>
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
              onClick={handleSubmit}
              isLoading={isSubmitting}
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
  );
};