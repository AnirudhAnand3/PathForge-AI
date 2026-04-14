import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import api from '../api/axios';
import BadgeCard from '../components/gamification/BadgeCard';
import XPBar from '../components/gamification/XPBar';

export default function Profile() {
  const { user } = useSelector(s => s.auth);
  const [badges, setBadges]   = useState([]);
  const [stats, setStats]     = useState(null);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    Promise.all([
      api.get('/gamification/badges'),
      api.get('/gamification/stats'),
      api.get('/career/profile'),
    ]).then(([{ data: b }, { data: s }, { data: p }]) => {
      setBadges(b);
      setStats(s);
      setProfile(p);
    }).catch(() => {});
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Profile header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
        className="bg-dark-card border border-dark-border rounded-2xl p-6">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center text-3xl font-bold flex-shrink-0">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-display font-bold text-white">{user?.name}</h1>
            <p className="text-gray-400 text-sm">{user?.email}</p>
            {profile?.selectedCareer && (
              <p className="text-brand-400 text-sm mt-1">🎯 {profile.selectedCareer}</p>
            )}
            <div className="mt-3 max-w-xs">
              <XPBar xp={user?.xp || 0} level={user?.level || 1} />
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-400">Rank</div>
            <div className="text-2xl font-bold text-brand-400">#{stats?.rank || '—'}</div>
          </div>
        </div>
      </motion.div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total XP',   value: user?.xp?.toLocaleString() || 0,    icon: '⚡' },
          { label: 'Level',      value: user?.level || 1,                    icon: '🎖️' },
          { label: 'Day streak', value: `${user?.streak || 0} 🔥`,          icon: '🔥' },
          { label: 'Badges',     value: badges.length,                        icon: '🏅' },
        ].map((s, i) => (
          <div key={i} className="bg-dark-card border border-dark-border rounded-2xl p-4 text-center">
            <div className="text-2xl mb-1">{s.icon}</div>
            <div className="text-xl font-bold text-white">{s.value}</div>
            <div className="text-xs text-gray-400 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Badges */}
      <div className="bg-dark-card border border-dark-border rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4">🏅 Badges Earned</h2>
        {badges.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {badges.map((badge, i) => <BadgeCard key={i} badge={badge} />)}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-400">
            <div className="text-4xl mb-2">🏅</div>
            <p className="text-sm">No badges yet. Complete actions to earn your first badge!</p>
          </div>
        )}
      </div>
    </div>
  );
}