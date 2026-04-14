import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import api from '../api/axios';

const QuickAction = ({ to, icon, label, color }) => (
  <Link to={to}>
    <motion.div whileHover={{ y: -4, scale: 1.02 }} whileTap={{ scale: 0.97 }}
      className="bg-dark-card border border-dark-border rounded-2xl p-5 flex flex-col items-center gap-3 hover:border-brand-500/40 transition-all cursor-pointer group">
      <span className="text-2xl">{icon}</span>
      <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">{label}</span>
    </motion.div>
  </Link>
);

export default function Dashboard() {
  const { user } = useSelector(s => s.auth);
  const [profile, setProfile] = useState(null);
  const [recentResume, setRecentResume] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [{ data: career }, { data: resumes }] = await Promise.all([
          api.get('/career/profile'),
          api.get('/resume/mine'),
        ]);
        setProfile(career);
        if (resumes.length > 0) setRecentResume(resumes[0]);
      } catch {}
    };
    load();
  }, []);

  const xpToNextLevel = (user?.level || 1) * 100;
  const xpProgress = ((user?.xp || 0) % xpToNextLevel) / xpToNextLevel * 100;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Welcome header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-white">
            Welcome back, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p className="text-gray-400 mt-1">
            {user?.streak > 0 ? `🔥 ${user.streak} day streak — keep it up!` : 'Start your journey today'}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-sm text-gray-400">Level {user?.level || 1}</div>
            <div className="text-xl font-bold text-brand-400">{user?.xp || 0} XP</div>
          </div>
          <div className="w-14 h-14">
            <CircularProgressbar value={xpProgress}
              styles={buildStyles({ pathColor: '#6366f1', trailColor: '#1e1e2e', textColor: '#fff' })} />
          </div>
        </div>
      </motion.div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Career match', value: profile?.recommendedCareers?.[0]?.matchScore ? `${profile.recommendedCareers[0].matchScore}%` : '—', icon: '🎯', color: 'text-green-400' },
          { label: 'Roadmap progress', value: `${profile?.overallProgress || 0}%`, icon: '🗺️', color: 'text-blue-400' },
          { label: 'Day streak', value: user?.streak || 0, icon: '🔥', color: 'text-orange-400' },
          { label: 'Resume score', value: recentResume ? `${recentResume.atsScore}/100` : '—', icon: '📄', color: 'text-purple-400' },
        ].map((stat, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            className="bg-dark-card border border-dark-border rounded-2xl p-5 hover:border-brand-500/30 transition-all">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-xl">{stat.icon}</span>
              <span className="text-sm text-gray-400">{stat.label}</span>
            </div>
            <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
          </motion.div>
        ))}
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
          <QuickAction to="/app/career"    icon="🧠" label="Career AI" />
          <QuickAction to="/app/roadmap"   icon="🗺️" label="Roadmap" />
          <QuickAction to="/app/resume"    icon="📄" label="Resume AI" />
          <QuickAction to="/app/counselor" icon="💬" label="AI Counselor" />
          <QuickAction to="/app/skills"    icon="🎯" label="Skill Gap" />
          <QuickAction to="/app/mentors"   icon="🤝" label="Find Mentor" />
        </div>
      </div>

      {/* Selected career + roadmap preview */}
      {profile?.selectedCareer && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-dark-card border border-dark-border rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Your Career Path</h3>
            <div className="flex items-center gap-4">
              <div className="text-5xl">🎯</div>
              <div>
                <div className="text-2xl font-bold text-brand-400">{profile.selectedCareer}</div>
                <div className="text-sm text-gray-400 mt-1">{profile.recommendedCareers?.[0]?.matchScore}% match with your profile</div>
                <div className="text-sm text-green-400 mt-1">{profile.recommendedCareers?.[0]?.avgSalary} avg. salary</div>
              </div>
            </div>
          </div>
          <div className="bg-dark-card border border-dark-border rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Roadmap Progress</h3>
            <div className="space-y-3">
              {profile.roadmap?.slice(0, 3).map((phase, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${phase.completed ? 'bg-green-500' : 'bg-dark-border'}`}>
                    {phase.completed ? '✓' : i + 1}
                  </div>
                  <div className="flex-1">
                    <div className={`text-sm font-medium ${phase.completed ? 'line-through text-gray-500' : 'text-gray-200'}`}>{phase.title}</div>
                  </div>
                  <span className="text-xs text-gray-500">{phase.duration}</span>
                </div>
              ))}
              {profile.roadmap?.length > 3 && (
                <Link to="/app/roadmap" className="text-sm text-brand-400 hover:text-brand-300">View all {profile.roadmap.length} phases →</Link>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}