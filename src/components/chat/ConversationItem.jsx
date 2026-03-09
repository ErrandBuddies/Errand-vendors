import { formatDistanceToNow } from 'date-fns';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useState } from 'react';

/**
 * ConversationItem Component
 * Displays individual conversation in the list with customer details and latest message
 */
export const ConversationItem = ({
  conversation,
  isSelected,
  onClick
}) => {
  const { counterpartDetails, latestMessage, unread, lastUpdated } = conversation;
  const [opened, setOpened] = useState(false);
  const getInitials = (firstname, lastname) => {
    return `${firstname?.[0] || ''}${lastname?.[0] || ''}`.toUpperCase();
  };

  const formatTime = (timestamp) => {
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    } catch {
      return '';
    }
  };

  return (
    <div
      onClick={() => { onClick(); setOpened(true); }}
      className={cn(
        'flex items-start gap-3 p-4 cursor-pointer transition-colors border-b hover:bg-accent',
        isSelected && 'bg-accent',
        unread && !opened && 'bg-blue-50 hover:bg-blue-100'
      )}
    >
      <Avatar className="w-12 h-12 flex-shrink-0">
        <AvatarFallback className="bg-primary text-primary-foreground">
          {getInitials(counterpartDetails?.firstname, counterpartDetails?.lastname)}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-semibold text-sm truncate">
            {counterpartDetails?.firstname} {counterpartDetails?.lastname}
          </h3>
          {lastUpdated && (
            <span className="text-xs text-muted-foreground flex-shrink-0">
              {formatTime(lastUpdated)}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between gap-2">
          <p className="text-sm text-muted-foreground truncate flex-1">
            {latestMessage || 'No messages yet'}
          </p>
          {unread && !opened && (
            <Badge variant="default" className="ml-auto flex-shrink-0 h-5 w-5 rounded-full p-0 flex items-center justify-center">
              <span className="sr-only">New message</span>
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConversationItem;
