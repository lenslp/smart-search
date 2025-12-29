import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { ICONS } from '../constants';
import { SearchParams, SearchType } from '../types';

interface HeaderProps {
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

const Layout: React.FC<HeaderProps> = ({ theme, onToggleTheme }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useState<SearchParams>({
    timeRange: '7d',
    spatialRange: [],
    similarity: 70
  });

  const navItems = [
    { id: 'HOME', label: '多维搜索', icon: ICONS.Search },
    { id: 'TASKS', label: '任务中心', icon: ICONS.Tasks },
    { id: 'STATS', label: '推理看板', icon: ICONS.Chart },
  ];

  const handleSearch = (params: Partial<SearchParams>, type: SearchType = SearchType.TEXT) => {
    console.log('Searching with params:', params, 'type:', type);
    setSearchParams(prev => ({ ...prev, ...params }));
    navigate('/results');
  };

  const getCurrentView = () => {
    const path = location.pathname;
    if (path === '/' || path === '') return 'HOME';
    if (path === '/results') return 'HOME';
    if (path === '/tasks') return 'TASKS';
    if (path === '/history') return 'STATS';
    if (path === '/trajectory') return 'STATS';
    return 'HOME';
  };

  const navigateTo = (viewId: string) => {
    if (viewId === 'HOME') navigate('/');
    else if (viewId === 'TASKS') navigate('/tasks');
    else if (viewId === 'STATS') navigate('/history');
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden transition-colors duration-500">
      <header className="h-20 flex items-center justify-between px-10 glass-panel border-b border-purple-500/10 z-50 sticky top-0 shadow-2xl">
        <div className="flex items-center gap-4 cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-indigo-700 rounded-xl flex items-center justify-center text-white shadow-[0_0_20px_rgba(168,85,247,0.3)]">
            <svg viewBox="0 0 24 24" className="w-7 h-7 fill-current">
              <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight purple-gradient-text">
              宇泛智能搜索
            </h1>
            <div className="text-[10px] text-purple-500 font-bold tracking-[0.2em] uppercase opacity-60">Intelligent Analysis System</div>
          </div>
        </div>
        
        <nav className="hidden lg:flex items-center gap-10 text-xs font-bold uppercase tracking-widest text-[var(--text-secondary)]">
          {navItems.map(item => (
            <button 
              key={item.id}
              onClick={() => navigateTo(item.id)}
              className={`hover:text-purple-500 transition-all flex items-center gap-2 border-b-2 pb-1 ${getCurrentView() === item.id ? 'text-purple-500 border-purple-500' : 'border-transparent'}`}
            >
              {item.icon} {item.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-6">
          <button 
            onClick={onToggleTheme}
            className="p-3 rounded-xl bg-[var(--tab-bg)] text-purple-500 hover:bg-purple-500/10 transition-all border border-purple-500/10"
          >
            {theme === 'dark' ? ICONS.Sun : ICONS.Moon}
          </button>
          {/* <div className="h-8 w-px bg-slate-300 dark:bg-white/5 mx-2" />
          <button className="p-1 rounded-full bg-gradient-to-br from-purple-500/20 to-indigo-600/20 hover:from-purple-500/40 hover:to-indigo-600/40 transition-all border border-purple-500/30">
            <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-900 border border-white/10 flex items-center justify-center overflow-hidden">
               <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="User" />
            </div>
          </button> */}
        </div>
      </header>

      <main className="flex-1 flex flex-col z-10 overflow-hidden">
        <Outlet context={{ searchParams, onSearch: handleSearch }} />
      </main>

      <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-purple-900/5 rounded-full blur-[160px] bg-blob" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-indigo-900/5 rounded-full blur-[140px] bg-blob" style={{ animationDelay: '-5s' }} />
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      </div>
    </div>
  );
};

export default Layout;
