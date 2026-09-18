import { useState } from 'react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { motion, type Variants } from 'framer-motion';
import { fetchExpenses } from './api';
import DonutChart from './DonutChart';
import AnimatedNumber from './AnimatedNumber';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, x: -30 },
  visible: { 
    opacity: 1, 
    x: 0, 
    transition: { type: "spring", stiffness: 300, damping: 24 }
  },
};

export default function ExpenseDashboard() {
  const [activeMonthId, setActiveMonthId] = useState<string | null>(null);

  // TanStack Query v5 latest pattern: useSuspenseQuery
  // It pauses rendering until data is ready, meaning `data` is never undefined here.
  const { data } = useSuspenseQuery({
    queryKey: ['expenses'],
    queryFn: fetchExpenses,
  });

  const selectedMonthId = activeMonthId || data[0].id;
  const activeData = data.find((m) => m.id === selectedMonthId)!;

  return (
    <section className="min-h-screen w-full bg-slate-50 flex flex-col lg:flex-row font-sans">
      <aside className="order-2 lg:order-1 w-full lg:w-[420px] lg:min-h-screen bg-white border-t lg:border-t-0 lg:border-r border-gray-200 p-6 md:p-10 flex flex-col shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-10">
        <h1 className="font-bold mb-8 text-gray-900 tracking-tight text-[clamp(1.5rem,4vw,2.25rem)]">
          Household Expenses
        </h1>
        
        <motion.div 
          className="flex flex-col gap-3 flex-1 group has-[:hover]:bg-slate-50/30 transition-colors duration-300 rounded-2xl"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {data.map((month) => {
            const isActive = month.id === selectedMonthId;
            return (
              <motion.button
                key={month.id}
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveMonthId(month.id)}
                className={`p-4 md:p-5 rounded-xl text-left transition-all flex justify-between items-center ${
                  isActive 
                    ? 'bg-brand-primary text-white shadow-md shadow-blue-600/20' 
                    : 'bg-slate-50 hover:bg-slate-100 text-gray-700'
                }`}
              >
                <span className={`font-semibold ${isActive ? 'text-white' : 'text-gray-800'}`}>
                  {month.month}
                </span>
                <span className={`font-mono text-lg flex items-center ${isActive ? 'text-brand-surface' : 'text-gray-500'}`}>
                  $<AnimatedNumber value={month.total} />
                </span>
              </motion.button>
            );
          })}
        </motion.div>
      </aside>

      <main className="order-1 lg:order-2 flex-1 p-8 md:p-12 lg:p-20 flex flex-col items-center justify-center relative bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] @container">
        <div className="w-full max-w-2xl bg-white p-8 md:p-12 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col items-center">
          <div className="transform scale-90 md:scale-100 lg:scale-110 mb-8 w-full max-w-sm">
            <DonutChart data={activeData} allData={data} />
          </div>
          
          <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-y-4 gap-x-2 mt-8 pt-8 border-t border-slate-100">
            {activeData.categories.map(cat => (
              <div key={cat.name} className="flex items-center gap-2.5">
                <div 
                  className="w-3 h-3 rounded-full shadow-sm" 
                  style={{ backgroundColor: cat.color }} 
                />
                <span className="text-sm font-medium text-slate-600 truncate">{cat.name}</span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </section>
  );
}