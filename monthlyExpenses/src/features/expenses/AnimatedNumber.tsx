import { useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface Props {
  value: number;
}

export default function AnimatedNumber({ value }: Props) {
  const motionValue = useMotionValue(0); 
  
  const springValue = useSpring(motionValue, { 
    damping: 30, 
    stiffness: 250 
  });

  const displayValue = useTransform(springValue, (current) =>
    Math.round(current).toLocaleString()
  );

  useEffect(() => {
    motionValue.set(value);
  }, [motionValue, value]);

  return <motion.span>{displayValue}</motion.span>;
}