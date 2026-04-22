import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { orderService } from "@/services/api";
import { QUERY_KEYS } from "./queryKeys";
import { useToast } from "@/hooks/use-toast";

/**
 * Query hook for fetching all orders
 */
export function useOrdersQuery(status = "") {
  return useQuery({
    queryKey: [...QUERY_KEYS.ORDERS, status],
    queryFn: async () => {
      const response = await orderService.getOrders(status);
      return response.data || [];
    },
  });
}

/**
 * Mutation hook for confirming/rejecting order products
 */
export function useConfirmOrderMutation() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (payload) => orderService.confirmOrder(payload),
    onSuccess: (response) => {
      // Invalidate and refetch orders
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ORDERS });

      toast({
        variant: "success",
        title: "Success",
        description: response.message || "Order confirmed successfully",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to confirm order",
      });
    },
  });
}
