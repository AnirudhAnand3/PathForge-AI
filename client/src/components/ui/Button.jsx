import { motion } from 'framer-motion';

export default function Button({
  children, onClick, variant = 'primary', size = 'md',
  disabled = false, loading = false, className = '', type = 'button'
}) {
  const base = 'inline-flex items-center justify-center font-medium rounded-xl transition-all focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary:   'bg-brand-600 hover:bg-brand-500 text-white shadow-lg shadow-brand-900/30',
    secondary: 'bg-dark-card border border-dark-border hover:border-gray-600 text-gray-300 hover:text-white',
    danger:    'bg-red-600/20 border border-red-500/30 hover:bg-red-600/40 text-red-400',
    ghost:     'hover:bg-white/5 text-gray-400 hover:text-white',
    gradient:  'bg-gradient-to-r from-brand-600 to-purple-600 hover:from-brand-500 hover:to-purple-500 text-white',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-8 py-3.5 text-base',
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.97 } : {}}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {loading && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />}
      {children}
    </motion.button>
  );
}