import { useState } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import ConversationItem from './ConversationItem';
import useConversations from '@/hooks/queries/useConversations';

/**
 * ConversationList Component
 * Displays list of all conversations with search functionality
 */
export const ConversationList = ({ selectedConversationId, onSelectConversation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const { data: conversations = [], isLoading, error } = useConversations();

  const filteredConversations = conversations.filter((conv) => {
    if (!searchQuery) return true;
    
    const { counterpartDetails } = conv;
    const fullName = `${counterpartDetails?.firstname || ''} ${counterpartDetails?.lastname || ''}`.toLowerCase();
    return fullName.includes(searchQuery.toLowerCase());
  });

  if (error) {
    return (
      <div className="flex items-center justify-center h-full p-6">
        <p className="text-sm text-destructive">Failed to load conversations</p>
      </div>
    );
  }

  return (
    <Card className="flex flex-col h-full border-r rounded-none">
      {/* Header */}
      <div className="p-4 border-b bg-background sticky top-0 ">
        {/* <h2 className="text-lg font-semibold mb-3">Messages</h2> */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center h-32">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : filteredConversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 px-6 text-center">
            <p className="text-sm text-muted-foreground">
              {searchQuery ? 'No conversations found' : 'No conversations yet'}
            </p>
            {!searchQuery && (
              <p className="text-xs text-muted-foreground mt-1">
                Customers will initiate conversations with you
              </p>
            )}
          </div>
        ) : (
          <div>
            {filteredConversations.map((conversation) => (
              <ConversationItem
                key={conversation._id}
                conversation={conversation}
                isSelected={selectedConversationId === conversation._id}
                onClick={() => onSelectConversation(conversation)}
              />
            ))}
          </div>
        )}
      </div>
    </Card>
  );
};

export default ConversationList;
