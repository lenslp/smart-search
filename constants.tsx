
import React from 'react';
import { 
  Search, Image as ImageIcon, History, Layers, 
  Filter, MapPin, Download, Activity, Radar, 
  Crosshair, User, Car, Bike, Video, Clock, 
  Settings, ChevronDown, CheckCircle, XCircle, Plus,
  Sun, Moon, Upload, BarChart3, ListChecks, PlayCircle,
  Bell, MessageSquare, Mail, Globe, Trash2,
  Home, Map
} from 'lucide-react';
import { TargetType, TaskStatus, Task } from './types';

export const ICONS = {
  Search: <Search size={18} />,
  Image: <ImageIcon size={18} />,
  History: <History size={18} />,
  Model: <Layers size={18} />,
  Filter: <Filter size={18} />,
  Map: <MapPin size={18} />,
  Download: <Download size={18} />,
  Trajectory: <Activity size={18} />,
  Monitoring: <Radar size={18} />,
  Train: <Crosshair size={18} />,
  Human: <User size={16} />,
  Car: <Car size={16} />,
  Bike: <Bike size={16} />,
  Video: <Video size={16} />,
  Clock: <Clock size={16} />,
  Settings: <Settings size={18} />,
  Down: <ChevronDown size={18} />,
  Positive: <CheckCircle size={18} className="text-emerald-500" />,
  Negative: <XCircle size={18} className="text-rose-500" />,
  Plus: <Plus size={18} />,
  Sun: <Sun size={20} />,
  Moon: <Moon size={20} />,
  Upload: <Upload size={18} />,
  Chart: <BarChart3 size={18} />,
  Tasks: <ListChecks size={18} />,
  Play: <PlayCircle size={20} />,
  Bell: <Bell size={18} />,
  SMS: <MessageSquare size={18} />,
  Mail: <Mail size={18} />,
  Web: <Globe size={18} />,
  Trash: <Trash2 size={16} />,
  Home: <Home size={18} />,
  Task: <ListChecks size={18} />,
  Stats: <BarChart3 size={18} />,
  Location: <MapPin size={16} />
};

export const MOCK_TASKS: Task[] = [
  { id: 't1', name: '全域红衣人员检索', type: 'IMAGE_SEARCH', status: TaskStatus.COMPLETED, progress: 100, duration: '45s', resultCount: 128, createdAt: '2025-05-20 10:00', thumbnail: 'https://picsum.photos/seed/t1/100/100' },
  { id: 't2', name: '路口 A3 视频结构化分析', type: 'VIDEO_ANALYSIS', status: TaskStatus.PROCESSING, progress: 68, duration: '12m', resultCount: 450, createdAt: '2025-05-20 14:30', thumbnail: 'https://picsum.photos/seed/t2/100/100' },
  { id: 't3', name: '本地录像提取 - 0519.mp4', type: 'LOCAL_EXTRACT', status: TaskStatus.QUEUED, progress: 0, duration: '0s', resultCount: 0, createdAt: '2025-05-20 15:00', thumbnail: 'https://picsum.photos/seed/t3/100/100' }
];

export const MOCK_RESULTS: any[] = Array.from({ length: 24 }).map((_, i) => ({
  id: `res-${i}`,
  url: `https://picsum.photos/seed/${i + 777}/400/400`,
  type: [TargetType.HUMAN, TargetType.MOTOR, TargetType.NON_MOTOR][i % 3],
  similarity: Math.floor(Math.random() * 15) + 85,
  timestamp: '2025-05-20 14:22:08',
  location: '核心商务区 A3路口',
  camera: `智控终端-${String(i + 1).padStart(3, '0')}`,
  coordinates: [121.4737 + Math.random() * 0.02, 31.2304 + Math.random() * 0.02] // 高德地图格式: [经度, 纬度]
}));
