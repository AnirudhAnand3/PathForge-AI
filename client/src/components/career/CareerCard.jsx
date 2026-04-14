import { motion } from 'framer-motion';
import Badge from '../ui/Badge';

export default function CareerCard({ career, onSelect, selected }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      onClick={() => onSelect(career.title)}
      className={`bg-dark-card border rounded-2xl p-5 cursor-pointer transition-all ${
        selected
          ? 'border-brand-500 bg-brand-900/20'
          : 'border-dark-border hover:border-brand-500/40'
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-semibold text-white text-base">{career.title}</h3>
        <Badge variant="brand">{career.matchScore}% match</Badge>
      </div>
      <p className="text-gray-400 text-sm mb-4 leading-relaxed">{career.why}</p>
      <div className="flex flex-wrap gap-2 mb-4">
        {career.requiredSkills?.slice(0, 3).map((skill, i) => (
          <Badge key={i} variant="default">{skill}</Badge>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-3 pt-3 border-t border-dark-border">
        <div>
          <div className="text-xs text-gray-500">Avg Salary</div>
          <div className="text-sm font-semibold text-green-400">{career.avgSalary}</div>
        </div>
        <div>
          <div className="text-xs text-gray-500">Growth Rate</div>
          <div className="text-sm font-semibold text-blue-400">{career.growthRate}</div>
        </div>
      </div>
    </motion.div>
  );
}