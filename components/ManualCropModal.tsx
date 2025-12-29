
import React, { useState } from 'react';
import { ICONS } from '../constants';
import { CropType } from '../types';

interface ManualCropModalProps {
  imageUrl: string;
  onClose: () => void;
}

const ManualCropModal: React.FC<ManualCropModalProps> = ({ imageUrl, onClose }) => {
  const [activeCrop, setActiveCrop] = useState<CropType | null>(null);

  const cropButtons = [
    { type: CropType.FACE, label: '人脸', icon: '👤' },
    { type: CropType.BODY, label: '人体', icon: '🚶' },
    { type: CropType.CAR, label: '车辆', icon: '🚗' },
    { type: CropType.NON_MOTOR, label: '非机动车', icon: '🛵' }
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0a0a14]/95 backdrop-blur-md p-10 animate-in fade-in duration-500">
      <div className="bg-[#0d0d1a] border border-purple-500/20 rounded-[2.5rem] w-full max-w-5xl h-[85vh] overflow-hidden flex shadow-2xl shadow-purple-900/20">
        
        {/* Left Section: Image Canvas Only */}
        <div className="flex-1 flex flex-col bg-[#0a0a14] relative">
          <div className="flex-1 relative flex items-center justify-center p-8 overflow-hidden group">
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none" />
            <img src={imageUrl} alt="Crop Source" className="max-w-full max-h-full object-contain select-none opacity-80" />
            
            {/* Active Box Simulation */}
            {activeCrop && (
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-72 border-2 border-purple-500 shadow-[0_0_40px_rgba(168,85,247,0.5)] flex items-center justify-center pointer-events-none animate-in zoom-in-95">
                <div className="absolute -top-7 left-0 bg-purple-600 text-[10px] font-black px-3 py-1 rounded uppercase tracking-[0.2em] shadow-lg border border-purple-400/50">
                  已选 {activeCrop === CropType.FACE ? '人脸' : activeCrop === CropType.BODY ? '人体' : activeCrop === CropType.CAR ? '车辆' : '非机动车'}
                </div>
                <div className="w-6 h-6 border-t-4 border-l-4 border-purple-400 absolute -top-1 -left-1" />
                <div className="w-6 h-6 border-t-4 border-r-4 border-purple-400 absolute -top-1 -right-1" />
                <div className="w-6 h-6 border-b-4 border-l-4 border-purple-400 absolute -bottom-1 -left-1" />
                <div className="w-6 h-6 border-b-4 border-r-4 border-purple-400 absolute -bottom-1 -right-1" />
                <div className="w-full h-[2px] bg-purple-400/40 absolute top-0 animate-[scanLaser_2s_linear_infinite]" />
              </div>
            )}

            <div className="absolute bottom-6 left-6 text-[9px] font-black uppercase tracking-widest text-purple-400/60 bg-[#0d0d1a]/80 px-4 py-2 rounded-full border border-purple-500/10 backdrop-blur-xl">
              <span className="animate-pulse mr-2">●</span> 提示：请在图中手动框选感兴趣的目标
            </div>
          </div>
        </div>

        {/* Right Section: Controls */}
        <div className="w-80 border-l border-white/5 flex flex-col p-10 bg-[#0d0d1a]/50">
          <div className="flex justify-between items-center mb-10 shrink-0">
            <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400">手动框选搜索</h3>
            <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-xl text-slate-400 hover:text-purple-400 transition-all">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto pr-2 no-scrollbar space-y-10">
             <div className="space-y-6">
                <label className="text-[10px] font-black text-purple-400/70 uppercase tracking-widest">选择目标类型</label>
                <div className="grid grid-cols-2 gap-3">
                  {cropButtons.map(btn => (
                    <button 
                      key={btn.type}
                      onClick={() => setActiveCrop(btn.type)}
                      className={`group/btn flex flex-col items-center gap-2 py-4 rounded-2xl border transition-all ${
                        activeCrop === btn.type 
                          ? 'bg-purple-600/20 border-purple-500 text-purple-400 shadow-inner' 
                          : 'bg-white/5 border-white/5 text-slate-400 hover:border-purple-500/30'
                      }`}
                    >
                      <span className={`text-xl transition-all ${activeCrop === btn.type ? 'scale-110' : 'opacity-40 grayscale group-hover/btn:opacity-100'}`}>{btn.icon}</span>
                      <span className="text-[9px] font-black uppercase tracking-widest">{btn.label}</span>
                    </button>
                  ))}
                </div>
             </div>
          </div>

          <div className="mt-auto space-y-4 shrink-0 pt-10">
             <button className="w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-500 hover:to-indigo-600 rounded-2xl font-black text-[11px] text-white uppercase tracking-[0.2em] shadow-lg transition-all flex items-center justify-center gap-3">
               {ICONS.Search} 立即开始搜索
             </button>
             <button onClick={() => setActiveCrop(null)} className="w-full py-4 bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 transition-all">
               重置选择
             </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes scanLaser {
          0% { top: 0; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
};

export default ManualCropModal;
