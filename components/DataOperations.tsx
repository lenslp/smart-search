
import React from 'react';
import { ICONS } from '../constants';

interface DataOperationsProps {
  onTrain: () => void;
  selectedCount: number;
}

const DataOperations: React.FC<DataOperationsProps> = ({ onTrain, selectedCount }) => {
  return (
    <div className="w-full glass-panel border border-white/5 rounded-3xl p-6 shadow-2xl flex items-center justify-between animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex-1 space-y-1 pr-8 border-r border-white/5">
        <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-500">搜索后数据分析</h4>
        <p className="text-[11px] text-slate-300 font-bold uppercase tracking-tight">Post-Search Intelligence Hub</p>
      </div>

      <div className="flex-2 flex gap-12 px-12">
        <button className="flex flex-col items-center gap-2 group">
          <div className="p-3.5 bg-white/5 rounded-2xl group-hover:bg-purple-600/10 group-hover:text-purple-400 transition-all border border-transparent group-hover:border-purple-500/20">{ICONS.Download}</div>
          <span className="text-[9px] font-bold text-slate-500 group-hover:text-slate-300 uppercase tracking-widest">导出数据</span>
        </button>
        <button className="flex flex-col items-center gap-2 group">
          <div className="p-3.5 bg-white/5 rounded-2xl group-hover:bg-purple-600/10 group-hover:text-purple-400 transition-all border border-transparent group-hover:border-purple-500/20">{ICONS.Trajectory}</div>
          <span className="text-[9px] font-bold text-slate-500 group-hover:text-slate-300 uppercase tracking-widest">生成轨迹</span>
        </button>
        <button className="flex flex-col items-center gap-2 group">
          <div className="p-3.5 bg-white/5 rounded-2xl group-hover:bg-purple-600/10 group-hover:text-purple-400 transition-all border border-transparent group-hover:border-purple-500/20">{ICONS.Monitoring}</div>
          <span className="text-[9px] font-bold text-slate-500 group-hover:text-slate-300 uppercase tracking-widest">文字布控</span>
        </button>
        
        <div className="w-px h-10 bg-white/5 self-center" />
        
        <button 
          onClick={onTrain}
          className="flex flex-col items-center gap-2 group"
        >
          <div className="p-3.5 bg-purple-600/20 text-purple-400 rounded-2xl group-hover:bg-purple-600 group-hover:text-white transition-all shadow-lg border border-purple-500/30">
            {ICONS.Train}
          </div>
          <span className="text-[9px] font-bold text-purple-400 uppercase tracking-widest">训练微模型</span>
        </button>
      </div>

      <div className="flex-1 flex justify-end">
        <div className="text-right">
           <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">选定样本数</div>
           <div className="text-3xl font-black text-white tabular-nums">{selectedCount}</div>
        </div>
      </div>
    </div>
  );
};

export default DataOperations;
