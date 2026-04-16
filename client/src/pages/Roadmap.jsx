import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import Loader from '../components/ui/Loader';
import toast from 'react-hot-toast';
import { CheckCircle, Circle, BookOpen, Video, ExternalLink, ArrowRight } from 'lucide-react';

const typeIcon = (type) => {
  if (type === 'video')   return '🎥';
  if (type === 'book')    return '📖';
  if (type === 'project') return '🛠️';
  return '📚';
};

export default function Roadmap() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(null);

  const loadProfile = async () => {
    try {
      const { data } = await api.get('/career/profile');
      setProfile(data);
    } catch {} finally { setLoading(false); }
  };

  useEffect(() => { loadProfile(); }, []);

  const handleComplete = async (phase) => {
    setCompleting(phase);
    try {
      await api.patch(`/career/roadmap/${phase}/complete`);
      toast.success(`Phase ${phase} complete! +200 XP 🎉`);
      loadProfile();
    } catch { toast.error('Failed to mark complete'); }
    finally { setCompleting(null); }
  };

  if (loading) return <div className="flex items-center justify-center min-h-[70vh]"><Loader size="lg" text="Loading roadmap..." /></div>;

  if (!profile?.selectedCareer) return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center p-6">
      <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🗺️</div>
      <h2 className="font-display font-medium text-white mb-3" style={{ fontSize: '1.5rem' }}>No roadmap yet</h2>
      <p style={{ color: 'rgba(255,255,255,0.35)', marginBottom: '24px', fontSize: '0.9rem' }}>
        Complete your career analysis and select a career to generate your roadmap
      </p>
      <Link to="/app/career">
        <button style={{ padding: '12px 28px', background: 'white', color: 'black', borderRadius: '12px', fontWeight: 600, border: 'none', cursor: 'pointer' }}>
          Go to Career Analysis →
        </button>
      </Link>
    </div>
  );

  const completed = profile.roadmap?.filter(r => r.completed).length || 0;
  const total     = profile.roadmap?.length || 0;
  const pct       = total ? Math.round((completed / total) * 100) : 0;

  return (
    <div style={{ padding: '32px', maxWidth: '900px', margin: '0 auto' }}>

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="font-display font-medium text-white mb-1"
          style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)' }}>
          Your Roadmap
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem' }}>
          Career: <span style={{ color: '#70a1ff', fontWeight: 500 }}>{profile.selectedCareer}</span>
        </p>
      </motion.div>

      {/* Progress overview */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
        className="mb-10 p-6 flex items-center gap-6 flex-wrap"
        style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '20px' }}>
        <div>
          <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.72rem', letterSpacing: '0.1em', marginBottom: '4px' }}>OVERALL PROGRESS</div>
          <div className="font-display font-medium" style={{ fontSize: '3rem', color: '#70a1ff', lineHeight: 1 }}>{pct}%</div>
        </div>
        <div className="flex-1" style={{ minWidth: '160px' }}>
          <div className="flex justify-between text-xs mb-2" style={{ color: 'rgba(255,255,255,0.3)' }}>
            <span>{completed} of {total} phases complete</span>
          </div>
          <div className="w-full rounded-full overflow-hidden" style={{ height: '6px', background: 'rgba(255,255,255,0.07)' }}>
            <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 1.5, ease: 'easeOut' }}
              className="h-full rounded-full"
              style={{ background: 'linear-gradient(90deg, #70a1ff, #2bcbba)' }} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[
            { label: 'Completed', value: completed, color: '#26de81' },
            { label: 'Remaining', value: total - completed, color: 'rgba(255,255,255,0.4)' },
          ].map((s, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 600, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.25)' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Phases */}
      <div className="space-y-4">
        {profile.roadmap?.map((step, i) => (
          <motion.div key={i}
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.07 }}
            style={{
              background: step.completed ? 'rgba(38,222,129,0.04)' : 'rgba(255,255,255,0.025)',
              border: `1px solid ${step.completed ? 'rgba(38,222,129,0.15)' : 'rgba(255,255,255,0.07)'}`,
              borderRadius: '20px',
              overflow: 'hidden',
            }}>
            <div style={{ padding: '24px' }}>
              <div className="flex items-start gap-4">
                {/* Phase indicator */}
                <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm"
                  style={{
                    background: step.completed ? 'rgba(38,222,129,0.2)' : 'rgba(255,255,255,0.06)',
                    border: `1.5px solid ${step.completed ? 'rgba(38,222,129,0.5)' : 'rgba(255,255,255,0.1)'}`,
                    color: step.completed ? '#26de81' : 'rgba(255,255,255,0.5)',
                  }}>
                  {step.completed ? '✓' : step.phase}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div>
                      <h3 className="font-medium text-white mb-1" style={{ fontSize: '1rem', textDecoration: step.completed ? 'line-through' : 'none', opacity: step.completed ? 0.5 : 1 }}>
                        {step.title}
                      </h3>
                      <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.75rem' }}>{step.duration}</span>
                    </div>
                    {!step.completed && (
                      <button onClick={() => handleComplete(step.phase)} disabled={completing === step.phase}
                        style={{
                          padding: '7px 16px', borderRadius: '10px', fontSize: '0.78rem', fontWeight: 500,
                          background: 'rgba(112,161,255,0.1)', border: '1px solid rgba(112,161,255,0.2)',
                          color: '#70a1ff', cursor: 'pointer', whiteSpace: 'nowrap',
                        }}>
                        {completing === step.phase ? 'Saving...' : '+ Mark complete'}
                      </button>
                    )}
                  </div>

                  {step.description && (
                    <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.84rem', lineHeight: 1.65, marginTop: '10px' }}>
                      {step.description}
                    </p>
                  )}

                  {/* Resources */}
                  {step.resources?.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4">
                      {step.resources.map((r, j) => (
                        <a key={j} href={r.url} target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-1.5 transition-all"
                          style={{
                            padding: '5px 12px', borderRadius: '8px', fontSize: '0.75rem',
                            background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)',
                            color: 'rgba(255,255,255,0.5)', textDecoration: 'none',
                          }}
                          onMouseEnter={e => { e.currentTarget.style.color = 'white'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; }}
                          onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; }}
                        >
                          <span>{typeIcon(r.type)}</span>
                          <span>{r.title}</span>
                          {r.free && <span style={{ color: '#26de81', fontSize: '0.65rem' }}>FREE</span>}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}