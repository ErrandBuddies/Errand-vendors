import { useState } from 'react';
import { Loader2, Briefcase } from 'lucide-react';
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
import { useServicesQuery } from '@/hooks/queries';
import { cn } from '@/lib/utils';

/**
 * StartContractModal
 * Allows the vendor to pick a service and start a contract negotiation with a user.
 * Emits: "service-negotiation-start" via the provided onStart function.
 */
const StartContractModal = ({ open, onOpenChange, onStart, isPending }) => {
  const { data: services = [], isLoading } = useServicesQuery();
  const [selectedServiceId, setSelectedServiceId] = useState('');
  const [contractName, setContractName] = useState('');

  const handleStart = () => {
    if (!selectedServiceId) return;
    onStart({ serviceId: selectedServiceId, name: contractName });
  };

  const handleClose = (val) => {
    setSelectedServiceId('');
    setContractName('');
    onOpenChange(val);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Start a Contract</DialogTitle>
          <DialogDescription>
            Select the service you want to offer and optionally give this contract a name.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Optional contract name */}
          <div className="space-y-1">
            <Label htmlFor="contract-name">Contract Name (optional)</Label>
            <Input
              id="contract-name"
              placeholder="e.g. Website build for Azeez"
              value={contractName}
              onChange={(e) => setContractName(e.target.value)}
            />
          </div>

          {/* Service selector */}
          <div className="space-y-2">
            <Label>Select Service</Label>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
              </div>
            ) : services.length === 0 ? (
              <div className="text-center py-8 text-sm text-muted-foreground">
                <Briefcase className="w-8 h-8 mx-auto mb-2 text-muted-foreground/50" />
                You have no services yet. Add a service first.
              </div>
            ) : (
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {services.map((service) => (
                  <button
                    key={service._id}
                    type="button"
                    onClick={() => setSelectedServiceId(service._id)}
                    className={cn(
                      'w-full text-left p-3 rounded-lg border transition-colors',
                      selectedServiceId === service._id
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50 hover:bg-muted/50'
                    )}
                  >
                    <p className="font-medium text-sm">{service.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                      {service.description}
                    </p>
                    {service.price != null && (
                      <p className="text-xs font-semibold text-primary mt-1">
                        {service.currency || 'NGN'} {Number(service.price).toLocaleString()}
                      </p>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => handleClose(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleStart}
            disabled={!selectedServiceId || isPending}
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Starting…
              </>
            ) : (
              'Start Negotiation'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default StartContractModal;
