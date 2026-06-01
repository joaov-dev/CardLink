import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

interface Props {
  children: ReactNode;
  narrow?: boolean;
  flush?: boolean;
  className?: string;
}

export function Page({ children, narrow, flush, className }: Props) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={`page ${narrow ? "page--narrow" : ""} ${flush ? "page--flush" : ""} ${className ?? ""}`}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.34, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
