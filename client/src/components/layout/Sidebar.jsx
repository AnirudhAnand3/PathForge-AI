import { NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toggleSidebar } from '../../store/slices/uiSlice';
import { motion } from 'framer-motion';
import { Sparkles, LayoutDashboard, Brain, Map, FileText, MessageSquare, Target, Users, Trophy, Compass, User, ChevronLeft, ChevronRight } from 'lucide-react';

const NAV = [
  { to: '/app',           icon: LayoutDashboard, label: 'Dashboard',    end: true },
  { to: '/app/career',    icon: Brain,            label: 'Career AI' },
  { to: '/app/roadmap',   icon: Map,              label: 'Roadmap' },
  { to: '/app/resume',    icon: FileText,         label: 'Resume AI' },
  { to: '/app/counselor', icon: MessageSquare,    label: 'AI Counselor' },
  { to: '/app/skills',    icon: Target,           label: 'Skill Gap' },
  { to: '/app/mentors',   icon: Users,            label: 'Mentors' },
  { to: '/app/leaderboard',icon: Trophy,          label: 'Leaderboard' },
  { to: '/app/explore',   icon: Compass,          label: 'Explore' },
  { to: '/app/profile',   icon: User,             label: 'Profile' },
];

export default function Sidebar() {
  const dispatch  = useDispatch();
  const isOpen    = useSelector(s => s.ui.sidebarOpen);
  const { user }  = useSelector(s => s.auth);

  return (
    <motion.aside
      animate={{ width: isOpen ? 240 : 64 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="fixed left-0 top-0 h-full z-40 flex flex-col overflow-hidden"
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(32px)', borderRight: '1px solid rgba(255,255,255,0.05)' }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="w-8 h-8 flex-shrink-0 rounded-xl glass flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-aurora-blue" />
        </div>
        {isOpen && (
          <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
            className="font-display font-bold text-base text-white whitespace-nowrap">
            PathForge AI
          </motion.span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 p-2 space-y-0.5 overflow-y-auto">
        {NAV.map(({ to, icon: Icon, label, end }) => (
          <NavLink key={to} to={to} end={end}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'active' : ''}`
            }
          >
            <Icon className="w-4 h-4 flex-shrink-0" />
            {isOpen && (
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.05 }}
                className="whitespace-nowrap text-sm">
                {label}
              </motion.span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User info */}
      {isOpen && user && (
        <div className="p-3" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/[0.04] cursor-pointer transition-colors">
            <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold"
              style={{ background: 'linear-gradient(135deg, #70a1ff, #a55eea)' }}>
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-white/80 truncate">{user.name}</p>
              <p className="text-xs text-white/30">Lvl {user.level} · {user.xp} XP</p>
            </div>
          </div>
        </div>
      )}

      {/* Toggle */}
      <button onClick={() => dispatch(toggleSidebar())}
        className="flex items-center justify-center p-3 text-white/25 hover:text-white/60 transition-colors"
        style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        {isOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
      </button>
    </motion.aside>
  );
}