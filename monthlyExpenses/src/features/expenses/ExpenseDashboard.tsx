import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { fetchExpenses } from './api.ts';
import DonutChart from './DonutChart';

export default function ExpenseDashboard() {
  const [activeMonthId, setActiveMonthId] = useState<string | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['expenses'],
    queryFn: fetchExpenses,
  });

  if (isLoading) return <div className="p-8 text-center animate-pulse">Loading dashboard...</div>;
  if (isError || !data) return <div className="p-8 text-red-500">Failed to load data.</div>;

  // Default to the first month if nothing is selected yet
  const selectedMonthId = activeMonthId || data[0].id;
  const activeData = data.find((m) => m.id === selectedMonthId)!;

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white rounded-xl shadow-sm border border-gray-100">
      <h1 className="text-2xl font-bold mb-8 text-gray-800">Household Expenses</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Left Side: Month List */}
        <div className="flex flex-col gap-3">
          {data.map((month) => {
            const isActive = month.id === selectedMonthId;
            return (
              <motion.button
                key={month.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveMonthId(month.id)}
                className={`p-4 rounded-lg text-left transition-colors flex justify-between items-center ${
                  isActive ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50 hover:bg-gray-100'
                }`}
              >
                <span className={`font-medium ${isActive ? 'text-blue-700' : 'text-gray-700'}`}>
                  {month.month}
                </span>
                <span className="text-gray-500 font-mono">${month.total}</span>
              </motion.button>
            );
          })}
        </div>

        {/* Right Side: Chart & Legend */}
        <div className="flex flex-col items-center justify-center">
          <DonutChart data={activeData} allData={data} />
          
          {/* Legend */}
          <div className="mt-8 flex flex-wrap gap-4 justify-center">
            {activeData.categories.map(cat => (
              <div key={cat.name} className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: cat.color }} 
                />
                <span className="text-sm text-gray-600">{cat.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}