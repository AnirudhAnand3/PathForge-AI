import { motion } from 'framer-motion';

export default function Card({ children, className = '', hover = false, onClick }) {
  const base = 'bg-dark-card border border-dark-border rounded-2xl';
  const hoverClass = hover ? 'hover:border-brand-500/40 cursor-pointer transition-all duration-300' : '';
  return hover ? (
    <motion.div
      whileHover={{ y: -2 }}
      onClick={onClick}
      className={`${base} ${hoverClass} ${className}`}
    >
      {children}
    </motion.div>
  ) : (
    <div className={`${base} ${className}`}>{children}</div>
  );
}