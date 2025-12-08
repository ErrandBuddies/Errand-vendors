import { format } from "date-fns";
import { Package, MapPin, Truck, CheckCircle, Clock, XCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { imagePlaceholder } from "@/constants";

const OrderCard = ({ order, onConfirm }) => {
  // Get the status badge variant based on order status
  const getStatusBadge = (status) => {
    const statusLower = status.toLowerCase();
    
    if (statusLower.includes("pending")) {
      return { variant: "secondary", icon: Clock, color: "text-yellow-600" };
    }
    if (statusLower.includes("confirmed") || statusLower.includes("processing")) {
      return { variant: "default", icon: Package, color: "text-blue-600" };
    }
    if (statusLower.includes("dispatched") || statusLower.includes("courier")) {
      return { variant: "outline", icon: Truck, color: "text-purple-600" };
    }
    if (statusLower.includes("delivered")) {
      return { variant: "default", icon: CheckCircle, color: "text-green-600" };
    }
    if (statusLower.includes("completed")) {
      return { variant: "default", icon: CheckCircle, color: "text-green-700" };
    }
    if (statusLower.includes("rejected") || statusLower.includes("declined")) {
      return { variant: "destructive", icon: XCircle, color: "text-red-600" };
    }
    
    return { variant: "outline", icon: Package, color: "text-gray-600" };
  };

  const statusBadge = getStatusBadge(order.status);
  const StatusIcon = statusBadge.icon;

  // Check if there are pending products
  const hasPendingProducts = order.products.some(
    (p) => p.confirmationStatus === "Pending"
  );

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-semibold text-lg">Order #{order.orderNumber}</h3>
            <p className="text-sm text-muted-foreground">
              {order.createdAt ? format(new Date(order.createdAt), "PPP p") : "N/A"}
            </p>
          </div>
          {/* <Badge variant={statusBadge.variant} className="flex items-center gap-1">
            <StatusIcon className="w-3 h-3" />
            {order.status}
          </Badge> */}
        </div>

        {/* Products */}
        <div className="space-y-3 mb-4">
          {order.products.map((product) => (
            <div
              key={product._id}
              className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
            >
              <img
                src={product.image || imagePlaceholder}
                alt={product.name}
                className="w-16 h-16 object-cover rounded"
                onError={(e) => {
                  e.target.src = imagePlaceholder;
                }}
              />
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm truncate">{product.name}</h4>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                  {product.variant?.color && (
                    <span className="capitalize">{product.variant.color}</span>
                  )}
                  {product.variant?.size && (
                    <span>• {product.variant.size}</span>
                  )}
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-sm font-semibold">
                    ₦{product.price?.toLocaleString()} × {product.quantity}
                  </span>
                  <Badge
                    variant={
                      product.confirmationStatus === "Pending"
                        ? "secondary"
                        : product.confirmationStatus === "Confirmed"
                        ? "default"
                        : product.confirmationStatus === "Delivered"
                        ? "success"
                        : "destructive"
                    }
                    className="text-xs"
                  >
                    {product.confirmationStatus === "Confirmed" ? "Ongoing" : product.confirmationStatus}
                  </Badge>
                </div>

                {/* Accept/Reject buttons for pending products */}
                {product.confirmationStatus === "Pending" && (
                  <div className="flex gap-2 mt-3">
                    <Button
                      size="sm"
                      onClick={() =>
                        onConfirm(order._id, product.productID, "accept", product)
                      }
                      className="flex-1"
                    >
                      Accept
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() =>
                        onConfirm(order._id, product.productID, "reject", product)
                      }
                      className="flex-1"
                    >
                      Reject
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Shipping Address */}
        <div className="border-t pt-4">
          <div className="flex items-start gap-2 text-sm">
            <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
            <div>
              <p className="font-medium mb-1">Shipping Address</p>
              <p className="text-muted-foreground text-xs">
                {order.shippingAddress.address}, {order.shippingAddress.city}
                <br />
                {order.shippingAddress.state}, {order.shippingAddress.country}
                <br />
                {/* {order.shippingAddress.phone1} */}
              </p>
            </div>
          </div>
        </div>

        {/* Tracking Info */}
        {order.trackingInfos && (
          <div className="border-t mt-4 pt-4">
            <div className="flex items-start gap-2 text-sm">
              <Truck className="w-4 h-4 text-muted-foreground mt-0.5" />
              <div>
                <p className="font-medium mb-1">Tracking Information</p>
                <p className="text-muted-foreground text-xs">
                  {order.trackingInfos.providerName?.toUpperCase()} -{" "}
                  {order.trackingInfos.trackingNumber}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Timeline */}
        {order.timeline && order.timeline.length > 0 && (
          <div className="border-t mt-4 pt-4">
            <p className="font-medium text-sm mb-2">Order Timeline</p>
            <div className="space-y-2">
              {order.timeline.slice(0, 2).map((event, index) => (
                <div key={event._id || index} className="text-xs pl-4 border-l-2 border-primary/20">
                  <p className="font-medium">{event.status}</p>
                  <p className="text-muted-foreground">{event.message}</p>
                  <p className="text-muted-foreground mt-1">
                    {event.timestamp ? format(new Date(event.timestamp), "PPP p") : ""}
                  </p>
                </div>
              ))}
              {order.timeline.length > 2 && (
                <p className="text-xs text-muted-foreground pl-4">
                  +{order.timeline.length - 2} more events
                </p>
              )}
            </div>
          </div>
        )}

        {/* Vendor Notes */}
        {order.vendorNotes.map(note => (
          <div className="border-t mt-4 pt-4">
            <p className="font-medium text-sm mb-1">Your Notes</p>
            <p className="text-xs text-muted-foreground italic">"{note.note}"</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default OrderCard;
