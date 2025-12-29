
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import SearchHome from './components/SearchHome';
import SearchResults from './components/SearchResults';
import VideoAnalysisView from './components/VideoAnalysisView';
import TaskCenter from './components/TaskCenter';
import InferenceHistory from './components/InferenceHistory';
import TrajectoryView from './components/TrajectoryView';
import { SearchParams, TargetType, SearchType } from './types';

type ViewState = 'HOME' | 'RESULTS' | 'VIDEO_ANALYSIS' | 'TASKS' | 'STATS' | 'TRAJECTORY';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('HOME');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [trajectoryData, setTrajectoryData] = useState<any[]>([]);
  const [params, setParams] = useState<SearchParams>({
    timeRange: '7d',
    spatialRange: [],
    similarity: 70,
    targetType: TargetType.ALL
  });

  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }
  }, [theme]);

  const handleSearch = (newParams: Partial<SearchParams>, type: SearchType = SearchType.TEXT) => {
    console.log('Searching with params:', newParams, 'type:', type);
    setParams(prev => ({ ...prev, ...newParams }));
    setView('RESULTS');
  };

  const navigateTo = (newView: ViewState) => setView(newView);

  const handleOpenTrajectory = (items: any[]) => {
    setTrajectoryData(items);
    setView('TRAJECTORY');
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden transition-colors duration-500">
      <Header theme={theme} onToggleTheme={() => setTheme(t => t === 'dark' ? 'light' : 'dark')} onNavigate={navigateTo} activeView={view} />
      
      <main className="flex-1 flex flex-col z-10 overflow-hidden">
        {view === 'HOME' && <SearchHome onSearch={handleSearch} />}
        {view === 'RESULTS' && (
          <SearchResults 
            params={params} 
            onSearch={p => handleSearch(p)} 
            onBack={() => setView('HOME')} 
            onOpenTrajectory={handleOpenTrajectory}
          />
        )}
        {view === 'VIDEO_ANALYSIS' && <VideoAnalysisView params={params} onBack={() => setView('HOME')} />}
        {view === 'TASKS' && <TaskCenter />}
        {view === 'STATS' && <InferenceHistory />}
        {view === 'TRAJECTORY' && (
          <TrajectoryView 
            items={trajectoryData} 
            onBack={() => setView('RESULTS')} 
          />
        )}
      </main>
      
      {/* Background Decor */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-purple-900/5 rounded-full blur-[160px] bg-blob" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-indigo-900/5 rounded-full blur-[140px] bg-blob" style={{ animationDelay: '-5s' }} />
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
      </div>
    </div>
  );
};

export default App;
