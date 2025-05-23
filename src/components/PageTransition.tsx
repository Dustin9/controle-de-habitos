import { motion } from "framer-motion";
import { ReactNode } from "react";

interface PageTransitionProps {
  children: ReactNode;
}

export function PageTransition({ children }: PageTransitionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.98 }}
      transition={{
        duration: 0.4,
        ease: [0.4, 0, 0.2, 1],
        opacity: { duration: 0.3 },
        scale: { duration: 0.3 }
      }}
      className="w-full"
    >
      {children}
    </motion.div>
  );
} 