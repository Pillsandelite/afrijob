import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Avatar,
  Input,
  Button,
  Icon,
  useColorModeValue,
  Textarea,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  AvatarBadge,
  Badge,
  Tooltip,
  useToast,
  Spinner,
} from '@chakra-ui/react';
import { 
  Send, 
  Paperclip, 
  MoreVertical, 
  Phone, 
  Video, 
  Info,
  Smile,
  Image as ImageIcon,
  FileText,
  Download
} from 'lucide-react';
import { Chat } from './MessagingPage';
import { MessageBubble } from './MessageBubble';
import { TypingIndicator } from './TypingIndicator';

interface Message {
  id: string;
  sender_id: string;
  sender_name: string;
  sender_avatar?: string;
  content: string;
  translated_content?: string;
  original_language?: string;
  message_type: 'text' | 'file' | 'image';
  file_url?: string;
  file_name?: string;
  file_size?: number;
  created_at: string;
  is_read: boolean;
  reactions?: {
    emoji: string;
    users: string[];
  }[];
}

interface ChatWindowProps {
  chat: Chat;
  currentUserId: string;
  currentUserName: string;
  onNewMessage: () => void;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  chat,
  currentUserId,
  currentUserName,
  onNewMessage,
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [otherUserTyping, setOtherUserTyping] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const toast = useToast();

  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const chatBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  const otherParticipant = chat.participants.find(p => p.id !== currentUserId);

  useEffect(() => {
    loadMessages();
  }, [chat.id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadMessages = async () => {
    try {
      setLoading(true);
      // TODO: Replace with real Supabase query
      // Simulating message data for now
      const mockMessages: Message[] = [
        {
          id: '1',
          sender_id: otherParticipant?.id || 'other',
          sender_name: otherParticipant?.name || 'Client',
          sender_avatar: otherParticipant?.avatar_url,
          content: 'Hi! I reviewed your portfolio and I\'m impressed with your work. I\'d like to discuss the e-commerce project with you.',
          message_type: 'text',
          created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
          is_read: true,
        },
        {
          id: '2',
          sender_id: currentUserId,
          sender_name: currentUserName,
          content: 'Thank you! I\'m excited about this opportunity. Could you tell me more about your specific requirements?',
          message_type: 'text',
          created_at: new Date(Date.now() - 1000 * 60 * 60 * 2 + 1000 * 60 * 5).toISOString(),
          is_read: true,
        },
        {
          id: '3',
          sender_id: otherParticipant?.id || 'other',
          sender_name: otherParticipant?.name || 'Client',
          sender_avatar: otherParticipant?.avatar_url,
          content: 'Sure! I need a modern e-commerce website for selling handcrafted jewelry. The site should have product catalog, shopping cart, payment integration, and admin panel.',
          message_type: 'text',
          created_at: new Date(Date.now() - 1000 * 60 * 60 * 2 + 1000 * 60 * 10).toISOString(),
          is_read: true,
        },
        {
          id: '4',
          sender_id: otherParticipant?.id || 'other',
          sender_name: otherParticipant?.name || 'Client',
          sender_avatar: otherParticipant?.avatar_url,
          content: 'I\'ve attached some inspiration images and a detailed brief.',
          message_type: 'file',
          file_url: '#',
          file_name: 'Project_Brief_v2.pdf',
          file_size: 2456789,
          created_at: new Date(Date.now() - 1000 * 60 * 60 * 2 + 1000 * 60 * 12).toISOString(),
          is_read: true,
        },
        {
          id: '5',
          sender_id: currentUserId,
          sender_name: currentUserName,
          content: 'Perfect! This gives me a clear picture. Based on your requirements, I can deliver a fully responsive e-commerce solution using React/Next.js with Stripe integration. The timeline would be 3-4 weeks. Would you like me to prepare a detailed proposal?',
          message_type: 'text',
          created_at: new Date(Date.now() - 1000 * 60 * 60 * 1).toISOString(),
          is_read: true,
        },
        {
          id: '6',
          sender_id: otherParticipant?.id || 'other',
          sender_name: otherParticipant?.name || 'Client',
          sender_avatar: otherParticipant?.avatar_url,
          content: 'Yes, that sounds great! Please send me the proposal. Also, what\'s your availability for a quick call this week?',
          message_type: 'text',
          created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
          is_read: true,
        },
        {
          id: '7',
          sender_id: otherParticipant?.id || 'other',
          sender_name: otherParticipant?.name || 'Client',
          sender_avatar: otherParticipant?.avatar_url,
          content: 'Looking forward to seeing the initial designs!',
          message_type: 'text',
          created_at: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
          is_read: false,
        },
      ];
      
      setMessages(mockMessages);
    } catch (error) {
      console.error('Error loading messages:', error);
      toast({
        title: 'Error Loading Messages',
        description: 'Failed to load chat messages. Please refresh.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    setSending(true);
    try {
      const messageToSend = newMessage.trim();
      setNewMessage('');

      // TODO: Replace with real Supabase insert
      const newMsg: Message = {
        id: Date.now().toString(),
        sender_id: currentUserId,
        sender_name: currentUserName,
        content: messageToSend,
        message_type: 'text',
        created_at: new Date().toISOString(),
        is_read: false,
      };

      setMessages(prev => [...prev, newMsg]);
      onNewMessage();

      // Simulate other user typing response after a short delay
      setTimeout(() => {
        setOtherUserTyping(true);
        setTimeout(() => {
          setOtherUserTyping(false);
        }, 2000);
      }, 1000);

    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: 'Error Sending Message',
        description: 'Failed to send message. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Box bg={chatBg} h="full" display="flex" flexDirection="column">
      {/* Chat Header */}
      <Box
        p={4}
        borderBottom="1px"
        borderColor={borderColor}
        bg={chatBg}
      >
        <HStack justify="space-between">
          <HStack spacing={3}>
            <Avatar
              size="sm"
              name={otherParticipant?.name}
              src={otherParticipant?.avatar_url}
            >
              {otherParticipant?.is_online && (
                <AvatarBadge boxSize="1em" bg="green.500" />
              )}
            </Avatar>
            
            <VStack align="start" spacing={0}>
              <Text fontWeight="semibold" fontSize="sm">
                {otherParticipant?.name}
              </Text>
              <HStack spacing={2}>
                <Badge
                  size="sm"
                  colorScheme={otherParticipant?.user_type === 'client' ? 'blue' : 'teal'}
                  variant="subtle"
                >
                  {otherParticipant?.user_type}
                </Badge>
                <Text fontSize="xs" color={otherParticipant?.is_online ? 'green.500' : 'gray.500'}>
                  {otherParticipant?.is_online ? 'Online' : 'Offline'}
                </Text>
              </HStack>
            </VStack>

            {chat.project_context && (
              <Box ml={4} p={2} bg="blue.50" borderRadius="md" border="1px" borderColor="blue.200">
                <Text fontSize="xs" color="blue.700" fontWeight="medium">
                  📁 {chat.project_context.project_title}
                </Text>
              </Box>
            )}
          </HStack>

          <HStack spacing={2}>
            <Tooltip label="Voice Call">
              <Button size="sm" variant="ghost" leftIcon={<Phone size={16} />}>
              </Button>
            </Tooltip>
            <Tooltip label="Video Call">
              <Button size="sm" variant="ghost" leftIcon={<Video size={16} />}>
              </Button>
            </Tooltip>
            <Menu>
              <MenuButton as={Button} size="sm" variant="ghost">
                <MoreVertical size={16} />
              </MenuButton>
              <MenuList>
                <MenuItem icon={<Info size={16} />}>
                  Chat Info
                </MenuItem>
                <MenuItem icon={<FileText size={16} />}>
                  Shared Files
                </MenuItem>
              </MenuList>
            </Menu>
          </HStack>
        </HStack>
      </Box>

      {/* Messages Area */}
      <VStack
        flex={1}
        p={4}
        spacing={4}
        align="stretch"
        overflowY="auto"
        bg={bgColor}
      >
        {loading ? (
          <Box textAlign="center" py={8}>
            <Spinner size="lg" color="brand.teal" />
            <Text mt={4} color="gray.500" fontSize="sm">
              Loading messages...
            </Text>
          </Box>
        ) : (
          <>
            {messages.map((message, index) => (
              <MessageBubble
                key={message.id}
                message={message}
                isOwnMessage={message.sender_id === currentUserId}
                showAvatar={
                  index === 0 || 
                  messages[index - 1].sender_id !== message.sender_id
                }
                formatFileSize={formatFileSize}
              />
            ))}
            
            {otherUserTyping && (
              <TypingIndicator
                firstName={otherParticipant?.first_name || 'User'}
                lastName={otherParticipant?.last_name}
                avatar={otherParticipant?.avatar_url}
              />
            )}
            
            <div ref={messagesEndRef} />
          </>
        )}
      </VStack>

      {/* Message Input */}
      <Box
        p={4}
        borderTop="1px"
        borderColor={borderColor}
        bg={chatBg}
      >
        <HStack spacing={3}>
          <Button size="sm" variant="ghost">
            <Paperclip size={16} />
          </Button>
          
          <Box flex={1}>
            <Textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              size="sm"
              resize="none"
              rows={1}
              maxRows={4}
              bg="white"
              border="1px"
              borderColor={borderColor}
              _focus={{
                borderColor: 'brand.teal',
                boxShadow: '0 0 0 1px var(--chakra-colors-brand-teal)',
              }}
            />
          </Box>

          <Button size="sm" variant="ghost">
            <Smile size={16} />
          </Button>
          
          <Button
            size="sm"
            colorScheme="brand"
            bg="brand.teal"
            onClick={sendMessage}
            isLoading={sending}
            isDisabled={!newMessage.trim()}
            _hover={{ bg: 'brand.600' }}
          >
            <Send size={16} />
          </Button>
        </HStack>
      </Box>
    </Box>
  );
};