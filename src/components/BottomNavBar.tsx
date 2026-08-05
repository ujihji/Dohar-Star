import React from 'react';
import { Home, Compass, Plus, Music, Bell, User } from 'lucide-react';
import { ActiveTab } from '../types';

interface BottomNavBarProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  unreadCount?: number;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  activeTab,
  onSelectTab,
  unreadCount = 2,
}) => {
  return (
    <nav className="relative z-40 bg-slate-950/95 border-t border-slate-900 px-3 py-1.5 flex items-center justify-around backdrop-blur-lg">
      {/* Home Feed Tab */}
      <button
        onClick={() => onSelectTab('home')}
        className={`flex flex-col items-center gap-0.5 p-1 transition-colors cursor-pointer ${
          activeTab === 'home' ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <Home className="w-5 h-5" />
        <span className="text-[10px]">Home</span>
      </button>

      {/* Discover Search Tab */}
      <button
        onClick={() => onSelectTab('discover')}
        className={`flex flex-col items-center gap-0.5 p-1 transition-colors cursor-pointer ${
          activeTab === 'discover' ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <Compass className="w-5 h-5" />
        <span className="text-[10px]">Discover</span>
      </button>

      {/* Center Create (+) Button */}
      <button
        onClick={() => onSelectTab('upload')}
        className="flex items-center justify-center -mt-3 relative group cursor-pointer"
      >
        <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500 via-amber-400 to-amber-600 text-slate-950 flex items-center justify-center font-bold shadow-lg shadow-amber-500/20 group-hover:scale-105 group-active:scale-95 transition-transform border-2 border-slate-950">
          <Plus className="w-6 h-6 stroke-[3]" />
        </div>
      </button>

      {/* Sounds Tab */}
      <button
        onClick={() => onSelectTab('sounds')}
        className={`flex flex-col items-center gap-0.5 p-1 transition-colors cursor-pointer ${
          activeTab === 'sounds' ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <Music className="w-5 h-5" />
        <span className="text-[10px]">Sounds</span>
      </button>

      {/* Activity Notifications Tab */}
      <button
        onClick={() => onSelectTab('notifications')}
        className={`relative flex flex-col items-center gap-0.5 p-1 transition-colors cursor-pointer ${
          activeTab === 'notifications' ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <div className="relative">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center border border-slate-950">
              {unreadCount}
            </span>
          )}
        </div>
        <span className="text-[10px]">Inbox</span>
      </button>

      {/* Profile Tab */}
      <button
        onClick={() => onSelectTab('profile')}
        className={`flex flex-col items-center gap-0.5 p-1 transition-colors cursor-pointer ${
          activeTab === 'profile' ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <User className="w-5 h-5" />
        <span className="text-[10px]">Profile</span>
      </button>
    </nav>
  );
};
