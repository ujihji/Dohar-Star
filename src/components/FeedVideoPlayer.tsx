import React, { useState, useRef, useEffect } from 'react';
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Disc,
  Music,
  Volume2,
  VolumeX,
  Play,
  CheckCircle2,
  Plus,
  Sparkles,
} from 'lucide-react';
import { ShortVideo } from '../types';

interface FeedVideoPlayerProps {
  video: ShortVideo;
  isActive: boolean;
  onLikeToggle: (id: string) => void;
  onBookmarkToggle: (id: string) => void;
  onOpenComments: (video: ShortVideo) => void;
  onOpenShare: (video: ShortVideo) => void;
  onFollowToggle: (creatorId: string) => void;
  onSelectCreator?: (creatorId: string) => void;
  onSelectSound?: (soundId: string) => void;
}

export const FeedVideoPlayer: React.FC<FeedVideoPlayerProps> = ({
  video,
  isActive,
  onLikeToggle,
  onBookmarkToggle,
  onOpenComments,
  onOpenShare,
  onFollowToggle,
  onSelectCreator,
  onSelectSound,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true); // Default muted for browser autoplay compliance
  const [progress, setProgress] = useState(0);
  const [showHeartOverlay, setShowHeartOverlay] = useState<{ x: number; y: number } | null>(null);
  const [hasVideoError, setHasVideoError] = useState(false);

  // Auto play/pause when video enters or leaves active viewport
  useEffect(() => {
    if (!videoRef.current) return;
    if (isActive) {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {
        setIsPlaying(false);
      });
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  }, [isActive]);

  const handleVideoClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleDoubleTap = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setShowHeartOverlay({ x, y });
    if (!video.isLiked) {
      onLikeToggle(video.id);
    }
    setTimeout(() => setShowHeartOverlay(null), 1000);
  };

  const handleTimeUpdate = () => {
    if (videoRef.current && videoRef.current.duration) {
      const p = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(p);
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  return (
    <div
      className="relative w-full h-full bg-slate-950 select-none overflow-hidden flex flex-col justify-between"
      onClick={handleVideoClick}
      onDoubleClick={handleDoubleTap}
    >
      {/* Fallback Animated Gradient Poster if video URL error or loading */}
      {hasVideoError ? (
        <div className="absolute inset-0 bg-gradient-to-tr from-slate-900 via-indigo-950 to-slate-900 flex flex-col items-center justify-center p-6 text-center">
          <img
            src={video.thumbnailUrl}
            alt={video.caption}
            className="absolute inset-0 w-full h-full object-cover opacity-40 blur-xs"
          />
          <div className="relative z-10 space-y-3">
            <div className="w-16 h-16 rounded-full bg-amber-500/20 border border-amber-400/40 flex items-center justify-center mx-auto animate-pulse text-amber-400">
              <Sparkles className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-lg text-white">Dohar Star Video</h3>
            <p className="text-xs text-slate-300 max-w-xs line-clamp-2">{video.caption}</p>
          </div>
        </div>
      ) : (
        <video
          ref={videoRef}
          src={video.videoUrl}
          poster={video.thumbnailUrl}
          loop
          playsInline
          muted={isMuted}
          onTimeUpdate={handleTimeUpdate}
          onError={() => setHasVideoError(true)}
          className={`w-full h-full object-cover ${video.filterPreset || ''}`}
        />
      )}

      {/* Play / Pause Toggle Center Overlay Indicator */}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 pointer-events-none z-20">
          <div className="w-16 h-16 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white border border-white/20 shadow-xl">
            <Play className="w-8 h-8 fill-white ml-1" />
          </div>
        </div>
      )}

      {/* Double Tap Heart Pop Effect */}
      {showHeartOverlay && (
        <div
          className="absolute z-30 pointer-events-none animate-ping"
          style={{ left: showHeartOverlay.x - 28, top: showHeartOverlay.y - 28 }}
        >
          <Heart className="w-14 h-14 fill-red-500 text-red-500 drop-shadow-lg" />
        </div>
      )}

      {/* Top Bar Indicators (Mute Button & Category) */}
      <div className="relative z-20 px-4 pt-3 flex items-center justify-between pointer-events-auto">
        <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-semibold text-amber-300 border border-white/10">
          <Sparkles className="w-3 h-3 text-amber-400" />
          <span>#DoharStar</span>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsMuted(!isMuted);
          }}
          className="p-2 rounded-full bg-black/50 backdrop-blur-md text-white/90 border border-white/10 hover:bg-black/70 transition-colors cursor-pointer"
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
        </button>
      </div>

      {/* Right Side Floating Actions Panel */}
      <div className="absolute right-3 bottom-20 z-30 flex flex-col items-center gap-4 text-white pointer-events-auto">
        {/* Creator Avatar & Follow + Button */}
        <div className="relative mb-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelectCreator?.(video.creator.id);
            }}
            className="block"
          >
            <img
              src={video.creator.avatar}
              alt={video.creator.name}
              className="w-11 h-11 rounded-full object-cover border-2 border-white shadow-lg"
            />
          </button>
          {!video.creator.isFollowing && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onFollowToggle(video.creator.id);
              }}
              className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-amber-500 text-black flex items-center justify-center font-bold shadow-md hover:scale-110 transition-transform cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
            </button>
          )}
        </div>

        {/* Like Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onLikeToggle(video.id);
          }}
          className="flex flex-col items-center gap-1 group cursor-pointer"
        >
          <div
            className={`p-2.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 transition-all group-active:scale-125 ${
              video.isLiked ? 'text-red-500 bg-red-500/20 border-red-500/30' : 'text-white'
            }`}
          >
            <Heart className={`w-6 h-6 ${video.isLiked ? 'fill-red-500' : ''}`} />
          </div>
          <span className="text-[11px] font-bold text-white tracking-tight shadow-xs">
            {formatNumber(video.likesCount)}
          </span>
        </button>

        {/* Comments Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onOpenComments(video);
          }}
          className="flex flex-col items-center gap-1 group cursor-pointer"
        >
          <div className="p-2.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white group-active:scale-125 transition-transform">
            <MessageCircle className="w-6 h-6" />
          </div>
          <span className="text-[11px] font-bold text-white tracking-tight">
            {formatNumber(video.commentsCount)}
          </span>
        </button>

        {/* Bookmark / Save Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onBookmarkToggle(video.id);
          }}
          className="flex flex-col items-center gap-1 group cursor-pointer"
        >
          <div
            className={`p-2.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 transition-transform group-active:scale-125 ${
              video.isBookmarked ? 'text-amber-400 bg-amber-500/20 border-amber-500/30' : 'text-white'
            }`}
          >
            <Bookmark className={`w-6 h-6 ${video.isBookmarked ? 'fill-amber-400' : ''}`} />
          </div>
          <span className="text-[11px] font-bold text-white tracking-tight">Save</span>
        </button>

        {/* Share Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onOpenShare(video);
          }}
          className="flex flex-col items-center gap-1 group cursor-pointer"
        >
          <div className="p-2.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white group-active:scale-125 transition-transform">
            <Share2 className="w-6 h-6" />
          </div>
          <span className="text-[11px] font-bold text-white tracking-tight">
            {formatNumber(video.sharesCount)}
          </span>
        </button>

        {/* Music Album Disc spinning animation */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSelectSound?.(video.sound.id);
          }}
          className="mt-1 relative cursor-pointer"
        >
          <div className={`w-9 h-9 rounded-full bg-slate-900 border-2 border-white/80 p-1 overflow-hidden shadow-lg ${isPlaying ? 'animate-spin-slow' : ''}`}>
            <img
              src={video.sound.coverUrl}
              alt={video.sound.title}
              className="w-full h-full rounded-full object-cover"
            />
          </div>
          <Music className="w-3.5 h-3.5 text-amber-400 absolute -top-1 -right-1 animate-bounce" />
        </button>
      </div>

      {/* Bottom Text & Metadata Panel */}
      <div className="relative z-20 p-4 pb-3 pr-16 bg-gradient-to-t from-black/90 via-black/50 to-transparent pointer-events-auto">
        {/* Handle & Creator info */}
        <div className="flex items-center gap-2 mb-1.5">
          <button
            onClick={() => onSelectCreator?.(video.creator.id)}
            className="font-bold text-sm text-white hover:underline flex items-center gap-1 cursor-pointer"
          >
            @{video.creator.handle}
            {video.creator.isVerified && <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 fill-sky-400/20" />}
          </button>
          {!video.creator.isFollowing && (
            <button
              onClick={() => onFollowToggle(video.creator.id)}
              className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500 text-black hover:bg-amber-400 transition-colors cursor-pointer"
            >
              Follow
            </button>
          )}
        </div>

        {/* Video Caption */}
        <p className="text-xs text-slate-100 font-normal leading-relaxed mb-2 line-clamp-2">
          {video.caption}
        </p>

        {/* Sound Marquee Ticker */}
        <div
          onClick={() => onSelectSound?.(video.sound.id)}
          className="flex items-center gap-2 text-xs text-slate-300 bg-black/30 backdrop-blur-xs py-1 px-2.5 rounded-full border border-white/10 w-fit cursor-pointer hover:text-white transition-colors"
        >
          <Disc className="w-3.5 h-3.5 text-amber-400 animate-spin-slow" />
          <span className="font-medium truncate max-w-[190px]">
            {video.sound.title} • {video.sound.artist}
          </span>
        </div>
      </div>

      {/* Video Progress Line */}
      <div className="relative z-30 w-full h-1 bg-white/20">
        <div className="h-full bg-amber-400 transition-all duration-100" style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
};
