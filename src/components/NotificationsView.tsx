import React from 'react';
import { Bell, Heart, MessageCircle, UserPlus, Sparkles, Check } from 'lucide-react';
import { NotificationItem } from '../types';

interface NotificationsViewProps {
  notifications: NotificationItem[];
  onMarkAllRead: () => void;
}

export const NotificationsView: React.FC<NotificationsViewProps> = ({ notifications, onMarkAllRead }) => {
  return (
    <div className="flex-1 bg-slate-950 text-slate-100 overflow-y-auto p-4 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-amber-400" />
          <h3 className="font-bold text-base text-white">Activity Notifications</h3>
        </div>
        <button
          onClick={onMarkAllRead}
          className="text-xs text-amber-400 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
        >
          <Check className="w-3.5 h-3.5" /> Mark all read
        </button>
      </div>

      <div className="space-y-2.5">
        {notifications.map((n) => {
          let Icon = Sparkles;
          let iconBg = 'bg-slate-800 text-amber-400';

          if (n.type === 'like') {
            Icon = Heart;
            iconBg = 'bg-rose-500/20 text-rose-500';
          } else if (n.type === 'comment') {
            Icon = MessageCircle;
            iconBg = 'bg-indigo-500/20 text-indigo-400';
          } else if (n.type === 'follow') {
            Icon = UserPlus;
            iconBg = 'bg-emerald-500/20 text-emerald-400';
          }

          return (
            <div
              key={n.id}
              className={`p-3 rounded-2xl border transition-colors flex items-center justify-between gap-3 ${
                n.isRead ? 'bg-slate-900/60 border-slate-800/60' : 'bg-slate-900 border-amber-500/30'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  {n.userAvatar ? (
                    <img src={n.userAvatar} alt="" className="w-10 h-10 rounded-full object-cover border border-slate-700" />
                  ) : (
                    <div className={`w-10 h-10 rounded-full ${iconBg} flex items-center justify-center`}>
                      <Icon className="w-5 h-5" />
                    </div>
                  )}
                  {n.userAvatar && (
                    <div className={`absolute -bottom-1 -right-1 p-1 rounded-full ${iconBg} ring-2 ring-slate-950`}>
                      <Icon className="w-2.5 h-2.5" />
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <p className="text-xs text-slate-200 leading-snug">
                    {n.userName && <span className="font-bold text-white mr-1">{n.userName}</span>}
                    {n.actionText}
                  </p>
                  <span className="text-[10px] text-slate-500 mt-0.5 block">{n.timestamp}</span>
                </div>
              </div>

              {n.thumbnailUrl && (
                <img src={n.thumbnailUrl} alt="" className="w-10 h-14 rounded-lg object-cover border border-slate-800" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
