import { useState } from 'react';
import { motion, useReducedMotion, type Transition } from 'framer-motion';
import AnimatedNumber from './AnimatedNumber';
import type { MonthData } from './api';

interface Props {
  data: MonthData;
  allData: MonthData[];
}

export default function DonutChart({ data, allData }: Props) {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  
  // Accessibility: Detect OS-level motion preferences
  const shouldReduceMotion = useReducedMotion();
  
  // Conditionally remove animations if reduced motion is requested, strictly typed for TypeScript
  const springTransition: Transition = shouldReduceMotion 
    ? { duration: 0 } 
    : { type: "spring", stiffness: 350, damping: 22 };
    
  const dashTransition: Transition = shouldReduceMotion 
    ? { duration: 0 } 
    : { duration: 0.4, ease: [0.25, 1, 0.5, 1] };

  let currentOffset = 0;
  const opacities = [1, 0.8, 0.6, 0.4];
  
  const hoveredColor = hoveredCategory 
    ? data.categories.find(c => c.name === hoveredCategory)?.color 
    : null;

  return (
    <div className="relative w-full aspect-square mx-auto">
      <svg viewBox="0 0 44 44" className="w-full h-full transform -rotate-90 overflow-visible">
        {data.categories.map((category) => {
          const isHovered = hoveredCategory === category.name;
          const basePercentage = (category.amount / data.total) * 100;
          const startOffset = currentOffset;

          const midPercentage = startOffset + basePercentage / 2;
          const angleRad = (midPercentage / 100) * 2 * Math.PI;
          
          const pushDistance = 2.8;
          const dx = pushDistance * Math.cos(angleRad);
          const dy = pushDistance * Math.sin(angleRad);

          const allMonthsAmount = allData.map(
            (m) => m.categories.find((c) => c.name === category.name)?.amount || 0
          );
          const totalCatAmount = allMonthsAmount.reduce((a, b) => a + b, 0) || 1;

          let subOffset = startOffset;
          currentOffset += basePercentage;

          return (
            <g key={category.name}>
              <motion.circle
                cx="22" cy="22" r="15.9155"
                fill="none" stroke="transparent" strokeWidth="16"
                animate={{ strokeDasharray: `0 ${startOffset} ${basePercentage} 1000` }}
                transition={dashTransition}
                style={{ pointerEvents: 'stroke', cursor: 'pointer' }}
                onMouseEnter={() => setHoveredCategory(category.name)}
                onMouseLeave={() => setHoveredCategory(null)}
                // Accessibility: Allow keyboard users to tab to chart elements
                tabIndex={0}
                onFocus={() => setHoveredCategory(category.name)}
                onBlur={() => setHoveredCategory(null)}
              />

              <motion.g
                animate={{
                  x: isHovered ? dx : 0,
                  y: isHovered ? dy : 0,
                }}
                transition={springTransition}
                style={{ pointerEvents: 'none' }}
              >
                <motion.circle
                  cx="22" cy="22" r="15.9155"
                  fill="none" stroke={category.color}
                  strokeWidth={isHovered ? 5.5 : 4}
                  animate={{ 
                    opacity: isHovered ? 0 : 1,
                    strokeDasharray: `0 ${startOffset} ${basePercentage} 1000`
                  }}
                  transition={{ 
                    opacity: { duration: shouldReduceMotion ? 0 : 0.15 },
                    strokeDasharray: dashTransition
                  }}
                />

                {allData.map((month, idx) => {
                  const monthAmount = month.categories.find((c) => c.name === category.name)?.amount || 0;
                  const subPercentage = (monthAmount / totalCatAmount) * basePercentage;
                  const gap = Math.min(0.4, subPercentage * 0.25);
                  const visibleLength = Math.max(0.1, subPercentage - gap);
                  const subDasharray = `0 ${subOffset + gap / 2} ${visibleLength} 1000`;
                  
                  const slice = (
                    <motion.circle
                      key={month.id} cx="22" cy="22" r="15.9155"
                      fill="none" stroke={category.color} strokeWidth={5.5}
                      animate={{ 
                        opacity: isHovered ? opacities[idx] : 0,
                        strokeDasharray: subDasharray
                      }}
                      transition={{ 
                        opacity: { duration: shouldReduceMotion ? 0 : 0.15 },
                        strokeDasharray: dashTransition
                      }}
                    />
                  );
                  subOffset += subPercentage;
                  return slice;
                })}
              </motion.g>
            </g>
          );
        })}
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="text-sm font-medium text-gray-500">
          {hoveredCategory || 'Total'}
        </span>
        <span className="text-2xl font-bold text-gray-800 flex items-center">
          $<AnimatedNumber 
            value={hoveredCategory ? (data.categories.find((c) => c.name === hoveredCategory)?.amount || 0) : data.total} 
          />
        </span>
        
        {hoveredCategory && hoveredColor && (
          <div className="flex gap-1.5 mt-1.5">
            {allData.map((month, idx) => (
              <div key={month.id} className="flex flex-col items-center">
                <div 
                  className="w-2 h-2 rounded-full mb-0.5" 
                  style={{ backgroundColor: hoveredColor, opacity: opacities[idx] }} 
                />
                <span className="text-[9px] text-gray-400 font-medium uppercase">
                  {month.month.substring(0, 3)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}