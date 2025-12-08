import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { chatService } from '@/services/api';
import { queryKeys } from './queryKeys';
import { useSocket } from '@/hooks/useSocket';

/**
 * Custom hook for fetching and managing conversations with real-time updates
 */
export const useConversations = () => {
  const queryClient = useQueryClient();
  const { socket, isConnected } = useSocket();

  const query = useQuery({
    queryKey: queryKeys.chat.conversations(),
    queryFn: async () => {
      const response = await chatService.getConversations();
      return response.data || [];
    },
    staleTime: 1000 * 60, // 1 minute
    refetchOnWindowFocus: true,
  });

  useEffect(() => {
    if (!socket || !isConnected) return;

    // Handle incoming messages to update conversation list
    const handleNewMessage = (data) => {
      if (data?.success && data?.message) {
        queryClient.setQueryData(queryKeys.chat.conversations(), (oldData) => {
          if (!oldData) return oldData;

          const conversationId = data.conversationId || data.message.conversationId;
          const existingConvIndex = oldData.findIndex(
            (conv) => conv._id === conversationId
          );

          if (existingConvIndex !== -1) {
            // Update existing conversation
            const updatedConversations = [...oldData];
            updatedConversations[existingConvIndex] = {
              ...updatedConversations[existingConvIndex],
              latestMessage: data.message.message,
              status: data.message.status,
              lastUpdated: data.message.timestamp || data.message.createdAt,
              unread: true, // Mark as unread for incoming messages
            };
            // Move to top
            const [updated] = updatedConversations.splice(existingConvIndex, 1);
            return [updated, ...updatedConversations];
          }

          return oldData;
        });
      }
    };

    // Handle sent message confirmation to update conversation
    const handleMessageSent = (data) => {
      if (data?.success && data?.message) {
        queryClient.setQueryData(queryKeys.chat.conversations(), (oldData) => {
          if (!oldData) return oldData;

          const conversationId = data.message.conversationId;
          const existingConvIndex = oldData.findIndex(
            (conv) => conv._id === conversationId
          );

          if (existingConvIndex !== -1) {
            // Update existing conversation
            const updatedConversations = [...oldData];
            updatedConversations[existingConvIndex] = {
              ...updatedConversations[existingConvIndex],
              latestMessage: data.message.message,
              status: data.message.status,
              lastUpdated: data.message.timestamp || data.message.createdAt,
            };
            // Move to top
            const [updated] = updatedConversations.splice(existingConvIndex, 1);
            return [updated, ...updatedConversations];
          }

          return oldData;
        });
      }
    };

    socket.on('message', handleNewMessage);
    socket.on('messageSent', handleMessageSent);

    return () => {
      socket.off('message', handleNewMessage);
      socket.off('messageSent', handleMessageSent);
    };
  }, [socket, isConnected, queryClient]);

  return query;
};

export default useConversations;
