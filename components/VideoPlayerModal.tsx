
import React, { useState, useEffect } from 'react';
import { ICONS } from '../constants';

interface VideoPlayerModalProps {
  resultId: string;
  onClose: () => void;
}

const VideoPlayerModal: React.FC<VideoPlayerModalProps> = ({ resultId, onClose }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-[#0a0a14]/95 backdrop-blur-xl p-10 animate-in zoom-in-95 duration-500">
      <div className="bg-[#0d0d1a] border border-purple-500/20 rounded-[2.5rem] w-full max-w-6xl overflow-hidden shadow-2xl shadow-purple-900/20">
        {/* Header */}
        <div className="p-6 flex items-center justify-between border-b border-purple-500/10 bg-[#0d0d1a]">
           <div className="flex items-center gap-5">
             <div className="w-12 h-12 bg-purple-600/20 text-purple-400 rounded-2xl flex items-center justify-center border border-purple-500/30">
               {ICONS.Video}
             </div>
             <div>
               <h3 className="font-black text-xs uppercase tracking-[0.3em] text-white">查看对应时间点视频</h3>
               <p className="text-[10px] text-purple-400/60 font-bold uppercase tracking-widest mt-1">位置：核心商务区 A3路口 | 时间：2025.05.20 14:22:08</p>
             </div>
           </div>
           <button onClick={onClose} className="p-3 hover:bg-white/5 rounded-2xl text-slate-400 hover:text-purple-400 transition-all border border-transparent hover:border-purple-500/20">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
           </button>
        </div>

        {/* Video Area */}
        <div className="aspect-video bg-[#0a0a14] relative flex items-center justify-center overflow-hidden group">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 pointer-events-none z-10" />
          
          {loading ? (
            <div className="flex flex-col items-center gap-6 z-20">
              <div className="relative">
                <div className="w-20 h-20 border-2 border-purple-500/20 rounded-full animate-ping" />
                <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-t-purple-500 rounded-full animate-spin" />
              </div>
              <div className="flex flex-col items-center gap-2">
                 <p className="text-[10px] text-purple-400 font-black tracking-[0.4em] uppercase">正在调取视频录像...</p>
                 <div className="w-48 h-1 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-600 animate-[loadingProgress_1.2s_ease-in-out_infinite]" />
                 </div>
              </div>
            </div>
          ) : (
            <>
              <img 
                src={`https://picsum.photos/seed/${resultId}/1280/720`} 
                className="w-full h-full object-cover opacity-70 group-hover:opacity-80 transition-opacity" 
                alt="Video Stream" 
              />
              <div className="absolute inset-0 flex items-center justify-center z-20">
                <div className="w-24 h-24 bg-purple-600/10 hover:bg-purple-600/30 backdrop-blur-xl border-2 border-purple-500/30 rounded-full flex items-center justify-center cursor-pointer transition-all group/play shadow-lg">
                   <div className="w-0 h-0 border-t-[12px] border-t-transparent border-l-[22px] border-l-white border-b-[12px] border-b-transparent ml-2 group-hover/play:scale-110 transition-transform" />
                </div>
              </div>
              
              {/* OSD */}
              <div className="absolute top-10 left-10 text-white font-mono text-xs tracking-widest bg-black/60 px-5 py-2.5 rounded-lg border border-purple-500/30 backdrop-blur-md z-20">
                <span className="text-purple-400 mr-3 animate-pulse">●</span> 录像回放 2025-05-20 14:22:08
              </div>

              {/* Controls Bar */}
              <div className="absolute bottom-0 left-0 w-full p-8 bg-gradient-to-t from-black via-black/80 to-transparent flex items-center gap-10 z-20 border-t border-white/5">
                <button className="text-purple-400 hover:text-white transition-all transform hover:scale-110">{ICONS.Video}</button>
                <div className="flex-1 h-2 bg-white/5 rounded-full relative overflow-hidden group/seek cursor-pointer shadow-inner">
                  <div className="absolute top-0 left-0 w-1/3 h-full bg-gradient-to-r from-purple-700 to-purple-400" />
                </div>
                <div className="text-[10px] font-black font-mono text-purple-400 tracking-widest">03:15 / 10:00</div>
              </div>
            </>
          )}
        </div>
      </div>
      <style>{`
        @keyframes loadingProgress {
          0% { width: 0; left: 0; }
          50% { width: 100%; left: 0; }
          100% { width: 0; left: 100%; }
        }
      `}</style>
    </div>
  );
};

export default VideoPlayerModal;
