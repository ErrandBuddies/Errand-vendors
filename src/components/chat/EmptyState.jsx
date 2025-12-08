import { MessageSquare } from 'lucide-react';

/**
 * EmptyState Component
 * Shown when no conversation is selected
 */
export const EmptyState = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full p-6 text-center bg-muted/20">
      <div className="rounded-full bg-primary/10 p-6 mb-4">
        <MessageSquare className="w-12 h-12 text-primary" />
      </div>
      <h3 className="text-lg font-semibold mb-2">Select a conversation</h3>
      <p className="text-sm text-muted-foreground max-w-sm">
        Choose a conversation from the list to start messaging with your customers
      </p>
    </div>
  );
};

export default EmptyState;
