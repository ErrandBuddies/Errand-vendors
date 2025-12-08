import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Package, DollarSign, TrendingUp, ShoppingCart } from "lucide-react";
import { useDashboardQuery } from "@/hooks/queries";

const Dashboard = () => {
  const { toast } = useToast();

  // Use React Query to fetch dashboard data
  const { data, isLoading, isError, error } = useDashboardQuery({});

  // Show toast for errors
  if (isError) {
    toast({
      variant: "destructive",
      title: "Error",
      description: error?.message || "Failed to load dashboard data",
    });
  }

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const stats = [
    {
      title: "Total Sales",
      value: data?.sales?.totalSales || 0,
      icon: ShoppingCart,
      color: "text-blue-600",
    },
    {
      title: "Sales Revenue",
      value: `₦${(data?.sales?.salesRevenue || 0).toLocaleString()}`,
      icon: DollarSign,
      color: "text-green-600",
    },
    {
      title: "Total Payments",
      value: data?.transactions?.totalPayments || 0,
      icon: Package,
      color: "text-purple-600",
    },
    {
      title: "Transaction Revenue",
      value: `₦${(
        data?.transactions?.transactionRevenue || 0
      ).toLocaleString()}`,
      icon: TrendingUp,
      color: "text-secondary",
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">
                      {stat.title}
                    </p>
                    <p className="text-xl font-bold mt-1">{stat.value}</p>
                  </div>
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Sales */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent Sales</CardTitle>
        </CardHeader>
        <CardContent>
          {data?.sales?.data && data.sales.data.length > 0 ? (
            <div className="space-y-3">
              {data.sales.data.slice(0, 5).map((sale) => (
                <div
                  key={sale._id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex-1">
                    <p className="font-medium text-sm">{sale.productName}</p>
                    <p className="text-xs text-muted-foreground">
                      {sale.customer.firstname} {sale.customer.lastname}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-sm">
                      ₦{sale.amount.toLocaleString()}
                    </p>
                    <p
                      className={`text-xs ${
                        sale.status === "completed"
                          ? "text-green-600"
                          : "text-yellow-600"
                      }`}
                    >
                      {sale.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">
              No sales data available
            </p>
          )}
        </CardContent>
      </Card>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          {data?.transactions?.data && data.transactions.data.length > 0 ? (
            <div className="space-y-3">
              {data.transactions.data.slice(0, 5).map((transaction) => (
                <div
                  key={transaction._id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex-1">
                    <p className="font-medium text-sm">
                      {transaction.description}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(transaction.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p
                      className={`font-semibold text-sm ${
                        transaction.type === "Credit"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {transaction.type === "Credit" ? "+" : "-"}₦
                      {transaction.amount.toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground capitalize">
                      {transaction.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">
              No transactions available
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
