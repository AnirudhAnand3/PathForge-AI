import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import api from '../api/axios';

export default function Profile() {
  const { user } = useSelector(s => s.auth);
  const [badges, setBadges]   = useState([]);
  const [stats, setStats]     = useState(null);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    Promise.all([
      api.get('/gamification/badges').catch(() => ({ data: [] })),
      api.get('/gamification/stats').catch(() => ({ data: null })),
      api.get('/career/profile').catch(() => ({ data: null })),
    ]).then(([{ data: b }, { data: s }, { data: p }]) => {
      setBadges(b || []);
      setStats(s);
      setProfile(p);
    });
  }, []);

  const xpToNext  = ((user?.level || 1) + 1) * ((user?.level || 1) + 1) * 100;
  const xpCurrent = (user?.level || 1) * (user?.level || 1) * 100;
  const xpPct     = Math.min(100, Math.max(0, Math.round(((user?.xp || 0) - xpCurrent) / (xpToNext - xpCurrent) * 100)));

  return (
    <div style={{ padding: '32px', maxWidth: '900px', margin: '0 auto' }}>
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="font-display font-medium text-white mb-2" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)' }}>
          Your <span className="font-serif italic font-light" style={{ opacity: 0.7 }}>Profile.</span>
        </h1>
      </motion.div>

      {/* Profile card */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="mb-6 p-6 flex items-center gap-6 flex-wrap"
        style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '24px' }}>
        <div style={{ width: '72px', height: '72px', borderRadius: '20px', background: 'linear-gradient(135deg, #70a1ff, #a55eea)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 700, flexShrink: 0 }}>
          {user?.name?.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-display font-medium text-white" style={{ fontSize: '1.4rem' }}>{user?.name}</div>
          <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.85rem' }}>{user?.email}</div>
          {profile?.selectedCareer && (
            <div style={{ color: '#70a1ff', fontSize: '0.85rem', marginTop: '4px' }}>🎯 {profile.selectedCareer}</div>
          )}
          <div style={{ marginTop: '12px', maxWidth: '260px' }}>
            <div className="flex justify-between text-xs mb-1.5" style={{ color: 'rgba(255,255,255,0.3)' }}>
              <span>Level {user?.level || 1}</span>
              <span>{xpPct}% to Level {(user?.level || 1) + 1}</span>
            </div>
            <div className="w-full rounded-full overflow-hidden" style={{ height: '4px', background: 'rgba(255,255,255,0.07)' }}>
              <motion.div initial={{ width: 0 }} animate={{ width: `${xpPct}%` }} transition={{ duration: 1.2 }}
                className="h-full rounded-full"
                style={{ background: 'linear-gradient(90deg, #70a1ff, #a55eea)' }} />
            </div>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.72rem', marginBottom: '4px' }}>GLOBAL RANK</div>
          <div className="font-display font-medium" style={{ fontSize: '2rem', color: '#70a1ff', lineHeight: 1 }}>
            #{stats?.rank || '—'}
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total XP',   value: user?.xp?.toLocaleString() || 0,  color: '#70a1ff' },
          { label: 'Level',      value: user?.level || 1,                  color: '#a55eea' },
          { label: 'Day Streak', value: `${user?.streak || 0} 🔥`,        color: '#fd9644' },
          { label: 'Badges',     value: badges.length,                     color: '#26de81' },
        ].map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.06 }}
            style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', padding: '20px', textAlign: 'center' }}>
            <div style={{ fontSize: '1.6rem', fontWeight: 700, color: s.color }}>{s.value}</div>
            <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem', marginTop: '4px' }}>{s.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Badges */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
        style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '20px', padding: '28px' }}>
        <h2 style={{ fontWeight: 600, color: 'white', marginBottom: '20px' }}>🏅 Badges Earned</h2>
        {badges.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {badges.map((badge, i) => (
              <motion.div key={i} whileHover={{ scale: 1.04 }}
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(112,161,255,0.15)', borderRadius: '16px', padding: '20px', textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', marginBottom: '8px' }}>{badge.icon}</div>
                <div style={{ fontWeight: 600, color: 'rgba(255,255,255,0.8)', fontSize: '0.85rem', marginBottom: '4px' }}>{badge.name}</div>
                <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.72rem' }}>{badge.description}</div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '40px', color: 'rgba(255,255,255,0.25)' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>🏅</div>
            <p style={{ fontSize: '0.88rem' }}>No badges yet — complete actions to earn your first!</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}