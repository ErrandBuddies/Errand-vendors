import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { productService } from "@/services/api";
import { QUERY_KEYS } from "./queryKeys";
import { useToast } from "@/hooks/use-toast";

/**
 * Query hook for fetching all products
 */
export function useProductsQuery() {
  return useQuery({
    queryKey: QUERY_KEYS.PRODUCTS,
    queryFn: async () => {
      const response = await productService.getProducts();
      return response.data || [];
    },
  });
}

/**
 * Mutation hook for creating a new product
 */
export function useCreateProductMutation() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (payload) => productService.createProduct(payload),
    onSuccess: (response) => {
      // Invalidate and refetch products
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PRODUCTS });

      toast({
        variant: "success",
        title: "Success",
        description: "Product added successfully",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to add product",
      });
    },
  });
}

/**
 * Mutation hook for updating a product
 */
export function useUpdateProductMutation() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, payload }) => productService.updateProduct(id, payload),
    onSuccess: () => {
      // Invalidate product queries to refetch updated data
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PRODUCTS });

      toast({
        variant: "success",
        title: "Success",
        description: "Product updated successfully",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to update product",
      });
    },
  });
}

/**
 * Mutation hook for deleting a product
 */
export function useDeleteProductMutation() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, reason }) => productService.deleteProduct(id, reason),
    onMutate: async ({ id }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.PRODUCTS });

      // Snapshot previous value
      const previousProducts = queryClient.getQueryData(QUERY_KEYS.PRODUCTS);

      // Optimistically update by removing the product
      queryClient.setQueryData(
        QUERY_KEYS.PRODUCTS,
        (old) => old?.filter((product) => product._id !== id) || []
      );

      // Return context with previous products for rollback
      return { previousProducts };
    },
    onSuccess: () => {
      toast({
        variant: "success",
        title: "Success",
        description: "Product deleted successfully",
      });
    },
    onError: (error, variables, context) => {
      // Rollback on error
      if (context?.previousProducts) {
        queryClient.setQueryData(QUERY_KEYS.PRODUCTS, context.previousProducts);
      }

      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to delete product",
      });
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PRODUCTS });
    },
  });
}
