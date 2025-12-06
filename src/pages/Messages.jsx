import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare } from 'lucide-react';

const Messages = () => {
  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Messages
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <MessageSquare className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Messages Page
            </h3>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto">
              This is the messages page scaffolding. Messaging features will be implemented here.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Messages;
