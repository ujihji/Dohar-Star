import React, { useState } from 'react';
import { Search, Flame, Sparkles, Play, TrendingUp, Compass } from 'lucide-react';
import { ShortVideo } from '../types';

interface ExploreViewProps {
  videos: ShortVideo[];
  onSelectVideo: (video: ShortVideo) => void;
}

export const ExploreView: React.FC<ExploreViewProps> = ({ videos, onSelectVideo }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('All');

  const trendingTags = ['All', '#DoharStar', '#Bangladesh', '#TalentShow', '#RahimBeats', '#AndroidHacks', '#PadmaRiver'];

  const filteredVideos = videos.filter((vid) => {
    const matchesSearch =
      vid.caption.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vid.creator.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vid.creator.handle.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTag =
      selectedTag === 'All' || vid.hashtags.some((h) => h.toLowerCase() === selectedTag.toLowerCase());

    return matchesSearch && matchesTag;
  });

  return (
    <div className="flex-1 bg-slate-950 text-slate-100 overflow-y-auto p-4 space-y-4">
      {/* Top Search Header */}
      <div className="sticky top-0 z-20 bg-slate-950/95 backdrop-blur-md pt-1 pb-3">
        <div className="relative flex items-center">
          <Search className="w-4 h-4 text-slate-400 absolute left-3" />
          <input
            type="text"
            placeholder="Search creators, sounds, #hashtags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 text-slate-100 text-xs pl-9 pr-4 py-2.5 rounded-full border border-slate-800 focus:outline-none focus:border-amber-400 placeholder:text-slate-500"
          />
        </div>
      </div>

      {/* Trending Banner */}
      <div className="relative rounded-2xl overflow-hidden p-4 bg-gradient-to-r from-amber-600 via-amber-500 to-amber-700 text-slate-950 shadow-lg">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 bg-black/20 text-white rounded-full">
            🔥 Dohar Challenge
          </span>
          <Flame className="w-5 h-5 text-slate-950 fill-slate-950 animate-pulse" />
        </div>
        <h3 className="font-extrabold text-lg text-slate-950 leading-tight">#DoharStarTalent2026</h3>
        <p className="text-xs text-slate-900/90 font-medium mt-1">
          Show your dance, singing or comedy talents and win official Dohar badges!
        </p>
      </div>

      {/* Hashtag Filters */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {trendingTags.map((tag) => (
          <button
            key={tag}
            onClick={() => setSelectedTag(tag)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              selectedTag === tag
                ? 'bg-amber-400 text-slate-950 shadow-sm'
                : 'bg-slate-900 text-slate-300 border border-slate-800 hover:bg-slate-800'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Video Grid Section */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-amber-400" /> Discover Trending Shorts
          </h4>
          <span className="text-[10px] text-slate-500">{filteredVideos.length} videos</span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {filteredVideos.map((vid) => (
            <div
              key={vid.id}
              onClick={() => onSelectVideo(vid)}
              className="relative aspect-[9/16] rounded-xl overflow-hidden bg-slate-900 border border-slate-800/80 group cursor-pointer shadow-md"
            >
              <img
                src={vid.thumbnailUrl}
                alt={vid.caption}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 p-2.5 flex flex-col justify-between">
                <div className="flex justify-end">
                  <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-black/60 backdrop-blur-xs text-[10px] font-semibold text-white">
                    <Play className="w-2.5 h-2.5 fill-white" />
                    {(vid.viewsCount / 1000).toFixed(0)}k
                  </span>
                </div>

                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <img
                      src={vid.creator.avatar}
                      alt={vid.creator.name}
                      className="w-4 h-4 rounded-full object-cover border border-white/50"
                    />
                    <span className="text-[10px] font-bold text-white truncate">@{vid.creator.handle}</span>
                  </div>
                  <p className="text-[11px] text-slate-200 line-clamp-2 leading-tight">{vid.caption}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
