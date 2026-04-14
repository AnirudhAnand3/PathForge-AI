import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMe } from './store/slices/authSlice';
import { Toaster } from 'react-hot-toast';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import CareerAnalysis from './pages/CareerAnalysis';
import Roadmap from './pages/Roadmap';
import ResumeAnalyzer from './pages/ResumeAnalyzer';
import AICounselor from './pages/AICounselor';
import MentorMatch from './pages/MentorMatch';
import SkillGap from './pages/SkillGap';
import Leaderboard from './pages/Leaderboard';
import Profile from './pages/Profile';
import Explore from './pages/Explore';
import MainLayout from './components/layout/MainLayout';

const ProtectedRoute = ({ children }) => {
  const { token, user } = useSelector(s => s.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    if (token && !user) {
      dispatch(fetchMe());
    }
  }, [token, user]);

  if (!token) return <Navigate to="/login" replace />;
  return children;
};

export default function App() {
  const dispatch = useDispatch();
  const token = useSelector(s => s.auth.token);

  useEffect(() => {
    if (token) dispatch(fetchMe());
  }, [token]);

  return (
    <BrowserRouter>
      <Toaster position="top-right" toastOptions={{ style: { background: '#1a1a2e', color: '#fff', border: '1px solid #2d2d44' } }} />
      <Routes>
        {/* Public */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected */}
        <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
        <Route path="/app" element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
          <Route index element={<Dashboard />} />
          <Route path="career" element={<CareerAnalysis />} />
          <Route path="roadmap" element={<Roadmap />} />
          <Route path="resume" element={<ResumeAnalyzer />} />
          <Route path="counselor" element={<AICounselor />} />
          <Route path="mentors" element={<MentorMatch />} />
          <Route path="skills" element={<SkillGap />} />
          <Route path="leaderboard" element={<Leaderboard />} />
          <Route path="profile" element={<Profile />} />
          <Route path="explore" element={<Explore />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}