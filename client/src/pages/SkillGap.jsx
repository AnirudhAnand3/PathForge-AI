import { useState } from 'react';
import { motion } from 'framer-motion';
import api from '../api/axios';
import Badge from '../components/ui/Badge';
import Loader from '../components/ui/Loader';
import toast from 'react-hot-toast';

export default function SkillGap() {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading]   = useState(false);

  const runAnalysis = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/career/skill-gap');
      setAnalysis(data);
    } catch { toast.error('Analysis failed'); }
    finally { setLoading(false); }
  };

  const importanceVariant = (imp) =>
    imp === 'critical' ? 'danger' : imp === 'important' ? 'warning' : 'default';

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold text-white mb-2">Skill Gap Analysis</h1>
        <p className="text-gray-400">Discover exactly what skills you need to land your dream career</p>
      </div>

      {!analysis && !loading && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="bg-dark-card border border-dark-border rounded-2xl p-12 text-center">
          <div className="text-5xl mb-4">🎯</div>
          <h2 className="text-xl font-bold text-white mb-2">Ready for your skill gap report?</h2>
          <p className="text-gray-400 mb-6">AI will compare your current skills against industry requirements for your target career</p>
          <button onClick={runAnalysis}
            className="px-8 py-3 bg-gradient-to-r from-brand-600 to-purple-600 rounded-xl font-semibold text-white hover:scale-105 transition-all">
            Run Analysis →
          </button>
        </motion.div>
      )}

      {loading && (
        <div className="flex items-center justify-center py-24">
          <Loader size="lg" text="Analyzing your skill gaps with AI..." />
        </div>
      )}

      {analysis && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          {/* Gap score */}
          <div className="bg-dark-card border border-dark-border rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Gap Score</h2>
              <span className={`text-3xl font-bold ${analysis.gapScore > 50 ? 'text-red-400' : 'text-green-400'}`}>
                {analysis.gapScore}/100
              </span>
            </div>
            <div className="w-full h-3 bg-dark-border rounded-full overflow-hidden">
              <motion.div initial={{ width: 0 }} animate={{ width: `${analysis.gapScore}%` }} transition={{ duration: 1.5 }}
                className={`h-full rounded-full ${analysis.gapScore > 50 ? 'bg-red-500' : 'bg-green-500'}`} />
            </div>
            <p className="text-sm text-gray-400 mt-3">
              Ready in approximately <span className="text-brand-400 font-semibold">{analysis.estimatedReadyDate}</span> with <span className="text-brand-400 font-semibold">{analysis.weeklyHoursNeeded}h/week</span> of study
            </p>
          </div>

          {/* Critical gaps */}
          <div className="bg-dark-card border border-dark-border rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Skills to Learn</h2>
            <div className="space-y-4">
              {analysis.criticalGaps?.map((gap, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-dark-bg rounded-xl border border-dark-border">
                  <div className="flex items-center gap-3">
                    <Badge variant={importanceVariant(gap.importance)}>{gap.importance}</Badge>
                    <div>
                      <div className="text-sm font-medium text-white">{gap.skill}</div>
                      <div className="text-xs text-gray-400">~{gap.timeToLearn} to learn</div>
                    </div>
                  </div>
                  {gap.resources?.[0]?.url && (
                    <a href={gap.resources[0].url} target="_blank" rel="noopener noreferrer"
                      className="text-xs text-brand-400 hover:text-brand-300">Learn →</a>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Learning path */}
          {analysis.priorityLearningPath?.length > 0 && (
            <div className="bg-dark-card border border-dark-border rounded-2xl p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Priority Learning Path</h2>
              <div className="flex flex-wrap items-center gap-2">
                {analysis.priorityLearningPath.map((skill, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="px-3 py-1.5 bg-brand-900/30 border border-brand-500/20 rounded-full text-sm text-brand-300">{skill}</span>
                    {i < analysis.priorityLearningPath.length - 1 && <span className="text-gray-600">→</span>}
                  </div>
                ))}
              </div>
            </div>
          )}

          <button onClick={runAnalysis}
            className="w-full py-3 border border-dark-border rounded-xl text-gray-400 hover:text-white hover:border-gray-500 transition-all text-sm">
            Re-run analysis
          </button>
        </motion.div>
      )}
    </div>
  );
}