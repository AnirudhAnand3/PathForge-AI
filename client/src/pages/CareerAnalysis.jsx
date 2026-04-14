import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../api/axios';
import CareerCard from '../components/career/CareerCard';
import SkillRadar from '../components/career/SkillRadar';
import Loader from '../components/ui/Loader';
import toast from 'react-hot-toast';

export default function CareerAnalysis() {
  const location = useLocation();
  const navigate  = useNavigate();
  const [profile, setProfile]     = useState(null);
  const [loading, setLoading]     = useState(false);
  const [selecting, setSelecting] = useState(false);

  useEffect(() => {
    if (location.state?.analysis) {
      setProfile(location.state.analysis);
    } else {
      api.get('/career/profile').then(({ data }) => setProfile(data)).catch(() => {});
    }
  }, []);

  const handleSelectCareer = async (career) => {
    setSelecting(true);
    const toastId = toast.loading('🗺️ Generating your personalized roadmap...');
    try {
      await api.post('/career/select-career', { career });
      toast.success('Roadmap created! 🎉', { id: toastId });
      navigate('/app/roadmap');
    } catch {
      toast.error('Failed to generate roadmap', { id: toastId });
    } finally {
      setSelecting(false);
    }
  };

  if (!profile) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Loader size="lg" text="Loading your career analysis..." />
    </div>
  );

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-display font-bold text-white mb-2">Your Career Analysis</h1>
        <p className="text-gray-400">Based on your personality, skills, and interests — ranked by AI match score</p>
      </motion.div>

      {/* Personality type */}
      {(profile.personalityType || profile.analysis?.personalityType) && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-brand-900/40 to-purple-900/40 border border-brand-500/20 rounded-2xl p-6">
          <div className="flex items-center gap-4">
            <div className="text-4xl">🧠</div>
            <div>
              <div className="text-sm text-gray-400 mb-1">Your personality type</div>
              <div className="text-2xl font-bold text-white">{profile.personalityType || profile.analysis?.personalityType}</div>
              <div className="text-sm text-gray-300 mt-1">{profile.motivationalInsight || profile.analysis?.motivationalInsight}</div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Career recommendations */}
      <div>
        <h2 className="text-xl font-semibold text-white mb-4">
          Top Career Matches {selecting && <span className="text-sm text-brand-400 ml-2">Generating roadmap...</span>}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(profile.recommendedCareers || profile.analysis?.careerRecommendations || []).map((career, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <CareerCard
                career={career}
                selected={profile.selectedCareer === career.title}
                onSelect={handleSelectCareer}
              />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Skill radar */}
      {profile.skillScores?.length > 0 && (
        <div className="bg-dark-card border border-dark-border rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Your Skill Radar</h2>
          <SkillRadar skillScores={profile.skillScores} />
        </div>
      )}
    </div>
  );
}