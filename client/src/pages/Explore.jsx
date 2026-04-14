import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const RESOURCES = [
  { category: 'Technology', icon: '💻', items: [
    { name: 'freeCodeCamp', url: 'https://freecodecamp.org', desc: 'Free coding bootcamp' },
    { name: 'The Odin Project', url: 'https://theodinproject.com', desc: 'Full stack curriculum' },
    { name: 'CS50', url: 'https://cs50.harvard.edu', desc: 'Harvard\'s intro to CS' },
  ]},
  { category: 'Data Science', icon: '📊', items: [
    { name: 'Kaggle', url: 'https://kaggle.com', desc: 'Datasets + competitions' },
    { name: 'Fast.ai', url: 'https://fast.ai', desc: 'Practical deep learning' },
    { name: 'Towards Data Science', url: 'https://towardsdatascience.com', desc: 'DS articles' },
  ]},
  { category: 'Design', icon: '🎨', items: [
    { name: 'Figma', url: 'https://figma.com', desc: 'Design tool' },
    { name: 'Dribbble', url: 'https://dribbble.com', desc: 'Design inspiration' },
    { name: 'Refactoring UI', url: 'https://refactoringui.com', desc: 'UI design book' },
  ]},
  { category: 'Business', icon: '📈', items: [
    { name: 'Y Combinator', url: 'https://ycombinator.com/library', desc: 'Startup library' },
    { name: 'First Round Review', url: 'https://review.firstround.com', desc: 'Business insights' },
    { name: 'Stratechery', url: 'https://stratechery.com', desc: 'Tech strategy' },
  ]},
];

export default function Explore() {
  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-display font-bold text-white mb-2">🔭 Explore Resources</h1>
        <p className="text-gray-400">Curated learning resources to accelerate your career growth</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {RESOURCES.map((section, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            className="bg-dark-card border border-dark-border rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">{section.icon}</span>
              <h2 className="font-semibold text-white">{section.category}</h2>
            </div>
            <div className="space-y-3">
              {section.items.map((item, j) => (
                <a key={j} href={item.url} target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 bg-dark-bg rounded-xl hover:bg-white/5 transition-all group">
                  <div>
                    <div className="text-sm font-medium text-white group-hover:text-brand-400 transition-colors">{item.name}</div>
                    <div className="text-xs text-gray-400">{item.desc}</div>
                  </div>
                  <span className="text-gray-600 group-hover:text-brand-400 transition-colors">→</span>
                </a>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick links */}
      <div className="bg-gradient-to-br from-brand-900/30 to-purple-900/30 border border-brand-500/20 rounded-2xl p-6 text-center">
        <h2 className="font-bold text-white mb-2">Want a personalized resource list?</h2>
        <p className="text-gray-400 text-sm mb-4">Ask your AI counselor for resources specific to your career path</p>
        <Link to="/app/counselor"
          className="inline-block px-6 py-3 bg-brand-600 hover:bg-brand-500 rounded-xl text-white font-medium transition-all">
          Ask AI Counselor →
        </Link>
      </div>
    </div>
  );
}