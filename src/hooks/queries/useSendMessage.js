import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useSocket } from '@/hooks/useSocket';
import { queryKeys } from './queryKeys';

/**
 * Generate a unique message ID for tracking
 */
const generateMessageId = () => {
  return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Convert file to base64 string
 */
const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

/**
 * Get file type category from MIME type
 */
const getFileType = (mimeType) => {
  if (mimeType.startsWith('image/')) return 'image';
  if (mimeType.startsWith('video/')) return 'video';
  if (mimeType.startsWith('audio/')) return 'audio';
  return 'document';
};

/**
 * Custom hook for sending messages via Socket.IO
 */
export const useSendMessage = (recipientId) => {
  const queryClient = useQueryClient();
  const { socket, isConnected } = useSocket();
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState(null);

  const sendMessage = async ({ message, attachment }) => {
    if (!socket || !isConnected) {
      setError('Not connected to chat server');
      return { success: false, error: 'Not connected' };
    }

    if (!recipientId) {
      setError('No recipient selected');
      return { success: false, error: 'No recipient' };
    }

    if (!message && !attachment) {
      setError('Message or attachment is required');
      return { success: false, error: 'Empty message' };
    }

    setIsSending(true);
    setError(null);

    try {
      const messageID = generateMessageId();
      const payload = {
        recipientID: recipientId,
        messageID,
      };

      if (message) {
        payload.message = message;
      }

      if (attachment) {
        const base64 = await fileToBase64(attachment);
        payload.attachment = {
          file: base64,
          type: getFileType(attachment.type),
          name: attachment.name,
          size: attachment.size,
        };
      }

      // Optimistically add message to cache
      const optimisticMessage = {
        _id: messageID,
        messageID,
        sender: 'me', // Placeholder, will be updated by messageSent event
        recipient: recipientId,
        message: message || '',
        attachment: attachment
          ? {
              type: getFileType(attachment.type),
              name: attachment.name,
              size: attachment.size,
              url: URL.createObjectURL(attachment), // Temporary preview URL
            }
          : null,
        status: 'sending',
        timestamp: new Date().toISOString(),
      };

      queryClient.setQueryData(queryKeys.chat.messages(recipientId), (oldData) => {
        if (!oldData) {
          return {
            pages: [
              {
                messages: [optimisticMessage],
                pagination: { hasMore: false },
              },
            ],
            pageParams: [undefined],
          };
        }

        const newPages = [...oldData.pages];
        if (newPages.length > 0) {
          newPages[0] = {
            ...newPages[0],
            messages: [optimisticMessage, ...newPages[0].messages],
          };
        } else {
          newPages.push({
            messages: [optimisticMessage],
            pagination: { hasMore: false },
          });
        }

        return {
          ...oldData,
          pages: newPages,
        };
      });

      // Emit the message
      socket.emit('sendMessage', payload);

      setIsSending(false);
      return { success: true, messageID };
    } catch (err) {
      console.error('Error sending message:', err);
      setError(err.message || 'Failed to send message');
      setIsSending(false);

      // Remove optimistic message on error
      queryClient.setQueryData(queryKeys.chat.messages(recipientId), (oldData) => {
        if (!oldData) return oldData;

        const newPages = oldData.pages.map((page) => ({
          ...page,
          messages: page.messages.filter((msg) => msg.status !== 'sending'),
        }));

        return {
          ...oldData,
          pages: newPages,
        };
      });

      return { success: false, error: err.message };
    }
  };

  return {
    sendMessage,
    isSending,
    error,
    isConnected,
  };
};

export default useSendMessage;
