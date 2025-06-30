import React, { useState, useEffect } from 'react';
import {
  Box,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Card,
  CardBody,
  HStack,
  Icon,
  VStack,
  Text,
  Progress,
  Badge,
  useColorModeValue,
  Spinner,
  useToast,
} from '@chakra-ui/react';
import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  Clock,
  Star,
  Briefcase,
  MessageCircle,
  Target
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

interface StatCardProps {
  label: string;
  value: string | number;
  change?: number;
  changeType?: 'increase' | 'decrease';
  icon: any;
  iconColor: string;
  helpText?: string;
  progress?: number;
  badge?: string;
  loading?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  change,
  changeType,
  icon,
  iconColor,
  helpText,
  progress,
  badge,
  loading = false
}) => {
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  return (
    <Card 
      bg={cardBg} 
      borderColor={borderColor}
      _hover={{ 
        transform: 'translateY(-2px)', 
        boxShadow: 'lg' 
      }} 
      transition="all 0.2s"
      cursor="pointer"
    >
      <CardBody p={6}>
        <Stat>
          <HStack justify="space-between" mb={3}>
            <VStack align="start" spacing={1}>
              <StatLabel fontSize="sm" color="gray.500" fontWeight="medium">
                {label}
              </StatLabel>
              {badge && (
                <Badge colorScheme="blue" variant="subtle" fontSize="xs">
                  {badge}
                </Badge>
              )}
            </VStack>
            <Icon as={icon} color={iconColor} boxSize={6} />
          </HStack>
          
          {loading ? (
            <Spinner size="md" color={iconColor} />
          ) : (
            <StatNumber fontSize="2xl" fontWeight="bold" color={iconColor} mb={2}>
              {value}
            </StatNumber>
          )}
          
          {progress !== undefined && !loading && (
            <Box mb={2}>
              <Progress 
                value={progress} 
                colorScheme={iconColor.split('.')[0]} 
                size="sm" 
                borderRadius="full"
              />
            </Box>
          )}
          
          {change !== undefined && !loading && (
            <StatHelpText fontSize="sm" mb={0}>
              <StatArrow type={changeType} />
              {Math.abs(change)}% from last month
            </StatHelpText>
          )}
          
          {helpText && !loading && (
            <Text fontSize="xs" color="gray.500" mt={1}>
              {helpText}
            </Text>
          )}
        </Stat>
      </CardBody>
    </Card>
  );
};

interface QuickStatsGridProps {
  userType: 'freelancer' | 'client';
}

interface StatsData {
  activeProjects: number;
  earnings: number;
  rating: number;
  responseTime: string;
  totalSpent: number;
  freelancersHired: number;
  successRate: number;
  proposalsSent: number;
}

export const QuickStatsGrid: React.FC<QuickStatsGridProps> = ({ userType }) => {
  const { user } = useAuth();
  const [stats, setStats] = useState<StatsData>({
    activeProjects: 0,
    earnings: 0,
    rating: 0,
    responseTime: '0h',
    totalSpent: 0,
    freelancersHired: 0,
    successRate: 0,
    proposalsSent: 0,
  });
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    if (user) {
      fetchStats();
    }
  }, [user, userType]);

  const fetchStats = async () => {
    if (!user) return;

    try {
      setLoading(true);

      if (userType === 'freelancer') {
        await fetchFreelancerStats();
      } else {
        await fetchClientStats();
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
      toast({
        title: 'Error Loading Stats',
        description: 'Failed to load dashboard statistics',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchFreelancerStats = async () => {
    if (!user) return;

    // Fetch all freelancer data concurrently
    const [
      { data: activeGigs, error: gigsError },
      { data: completedOrders, error: ordersError },
      { data: reviews, error: reviewsError },
      { data: applications, error: applicationsError }
    ] = await Promise.all([
      supabase
        .from('gigs')
        .select('id')
        .eq('freelancer_id', user.id)
        .eq('is_active', true),
      supabase
        .from('orders')
        .select('amount')
        .eq('freelancer_id', user.id)
        .eq('status', 'completed'),
      supabase
        .from('reviews')
        .select('rating')
        .eq('freelancer_id', user.id),
      supabase
        .from('job_applications')
        .select('id, status')
        .eq('user_id', user.id)
    ]);

    if (gigsError || ordersError || reviewsError || applicationsError) {
      throw new Error('Failed to fetch freelancer stats');
    }

    const totalEarnings = completedOrders?.reduce((sum, order) => sum + (order.amount || 0), 0) || 0;
    const avgRating = reviews?.length ? 
      reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length : 0;
    const acceptedApplications = applications?.filter(app => app.status === 'offer').length || 0;
    const successRate = applications?.length ? 
      Math.round((acceptedApplications / applications.length) * 100) : 0;

    setStats(prev => ({
      ...prev,
      activeProjects: activeGigs?.length || 0,
      earnings: totalEarnings,
      rating: Math.round(avgRating * 10) / 10,
      proposalsSent: applications?.length || 0,
      successRate,
    }));
  };

  const fetchClientStats = async () => {
    if (!user) return;

    // Fetch all client data concurrently
    const [
      { data: activeJobs, error: jobsError },
      { data: orders, error: ordersError },
      { data: reviews, error: reviewsError }
    ] = await Promise.all([
      supabase
        .from('jobs')
        .select('id')
        .eq('client_id', user.id)
        .eq('is_active', true),
      supabase
        .from('orders')
        .select('amount, freelancer_id')
        .eq('client_id', user.id),
      supabase
        .from('reviews')
        .select('rating')
        .eq('client_id', user.id)
    ]);

    if (jobsError || ordersError || reviewsError) {
      throw new Error('Failed to fetch client stats');
    }

    const totalSpent = orders?.reduce((sum, order) => sum + (order.amount || 0), 0) || 0;
    const uniqueFreelancers = new Set(orders?.map(order => order.freelancer_id)).size;
    const avgRating = reviews?.length ? 
      reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length : 0;

    setStats(prev => ({
      ...prev,
      activeProjects: activeJobs?.length || 0,
      totalSpent,
      freelancersHired: uniqueFreelancers,
      rating: Math.round(avgRating * 10) / 10,
    }));
  };

  const freelancerStats = [
    {
      label: 'Active Projects',
      value: stats.activeProjects,
      change: 50,
      changeType: 'increase' as const,
      icon: Briefcase,
      iconColor: 'brand.teal',
      helpText: 'Projects in progress',
      loading
    },
    {
      label: 'Total Earnings',
      value: `$${stats.earnings.toLocaleString()}`,
      change: 12,
      changeType: 'increase' as const,
      icon: DollarSign,
      iconColor: 'green.500',
      helpText: 'All time earnings',
      loading
    },
    {
      label: 'Average Rating',
      value: stats.rating > 0 ? stats.rating.toFixed(1) : '0.0',
      icon: Star,
      iconColor: 'yellow.500',
      progress: stats.rating * 20,
      helpText: 'Based on client reviews',
      loading
    },
    {
      label: 'Response Time',
      value: '< 2h',
      icon: Clock,
      iconColor: 'blue.500',
      badge: 'Fast',
      helpText: 'Average response time',
      loading: false // Static for now
    },
    {
      label: 'Proposals Sent',
      value: stats.proposalsSent,
      change: 20,
      changeType: 'increase' as const,
      icon: MessageCircle,
      iconColor: 'purple.500',
      helpText: 'Job applications sent',
      loading
    },
    {
      label: 'Success Rate',
      value: `${stats.successRate}%`,
      icon: Target,
      iconColor: 'green.500',
      progress: stats.successRate,
      helpText: 'Proposal acceptance rate',
      loading
    }
  ];

  const clientStats = [
    {
      label: 'Active Projects',
      value: stats.activeProjects,
      change: 25,
      changeType: 'increase' as const,
      icon: Briefcase,
      iconColor: 'maroon.500',
      helpText: 'Projects in progress',
      loading
    },
    {
      label: 'Total Spent',
      value: `$${stats.totalSpent.toLocaleString()}`,
      change: 35,
      changeType: 'increase' as const,
      icon: DollarSign,
      iconColor: 'green.500',
      helpText: 'Lifetime spending',
      loading
    },
    {
      label: 'Freelancers Hired',
      value: stats.freelancersHired,
      icon: Users,
      iconColor: 'blue.500',
      helpText: 'Unique collaborations',
      loading
    },
    {
      label: 'Average Rating Given',
      value: stats.rating > 0 ? stats.rating.toFixed(1) : '0.0',
      icon: Star,
      iconColor: 'yellow.500',
      progress: stats.rating * 20,
      helpText: 'Your satisfaction score',
      loading
    },
    {
      label: 'Response Rate',
      value: '95%',
      icon: MessageCircle,
      iconColor: 'green.500',
      progress: 95,
      helpText: 'Message response rate',
      loading: false // Static for now
    },
    {
      label: 'Project Success',
      value: '89%',
      icon: Target,
      iconColor: 'green.500',
      progress: 89,
      helpText: 'Completed successfully',
      loading: false // Static for now
    }
  ];

  const statsToShow = userType === 'freelancer' ? freelancerStats : clientStats;

  return (
    <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
      {statsToShow.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </SimpleGrid>
  );
};