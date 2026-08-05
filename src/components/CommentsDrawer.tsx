import React, { useState } from 'react';
import { X, Heart, Send, Sparkles, MessageCircle } from 'lucide-react';
import { Comment, ShortVideo } from '../types';

interface CommentsDrawerProps {
  video: ShortVideo;
  isOpen: boolean;
  onClose: () => void;
  onAddComment: (videoId: string, text: string) => void;
}

export const CommentsDrawer: React.FC<CommentsDrawerProps> = ({
  video,
  isOpen,
  onClose,
  onAddComment,
}) => {
  const [newCommentText, setNewCommentText] = useState('');
  const [commentsList, setCommentsList] = useState<Comment[]>([
    {
      id: 'c1',
      userId: 'u1',
      userName: 'Sabbir Hossain',
      userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
      text: 'Super high quality video! Dohar Star is fire 🔥✨',
      timestamp: '12m ago',
      likes: 42,
    },
    {
      id: 'c2',
      userId: 'u2',
      userName: 'Nusrat Jahan',
      userAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=120&q=80',
      text: 'Love the audio beat! Which app did you edit with? 🎵',
      timestamp: '45m ago',
      likes: 19,
    },
    {
      id: 'c3',
      userId: 'u3',
      userName: 'Fahim BD Tech',
      userAvatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&w=120&q=80',
      text: 'Subscribed to @' + video.creator.handle + '! Proud of our local creators 🇧🇩',
      timestamp: '2h ago',
      likes: 87,
    },
  ]);

  if (!isOpen) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    const created: Comment = {
      id: 'c_' + Date.now(),
      userId: 'my_user',
      userName: 'You (Dohar Creator)',
      userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
      text: newCommentText.trim(),
      timestamp: 'Just now',
      likes: 1,
      isLiked: true,
    };

    setCommentsList([created, ...commentsList]);
    onAddComment(video.id, newCommentText.trim());
    setNewCommentText('');
  };

  const toggleCommentLike = (id: string) => {
    setCommentsList((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const isLikedNow = !c.isLiked;
          return {
            ...c,
            isLiked: isLikedNow,
            likes: isLikedNow ? c.likes + 1 : c.likes - 1,
          };
        }
        return c;
      })
    );
  };

  const quickEmojis = ['🔥', '❤️', '👏', '😍', '🇧🇩', '💯'];

  return (
    <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-xs flex flex-col justify-end animate-fade-in">
      {/* Click outside backdrop */}
      <div className="flex-1" onClick={onClose} />

      {/* Drawer Container */}
      <div className="bg-slate-900 border-t border-slate-800 rounded-t-3xl max-h-[75%] flex flex-col shadow-2xl animate-slide-up">
        {/* Header Handle */}
        <div className="w-12 h-1.5 bg-slate-700 rounded-full mx-auto my-2.5 opacity-60" />

        <div className="px-5 pb-3 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-4 h-4 text-amber-400" />
            <span className="font-semibold text-sm text-slate-100">
              Comments ({commentsList.length + video.commentsCount})
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Comments Scroll View */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[380px]">
          {commentsList.map((c) => (
            <div key={c.id} className="flex items-start gap-3 text-xs">
              <img
                src={c.userAvatar}
                alt={c.userName}
                className="w-8 h-8 rounded-full object-cover border border-slate-700"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-200">{c.userName}</span>
                  <span className="text-[10px] text-slate-500">{c.timestamp}</span>
                </div>
                <p className="text-slate-300 mt-0.5 leading-snug">{c.text}</p>
              </div>
              <button
                onClick={() => toggleCommentLike(c.id)}
                className="flex flex-col items-center gap-0.5 text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
              >
                <Heart
                  className={`w-3.5 h-3.5 ${
                    c.isLiked ? 'fill-red-500 text-red-500' : ''
                  }`}
                />
                <span className="text-[10px]">{c.likes}</span>
              </button>
            </div>
          ))}
        </div>

        {/* Quick Emoji Bar */}
        <div className="px-4 py-1.5 bg-slate-950/80 border-t border-slate-800/80 flex items-center justify-around">
          {quickEmojis.map((emoji) => (
            <button
              key={emoji}
              onClick={() => setNewCommentText((prev) => prev + emoji)}
              className="text-base hover:scale-125 transition-transform p-1 cursor-pointer"
            >
              {emoji}
            </button>
          ))}
        </div>

        {/* Comment Input Form */}
        <form onSubmit={handleSend} className="p-3 border-t border-slate-800 bg-slate-900 flex items-center gap-2">
          <input
            type="text"
            placeholder="Add a comment for Dohar Star..."
            value={newCommentText}
            onChange={(e) => setNewCommentText(e.target.value)}
            className="flex-1 bg-slate-800/90 text-slate-100 text-xs px-3.5 py-2.5 rounded-full border border-slate-700 focus:outline-none focus:border-amber-400 placeholder:text-slate-500"
          />
          <button
            type="submit"
            disabled={!newCommentText.trim()}
            className="p-2.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 disabled:opacity-40 text-black font-bold transition-transform active:scale-95 cursor-pointer shadow-md"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
