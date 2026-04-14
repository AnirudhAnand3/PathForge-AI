import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '../api/axios';
import RoadmapTimeline from '../components/career/RoadmapTimeline';
import Loader from '../components/ui/Loader';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

export default function Roadmap() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = async () => {
    try {
      const { data } = await api.get('/career/profile');
      setProfile(data);
    } catch {} finally { setLoading(false); }
  };

  useEffect(() => { loadProfile(); }, []);

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><Loader size="lg" text="Loading roadmap..." /></div>;

  if (!profile?.selectedCareer) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
      <div className="text-5xl mb-4">🗺️</div>
      <h2 className="text-xl font-bold text-white mb-2">No roadmap yet</h2>
      <p className="text-gray-400 mb-4">Complete your career analysis and select a career to generate your roadmap</p>
      <a href="/app/career" className="px-6 py-3 bg-brand-600 rounded-xl text-white font-medium">Go to Career Analysis →</a>
    </div>
  );

  const completed = profile.roadmap?.filter(r => r.completed).length || 0;
  const total     = profile.roadmap?.length || 0;

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-white">Your Roadmap</h1>
          <p className="text-gray-400 mt-1">
            Career: <span className="text-brand-400 font-semibold">{profile.selectedCareer}</span>
          </p>
        </div>
        <div className="w-20 h-20">
          <CircularProgressbar value={profile.overallProgress || 0} text={`${profile.overallProgress || 0}%`}
            styles={buildStyles({ pathColor: '#6366f1', textColor: '#fff', trailColor: '#1e1e2e', textSize: '20px' })} />
        </div>
      </motion.div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Phases completed', value: completed },
          { label: 'Phases remaining', value: total - completed },
          { label: 'Total phases', value: total },
        ].map((s, i) => (
          <div key={i} className="bg-dark-card border border-dark-border rounded-2xl p-4 text-center">
            <div className="text-2xl font-bold text-brand-400">{s.value}</div>
            <div className="text-xs text-gray-400 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      <RoadmapTimeline roadmap={profile.roadmap} onUpdate={loadProfile} />
    </div>
  );
}