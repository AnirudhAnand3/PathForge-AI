import { useState } from 'react';
import { motion } from 'framer-motion';
import api from '../api/axios';
import Loader from '../components/ui/Loader';
import toast from 'react-hot-toast';

export default function SkillGap() {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading]   = useState(false);

  const run = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/career/skill-gap');
      setAnalysis(data);
    } catch { toast.error('Analysis failed'); }
    finally { setLoading(false); }
  };

  const impColor = (imp) =>
    imp === 'critical' ? '#fc5c65' : imp === 'important' ? '#fd9644' : '#70a1ff';

  return (
    <div style={{ padding: '32px', maxWidth: '900px', margin: '0 auto' }}>
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="font-display font-medium text-white mb-2" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)' }}>
          Skill Gap <span className="font-serif italic font-light" style={{ opacity: 0.7 }}>Analysis.</span>
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.9rem' }}>
          Discover exactly what to learn next to land your dream role
        </p>
      </motion.div>

      {!analysis && !loading && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '24px', padding: '80px 24px', textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🎯</div>
          <h2 className="font-display font-medium text-white mb-3" style={{ fontSize: '1.5rem' }}>Ready for your report?</h2>
          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.9rem', marginBottom: '28px' }}>
            AI will compare your current skills against industry requirements for your target career
          </p>
          <button onClick={run}
            style={{ padding: '13px 32px', background: 'white', color: 'black', borderRadius: '12px', fontWeight: 600, border: 'none', cursor: 'pointer', fontSize: '0.9rem' }}>
            Run Analysis →
          </button>
        </motion.div>
      )}

      {loading && <div className="flex items-center justify-center py-32"><Loader size="lg" text="Analyzing your skill gaps with AI..." /></div>}

      {analysis && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">

          {/* Gap score */}
          <div style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '20px', padding: '28px' }}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.72rem', letterSpacing: '0.1em', marginBottom: '4px' }}>GAP SCORE</div>
                <div className="font-display font-medium" style={{ fontSize: '3rem', lineHeight: 1, color: analysis.gapScore > 50 ? '#fc5c65' : '#26de81' }}>
                  {analysis.gapScore}
                  <span style={{ fontSize: '1rem', opacity: 0.5 }}>/100</span>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.75rem', marginBottom: '4px' }}>Ready in</div>
                <div style={{ color: '#70a1ff', fontWeight: 600 }}>{analysis.estimatedReadyDate}</div>
                <div style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.75rem' }}>{analysis.weeklyHoursNeeded}h/week</div>
              </div>
            </div>
            <div className="w-full rounded-full overflow-hidden" style={{ height: '6px', background: 'rgba(255,255,255,0.07)' }}>
              <motion.div initial={{ width: 0 }} animate={{ width: `${analysis.gapScore}%` }} transition={{ duration: 1.5 }}
                className="h-full rounded-full"
                style={{ background: analysis.gapScore > 50 ? 'linear-gradient(90deg, #fc5c65, #fd9644)' : '#26de81' }} />
            </div>
          </div>

          {/* Critical gaps */}
          <div style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '20px', padding: '28px' }}>
            <h3 style={{ fontWeight: 600, color: 'white', marginBottom: '16px' }}>Skills to Learn</h3>
            <div className="space-y-3">
              {analysis.criticalGaps?.map((gap, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '14px', padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                  <div className="flex items-center gap-3">
                    <span style={{ padding: '3px 10px', borderRadius: '99px', fontSize: '0.7rem', fontWeight: 600, background: `${impColor(gap.importance)}18`, color: impColor(gap.importance), border: `1px solid ${impColor(gap.importance)}30` }}>
                      {gap.importance}
                    </span>
                    <div>
                      <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem', fontWeight: 500 }}>{gap.skill}</div>
                      <div style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.75rem' }}>~{gap.timeToLearn} to learn</div>
                    </div>
                  </div>
                  {gap.resources?.[0]?.url && (
                    <a href={gap.resources[0].url} target="_blank" rel="noopener noreferrer"
                      style={{ color: '#70a1ff', fontSize: '0.8rem', textDecoration: 'none', whiteSpace: 'nowrap' }}>
                      Learn →
                    </a>
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Priority path */}
          {analysis.priorityLearningPath?.length > 0 && (
            <div style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '20px', padding: '28px' }}>
              <h3 style={{ fontWeight: 600, color: 'white', marginBottom: '16px' }}>Priority Learning Path</h3>
              <div className="flex flex-wrap items-center gap-2">
                {analysis.priorityLearningPath.map((skill, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span style={{ padding: '6px 16px', background: 'rgba(112,161,255,0.08)', border: '1px solid rgba(112,161,255,0.18)', borderRadius: '99px', color: '#70a1ff', fontSize: '0.82rem' }}>{skill}</span>
                    {i < analysis.priorityLearningPath.length - 1 && <span style={{ color: 'rgba(255,255,255,0.2)' }}>→</span>}
                  </div>
                ))}
              </div>
            </div>
          )}

          <button onClick={run} style={{ width: '100%', padding: '12px', borderRadius: '12px', background: 'none', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.3)', cursor: 'pointer', fontSize: '0.85rem' }}>
            Re-run analysis
          </button>
        </motion.div>
      )}
    </div>
  );
}