
import React, { useState, useEffect, useRef } from 'react';
import { ICONS } from '../constants';

interface MapPickerModalProps {
  onClose: () => void;
  onConfirm: (data: { point: [number, number]; radius: number; deviceCount: number }) => void;
}

const MapPickerModal: React.FC<MapPickerModalProps> = ({ onClose, onConfirm }) => {
  const [radius, setRadius] = useState(1000);
  const [center, setCenter] = useState<[number, number]>([121.4737, 31.2304]);
  const [deviceCount, setDeviceCount] = useState(0);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState('');
  const [locationLoaded, setLocationLoaded] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);
  const initialCenterRef = useRef<[number, number]>([121.4737, 31.2304]);
  const geoReadyRef = useRef(false);
  
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const circleInstance = useRef<any>(null);
  const markerInstance = useRef<any>(null);

  // 获取用户当前位置
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userCenter: [number, number] = [
            position.coords.longitude,
            position.coords.latitude
          ];
          initialCenterRef.current = userCenter;
          geoReadyRef.current = true;
          setCenter(userCenter);
          setLocationLoaded(true);
          setGeoError(null);
        },
        (error) => {
          console.log('Geolocation error:', error.message);
          geoReadyRef.current = true;
          setLocationLoaded(true);
          switch(error.code) {
            case error.PERMISSION_DENIED:
              setGeoError('您已拒绝位置权限，将使用默认位置');
              break;
            case error.POSITION_UNAVAILABLE:
              setGeoError('位置信息不可用，将使用默认位置');
              break;
            case error.TIMEOUT:
              setGeoError('获取位置超时，将使用默认位置');
              break;
            default:
              setGeoError('无法获取您的位置，将使用默认位置');
          }
        },
        {
          enableHighAccuracy: true,
          timeout: 60 * 1000,
          maximumAge: 0
        }
      );
    } else {
      geoReadyRef.current = true;
      setLocationLoaded(true);
      setGeoError('您的浏览器不支持地理定位，将使用默认位置');
    }
  }, []);

  useEffect(() => {
    let checkCount = 0;
    const maxChecks = 50;

    const tryInit = () => {
      const AMap = (window as any).AMap;

      // 1. 检查基类
      if (!AMap || !AMap.Map) {
        if (checkCount < maxChecks) {
          checkCount++;
          setTimeout(tryInit, 200);
        } else {
          setStatus('error');
          setErrorMessage('地理引擎加载超时，请确认网络连接。');
        }
        return;
      }

      // 2. 检查容器
      if (!mapContainerRef.current) {
        setTimeout(tryInit, 100);
        return;
      }

      try {
        // 3. 实例化地图 - 使用 ref 中的初始中心点
        const map = new AMap.Map(mapContainerRef.current, {
          viewMode: '3D',
          zoom: 14,
          center: initialCenterRef.current,
          mapStyle: 'amap://styles/darkblue',
          animateEnable: true
        });

        mapInstance.current = map;

        // 4. 这里的 complete 事件可能因为沙盒安全限制不触发，我们同时使用一个快速确认
        const timer = setTimeout(() => {
          if (status === 'loading') finishInit();
        }, 2000);

        const finishInit = () => {
          if (status === 'ready') return;
          clearTimeout(timer);

          // 初始化覆盖物
          circleInstance.current = new AMap.Circle({
            center: initialCenterRef.current,
            radius: radius,
            strokeColor: '#8b5cf6',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#8b5cf6',
            fillOpacity: 0.15,
            strokeStyle: 'dashed',
            strokeDasharray: [10, 10],
            draggable: true,
            cursor: 'move',
          });

          markerInstance.current = new AMap.Marker({
            position: initialCenterRef.current,
            offset: new AMap.Pixel(-16, -8),
            icon: new AMap.Icon({
              size: new AMap.Size(32, 32),
              image: 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(`
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#8b5cf6">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                  <circle cx="12" cy="9" r="2.5" fill="white"/>
                </svg>
              `),
              imageSize: new AMap.Size(32, 32),
            }),
          });

          map.add([circleInstance.current, markerInstance.current]);

          // 监听圆形拖动事件
          circleInstance.current.on('dragend', () => {
            const newCenter = circleInstance.current.getCenter();
            const centerArr: [number, number] = [newCenter.getLng(), newCenter.getLat()];
            setCenter(centerArr);
            markerInstance.current.setPosition(newCenter);
          });

          // 点击地图更新位置
          map.on('click', (e: any) => {
            const newCenter: [number, number] = [e.lnglat.getLng(), e.lnglat.getLat()];
            setCenter(newCenter);
            circleInstance.current.setCenter(newCenter);
            markerInstance.current.setPosition(newCenter);
          });

          setStatus('ready');
          setTimeout(() => map.container && (map as any).resize(), 100);
        };

        map.on('complete', finishInit);

      } catch (err: any) {
        console.warn('Map Initialization Warning:', err);
        if (err.name === 'SecurityError') {
           console.log('Detected environment security policy, attempting fallback...');
        } else {
           setStatus('error');
           setErrorMessage(err.message || '地图组件启动失败');
        }
      }
    };

    // 稍微延迟确保 DOM 稳定
    const startTimer = setTimeout(tryInit, 300);

    return () => {
      clearTimeout(startTimer);
      if (mapInstance.current) {
        mapInstance.current.destroy();
      }
    };
  }, []);

  // 更新半径
  useEffect(() => {
    if (circleInstance.current && status === 'ready') {
      circleInstance.current.setRadius(radius);
    }
    const baseDensity = 0.05;
    const count = Math.floor((Math.PI * Math.pow(radius / 10, 2)) * baseDensity);
    setDeviceCount(count);
  }, [radius, status]);

  // 监听中心点变化，更新地图视图和覆盖物
  useEffect(() => {
    if (mapInstance.current && circleInstance.current && markerInstance.current && status === 'ready') {
      mapInstance.current.setCenter(center);
      circleInstance.current.setCenter(center);
      markerInstance.current.setPosition(center);
    }
  }, [center, status]);

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-[#0a0a14]/95 backdrop-blur-xl p-6 animate-in fade-in duration-300">
      <div className="bg-[#0d0d1a] border border-purple-500/30 rounded-[2.5rem] w-full max-w-5xl h-[85vh] overflow-hidden flex flex-col shadow-2xl shadow-purple-900/20">
        
        {/* Header */}
        <div className="p-8 border-b border-white/5 flex items-center justify-between bg-gradient-to-r from-purple-900/10 to-transparent">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-600/20 text-purple-400 rounded-2xl flex items-center justify-center border border-purple-500/30">
              {ICONS.Map}
            </div>
            <div>
              <h3 className="text-lg font-black text-white uppercase tracking-[0.2em]">空间范围选定</h3>
              <p className="text-[10px] text-purple-400/60 font-bold uppercase tracking-widest mt-1">
                点击地图选择目标区域中心，调整半径即可自动框选监控点位
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-white/5 rounded-2xl text-gray-500 hover:text-purple-400 transition-all">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        <div className="flex-1 flex overflow-hidden relative">
          <div className="flex-1 relative bg-[#0a0a14] overflow-hidden">
            <div 
              ref={mapContainerRef} 
              className="absolute inset-0 w-full h-full" 
              style={{ background: '#0a0a14', minHeight: '400px' }} 
            />
            
            {status === 'loading' && (
              <div className="absolute inset-0 flex flex-col items-center justify-center z-20 bg-[#0d0d1a]">
                <div className="w-16 h-16 relative">
                   <div className="absolute inset-0 border-4 border-purple-500/20 rounded-full" />
                   <div className="absolute inset-0 border-4 border-transparent border-t-purple-500 rounded-full animate-spin" />
                </div>
                <p className="mt-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] animate-pulse">正在握手高德地理信息服务...</p>
              </div>
            )}

            {status === 'error' && (
              <div className="absolute inset-0 flex flex-col items-center justify-center z-20 bg-[#0d0d1a] px-10 text-center">
                <div className="text-rose-500 mb-4 scale-[1.5] opacity-80">{ICONS.Negative || '⚠️'}</div>
                <h4 className="text-white font-black uppercase mb-2 tracking-widest">服务初始化中断</h4>
                <p className="text-[10px] text-slate-500 max-w-xs leading-relaxed uppercase">{errorMessage}</p>
                <button 
                  onClick={() => window.location.reload()}
                  className="mt-8 px-8 py-3 bg-purple-600/20 border border-purple-500/40 rounded-xl text-[10px] font-black uppercase tracking-widest text-purple-400 hover:bg-purple-600 hover:text-white transition-all shadow-lg"
                >
                  强制刷新系统
                </button>
              </div>
            )}

            {status === 'ready' && (
              <>
                <div className="absolute top-6 left-6 pointer-events-none space-y-2 z-10">
                  {!locationLoaded && (
                    <div className="bg-[#0d0d1a]/80 backdrop-blur-md px-4 py-2 rounded-xl border border-amber-500/30 text-[9px] font-black text-amber-400 uppercase tracking-widest shadow-lg animate-pulse">
                      <span className="mr-2">⌛</span>正在获取您的位置...
                    </div>
                  )}
                  {locationLoaded && center[0] !== 121.4737 && center[1] !== 31.2304 && (
                    <div className="bg-[#0d0d1a]/80 backdrop-blur-md px-4 py-2 rounded-xl border border-emerald-500/30 text-[9px] font-black text-emerald-400 uppercase tracking-widest shadow-lg">
                      <span className="mr-2">✓</span>已定位到您当前的位置
                    </div>
                  )}
                  {geoError && (
                    <div className="bg-[#0d0d1a]/80 backdrop-blur-md px-4 py-2 rounded-xl border border-rose-500/30 text-[9px] font-black text-rose-400 uppercase tracking-widest shadow-lg">
                      <span className="mr-2">⚠</span>{geoError}
                    </div>
                  )}
                  {/* <div className="bg-[#0d0d1a]/80 backdrop-blur-md px-4 py-2 rounded-xl border border-purple-500/30 text-[9px] font-black text-purple-400 uppercase tracking-widest shadow-lg">
                    <span className="animate-pulse mr-2 text-emerald-500">●</span> 卫星实时渲染中
                  </div> */}
                </div>

                <div className="absolute bottom-6 right-6 flex flex-col gap-2 z-10">
                    <div className="bg-[#0d0d1a]/80 backdrop-blur-md p-4 rounded-xl border border-white/5 text-[10px] font-bold text-slate-400 space-y-2 uppercase tracking-widest shadow-xl">
                        <div className="flex justify-between gap-8"><span>LNG:</span> <span className="text-white tabular-nums">{center[0].toFixed(6)}</span></div>
                        <div className="flex justify-between gap-8"><span>LAT:</span> <span className="text-white tabular-nums">{center[1].toFixed(6)}</span></div>
                    </div>
                </div>
              </>
            )}
          </div>

          <div className="w-80 bg-[#0d0d1a]/50 p-10 flex flex-col gap-10 border-l border-white/5 relative z-30">
            <div className="space-y-6">
               <label className="text-[10px] font-black text-purple-400/70 uppercase tracking-[0.2em]">范围调节</label>
               <div className="space-y-4">
                 <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-white uppercase">检索半径 (m)</span>
                    <span className="text-xl font-black purple-gradient-text tabular-nums">{radius}</span>
                 </div>
                 <input 
                    type="range" 
                    min="100" 
                    max="5000" 
                    step="50"
                    value={radius}
                    onChange={(e) => setRadius(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-white/5 rounded-lg appearance-none cursor-pointer accent-purple-600" 
                 />
                 <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase tracking-tighter">
                    <span>100m</span>
                    <span>5km</span>
                 </div>
               </div>
            </div>

            <div className="space-y-6">
               <label className="text-[10px] font-black text-purple-400/70 uppercase tracking-[0.2em]">覆盖预览</label>
               <div className="p-6 bg-purple-600/10 border border-purple-500/20 rounded-2xl space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">感知设备</span>
                    <span className="text-lg font-black text-white tabular-nums">{deviceCount}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">面积</span>
                    <span className="text-xs font-bold text-slate-300 tabular-nums">{(Math.PI * Math.pow(radius / 1000, 2)).toFixed(2)} km²</span>
                  </div>
               </div>
            </div>

            <div className="mt-auto space-y-4">
               <button 
                onClick={() => onConfirm({ point: center, radius, deviceCount })}
                disabled={status !== 'ready'}
                className="w-full py-4 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-lg transition-all active:scale-95"
               >
                 确认当前选区
               </button>
               <button onClick={onClose} className="w-full py-4 bg-white/5 hover:bg-white/10 text-slate-400 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all">
                 取消操作
               </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapPickerModal;
