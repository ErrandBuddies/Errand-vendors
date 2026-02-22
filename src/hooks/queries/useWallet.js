import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { walletService } from "@/services/api";
import { QUERY_KEYS } from "./queryKeys";
import { useToast } from "@/hooks/use-toast";

/**
 * Query hook for fetching wallet balance
 */
export function useWalletBalanceQuery() {
  return useQuery({
    queryKey: QUERY_KEYS.WALLET_BALANCE,
    queryFn: async () => {
      const response = await walletService.getWalletBalance();
      // Adjusting to match the sample response structure: response.data is the wrapper, actual data is inside response.data.data
      // Based on typical patterns in this codebase, we might need to check if the service already unwraps it.
      // Looking at api.js, it returns response.data.
      // So if the API returns { success: true, data: { ... } }, then we just return that.
      return response.data;
    },
  });
}

/**
 * Query hook for fetching list of banks
 */
export function useBanksQuery() {
  return useQuery({
    queryKey: QUERY_KEYS.BANKS,
    queryFn: async () => {
      const response = await walletService.getBanks();
      return response.data;
    },
  });
}

/**
 * Mutation hook for initiating withdrawal (resolving account)
 */
export function useInitiateWithdrawalMutation() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: (payload) => walletService.initiateWithdrawal(payload),
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error.response?.data?.message || "Failed to initiate withdrawal",
      });
    },
  });
}

/**
 * Mutation hook for completing withdrawal
 */
export function useCompleteWithdrawalMutation() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (payload) => walletService.completeWithdrawal(payload),
    onSuccess: (response) => {
      queryClient.invalidateQueries([QUERY_KEYS.WALLET_BALANCE]);
      toast({
        variant: "success",
        title: "Success",
        description: response.message || "Withdrawal successful",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error.response?.data?.message || "Failed to complete withdrawal",
      });
    },
  });
}
