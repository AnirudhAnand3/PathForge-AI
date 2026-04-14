import { motion } from 'framer-motion';
import { formatRelativeTime } from '../../utils/helpers';

export default function BadgeCard({ badge, locked = false }) {
  return (
    <motion.div
      whileHover={!locked ? { scale: 1.05 } : {}}
      className={`bg-dark-card border rounded-2xl p-4 text-center transition-all ${
        locked ? 'border-dark-border opacity-40 grayscale' : 'border-brand-500/20 hover:border-brand-500/50'
      }`}
    >
      <div className="text-3xl mb-2">{badge.icon}</div>
      <div className="text-sm font-semibold text-white mb-1">{badge.name}</div>
      <div className="text-xs text-gray-400">{badge.description}</div>
      {!locked && badge.earnedAt && (
        <div className="text-xs text-brand-400 mt-2">{formatRelativeTime(badge.earnedAt)}</div>
      )}
    </motion.div>
  );
}