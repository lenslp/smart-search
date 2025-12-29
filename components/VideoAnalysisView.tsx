
import React, { useState, useEffect } from 'react';
import { ICONS } from '../constants';
import { TargetType } from '../types';

interface VideoAnalysisViewProps {
  params: any;
  onBack: () => void;
}

const VideoAnalysisView: React.FC<VideoAnalysisViewProps> = ({ params, onBack }) => {
  const [progress, setProgress] = useState(0);
  const [extractedItems, setExtractedItems] = useState<any[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) return 100;
        const next = p + Math.random() * 2;
        if (Math.random() > 0.7) {
          setExtractedItems(prev => [
            { 
              id: Date.now(), 
              url: `https://picsum.photos/seed/${Date.now()}/200/200`,
              type: [TargetType.HUMAN, TargetType.MOTOR, TargetType.NON_MOTOR][Math.floor(Math.random()*3)]
            },
            ...prev
          ].slice(0, 20));
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex-1 flex overflow-hidden">
      {/* Left Sidebar: Analysis Info */}
      <div className="w-80 glass-panel border-r border-[var(--border-color)] p-6 flex flex-col gap-8">
        <button onClick={onBack} className="text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-purple-400 flex items-center gap-2">
          ← 中止并返回
        </button>

        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-purple-600/10 border border-purple-500/20">
            <h3 className="text-[10px] font-black uppercase text-purple-400 tracking-widest mb-1">正在执行</h3>
            <p className="text-sm font-bold text-[var(--text-primary)]">全域感知视频结构化</p>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase">
              <span>分析进度</span>
              <span className="text-purple-500">{Math.floor(progress)}%</span>
            </div>
            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-purple-600 transition-all duration-500" style={{ width: `${progress}%` }} />
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-[var(--border-color)]">
             <div className="flex justify-between items-center">
                <span className="text-[10px] text-slate-500 font-bold uppercase">耗时</span>
                <span className="text-xs font-bold text-slate-300">00:04:22</span>
             </div>
             <div className="flex justify-between items-center">
                <span className="text-[10px] text-slate-500 font-bold uppercase">选用模型</span>
                <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-400">VISION-PRO-V4</span>
             </div>
             <div className="flex justify-between items-center">
                <span className="text-[10px] text-slate-500 font-bold uppercase">检测到目标</span>
                <span className="text-xs font-bold text-purple-400">{extractedItems.length * 12}</span>
             </div>
          </div>

          <div className="space-y-2 pt-4">
             <label className="text-[10px] text-slate-500 font-bold uppercase">空间点位范围</label>
             <div className="bg-black/20 p-3 rounded-xl border border-white/5 text-[10px] text-slate-400 leading-relaxed italic">
                包含：智控 045, 智控 046, A3 广场南侧, 地铁 2 号线入口... 等 12 个点位
             </div>
          </div>
        </div>

        <div className="mt-auto space-y-3">
           <button className="w-full py-3 bg-purple-600 rounded-xl font-bold text-xs text-white uppercase shadow-lg">进入深度分析</button>
           <button className="w-full py-3 bg-white/5 rounded-xl font-bold text-xs text-slate-500 uppercase border border-white/5">保存分析任务</button>
        </div>
      </div>

      {/* Main Content: Player + Dynamic Stream */}
      <div className="flex-1 flex flex-col bg-black relative">
         <div className="flex-1 relative flex items-center justify-center">
            <img src="https://picsum.photos/seed/video/1280/720" className="w-full h-full object-cover opacity-60" alt="Video" />
            
            {/* HUD Overlays */}
            <div className="absolute inset-0 pointer-events-none p-10 flex flex-col justify-between">
               <div className="flex justify-between items-start">
                  <div className="bg-black/60 backdrop-blur-md p-4 rounded-lg border border-purple-500/30">
                     <div className="text-xs font-bold text-white mb-2 flex items-center gap-2">
                        <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" /> REC | NODE-045
                     </div>
                     <div className="text-[9px] text-slate-400 font-mono">LAT: 31.2304 / LNG: 121.4737</div>
                  </div>
                  <div className="text-[9px] text-slate-500 font-mono text-right space-y-1">
                     <div>BITRATE: 8.4 MBPS</div>
                     <div>RES: 1080P / 60FPS</div>
                     <div className="text-purple-400">ENCODING: HEVC</div>
                  </div>
               </div>

               {/* Central Box Overlay */}
               <div className="flex items-center justify-center">
                  <div className="w-96 h-64 border border-purple-500/20 rounded flex items-center justify-center">
                     <div className="w-full h-[1px] bg-purple-500/40 animate-[scan_3s_infinite]" />
                  </div>
               </div>
            </div>

            <div className="absolute inset-0 flex items-center justify-center">
               <div className="w-20 h-20 bg-purple-600/20 backdrop-blur-xl border border-purple-500/30 rounded-full flex items-center justify-center text-white cursor-pointer hover:scale-110 transition-all">
                  {ICONS.Play}
               </div>
            </div>
         </div>

         {/* Bottom: Dynamic Extracted Stream */}
         <div className="h-56 bg-[var(--bg-deep)] border-t border-[var(--border-color)] p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between">
               <h4 className="text-[10px] font-black uppercase text-slate-500 tracking-widest flex items-center gap-2">
                  实时结构化提取流 <span className="text-emerald-500 animate-pulse">● LIVE</span>
               </h4>
               <div className="flex gap-4 text-[9px] font-bold text-slate-500 uppercase">
                  <span className="flex items-center gap-1">{ICONS.Human} 人体: 12</span>
                  <span className="flex items-center gap-1">{ICONS.Car} 车辆: 54</span>
                  <span className="flex items-center gap-1">{ICONS.Bike} 骑行: 8</span>
               </div>
            </div>
            
            <div className="flex-1 overflow-x-auto flex gap-4 no-scrollbar pb-2">
               {extractedItems.map(item => (
                 <div key={item.id} className="min-w-[100px] aspect-square rounded-xl overflow-hidden relative group border border-white/5 bg-black/40 animate-in slide-in-from-right-4 duration-300">
                    <img src={item.url} className="w-full h-full object-cover group-hover:scale-110 transition-all" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-2">
                       <div className="text-purple-400 text-[9px] font-bold">
                          {item.type === TargetType.HUMAN ? '人体' : item.type === TargetType.MOTOR ? '车辆' : '非机动车'}
                       </div>
                    </div>
                 </div>
               ))}
               {extractedItems.length === 0 && (
                 <div className="flex-1 flex items-center justify-center text-slate-600 text-xs italic">
                    等待模型提取特征点...
                 </div>
               )}
            </div>
         </div>
      </div>
      
      <style>{`
        @keyframes scan {
          0% { transform: translateY(-100px); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateY(100px); opacity: 0; }
        }
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
};

export default VideoAnalysisView;
