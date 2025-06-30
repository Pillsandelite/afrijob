import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardBody,
  VStack,
  HStack,
  Text,
  Progress,
  Button,
  Icon,
  Badge,
  useColorModeValue,
  List,
  ListItem,
  ListIcon,
  useToast,
} from '@chakra-ui/react';
import { CheckCircle, Circle, User, Briefcase, FileText, Star } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

interface ProfileStep {
  id: string;
  label: string;
  icon: any;
  completed: boolean;
  description: string;
}

interface ProfileData {
  hasProfilePhoto: boolean;
  hasDescription: boolean;
  hasPortfolio: boolean;
  hasExperience: boolean;
  isVerified: boolean;
}

export const ProfileCompletionCard: React.FC = () => {
  const { user, profile } = useAuth();
  const [profileData, setProfileData] = useState<ProfileData>({
    hasProfilePhoto: false,
    hasDescription: false,
    hasPortfolio: false,
    hasExperience: false,
    isVerified: false,
  });
  const [loading, setLoading] = useState(true);
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const toast = useToast();

  useEffect(() => {
    if (user && profile) {
      fetchProfileData();
    }
  }, [user, profile]);

  const fetchProfileData = async () => {
    if (!user || !profile) return;

    try {
      setLoading(true);

      // Check for profile photo
      const hasProfilePhoto = !!profile.avatar_url;

      // Check for profile description based on role
      let hasDescription = false;
      if (profile.role === 'freelancer') {
        const { data: freelancerProfile } = await supabase
          .from('freelancer_profiles')
          .select('description')
          .eq('user_id', user.id)
          .maybeSingle();
        
        hasDescription = !!(freelancerProfile?.description?.trim());
      } else {
        const { data: clientProfile } = await supabase
          .from('client_profiles')
          .select('company_description')
          .eq('user_id', user.id)
          .maybeSingle();
        
        hasDescription = !!(clientProfile?.company_description?.trim());
      }

      // Check for portfolio items or experience
      const { data: portfolioItems } = await supabase
        .from('portfolio_items')
        .select('id')
        .eq('user_id', user.id)
        .limit(1);

      const { data: experiences } = await supabase
        .from('experiences')
        .select('id')
        .eq('user_id', user.id)
        .limit(1);

      const hasPortfolio = !!(portfolioItems?.length);
      const hasExperience = !!(experiences?.length);

      // Check verification status
      const isVerified = !!profile.is_verified;

      setProfileData({
        hasProfilePhoto,
        hasDescription,
        hasPortfolio,
        hasExperience,
        isVerified,
      });

    } catch (error) {
      console.error('Error fetching profile data:', error);
      toast({
        title: 'Error Loading Profile Data',
        description: 'Unable to check profile completion status',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  if (!profile || loading) return null;

  const steps: ProfileStep[] = [
    {
      id: 'basic-info',
      label: 'Basic Information',
      icon: User,
      completed: !!(profile.first_name && profile.last_name),
      description: 'Name, email, and contact details'
    },
    {
      id: 'profile-photo',
      label: 'Profile Photo',
      icon: User,
      completed: profileData.hasProfilePhoto,
      description: 'Professional profile picture'
    },
    {
      id: 'bio-skills', 
      label: profile.role === 'freelancer' ? 'Bio & Skills' : 'Company Info',
      icon: FileText,
      completed: profileData.hasDescription,
      description: profile.role === 'freelancer'
        ? 'Professional bio and skill set' 
        : 'Company description and requirements'
    },
    {
      id: 'portfolio',
      label: profile.role === 'freelancer' ? 'Portfolio' : 'Past Projects',
      icon: Briefcase,
      completed: profileData.hasPortfolio || profileData.hasExperience,
      description: profile.role === 'freelancer'
        ? 'Showcase your best work'
        : 'Previous successful projects'
    },
    {
      id: 'verification',
      label: 'Account Verification',
      icon: Star,
      completed: profileData.isVerified,
      description: 'Verify your identity and skills'
    }
  ];

  const completedSteps = steps.filter(step => step.completed).length;
  const completionPercentage = Math.round((completedSteps / steps.length) * 100);

  if (completionPercentage === 100) {
    return null; // Don't show if profile is complete
  }

  return (
    <Card bg={cardBg} borderColor={borderColor} boxShadow="lg">
      <CardBody p={6}>
        <VStack spacing={4} align="stretch">
          {/* Header */}
          <HStack justify="space-between" align="start">
            <VStack align="start" spacing={1}>
              <Text fontSize="lg" fontWeight="bold" color="gray.800">
                Complete Your Profile
              </Text>
              <Text fontSize="sm" color="gray.500">
                {completedSteps} of {steps.length} steps completed
              </Text>
            </VStack>
            <Badge 
              colorScheme={completionPercentage >= 60 ? 'green' : 'orange'} 
              variant="subtle"
              fontSize="sm"
              px={3}
              py={1}
            >
              {completionPercentage}%
            </Badge>
          </HStack>

          {/* Progress Bar */}
          <Box>
            <Progress 
              value={completionPercentage} 
              colorScheme={completionPercentage >= 60 ? 'green' : 'orange'}
              size="lg" 
              borderRadius="full"
              bg="gray.100"
            />
          </Box>

          {/* Steps List */}
          <List spacing={3}>
            {steps.slice(0, 3).map((step) => (
              <ListItem key={step.id}>
                <HStack spacing={3} align="start">
                  <ListIcon 
                    as={step.completed ? CheckCircle : Circle} 
                    color={step.completed ? 'green.500' : 'gray.400'}
                    mt={0.5}
                  />
                  <Box flex={1}>
                    <HStack justify="space-between" align="center">
                      <VStack align="start" spacing={0}>
                        <Text 
                          fontSize="sm" 
                          fontWeight="medium"
                          color={step.completed ? 'gray.600' : 'gray.800'}
                          textDecoration={step.completed ? 'line-through' : 'none'}
                        >
                          {step.label}
                        </Text>
                        <Text fontSize="xs" color="gray.500">
                          {step.description}
                        </Text>
                      </VStack>
                      {!step.completed && (
                        <Icon as={step.icon} color="brand.teal" size="sm" />
                      )}
                    </HStack>
                  </Box>
                </HStack>
              </ListItem>
            ))}
          </List>

          {/* Action Button */}
          <Button
            size="sm"
            colorScheme="brand"
            bg="brand.teal"
            _hover={{
              bg: 'brand.600',
              transform: 'translateY(-1px)',
            }}
            transition="all 0.2s"
          >
            Complete Profile
          </Button>

          {/* Benefits */}
          <Box p={3} bg="blue.50" borderRadius="md" border="1px" borderColor="blue.100">
            <Text fontSize="xs" color="blue.700" fontWeight="medium" mb={1}>
              Why complete your profile?
            </Text>
            <Text fontSize="xs" color="blue.600">
              {profile.role === 'freelancer'
                ? '• Get 3x more job invitations • Build trust with clients • Improve search ranking'
                : '• Attract better freelancers • Build credibility • Get priority support'
              }
            </Text>
          </Box>
        </VStack>
      </CardBody>
    </Card>
  );
};