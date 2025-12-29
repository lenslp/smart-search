
import React, { useState } from 'react';
import { ICONS } from '../constants';
import { TargetType } from '../types';

interface ResultCardProps {
  data: any;
  isTrainingMode: boolean;
  currentLabel: 'positive' | 'negative' | 'none';
  onLabel: (status: 'positive' | 'negative') => void;
  isSelected: boolean;
  onSelect: () => void;
  onCrop: () => void;
  onPlay: () => void;
  onTrack: () => void;
}

const ResultCard: React.FC<ResultCardProps> = ({ 
  data, isTrainingMode, currentLabel, onLabel, isSelected, onSelect, onCrop, onPlay, onTrack
}) => {
  const [showMenu, setShowMenu] = useState(false);

  const typeMap: Record<string, { label: string; icon: any }> = {
    [TargetType.HUMAN]: { label: '人体', icon: ICONS.Human },
    [TargetType.MOTOR]: { label: '机动车', icon: ICONS.Car },
    [TargetType.NON_MOTOR]: { label: '非机动车', icon: ICONS.Bike },
  };

  const info = typeMap[data.type];

  return (
    <div 
      className={`group relative rounded-2xl overflow-hidden bg-[var(--card-bg)] border-2 transition-all duration-300 flex flex-col card-hover ${
        isSelected ? 'border-purple-500 shadow-[0_10px_20px_rgba(139,92,246,0.2)]' : 'border-[var(--border-color)]'
      } ${isTrainingMode ? 'cursor-default' : 'cursor-pointer'}`}
      onMouseEnter={() => !isTrainingMode && setShowMenu(true)}
      onMouseLeave={() => !isTrainingMode && setShowMenu(false)}
      onClick={() => !isTrainingMode && onSelect()}
    >
      {/* 顶部标签 */}
      <div className="absolute top-2 left-2 z-10 flex flex-col gap-1 pointer-events-none">
        <div className="bg-black/70 backdrop-blur-md px-2 py-0.5 rounded-lg flex items-center gap-1.5 text-[10px] font-bold text-white border border-white/5">
          <span className="text-purple-400">{info.icon}</span> {info.label}
        </div>
      </div>
      <div className="absolute top-2 right-2 z-10 pointer-events-none">
        <div className="bg-purple-600 px-2 py-0.5 rounded-lg text-[10px] font-bold text-white shadow-lg">
          {data.similarity}%
        </div>
      </div>

      {/* Image Container */}
      <div className="aspect-square w-full relative overflow-hidden bg-slate-200 dark:bg-black/20">
        <img src={data.url} alt="Result" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        
        {isTrainingMode && (
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[1px] flex items-center justify-center gap-4 transition-all animate-in fade-in duration-300">
            <button 
              onClick={(e) => { e.stopPropagation(); onLabel('positive'); }}
              className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all border-2 ${currentLabel === 'positive' ? 'bg-emerald-600 border-emerald-400 shadow-lg' : 'bg-black/40 border-white/10 hover:bg-emerald-600/50'}`}
            >
              <span className="text-white">{ICONS.Positive}</span>
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); onLabel('negative'); }}
              className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all border-2 ${currentLabel === 'negative' ? 'bg-rose-600 border-rose-400 shadow-lg' : 'bg-black/40 border-white/10 hover:bg-rose-600/50'}`}
            >
              <span className="text-white">{ICONS.Negative}</span>
            </button>
          </div>
        )}

        {showMenu && !isTrainingMode && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-3 animate-in fade-in duration-300">
             <div className="flex flex-col gap-2 mb-2">
                <button 
                  onClick={(e) => { e.stopPropagation(); onCrop(); }}
                  className="bg-white/10 hover:bg-purple-600/40 p-2.5 rounded-xl flex items-center justify-center gap-3 text-[10px] font-bold border border-white/10 transition-all text-white group/btn"
                >
                  <span className="text-purple-400 group-hover/btn:scale-110 transition-transform">{ICONS.Train}</span>
                  <span>框选特征搜图</span>
                </button>
             </div>
             <button 
                onClick={(e) => { e.stopPropagation(); onTrack(); }}
                className="w-full bg-purple-600 hover:bg-purple-500 py-2.5 rounded-xl text-[10px] font-bold text-white transition-all shadow-lg flex items-center justify-center gap-2 group/track"
              >
                <span className="group-hover/track:animate-pulse">{ICONS.Trajectory}</span>
                轨迹生成
             </button>
          </div>
        )}
      </div>

      {/* Metadata */}
      <div className="p-3 space-y-2 bg-[var(--card-bg)]">
        <div className="flex items-center gap-2 text-[var(--text-secondary)] text-[10px] font-medium">
          {ICONS.Clock} <span>{data.timestamp}</span>
        </div>
        <div className="flex items-center gap-2 text-[var(--text-primary)] text-[11px] font-bold truncate">
          <span className="text-purple-500/40">{ICONS.Map}</span> <span>{data.location}</span>
        </div>
        <div className="flex items-center justify-between border-t border-[var(--border-color)] pt-2 mt-1">
           <div className="text-[var(--text-secondary)] text-[9px] font-bold uppercase tracking-wider">
            {data.camera}
          </div>
          <div className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-purple-400 shadow-[0_0_6px_rgba(139,92,246,0.6)]' : 'bg-[var(--border-color)]'}`} />
        </div>
      </div>
    </div>
  );
};

export default ResultCard;
