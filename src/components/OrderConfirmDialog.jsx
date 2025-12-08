import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { imagePlaceholder } from "@/constants";

export function OrderConfirmDialog({
  open,
  onOpenChange,
  order,
  product,
  onConfirm,
  isLoading,
  initialAction,
}) {
  console.log({initialAction});
  // const [initialAction, setConfirmation] = useState(initialAction || "accept");
  const [note, setNote] = useState("");
  if (!order || !product) return null;

  const handleSubmit = async () => {
    await onConfirm(order._id, product.productID, initialAction, note);
    setNote("");
    onOpenChange(false);
  };


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Confirm Order Product</DialogTitle>
          <DialogDescription>
            Review the product details and choose to accept or reject this order item.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Product Info */}
          <div className="flex gap-3 p-3 bg-gray-50 rounded-lg">
            <img
              src={product.image || imagePlaceholder}
              alt={product.name}
              className="w-20 h-20 object-cover rounded"
              onError={(e) => {
                e.target.src = imagePlaceholder;
              }}
            />
            <div className="flex-1">
              <h4 className="font-medium">{product.name}</h4>
              <div className="text-sm text-muted-foreground mt-1">
                {product.variant?.color && (
                  <span className="capitalize">{product.variant.color}</span>
                )}
                {product.variant?.size && (
                  <span> • {product.variant.size}</span>
                )}
              </div>
              <p className="text-sm font-semibold mt-2">
                ₦{product.price?.toLocaleString()} × {product.quantity} = ₦
                {product.total?.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Order Info */}
          <div className="text-sm space-y-1">
            <p className="text-muted-foreground">
              <span className="font-medium text-foreground">Order #:</span>{" "}
              {order.orderNumber}
            </p>
            <p className="text-muted-foreground">
              <span className="font-medium text-foreground">Delivery:</span>{" "}
              {order.shippingAddress.city}, {order.shippingAddress.state}
            </p>
          </div>

          {/* Confirmation Choice */}
          {/* <div>
            <Label>Decision</Label>
            <RadioGroup value={confirmation} onValueChange={setConfirmation}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="accept" id="accept" />
                <Label htmlFor="accept" className="cursor-pointer">
                  Accept this order product
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="reject" id="reject" />
                <Label htmlFor="reject" className="cursor-pointer">
                  Reject this order product
                </Label>
              </div>
            </RadioGroup>
          </div> */}

          {/* Vendor Note */}
          {initialAction === "accept" && (
            <div>
              <Label htmlFor="note">
                Add a note (optional)
              </Label>
              <Textarea
                id="note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="E.g., Ensure to be handled in the upright position"
                rows={3}
              />
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              setNote("");
              onOpenChange(false);
            }}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isLoading}
            variant={initialAction === "reject" ? "destructive" : "default"}
          >
            {isLoading
              ? "Processing..."
              : initialAction === "accept"
              ? "Accept Order"
              : "Reject Order"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
