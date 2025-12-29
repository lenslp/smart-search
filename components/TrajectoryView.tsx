
import React, { useState, useEffect, useRef } from 'react';
import { ICONS } from '../constants';

interface TrajectoryViewProps {
  items: any[];
  onBack: () => void;
}

const TrajectoryView: React.FC<TrajectoryViewProps> = ({ items, onBack }) => {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [mapStatus, setMapStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  // Sort items by timestamp to ensure chronological order
  const sortedItems = [...items].sort((a, b) => 
    new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  useEffect(() => {
    let checkCount = 0;
    const maxChecks = 100;
    const checkInterval = 100;

    const initMap = () => {
      const AMap = (window as any).AMap;
      if (!AMap || !AMap.Map) {
        if (checkCount < maxChecks) {
          checkCount++;
          setTimeout(initMap, checkInterval);
        } else {
          console.error('AMap failed to load after', maxChecks, 'attempts');
          setMapStatus('error');
        }
        return;
      }

      if (!mapContainerRef.current) return;

      try {
        const path = sortedItems.map(item => item.coordinates);
        console.log('Initializing map with path:', path);
        
        const map = new AMap.Map(mapContainerRef.current, {
          viewMode: '3D',
          zoom: 14,
          center: path[0] || [121.4737, 31.2304],
          mapStyle: 'amap://styles/darkblue',
        });

        mapInstance.current = map;

        map.on('complete', () => {
          // Draw Polyline for trajectory
          const polyline = new AMap.Polyline({
            path: path,
            isOutline: true,
            outlineColor: '#8b5cf633',
            borderWeight: 2,
            strokeColor: '#8b5cf6',
            strokeOpacity: 0.8,
            strokeWeight: 4,
            strokeStyle: 'solid',
            lineJoin: 'round',
            lineCap: 'round',
            zIndex: 50,
            showDir: true
          });
          map.add(polyline);

          // Add Markers
          sortedItems.forEach((item, idx) => {
            const marker = new AMap.Marker({
              position: item.coordinates,
              content: `
                <div class="relative group cursor-pointer">
                  <div class="w-8 h-8 rounded-full bg-purple-600 border-2 border-white flex items-center justify-center text-white text-[10px] font-black shadow-[0_0_15px_rgba(139,92,246,0.5)] transition-transform group-hover:scale-110">
                    ${idx + 1}
                  </div>
                </div>
              `,
              offset: new AMap.Pixel(-16, -16)
            });
            
            marker.on('click', () => {
              setSelectedIdx(idx);
              map.setCenter(item.coordinates);
            });

            map.add(marker);
            markersRef.current.push(marker);
          });

          map.setFitView();
          setMapStatus('ready');
        });
      } catch (err) {
        console.error('Trajectory Map Error:', err);
        setMapStatus('error');
      }
    };

    const timer = setTimeout(initMap, 300);
    return () => {
      clearTimeout(timer);
      if (mapInstance.current) mapInstance.current.destroy();
    };
  }, [items]);

  const handleItemClick = (idx: number) => {
    setSelectedIdx(idx);
    if (mapInstance.current) {
      const pos = sortedItems[idx].coordinates;
      mapInstance.current.setZoomAndCenter(16, pos);
    }
  };

  return (
    <div className="flex-1 flex overflow-hidden bg-[#050508]">
      {/* Left List Panel */}
      <div className="w-[450px] border-r border-white/5 flex flex-col bg-[#080810] relative z-20 shadow-2xl">
        <div className="p-8 border-b border-white/5 bg-gradient-to-b from-purple-900/10 to-transparent">
          <button onClick={onBack} className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-purple-400 mb-6 flex items-center gap-2 transition-all">
            ← 返回检索列表
          </button>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-600/20 text-purple-400 rounded-2xl flex items-center justify-center border border-purple-500/30 shadow-lg">
              {ICONS.Trajectory}
            </div>
            <div>
              <h3 className="text-xl font-black text-white uppercase tracking-wider">时空轨迹感知</h3>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">共捕获到 {items.length} 个轨迹锚点</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar custom-scrollbar">
          {sortedItems.map((item, idx) => (
            <div 
              key={item.id}
              onClick={() => handleItemClick(idx)}
              className={`p-4 rounded-[1.5rem] border transition-all cursor-pointer group relative ${
                selectedIdx === idx 
                ? 'bg-purple-600/10 border-purple-500/50 shadow-[0_0_20px_rgba(139,92,246,0.1)]' 
                : 'bg-black/20 border-white/5 hover:border-white/10'
              }`}
            >
              <div className="flex gap-4">
                <div className="w-24 h-24 rounded-2xl overflow-hidden border border-white/5 relative shrink-0">
                  <img src={item.url} className="w-full h-full object-cover" />
                  <div className="absolute top-2 left-2 bg-black/70 text-[10px] font-black text-white px-2 py-0.5 rounded-lg border border-white/10 backdrop-blur-md">
                    #{idx + 1}
                  </div>
                </div>
                <div className="flex-1 space-y-2 min-w-0">
                  <div className="flex justify-between items-start">
                    <span className="text-[11px] font-black text-white truncate uppercase tracking-tighter">{item.location}</span>
                    <span className="text-[11px] font-black text-purple-400 tabular-nums">{item.similarity}%</span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                    {ICONS.Clock} {item.timestamp}
                  </div>
                  <div className="text-[9px] font-bold text-slate-600 uppercase truncate flex items-center gap-2">
                    <div className="w-1 h-1 rounded-full bg-purple-500" />
                    设备: {item.camera}
                  </div>
                </div>
              </div>
              {idx < sortedItems.length - 1 && (
                <div className="absolute -bottom-4 left-16 w-px h-4 bg-purple-500/20" />
              )}
            </div>
          ))}
        </div>

        <div className="p-6 border-t border-white/5 bg-black/40">
           <button className="w-full py-4 bg-purple-600 hover:bg-purple-500 text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.3em] shadow-[0_10px_30px_rgba(139,92,246,0.3)] transition-all active:scale-95">
              下载全量分析报告
           </button>
        </div>
      </div>

      {/* Right Map Area */}
      <div className="flex-1 relative bg-[#010206]">
        <div ref={mapContainerRef} className="absolute inset-0 w-full h-full" />
        
        {mapStatus === 'loading' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center z-20 bg-[#05050a]">
             <div className="w-20 h-20 border-2 border-purple-500/20 border-t-purple-500 rounded-full animate-spin mb-6" />
             <p className="text-[11px] font-black text-slate-500 uppercase tracking-[0.4em] animate-pulse">正在解析目标时空运动矢量...</p>
          </div>
        )}

        {/* HUD UI */}
        <div className="absolute top-10 left-10 pointer-events-none space-y-4 z-10">
           <div className="bg-black/80 backdrop-blur-md px-6 py-3 rounded-2xl border border-purple-500/30 text-[11px] font-black text-purple-400 uppercase tracking-[0.2em] shadow-2xl flex items-center gap-4">
              <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_#10b981]" />
              空间感知中: 全域追踪已激活
           </div>
        </div>

        <div className="absolute bottom-12 right-12 z-10">
           <div className="bg-black/80 backdrop-blur-md p-8 rounded-[2.5rem] border border-white/5 text-[11px] font-bold text-slate-400 space-y-6 uppercase tracking-widest shadow-2xl min-w-[280px]">
              <div className="flex justify-between items-center border-b border-white/5 pb-4">
                <span>轨迹跨度</span>
                <span className="text-white text-lg font-black tabular-nums">1.2 <span className="text-[10px] text-slate-500 ml-1">KM</span></span>
              </div>
              <div className="flex justify-between items-center border-b border-white/5 pb-4">
                <span>运动时间</span>
                <span className="text-white text-lg font-black tabular-nums">28 <span className="text-[10px] text-slate-500 ml-1">MIN</span></span>
              </div>
              <div className="flex justify-between items-center">
                <span>目标置信度</span>
                <span className="text-purple-400 text-lg font-black tabular-nums">94.5 <span className="text-[10px] text-slate-500 ml-1">%</span></span>
              </div>
           </div>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(139, 92, 246, 0.2); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(139, 92, 246, 0.4); }
      `}</style>
    </div>
  );
};

export default TrajectoryView;
