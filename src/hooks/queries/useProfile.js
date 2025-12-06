import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { profileService } from "@/services/api";
import { QUERY_KEYS } from "./queryKeys";
import { useToast } from "@/hooks/use-toast";

/**
 * Query hook for fetching vendor profile
 */
export function useVendorProfileQuery() {
  return useQuery({
    queryKey: QUERY_KEYS.VENDOR_PROFILE,
    queryFn: async () => {
      const response = await profileService.getVendorProfile();
      return response.data;
    },
  });
}

/**
 * Mutation hook for updating personal profile information
 */
export function useUpdateProfileMutation() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (payload) => profileService.updateProfile(payload),
    onSuccess: (response) => {
      // Update cache with new data
      if (response.data) {
        queryClient.setQueryData(QUERY_KEYS.VENDOR_PROFILE, response.data);
      }

      toast({
        variant: "success",
        title: "Success",
        description: "Profile updated successfully",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to update profile",
      });
    },
  });
}

/**
 * Mutation hook for updating address information
 */
export function useUpdateAddressMutation() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (payload) => profileService.updateAddress(payload),
    onSuccess: (response) => {
      // Update cache with new data
      if (response.data) {
        queryClient.setQueryData(QUERY_KEYS.VENDOR_PROFILE, response.data);
      }

      toast({
        variant: "success",
        title: "Success",
        description: "Address updated successfully",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to update address",
      });
    },
  });
}

/**
 * Mutation hook for submitting profile verification
 */
export function useVerifyProfileMutation() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (payload) => profileService.verifyProfile(payload),
    onSuccess: (response) => {
      // Update cache with new verified data
      if (response.data) {
        queryClient.setQueryData(QUERY_KEYS.VENDOR_PROFILE, response.data);
      }

      toast({
        variant: "success",
        title: "Success",
        description: "Verification submitted successfully",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to submit verification",
      });
    },
  });
}
