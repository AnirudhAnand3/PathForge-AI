import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { useGoogleLogin } from '@react-oauth/google';
import { Sparkles, Eye, EyeOff } from 'lucide-react';
import { loginUser, setCredentials } from '../store/slices/authSlice';
import api from '../api/axios';
import toast from 'react-hot-toast';

function GoogleIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  );
}

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector(s => s.auth);
  const [form, setForm]       = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const { data } = await api.post('/auth/google', { access_token: tokenResponse.access_token });
        localStorage.setItem('token', data.token);
        dispatch(setCredentials({ token: data.token, user: data.user }));
        toast.success(`Welcome back, ${data.user.name}!`);
        
        if (!data.user.needsOnboarding) {
          navigate('/app');
        } else if (data.user.hasCompletedQuiz) {
          navigate('/app/career');
        } else {
          navigate('/onboarding');
        }
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
      const user = res.payload.user;
      
      if (!user?.needsOnboarding) {
        navigate('/app');
      } else if (user?.hasCompletedQuiz) {
        // Quiz done, just haven't picked a career — go straight to career analysis
        navigate('/app/career');
      } else {
        navigate('/onboarding');
      }
    } else {
      toast.error(res.payload || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex" style={{ background: '#050505' }}>
      {/* Left panel — branding */}
      <motion.div
        initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="hidden lg:flex flex-col justify-between w-1/2 p-16 relative overflow-hidden"
        style={{ borderRight: '1px solid rgba(255,255,255,0.05)' }}
      >
        {/* Aurora bg */}
        <div className="absolute inset-0 bg-aurora opacity-20 pointer-events-none" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full blur-[120px] pointer-events-none"
          style={{ background: 'rgba(112,161,255,0.12)' }} />

        {/* Logo */}
        <div className="flex items-center gap-2 relative z-10">
          <Sparkles className="w-5 h-5" style={{ color: '#70a1ff' }} />
          <span className="font-display font-bold text-lg text-white">PathForge AI</span>
        </div>

        {/* Big quote */}
        <div className="relative z-10">
          <h1 className="font-display font-medium text-luxury mb-6"
            style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', lineHeight: 0.95 }}>
            Your career,<br />
            <span className="font-serif italic font-light" style={{ opacity: 0.7 }}>forged by AI.</span>
          </h1>
          <p className="font-light" style={{ color: 'rgba(255,255,255,0.35)', fontSize: '1rem', lineHeight: 1.7 }}>
            Join 50,000+ students who found their direction with PathForge's AI career intelligence platform.
          </p>

          {/* Stats */}
          <div className="flex gap-8 mt-10">
            {[['94%', 'Satisfaction rate'], ['200+', 'Career paths'], ['₹8L+', 'Avg. salary']].map(([v, l]) => (
              <div key={l}>
                <div className="font-display font-medium text-white" style={{ fontSize: '1.6rem' }}>{v}</div>
                <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.8rem' }}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        <p style={{ color: 'rgba(255,255,255,0.15)', fontSize: '0.75rem' }}>
          © 2026 PathForge AI · Smart India Hackathon
        </p>
      </motion.div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <Link to="/" className="flex items-center justify-center gap-2 font-display font-bold text-lg mb-10 lg:hidden">
            <Sparkles className="w-5 h-5" style={{ color: '#70a1ff' }} />
            PathForge AI
          </Link>

          <div className="mb-10">
            <h2 className="font-display font-medium text-white mb-2" style={{ fontSize: '2rem' }}>
              Welcome back
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.9rem' }}>
              Sign in to continue your career journey
            </p>
          </div>

          {/* Google */}
          <button onClick={() => googleLogin()}
            className="w-full flex items-center justify-center gap-3 mb-6 transition-all duration-300"
            style={{
              padding: '14px',
              borderRadius: '14px',
              border: '1px solid rgba(255,255,255,0.12)',
              background: 'rgba(255,255,255,0.03)',
              color: 'rgba(255,255,255,0.8)',
              fontSize: '0.9rem',
              fontWeight: 500,
              cursor: 'pointer',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
          >
            <GoogleIcon />
            Continue with Google
          </button>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />
            <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.75rem' }}>or</span>
            <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)', marginBottom: '8px', letterSpacing: '0.08em' }}>
                EMAIL ADDRESS
              </label>
              <input
                type="email" required
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                placeholder="you@example.com"
                style={{
                  width: '100%', padding: '13px 16px', borderRadius: '12px',
                  border: '1px solid rgba(255,255,255,0.08)',
                  background: 'rgba(255,255,255,0.03)',
                  color: 'white', fontSize: '0.9rem', outline: 'none',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)', marginBottom: '8px', letterSpacing: '0.08em' }}>
                PASSWORD
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPass ? 'text' : 'password'} required
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  placeholder="••••••••"
                  style={{
                    width: '100%', padding: '13px 48px 13px 16px', borderRadius: '12px',
                    border: '1px solid rgba(255,255,255,0.08)',
                    background: 'rgba(255,255,255,0.03)',
                    color: 'white', fontSize: '0.9rem', outline: 'none',
                  }}
                />
                <button type="button" onClick={() => setShowPass(s => !s)}
                  style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.3)' }}>
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              style={{
                width: '100%', padding: '14px', borderRadius: '14px',
                background: 'white', color: 'black',
                fontWeight: 600, fontSize: '0.9rem', border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.6 : 1,
                marginTop: '8px',
                transition: 'all 0.2s',
              }}>
              {loading ? 'Signing in...' : 'Sign in →'}
            </button>
          </form>

          <p className="text-center mt-8" style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.85rem' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: 'rgba(255,255,255,0.65)' }}
              className="hover:text-white transition-colors">
              Create one free
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}