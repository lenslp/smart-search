
import React, { useState } from 'react';
import { ICONS } from '../constants';
import { SearchParams, TargetType } from '../types';
import MapPickerModal from './MapPickerModal';

interface FilterSidebarProps {
  params: SearchParams;
  onSearch: (params: Partial<SearchParams>) => void;
  onBack: () => void;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({ params, onSearch, onBack }) => {
  const [showMap, setShowMap] = useState(false);
  const [spatialInfo, setSpatialInfo] = useState<{ radius: number; deviceCount: number } | null>(null);

  const handleMapConfirm = (data: { radius: number; deviceCount: number }) => {
    setSpatialInfo(data);
    setShowMap(false);
  };

  return (
    <div className="w-80 glass-panel border-r border-white/5 p-8 flex flex-col gap-10 h-full">
      {showMap && <MapPickerModal onClose={() => setShowMap(false)} onConfirm={handleMapConfirm} />}

      <button onClick={onBack} className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-purple-400 transition-all group">
        <span className="group-hover:-translate-x-1 transition-transform">←</span> 返回搜索首页
      </button>
      
      <div className="space-y-8 overflow-y-auto pr-3 no-scrollbar flex-1">
        <div className="flex items-center justify-between border-b border-white/5 pb-4">
          <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">搜索过滤设置</h3>
          <div className="text-purple-500/50">{ICONS.Filter}</div>
        </div>

        {/* Time Pillar */}
        <div className="space-y-4">
          <label className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] flex items-center gap-2">
            {ICONS.Clock} 时间范围
          </label>
          <div className="grid grid-cols-2 gap-2">
            {['1天', '3天', '7天', '自定义'].map((t) => (
              <button 
                key={t}
                className={`py-2 rounded-xl text-[10px] font-bold border transition-all ${t === '7天' ? 'bg-purple-600 border-purple-600 text-white' : 'border-white/5 text-slate-500 hover:border-purple-500/30'}`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Spatial Pillar */}
        <div className="space-y-4">
          <label className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] flex items-center gap-2">
            {ICONS.Map} 搜索区域
          </label>
          <button 
            onClick={() => setShowMap(true)}
            className={`w-full flex flex-col items-center justify-center p-5 bg-black/30 border-2 border-dashed rounded-2xl transition-all ${spatialInfo ? 'border-purple-500 text-purple-400' : 'border-white/5 text-slate-500 hover:border-purple-500/40'}`}
          >
            <span className="text-[11px] font-black uppercase tracking-widest">
              {spatialInfo ? `已选: ${spatialInfo.radius}米范围` : '在地图上选点/区域'}
            </span>
            {spatialInfo && (
              <span className="text-[9px] text-slate-600 mt-1 uppercase">在线监控设备: {spatialInfo.deviceCount}</span>
            )}
          </button>
        </div>

        {/* Similarity Pillar */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <label className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">结果相似度</label>
            <span className="text-sm font-black text-purple-400">80%</span>
          </div>
          <input type="range" className="w-full h-1 bg-white/5 rounded-lg appearance-none cursor-pointer accent-purple-600" defaultValue={80} />
        </div>

        {/* Target Type Pillar */}
        <div className="space-y-4">
          <label className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">目标类型过滤</label>
          <div className="relative group/sel">
            <select className="w-full px-5 py-3 bg-black/40 border border-white/10 rounded-2xl text-[10px] font-black text-slate-400 focus:outline-none focus:border-purple-500/40 appearance-none uppercase cursor-pointer">
              <option>显示全部结果</option>
              <option>仅看人员</option>
              <option>仅看机动车</option>
              <option>仅看非机动车</option>
            </select>
            <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-600 group-hover/sel:text-purple-500 transition-colors">
              {ICONS.Down}
            </div>
          </div>
        </div>

        {/* Micro Model Pillar */}
        <div className="space-y-4">
          <label className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">已选小模型</label>
          <div className="relative group/sel">
            <select className="w-full px-5 py-3 bg-black/40 border border-white/10 rounded-2xl text-[10px] font-black text-slate-400 focus:outline-none focus:border-purple-500/40 appearance-none uppercase cursor-pointer">
              <option>默认通用模型</option>
              <option>白衣特征模型</option>
              <option>违规摊贩识别模型</option>
            </select>
          </div>
        </div>
      </div>

      <div className="mt-auto pt-8 border-t border-white/5 flex gap-4">
        <button className="flex-1 bg-purple-600 hover:bg-purple-500 py-4 rounded-2xl font-black text-[11px] text-white uppercase tracking-[0.2em] shadow-lg transition-all flex items-center justify-center gap-2 group">
          {ICONS.Search} <span className="group-hover:scale-105 transition-transform">重新搜索</span>
        </button>
      </div>
    </div>
  );
};

export default FilterSidebar;
