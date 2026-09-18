import { useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface Props {
  value: number;
}

export default function AnimatedNumber({ value }: Props) {
  // Start at 0 so it counts up on initial load
  const motionValue = useMotionValue(0); 
  
  // Spring physics for a smooth, decelerating roll
  const springValue = useSpring(motionValue, { 
    damping: 30, 
    stiffness: 250 
  });

  // Format the raw animated number with commas and remove decimals
  const displayValue = useTransform(springValue, (current) =>
    Math.round(current).toLocaleString()
  );

  useEffect(() => {
    // Whenever the target value changes, trigger the spring animation
    motionValue.set(value);
  }, [motionValue, value]);

  return <motion.span>{displayValue}</motion.span>;
}