import { useState } from 'react';
import { motion } from 'framer-motion';
import type { MonthData } from './api';
import AnimatedNumber from './AnimatedNumber';

interface Props {
  data: MonthData;
  allData: MonthData[];
}

export default function DonutChart({ data, allData }: Props) {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  let currentOffset = 0;

  // 4 opacities to visually distinguish the 4 months
  const opacities = [1, 0.8, 0.6, 0.4];
  
  // Grab the color of the hovered category for the micro-legend
  const hoveredColor = hoveredCategory 
    ? data.categories.find(c => c.name === hoveredCategory)?.color 
    : null;

  return (
    <div className="relative w-72 h-72 mx-auto">
      <svg viewBox="0 0 44 44" className="w-full h-full transform -rotate-90 overflow-visible">
        {data.categories.map((category) => {
          const isHovered = hoveredCategory === category.name;
          const basePercentage = (category.amount / data.total) * 100;
          const startOffset = currentOffset;

          // 1. Polar math to find the exact radial angle of this slice
          const midPercentage = startOffset + basePercentage / 2;
          const angleRad = (midPercentage / 100) * 2 * Math.PI;
          
          // Distance to push outward into the white space (SVG units)
          const pushDistance = 2.8;
          const dx = pushDistance * Math.cos(angleRad);
          const dy = pushDistance * Math.sin(angleRad);

          // 2. Breakdown calculation across all 4 months
          const allMonthsAmount = allData.map(
            (m) => m.categories.find((c) => c.name === category.name)?.amount || 0
          );
          const totalCatAmount = allMonthsAmount.reduce((a, b) => a + b, 0) || 1;

          let subOffset = startOffset;
          currentOffset += basePercentage;

          return (
            // Wrap in a standard, stationary SVG group
            <g key={category.name}>
              
              {/* 1. Stationary Invisible Hitbox: Never moves, just catches mouse events */}
              <circle
                cx="22"
                cy="22"
                r="15.9155"
                fill="none"
                stroke="transparent"
                strokeWidth="16" // Increased to 16 to create a massive, forgiving hover area
                strokeDasharray={`0 ${startOffset} ${basePercentage} 1000`}
                style={{ pointerEvents: 'stroke', cursor: 'pointer' }}
                onMouseEnter={() => setHoveredCategory(category.name)}
                onMouseLeave={() => setHoveredCategory(null)}
              />

              {/* 2. Moving Visuals: Translates outward, but completely ignores mouse events */}
              <motion.g
                animate={{
                  x: isHovered ? dx : 0,
                  y: isHovered ? dy : 0,
                }}
                transition={{ type: "spring", stiffness: 350, damping: 22 }}
                style={{ pointerEvents: 'none' }} // Crucial: prevents hover loops
              >
                {/* Base Slice: visible normally, fades out when hovered */}
                <motion.circle
                  cx="22"
                  cy="22"
                  r="15.9155"
                  fill="none"
                  stroke={category.color}
                  strokeWidth={isHovered ? 5.5 : 4}
                  strokeDasharray={`0 ${startOffset} ${basePercentage} 1000`}
                  animate={{ opacity: isHovered ? 0 : 1 }}
                  transition={{ duration: 0.15 }}
                />

                {/* The 4 Month Split Blocks: only visible on hover */}
                {allData.map((month, idx) => {
                  const monthAmount =
                    month.categories.find((c) => c.name === category.name)?.amount || 0;
                  const subPercentage = (monthAmount / totalCatAmount) * basePercentage;
                  
                  const gap = Math.min(0.4, subPercentage * 0.25);
                  const visibleLength = Math.max(0.1, subPercentage - gap);
                  const subDasharray = `0 ${subOffset + gap / 2} ${visibleLength} 1000`;
                  
                  const slice = (
                    <motion.circle
                      key={month.id}
                      cx="22"
                      cy="22"
                      r="15.9155"
                      fill="none"
                      stroke={category.color}
                      strokeWidth={5.5}
                      strokeDasharray={subDasharray}
                      animate={{ opacity: isHovered ? opacities[idx] : 0 }}
                      transition={{ duration: 0.15 }}
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

      {/* Dynamic Center Label */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="text-sm font-medium text-gray-500">
          {hoveredCategory || 'Total'}
        </span>
        <span className="text-2xl font-bold text-gray-800 flex items-center">
          $
          <AnimatedNumber 
            value={
              hoveredCategory
                ? data.categories.find((c) => c.name === hoveredCategory)?.amount || 0
                : data.total
            } 
          />
        </span>
        
        {/* Micro-Legend for Hover State */}
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