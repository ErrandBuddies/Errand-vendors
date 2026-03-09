import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useSocket } from '@/hooks/useSocket';
import { useAuth } from '@/hooks/useAuth';
import { chatService } from '@/services/api';

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const { socket, isConnected } = useSocket();
  const [unreadCount, setUnreadCount] = useState([]);

  // Fetch initial unread count or conversations
  const fetchUnreadCount = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const response = await chatService.getConversations();
      const conversations = response.data || [];
      const unreadMessages = conversations.filter((conv) => conv.unread).map((conv) => conv._id);
      setUnreadCount(unreadMessages);
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchUnreadCount();
    } else {
      setUnreadCount([]);
    }
  }, [isAuthenticated, fetchUnreadCount]);

  useEffect(() => {
    if (!socket || !isConnected) return;

    const handleNewMessage = (data) => {
      if (data?.success && data?.message) {
        const message = data.message;

        // Emit messageDelivered event globally
        if (message.sender !== user?._id) {
          socket.emit('messageDelivered', { messageID: message._id });

          // Increment unread count if we are not on the messages page or in this specific conversation
          // Note: Specific page logic might be better handled by checking the current route or active recipient
          // For now, we increment globally, and rely on the Messages page to mark as read.
          // setUnreadCount(prev => prev + 1);
        }
      }
    };

    const handleMessagesRead = (data) => {
      console.log("Messages read: ", data)
      // When messages are read, we should probably refetch or recalculate
      // Simplest is to refetch the total unread count
      fetchUnreadCount();
    };

    socket.on('inbox', ({ success, inbox }) => {
      if (success) {
        if (inbox && inbox.unread) {
          setUnreadCount(prev => [...new Set([...prev, inbox._id])]);
        }
      }
    })
    socket.on('message', handleNewMessage);
    socket.on('messagesRead', handleMessagesRead);

    return () => {
      socket.off('message', handleNewMessage);
      socket.off('messagesRead', handleMessagesRead);
    };
  }, [socket, isConnected, user?._id, fetchUnreadCount]);

  const value = {
    unreadCount,
    setUnreadCount,
    refreshUnreadCount: fetchUnreadCount
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
