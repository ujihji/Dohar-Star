import React, { useState } from 'react';
import { Creator, ShortVideo } from '../types';
import { CheckCircle2, Grid, Heart, Bookmark, Edit3, Settings, Play, LogIn, LogOut, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface ProfileViewProps {
  user: Creator;
  userVideos: ShortVideo[];
  likedVideos: ShortVideo[];
  bookmarkedVideos: ShortVideo[];
  onSelectVideo: (video: ShortVideo) => void;
  onUpdateUser: (updated: Partial<Creator>) => void;
  onOpenAuthModal: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  user,
  userVideos,
  likedVideos,
  bookmarkedVideos,
  onSelectVideo,
  onUpdateUser,
  onOpenAuthModal,
}) => {
  const { user: authUser, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'videos' | 'likes' | 'saved'>('videos');
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(user.name);
  const [editBio, setEditBio] = useState(user.bio);

  const formatNum = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({ name: editName, bio: editBio });
    setIsEditing(false);
  };

  const displayGrid =
    activeTab === 'videos'
      ? userVideos
      : activeTab === 'likes'
      ? likedVideos
      : bookmarkedVideos;

  return (
    <div className="flex-1 bg-slate-950 text-slate-100 overflow-y-auto">
      {/* Cover Header */}
      <div className="relative h-28 bg-gradient-to-r from-amber-600 via-amber-500 to-amber-700">
        <div className="absolute top-3 right-3 flex items-center gap-2">
          {authUser ? (
            <button
              onClick={() => logout()}
              className="px-2.5 py-1 rounded-full bg-black/40 text-rose-300 backdrop-blur-md hover:bg-black/60 text-xs font-bold flex items-center gap-1 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" /> Sign Out
            </button>
          ) : (
            <button
              onClick={onOpenAuthModal}
              className="px-2.5 py-1 rounded-full bg-amber-400 text-black font-extrabold text-xs flex items-center gap-1 shadow-md hover:scale-105 transition-transform cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5" /> Sign In / Register
            </button>
          )}

          <button
            onClick={() => setIsEditing(true)}
            className="p-2 rounded-full bg-black/40 text-white backdrop-blur-md hover:bg-black/60 cursor-pointer"
          >
            <Edit3 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Avatar & Profile Information */}
      <div className="px-4 pb-4 -mt-10 relative">
        <div className="flex items-end justify-between mb-3">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-20 h-20 rounded-full object-cover border-4 border-slate-950 shadow-xl"
          />
          <div className="flex gap-2">
            {!authUser && (
              <button
                onClick={onOpenAuthModal}
                className="px-3 py-1.5 rounded-full bg-amber-500 text-black text-xs font-extrabold hover:bg-amber-400 transition-colors cursor-pointer shadow-sm"
              >
                Sign In
              </button>
            )}
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-1.5 rounded-full border border-slate-700 bg-slate-900 text-xs font-bold text-slate-200 hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Edit Profile
            </button>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-1.5 leading-tight">
            {user.name}
            {user.isVerified && <CheckCircle2 className="w-4 h-4 text-sky-400 fill-sky-400/20" />}
          </h2>
          <p className="text-xs text-amber-400 font-medium">@{user.handle}</p>
          <p className="text-xs text-slate-300 mt-2 leading-relaxed">{user.bio}</p>
        </div>

        {/* Stats Count Row */}
        <div className="flex items-center justify-around my-4 py-3 bg-slate-900/80 rounded-2xl border border-slate-800 text-center">
          <div>
            <div className="font-extrabold text-sm text-white">{formatNum(user.following)}</div>
            <div className="text-[10px] text-slate-400">Following</div>
          </div>
          <div className="w-px h-6 bg-slate-800" />
          <div>
            <div className="font-extrabold text-sm text-white">{formatNum(user.followers)}</div>
            <div className="text-[10px] text-slate-400">Followers</div>
          </div>
          <div className="w-px h-6 bg-slate-800" />
          <div>
            <div className="font-extrabold text-sm text-white">{formatNum(user.totalLikes)}</div>
            <div className="text-[10px] text-slate-400">Star Likes</div>
          </div>
        </div>

        {/* Tabs Bar */}
        <div className="flex border-b border-slate-800 mb-3">
          <button
            onClick={() => setActiveTab('videos')}
            className={`flex-1 py-2.5 flex items-center justify-center gap-1.5 text-xs font-bold transition-colors cursor-pointer border-b-2 ${
              activeTab === 'videos'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Grid className="w-4 h-4" /> Shorts ({userVideos.length})
          </button>
          <button
            onClick={() => setActiveTab('likes')}
            className={`flex-1 py-2.5 flex items-center justify-center gap-1.5 text-xs font-bold transition-colors cursor-pointer border-b-2 ${
              activeTab === 'likes'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Heart className="w-4 h-4" /> Liked ({likedVideos.length})
          </button>
          <button
            onClick={() => setActiveTab('saved')}
            className={`flex-1 py-2.5 flex items-center justify-center gap-1.5 text-xs font-bold transition-colors cursor-pointer border-b-2 ${
              activeTab === 'saved'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Bookmark className="w-4 h-4" /> Saved ({bookmarkedVideos.length})
          </button>
        </div>

        {/* Video Thumbnails Grid */}
        <div className="grid grid-cols-3 gap-1.5">
          {displayGrid.map((vid) => (
            <div
              key={vid.id}
              onClick={() => onSelectVideo(vid)}
              className="relative aspect-[9/16] rounded-xl overflow-hidden bg-slate-900 border border-slate-800 group cursor-pointer"
            >
              <img src={vid.thumbnailUrl} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent p-1.5 flex flex-col justify-end">
                <span className="flex items-center gap-1 text-[10px] font-bold text-white">
                  <Play className="w-2.5 h-2.5 fill-white" />
                  {(vid.viewsCount / 1000).toFixed(0)}k
                </span>
              </div>
            </div>
          ))}
        </div>

        {displayGrid.length === 0 && (
          <div className="py-12 text-center text-slate-500 text-xs">
            No videos in this list yet.
          </div>
        )}
      </div>

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-md p-4 flex flex-col justify-center">
          <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="font-bold text-sm text-white">Edit Profile Info</h3>
            <form onSubmit={handleSaveProfile} className="space-y-3">
              <div>
                <label className="text-[11px] text-slate-400 font-medium mb-1 block">Display Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-slate-800 text-slate-100 text-xs p-2.5 rounded-xl border border-slate-700"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-400 font-medium mb-1 block">Bio</label>
                <textarea
                  rows={3}
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  className="w-full bg-slate-800 text-slate-100 text-xs p-2.5 rounded-xl border border-slate-700"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 text-xs text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-amber-500 text-xs text-black font-extrabold"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
