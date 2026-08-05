import React, { useState } from 'react';
import { X, Copy, Check, Share2, MessageCircle, Send, Download, Bookmark, Flag } from 'lucide-react';
import { ShortVideo } from '../types';

interface ShareModalProps {
  video: ShortVideo;
  isOpen: boolean;
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ video, isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  if (!isOpen) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`https://doharstar.app/v/${video.id}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2500);
  };

  const shareApps = [
    { name: 'WhatsApp', color: 'bg-emerald-600', icon: '💬' },
    { name: 'Facebook', color: 'bg-blue-600', icon: '👥' },
    { name: 'Direct Chat', color: 'bg-indigo-600', icon: '⚡' },
    { name: 'Instagram', color: 'bg-pink-600', icon: '📸' },
    { name: 'Telegram', color: 'bg-sky-500', icon: '✈️' },
  ];

  return (
    <div className="absolute inset-0 z-50 bg-black/70 backdrop-blur-xs flex flex-col justify-end animate-fade-in">
      <div className="flex-1" onClick={onClose} />
      <div className="bg-slate-900 border-t border-slate-800 rounded-t-3xl p-5 space-y-5 animate-slide-up shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Share2 className="w-4 h-4 text-amber-400" />
            <span className="font-semibold text-sm text-slate-100">Share Dohar Short</span>
          </div>
          <button onClick={onClose} className="p-1 rounded-full text-slate-400 hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Share apps grid */}
        <div className="grid grid-cols-5 gap-3 text-center">
          {shareApps.map((app) => (
            <button
              key={app.name}
              onClick={() => alert(`Shared to ${app.name}!`)}
              className="flex flex-col items-center gap-1.5 group cursor-pointer"
            >
              <div
                className={`w-11 h-11 rounded-full ${app.color} text-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}
              >
                {app.icon}
              </div>
              <span className="text-[10px] text-slate-300 font-medium leading-tight">{app.name}</span>
            </button>
          ))}
        </div>

        {/* Actions List */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800">
          <button
            onClick={handleCopyLink}
            className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 gap-1.5 transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-amber-400" />}
            <span className="text-[11px] font-medium">{copied ? 'Link Copied!' : 'Copy Link'}</span>
          </button>

          <button
            onClick={handleDownload}
            className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 gap-1.5 transition-colors cursor-pointer"
          >
            {downloaded ? <Check className="w-4 h-4 text-emerald-400" /> : <Download className="w-4 h-4 text-sky-400" />}
            <span className="text-[11px] font-medium">{downloaded ? 'Saving HD...' : 'Save Video'}</span>
          </button>

          <button
            onClick={() => alert('Report submitted to Dohar Star moderators.')}
            className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 gap-1.5 transition-colors cursor-pointer"
          >
            <Flag className="w-4 h-4 text-rose-400" />
            <span className="text-[11px] font-medium">Report</span>
          </button>
        </div>
      </div>
    </div>
  );
};
