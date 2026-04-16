import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '../api/axios';
import Loader from '../components/ui/Loader';

export default function Leaderboard() {
  const [data, setData]       = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/gamification/leaderboard')
      .then(({ data }) => setData(data))
      .finally(() => setLoading(false));
  }, []);

  const me = data.find(u => u.isCurrentUser);

  return (
    <div style={{ padding: '32px', maxWidth: '700px', margin: '0 auto' }}>
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="font-display font-medium text-white mb-2" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)' }}>
          🏆 Leaderboard
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.9rem' }}>
          Earn XP by completing roadmap phases, uploading resumes, and daily logins
        </p>
      </motion.div>

      {/* Your rank */}
      {me && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
          className="mb-6 p-4 flex items-center gap-4"
          style={{ background: 'linear-gradient(135deg, rgba(112,161,255,0.08), rgba(165,94,234,0.08))', border: '1px solid rgba(112,161,255,0.2)', borderRadius: '16px' }}>
          <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.75rem', minWidth: '60px' }}>YOUR RANK</div>
          <div className="font-display font-medium text-white" style={{ fontSize: '1.5rem' }}>#{me.rank}</div>
          <div className="flex-1" />
          <div style={{ textAlign: 'right' }}>
            <div style={{ color: '#70a1ff', fontWeight: 600 }}>{me.xp?.toLocaleString()} XP</div>
            <div style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.75rem' }}>Level {me.level}</div>
          </div>
        </motion.div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-24"><Loader size="lg" /></div>
      ) : (
        <div style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '20px', overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.72rem', letterSpacing: '0.1em' }}>TOP 50 — ALL INDIA</span>
          </div>
          <div style={{ padding: '8px' }}>
            {data.map((entry, i) => {
              const medals = ['🥇', '🥈', '🥉'];
              return (
                <motion.div key={i}
                  initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.02 }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 14px',
                    borderRadius: '12px', marginBottom: '2px',
                    background: entry.isCurrentUser ? 'rgba(112,161,255,0.08)' : 'transparent',
                    border: entry.isCurrentUser ? '1px solid rgba(112,161,255,0.15)' : '1px solid transparent',
                    transition: 'background 0.2s',
                  }}>
                  <div style={{ width: '28px', textAlign: 'center', fontSize: i < 3 ? '1.1rem' : '0.8rem', color: 'rgba(255,255,255,0.25)', fontWeight: 600 }}>
                    {i < 3 ? medals[i] : `#${entry.rank}`}
                  </div>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, #70a1ff, #a55eea)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', fontWeight: 700, flexShrink: 0 }}>
                    {entry.name?.charAt(0).toUpperCase()}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '0.88rem', fontWeight: 500, color: entry.isCurrentUser ? 'white' : 'rgba(255,255,255,0.7)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {entry.name} {entry.isCurrentUser && <span style={{ color: '#70a1ff', fontSize: '0.72rem' }}>(you)</span>}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.25)' }}>
                      Level {entry.level} · 🔥 {entry.streak}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#70a1ff' }}>{entry.xp?.toLocaleString()}</div>
                    <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.2)' }}>XP</div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}