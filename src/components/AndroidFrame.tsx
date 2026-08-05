import React, { useState, useEffect } from 'react';
import { Smartphone, Monitor, BatteryCharging, Wifi, Signal } from 'lucide-react';

interface AndroidFrameProps {
  children: React.ReactNode;
  activeTabTitle?: string;
}

export const AndroidFrame: React.FC<AndroidFrameProps> = ({ children, activeTabTitle }) => {
  const [currentTime, setCurrentTime] = useState('');
  const [batteryLevel, setBatteryLevel] = useState(92);
  const [isMobileFrame, setIsMobileFrame] = useState(true);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes();
      const timeStr = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
      setCurrentTime(timeStr);
    };

    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-0 sm:p-4 md:p-6 overflow-hidden select-none">
      {/* Top Controller Bar for Frame Switcher */}
      <div className="hidden sm:flex items-center justify-between w-full max-w-[420px] mb-3 px-3 py-1.5 bg-slate-900/90 border border-slate-800 rounded-full text-xs text-slate-300 backdrop-blur-md shadow-lg">
        <div className="flex items-center gap-2 font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Dohar Star (Android OS 15)</span>
        </div>
        <button
          onClick={() => setIsMobileFrame(!isMobileFrame)}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-amber-400 font-semibold transition-colors cursor-pointer"
        >
          {isMobileFrame ? (
            <>
              <Monitor className="w-3.5 h-3.5" />
              <span>Full Screen</span>
            </>
          ) : (
            <>
              <Smartphone className="w-3.5 h-3.5" />
              <span>Android Shell</span>
            </>
          )}
        </button>
      </div>

      {/* Main Container: Android Phone Shell or Edge-to-Edge */}
      <div
        className={`relative w-full transition-all duration-300 flex flex-col bg-black overflow-hidden shadow-2xl ${
          isMobileFrame
            ? 'sm:max-w-[400px] sm:h-[820px] sm:rounded-[44px] sm:border-[10px] sm:border-slate-800 sm:ring-1 sm:ring-slate-700/50'
            : 'max-w-md h-screen sm:h-[820px] sm:rounded-2xl'
        }`}
      >
        {/* Android Punch-Hole Camera Notch */}
        {isMobileFrame && (
          <div className="absolute top-2 left-1/2 -translate-x-1/2 z-50 w-24 h-5 bg-black rounded-full flex items-center justify-center gap-2 shadow-sm pointer-events-none">
            <div className="w-3 h-3 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-slate-950" />
            </div>
            <div className="w-1.5 h-1.5 rounded-full bg-slate-800" />
          </div>
        )}

        {/* Android Status Bar */}
        <div className="relative z-40 w-full h-8 px-5 pt-1.5 flex items-center justify-between text-[11px] font-semibold text-white/90 backdrop-blur-xs bg-gradient-to-b from-black/60 to-transparent pointer-events-none">
          {/* Time & Carrier */}
          <div className="flex items-center gap-1.5 tracking-tight">
            <span>{currentTime || '12:00'}</span>
            <span className="text-[9px] px-1 py-0.2 bg-amber-500/20 text-amber-400 rounded font-bold border border-amber-500/30">
              5G
            </span>
          </div>

          {/* Status Icons */}
          <div className="flex items-center gap-2">
            <Signal className="w-3 h-3 fill-current" />
            <Wifi className="w-3 h-3" />
            <div className="flex items-center gap-0.5">
              <span className="text-[10px] font-mono text-emerald-400">{batteryLevel}%</span>
              <BatteryCharging className="w-3.5 h-3.5 text-emerald-400" />
            </div>
          </div>
        </div>

        {/* App Workspace Body */}
        <div className="flex-1 relative flex flex-col overflow-hidden bg-black">
          {children}
        </div>

        {/* Android Bottom Gesture Navigation Bar */}
        <div className="relative z-40 w-full h-4 bg-black flex items-center justify-center pointer-events-none pb-1">
          <div className="w-28 h-1 bg-white/40 rounded-full" />
        </div>
      </div>
    </div>
  );
};
