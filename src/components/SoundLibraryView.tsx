import React, { useState } from 'react';
import { Play, Pause, Music, Disc, Sparkles, PlusCircle } from 'lucide-react';
import { Sound } from '../types';

interface SoundLibraryViewProps {
  sounds: Sound[];
  onUseSound: (sound: Sound) => void;
}

export const SoundLibraryView: React.FC<SoundLibraryViewProps> = ({ sounds, onUseSound }) => {
  const [playingId, setPlayingId] = useState<string | null>(null);

  const togglePlay = (id: string) => {
    if (playingId === id) {
      setPlayingId(null);
    } else {
      setPlayingId(id);
    }
  };

  return (
    <div className="flex-1 bg-slate-950 text-slate-100 overflow-y-auto p-4 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Music className="w-5 h-5 text-amber-400" />
          <h3 className="font-bold text-base text-white">Dohar Sound Library</h3>
        </div>
        <span className="text-xs text-slate-400">Trending Tracks</span>
      </div>

      <div className="space-y-3">
        {sounds.map((snd) => {
          const isPlaying = playingId === snd.id;
          return (
            <div
              key={snd.id}
              className="p-3 rounded-2xl bg-slate-900 border border-slate-800/80 flex items-center justify-between gap-3 shadow-sm hover:border-slate-700 transition-colors"
            >
              <div className="flex items-center gap-3">
                <button
                  onClick={() => togglePlay(snd.id)}
                  className="relative group cursor-pointer"
                >
                  <img
                    src={snd.coverUrl}
                    alt={snd.title}
                    className="w-12 h-12 rounded-xl object-cover border border-slate-700"
                  />
                  <div className="absolute inset-0 bg-black/40 rounded-xl flex items-center justify-center text-white">
                    {isPlaying ? <Pause className="w-5 h-5 fill-white" /> : <Play className="w-5 h-5 fill-white ml-0.5" />}
                  </div>
                </button>

                <div>
                  <h4 className="font-semibold text-xs text-slate-100 leading-snug">{snd.title}</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">{snd.artist}</p>
                  <span className="inline-block mt-1 text-[10px] text-amber-400 font-medium">
                    🔥 {(snd.usageCount / 1000).toFixed(1)}k videos
                  </span>
                </div>
              </div>

              <button
                onClick={() => onUseSound(snd)}
                className="px-3 py-1.5 rounded-full bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs flex items-center gap-1 transition-transform active:scale-95 cursor-pointer shadow-sm"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Use</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
