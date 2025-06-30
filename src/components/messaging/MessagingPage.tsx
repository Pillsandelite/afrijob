import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  useColorModeValue,
} from '@chakra-ui/react';
import { useAuth } from '../../contexts/AuthContext';
import { DashboardNavbar } from '../shared/DashboardNavbar';
import { ChatSidebar } from './ChatSidebar';
import { ChatWindow } from './ChatWindow';
import { EmptyChatState } from './EmptyChatState';

export interface ChatParticipant {
  id: string;
  first_name: string;
  last_name: string;
  avatar_url?: string;
  role: 'freelancer' | 'client';
  is_online?: boolean;
  last_seen?: string;
}

export interface Chat {
  id: string;
  participants: ChatParticipant[];
  last_message?: {
    content: string;
    sender_name: string;
    created_at: string;
    is_read: boolean;
  };
  unread_count: number;
  created_at: string;
  updated_at: string;
  project_context?: {
    project_id: string;
    project_title: string;
  };
}

export const MessagingPage: React.FC = () => {
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const { profile } = useAuth();
  const bgColor = useColorModeValue('gray.50', 'gray.900');

  useEffect(() => {
    // Load user's chats
    loadChats();
  }, []);

  const loadChats = async () => {
    try {
      setLoading(true);
      // TODO: Replace with real Supabase query
      // Simulating chat data for now
      const mockChats: Chat[] = [
        {
          id: '1',
          participants: [
            {
              id: 'user1',
              first_name: 'Sarah',
              last_name: 'Wilson',
              avatar_url: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1',
              role: 'client',
              is_online: true,
            },
            {
              id: profile?.id || 'current', 
              first_name: profile?.first_name || 'You',
              last_name: profile?.last_name || '',
              avatar_url: profile?.avatar_url,
              role: profile?.role || 'freelancer',
              is_online: true,
            }
          ],
          last_message: {
            content: 'Looking forward to seeing the initial designs!',
            sender_name: 'Sarah Wilson',
            created_at: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 minutes ago
            is_read: false,
          },
          unread_count: 2,
          created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
          updated_at: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
          project_context: {
            project_id: 'proj1',
            project_title: 'E-commerce Website Design'
          }
        },
        {
          id: '2',
          participants: [
            {
              id: 'user2',
              first_name: 'Michael',
              last_name: 'Chen',
              avatar_url: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1',
              role: 'client',
              is_online: false,
              last_seen: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
            },
            {
              id: profile?.id || 'current',
              first_name: profile?.first_name || 'You',
              last_name: profile?.last_name || '',
              avatar_url: profile?.avatar_url,
              role: profile?.role || 'freelancer',
              is_online: true,
            }
          ],
          last_message: {
            content: 'Thanks for the quick turnaround on the React components',
            sender_name: 'You',
            created_at: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(), // 4 hours ago
            is_read: true,
          },
          unread_count: 0,
          created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), // 5 days ago
          updated_at: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
          project_context: {
            project_id: 'proj2',
            project_title: 'React Dashboard Development'
          }
        },
        {
          id: '3',
          participants: [
            {
              id: 'user3',
              first_name: 'Emma',
              last_name: 'Rodriguez',
              avatar_url: 'https://images.pexels.com/photos/762020/pexels-photo-762020.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1',
              role: 'client',
              is_online: true,
            },
            {
              id: profile?.id || 'current',
              first_name: profile?.first_name || 'You',
              last_name: profile?.last_name || '',
              avatar_url: profile?.avatar_url,
              role: profile?.role || 'freelancer',
              is_online: true,
            }
          ],
          last_message: {
            content: 'Can we schedule a call to discuss the project requirements?',
            sender_name: 'Emma Rodriguez',
            created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
            is_read: true,
          },
          unread_count: 0,
          created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), // 3 days ago
          updated_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
          project_context: {
            project_id: 'proj3',
            project_title: 'Mobile App UI/UX Design'
          }
        }
      ];
      
      setChats(mockChats);
    } catch (error) {
      console.error('Error loading chats:', error);
    } finally {
      setLoading(false);
    }
  };

  const selectedChat = chats.find(chat => chat.id === selectedChatId);

  return (
    <Box minH="100vh" bg={bgColor}>
      <DashboardNavbar />
      
      <Container maxW="8xl" py={0}>
        <Grid
          templateColumns="350px 1fr"
          h="calc(100vh - 64px)" // Subtract navbar height
          gap={0}
        >
          {/* Chat Sidebar */}
          <ChatSidebar
            chats={chats}
            selectedChatId={selectedChatId}
            onChatSelect={setSelectedChatId}
            loading={loading}
            currentUserId={profile?.id || ''}
          />

          {/* Chat Window */}
          {selectedChat ? (
            <ChatWindow
              chat={selectedChat}
              currentUserId={profile?.id || ''}
              currentUserName={profile?.name || 'You'}
              onNewMessage={() => loadChats()} // Refresh chats when new message is sent
            />
          ) : (
            <EmptyChatState />
          )}
        </Grid>
      </Container>
    </Box>
  );
};