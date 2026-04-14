import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useGoogleLogin } from '@react-oauth/google';
import { Sparkles } from 'lucide-react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../store/slices/authSlice';

export default function Register() {
  const navigate  = useNavigate();
  const [step, setStep]     = useState(1);
  const [userId, setUserId] = useState(null);
  const [otp, setOtp]       = useState('');
  const [loading, setLoading] = useState(false);
  const [form, setForm]     = useState({ name: '', email: '', password: '' });

  const dispatch = useDispatch();
  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const { data } = await api.post('/auth/google', { access_token: tokenResponse.access_token });
        localStorage.setItem('token', data.token);
        dispatch(setCredentials({ token: data.token, user: data.user }));
        toast.success(`Welcome, ${data.user.name}! 🎉`);
        navigate(data.user.needsOnboarding ? '/onboarding' : '/app');
      } catch {
        toast.error('Google sign-in failed');
      }
    },
  });

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/auth/register', form);
      setUserId(data.userId);
      setStep(2);
      toast.success('OTP sent to your email!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally { setLoading(false); }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/auth/verify-otp', { userId, otp });
      localStorage.setItem('token', data.token);
      toast.success('Email verified! Setting up your profile 🚀');
      navigate('/onboarding');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid OTP');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-aurora opacity-20 pointer-events-none" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-aurora-blue/10 blur-[120px] rounded-full pointer-events-none" />

      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md relative z-10">

        <Link to="/" className="flex items-center justify-center gap-2 font-display font-bold text-xl mb-10">
          <Sparkles className="w-5 h-5 text-aurora-blue" />
          PathForge AI
        </Link>

        <div className="glass rounded-[2rem] p-8 md:p-10">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-display font-medium text-white mb-2">
              {step === 1 ? 'Forge your future' : 'Check your inbox'}
            </h1>
            <p className="text-white/35 text-sm font-light">
              {step === 1 ? 'Free forever · No credit card required' : `OTP sent to ${form.email}`}
            </p>
          </div>

          {step === 1 && (
            <>
              <button onClick={() => googleLogin()}
                className="w-full flex items-center justify-center gap-3 py-3.5 rounded-full border border-white/15 hover:bg-white/[0.04] hover:border-white/25 transition-all duration-300 mb-6 font-medium text-white/80 hover:text-white text-sm">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </button>
              <div className="flex items-center gap-4 mb-6">
                <div className="flex-1 h-px bg-white/[0.06]" />
                <span className="text-white/20 text-xs">or use email</span>
                <div className="flex-1 h-px bg-white/[0.06]" />
              </div>
              <form onSubmit={handleRegister} className="space-y-4">
                {[
                  { label: 'Full name', key: 'name', type: 'text', placeholder: 'Anirudh Sharma' },
                  { label: 'Email', key: 'email', type: 'email', placeholder: 'you@example.com' },
                  { label: 'Password', key: 'password', type: 'password', placeholder: '••••••••' },
                ].map(field => (
                  <div key={field.key}>
                    <label className="block text-xs text-white/30 mb-2 tracking-wide uppercase">{field.label}</label>
                    <input type={field.type} placeholder={field.placeholder} required
                      value={form[field.key]} onChange={e => setForm(f => ({ ...f, [field.key]: e.target.value }))}
                      className="w-full bg-white/[0.03] border border-white/[0.08] rounded-2xl px-5 py-3.5 text-white placeholder-white/20 text-sm focus:outline-none focus:border-white/20 transition-colors" />
                  </div>
                ))}
                <button type="submit" disabled={loading}
                  className="w-full py-3.5 bg-white text-black font-semibold rounded-full hover:bg-white/90 disabled:opacity-50 transition-all text-sm mt-2">
                  {loading ? 'Creating account...' : 'Create free account →'}
                </button>
              </form>
            </>
          )}

          {step === 2 && (
            <form onSubmit={handleVerify} className="space-y-5">
              <div>
                <label className="block text-xs text-white/30 mb-3 tracking-wide uppercase text-center">6-digit OTP</label>
                <input type="text" maxLength={6} value={otp} onChange={e => setOtp(e.target.value)} required
                  placeholder="• • • • • •"
                  className="w-full bg-white/[0.03] border border-white/[0.08] rounded-2xl px-5 py-4 text-white placeholder-white/15 text-center text-3xl tracking-[1rem] focus:outline-none focus:border-white/20 transition-colors" />
              </div>
              <button type="submit" disabled={loading || otp.length !== 6}
                className="w-full py-3.5 bg-white text-black font-semibold rounded-full hover:bg-white/90 disabled:opacity-40 transition-all text-sm">
                {loading ? 'Verifying...' : 'Verify & Continue →'}
              </button>
              <button type="button" onClick={() => setStep(1)}
                className="w-full text-white/30 text-sm hover:text-white/60 transition-colors">
                ← Back
              </button>
            </form>
          )}
        </div>

        <p className="text-center text-white/25 text-sm mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-white/70 hover:text-white transition-colors">Sign in</Link>
        </p>
      </motion.div>
    </div>
  );
}