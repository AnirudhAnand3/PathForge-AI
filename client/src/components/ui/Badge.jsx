export default function Badge({ children, variant = 'default', size = 'sm' }) {
  const variants = {
    default: 'bg-dark-border text-gray-300',
    success: 'bg-green-900/40 border border-green-500/30 text-green-400',
    warning: 'bg-yellow-900/40 border border-yellow-500/30 text-yellow-400',
    danger:  'bg-red-900/40 border border-red-500/30 text-red-400',
    brand:   'bg-brand-900/40 border border-brand-500/30 text-brand-400',
    purple:  'bg-purple-900/40 border border-purple-500/30 text-purple-400',
  };
  const sizes = { sm: 'px-2.5 py-0.5 text-xs', md: 'px-3 py-1 text-sm' };
  return (
    <span className={`inline-flex items-center rounded-full font-medium ${variants[variant]} ${sizes[size]}`}>
      {children}
    </span>
  );
}