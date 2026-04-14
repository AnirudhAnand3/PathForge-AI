import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, Brain, Target, Map, Trophy, Check, X, Mic } from 'lucide-react';
import { useGoogleLogin } from '@react-oauth/google';
import { setCredentials } from '../store/slices/authSlice';
import api from '../api/axios';
import toast from 'react-hot-toast';

// ── Animated Counter ──────────────────────────────────────────────
function Counter({ value }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        let start = 0;
        const increment = value / (2000 / 16);
        const timer = setInterval(() => {
          start += increment;
          if (start >= value) { setCount(value); clearInterval(timer); }
          else setCount(Math.floor(start));
        }, 16);
      }
    }, { threshold: 0.5 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value]);
  return <span ref={ref}>{count}</span>;
}

// ── Google SVG ────────────────────────────────────────────────────
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

// ── Comparison Table Data ─────────────────────────────────────────
const comparison = [
  { feature: 'AI Psychometrics',         pathforge: true,   others: false },
  { feature: 'Real-time Skill Tracking', pathforge: true,   others: false },
  { feature: '24/7 AI Mentorship',       pathforge: true,   others: 'Limited' },
  { feature: 'Dynamic Roadmaps',         pathforge: true,   others: false },
  { feature: 'Gamified Experience',      pathforge: true,   others: false },
  { feature: 'Resume AI Analyzer',       pathforge: true,   others: false },
  { feature: 'Cost',                     pathforge: 'Free', others: 'Expensive' },
];

// ── Feature Card ──────────────────────────────────────────────────
function FeatureCard({ title, description, icon: Icon, className = '', delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay }}
      className={`glass p-8 rounded-[2rem] flex flex-col justify-between group transition-all duration-500 ${className}`}
      style={{ cursor: 'default' }}
      whileHover={{ background: 'rgba(255,255,255,0.05)' }}
    >
      <div className="space-y-5">
        <div className="w-12 h-12 rounded-2xl glass flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
          <Icon className="w-5 h-5" style={{ color: 'rgba(255,255,255,0.55)' }} />
        </div>
        <h3
          className="font-display font-medium tracking-tight"
          style={{ fontSize: 'clamp(1.25rem, 2vw, 1.6rem)', color: 'rgba(255,255,255,0.88)' }}
        >
          {title}
        </h3>
        <p style={{ color: 'rgba(255,255,255,0.32)', lineHeight: 1.7, fontWeight: 300, fontSize: '0.9rem' }}>
          {description}
        </p>
      </div>
      <div className="mt-8 h-28 w-full rounded-2xl relative overflow-hidden"
        style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.03)' }}>
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.02), transparent)' }} />
        <div className="absolute -bottom-8 -right-8 w-32 h-32 rounded-full blur-3xl"
          style={{ background: 'rgba(112,161,255,0.08)' }} />
      </div>
    </motion.div>
  );
}

// ── How It Works Steps ────────────────────────────────────────────
const steps = [
  {
    title: 'Take the Psychometric AI Assessment',
    description: 'Our AI analyzes your behavioral patterns, interests, and cognitive strengths to build your unique career DNA profile.',
    phase: '01',
  },
  {
    title: 'Discover your blind spots & skill gaps',
    description: 'We compare your profile against thousands of successful career paths to identify the exact skills you need to acquire.',
    phase: '02',
  },
  {
    title: 'Follow your dynamic AI roadmap',
    description: 'Get a step-by-step guide that updates in real-time based on market trends and your personal progress.',
    phase: '03',
  },
  {
    title: 'Connect with your AI mentor 24/7',
    description: 'Your personal career co-pilot is always available to answer questions, mock interview, or provide motivation.',
    phase: '04',
  },
];

// ── Stats ─────────────────────────────────────────────────────────
const stats = [
  { value: 50,   suffix: 'K+', label: 'Students guided' },
  { value: 94,   suffix: '%',  label: 'Career satisfaction' },
  { value: 200,  suffix: '+',  label: 'Career paths mapped' },
];

// ── Main Component ────────────────────────────────────────────────
export default function Landing() {
  const navigate = useNavigate();
  const heroRef  = useRef(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const videoOpacity = useTransform(scrollYProgress, [0, 0.5], [0.5, 0]);
  const videoScale   = useTransform(scrollYProgress, [0, 0.5], [1, 1.08]);

  const dispatch  = useDispatch();

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
  onError: () => toast.error('Google sign-in failed'),
});

  return (
    <div className="min-h-screen text-white overflow-x-hidden" style={{ background: '#050505' }}>

      {/* ══════════════════════════════
          NAVBAR
      ══════════════════════════════ */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 left-0 right-0 z-50 flex justify-center"
        style={{ padding: '20px 24px' }}
      >
        <div className="glass px-6 py-3 rounded-full flex items-center gap-8">
          <div className="flex items-center gap-2 font-display font-bold" style={{ fontSize: '1.1rem' }}>
            <Sparkles className="w-5 h-5" style={{ color: '#70a1ff' }} />
            PathForge AI
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm font-medium" style={{ color: 'rgba(255,255,255,0.45)' }}>
            <a href="#features"    className="hover:text-white transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-white transition-colors">How it Works</a>
            <a href="#why"          className="hover:text-white transition-colors">Why Us</a>
          </div>
          <button
            onClick={() => googleLogin()}
            className="btn-primary px-5 py-2 text-sm"
          >
            Get Started
          </button>
        </div>
      </motion.nav>

      {/* ══════════════════════════════
          HERO
      ══════════════════════════════ */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
        style={{ padding: '128px 24px 80px' }}
      >
        {/* Background video */}
        <motion.div
          style={{ opacity: videoOpacity, scale: videoScale }}
          className="absolute inset-0 pointer-events-none"
          css={{ zIndex: -1 }}
        >
          <video autoPlay muted loop playsInline className="w-full h-full object-cover"
            style={{ position: 'absolute', inset: 0 }}>
            <source src="https://cdn.pixabay.com/video/2021/09/01/87134-596547630_large.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.55)' }} />
        </motion.div>

        {/* Aurora glow */}
        <div className="absolute inset-0 bg-aurora pointer-events-none" style={{ opacity: 0.22, zIndex: 0 }} />

        <div className="relative max-w-5xl w-full text-center" style={{ zIndex: 1 }}>

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span
              className="inline-block rounded-full glass text-xs font-bold tracking-widest uppercase mb-10"
              style={{ padding: '6px 18px', color: '#70a1ff', letterSpacing: '0.12em' }}
            >
              ✦ AI-Powered Career Intelligence · 
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="font-display font-medium tracking-tight text-luxury"
            style={{
              fontSize: 'clamp(3.8rem, 10.5vw, 8.5rem)',
              lineHeight: 0.9,
              marginBottom: '2.5rem',
            }}
          >
            Stop Guessing.
            <br />
            <span
              className="font-serif font-light"
              style={{ fontStyle: 'italic', opacity: 0.72 }}
            >
              Start Forging.
            </span>
          </motion.h1>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="font-light tracking-wide"
            style={{
              fontSize: 'clamp(1rem, 2vw, 1.2rem)',
              color: 'rgba(255,255,255,0.38)',
              maxWidth: '520px',
              margin: '0 auto 3.5rem',
              lineHeight: 1.75,
            }}
          >
            PathForge reads your personality, maps your skills, and builds a{' '}
            <span style={{ color: 'rgba(255,255,255,0.72)', fontStyle: 'italic', fontFamily: 'Cormorant Garamond, serif' }}>
              living career roadmap
            </span>{' '}
            that evolves with you — powered by GPT-4o.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button
              onClick={() => googleLogin()}
              className="btn-primary flex items-center gap-3"
              style={{ padding: '14px 36px', fontSize: '1rem' }}
            >
              <GoogleIcon />
              Continue with Google
            </button>
            <Link
              to="/register"
              className="btn-ghost flex items-center gap-2 font-medium"
              style={{ padding: '14px 36px', fontSize: '1rem', color: 'rgba(255,255,255,0.6)' }}
            >
              Create account <span style={{ opacity: 0.5 }}>→</span>
            </Link>
          </motion.div>
        </div>

        {/* Dashboard Mockup */}
        <motion.div
          initial={{ opacity: 0, y: 100 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 1.1, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-5xl mx-auto"
          style={{ marginTop: '80px', zIndex: 1 }}
        >
          <div className="glass rounded-2xl relative overflow-hidden" style={{ padding: '16px' }}>
            <div className="absolute inset-0"
              style={{ background: 'linear-gradient(135deg, rgba(112,161,255,0.07), transparent, rgba(43,203,186,0.07))' }} />
            <div className="relative w-full rounded-xl overflow-hidden flex flex-col"
              style={{ border: '1px solid rgba(255,255,255,0.09)', background: 'rgba(0,0,0,0.55)', minHeight: '340px' }}>
              {/* Window chrome */}
              <div className="flex items-center gap-2 px-4" style={{ height: '40px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: 'rgba(255,80,80,0.5)' }} />
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: 'rgba(255,190,0,0.5)' }} />
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: 'rgba(40,200,80,0.5)' }} />
                <div className="ml-4 text-xs font-mono" style={{ color: 'rgba(255,255,255,0.2)' }}>PathForge AI — Dashboard</div>
              </div>
              {/* Content */}
              <div className="flex-1 flex gap-4 p-4">
                {/* Sidebar sim */}
                <div className="w-44 space-y-2 flex-shrink-0">
                  {['Dashboard', 'Career AI', 'Roadmap', 'Resume AI', 'AI Counselor', 'Skill Gap'].map((item, i) => (
                    <div key={i} className="h-8 rounded-xl flex items-center px-3"
                      style={{
                        fontSize: '0.7rem',
                        background: i === 0 ? 'rgba(255,255,255,0.09)' : 'transparent',
                        color: i === 0 ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.18)',
                      }}>
                      {i === 0 && <div className="w-1.5 h-1.5 rounded-full mr-2" style={{ background: '#70a1ff' }} />}
                      {item}
                    </div>
                  ))}
                </div>
                {/* Main content sim */}
                <div className="flex-1 space-y-3">
                  <div className="h-7 w-40 rounded-lg animate-pulse" style={{ background: 'rgba(255,255,255,0.06)' }} />
                  <div className="grid grid-cols-3 gap-3">
                    {[['🎯 92%', 'Career Match'], ['📍 Phase 3', 'Roadmap'], ['📄 85', 'ATS Score']].map(([val, lbl], i) => (
                      <div key={i} className="rounded-xl flex flex-col items-center justify-center py-3"
                        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <div className="text-sm font-semibold" style={{ color: 'rgba(255,255,255,0.7)' }}>{val}</div>
                        <div className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.2)' }}>{lbl}</div>
                      </div>
                    ))}
                  </div>
                  <div className="w-full rounded-xl relative overflow-hidden"
                    style={{ height: '140px', background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 140" preserveAspectRatio="none">
                      <motion.path
                        d="M 0 110 Q 60 80 120 90 T 240 55 T 360 35 T 400 40"
                        fill="none" strokeWidth="2.5" stroke="url(#g1)"
                        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                      />
                      <defs>
                        <linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#70a1ff" />
                          <stop offset="100%" stopColor="#2bcbba" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Glow blobs */}
          <div className="absolute rounded-full blur-3xl pointer-events-none"
            style={{ top: '-48px', left: '-48px', width: '192px', height: '192px', background: 'rgba(112,161,255,0.13)' }} />
          <div className="absolute rounded-full blur-3xl pointer-events-none"
            style={{ bottom: '-48px', right: '-48px', width: '192px', height: '192px', background: 'rgba(43,203,186,0.13)' }} />
        </motion.div>
      </section>

      {/* ══════════════════════════════
          STATS BAR
      ══════════════════════════════ */}
      <section style={{ padding: '80px 24px', background: 'rgba(0,0,0,0.6)' }}>
        <div className="max-w-4xl mx-auto grid grid-cols-3 gap-8 text-center">
          {stats.map((s, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
              <div className="font-display font-medium" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', color: 'rgba(255,255,255,0.9)', lineHeight: 1 }}>
                <Counter value={s.value} />{s.suffix}
              </div>
              <div className="mt-2 text-sm font-light" style={{ color: 'rgba(255,255,255,0.3)', letterSpacing: '0.05em' }}>
                {s.label}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════
          PROBLEM SECTION
      ══════════════════════════════ */}
      <section className="min-h-screen flex flex-col items-center justify-center" style={{ padding: '120px 24px', background: '#000' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }} whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }} transition={{ duration: 1 }}
          className="max-w-4xl w-full text-center"
        >
          <span className="font-serif italic block mb-8" style={{ fontSize: '1.2rem', color: 'rgba(255,255,255,0.3)' }}>
            The Reality Check
          </span>
          <div className="mb-14">
            <div
              className="font-display font-light tracking-tighter text-white leading-none mb-6"
              style={{ fontSize: 'clamp(6rem, 18vw, 14rem)' }}
            >
              <Counter value={65} />%
            </div>
            <p className="font-serif italic max-w-2xl mx-auto leading-tight"
              style={{ fontSize: 'clamp(1.4rem, 3vw, 2.5rem)', color: 'rgba(255,255,255,0.72)' }}>
              of students graduate without a clear career path.
            </p>
          </div>
          <div className="space-y-8 max-w-3xl mx-auto font-light"
            style={{ fontSize: 'clamp(1rem, 2vw, 1.25rem)', color: 'rgba(255,255,255,0.28)', lineHeight: 1.8 }}>
            <p>One-size-fits-all advice fails millions. Traditional counseling is expensive, inaccessible, and generic.</p>
            <p className="font-serif italic" style={{ color: 'rgba(255,255,255,0.85)', fontSize: '1.4rem' }}>
              It's time for a change.
            </p>
          </div>
        </motion.div>
      </section>

      {/* ══════════════════════════════
          BENTO FEATURES
      ══════════════════════════════ */}
      <section id="features" style={{ padding: '120px 24px' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <motion.h2
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-display font-medium tracking-tight mb-8"
              style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)' }}
            >
              Intelligence in{' '}
              <span className="font-serif italic font-light">every step.</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
              viewport={{ once: true }} transition={{ delay: 0.2 }}
              className="font-light"
              style={{ color: 'rgba(255,255,255,0.32)', fontSize: '1.1rem', maxWidth: '500px', margin: '0 auto' }}
            >
              A complete career intelligence suite built for the modern Indian student.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5" style={{ gridAutoRows: '280px' }}>
            <FeatureCard
              title="Behavioral AI & Psychometrics"
              description="Deep personality mapping aligns your career with your core strengths and values. MBTI-style analysis powered by GPT-4o gives you a complete cognitive blueprint."
              icon={Brain}
              className="md:col-span-2 md:row-span-2"
              delay={0.1}
            />
            <FeatureCard
              title="Skill Gap Detection"
              description="Identify exactly what you're missing for your dream role with a prioritized, AI-curated learning plan."
              icon={Target}
              delay={0.2}
            />
            <FeatureCard
              title="AI Career Counselor"
              description="24/7 access to a GPT-4o powered coach that knows your full profile and history."
              icon={Mic}
              delay={0.3}
            />
            <FeatureCard
              title="Dynamic Roadmaps"
              description="A living 6-phase career path that adapts as you grow and the industry shifts in real time."
              icon={Map}
              className="md:col-span-2"
              delay={0.4}
            />
            <FeatureCard
              title="Gamified Learning"
              description="Earn XP, unlock badges, maintain streaks, and compete on the national leaderboard."
              icon={Trophy}
              className="md:col-span-3"
              delay={0.5}
            />
          </div>
        </div>
      </section>

      {/* ══════════════════════════════
          HOW IT WORKS
      ══════════════════════════════ */}
      <section id="how-it-works" style={{ padding: '120px 24px' }}>
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display font-medium tracking-tight mb-20"
            style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)' }}
          >
            The Process.
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.8, delay: i * 0.12 }}
                className="glass rounded-[2rem] transition-all duration-500"
                style={{ padding: '40px' }}
                whileHover={{ background: 'rgba(255,255,255,0.04)' }}
              >
                <span className="font-serif italic block mb-5"
                  style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.22)' }}>
                  Phase {step.phase}
                </span>
                <h3 className="font-display font-medium mb-4"
                  style={{ fontSize: 'clamp(1.3rem, 2.5vw, 1.8rem)', color: 'white', lineHeight: 1.2 }}>
                  {step.title}
                </h3>
                <p style={{ color: 'rgba(255,255,255,0.32)', lineHeight: 1.75, fontWeight: 300 }}>
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════
          WHY WE WIN
      ══════════════════════════════ */}
      <section id="why" style={{ padding: '120px 24px', background: '#000' }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-24">
            <motion.h2
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-display font-medium tracking-tight mb-8"
              style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)' }}
            >
              Why we win.
            </motion.h2>
            <p className="font-light" style={{ color: 'rgba(255,255,255,0.32)', fontSize: '1.1rem' }}>
              The intersection of LinkedIn, Khan Academy, and Stanford-level counseling.
            </p>
          </div>

          <div className="glass overflow-hidden" style={{ borderRadius: '2.5rem' }}>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <th className="font-serif italic" style={{ padding: '32px', color: 'rgba(255,255,255,0.22)', fontSize: '1rem' }}>Feature</th>
                  <th className="font-display font-medium" style={{ padding: '32px', color: 'white', fontSize: '1.1rem' }}>PathForge AI</th>
                  <th style={{ padding: '32px', color: 'rgba(255,255,255,0.18)', fontWeight: 400, fontSize: '0.9rem' }}>Traditional</th>
                </tr>
              </thead>
              <tbody>
                {comparison.map((row, i) => (
                  <motion.tr
                    key={i}
                    initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                    style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}
                    className="transition-colors"
                    whileHover={{ background: 'rgba(255,255,255,0.02)' }}
                  >
                    <td style={{ padding: '28px 32px', color: 'rgba(255,255,255,0.45)', fontWeight: 300, fontSize: '0.9rem' }}>{row.feature}</td>
                    <td style={{ padding: '28px 32px' }}>
                      {typeof row.pathforge === 'boolean'
                        ? <Check className="w-5 h-5" style={{ color: 'rgba(255,255,255,0.75)' }} />
                        : <span style={{ color: 'rgba(255,255,255,0.85)', fontWeight: 500, fontSize: '0.9rem' }}>{row.pathforge}</span>
                      }
                    </td>
                    <td style={{ padding: '28px 32px', color: 'rgba(255,255,255,0.13)' }}>
                      {typeof row.others === 'boolean'
                        ? <X className="w-4 h-4" />
                        : <span style={{ fontStyle: 'italic', fontSize: '0.85rem' }}>{row.others}</span>
                      }
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════
          FOOTER CTA
      ══════════════════════════════ */}
      <footer className="relative overflow-hidden" style={{ paddingTop: '120px', paddingBottom: '48px', paddingLeft: '24px', paddingRight: '24px' }}>
        <div className="absolute bottom-0 left-0 right-0 pointer-events-none"
          style={{ height: '500px', background: 'radial-gradient(ellipse at 50% 100%, rgba(112,161,255,0.12) 0%, rgba(165,94,234,0.08) 40%, transparent 70%)', zIndex: 0 }} />

        <div className="max-w-7xl mx-auto relative" style={{ zIndex: 1 }}>
          {/* Big CTA headline */}
          <div className="flex flex-col items-center text-center mb-20">
            <motion.h2
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-display font-medium tracking-tighter text-luxury mb-12"
              style={{ fontSize: 'clamp(3rem, 10vw, 9rem)', lineHeight: 0.88 }}
            >
              Stop wandering.
              <br />
              <span className="font-serif font-light italic" style={{ opacity: 0.7 }}>
                Start forging.
              </span>
            </motion.h2>

            <motion.button
              initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: 0.2 }}
              onClick={() => googleLogin()}
              className="btn-primary flex items-center gap-3"
              style={{ padding: '16px 40px', fontSize: '1rem' }}
            >
              <GoogleIcon />
              Start for free with Google
            </motion.button>
          </div>

          {/* Bottom bar */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-10"
            style={{ borderTop: '1px solid rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.25)', fontSize: '0.85rem' }}>
            <div className="flex items-center gap-2 font-display font-bold text-white">
              <Sparkles className="w-4 h-4" style={{ color: '#70a1ff' }} />
              PathForge AI
            </div>
            <div className="flex gap-8">
              {['Privacy', 'Terms', 'Twitter', 'LinkedIn'].map(link => (
                <a key={link} href="#" className="hover:text-white transition-colors">{link}</a>
              ))}
            </div>
            <p>© 2026 PathForge AI · </p>
          </div>
        </div>
      </footer>

    </div>
  );
}