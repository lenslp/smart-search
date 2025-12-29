import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ICONS, MOCK_RESULTS } from '../constants';
import { SearchParams, SampleLabel, SearchType } from '../types';
import ResultCard from '../components/ResultCard';
import TrainingModeBar from '../components/TrainingModeBar';
import ManualCropModal from '../components/ManualCropModal';
import VideoPlayerModal from '../components/VideoPlayerModal';
import MapPickerModal from '../components/MapPickerModal';
import SurveillanceModal from '../components/SurveillanceModal';

interface SearchResultsPageProps {
  initialParams?: SearchParams;
}

const SearchResultsPage: React.FC<SearchResultsPageProps> = ({ initialParams }) => {
  const navigate = useNavigate();
  const [params, setParams] = useState<SearchParams>(initialParams || {
    timeRange: '7d',
    spatialRange: [],
    similarity: 70
  });
  const [isTrainingMode, setIsTrainingMode] = useState(false);
  const [labels, setLabels] = useState<Record<string, SampleLabel>>({});
  const [selectedResults, setSelectedResults] = useState<string[]>([]);
  const [croppingImage, setCroppingImage] = useState<string | null>(null);
  const [playingVideo, setPlayingVideo] = useState<string | null>(null);
  const [showSurveillanceModal, setShowSurveillanceModal] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showMapModal, setShowMapModal] = useState(false);
  const [spatialInfo, setSpatialInfo] = useState<{ radius: number; deviceCount: number } | null>(null);
  const [displayPlaceholder, setDisplayPlaceholder] = useState('');
  const [cursorVisible, setCursorVisible] = useState(true);

  const placeholderTexts = [
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
      const currentText = placeholderTexts[currentIndex];
      
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
        currentIndex = (currentIndex + 1) % placeholderTexts.length;
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

  const toggleTrainingMode = () => {
    setIsTrainingMode(!isTrainingMode);
    if (!isTrainingMode) {
      const initialLabels: Record<string, SampleLabel> = {};
      MOCK_RESULTS.forEach(r => initialLabels[r.id] = 'none');
      setLabels(initialLabels);
    }
  };

  const handleLabel = (id: string, status: 'positive' | 'negative') => {
    setLabels(prev => ({ ...prev, [id]: prev[id] === status ? 'none' : status }));
  };

  const handleExecute = () => {
    const searchType = selectedImage ? SearchType.IMAGE : SearchType.TEXT;
    setParams(prev => ({
      ...prev,
      spatialRange: spatialInfo ? ['SIMULATED_RANGE'] : []
    }));
  };

  const handleMapConfirm = (data: { radius: number; deviceCount: number }) => {
    setSpatialInfo(data);
    setShowMapModal(false);
  };

  const handleDeployTask = (data: any) => {
    console.log('Deploying Task:', data);
    setShowSurveillanceModal(false);
  };

  const handleGenerateTrajectory = (specificItem?: any) => {
    if (specificItem) {
      const simulatedTrajectory = MOCK_RESULTS
        .filter(r => r.type === specificItem.type)
        .slice(0, 5);
      if (!simulatedTrajectory.find(i => i.id === specificItem.id)) {
        simulatedTrajectory.push(specificItem);
      }
      navigate('/trajectory', { state: { items: simulatedTrajectory } });
    } else {
      const selectedData = MOCK_RESULTS.filter(r => selectedResults.includes(r.id));
      navigate('/trajectory', { state: { items: selectedData } });
    }
  };

  const selectedData = MOCK_RESULTS.filter(r => selectedResults.includes(r.id));
  const posCount = Object.values(labels).filter(v => v === 'positive').length;
  const negCount = Object.values(labels).filter(v => v === 'negative').length;

  return (
    <div className="flex-1 flex flex-col bg-[var(--bg-deep)]">
      {showMapModal && <MapPickerModal onClose={() => setShowMapModal(false)} onConfirm={handleMapConfirm} />}
      {showSurveillanceModal && (
        <SurveillanceModal 
          selectedItems={selectedData} 
          onClose={() => setShowSurveillanceModal(false)} 
          onDeploy={handleDeployTask} 
        />
      )}
      
      <div className="glass-panel border-b border-white/5 p-6 space-y-6 z-20">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="flex items-center justify-between mb-2">
            <button onClick={() => navigate('/')} className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-purple-400 transition-all flex items-center gap-2">
              ← 返回主页
            </button>
          </div>

          <div className="relative group">
            <div className="flex gap-4 p-3 bg-black/40 border border-white/10 rounded-[1.5rem] focus-within:border-purple-500/50 transition-all min-h-[80px] shadow-inner">
              <div className="flex-1 text-sm text-[var(--text-primary)] placeholder-slate-600 pt-1 relative">
                {inputValue ? (
                  inputValue
                ) : (
                  <>
                    <span className="text-slate-500">{displayPlaceholder}</span>
                    <span className={`absolute inline-block w-0.5 h-4 bg-purple-400 ml-0.5 align-middle ${cursorVisible ? 'opacity-100' : 'opacity-0'} transition-opacity`} />
                  </>
                )}
                <textarea 
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder=""
                  className="absolute inset-0 bg-transparent text-sm text-[var(--text-primary)] focus:outline-none resize-none w-full h-full opacity-0"
                />
              </div>
              
              <div className="w-24 border-l border-white/5 pl-4 flex flex-col items-center justify-center gap-2">
                {selectedImage ? (
                  <div className="relative w-full aspect-square rounded-lg overflow-hidden border border-purple-500/50 shadow-lg group/img">
                    <img src={selectedImage} className="w-full h-full object-cover transition-transform group-hover/img:scale-110" alt="Upload" />
                    <button 
                      onClick={() => setSelectedImage(null)}
                      className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 flex items-center justify-center text-white transition-all"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                  </div>
                ) : (
                  <label className="w-full aspect-square border border-dashed border-white/10 rounded-lg flex flex-col items-center justify-center gap-1 cursor-pointer hover:bg-purple-500/5 hover:border-purple-500/30 transition-all group/upload">
                    <div className="text-purple-400 group-hover/upload:scale-110 transition-transform scale-75">{ICONS.Image}</div>
                    <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">上传图片</span>
                    <input type="file" className="hidden" onChange={() => setSelectedImage('https://picsum.photos/seed/results-upload/400/400')} />
                  </label>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 pt-4">
             <div className="space-y-2">
               <label className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">{ICONS.Clock} 时间</label>
               <div className="flex gap-1">
                 {['1天', '3天', '7天', '自选'].map(t => (
                   <button key={t} className={`flex-1 py-1.5 rounded-lg text-[8px] font-black uppercase border transition-all ${params.timeRange === t.replace('天', 'd') || (t === '自选' && params.timeRange === 'custom') ? 'bg-purple-600 border-purple-600 text-white' : 'border-white/5 text-slate-500 hover:border-purple-500/30'}`}>{t}</button>
                 ))}
               </div>
             </div>

             <div className="space-y-2">
               <label className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">{ICONS.Map} 空间</label>
               <button onClick={() => setShowMapModal(true)} className={`w-full py-1.5 rounded-lg text-[9px] font-black uppercase border-2 border-dashed transition-all ${spatialInfo ? 'bg-purple-600/10 border-purple-500 text-purple-400' : 'border-white/5 text-slate-500 hover:border-purple-500/30'}`}>
                 {spatialInfo ? `R=${spatialInfo.radius}m 已选` : '地图选点'}
               </button>
             </div>

             <div className="space-y-2">
               <div className="flex justify-between items-center"><label className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">相似度</label><span className="text-[10px] font-black text-purple-400">80%</span></div>
               <div className="pt-1"><input type="range" className="w-full h-1 bg-white/5 rounded-full appearance-none cursor-pointer accent-purple-600" defaultValue={80} /></div>
             </div>

             <div className="space-y-2">
               <label className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">目标类型</label>
               <select className="w-full px-2 py-1.5 bg-black/20 border border-white/5 rounded-lg text-[9px] font-black text-slate-400 focus:outline-none appearance-none cursor-pointer uppercase">
                  <option>全量目标</option>
                  <option>人体检索</option>
                  <option>机动车检索</option>
                  <option>非机动车检索</option>
               </select>
             </div>

             <div className="space-y-2">
               <label className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">模型选择</label>
               <select className="w-full px-2 py-1.5 bg-black/20 border border-white/5 rounded-lg text-[9px] font-black text-slate-400 focus:outline-none appearance-none cursor-pointer uppercase">
                  <option>通用感知引擎 V4.2</option>
                  <option>白衣特征微模型</option>
                  <option>违规摊贩微模型</option>
                  <option>实时训练暂存区</option>
               </select>
             </div>

             <div className="flex items-end">
               <button onClick={handleExecute} className="w-full bg-gradient-to-br from-purple-600 to-indigo-700 hover:from-purple-500 hover:to-indigo-600 text-white py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2">
                 {ICONS.Search} 深度检索
               </button>
             </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col relative overflow-hidden">
        <div className="border-b border-white/5 bg-black/10">
          <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">检索结果集 / 共发现 <span className="text-purple-500">45</span> 个目标</span>
              <div className="h-4 w-px bg-white/5" />
              {selectedResults.length > 0 && (
                <span className="text-[9px] bg-purple-500/10 text-purple-500 px-3 py-0.5 rounded-full font-black uppercase animate-in fade-in zoom-in-95">
                  已选择 {selectedResults.length} 项样本
                </span>
              )}
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => handleGenerateTrajectory()}
                disabled={selectedResults.length === 0}
                className="px-4 py-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-400 text-[10px] font-black uppercase tracking-widest hover:bg-purple-600/20 hover:text-purple-400 disabled:opacity-50 transition-all flex items-center gap-2 group"
              >
                <span className="group-hover:scale-110 transition-transform">{ICONS.Trajectory}</span>
                轨迹生成
              </button>
              <button 
                onClick={toggleTrainingMode}
                className={`px-4 py-1.5 rounded-lg border text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 group ${isTrainingMode ? 'bg-purple-600 border-purple-600 text-white' : 'bg-white/5 border-white/10 text-slate-400 hover:bg-purple-500/10 hover:border-purple-500/20 hover:text-purple-400'}`}
              >
                <span className="group-hover:rotate-12 transition-transform">{ICONS.Train}</span>
                训练微模型
              </button>
              <button 
                onClick={() => setShowSurveillanceModal(true)}
                className="px-4 py-1.5 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[10px] font-black uppercase tracking-widest hover:bg-purple-500 hover:text-white transition-all flex items-center gap-2 group"
              >
                <span className="group-hover:scale-110 transition-transform">{ICONS.Monitoring}</span>
                快速布防
              </button>
              <button className="px-4 py-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-400 text-[10px] font-black uppercase tracking-widest hover:bg-white/10 hover:text-white transition-all flex items-center gap-2 group">
                <span className="group-hover:translate-y-0.5 transition-transform">{ICONS.Download}</span>
                导出数据
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8 scroll-smooth">
          <div className="max-w-7xl mx-auto space-y-6 pb-20">
            {isTrainingMode && (
              <div className="mb-8">
                <TrainingModeBar 
                  posCount={posCount} 
                  negCount={negCount} 
                  onCancel={toggleTrainingMode} 
                />
              </div>
            )}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
              {MOCK_RESULTS.map((res) => (
                <ResultCard 
                  key={res.id} 
                  data={res} 
                  isTrainingMode={isTrainingMode}
                  currentLabel={labels[res.id] || 'none'}
                  onLabel={(status) => handleLabel(res.id, status)}
                  isSelected={selectedResults.includes(res.id)}
                  onSelect={() => setSelectedResults(prev => prev.includes(res.id) ? prev.filter(id => id !== res.id) : [...prev, res.id])}
                  onCrop={() => setCroppingImage(res.url)}
                  onPlay={() => setPlayingVideo(res.id)}
                  onTrack={() => handleGenerateTrajectory(res)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {croppingImage && <ManualCropModal imageUrl={croppingImage} onClose={() => setCroppingImage(null)} />}
      {playingVideo && <VideoPlayerModal resultId={playingVideo} onClose={() => setPlayingVideo(null)} />}
    </div>
  );
};

export default SearchResultsPage;
