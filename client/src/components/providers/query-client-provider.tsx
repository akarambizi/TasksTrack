import { QueryClient, QueryClientProvider as TanstackQueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";
import { AxiosError } from 'axios';
import { CACHE_TIMES } from '../../queries/constants';

interface QueryClientProviderProps {
  children: React.ReactNode;
}

export const QueryClientProvider = ({ children }: QueryClientProviderProps) => {
  // Create a new QueryClient instance for each user session to prevent
  // data leakage between users and to ensure a clean state on logout
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: CACHE_TIMES.SHORT, // 1 minute
            refetchOnWindowFocus: false,
            retry: (failureCount: number, error: Error) => {
              // Don't retry on 401 Unauthorized or 403 Forbidden errors
              const axiosError = error as AxiosError;
              if (axiosError?.response?.status === 401 || axiosError?.response?.status === 403) {
                return false;
              }
              // Otherwise retry up to 2 times
              return failureCount < 2;
            }
          },
        },
      })
  );

  return (
    <TanstackQueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </TanstackQueryClientProvider>
  );
};
