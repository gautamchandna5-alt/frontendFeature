import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ExpenseDashboard from './features/expenses/ExpenseDashboard';

// Initialize outside the component to prevent recreating it on re-renders
const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-slate-50 py-12">
        <ExpenseDashboard />
      </div>
    </QueryClientProvider>
  );
}