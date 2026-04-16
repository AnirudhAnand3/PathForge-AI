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
import { PageLoader } from './components/ui/Loader';

const ProtectedRoute = ({ children }) => {
  const { token, user, loading } = useSelector(s => s.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    if (token && !user) dispatch(fetchMe());
  }, [token]);

  if (!token) return <Navigate to="/login" replace />;
  if (token && !user && loading) return <PageLoader />;
  return children;
};

const OnboardingRoute = ({ children }) => {
  const { token, user, loading } = useSelector(s => s.auth);
  if (!token) return <Navigate to="/login" replace />;
  // Wait for fetchMe to complete before making routing decisions
  if (loading || !user) return <PageLoader />;
  // Already fully onboarded
  if (user?.careerProfile?.selectedCareer) return <Navigate to="/app" replace />;
  // Quiz answers exist but no career selected → go to career analysis, not quiz
  if ((user?.careerProfile?.recommendedCareers?.length ?? 0) > 0) {
    return <Navigate to="/app/career" replace />;
  }
  return children;
};

export default function App() {
  const dispatch = useDispatch();
  const { token, user } = useSelector(s => s.auth);

  useEffect(() => {
    if (token && !user) dispatch(fetchMe());
  }, [token]);

  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: 'rgba(10,10,10,0.95)',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.1)',
            backdropFilter: 'blur(20px)',
            borderRadius: '12px',
            fontSize: '14px',
          }
        }}
      />
      <Routes>
        {/* Public */}
        <Route path="/"         element={<Landing />} />
        <Route path="/login"    element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Onboarding — only if no career selected */}
        <Route path="/onboarding" element={
          <OnboardingRoute><Onboarding /></OnboardingRoute>
        } />

        {/* Protected app */}
        <Route path="/app" element={
          <ProtectedRoute><MainLayout /></ProtectedRoute>
        }>
          <Route index                  element={<Dashboard />} />
          <Route path="career"          element={<CareerAnalysis />} />
          <Route path="roadmap"         element={<Roadmap />} />
          <Route path="resume"          element={<ResumeAnalyzer />} />
          <Route path="counselor"       element={<AICounselor />} />
          <Route path="mentors"         element={<MentorMatch />} />
          <Route path="skills"          element={<SkillGap />} />
          <Route path="leaderboard"     element={<Leaderboard />} />
          <Route path="profile"         element={<Profile />} />
          <Route path="explore"         element={<Explore />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}