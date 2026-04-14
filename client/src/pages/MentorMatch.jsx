import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '../api/axios';
import Loader from '../components/ui/Loader';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';
import toast from 'react-hot-toast';

export default function MentorMatch() {
  const [mentors, setMentors]     = useState([]);
  const [loading, setLoading]     = useState(true);
  const [selected, setSelected]   = useState(null);
  const [booking, setBooking]     = useState(false);

  useEffect(() => {
    api.get('/mentors/matches')
      .then(({ data }) => setMentors(data))
      .finally(() => setLoading(false));
  }, []);

  const handleBook = async () => {
    setBooking(true);
    try {
      await api.post(`/mentors/${selected._id}/book`, { message: 'I would like to schedule a session', slot: '10:00' });
      toast.success('Session request sent! Mentor will confirm shortly.');
      setSelected(null);
    } catch { toast.error('Booking failed'); }
    finally { setBooking(false); }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-display font-bold text-white mb-2">Find Your Mentor</h1>
        <p className="text-gray-400">AI-matched mentors based on your career goals and skill profile</p>
      </motion.div>

      {loading ? (
        <div className="flex items-center justify-center py-24"><Loader size="lg" text="Finding your best mentor matches..." /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {mentors.map((mentor, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
              whileHover={{ y: -4 }}
              className="bg-dark-card border border-dark-border rounded-2xl p-5 hover:border-brand-500/40 transition-all">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center font-bold text-lg flex-shrink-0">
                  {mentor.user?.name?.charAt(0) || 'M'}
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-white truncate">{mentor.user?.name}</h3>
                  <p className="text-sm text-gray-400 truncate">{mentor.title} @ {mentor.company}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-yellow-400 text-xs">★</span>
                    <span className="text-xs text-gray-400">{mentor.rating?.toFixed(1) || '5.0'} · {mentor.experience}y exp</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5 mb-4">
                {mentor.expertise?.slice(0, 3).map((exp, j) => <Badge key={j} variant="brand">{exp}</Badge>)}
              </div>
              {mentor.matchScore !== undefined && (
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex-1 h-1.5 bg-dark-border rounded-full overflow-hidden">
                    <div className="h-full bg-brand-500 rounded-full" style={{ width: `${mentor.matchScore}%` }} />
                  </div>
                  <span className="text-xs text-brand-400 font-medium">{Math.round(mentor.matchScore)}% match</span>
                </div>
              )}
              <button onClick={() => setSelected(mentor)}
                className="w-full py-2.5 bg-brand-600/20 border border-brand-500/30 rounded-xl text-brand-400 text-sm font-medium hover:bg-brand-600/40 transition-all">
                Request Session
              </button>
            </motion.div>
          ))}
        </div>
      )}

      <Modal isOpen={!!selected} onClose={() => setSelected(null)} title="Book a Session">
        {selected && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-dark-bg rounded-xl">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center font-bold">
                {selected.user?.name?.charAt(0)}
              </div>
              <div>
                <div className="font-semibold text-white">{selected.user?.name}</div>
                <div className="text-sm text-gray-400">{selected.title}</div>
              </div>
            </div>
            <p className="text-sm text-gray-400">A session request will be sent. The mentor will contact you to confirm the timing.</p>
            <button onClick={handleBook} disabled={booking}
              className="w-full py-3 bg-gradient-to-r from-brand-600 to-purple-600 rounded-xl font-semibold text-white disabled:opacity-50">
              {booking ? 'Sending request...' : 'Confirm Request →'}
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
}