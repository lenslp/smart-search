
import React, { useState, useEffect, useRef } from 'react';
import { ICONS } from '../constants';
import { SearchType, SearchParams } from '../types';
import MapPickerModal from './MapPickerModal';

interface SearchHomeProps {
  onSearch: (params: Partial<SearchParams>, type: SearchType) => void;
}

const SearchHome: React.FC<SearchHomeProps> = ({ onSearch }) => {
  const [activeTab, setActiveTab] = useState<'IMAGE' | 'VIDEO'>('IMAGE');
  const [inputValue, setInputValue] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [spatialRange, setSpatialRange] = useState<string[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  
  const [timeMode, setTimeMode] = useState<'1d' | '3d' | '7d' | 'custom'>('7d');
  const [showMapModal, setShowMapModal] = useState(false);
  const [spatialInfo, setSpatialInfo] = useState<{ radius: number; deviceCount: number } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [displayPlaceholder, setDisplayPlaceholder] = useState('');
  const [cursorVisible, setCursorVisible] = useState(true);

  const hotSearches = [
    { label: '人体', icon: '👤' },
    { label: '车辆', icon: '🚗' },
    { label: '非机动车', icon: '🚲' }
  ];

  const loadingTexts = [
    "正在分析您的搜索意图...",
    "正在全城监控范围内寻找目标...",
    "正在根据相似度进行智能排序...",
    "检索结果即将呈现..."
  ];

  const placeholders = [
    "输入特征描述（如：穿黑衣服的人）或上传图片...",
    "在海量监控录像中快速定位目标...",
    "支持多模态搜索：文字、图片、视频..."
  ];

  useEffect(() => {
    let currentIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let timer: NodeJS.Timeout;

    const typeWriter = () => {
      const currentText = placeholders[currentIndex];
      
      if (isDeleting) {
        setDisplayPlaceholder(currentText.substring(0, charIndex - 1));
        charIndex--;
      } else {
        setDisplayPlaceholder(currentText.substring(0, charIndex + 1));
        charIndex++;
      }

      let typeSpeed = isDeleting ? 30 : 50;

      if (!isDeleting && charIndex === currentText.length) {
        typeSpeed = 2000;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        currentIndex = (currentIndex + 1) % placeholders.length;
        typeSpeed = 500;
      }

      timer = setTimeout(typeWriter, typeSpeed);
    };

    typeWriter();

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const cursorTimer = setInterval(() => {
      setCursorVisible(v => !v);
    }, 500);
    return () => clearInterval(cursorTimer);
  }, []);

  const handleExecute = () => {
    const searchType = activeTab === 'VIDEO' ? SearchType.VIDEO : 
                     (selectedImage ? SearchType.IMAGE : SearchType.TEXT);
    
    setIsLoading(true);
    
    let step = 0;
    const interval = setInterval(() => {
      step++;
      setLoadingStep(step % loadingTexts.length);
    }, 500);

    setTimeout(() => {
      clearInterval(interval);
      onSearch({ 
        spatialRange: spatialInfo ? ['SIMULATED_RANGE'] : [], 
        timeRange: timeMode === 'custom' ? 'custom' : (timeMode as any) 
      }, searchType);
      setIsLoading(false);
    }, 2200);
  };

  const handleMapConfirm = (data: { radius: number; deviceCount: number }) => {
    setSpatialInfo(data);
    setSpatialRange(['SIMULATED_RADIUS_RANGE']);
    setShowMapModal(false);
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 max-w-6xl mx-auto w-full relative">
      {showMapModal && <MapPickerModal onClose={() => setShowMapModal(false)} onConfirm={handleMapConfirm} />}

      {isLoading && (
        <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-black/80 backdrop-blur-2xl animate-in fade-in duration-300">
          <div className="relative mb-10">
            <div className="w-32 h-32 border-2 border-purple-500/20 rounded-full animate-[spin_3s_linear_infinite]" />
            <div className="absolute inset-0 w-32 h-32 border-t-2 border-purple-500 rounded-full animate-[spin_1s_ease-in-out_infinite]" />
            <div className="absolute inset-4 border border-indigo-500/30 rounded-full animate-pulse" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-purple-500 animate-pulse">{ICONS.Search}</div>
            </div>
          </div>
          <div className="space-y-4 text-center">
            <h3 className="text-xl font-black text-white uppercase tracking-[0.3em] animate-pulse">
              系统正在全力检索
            </h3>
            <div className="flex flex-col items-center gap-2">
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest h-4">
                {loadingTexts[loadingStep]}
              </p>
              <div className="w-64 h-1 bg-white/5 rounded-full overflow-hidden mt-2">
                <div className="h-full bg-gradient-to-r from-purple-600 to-indigo-600 animate-[loadingBar_2s_infinite]" />
              </div>
            </div>
          </div>
          <style>{`
            @keyframes loadingBar {
              0% { width: 0%; transform: translateX(-100%); }
              50% { width: 100%; transform: translateX(0); }
              100% { width: 0%; transform: translateX(100%); }
            }
          `}</style>
        </div>
      )}

      <div className="text-center mb-10 space-y-4">
        <h2 className="text-5xl font-black tracking-tight text-[var(--text-primary)]">
          智能<span className="purple-gradient-text">搜索</span>
        </h2>
        <p className="text-[var(--text-secondary)] text-lg font-medium tracking-wide">
          通过文字描述或上传图片，在海量监控中快速锁定目标
        </p>
      </div>

      <div className="w-full glass-panel rounded-[2.5rem] overflow-hidden shadow-2xl border-white/5 relative">
        {/* Tabs */}
        <div className="flex bg-[var(--tab-bg)] border-b border-[var(--border-color)]">
          <button 
            onClick={() => setActiveTab('IMAGE')}
            className={`flex-1 py-5 text-sm font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 ${activeTab === 'IMAGE' ? 'text-purple-500 bg-[var(--bg-panel)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
          >
            {ICONS.Search} 搜图
          </button>
          <button 
            onClick={() => setActiveTab('VIDEO')}
            className={`flex-1 py-5 text-sm font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 ${activeTab === 'VIDEO' ? 'text-purple-500 bg-[var(--bg-panel)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
          >
            {ICONS.Video} 搜视频
          </button>
        </div>

        {/* Main Content Area */}
        <div className="p-10 space-y-6 relative z-10">
          <div className="space-y-4">
            <div className="relative group">
              {/* 搜索框光晕效果 */}
              <div className={`absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-3xl opacity-0 transition-all duration-500 blur-lg
                ${isFocused ? 'opacity-30' : ''}`} />
              
              <div className={`relative flex gap-4 p-4 bg-black/40 border rounded-3xl transition-all duration-300
                ${isFocused ? 'border-purple-500/50 shadow-[0_0_30px_rgba(139,92,246,0.2)]' : 'border-white/5 hover:border-white/10'}`}>
                <div className="relative flex-1">
                  <textarea 
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder=""
                    className="w-full bg-transparent text-lg text-[var(--text-primary)] placeholder-slate-600 focus:outline-none resize-none pt-2 pb-2"
                  />
                  
                  {/* 打字机占位符 */}
                  {!inputValue && (
                    <div className="absolute left-0 top-2 text-lg pointer-events-none">
                      <span className="text-slate-600">{displayPlaceholder}</span>
                      <span className={`inline-block w-0.5 h-5 ml-1 align-middle ${cursorVisible ? 'bg-purple-500' : 'bg-transparent'} transition-colors`} />
                    </div>
                  )}
                </div>
                
                <div className="w-28 border-l border-white/5 pl-4 flex flex-col items-center justify-center gap-2">
                  {selectedImage ? (
                    <div className="relative w-full aspect-square rounded-xl overflow-hidden border border-purple-500/50 shadow-lg group/img animate-[fadeIn_0.3s_ease-out]">
                      <img src={selectedImage} className="w-full h-full object-cover transition-transform group-hover/img:scale-110" alt="Upload" />
                      <div className="absolute inset-0 bg-gradient-to-t from-purple-500/20 to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity" />
                      <button 
                        onClick={() => setSelectedImage(null)}
                        className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 flex items-center justify-center text-white transition-all"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                      </button>
                      <div className="absolute bottom-2 left-2 right-2 h-0.5 bg-white/20 rounded overflow-hidden">
                        <div className="h-full bg-purple-500 animate-[scan_1.5s_linear_infinite]" style={{ width: '30%' }} />
                      </div>
                    </div>
                  ) : (
                    <label className="w-full aspect-square border-2 border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center gap-1 cursor-pointer hover:bg-purple-500/5 hover:border-purple-500/30 transition-all group/upload animate-[pulse_3s_ease-in-out_infinite]">
                      <div className="text-purple-400 group-hover/upload:scale-110 transition-transform scale-90">{ICONS.Image}</div>
                      <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest group-hover/upload:text-purple-400 transition-colors">上传图片</span>
                      <input type="file" className="hidden" onChange={() => setSelectedImage('https://picsum.photos/seed/upload/400/400')} />
                    </label>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2.5 mt-4 px-2">
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">热门搜索:</span>
                {hotSearches.map((hot, index) => (
                  <button 
                    key={hot.label} 
                    onClick={() => { setInputValue(hot.label); setSelectedImage(null); }}
                    className="px-3 py-1.5 rounded-lg bg-purple-500/5 border border-purple-500/10 text-[10px] font-bold text-slate-400 hover:bg-purple-500 hover:text-white hover:border-purple-500 transition-all active:scale-95 animate-[fadeInUp_0.5s_ease-out_both]"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <span className="mr-1">{hot.icon}</span>
                    {hot.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Unified Config Strip */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pt-8 border-t border-white/5">
             <div className="space-y-4">
               <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-2">
                 {ICONS.Clock} 时间范围
               </label>
               <div className="grid grid-cols-2 gap-2">
                 {['1d', '3d', '7d', 'custom'].map((t, i) => (
                   <button 
                    key={t} 
                    onClick={() => setTimeMode(t as any)}
                    className={`py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all relative overflow-hidden
                      ${timeMode === t ? 'bg-purple-600 border-purple-600 text-white shadow-lg' : 'border-white/10 text-slate-400 hover:border-purple-500/30'}`}
                   >
                     {timeMode === t && (
                       <span className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-indigo-400/20 animate-pulse" />
                     )}
                     <span className="relative z-10">{t === 'custom' ? '自定义' : t.replace('d', '天内')}</span>
                   </button>
                 ))}
               </div>
             </div>

             <div className="space-y-4">
               <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-2">
                 {ICONS.Map} 空间范围
               </label>
               <button 
                onClick={() => setShowMapModal(true)}
                className={`w-full h-[64px] border-2 border-dashed rounded-2xl flex flex-col items-center justify-center gap-1 transition-all group relative overflow-hidden
                  ${spatialInfo ? 'bg-purple-600/10 border-purple-500 text-purple-400' : 'border-white/10 hover:border-purple-500/40'}`}
               >
                 {!spatialInfo && (
                   <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/5 to-transparent translate-x-[-100%] animate-[shimmer_2s_infinite]" />
                 )}
                  <span className="text-[10px] font-black uppercase tracking-widest">
                    {spatialInfo ? `已选范围: ${spatialInfo.radius}米` : '地图选点/区域'}
                  </span>
                  <span className="text-[9px] font-bold text-slate-500 uppercase">
                    {spatialInfo ? `覆盖 ${spatialInfo.deviceCount} 个监控设备` : '选择特定区域内的设备'}
                  </span>
               </button>
             </div>

             <div className="space-y-4">
               <div className="flex justify-between items-center">
                 <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-2">
                   {ICONS.Filter} 相似度
                 </label>
                 <span className="text-lg font-black purple-gradient-text tabular-nums animate-[pulse_2s_ease-in-out_infinite]">70%</span>
               </div>
               <div className="pt-2 px-1 relative">
                <input type="range" min="50" max="100" className="w-full h-1 bg-white/5 rounded-full appearance-none cursor-pointer accent-purple-600 relative z-10" defaultValue={70} />
                <div className="absolute inset-0 h-1 bg-white/5 rounded-full overflow-hidden pointer-events-none">
                  <div className="h-full w-[70%] bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-[glow_2s_ease-in-out_infinite]" />
                </div>
                <div className="flex justify-between mt-2 text-[8px] font-bold text-slate-600 uppercase tracking-tighter">
                  <span className="hover:text-purple-400 transition-colors cursor-default">较模糊</span>
                  <span className="hover:text-purple-400 transition-colors cursor-default">极精准</span>
                </div>
               </div>
             </div>

             <div className="flex items-end">
               <button 
                  onClick={handleExecute}
                  disabled={isLoading}
                  className="w-full relative bg-gradient-to-br from-purple-600 to-indigo-700 hover:from-purple-500 hover:to-indigo-600 text-white py-5 rounded-3xl shadow-[0_15px_30px_rgba(139,92,246,0.3)] transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed group overflow-hidden"
               >
                 {/* 波纹效果 */}
                 <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out" />
                 
                 {/* 脉冲光环 */}
                 <span className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                   <span className="absolute inset-0 rounded-3xl animate-[ping_2s_ease-out_infinite]" style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.4) 0%, transparent 70%)' }} />
                 </span>
                 
                 {/* 内部光晕 */}
                 <span className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-all duration-500">
                   <span className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-1/2 bg-gradient-to-b from-white/20 to-transparent rounded-t-3xl" />
                 </span>
                 
                 <span className="relative z-10 text-sm font-black tracking-[0.2em] uppercase group-hover:scale-105 transition-transform flex items-center justify-center gap-2">
                   {isLoading ? (
                     <>
                       <span className="animate-[spin_1s_linear_infinite]">{ICONS.Search}</span>
                       搜索中...
                     </>
                   ) : (
                     <>
                       <span className="group-hover:rotate-12 transition-transform">{ICONS.Search}</span>
                       开始分析
                     </>
                   )}
                 </span>
               </button>
             </div>
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes lightMove {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes scan {
          0% { transform: translateX(0); }
          100% { transform: translateX(233%); }
        }
        @keyframes glow {
          0%, 100% { opacity: 0.5; box-shadow: 0 0 5px rgba(139,92,246,0.5); }
          50% { opacity: 1; box-shadow: 0 0 20px rgba(139,92,246,0.8); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default SearchHome;
