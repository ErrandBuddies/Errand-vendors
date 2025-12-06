import { QueryClient } from "@tanstack/react-query";

/**
 * Query Client Configuration
 *
 * Global defaults for all queries and mutations in the application
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Time until data is considered stale (5 minutes)
      staleTime: 5 * 60 * 1000,

      // Time until inactive queries are garbage collected (10 minutes)
      gcTime: 10 * 60 * 1000,

      // Refetch data when window regains focus
      refetchOnWindowFocus: true,

      // Refetch data when reconnecting to the internet
      refetchOnReconnect: true,

      // Retry failed requests once
      retry: 1,

      // Don't refetch on mount if data is fresh
      refetchOnMount: false,
    },
    mutations: {
      // Retry failed mutations once
      retry: 1,
    },
  },
});
