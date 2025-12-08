import { useState, useMemo } from "react";
import { ShoppingCart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import OrderCard from "@/components/OrderCard";
import { OrderConfirmDialog } from "@/components/OrderConfirmDialog";
import { useOrdersQuery, useConfirmOrderMutation } from "@/hooks/queries";
import Loader from "../components/ui/Loader";

const Orders = () => {
  const { data: orders = [], isLoading, isError, error } = useOrdersQuery();
  const confirmOrderMutation = useConfirmOrderMutation();

  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [initialAction, setInitialAction] = useState("accept");

  // Filter orders by status
  const filteredOrders = useMemo(() => {
    return {
      all: orders,
      pending: orders.filter((order) =>
        order.products.some((p) => p.confirmationStatus === "Pending")
      ),
      ongoing: orders.filter((order) =>
        order.products.some((p) => p.confirmationStatus === "Confirmed") &&
        !order.products.some((p) => p.confirmationStatus === "Delivered")
      ),
      completed: orders.filter((order) =>
        order.products.every((p) => p.confirmationStatus === "Delivered")
      ),
    };
  }, [orders]);

  const handleConfirmClick = (orderId, productId, action, product) => {
    const order = orders.find((o) => o._id === orderId);
    if (!order) return;

    setSelectedOrder(order);
    setSelectedProduct(product);
    setInitialAction(action);
    setShowConfirmDialog(true);
  };

  const handleConfirmOrder = async (orderId, productId, confirmation, note) => {
    await confirmOrderMutation.mutateAsync({
      orderId,
      productId,
      confirmation,
      note: note || undefined,
    });
  };

  if (isLoading) {
    return <Loader text="Loading orders..." />;
  }

  if (isError) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-destructive">
              {error?.message || "Failed to load orders"}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      {/* <div>
        <h1 className="text-3xl font-bold">Orders</h1>
        <p className="text-muted-foreground">
          Manage your customer orders and confirmations
        </p>
      </div> */}

      {/* Tabbed Interface */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-4">
          <TabsTrigger value="all">
            All
            {filteredOrders.all.length > 0 && (
              <span className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-xs">
                {filteredOrders.all.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="pending">
            Pending
            {filteredOrders.pending.length > 0 && (
              <span className="ml-2 rounded-full bg-yellow-100 px-2 py-0.5 text-xs text-yellow-700">
                {filteredOrders.pending.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="ongoing">
            Ongoing
            {filteredOrders.ongoing.length > 0 && (
              <span className="ml-2 rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-700">
                {filteredOrders.ongoing.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed
            {filteredOrders.completed.length > 0 && (
              <span className="ml-2 rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-700">
                {filteredOrders.completed.length}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        {/* All Orders Tab */}
        <TabsContent value="all" className="space-y-4 mt-6">
          {filteredOrders.all.length === 0 ? (
            <Card>
              <CardContent className="p-12">
                <div className="text-center">
                  <ShoppingCart className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No orders yet
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Your orders will appear here when customers make purchases
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredOrders.all.map((order) => (
                <OrderCard
                  key={order._id}
                  order={order}
                  onConfirm={handleConfirmClick}
                />
              ))}
            </div>
          )}
        </TabsContent>

        {/* Pending Orders Tab */}
        <TabsContent value="pending" className="space-y-4 mt-6">
          {filteredOrders.pending.length === 0 ? (
            <Card>
              <CardContent className="p-12">
                <div className="text-center">
                  <ShoppingCart className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No pending orders
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Orders that need your confirmation will appear here
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            
              {filteredOrders.pending.map((order) => (
                <OrderCard
                  key={order._id}
                  order={order}
                  onConfirm={handleConfirmClick}
                />
              ))}
            </div>
          )}
        </TabsContent>

        {/* Ongoing Orders Tab */}
        <TabsContent value="ongoing" className="space-y-4 mt-6">
          {filteredOrders.ongoing.length === 0 ? (
            <Card>
              <CardContent className="p-12">
                <div className="text-center">
                  <ShoppingCart className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No ongoing orders
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Confirmed orders being processed will appear here
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredOrders.ongoing.map((order) => (
                <OrderCard
                  key={order._id}
                  order={order}
                  onConfirm={handleConfirmClick}
                />
              ))}
            </div>
          )}
        </TabsContent>

        {/* Completed Orders Tab */}
        <TabsContent value="completed" className="space-y-4 mt-6">
          {filteredOrders.completed.length === 0 ? (
            <Card>
              <CardContent className="p-12">
                <div className="text-center">
                  <ShoppingCart className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No completed orders
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Your completed orders will appear here
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredOrders.completed.map((order) => (
                <OrderCard
                  key={order._id}
                  order={order}
                  onConfirm={handleConfirmClick}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Order Confirmation Dialog */}
      <OrderConfirmDialog
        open={showConfirmDialog}
        onOpenChange={setShowConfirmDialog}
        order={selectedOrder}
        product={selectedProduct}
        onConfirm={handleConfirmOrder}
        isLoading={confirmOrderMutation.isPending}
        initialAction={initialAction}
      />
    </div>
  );
};

export default Orders;
