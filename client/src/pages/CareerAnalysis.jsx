import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/axios';
import Loader from '../components/ui/Loader';
import toast from 'react-hot-toast';
import { ArrowRight, Sparkles, TrendingUp, Clock, Building } from 'lucide-react';

export default function CareerAnalysis() {
  const location  = useLocation();
  const navigate  = useNavigate();
  const [profile, setProfile]     = useState(null);
  const [loading, setLoading]     = useState(false);
  const [selecting, setSelecting] = useState(null);

  useEffect(() => {
    if (location.state?.analysis) {
      setProfile(location.state.analysis);
    } else {
      api.get('/career/profile').then(({ data }) => setProfile(data)).catch(() => {});
    }
  }, []);

  const handleSelect = async (career) => {
    setSelecting(career);
    const id = toast.loading('🗺️ Generating your personalized roadmap...');
    try {
      await api.post('/career/select-career', { career });
      toast.success('Roadmap created! 🎉', { id });
      navigate('/app/roadmap');
    } catch {
      toast.error('Failed to generate roadmap', { id });
      setSelecting(null);
    }
  };

  const careers = profile?.recommendedCareers || profile?.analysis?.careerRecommendations || [];
  const personality = profile?.personalityType || profile?.analysis?.personalityType;
  const insight = profile?.motivationalInsight || profile?.analysis?.motivationalInsight;

  if (!profile) return (
    <div className="flex items-center justify-center min-h-[70vh]">
      <Loader size="lg" text="Loading your career analysis..." />
    </div>
  );

  return (
    <div style={{ padding: '32px', maxWidth: '1200px', margin: '0 auto' }}>

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
        <h1 className="font-display font-medium text-white mb-2"
          style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)' }}>
          Your Career <span className="font-serif italic font-light" style={{ opacity: 0.7 }}>Analysis.</span>
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.9rem' }}>
          AI-ranked matches based on your personality, skills, and interests
        </p>
      </motion.div>

      {/* Personality card */}
      {personality && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="mb-8 p-6 flex items-center gap-5"
          style={{ background: 'linear-gradient(135deg, rgba(112,161,255,0.08), rgba(165,94,234,0.08))', border: '1px solid rgba(112,161,255,0.15)', borderRadius: '20px' }}>
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
            style={{ background: 'rgba(112,161,255,0.12)', border: '1px solid rgba(112,161,255,0.2)' }}>
            🧠
          </div>
          <div>
            <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.72rem', letterSpacing: '0.1em', marginBottom: '4px' }}>PERSONALITY TYPE</div>
            <div className="font-display font-medium text-white" style={{ fontSize: '1.4rem' }}>{personality}</div>
            {insight && <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.85rem', marginTop: '4px' }}>{insight}</div>}
          </div>
        </motion.div>
      )}

      {/* Career cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {careers.map((career, i) => {
          const isSelected = profile.selectedCareer === career.title;
          const isLoading  = selecting === career.title;
          return (
            <motion.div key={i}
              initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -4 }}
              onClick={() => !selecting && handleSelect(career.title)}
              style={{
                background: isSelected ? 'rgba(112,161,255,0.08)' : 'rgba(255,255,255,0.025)',
                border: `1px solid ${isSelected ? 'rgba(112,161,255,0.3)' : 'rgba(255,255,255,0.07)'}`,
                borderRadius: '20px',
                padding: '24px',
                cursor: selecting ? 'wait' : 'pointer',
                transition: 'all 0.3s ease',
              }}>

              {/* Match score */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full"
                    style={{ background: career.matchScore >= 85 ? '#26de81' : career.matchScore >= 70 ? '#fd9644' : '#70a1ff' }} />
                  <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.72rem', letterSpacing: '0.08em' }}>
                    {career.matchScore >= 85 ? 'EXCELLENT' : career.matchScore >= 70 ? 'GREAT' : 'GOOD'} MATCH
                  </span>
                </div>
                <span className="font-display font-medium" style={{ fontSize: '1.4rem', color: '#70a1ff' }}>
                  {career.matchScore}%
                </span>
              </div>

              <h3 className="font-display font-medium text-white mb-2" style={{ fontSize: '1.15rem', lineHeight: 1.2 }}>
                {career.title}
              </h3>
              <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.82rem', lineHeight: 1.6, marginBottom: '16px' }}>
                {career.why || career.description}
              </p>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '10px', padding: '10px 12px' }}>
                  <div style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.68rem', marginBottom: '2px' }}>AVG SALARY</div>
                  <div style={{ color: '#2bcbba', fontSize: '0.85rem', fontWeight: 600 }}>{career.avgSalary || 'N/A'}</div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '10px', padding: '10px 12px' }}>
                  <div style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.68rem', marginBottom: '2px' }}>GROWTH</div>
                  <div style={{ color: '#fd9644', fontSize: '0.85rem', fontWeight: 600 }}>{career.growthRate || 'N/A'}</div>
                </div>
              </div>

              {/* Skills */}
              {career.requiredSkills?.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {career.requiredSkills.slice(0, 3).map((skill, j) => (
                    <span key={j} style={{ padding: '3px 10px', background: 'rgba(255,255,255,0.06)', borderRadius: '99px', fontSize: '0.72rem', color: 'rgba(255,255,255,0.5)' }}>
                      {skill}
                    </span>
                  ))}
                </div>
              )}

              <button disabled={!!selecting}
                style={{
                  width: '100%', padding: '10px', borderRadius: '10px',
                  background: isSelected ? 'rgba(112,161,255,0.2)' : 'rgba(255,255,255,0.06)',
                  border: `1px solid ${isSelected ? 'rgba(112,161,255,0.3)' : 'rgba(255,255,255,0.08)'}`,
                  color: isSelected ? '#70a1ff' : 'rgba(255,255,255,0.6)',
                  fontSize: '0.82rem', fontWeight: 500, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                }}>
                {isLoading ? 'Generating roadmap...' : isSelected ? '✓ Selected' : 'Select & Generate Roadmap'}
                {!isLoading && !isSelected && <ArrowRight className="w-3.5 h-3.5" />}
              </button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}