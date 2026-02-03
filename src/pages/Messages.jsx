import { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ConversationList from '@/components/chat/ConversationList';
import ChatWindow from '@/components/chat/ChatWindow';
import EmptyState from '@/components/chat/EmptyState';
import { useSocket } from '@/hooks/useSocket';

const Messages = () => {
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [isMobileView, setIsMobileView] = useState(false);
  const { isConnected } = useSocket();

  // Check if mobile view
  useEffect(() => {
    const checkMobile = () => {
      setIsMobileView(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleSelectConversation = (conversation) => {
    setSelectedConversation(conversation);
  };

  const handleBackToList = () => {
    setSelectedConversation(null);
  };

  // Mobile view: single panel with navigation
  if (isMobileView) {
    return (
      <div className="h-[calc(100vh-64px)]">
        {/* Connection status indicator */}
        {!isConnected && (
          <div className="bg-yellow-100 border-b border-yellow-200 px-4 py-2 text-xs text-yellow-800 text-center">
            Connecting to chat server...
          </div>
        )}

        {selectedConversation ? (
          <div className="flex flex-col h-full">
            {/* Mobile header with back button */}
            <div className="flex-1 overflow-hidden">
              <ChatWindow conversation={selectedConversation} handleBackToList={handleBackToList} />
            </div>
          </div>
        ) : (
          <ConversationList
            selectedConversationId={selectedConversation?._id}
            onSelectConversation={handleSelectConversation}
          />
        )}
      </div>
    );
  }

  // Desktop view: split panel layout
  return (
    <div className="h-[calc(100vh-64px)] p-6">
      {/* Connection status indicator */}
      {!isConnected && (
        <div className="bg-yellow-100 border border-yellow-200 rounded-lg mb-4 px-4 py-2 text-sm text-yellow-800 text-center">
          Connecting to chat server...
        </div>
      )}

      <div className="flex h-full gap-4">
        {/* Left panel: Conversation list */}
        <div className="w-1/3 min-w-[300px] max-w-md h-full overflow-hidden">
          <ConversationList
            selectedConversationId={selectedConversation?._id}
            onSelectConversation={handleSelectConversation}
          />
        </div>

        {/* Right panel: Chat window or empty state */}
        <div className="flex-1 h-full overflow-hidden">
          {selectedConversation ? (
            <ChatWindow conversation={selectedConversation} handleBackToList={handleBackToList} />
          ) : (
            <EmptyState />
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages;
