import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const RESOURCES = [
  { category: 'Technology', icon: '💻', color: '#70a1ff', items: [
    { name: 'freeCodeCamp', url: 'https://freecodecamp.org', desc: 'Free coding bootcamp' },
    { name: 'The Odin Project', url: 'https://theodinproject.com', desc: 'Full stack curriculum' },
    { name: 'CS50', url: 'https://cs50.harvard.edu', desc: "Harvard's intro to CS" },
  ]},
  { category: 'Data Science', icon: '📊', color: '#2bcbba', items: [
    { name: 'Kaggle', url: 'https://kaggle.com', desc: 'Datasets + competitions' },
    { name: 'Fast.ai', url: 'https://fast.ai', desc: 'Practical deep learning' },
    { name: 'Towards Data Science', url: 'https://towardsdatascience.com', desc: 'DS articles' },
  ]},
  { category: 'Design', icon: '🎨', color: '#a55eea', items: [
    { name: 'Figma', url: 'https://figma.com', desc: 'Design tool' },
    { name: 'Dribbble', url: 'https://dribbble.com', desc: 'Design inspiration' },
    { name: 'Laws of UX', url: 'https://lawsofux.com', desc: 'UX principles' },
  ]},
  { category: 'Business', icon: '📈', color: '#fd9644', items: [
    { name: 'Y Combinator Library', url: 'https://ycombinator.com/library', desc: 'Startup wisdom' },
    { name: 'First Round Review', url: 'https://review.firstround.com', desc: 'Business insights' },
    { name: 'Product Hunt', url: 'https://producthunt.com', desc: 'Product discovery' },
  ]},
];

export default function Explore() {
  return (
    <div style={{ padding: '32px', maxWidth: '1100px', margin: '0 auto' }}>
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="font-display font-medium text-white mb-2" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)' }}>
          Explore <span className="font-serif italic font-light" style={{ opacity: 0.7 }}>Resources.</span>
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.9rem' }}>
          Curated learning resources to accelerate your career growth
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {RESOURCES.map((section, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '20px', padding: '24px' }}>
            <div className="flex items-center gap-3 mb-5">
              <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: `${section.color}18`, border: `1px solid ${section.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>
                {section.icon}
              </div>
              <h2 style={{ fontWeight: 600, color: 'white', fontSize: '1rem' }}>{section.category}</h2>
            </div>
            <div className="space-y-2">
              {section.items.map((item, j) => (
                <a key={j} href={item.url} target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-between group"
                  style={{ padding: '12px 14px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', textDecoration: 'none', transition: 'all 0.2s ease' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)'; }}
                >
                  <div>
                    <div style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.88rem', fontWeight: 500 }}>{item.name}</div>
                    <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem' }}>{item.desc}</div>
                  </div>
                  <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.85rem' }}>→</span>
                </a>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* CTA */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
        className="mt-6 text-center p-10"
        style={{ background: 'linear-gradient(135deg, rgba(112,161,255,0.06), rgba(165,94,234,0.06))', border: '1px solid rgba(112,161,255,0.12)', borderRadius: '20px' }}>
        <h2 style={{ fontWeight: 600, color: 'white', marginBottom: '8px', fontSize: '1.1rem' }}>
          Want personalized recommendations?
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.88rem', marginBottom: '20px' }}>
          Ask your AI counselor for resources specific to your career path
        </p>
        <Link to="/app/counselor">
          <button style={{ padding: '11px 24px', background: 'white', color: 'black', borderRadius: '10px', fontWeight: 600, border: 'none', cursor: 'pointer', fontSize: '0.88rem' }}>
            Ask AI Counselor →
          </button>
        </Link>
      </motion.div>
    </div>
  );
}