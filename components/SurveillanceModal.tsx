
import React, { useState } from 'react';
import { ICONS } from '../constants';

interface SurveillanceModalProps {
  selectedItems: any[];
  onClose: () => void;
  onDeploy: (taskData: any) => void;
}

const SurveillanceModal: React.FC<SurveillanceModalProps> = ({ selectedItems: initialItems, onClose, onDeploy }) => {
  const [localItems, setLocalItems] = useState<any[]>(initialItems);
  const [conditions, setConditions] = useState<{ id: string; type: 'text' | 'image'; value: string }[]>([
    { id: '1', type: 'image', value: '基于视觉特征相似度 > 85%' }
  ]);

  const addCondition = (type: 'text' | 'image') => {
    const newVal = type === 'text' ? '输入语义布控关键词...' : '基于视觉特征相似度 > 85%';
    setConditions([...conditions, { id: Date.now().toString(), type, value: newVal }]);
  };

  const removeCondition = (id: string) => {
    setConditions(conditions.filter(c => c.id !== id));
  };

  const handleAddImage = () => {
    const newItem = {
      id: `new-${Date.now()}`,
      url: `https://picsum.photos/seed/${Date.now()}/400/400`,
    };
    setLocalItems([...localItems, newItem]);
  };

  const removeImage = (id: string) => {
    setLocalItems(localItems.filter(item => id !== item.id));
  };

  return (
    <div className="fixed inset-0 z-[160] flex items-center justify-center bg-[#0a0a14]/95 backdrop-blur-xl p-6 animate-in fade-in zoom-in-95 duration-300">
      <div className="bg-[#0d0d1a] border border-purple-500/30 rounded-[3rem] w-full max-w-6xl h-[80vh] overflow-hidden flex shadow-2xl shadow-purple-900/20">
        
        {/* Left: Sample Pool */}
        <div className="w-80 border-r border-white/5 bg-[#0d0d1a]/50 p-8 flex flex-col">
          <div className="flex-1 overflow-y-auto no-scrollbar">
            <h3 className="text-[10px] font-black text-purple-400/70 uppercase tracking-[0.3em] mb-6 flex items-center justify-between">
              待布控样本
              <span className="text-purple-400">{localItems.length}</span>
            </h3>
            <div className="grid grid-cols-2 gap-3 pb-8">
              {localItems.map((item) => (
                <div key={item.id} className="group relative aspect-square rounded-2xl overflow-hidden border border-white/5 shadow-lg">
                  <img src={item.url} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                  <button 
                    onClick={() => removeImage(item.id)}
                    className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-all"
                  >
                    <span className="scale-75">{ICONS.Trash}</span>
                  </button>
                </div>
              ))}
              <button 
                onClick={handleAddImage}
                className="aspect-square rounded-2xl border-2 border-dashed border-purple-500/20 flex flex-col items-center justify-center gap-1.5 text-purple-400/70 hover:bg-purple-500/5 hover:border-purple-500/50 transition-all group"
              >
                <div className="group-hover:scale-110 transition-transform">{ICONS.Plus}</div>
                <span className="text-[8px] font-black uppercase tracking-widest text-purple-400/70">添加图片</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right: Configuration Form */}
        <div className="flex-1 flex flex-col p-10 overflow-hidden">
          <div className="flex justify-between items-start mb-8 shrink-0">
            <div>
              <h2 className="text-3xl font-black text-white uppercase tracking-tight">快速布防<span className="purple-gradient-text ml-3">任务配置</span></h2>
              <p className="text-sm text-slate-500 font-medium mt-1">部署实时感知识别任务，系统检测到匹配特征后将自动触发报警</p>
            </div>
            <button onClick={onClose} className="p-3 hover:bg-white/5 rounded-2xl text-slate-400 hover:text-purple-400 transition-all border border-transparent hover:border-purple-500/20">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto pr-4 custom-scrollbar space-y-10 pb-10">
            {/* 01 Trigger Conditions */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-black text-white uppercase tracking-[0.3em] flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-purple-600/20 text-purple-400 flex items-center justify-center text-[12px]">01</span>
                  触发条件
                </label>
                <div className="flex gap-2">
                  <button onClick={() => addCondition('text')} className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[9px] font-black text-slate-400 hover:text-purple-400 hover:border-purple-500/30 transition-all uppercase tracking-widest flex items-center gap-2">
                    {ICONS.Plus} 语义词
                  </button>
                  <button onClick={() => addCondition('image')} className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[9px] font-black text-slate-400 hover:text-purple-400 hover:border-purple-500/30 transition-all uppercase tracking-widest flex items-center gap-2">
                    {ICONS.Plus} 视觉特征
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-2">
                {conditions.map((cond) => (
                  <div key={cond.id} className="group flex items-center gap-4 p-3.5 bg-black/40 border border-white/5 rounded-2xl hover:border-purple-500/30 transition-all animate-in slide-in-from-left-4">
                    <div className={`p-2 rounded-xl ${cond.type === 'text' ? 'bg-indigo-500/20 text-indigo-400' : 'bg-purple-500/20 text-purple-400'}`}>
                      {cond.type === 'text' ? ICONS.Search : ICONS.Image}
                    </div>
                    <input className="flex-1 bg-transparent text-sm font-bold text-slate-300 focus:outline-none" defaultValue={cond.value} />
                    <button onClick={() => removeCondition(cond.id)} className="opacity-0 group-hover:opacity-100 p-2 text-slate-600 hover:text-rose-500 transition-all">
                      {ICONS.Trash}
                    </button>
                  </div>
                ))}
              </div>
            </section>

            {/* 02 Time & 03 Space (Stacked Vertically) */}
            <section className="space-y-4">
              <label className="text-xs font-black text-white uppercase tracking-[0.3em] flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-purple-600/20 text-purple-400 flex items-center justify-center text-[12px]">02</span>
                布控时间
              </label>
              <div className="grid grid-cols-4 gap-2 p-3 bg-black/40 border border-white/5 rounded-2xl">
                  {['持续布控', '日间', '夜间', '自选'].map(t => (
                    <button key={t} className={`py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all ${t === '持续布控' ? 'bg-purple-600 border-purple-600 text-white shadow-lg' : 'border-white/5 text-slate-400 hover:border-purple-500/30'}`}>{t}</button>
                  ))}
              </div>
            </section>

            <section className="space-y-4">
              <label className="text-xs font-black text-white uppercase tracking-[0.3em] flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-purple-600/20 text-purple-400 flex items-center justify-center text-[12px]">03</span>
                布控区域
              </label>
              <button className="w-full p-4 h-auto min-h-[74px] bg-black/40 border border-white/5 rounded-2xl flex items-center justify-between group hover:border-purple-500/40 transition-all">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-500/10 text-purple-400 rounded-xl group-hover:bg-purple-600 group-hover:text-white transition-all">{ICONS.Map}</div>
                  <div className="text-left">
                    <div className="text-[10px] font-black text-slate-300 uppercase tracking-widest">全域智能感知覆盖</div>
                    <div className="text-[8px] font-bold text-slate-500 uppercase">已激活 12 个关联点位及边缘计算单元</div>
                  </div>
                </div>
                <div className="text-slate-500 group-hover:text-purple-400 transition-all scale-75">{ICONS.Down}</div>
              </button>
            </section>
          </div>

          {/* Actions */}
          <div className="pt-8 flex gap-4 shrink-0 border-t border-white/5 mt-auto">
            <button onClick={onClose} className="flex-1 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] transition-all">
              取消返回
            </button>
            <button 
              onClick={() => onDeploy({ conditions, items: localItems })}
              className="flex-[2] py-4 bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-500 hover:to-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] shadow-lg transition-all flex items-center justify-center gap-3 group"
            >
              <span className="group-hover:animate-pulse">{ICONS.Monitoring}</span>
              立即部署任务
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SurveillanceModal;
