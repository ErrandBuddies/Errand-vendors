import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { serviceService } from "@/services/api";
import { QUERY_KEYS } from "./queryKeys";
import { useToast } from "@/hooks/use-toast";

/**
 * Query hook for fetching all services
 */
export function useServicesQuery() {
  return useQuery({
    queryKey: QUERY_KEYS.SERVICES,
    queryFn: async () => {
      const response = await serviceService.getServices();
      return response.data || [];
    },
  });
}

/**
 * Mutation hook for creating a new service
 */
export function useCreateServiceMutation() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (payload) => serviceService.createService(payload),
    onSuccess: (response) => {
      // Invalidate and refetch services
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.SERVICES });

      toast({
        variant: "success",
        title: "Success",
        description: "Service added successfully",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to add service",
      });
    },
  });
}

/**
 * Mutation hook for updating a service
 */
export function useUpdateServiceMutation() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, payload }) => serviceService.updateService(id, payload),
    onSuccess: () => {
      // Invalidate service queries to refetch updated data
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.SERVICES });

      toast({
        variant: "success",
        title: "Success",
        description: "Service updated successfully",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to update service",
      });
    },
  });
}

/**
 * Mutation hook for deleting a service
 */
export function useDeleteServiceMutation() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, reason }) => serviceService.deleteService(id, reason),
    onMutate: async ({ id }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.SERVICES });

      // Snapshot previous value
      const previousServices = queryClient.getQueryData(QUERY_KEYS.SERVICES);

      // Optimistically update by removing the service
      queryClient.setQueryData(
        QUERY_KEYS.SERVICES,
        (old) => old?.filter((service) => service._id !== id) || []
      );

      // Return context with previous services for rollback
      return { previousServices };
    },
    onSuccess: () => {
      toast({
        variant: "success",
        title: "Success",
        description: "Service deleted successfully",
      });
    },
    onError: (error, variables, context) => {
      // Rollback on error
      if (context?.previousServices) {
        queryClient.setQueryData(QUERY_KEYS.SERVICES, context.previousServices);
      }

      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to delete service",
      });
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.SERVICES });
    },
  });
}
