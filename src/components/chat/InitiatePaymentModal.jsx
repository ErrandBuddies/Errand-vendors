import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

/**
 * InitiatePaymentModal
 * Vendor sets price and duration for the contract then emits service-initiate-payment.
 */
const InitiatePaymentModal = ({ open, onOpenChange, contract, onInitiate, isPending }) => {
  const [price, setPrice] = useState('');
  const [duration, setDuration] = useState('');

  const handleSubmit = () => {
    if (!price || !duration) return;
    onInitiate({
      contractId: contract?._id,
      price: Number(price),
      duration: Number(duration),
    });
  };

  const handleClose = (val) => {
    setPrice('');
    setDuration('');
    onOpenChange(val);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Initiate Payment</DialogTitle>
          <DialogDescription>
            Set the price and estimated duration for{' '}
            <span className="font-medium">{contract?.name || 'this contract'}</span>.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-1">
            <Label htmlFor="contract-price">
              Price ({contract?.currency || 'NGN'})
            </Label>
            <Input
              id="contract-price"
              type="number"
              min="1"
              placeholder="e.g. 25000"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="contract-duration">Duration (hours)</Label>
            <Input
              id="contract-duration"
              type="number"
              min="1"
              placeholder="e.g. 48"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => handleClose(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!price || !duration || isPending}
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Initiating…
              </>
            ) : (
              'Send Payment Request'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default InitiatePaymentModal;
