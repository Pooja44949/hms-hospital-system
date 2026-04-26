import { useState, useEffect } from "react";
import { motion, useSpring, useTransform } from "framer-motion";

export function AnimatedCounter({ value, duration = 1.5 }: { value: number, duration?: number }) {
  const [hasAnimated, setHasAnimated] = useState(false);
  const spring = useSpring(0, {
    mass: 1,
    stiffness: 100,
    damping: 30,
    duration: duration * 1000
  });
  
  const display = useTransform(spring, (current) => Math.round(current));

  useEffect(() => {
    if (!hasAnimated) {
      spring.set(value);
      setHasAnimated(true);
    } else {
      spring.set(value);
    }
  }, [value, spring, hasAnimated]);

  return <motion.span>{display}</motion.span>;
}
