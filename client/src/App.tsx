import { Routes, Route, Navigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchCurrentUser } from './api/client';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ScheduledPage from './pages/ScheduledPage';
import AnalyticsPage from './pages/AnalyticsPage';

const App = () => {
  const { data: user, isLoading } = useQuery(['me'], fetchCurrentUser, {
    retry: false
  });

  if (isLoading) return <div className="p-6">Loading...</div>;

  if (!user) return <LoginPage />;

  return (
    <Routes>
      <Route path="/" element={<DashboardPage />} />
      <Route path="/scheduled" element={<ScheduledPage />} />
      <Route path="/analytics" element={<AnalyticsPage />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default App;
