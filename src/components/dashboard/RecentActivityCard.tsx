import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardBody,
  VStack,
  HStack,
  Text,
  Avatar,
  Badge,
  Icon,
  useColorModeValue,
  Divider,
  Button,
  Spinner,
  useToast,
} from '@chakra-ui/react';
import { 
  MessageCircle, 
  Briefcase, 
  DollarSign, 
  Clock, 
  Star,
  User,
  FileText
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

interface ActivityItem {
  id: string;
  type: 'message' | 'job_posted' | 'application' | 'payment' | 'review' | 'milestone';
  title: string;
  description: string;
  timestamp: string;
  avatar?: string;
  status?: 'success' | 'warning' | 'info' | 'pending';
  amount?: string;
}

interface RecentActivityCardProps {
  userType: 'freelancer' | 'client';
}

export const RecentActivityCard: React.FC<RecentActivityCardProps> = ({ userType }) => {
  const { user } = useAuth();
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const toast = useToast();

  useEffect(() => {
    if (user) {
      fetchActivities();
    }
  }, [user, userType]);

  const fetchActivities = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Fetch all activity data concurrently
      const [
        ordersResult,
        applicationsOrJobsResult,
        reviewsResult
      ] = await Promise.all([
        // Fetch recent orders/payments
        supabase
          .from('orders')
          .select('id, amount, status, created_at')
          .or(
            userType === 'freelancer' 
              ? `freelancer_id.eq.${user.id}` 
              : `client_id.eq.${user.id}`
          )
          .order('created_at', { ascending: false })
          .limit(5),
        
        // Fetch recent job applications (for freelancers) or jobs posted (for clients)
        userType === 'freelancer'
          ? supabase
              .from('job_applications')
              .select('id, status, applied_date, job_id, jobs(title)')
              .eq('user_id', user.id)
              .order('applied_date', { ascending: false })
              .limit(5)
          : supabase
              .from('jobs')
              .select('id, title, posted_date, is_active')
              .eq('client_id', user.id)
              .order('posted_date', { ascending: false })
              .limit(5),
        
        // Fetch recent reviews
        supabase
          .from('reviews')
          .select('id, rating, comment, created_at')
          .or(
            userType === 'freelancer' 
              ? `freelancer_id.eq.${user.id}` 
              : `client_id.eq.${user.id}`
          )
          .order('created_at', { ascending: false })
          .limit(3)
      ]);

      const newActivities: ActivityItem[] = [];

      // Process orders/payments
      if (ordersResult.data) {
        ordersResult.data.forEach(order => {
          newActivities.push({
            id: `order-${order.id}`,
            type: 'payment',
            title: userType === 'freelancer' ? 'Payment received' : 'Payment sent',
            description: `Order #${order.id} - $${order.amount}`,
            timestamp: order.created_at,
            status: order.status === 'completed' ? 'success' : 'pending',
            amount: `$${order.amount}`,
          });
        });
      }

      // Process applications or jobs
      if (applicationsOrJobsResult.data) {
        if (userType === 'freelancer') {
          // Process job applications
          applicationsOrJobsResult.data.forEach((application: any) => {
            newActivities.push({
              id: `application-${application.id}`,
              type: 'application',
              title: getApplicationStatusTitle(application.status),
              description: `Application for: ${application.jobs?.title || 'Job'}`,
              timestamp: application.applied_date,
              status: getApplicationStatusBadge(application.status),
            });
          });
        } else {
          // Process posted jobs
          applicationsOrJobsResult.data.forEach((job: any) => {
            newActivities.push({
              id: `job-${job.id}`,
              type: 'job_posted',
              title: 'Job posted',
              description: job.title,
              timestamp: job.posted_date,
              status: job.is_active ? 'success' : 'info',
            });
          });
        }
      }

      // Process reviews
      if (reviewsResult.data) {
        reviewsResult.data.forEach(review => {
          newActivities.push({
            id: `review-${review.id}`,
            type: 'review',
            title: userType === 'freelancer' ? 'Review received' : 'Review given',
            description: `${review.rating}-star rating: "${review.comment?.substring(0, 50)}..."`,
            timestamp: review.created_at,
            status: 'success',
          });
        });
      }

      // Sort all activities by timestamp and take the most recent ones
      newActivities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      setActivities(newActivities.slice(0, 8));

    } catch (error) {
      console.error('Error fetching activities:', error);
      toast({
        title: 'Error Loading Activities',
        description: 'Failed to load recent activities',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      
      // Fallback to empty activities
      setActivities([]);
    } finally {
      setLoading(false);
    }
  };

  const getApplicationStatusTitle = (status: string) => {
    switch (status) {
      case 'applied': return 'Application submitted';
      case 'in_review': return 'Application under review';
      case 'interview_scheduled': return 'Interview scheduled';
      case 'offer': return 'Job offer received';
      case 'rejected': return 'Application declined';
      case 'withdrawn': return 'Application withdrawn';
      default: return 'Application updated';
    }
  };

  const getApplicationStatusBadge = (status: string): 'success' | 'warning' | 'info' | 'pending' => {
    switch (status) {
      case 'offer': return 'success';
      case 'rejected': return 'warning';
      case 'in_review': case 'interview_scheduled': return 'info';
      default: return 'pending';
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'message': return MessageCircle;
      case 'job_posted': return Briefcase;
      case 'application': return FileText;
      case 'payment': return DollarSign;
      case 'review': return Star;
      case 'milestone': return Clock;
      default: return User;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'message': return 'blue';
      case 'job_posted': return 'purple';
      case 'application': return 'green';
      case 'payment': return 'green';
      case 'review': return 'yellow';
      case 'milestone': return 'teal';
      default: return 'gray';
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'success': return 'green';
      case 'warning': return 'orange';
      case 'info': return 'blue';
      case 'pending': return 'gray';
      default: return 'gray';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const now = new Date();
    const activityTime = new Date(timestamp);
    const diffInHours = Math.abs(now.getTime() - activityTime.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      return `${Math.round(diffInHours * 60)} minutes ago`;
    } else if (diffInHours < 24) {
      return `${Math.round(diffInHours)} hours ago`;
    } else {
      return `${Math.round(diffInHours / 24)} days ago`;
    }
  };

  return (
    <Card bg={cardBg} borderColor={borderColor} boxShadow="lg">
      <CardBody p={6}>
        <VStack spacing={4} align="stretch">
          {/* Header */}
          <HStack justify="space-between" align="center">
            <Text fontSize="lg" fontWeight="bold" color="gray.800">
              Recent Activity
            </Text>
            <Button size="xs" variant="ghost" color="brand.teal">
              View All
            </Button>
          </HStack>

          <Divider />

          {/* Activity List */}
          {loading ? (
            <Box textAlign="center" py={8}>
              <Spinner size="lg" color="brand.teal" />
              <Text mt={4} color="gray.500" fontSize="sm">
                Loading activities...
              </Text>
            </Box>
          ) : activities.length === 0 ? (
            <Box textAlign="center" py={8}>
              <Icon as={FileText} w={12} h={12} color="gray.300" mb={4} />
              <Text color="gray.500" fontSize="sm">
                No recent activity yet
              </Text>
              <Text color="gray.400" fontSize="xs" mt={2}>
                Start working on projects to see activity here
              </Text>
            </Box>
          ) : (
            <VStack spacing={4} align="stretch">
              {activities.map((activity, index) => (
                <Box key={activity.id}>
                  <HStack spacing={3} align="start">
                    {/* Icon */}
                    <Box
                      p={2}
                      bg={`${getActivityColor(activity.type)}.100`}
                      borderRadius="full"
                    >
                      <Icon 
                        as={getActivityIcon(activity.type)} 
                        color={`${getActivityColor(activity.type)}.500`}
                        size="sm"
                      />
                    </Box>

                    {/* Content */}
                    <Box flex={1}>
                      <HStack justify="space-between" align="start">
                        <VStack align="start" spacing={1} flex={1}>
                          <HStack spacing={2} align="center">
                            <Text fontSize="sm" fontWeight="medium" color="gray.800">
                              {activity.title}
                            </Text>
                            {activity.amount && (
                              <Badge colorScheme="green" variant="subtle" fontSize="xs">
                                {activity.amount}
                              </Badge>
                            )}
                            {activity.status && (
                              <Badge 
                                colorScheme={getStatusColor(activity.status)} 
                                variant="subtle" 
                                fontSize="xs"
                              >
                                {activity.status}
                              </Badge>
                            )}
                          </HStack>
                          <Text fontSize="xs" color="gray.500" noOfLines={2}>
                            {activity.description}
                          </Text>
                        </VStack>
                        <Text fontSize="xs" color="gray.400" whiteSpace="nowrap">
                          {formatTimestamp(activity.timestamp)}
                        </Text>
                      </HStack>
                    </Box>
                  </HStack>
                  
                  {index < activities.length - 1 && <Divider mt={4} />}
                </Box>
              ))}
            </VStack>
          )}

          {/* Footer */}
          {activities.length > 0 && (
            <Box p={3} bg="gray.50" borderRadius="md" textAlign="center">
              <Text fontSize="xs" color="gray.500">
                Stay updated with real-time notifications
              </Text>
            </Box>
          )}
        </VStack>
      </CardBody>
    </Card>
  );
};