import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../../store/slices/authSlice';
import { useState } from 'react';
import { Flame, Zap } from 'lucide-react';

export default function Navbar() {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const { user }  = useSelector(s => s.auth);
  const [menu, setMenu] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <header className="fixed top-0 right-0 left-0 z-30 h-14 flex items-center px-6 justify-end gap-3"
      style={{ background: 'rgba(5,5,5,0.8)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>

      {/* XP pill */}
      {user && (
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
          <Zap className="w-3 h-3 text-aurora-blue" />
          <span className="text-white/40">Lv {user.level}</span>
          <div className="w-16 h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
            <div className="h-full rounded-full" style={{ width: `${(user.xp % 100)}%`, background: 'linear-gradient(90deg, #70a1ff, #a55eea)' }} />
          </div>
          <span className="text-aurora-blue font-medium">{user.xp} XP</span>
        </div>
      )}

      {/* Streak */}
      {user?.streak > 0 && (
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs"
          style={{ background: 'rgba(255,100,0,0.08)', border: '1px solid rgba(255,100,0,0.15)' }}>
          <Flame className="w-3 h-3 text-orange-400" />
          <span className="text-orange-300 font-medium">{user.streak}</span>
        </div>
      )}

      {/* Avatar */}
      <div className="relative">
        <button onClick={() => setMenu(m => !m)}
          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold hover:scale-105 transition-transform"
          style={{ background: 'linear-gradient(135deg, #70a1ff, #a55eea)' }}>
          {user?.name?.charAt(0).toUpperCase()}
        </button>

        {menu && (
          <div className="absolute right-0 top-11 w-44 rounded-2xl py-1 z-50 overflow-hidden"
            style={{ background: 'rgba(10,10,10,0.95)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(20px)' }}>
            <Link to="/app/profile" onClick={() => setMenu(false)}
              className="block px-4 py-2.5 text-sm text-white/50 hover:text-white hover:bg-white/[0.04] transition-colors">
              Profile
            </Link>
            <Link to="/app" onClick={() => setMenu(false)}
              className="block px-4 py-2.5 text-sm text-white/50 hover:text-white hover:bg-white/[0.04] transition-colors">
              Dashboard
            </Link>
            <div style={{ height: '1px', background: 'rgba(255,255,255,0.05)', margin: '4px 0' }} />
            <button onClick={handleLogout}
              className="w-full text-left px-4 py-2.5 text-sm text-red-400/70 hover:text-red-400 hover:bg-red-500/[0.05] transition-colors">
              Sign out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}