import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import SearchResultsPage from './pages/SearchResultsPage';
import TasksPage from './pages/TasksPage';
import HistoryPage from './pages/HistoryPage';
import TrajectoryPage from './pages/TrajectoryPage';

const App: React.FC = () => {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }
  }, [theme]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout theme={theme} onToggleTheme={() => setTheme(t => t === 'dark' ? 'light' : 'dark')} />}>
          <Route index element={<HomePage />} />
          <Route path="results" element={<SearchResultsPage />} />
          <Route path="tasks" element={<TasksPage />} />
          <Route path="history" element={<HistoryPage />} />
          <Route path="trajectory" element={<TrajectoryPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
