import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ExpenseDashboard from './features/expenses/ExpenseDashboard';

// Explicit caching strategy
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Data remains "fresh" for 5 minutes. No background refetching will occur during this time.
      staleTime: 1000 * 60 * 5, 
      // Keep data in the cache for 10 minutes before garbage collecting it.
      gcTime: 1000 * 60 * 10,
      // Prevents the random DummyJSON data from shifting when the user switches browser tabs
      refetchOnWindowFocus: false, 
      // Do not automatically retry if DummyJSON throws a 500 error
      retry: 1, 
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ExpenseDashboard />
    </QueryClientProvider>
  );
}