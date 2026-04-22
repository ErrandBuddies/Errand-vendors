import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Edit, Trash2, TrendingUp } from 'lucide-react';
import { imagePlaceholder } from '../constants';

const ProductCard = ({ product, onView, onEdit, onDelete, onSponsor }) => {
  const firstImage = product.images && product.images.length > 0
    ? product.images[0]
    : imagePlaceholder;

  const isSponsored = product?.sponsorship?.status === "active" || false;
  const isLowStock = product.amount_in_stock < 10;

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative">
        <img
          src={firstImage}
          alt={product.name}
          className="w-full h-48 object-cover"
          onError={(e) => {
            e.target.src = imagePlaceholder;
          }}
        />
        {isSponsored && (
          <Badge className="absolute top-2 right-2" variant="secondary">
            <TrendingUp className="w-3 h-3 mr-1" />
            Sponsored
          </Badge>
        )}
        {isLowStock && (
          <Badge className="absolute top-2 left-2" variant="destructive">
            Low Stock
          </Badge>
        )}
      </div>

      <CardContent className="p-4">
        <h3 className="font-semibold text-lg  truncate mb-1">
          {product.name}
        </h3>
        <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
          {product.desc}
        </p>

        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-lg font-bold text-primary">
              {product.currency} {product.price?.toLocaleString()}
            </p>
            {product.slashed_price && product.slashed_price !== product.price && (
              <p className="text-xs text-muted-foreground line-through">
                {product.currency} {product.slashed_price?.toLocaleString()}
              </p>
            )}
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Stock</p>
            <p className={`text-sm font-semibold ${isLowStock ? 'text-red-600' : 'text-green-600'}`}>
              {product.amount_in_stock}
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            className="flex-1"
            onClick={() => onView(product)}
          >
            <Eye className="w-4 h-4 mr-1" />
            View
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onEdit(product)}
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onDelete(product)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>

        <Button
          size="sm"
          variant="secondary"
          className="w-full mt-2"
          onClick={() => onSponsor(product)}
        >
          <TrendingUp className="w-4 h-4 mr-1" />
          Sponsor Product
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
