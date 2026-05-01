import { useEffect, useRef, useState, useCallback } from 'react';
import { ArrowDown, Loader2, MoreVertical, FileSignature, ArrowLeft } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import MessageBubble from './MessageBubble';
import MessageInput from './MessageInput';
import StartContractModal from './StartContractModal';
import InitiatePaymentModal from './InitiatePaymentModal';
import ContractBanner from './ContractBanner';
import useMessages from '@/hooks/queries/useMessages';
import useSendMessage from '@/hooks/queries/useSendMessage';
import { useSocket } from '@/hooks/useSocket';
import { useAuth } from '@/hooks/useAuth';
import { useChat } from '@/contexts/ChatContext';

/**
 * ChatWindow Component
 * Main chat interface with message list and input
 */
export const ChatWindow = ({ conversation, isMobileView, handleBackToList }) => {
  const { user } = useAuth();
  const { socket, emit } = useSocket();
  const { toast } = useToast();
  const scrollRef = useRef(null);
  const messagesEndRef = useRef(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [hasScrolledUp, setHasScrolledUp] = useState(false);
  const { setUnreadCount } = useChat();

  // Contract related state
  const [contract, setContract] = useState(null);
  const [showStartModal, setShowStartModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isContractPending, setIsContractPending] = useState(false);

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
  const initialContract = data?.pages?.[0]?.contract;

  // Initialize contract state from API response
  useEffect(() => {
    if (initialContract) {
      setContract(initialContract);
    } else {
      setContract(null);
    }
  }, [initialContract, recipientId]);

  // Handle contract socket events
  useEffect(() => {
    if (!socket || !recipientId) return;

    const handleContractUpdate = (data) => {
      console.log('Contract socket event:', data);
      if (data?.success && data?.contract) {
        setContract(data.contract);
      } else if (data?.success && !data?.contract) {
        setContract(data.contract);
      }

      if (data?.message) {
        toast({
          title: data.success ? 'Success' : 'Notice',
          description: data.message,
          variant: data.success ? 'default' : 'destructive',
        });
      }

      setIsContractPending(false);
    };

    const handleNegotiationStart = (data) => {
      handleContractUpdate(data);
      if (data?.success) setShowStartModal(false);
    };

    const handleInitiatePayment = (data) => {
      handleContractUpdate(data);
      if (data?.success) setShowPaymentModal(false);
    };

    const handleTerminate = (data) => {
      if (data?.success) {
        setContract(null);
        toast({
          title: 'Contract Terminated',
          description: data.message || 'The contract has been cancelled.',
        });
      }
    };

    // Generic listener for all contract events that just update the state
    socket.on('service-negotiation-start', handleNegotiationStart);
    socket.on('service-confirm-negotiation', handleContractUpdate);
    socket.on('service-initiate-payment', handleInitiatePayment);
    socket.on('service-complete-payment', handleContractUpdate);
    socket.on('service-complete-contract', handleContractUpdate);
    socket.on('service-terminate-contract', handleTerminate);

    return () => {
      socket.off('service-negotiation-start', handleNegotiationStart);
      socket.off('service-confirm-negotiation', handleContractUpdate);
      socket.off('service-initiate-payment', handleInitiatePayment);
      socket.off('service-complete-payment', handleContractUpdate);
      socket.off('service-complete-contract', handleContractUpdate);
      socket.off('service-terminate-contract', handleTerminate);
    };
  }, [socket, recipientId, toast]);

  // Contract actions
  const startNegotiation = ({ serviceId, name }) => {
    setIsContractPending(true);
    emit('service-negotiation-start', {
      recipientID: recipientId,
      serviceId,
      name
    });
  };

  const initiatePayment = ({ contractId, price, duration }) => {
    setIsContractPending(true);
    emit('service-initiate-payment', { contractId, price, duration });
  };

  const markComplete = () => {
    if (!contract?._id) return;
    setIsContractPending(true);
    emit('service-complete-contract', { contractId: contract._id });
  };

  const terminateContract = () => {
    if (!contract?._id) return;
    setIsContractPending(true);
    emit('service-terminate-contract', {
      contractId: contract._id,
      recipientID: recipientId
    });
  };

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
    if (conversation?._id) {
      setUnreadCount(prev => prev.filter((id) => id !== conversation._id));
    }
  }, [socket, messages.length, recipientId, conversation?._id, setUnreadCount]);

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
        {isMobileView &&
          <Button
            size="icon"
            variant="ghost"
            onClick={handleBackToList}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
        }
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

        {/* Contract Options */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <MoreVertical className="w-5 h-5 text-muted-foreground" />
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-48 p-1">
            <Button
              variant="ghost"
              className="w-full justify-start text-sm font-normal py-2 px-3 h-auto"
              onClick={() => setShowStartModal(true)}
              disabled={!!contract && contract.stage !== 'cancelled'}
            >
              <FileSignature className="w-4 h-4 mr-2" />
              {contract && contract.stage !== 'cancelled'
                ? 'Active Contract'
                : 'Start Contract'}
            </Button>
          </PopoverContent>
        </Popover>
      </div>

      {/* Contract Banner */}
      {contract && (
        <ContractBanner
          contract={contract}
          onInitiatePayment={() => setShowPaymentModal(true)}
          onComplete={markComplete}
          onTerminate={terminateContract}
          isCompletePending={isContractPending}
          isTerminatePending={isContractPending}
        />
      )}

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

      {/* Modals */}
      <StartContractModal
        open={showStartModal}
        onOpenChange={setShowStartModal}
        onStart={startNegotiation}
        isPending={isContractPending}
      />

      <InitiatePaymentModal
        open={showPaymentModal}
        onOpenChange={setShowPaymentModal}
        contract={contract}
        onInitiate={initiatePayment}
        isPending={isContractPending}
      />
    </Card>
  );
};

export default ChatWindow;

