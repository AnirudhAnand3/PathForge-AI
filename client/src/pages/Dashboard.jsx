import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Brain, Map, FileText, MessageSquare, Target, Users, Trophy, Zap, Flame, TrendingUp, ArrowRight } from 'lucide-react';
import api from '../api/axios';

const QuickCard = ({ to, icon: Icon, label, desc, color }) => (
  <Link to={to}>
    <motion.div whileHover={{ y: -3, scale: 1.01 }} whileTap={{ scale: 0.98 }}
      className="glass-card rounded-2xl p-5 cursor-pointer group h-full"
      style={{ borderRadius: '20px' }}>
      <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
        style={{ background: `${color}18`, border: `1px solid ${color}30` }}>
        <Icon className="w-5 h-5" style={{ color }} />
      </div>
      <div className="font-medium text-white text-sm mb-1">{label}</div>
      <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem' }}>{desc}</div>
    </motion.div>
  </Link>
);

const StatCard = ({ label, value, icon, color, sub }) => (
  <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
    className="glass-card p-5" style={{ borderRadius: '20px' }}>
    <div className="flex items-center justify-between mb-3">
      <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.78rem', letterSpacing: '0.05em' }}>{label}</span>
      <span style={{ fontSize: '1.1rem' }}>{icon}</span>
    </div>
    <div className="font-display font-medium" style={{ fontSize: '2rem', color: color || 'white', lineHeight: 1 }}>
      {value}
    </div>
    {sub && <div style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.72rem', marginTop: '6px' }}>{sub}</div>}
  </motion.div>
);

export default function Dashboard() {
  const { user } = useSelector(s => s.auth);
  const [profile, setProfile]     = useState(null);
  const [recentResume, setResume] = useState(null);

  useEffect(() => {
    Promise.all([
      api.get('/career/profile').catch(() => ({ data: null })),
      api.get('/resume/mine').catch(() => ({ data: [] })),
    ]).then(([{ data: p }, { data: r }]) => {
      setProfile(p);
      if (r?.length > 0) setResume(r[0]);
    });
  }, []);

  const xpToNext  = ((user?.level || 1) + 1) * ((user?.level || 1) + 1) * 100;
  const xpCurrent = (user?.level || 1) * (user?.level || 1) * 100;
  const xpPct     = Math.round(((user?.xp || 0) - xpCurrent) / (xpToNext - xpCurrent) * 100);

  const quickActions = [
    { to: '/app/career',    icon: Brain,         label: 'Career AI',     desc: 'Analyze & explore paths',  color: '#70a1ff' },
    { to: '/app/roadmap',   icon: Map,           label: 'My Roadmap',    desc: 'Track your milestones',    color: '#2bcbba' },
    { to: '/app/resume',    icon: FileText,      label: 'Resume AI',     desc: 'ATS score & feedback',     color: '#a55eea' },
    { to: '/app/counselor', icon: MessageSquare, label: 'AI Counselor',  desc: 'Chat with your co-pilot',  color: '#fd9644' },
    { to: '/app/skills',    icon: Target,        label: 'Skill Gap',     desc: 'Find what to learn next',  color: '#26de81' },
    { to: '/app/mentors',   icon: Users,         label: 'Find Mentor',   desc: 'Get expert guidance',      color: '#fc5c65' },
  ];

  return (
    <div style={{ padding: '32px 32px 64px', maxWidth: '1200px', margin: '0 auto' }}>

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}
        className="mb-10 flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display font-medium text-white mb-1"
            style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', lineHeight: 1.1 }}>
            Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'},{' '}
            <span className="font-serif italic font-light" style={{ opacity: 0.75 }}>
              {user?.name?.split(' ')[0]}.
            </span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.9rem' }}>
            {user?.streak > 0
              ? `🔥 ${user.streak} day streak — you're on fire!`
              : 'Ready to forge your path today?'}
          </p>
        </div>

        {/* XP progress */}
        <div className="glass-card p-4 flex items-center gap-4" style={{ borderRadius: '16px', minWidth: '220px' }}>
          <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #70a1ff, #a55eea)' }}>
            <Zap className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex justify-between text-xs mb-1.5">
              <span style={{ color: 'rgba(255,255,255,0.5)' }}>Level {user?.level || 1}</span>
              <span style={{ color: '#70a1ff' }}>{user?.xp || 0} XP</span>
            </div>
            <div className="w-full rounded-full overflow-hidden" style={{ height: '4px', background: 'rgba(255,255,255,0.07)' }}>
              <motion.div initial={{ width: 0 }} animate={{ width: `${Math.max(0, Math.min(100, xpPct))}%` }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
                className="h-full rounded-full"
                style={{ background: 'linear-gradient(90deg, #70a1ff, #a55eea)' }} />
            </div>
            <div style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.7rem', marginTop: '4px' }}>
              {Math.max(0, Math.min(100, xpPct))}% to Level {(user?.level || 1) + 1}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="CAREER MATCH"    value={profile?.recommendedCareers?.[0]?.matchScore ? `${profile.recommendedCareers[0].matchScore}%` : '—'} icon="🎯" color="#2bcbba" sub="Based on your profile" />
        <StatCard label="ROADMAP"         value={`${profile?.overallProgress || 0}%`} icon="🗺️" color="#70a1ff" sub="Overall progress" />
        <StatCard label="DAY STREAK"      value={user?.streak || 0} icon="🔥" color="#fd9644" sub={user?.streak > 0 ? 'Keep it going!' : 'Login daily'} />
        <StatCard label="RESUME ATS"      value={recentResume?.atsScore ? `${recentResume.atsScore}` : '—'} icon="📄" color="#a55eea" sub="ATS score / 100" />
      </div>

      {/* Career path highlight */}
      {profile?.selectedCareer && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="glass-card mb-8 p-6 flex items-center justify-between gap-4 flex-wrap"
          style={{ borderRadius: '20px', borderColor: 'rgba(112,161,255,0.15)' }}>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
              style={{ background: 'rgba(112,161,255,0.1)', border: '1px solid rgba(112,161,255,0.2)' }}>
              🎯
            </div>
            <div>
              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', marginBottom: '4px' }}>YOUR CAREER PATH</div>
              <div className="font-display font-medium text-white" style={{ fontSize: '1.3rem' }}>
                {profile.selectedCareer}
              </div>
              <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.8rem' }}>
                {profile.recommendedCareers?.[0]?.matchScore}% match ·{' '}
                <span style={{ color: '#2bcbba' }}>{profile.recommendedCareers?.[0]?.avgSalary}</span>
              </div>
            </div>
          </div>
          <Link to="/app/roadmap">
            <button className="flex items-center gap-2 text-sm font-medium transition-all"
              style={{ padding: '10px 20px', borderRadius: '10px', background: 'rgba(112,161,255,0.1)', border: '1px solid rgba(112,161,255,0.2)', color: '#70a1ff', cursor: 'pointer' }}>
              View Roadmap <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
        </motion.div>
      )}

      {/* Quick actions */}
      <div className="mb-8">
        <h2 className="font-medium text-white mb-4" style={{ fontSize: '0.85rem', letterSpacing: '0.08em', color: 'rgba(255,255,255,0.4)' }}>
          QUICK ACTIONS
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {quickActions.map((a, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
              <QuickCard {...a} />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Roadmap preview */}
      {profile?.roadmap?.length > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
          className="glass-card p-6" style={{ borderRadius: '20px' }}>
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-medium text-white">Roadmap Progress</h2>
            <Link to="/app/roadmap" style={{ color: '#70a1ff', fontSize: '0.8rem' }}>View all →</Link>
          </div>
          <div className="space-y-3">
            {profile.roadmap.slice(0, 4).map((phase, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                  style={{
                    background: phase.completed ? 'rgba(38,222,129,0.2)' : 'rgba(255,255,255,0.06)',
                    border: `1px solid ${phase.completed ? 'rgba(38,222,129,0.4)' : 'rgba(255,255,255,0.08)'}`,
                    color: phase.completed ? '#26de81' : 'rgba(255,255,255,0.4)',
                  }}>
                  {phase.completed ? '✓' : i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate" style={{ color: phase.completed ? 'rgba(255,255,255,0.35)' : 'rgba(255,255,255,0.8)', textDecoration: phase.completed ? 'line-through' : 'none' }}>
                    {phase.title}
                  </div>
                </div>
                <div style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.72rem', flexShrink: 0 }}>{phase.duration}</div>
              </div>
            ))}
          </div>
          {/* Progress bar */}
          <div className="mt-5 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            <div className="flex justify-between text-xs mb-2" style={{ color: 'rgba(255,255,255,0.3)' }}>
              <span>{profile.roadmap.filter(r => r.completed).length} of {profile.roadmap.length} phases complete</span>
              <span>{profile.overallProgress || 0}%</span>
            </div>
            <div className="w-full rounded-full overflow-hidden" style={{ height: '4px', background: 'rgba(255,255,255,0.06)' }}>
              <motion.div initial={{ width: 0 }} animate={{ width: `${profile.overallProgress || 0}%` }}
                transition={{ duration: 1.5, ease: 'easeOut' }}
                className="h-full rounded-full"
                style={{ background: 'linear-gradient(90deg, #70a1ff, #2bcbba)' }} />
            </div>
          </div>
        </motion.div>
      )}

      {/* Empty state — no career selected */}
      {!profile?.selectedCareer && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="glass-card p-12 text-center" style={{ borderRadius: '24px' }}>
          <div className="text-5xl mb-4">🧠</div>
          <h2 className="font-display font-medium text-white mb-2" style={{ fontSize: '1.5rem' }}>
            Let's find your path
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.9rem', marginBottom: '24px' }}>
            Complete your career analysis to unlock your personalized AI roadmap
          </p>
          <Link to="/app/career">
            <button style={{ padding: '12px 28px', borderRadius: '12px', background: 'white', color: 'black', fontWeight: 600, fontSize: '0.9rem', border: 'none', cursor: 'pointer' }}>
              Start Career Analysis →
            </button>
          </Link>
        </motion.div>
      )}
    </div>
  );
}