
import React from 'react';
import { ICONS } from '../constants';

interface TrainingModeBarProps {
  posCount: number;
  negCount: number;
  onCancel: () => void;
}

const TrainingModeBar: React.FC<TrainingModeBarProps> = ({ posCount, negCount, onCancel }) => {
  const isReady = posCount >= 10 && negCount >= 10;

  return (
    <div className="w-full bg-purple-950/80 backdrop-blur-3xl border border-purple-400/50 rounded-[2.5rem] p-8 shadow-[0_0_80px_rgba(168,85,247,0.3)] flex items-center justify-between animate-in slide-in-from-bottom-12 duration-700">
      <div className="flex items-center gap-6">
        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-700 rounded-2xl flex items-center justify-center text-white animate-pulse shadow-[0_0_30px_rgba(168,85,247,0.5)]">
          {ICONS.Train}
        </div>
        <div className="space-y-1">
          <h4 className="text-xl font-black text-white uppercase tracking-widest">模型标记训练 <span className="text-purple-400">正在进行</span></h4>
          <p className="text-[10px] font-bold text-purple-200/50 uppercase tracking-[0.2em]">请通过点击图片上的按钮来标记“是不是您要找的目标”</p>
        </div>
      </div>

      <div className="flex items-center gap-16">
        <div className="flex items-center gap-12 bg-black/40 px-8 py-4 rounded-3xl border border-white/5 shadow-inner">
           <div className="text-center">
             <div className="text-[9px] font-black text-emerald-400 uppercase tracking-widest mb-2">是目标 (+)</div>
             <div className="flex items-baseline gap-1 justify-center">
               <div className="text-3xl font-black text-white">{posCount}</div>
               <div className="text-[10px] font-black text-white/30">/ 10</div>
             </div>
           </div>
           <div className="w-px h-8 bg-white/10" />
           <div className="text-center">
             <div className="text-[9px] font-black text-rose-400 uppercase tracking-widest mb-2">不是目标 (-)</div>
             <div className="flex items-baseline gap-1 justify-center">
               <div className="text-3xl font-black text-white">{negCount}</div>
               <div className="text-[10px] font-black text-white/30">/ 10</div>
             </div>
           </div>
        </div>

        <div className="flex gap-4">
          <button 
            onClick={onCancel}
            className="px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
          >
            退出训练模式
          </button>
          <button 
            disabled={!isReady}
            className={`px-10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
              isReady 
                ? 'bg-gradient-to-r from-purple-600 to-indigo-700 hover:scale-105 shadow-[0_0_30px_rgba(168,85,247,0.4)] text-white' 
                : 'bg-gray-800 text-gray-500 cursor-not-allowed border border-white/5'
            }`}
          >
            {isReady ? '保存并应用搜索模型' : '样本数量还不够'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TrainingModeBar;
