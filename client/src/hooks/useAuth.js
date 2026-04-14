import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../store/slices/authSlice';

export const useAuth = () => {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const { user, token, loading, error } = useSelector(s => s.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return {
    user,
    token,
    loading,
    error,
    isAuthenticated: !!token,
    isStudent: user?.role === 'student',
    isMentor:  user?.role === 'mentor',
    logout: handleLogout,
  };
};