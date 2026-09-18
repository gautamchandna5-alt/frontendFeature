import { Suspense } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ExpenseDashboard from './features/expenses/ExpenseDashboard';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 10,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      {/* React 18+ Suspense Boundary handles the loading state natively */}
      <Suspense 
        fallback={
          <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 font-sans text-slate-500 animate-pulse">
            Loading dashboard architecture...
          </div>
        }
      >
        <ExpenseDashboard />
      </Suspense>
    </QueryClientProvider>
  );
}