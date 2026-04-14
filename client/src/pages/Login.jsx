import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../store/slices/authSlice';
import { motion } from 'framer-motion';
import { useGoogleLogin } from '@react-oauth/google';
import { Sparkles } from 'lucide-react';
import { setCredentials } from '../store/slices/authSlice';
import api from '../api/axios';
import toast from 'react-hot-toast';

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector(s => s.auth);
  const [form, setForm] = useState({ email: '', password: '' });

  const googleLogin = useGoogleLogin({
  onSuccess: async (tokenResponse) => {
    try {
      const { data } = await api.post('/auth/google', { access_token: tokenResponse.access_token });
      localStorage.setItem('token', data.token);
      dispatch(setCredentials({ token: data.token, user: data.user }));
      toast.success(`Welcome back, ${data.user.name}!`);
      navigate(data.user.needsOnboarding ? '/onboarding' : '/app');
    } catch {
      toast.error('Google sign-in failed');
    }
  },
  onError: () => toast.error('Google sign-in failed'),
});

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await dispatch(loginUser(form));
    if (loginUser.fulfilled.match(res)) {
      toast.success('Welcome back!');
      navigate(res.payload.user?.needsOnboarding ? '/onboarding' : '/app');
    } else {
      toast.error(res.payload || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-aurora opacity-20 pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-aurora-purple/10 blur-[120px] rounded-full pointer-events-none" />

      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md relative z-10">

        {/* Logo */}
        <Link to="/" className="flex items-center justify-center gap-2 font-display font-bold text-xl mb-10">
          <Sparkles className="w-5 h-5 text-aurora-blue" />
          PathForge AI
        </Link>

        <div className="glass rounded-[2rem] p-8 md:p-10">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-display font-medium text-white mb-2">Welcome back</h1>
            <p className="text-white/35 text-sm font-light">Continue your career journey</p>
          </div>

          {/* Google Button */}
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
            <span className="text-white/20 text-xs">or sign in with email</span>
            <div className="flex-1 h-px bg-white/[0.06]" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs text-white/30 mb-2 tracking-wide uppercase">Email</label>
              <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                placeholder="you@example.com" required
                className="w-full bg-white/[0.03] border border-white/[0.08] rounded-2xl px-5 py-3.5 text-white placeholder-white/20 text-sm focus:outline-none focus:border-white/20 transition-colors" />
            </div>
            <div>
              <label className="block text-xs text-white/30 mb-2 tracking-wide uppercase">Password</label>
              <input type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                placeholder="••••••••" required
                className="w-full bg-white/[0.03] border border-white/[0.08] rounded-2xl px-5 py-3.5 text-white placeholder-white/20 text-sm focus:outline-none focus:border-white/20 transition-colors" />
            </div>
            <button type="submit" disabled={loading}
              className="w-full py-3.5 bg-white text-black font-semibold rounded-full hover:bg-white/90 disabled:opacity-50 transition-all text-sm mt-2">
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
        </div>

        <p className="text-center text-white/25 text-sm mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-white/70 hover:text-white transition-colors">Create one free</Link>
        </p>
      </motion.div>
    </div>
  );
}