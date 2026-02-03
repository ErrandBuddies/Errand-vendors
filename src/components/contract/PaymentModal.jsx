

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

const PaymentModal = ({ isOpen, onClose, onSubmit, isLoading, defaultCurrency = 'NGN' }) => {

  const [amount, setAmount] = useState('');
  const [duration, setDuration] = useState('');
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      newErrors.amount = 'Please enter a valid amount';
    }

    if (!duration || isNaN(duration) || parseFloat(duration) <= 0) {
      newErrors.duration = 'Please enter a valid duration in hours';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    onSubmit(parseFloat(amount), parseFloat(duration));
  };

  const handleAmountChange = (e) => {
    const value = e.target.value;
    // Allow empty input or positive numbers only
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setAmount(value);
      if (errors.amount) {
        setErrors(prev => ({ ...prev, amount: undefined }));
      }
    }
  };

  const handleDurationChange = (e) => {
    const value = e.target.value;
    // Allow empty input or positive numbers only
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setDuration(value);
      if (errors.duration) {
        setErrors(prev => ({ ...prev, duration: undefined }));
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Initiate Payment</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="amount">Amount ({defaultCurrency})</Label>
                  <Input
                    id="amount"
                    type="text"
                    placeholder="Enter amount"
                    value={amount}
                    onChange={handleAmountChange}
                    className={errors.amount ? 'border-destructive' : ''}
                    disabled={isLoading}
                  />
                  {errors.amount && (
                    <p className="text-sm text-destructive mt-1">{errors.amount}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="duration">Duration (hours)</Label>
                  <Input
                    id="duration"
                    type="text"
                    placeholder="Enter duration in hours"
                    value={duration}
                    onChange={handleDurationChange}
                    className={errors.duration ? 'border-destructive' : ''}
                    disabled={isLoading}
                  />
                  {errors.duration && (
                    <p className="text-sm text-destructive mt-1">{errors.duration}</p>
                  )}
                </div>

                {amount && duration && !errors.amount && !errors.duration && (
                  <div className="bg-muted p-3 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      Total: {defaultCurrency} {parseFloat(amount || 0).toLocaleString()} for {parseFloat(duration || 0)} hours
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Rate: {defaultCurrency} {((parseFloat(amount || 0) / parseFloat(duration || 1))).toFixed(2)} per hour
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !amount || !duration}
              className="flex-1"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Initiating...
                </>
              ) : (
                'Initiate Payment'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;
