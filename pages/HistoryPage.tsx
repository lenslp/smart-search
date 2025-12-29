import React from 'react';
import { ICONS } from '../constants';

const HistoryPage: React.FC = () => {
  const stats = [
    { 
      label: '历史推理图片总量', 
      value: '1,429,582', 
      unit: '张',
      sub: '全网节点实时统计', 
      icon: ICONS.Image, 
      color: 'text-purple-400',
      gradient: 'from-purple-500/10 to-indigo-500/5'
    },
    { 
      label: '视频分析累计时长', 
      value: '45,820', 
      unit: '小时',
      sub: '结构化引擎总运行时间', 
      icon: ICONS.Video, 
      color: 'text-indigo-400',
      gradient: 'from-indigo-500/10 to-blue-500/5'
    },
  ];

  return (
    <div className="flex-1 p-10 overflow-y-auto">
      <div className="max-w-5xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-4xl font-black tracking-tight text-[var(--text-primary)]">
            推理<span className="purple-gradient-text">看板</span>
          </h2>
          <p className="text-[var(--text-secondary)] text-lg font-medium tracking-wide">
            感知引擎效能与历史处理规模核心指标
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
           {stats.map(s => (
             <div key={s.label} className={`glass-panel p-10 rounded-[3rem] border border-white/5 relative overflow-hidden group bg-gradient-to-br ${s.gradient}`}>
                <div className="absolute -top-6 -right-6 p-8 opacity-[0.03] group-hover:opacity-[0.07] group-hover:scale-150 transition-all duration-700 pointer-events-none">
                  <div className={`${s.color} scale-[4]`}>{s.icon}</div>
                </div>

                <div className="relative z-10 flex flex-col items-center text-center">
                  <div className={`p-4 rounded-2xl bg-white/5 border border-white/10 ${s.color} mb-8 shadow-inner`}>
                    {s.icon}
                  </div>
                  
                  <h4 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.4em] mb-4">
                    {s.label}
                  </h4>
                  
                  <div className="flex items-baseline gap-2 mb-4">
                    <div className="text-6xl font-black text-[var(--text-primary)] tabular-nums tracking-tighter">
                      {s.value}
                    </div>
                    <div className="text-lg font-black text-slate-500 uppercase">
                      {s.unit}
                    </div>
                  </div>
                  
                  <div className="px-4 py-1.5 rounded-full bg-black/20 border border-white/5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    {s.sub}
                  </div>
                </div>
                
                <div className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${s.color.replace('text', 'from')} to-transparent w-full opacity-30`} />
             </div>
           ))}
        </div>

        <div className="pt-12 flex justify-center border-t border-white/5">
          <div className="flex items-center gap-8 text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              数据实时更新中
            </div>
            <div className="w-px h-3 bg-white/5" />
            <div>最后统计时间: 2025-05-20 16:45:12</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoryPage;
