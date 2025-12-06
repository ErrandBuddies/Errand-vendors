import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { sponsorshipService } from '@/services/api';
import { QUERY_KEYS } from './queryKeys';
import { useToast } from '@/hooks/use-toast';

/**
 * Query hook for fetching sponsorship plans
 */
export function useSponsorshipPlansQuery() {
  return useQuery({
    queryKey: ['sponsorship-plans'],
    queryFn: async () => {
      const response = await sponsorshipService.getSponsorshipPlans();
      return response.data || [];
    },
    staleTime: 10 * 60 * 1000, // Plans don't change often, cache for 10 minutes
  });
}

/**
 * Mutation hook for initiating product sponsorship
 */
export function useInitiateSponsorshipMutation() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: (payload) => sponsorshipService.initiateSponsorship(payload),
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to initiate sponsorship',
      });
    },
  });
}

/**
 * Mutation hook for completing product sponsorship
 */
export function useCompleteSponsorshipMutation() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (payload) => sponsorshipService.completeSponsorship(payload),
    onSuccess: (response) => {
      // Invalidate products cache to refresh sponsored status
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PRODUCTS });
      
      toast({
        variant: 'success',
        title: 'Success',
        description: 'Product sponsored successfully! 🎉',
      });
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to complete sponsorship',
      });
    },
  });
}
