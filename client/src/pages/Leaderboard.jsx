import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '../api/axios';
import LeaderboardRow from '../components/gamification/LeaderboardRow';
import Loader from '../components/ui/Loader';

export default function Leaderboard() {
  const [data, setData]     = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/gamification/leaderboard')
      .then(({ data }) => setData(data))
      .finally(() => setLoading(false));
  }, []);

  const myRank = data.find(u => u.isCurrentUser);

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-display font-bold text-white mb-2">🏆 Leaderboard</h1>
        <p className="text-gray-400">Compete with students across India — earn XP by completing roadmap phases, uploading resumes, and daily logins</p>
      </motion.div>

      {myRank && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-brand-900/40 to-purple-900/40 border border-brand-500/20 rounded-2xl p-4">
          <p className="text-sm text-gray-400 mb-2">Your position</p>
          <LeaderboardRow entry={myRank} index={myRank.rank - 1} />
        </motion.div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-24"><Loader size="lg" text="Loading leaderboard..." /></div>
      ) : (
        <div className="bg-dark-card border border-dark-border rounded-2xl overflow-hidden">
          <div className="px-4 py-3 border-b border-dark-border">
            <h2 className="font-semibold text-white text-sm">Top 50 — All India</h2>
          </div>
          <div className="p-2 space-y-1">
            {data.map((entry, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.02 }}>
                <LeaderboardRow entry={entry} index={i} />
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}