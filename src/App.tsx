import React, { useEffect, lazy, Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Contexts
import { AuthProvider } from './contexts/AuthContext';
import { GameProvider } from './contexts/GameContext';
import { AudioProvider } from './contexts/AudioContext';
import useAudio from './hooks/useAudio';

// Components
import LoadingScreen from './components/common/LoadingScreen';
import ProtectedRoute from './components/routing/ProtectedRoute';
import Layout from './components/layout/Layout';

// Lazy loaded pages
const Landing = lazy(() => import('./pages/Landing'));
const Login = lazy(() => import('./pages/auth/Login'));
const Register = lazy(() => import('./pages/auth/Register'));
const Dashboard = lazy(() => import('./pages/dashboard/Dashboard'));
const LevelMap = lazy(() => import('./pages/levels/LevelMap'));
const LevelDetail = lazy(() => import('./pages/levels/LevelDetail'));
const MaterialDetail = lazy(() => import('./pages/materials/MaterialDetail'));
const Quiz = lazy(() => import('./pages/quiz/Quiz'));
const QuizResult = lazy(() => import('./pages/quiz/QuizResult'));
const Profile = lazy(() => import('./pages/profile/Profile'));
const Leaderboard = lazy(() => import('./pages/leaderboard/Leaderboard'));
const NotFound = lazy(() => import('./pages/NotFound'));

const App: React.FC = () => {
  const location = useLocation();
  
  // Preload essential assets on app start
  useEffect(() => {
    // This would be a place to preload important images, sounds, etc.
    const preloadAssets = async () => {
      // Simulating asset preloading
      await new Promise(resolve => setTimeout(resolve, 100));
    };
    
    preloadAssets();
  }, []);

  return (
    <AudioProvider>
      <AuthProvider>
        <GameProvider>
          <Suspense fallback={<LoadingScreen />}>
            <AnimatePresence mode="wait">
              <Routes location={location} key={location.pathname}>
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                
                <Route element={<Layout />}>
                  <Route element={<ProtectedRoute />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/levels" element={<LevelMap />} />
                    <Route path="/levels/:id" element={<LevelDetail />} />
                    <Route path="/materials/:id" element={<MaterialDetail />} />
                    <Route path="/quiz/:levelId" element={<Quiz />} />
                    <Route path="/quiz/result/:quizId" element={<QuizResult />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/leaderboard" element={<Leaderboard />} />
                  </Route>
                </Route>
                
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AnimatePresence>
          </Suspense>
        </GameProvider>
      </AuthProvider>
    </AudioProvider>
  );
};

export default App;