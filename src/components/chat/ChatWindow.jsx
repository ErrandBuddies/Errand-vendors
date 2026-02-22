import { useEffect, useRef, useState } from 'react';
import { ArrowDown, Loader2 } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import MessageBubble from './MessageBubble';
import MessageInput from './MessageInput';
import useMessages from '@/hooks/queries/useMessages';
import useSendMessage from '@/hooks/queries/useSendMessage';
import { useSocket } from '@/hooks/useSocket';
import { useAuth } from '@/hooks/useAuth';

/**
 * ChatWindow Component
 * Main chat interface with message list and input
 */
export const ChatWindow = ({ conversation }) => {
  const { user } = useAuth();
  const { socket } = useSocket();
  const scrollRef = useRef(null);
  const messagesEndRef = useRef(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [hasScrolledUp, setHasScrolledUp] = useState(false);

  const recipientId = conversation?.counterpartDetails?._id;
  const { 
    data, 
    isLoading, 
    error, 
    fetchNextPage, 
    hasNextPage, 
    isFetchingNextPage 
  } = useMessages(recipientId);

  const { sendMessage, isSending } = useSendMessage(recipientId);

  // Flatten all messages from pages
  const messages = data?.pages?.flatMap((page) => page.messages) || [];
  const recipient = data?.pages?.[0]?.recipient;

  // Auto-scroll to bottom on new message (if not scrolled up)
  useEffect(() => {
    if (!hasScrolledUp && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
    
    // Mark as read if we receive a new message while the chat is open
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && lastMessage.sender === recipientId && socket) {
      socket.emit('messagesRead', { recipientID: recipientId });
    }
  }, [messages.length, hasScrolledUp, recipientId, socket]);

  // Initial scroll to bottom
  useEffect(() => {
    if (messagesEndRef.current && messages.length > 0) {
      messagesEndRef.current.scrollIntoView();
    }
  }, [recipientId]);

  // Mark messages as read when conversation is viewed
  useEffect(() => {
    if (socket && recipientId) {
      socket.emit('messagesRead', { recipientID: recipientId });
    }
  }, [socket, recipientId]);

  // Handle scroll to detect if user scrolled up
  const handleScroll = () => {
    if (!scrollRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
    
    setShowScrollButton(!isNearBottom);
    setHasScrolledUp(!isNearBottom);

    // Load more messages when scrolled to top
    if (scrollTop === 0 && hasNextPage && !isFetchingNextPage) {
      const previousScrollHeight = scrollRef.current.scrollHeight;
      
      fetchNextPage().then(() => {
        // Maintain scroll position after loading more messages
        if (scrollRef.current) {
          const newScrollHeight = scrollRef.current.scrollHeight;
          scrollRef.current.scrollTop = newScrollHeight - previousScrollHeight;
        }
      });
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    setHasScrolledUp(false);
  };

  const handleSend = async ({ message, attachment }) => {
    await sendMessage({ message, attachment });
    setHasScrolledUp(false); // Auto-scroll on send
  };

  const getInitials = (firstname, lastname) => {
    return `${firstname?.[0] || ''}${lastname?.[0] || ''}`.toUpperCase();
  };

  if (error) {
    return (
      <Card className="flex flex-col h-full">
        <div className="flex items-center justify-center h-full p-6">
          <p className="text-sm text-destructive">Failed to load messages</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="flex flex-col h-full rounded-none">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b bg-background">
        <Avatar className="w-10 h-10">
          <AvatarFallback className="bg-primary text-primary-foreground">
            {getInitials(
              recipient?.firstname || conversation?.counterpartDetails?.firstname,
              recipient?.lastname || conversation?.counterpartDetails?.lastname
            )}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h3 className="font-semibold">
            {recipient?.firstname || conversation?.counterpartDetails?.firstname}{' '}
            {recipient?.lastname || conversation?.counterpartDetails?.lastname}
          </h3>
          <p className="text-xs text-muted-foreground">Customer</p>
        </div>
      </div>

      {/* Messages */}
      <div 
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-4 bg-muted/10 relative"
      >
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            {/* Load more indicator */}
            {isFetchingNextPage && (
              <div className="flex justify-center py-2">
                <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
              </div>
            )}

            {/* Messages list (reversed to show latest at bottom) */}
            <div className="flex flex-col">
              {messages.map((message) => (
                <MessageBubble
                  key={message._id || message.messageID}
                  message={message}
                  isSent={message.sender === user?._id || message.sender === 'me'}
                />
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Scroll to bottom button */}
            {showScrollButton && (
              <Button
                size="icon"
                className="fixed bottom-24 right-8 rounded-full shadow-lg"
                onClick={scrollToBottom}
              >
                <ArrowDown className="w-5 h-5" />
              </Button>
            )}
          </>
        )}
      </div>

      {/* Input */}
      <MessageInput 
        onSend={handleSend} 
        isSending={isSending}
        disabled={!recipientId}
      />
    </Card>
  );
};

export default ChatWindow;
