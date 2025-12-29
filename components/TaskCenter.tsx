
import React from 'react';
import { ICONS, MOCK_TASKS } from '../constants';
import { TaskStatus } from '../types';

const TaskCenter: React.FC = () => {
  return (
    <div className="flex-1 p-10 overflow-y-auto">
      <div className="max-w-7xl mx-auto space-y-10">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-black text-[var(--text-primary)]">任务中心</h2>
            <p className="text-[var(--text-secondary)] text-sm mt-2 font-medium">统一管理全网检索与视频结构化任务记录</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MOCK_TASKS.map(task => (
            <div key={task.id} className="glass-panel rounded-3xl p-6 border border-white/5 hover:border-purple-500/30 transition-all group">
              <div className="flex gap-5">
                <div className="w-20 h-20 rounded-2xl overflow-hidden border border-white/10 relative">
                  <img src={task.thumbnail} className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-all" />
                  <div className="absolute inset-0 flex items-center justify-center text-purple-400">
                    {task.type === 'IMAGE_SEARCH' ? ICONS.Search : ICONS.Video}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${
                      task.status === TaskStatus.COMPLETED ? 'bg-emerald-600/20 text-emerald-400' : 
                      task.status === TaskStatus.PROCESSING ? 'bg-purple-600/20 text-purple-400 animate-pulse' : 'bg-slate-800 text-slate-500'
                    }`}>
                      {task.status}
                    </span>
                    <span className="text-[9px] text-slate-500 font-bold">{task.createdAt}</span>
                  </div>
                  <h4 className="text-sm font-bold text-[var(--text-primary)] mb-2 truncate">{task.name}</h4>
                  <div className="flex items-center gap-4 text-[10px] text-slate-500 font-bold uppercase">
                    <span className="flex items-center gap-1">{ICONS.Clock} {task.duration}</span>
                    <span className="flex items-center gap-1">{ICONS.Filter} {task.resultCount} 结果</span>
                  </div>
                </div>
              </div>

              {task.status === TaskStatus.PROCESSING && (
                <div className="mt-6 space-y-2">
                  <div className="flex justify-between text-[9px] font-bold text-slate-500 uppercase">
                    <span>解析中...</span>
                    <span>{task.progress}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-600" style={{ width: `${task.progress}%` }} />
                  </div>
                </div>
              )}

              <div className="mt-6 pt-6 border-t border-white/5 flex gap-3">
                 <button className="flex-1 py-2.5 bg-white/5 hover:bg-purple-600/20 rounded-xl text-[10px] font-bold text-slate-400 hover:text-purple-400 transition-all uppercase tracking-widest">
                    查看报告
                 </button>
                 <button className="flex-1 py-2.5 bg-white/5 hover:bg-purple-600/20 rounded-xl text-[10px] font-bold text-slate-400 hover:text-purple-400 transition-all uppercase tracking-widest">
                    进入分析
                 </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TaskCenter;
