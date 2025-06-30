import React, { useState } from 'react';
import {
  Box,
  HStack,
  VStack,
  Text,
  Avatar,
  Button,
  Icon,
  useColorModeValue,
  Tooltip,
  Badge,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useToast,
} from '@chakra-ui/react';
import { Download, FileText, Image as ImageIcon, MoreHorizontal, Copy, Reply, HandPlatter as Translate, Volume2 } from 'lucide-react';

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
}

interface MessageBubbleProps {
  message: Message;
  isOwnMessage: boolean;
  showAvatar: boolean;
  formatFileSize: (bytes: number) => string;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isOwnMessage,
  showAvatar,
  formatFileSize,
}) => {
  const [showTranslation, setShowTranslation] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [translatedText, setTranslatedText] = useState(message.translated_content);
  const toast = useToast();

  const ownBubbleBg = useColorModeValue('brand.teal', 'brand.600');
  const otherBubbleBg = useColorModeValue('white', 'gray.700');
  const ownTextColor = 'white';
  const otherTextColor = useColorModeValue('gray.800', 'white');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const translateMessage = async () => {
    if (translatedText) {
      setShowTranslation(!showTranslation);
      return;
    }

    setIsTranslating(true);
    try {
      // TODO: Implement LibreTranslate API call
      // For now, simulate translation
      await new Promise(resolve => setTimeout(resolve, 1000));
      const mockTranslation = `[Translated] ${message.content}`;
      setTranslatedText(mockTranslation);
      setShowTranslation(true);
      
      toast({
        title: 'Message Translated',
        description: 'Translation provided by LibreTranslate',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Translation Failed',
        description: 'Unable to translate message at this time',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsTranslating(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(message.content);
    toast({
      title: 'Copied',
      description: 'Message copied to clipboard',
      status: 'success',
      duration: 2000,
      isClosable: true,
    });
  };

  const readAloud = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(
        showTranslation && translatedText ? translatedText : message.content
      );
      speechSynthesis.speak(utterance);
    } else {
      toast({
        title: 'Not Supported',
        description: 'Text-to-speech is not supported in your browser',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const renderFileContent = () => {
    if (message.message_type === 'file' && message.file_name) {
      return (
        <Box
          p={3}
          bg={useColorModeValue('gray.50', 'gray.600')}
          borderRadius="md"
          border="1px"
          borderColor={borderColor}
          maxW="250px"
        >
          <HStack spacing={3}>
            <Icon
              as={message.file_name.toLowerCase().includes('.pdf') ? FileText : ImageIcon}
              color="gray.500"
              boxSize={6}
            />
            <VStack align="start" spacing={1} flex={1} minW={0}>
              <Text fontSize="sm" fontWeight="medium" noOfLines={1}>
                {message.file_name}
              </Text>
              <Text fontSize="xs" color="gray.500">
                {message.file_size && formatFileSize(message.file_size)}
              </Text>
            </VStack>
            <Button size="xs" variant="ghost" onClick={() => window.open(message.file_url, '_blank')}>
              <Download size={14} />
            </Button>
          </HStack>
        </Box>
      );
    }
    return null;
  };

  return (
    <HStack
      align="end"
      justify={isOwnMessage ? 'flex-end' : 'flex-start'}
      spacing={2}
      w="full"
    >
      {/* Avatar for other user */}
      {!isOwnMessage && (
        <Avatar
          size="xs"
          name={message.sender_name}
          src={message.sender_avatar}
          visibility={showAvatar ? 'visible' : 'hidden'}
        />
      )}

      <VStack
        align={isOwnMessage ? 'end' : 'start'}
        spacing={1}
        maxW="70%"
      >
        {/* Sender name for other user */}
        {!isOwnMessage && showAvatar && (
          <Text fontSize="xs" color="gray.500" ml={2}>
            {message.sender_name}
          </Text>
        )}

        {/* Message bubble */}
        <Box position="relative" group>
          <Box
            bg={isOwnMessage ? ownBubbleBg : otherBubbleBg}
            color={isOwnMessage ? ownTextColor : otherTextColor}
            p={3}
            borderRadius="lg"
            borderTopLeftRadius={!isOwnMessage && showAvatar ? 'sm' : 'lg'}
            borderTopRightRadius={isOwnMessage && showAvatar ? 'sm' : 'lg'}
            border={!isOwnMessage ? "1px" : "none"}
            borderColor={borderColor}
            boxShadow="sm"
            position="relative"
          >
            {/* Translation indicator */}
            {message.original_language && message.original_language !== 'en' && (
              <Badge
                size="xs"
                colorScheme="blue"
                variant="subtle"
                mb={2}
                fontSize="xs"
              >
                Translated from {message.original_language.toUpperCase()}
              </Badge>
            )}

            {/* Message content */}
            {message.message_type === 'text' ? (
              <VStack align="start" spacing={2}>
                <Text fontSize="sm" whiteSpace="pre-wrap">
                  {showTranslation && translatedText ? translatedText : message.content}
                </Text>
                {showTranslation && translatedText && (
                  <Box>
                    <Text fontSize="xs" color="gray.400" fontStyle="italic">
                      Original: {message.content}
                    </Text>
                  </Box>
                )}
              </VStack>
            ) : (
              renderFileContent()
            )}

            {/* Message actions menu */}
            <Box
              position="absolute"
              top={1}
              right={isOwnMessage ? 'auto' : 1}
              left={isOwnMessage ? 1 : 'auto'}
              opacity={0}
              _groupHover={{ opacity: 1 }}
              transition="opacity 0.2s"
            >
              <Menu size="sm">
                <MenuButton
                  as={Button}
                  size="xs"
                  variant="ghost"
                  bg={useColorModeValue('white', 'gray.600')}
                  color="gray.600"
                  _hover={{
                    bg: useColorModeValue('gray.100', 'gray.500'),
                  }}
                  minW="auto"
                  h="24px"
                  w="24px"
                  p={0}
                >
                  <MoreHorizontal size={12} />
                </MenuButton>
                <MenuList fontSize="sm">
                  {message.message_type === 'text' && (
                    <>
                      <MenuItem
                        icon={<Translate size={14} />}
                        onClick={translateMessage}
                        isDisabled={isTranslating}
                      >
                        {isTranslating ? 'Translating...' : 
                         showTranslation ? 'Hide Translation' : 'Translate'}
                      </MenuItem>
                      <MenuItem icon={<Volume2 size={14} />} onClick={readAloud}>
                        Read Aloud
                      </MenuItem>
                      <MenuItem icon={<Copy size={14} />} onClick={copyToClipboard}>
                        Copy Text
                      </MenuItem>
                    </>
                  )}
                  <MenuItem icon={<Reply size={14} />}>
                    Reply
                  </MenuItem>
                </MenuList>
              </Menu>
            </Box>
          </Box>

          {/* Message timestamp */}
          <Text
            fontSize="xs"
            color="gray.400"
            mt={1}
            textAlign={isOwnMessage ? 'right' : 'left'}
          >
            {formatTime(message.created_at)}
            {isOwnMessage && (
              <Text as="span" ml={2} color={message.is_read ? 'blue.400' : 'gray.400'}>
                {message.is_read ? '✓✓' : '✓'}
              </Text>
            )}
          </Text>
        </Box>
      </VStack>

      {/* Avatar for own messages */}
      {isOwnMessage && (
        <Avatar
          size="xs"
          name="You"
          visibility={showAvatar ? 'visible' : 'hidden'}
        />
      )}
    </HStack>
  );
};