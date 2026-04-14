import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';

const QUIZ_STEPS = [
  {
    id: 'interests',
    title: 'What topics excite you the most?',
    subtitle: 'Select all that apply',
    type: 'multi',
    options: ['Technology', 'Design', 'Business', 'Science', 'Arts', 'Healthcare', 'Law', 'Education', 'Finance', 'Social Impact']
  },
  {
    id: 'workStyle',
    title: 'How do you prefer to work?',
    subtitle: 'Choose one',
    type: 'single',
    options: ['Building products / coding', 'Creating visual designs', 'Analyzing data & solving problems', 'Leading teams & strategy', 'Helping & teaching people', 'Writing & communicating']
  },
  {
    id: 'strength',
    title: 'What is your biggest strength?',
    subtitle: 'Be honest — this powers your analysis',
    type: 'single',
    options: ['Logical thinking', 'Creativity & innovation', 'Communication', 'Attention to detail', 'Leadership', 'Empathy & interpersonal skills']
  },
  {
    id: 'education',
    title: 'What is your current education level?',
    type: 'single',
    options: ['High School', '1st/2nd Year (UG)', '3rd/4th Year (UG)', 'Postgraduate', 'Working Professional']
  },
  {
    id: 'skills',
    title: 'Which skills do you already have?',
    subtitle: 'Select all that apply',
    type: 'multi',
    options: ['Python', 'JavaScript', 'Java', 'SQL', 'Machine Learning', 'UI/UX Design', 'Public Speaking', 'Data Analysis', 'Content Writing', 'Project Management', 'React/Angular', 'Cloud (AWS/GCP)']
  },
  {
    id: 'goal',
    title: 'What is your primary career goal?',
    type: 'single',
    options: ['Get my first job', 'Switch to a new field', 'Get into top MNCs', 'Start my own company', 'Pursue research / academia', 'Freelance / independent work']
  },
];

export default function Onboarding() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const current = QUIZ_STEPS[step];
  const progress = ((step + 1) / QUIZ_STEPS.length) * 100;

  const handleSelect = (option) => {
    if (current.type === 'single') {
      setAnswers(prev => ({ ...prev, [current.id]: option }));
    } else {
      const current_answers = answers[current.id] || [];
      setAnswers(prev => ({
        ...prev,
        [current.id]: current_answers.includes(option)
          ? current_answers.filter(a => a !== option)
          : [...current_answers, option]
      }));
    }
  };

  const isSelected = (option) => {
    const ans = answers[current.id];
    return Array.isArray(ans) ? ans.includes(option) : ans === option;
  };

  const canProceed = () => {
    const ans = answers[current.id];
    return ans && (Array.isArray(ans) ? ans.length > 0 : true);
  };

  const handleFinish = async () => {
    setLoading(true);
    try {
      const payload = {
        answers,
        skills: answers.skills || [],
        interests: answers.interests || [],
        educationLevel: answers.education,
        currentDomain: answers.workStyle,
      };
      const { data } = await api.post('/career/onboarding', payload);
      toast.success('🎉 Career analysis complete!');
      navigate('/app/career', { state: { analysis: data } });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-400 mb-2">
            <span>Step {step + 1} of {QUIZ_STEPS.length}</span>
            <span>{Math.round(progress)}% complete</span>
          </div>
          <div className="w-full h-1.5 bg-dark-border rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-brand-500 to-purple-500 rounded-full"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={step}
            initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.3 }}>

            <h2 className="text-3xl font-display font-bold text-white mb-2">{current.title}</h2>
            {current.subtitle && <p className="text-gray-400 mb-8">{current.subtitle}</p>}

            <div className="grid grid-cols-2 gap-3 mb-8">
              {current.options.map((option) => (
                <motion.button key={option} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  onClick={() => handleSelect(option)}
                  className={`p-4 text-left rounded-xl border transition-all ${
                    isSelected(option)
                      ? 'border-brand-500 bg-brand-900/40 text-white'
                      : 'border-dark-border bg-dark-card text-gray-300 hover:border-gray-500'
                  }`}>
                  <span className="text-sm font-medium">{option}</span>
                </motion.button>
              ))}
            </div>

            <div className="flex gap-3">
              {step > 0 && (
                <button onClick={() => setStep(s => s - 1)}
                  className="px-6 py-3 border border-dark-border rounded-xl text-gray-300 hover:bg-white/5 transition-all">
                  ← Back
                </button>
              )}
              {step < QUIZ_STEPS.length - 1 ? (
                <button onClick={() => setStep(s => s + 1)} disabled={!canProceed()}
                  className="flex-1 px-6 py-3 bg-brand-600 hover:bg-brand-500 disabled:opacity-40 rounded-xl font-medium transition-all">
                  Continue →
                </button>
              ) : (
                <motion.button onClick={handleFinish} disabled={loading || !canProceed()}
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-brand-600 to-purple-600 disabled:opacity-40 rounded-xl font-semibold transition-all">
                  {loading ? '🧠 Analyzing your profile...' : '✨ Generate My Career Analysis'}
                </motion.button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}