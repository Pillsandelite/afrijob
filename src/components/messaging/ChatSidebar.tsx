import React, { useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Avatar,
  Badge,
  Input,
  InputGroup,
  InputLeftElement,
  Spinner,
  Button,
  Icon,
  useColorModeValue,
  Divider,
  AvatarBadge,
  Tooltip,
} from '@chakra-ui/react';
import { Search, MessageCircle, Plus, Filter } from 'lucide-react';
import { Chat } from './MessagingPage';

interface ChatSidebarProps {
  chats: Chat[];
  selectedChatId: string | null;
  onChatSelect: (chatId: string) => void;
  loading: boolean;
  currentUserId: string;
}

export const ChatSidebar: React.FC<ChatSidebarProps> = ({
  chats,
  selectedChatId,
  onChatSelect,
  loading,
  currentUserId,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'unread' | 'online'>('all');
  
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const selectedBg = useColorModeValue('brand.50', 'brand.900');
  const hoverBg = useColorModeValue('gray.50', 'gray.700');

  const formatLastMessageTime = (timestamp: string) => {
    const now = new Date();
    const messageTime = new Date(timestamp);
    const diffInHours = Math.abs(now.getTime() - messageTime.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      return `${Math.round(diffInHours * 60)}m ago`;
    } else if (diffInHours < 24) {
      return `${Math.round(diffInHours)}h ago`;
    } else {
      return messageTime.toLocaleDateString();
    }
  };

  const getOtherParticipant = (chat: Chat) => {
    return chat.participants.find(p => p.id !== currentUserId);
  };

  const filteredChats = chats
    .filter(chat => {
      const otherParticipant = getOtherParticipant(chat);
      const matchesSearch = !searchQuery || 
        `${otherParticipant?.first_name} ${otherParticipant?.last_name}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
        chat.project_context?.project_title.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesFilter = filter === 'all' || 
        (filter === 'unread' && chat.unread_count > 0) ||
        (filter === 'online' && otherParticipant?.is_online);
      
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());

  return (
    <Box
      bg={bgColor}
      borderRight="1px"
      borderColor={borderColor}
      h="full"
      overflow="hidden"
      display="flex"
      flexDirection="column"
    >
      {/* Header */}
      <Box p={4} borderBottom="1px" borderColor={borderColor}>
        <HStack justify="space-between" mb={4}>
          <HStack>
            <Icon as={MessageCircle} color="brand.teal" />
            <Text fontSize="lg" fontWeight="bold">
              Messages
            </Text>
          </HStack>
          <Button size="sm" variant="ghost" leftIcon={<Plus size={16} />}>
            New Chat
          </Button>
        </HStack>

        {/* Search */}
        <InputGroup size="sm">
          <InputLeftElement>
            <Icon as={Search} color="gray.400" />
          </InputLeftElement>
          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            bg={useColorModeValue('gray.50', 'gray.700')}
            border="none"
          />
        </InputGroup>

        {/* Filters */}
        <HStack spacing={2} mt={3}>
          {(['all', 'unread', 'online'] as const).map((filterType) => (
            <Button
              key={filterType}
              size="xs"
              variant={filter === filterType ? 'solid' : 'ghost'}
              colorScheme={filter === filterType ? 'brand' : 'gray'}
              onClick={() => setFilter(filterType)}
              textTransform="capitalize"
            >
              {filterType}
              {filterType === 'unread' && (
                <Badge ml={1} colorScheme="red" variant="solid" fontSize="xs">
                  {chats.reduce((sum, chat) => sum + chat.unread_count, 0)}
                </Badge>
              )}
            </Button>
          ))}
        </HStack>
      </Box>

      {/* Chat List */}
      <VStack spacing={0} flex={1} overflow="auto" align="stretch">
        {loading ? (
          <Box p={8} textAlign="center">
            <Spinner size="lg" color="brand.teal" />
            <Text mt={4} color="gray.500" fontSize="sm">
              Loading conversations...
            </Text>
          </Box>
        ) : filteredChats.length === 0 ? (
          <Box p={8} textAlign="center">
            <Icon as={MessageCircle} w={12} h={12} color="gray.300" mb={4} />
            <Text color="gray.500" fontSize="sm">
              {searchQuery || filter !== 'all' 
                ? 'No conversations match your filters'
                : 'No conversations yet'
              }
            </Text>
          </Box>
        ) : (
          filteredChats.map((chat) => {
            const otherParticipant = getOtherParticipant(chat);
            const isSelected = chat.id === selectedChatId;

            return (
              <Box
                key={chat.id}
                p={4}
                bg={isSelected ? selectedBg : 'transparent'}
                _hover={{ bg: isSelected ? selectedBg : hoverBg }}
                cursor="pointer"
                onClick={() => onChatSelect(chat.id)}
                borderBottom="1px"
                borderColor={borderColor}
                transition="all 0.2s"
              >
                <HStack spacing={3} align="start">
                  {/* Avatar with online status */}
                  <Box position="relative">
                    <Avatar
                      size="md"
                      name={`${otherParticipant?.first_name} ${otherParticipant?.last_name}`}
                      src={otherParticipant?.avatar_url}
                    >
                      {otherParticipant?.is_online && (
                        <AvatarBadge boxSize="1.25em" bg="green.500" />
                      )}
                    </Avatar>
                  </Box>

                  {/* Chat info */}
                  <VStack align="start" spacing={1} flex={1} minW={0}>
                    <HStack justify="space-between" w="full">
                      <Text
                        fontSize="sm"
                        fontWeight={chat.unread_count > 0 ? "bold" : "medium"}
                        noOfLines={1}
                        color={isSelected ? 'brand.600' : undefined}
                      >
                        {`${otherParticipant?.first_name} ${otherParticipant?.last_name}`}
                      </Text>
                      <Text fontSize="xs" color="gray.500">
                        {chat.last_message && formatLastMessageTime(chat.last_message.created_at)}
                      </Text>
                    </HStack>

                    {/* Project context */}
                    {chat.project_context && (
                      <Text fontSize="xs" color="blue.500" noOfLines={1}>
                        📁 {chat.project_context.project_title}
                      </Text>
                    )}

                    {/* Last message */}
                    <HStack justify="space-between" w="full">
                      <Text
                        fontSize="xs"
                        color="gray.600"
                        noOfLines={1}
                        flex={1}
                        fontWeight={chat.unread_count > 0 ? "medium" : "normal"}
                      >
                        {chat.last_message ? (
                          <>
                            {chat.last_message.sender_name === 'You' ? 'You: ' : ''}
                            {chat.last_message.content}
                          </>
                        ) : (
                          'No messages yet'
                        )}
                      </Text>
                      {chat.unread_count > 0 && (
                        <Badge
                          colorScheme="red"
                          variant="solid"
                          borderRadius="full"
                          fontSize="xs"
                          minW="20px"
                          h="20px"
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                        >
                          {chat.unread_count > 9 ? '9+' : chat.unread_count}
                        </Badge>
                      )}
                    </HStack>

                    {/* Online status for offline users */}
                    {!otherParticipant?.is_online && otherParticipant?.last_seen && (
                      <Text fontSize="xs" color="gray.400">
                        Last seen {formatLastMessageTime(otherParticipant.last_seen)}
                      </Text>
                    )}
                  </VStack>
                </HStack>
              </Box>
            );
          })
        )}
      </VStack>
    </Box>
  );
};