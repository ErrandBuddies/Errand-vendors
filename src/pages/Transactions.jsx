import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CreditCard } from 'lucide-react';

const Transactions = () => {
  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Transactions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <CreditCard className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Transactions Page
            </h3>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto">
              This is the transactions page scaffolding. Transaction history will be displayed here.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Transactions;
