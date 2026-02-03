import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';
import { imagePlaceholder } from '../../constants';

const ServiceSelectionModal = ({ isOpen, onClose, services, onSelectService, isLoading }) => {
  const handleServiceSelect = (service) => {
    onSelectService(service._id, service.name);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Select a Service for Negotiation</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 mt-4">
          {services.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No services available</p>
            </div>
          ) : (
            services.map((service) => {
              const firstImage = service.images && service.images.length > 0 
                ? service.images[0] 
                : '/placeholder-product.png';
              
              const isAvailable = service.availability !== false;

              return (
                <Card 
                  key={service._id}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    !isAvailable ? 'opacity-60' : ''
                  }`}
                  onClick={() => isAvailable && handleServiceSelect(service)}
                >
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <img
                        src={firstImage}
                        alt={service.name}
                        className="w-20 h-20 object-cover rounded-lg"
                        onError={(e) => {
                          e.target.src = imagePlaceholder;
                        }}
                      />
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-lg truncate">
                            {service.name}
                          </h3>
                          {!isAvailable && (
                            <Badge variant="destructive" className="ml-2">
                              Unavailable
                            </Badge>
                          )}
                        </div>
                        
                        <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                          {service.description}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-bold text-primary">
                              {service.currency} {service.price?.toLocaleString()}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {service.location?.city}, {service.location?.state}
                            </p>
                          </div>
                          
                          <div className="text-right">
                            <p className="text-sm text-muted-foreground">
                              {service.contracts || 0} contracts
                            </p>
                            {service.ratings?.rate && (
                              <p className="text-sm">
                                ⭐ {service.ratings.rate.toFixed(1)} ({service.ratings.number || 0})
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {isAvailable && (
                      <div className="mt-3 pt-3 border-t">
                        <Button
                          className="w-full"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleServiceSelect(service);
                          }}
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Starting...
                            </>
                          ) : (
                            'Select for Negotiation'
                          )}
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ServiceSelectionModal;
