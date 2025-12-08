import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { chatService } from '@/services/api';
import { queryKeys } from './queryKeys';
import { useSocket } from '@/hooks/useSocket';

/**
 * Custom hook for fetching messages with infinite scroll and real-time updates
 * @param {string} recipientId - The ID of the user to fetch messages for
 */
export const useMessages = (recipientId) => {
  const queryClient = useQueryClient();
  const { socket, isConnected } = useSocket();

  const query = useInfiniteQuery({
    queryKey: queryKeys.chat.messages(recipientId),
    queryFn: async ({ pageParam }) => {
      const params = {
        limit: 50,
      };
      
      if (pageParam) {
        params.cursor = pageParam;
      }

      const response = await chatService.getMessages(recipientId, params);
      return {
        messages: response.data || [],
        pagination: response.pagination || {},
        conversationId: response.conversationId,
        recipient: response.recipient?.[0] || null,
      };
    },
    getNextPageParam: (lastPage) => {
      return lastPage.pagination?.hasMore ? lastPage.pagination.nextCursor : undefined;
    },
    enabled: !!recipientId,
    staleTime: 1000 * 30, // 30 seconds
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (!socket || !isConnected || !recipientId) return;

    // Handle incoming messages
    const handleNewMessage = (data) => {
      if (data?.success && data?.message) {
        const message = data.message;
        const isSenderOrRecipient =
          message.sender === recipientId || message.recipient === recipientId;

        if (isSenderOrRecipient) {
          queryClient.setQueryData(queryKeys.chat.messages(recipientId), (oldData) => {
            if (!oldData) return oldData;

            // Check if message already exists
            const messageExists = oldData.pages.some((page) =>
              page.messages.some((msg) => msg._id === message._id)
            );

            if (!messageExists) {
              const newPages = [...oldData.pages];
              if (newPages.length > 0) {
                newPages[0] = {
                  ...newPages[0],
                  messages: [message, ...newPages[0].messages],
                };
              }
              return {
                ...oldData,
                pages: newPages,
              };
            }

            return oldData;
          });

          // Auto-mark message as delivered if it's from the other person
          if (message.sender === recipientId && socket) {
            socket.emit('messageDelivered', { messageID: message._id });
          }
        }
      }
    };

    // Handle sent message confirmation
    const handleMessageSent = (data) => {
      if (data?.success && data?.message) {
        const message = data.message;
        const messageRecipient = message.recipient;

        if (messageRecipient === recipientId) {
          queryClient.setQueryData(queryKeys.chat.messages(recipientId), (oldData) => {
            if (!oldData) return oldData;

            // Find and update the pending message
            const newPages = oldData.pages.map((page) => ({
              ...page,
              messages: page.messages.map((msg) => {
                // Match by messageID if it's a pending message
                if (msg.messageID === data.messageID) {
                  return { ...message, messageID: data.messageID };
                }
                return msg;
              }),
            }));

            return {
              ...oldData,
              pages: newPages,
            };
          });
        }
      }
    };

    // Handle message delivered status
    const handleMessageDelivered = (data) => {
      if (data?.success && data?.messageID) {
        queryClient.setQueryData(queryKeys.chat.messages(recipientId), (oldData) => {
          if (!oldData) return oldData;

          const newPages = oldData.pages.map((page) => ({
            ...page,
            messages: page.messages.map((msg) => {
              if (msg._id === data.messageID) {
                return { ...msg, status: 'delivered' };
              }
              return msg;
            }),
          }));

          return {
            ...oldData,
            pages: newPages,
          };
        });
      }
    };

    // Handle messages read status
    const handleMessagesRead = (data) => {
      if (data?.success && data?.recipientID) {
        queryClient.setQueryData(queryKeys.chat.messages(recipientId), (oldData) => {
          if (!oldData) return oldData;

          const newPages = oldData.pages.map((page) => ({
            ...page,
            messages: page.messages.map((msg) => {
              if (msg.recipient === data.recipientID && msg.status !== 'read') {
                return { ...msg, status: 'read' };
              }
              return msg;
            }),
          }));

          return {
            ...oldData,
            pages: newPages,
          };
        });
      }
    };

    socket.on('message', handleNewMessage);
    socket.on('messageSent', handleMessageSent);
    socket.on('messageDelivered', handleMessageDelivered);
    socket.on('messagesRead', handleMessagesRead);

    return () => {
      socket.off('message', handleNewMessage);
      socket.off('messageSent', handleMessageSent);
      socket.off('messageDelivered', handleMessageDelivered);
      socket.off('messagesRead', handleMessagesRead);
    };
  }, [socket, isConnected, recipientId, queryClient]);

  return query;
};

export default useMessages;
