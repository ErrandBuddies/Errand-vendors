import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Edit, Trash2, Star } from 'lucide-react';
import { imagePlaceholder } from '../constants';

const ServiceCard = ({ service, onView, onEdit, onDelete }) => {
  const firstImage = service.images && service.images.length > 0 
    ? service.images[0] 
    : '/placeholder-product.png';

  const isAvailable = service.availability !== false;
  const rating = service.ratings?.rate || 0;
  const numberOfRatings = service.ratings?.number || 0;

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative">
        <img
          src={firstImage}
          alt={service.name}
          className="w-full h-48 object-cover"
          onError={(e) => {
            e.target.src = imagePlaceholder;
          }}
        />
        {!isAvailable && (
          <Badge className="absolute top-2 right-2" variant="destructive">
            Unavailable
          </Badge>
        )}
      </div>

      <CardContent className="p-4">
        <h3 className="font-semibold text-lg truncate mb-1">
          {service.name}
        </h3>
        <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
          {service.description}
        </p>

        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-lg font-bold text-primary">
              {service.currency} {service.price?.toLocaleString()}
            </p>
          </div>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-semibold">
              {rating.toFixed(1)}
            </span>
            {numberOfRatings > 0 && (
              <span className="text-xs text-muted-foreground">
                ({numberOfRatings})
              </span>
            )}
          </div>
        </div>

        <div className="text-sm text-muted-foreground mb-3">
          <p className="truncate">
            {service.location?.city}, {service.location?.state}
          </p>
          <p className="text-xs">
            {service.contracts || 0} contract{service.contracts !== 1 ? 's' : ''}
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            className="flex-1"
            onClick={() => onView(service)}
          >
            <Eye className="w-4 h-4 mr-1" />
            View
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onEdit(service)}
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onDelete(service)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ServiceCard;
