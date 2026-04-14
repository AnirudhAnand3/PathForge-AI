import { motion } from 'framer-motion';
import { xpProgress } from '../../utils/helpers';

export default function XPBar({ xp, level }) {
  const progress = xpProgress(xp, level);
  return (
    <div className="w-full">
      <div className="flex justify-between text-xs text-gray-400 mb-1">
        <span>Level {level}</span>
        <span>{progress}% to Level {level + 1}</span>
      </div>
      <div className="w-full h-2 bg-dark-border rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="h-full bg-gradient-to-r from-brand-500 to-purple-500 rounded-full"
        />
      </div>
    </div>
  );
}