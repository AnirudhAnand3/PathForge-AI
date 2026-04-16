import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '../api/axios';
import Loader from '../components/ui/Loader';
import toast from 'react-hot-toast';

export default function MentorMatch() {
  const [mentors, setMentors]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [booking, setBooking]   = useState(null);

  useEffect(() => {
    api.get('/mentors/matches').then(({ data }) => setMentors(data)).finally(() => setLoading(false));
  }, []);

  const handleBook = async (mentor) => {
    setBooking(mentor._id);
    try {
      await api.post(`/mentors/${mentor._id}/book`, { message: 'Session request', slot: '10:00' });
      toast.success('Session request sent!');
    } catch { toast.error('Booking failed'); }
    finally { setBooking(null); }
  };

  return (
    <div style={{ padding: '32px', maxWidth: '1100px', margin: '0 auto' }}>
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="font-display font-medium text-white mb-2" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)' }}>
          Find Your <span className="font-serif italic font-light" style={{ opacity: 0.7 }}>Mentor.</span>
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.9rem' }}>
          AI-matched mentors based on your career goals and skill profile
        </p>
      </motion.div>

      {loading ? (
        <div className="flex items-center justify-center py-32"><Loader size="lg" text="Finding your best mentor matches..." /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mentors.map((mentor, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
              whileHover={{ y: -4 }}
              style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '20px', padding: '24px', transition: 'all 0.3s ease' }}>
              {/* Avatar + info */}
              <div className="flex items-start gap-3 mb-4">
                <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'linear-gradient(135deg, #70a1ff, #a55eea)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '1.1rem', flexShrink: 0 }}>
                  {mentor.user?.name?.charAt(0) || 'M'}
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontWeight: 600, color: 'white', fontSize: '0.95rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{mentor.user?.name}</div>
                  <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.78rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{mentor.title} @ {mentor.company}</div>
                  <div className="flex items-center gap-1 mt-1">
                    <span style={{ color: '#fd9644', fontSize: '0.75rem' }}>★ {mentor.rating?.toFixed(1) || '5.0'}</span>
                    <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.72rem' }}>· {mentor.experience}y exp</span>
                  </div>
                </div>
              </div>

              {/* Expertise tags */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {mentor.expertise?.slice(0, 3).map((exp, j) => (
                  <span key={j} style={{ padding: '3px 10px', background: 'rgba(112,161,255,0.08)', border: '1px solid rgba(112,161,255,0.15)', borderRadius: '99px', fontSize: '0.72rem', color: '#70a1ff' }}>{exp}</span>
                ))}
              </div>

              {/* Match bar */}
              {mentor.matchScore !== undefined && (
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex-1 rounded-full overflow-hidden" style={{ height: '3px', background: 'rgba(255,255,255,0.07)' }}>
                    <div className="h-full rounded-full" style={{ width: `${mentor.matchScore}%`, background: 'linear-gradient(90deg, #70a1ff, #2bcbba)' }} />
                  </div>
                  <span style={{ color: '#70a1ff', fontSize: '0.75rem', fontWeight: 600, flexShrink: 0 }}>{Math.round(mentor.matchScore)}% match</span>
                </div>
              )}

              <button onClick={() => handleBook(mentor)} disabled={booking === mentor._id}
                style={{ width: '100%', padding: '10px', borderRadius: '10px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)', fontSize: '0.82rem', fontWeight: 500, cursor: 'pointer' }}>
                {booking === mentor._id ? 'Sending...' : 'Request Session'}
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}