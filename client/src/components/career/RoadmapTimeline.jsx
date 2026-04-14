import { motion } from 'framer-motion';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { useState } from 'react';

export default function RoadmapTimeline({ roadmap, onUpdate }) {
  const [completing, setCompleting] = useState(null);

  const handleComplete = async (phase) => {
    setCompleting(phase);
    try {
      await api.patch(`/career/roadmap/${phase}/complete`);
      toast.success(`Phase ${phase} complete! +200 XP 🎉`);
      onUpdate?.();
    } catch (err) {
      toast.error('Failed to mark complete');
    } finally {
      setCompleting(null);
    }
  };

  return (
    <div className="space-y-4">
      {roadmap?.map((step, i) => (
        <motion.div key={i}
          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.1 }}
          className={`flex gap-4 ${step.completed ? 'opacity-75' : ''}`}
        >
          {/* Timeline indicator */}
          <div className="flex flex-col items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm border-2 ${
              step.completed
                ? 'bg-green-500 border-green-500 text-white'
                : 'bg-dark-card border-dark-border text-gray-400'
            }`}>
              {step.completed ? '✓' : step.phase}
            </div>
            {i < roadmap.length - 1 && (
              <div className={`w-0.5 flex-1 mt-2 ${step.completed ? 'bg-green-500/40' : 'bg-dark-border'}`} style={{ minHeight: '24px' }} />
            )}
          </div>

          {/* Content */}
          <div className={`flex-1 pb-6 bg-dark-card border rounded-2xl p-5 ${
            step.completed ? 'border-green-500/20' : 'border-dark-border'
          }`}>
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="font-semibold text-white">{step.title}</h3>
                <span className="text-xs text-gray-500">{step.duration}</span>
              </div>
              {!step.completed && (
                <button
                  onClick={() => handleComplete(step.phase)}
                  disabled={completing === step.phase}
                  className="text-xs px-3 py-1.5 bg-brand-600/20 border border-brand-500/30 rounded-lg text-brand-400 hover:bg-brand-600/40 transition-all disabled:opacity-50"
                >
                  {completing === step.phase ? '...' : 'Mark done'}
                </button>
              )}
            </div>
            <p className="text-gray-400 text-sm mb-3">{step.description}</p>
            {step.resources?.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {step.resources.slice(0, 3).map((r, j) => (
                  <a key={j} href={r.url} target="_blank" rel="noopener noreferrer"
                    className="text-xs px-2.5 py-1 bg-dark-border rounded-lg text-gray-300 hover:text-white transition-colors">
                    {r.type === 'course' ? '📚' : r.type === 'video' ? '🎥' : '📖'} {r.title}
                  </a>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
}