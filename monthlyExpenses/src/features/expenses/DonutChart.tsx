import { motion } from 'framer-motion';
import type { MonthData } from './api.ts';

interface Props {
  data: MonthData;
}

export default function DonutChart({ data }: Props) {
  let currentOffset = 0; // Keeps track of where the next slice should start

  return (
    <div className="relative w-64 h-64 mx-auto">
      <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
        {data.categories.map((category) => {
          // Calculate percentage of the total
          const percentage = (category.amount / data.total) * 100;
          const strokeDasharray = `${percentage} ${100 - percentage}`;
          const strokeDashoffset = -currentOffset;
          
          // Add this slice's percentage to the offset for the NEXT slice
          currentOffset += percentage;

          return (
            <motion.circle
              key={category.name}
              cx="18"
              cy="18"
              r="15.9155"
              fill="transparent"
              stroke={category.color}
              strokeWidth="4"
              // Framer Motion automatically animates these changes when the data swaps!
              initial={false}
              animate={{
                strokeDasharray,
                strokeDashoffset,
              }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="cursor-pointer hover:opacity-80 transition-opacity"
            />
          );
        })}
      </svg>
      
      {/* Center Label */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="text-sm text-gray-500">Total</span>
        <span className="text-2xl font-bold">${data.total}</span>
      </div>
    </div>
  );
}