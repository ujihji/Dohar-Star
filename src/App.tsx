import React, { useState, useEffect } from 'react';
import { AndroidFrame } from './components/AndroidFrame';
import { FeedVideoPlayer } from './components/FeedVideoPlayer';
import { CommentsDrawer } from './components/CommentsDrawer';
import { ShareModal } from './components/ShareModal';
import { ExploreView } from './components/ExploreView';
import { UploadModal } from './components/UploadModal';
import { SoundLibraryView } from './components/SoundLibraryView';
import { NotificationsView } from './components/NotificationsView';
import { ProfileView } from './components/ProfileView';
import { BottomNavBar } from './components/BottomNavBar';
import { AuthModal } from './components/AuthModal';
import { AuthProvider, useAuth } from './context/AuthContext';
import { subscribeToVideos, toggleLikeInFirestore } from './services/videoService';
import { ChevronUp, ChevronDown, User, LogIn, Sparkles } from 'lucide-react';

import {
  INITIAL_VIDEOS,
  INITIAL_SOUNDS,
  INITIAL_NOTIFICATIONS,
  INITIAL_CREATORS,
} from './data/mockData';
import { ShortVideo, ActiveTab, Creator, NotificationItem } from './types';

function AppContent() {
  const { user, profile, updateUserProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [videos, setVideos] = useState<ShortVideo[]>(INITIAL_VIDEOS);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [commentsVideo, setCommentsVideo] = useState<ShortVideo | null>(null);
  const [shareVideo, setShareVideo] = useState<ShortVideo | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Subscribe to real-time video updates from Firestore
  useEffect(() => {
    const unsubscribe = subscribeToVideos((updatedVideos) => {
      setVideos(updatedVideos);
    });
    return () => unsubscribe();
  }, []);

  const activeCreator = profile || INITIAL_CREATORS[0];

  // Toggle Like on a short video and sync to Firestore
  const handleLikeToggle = (videoId: string) => {
    const target = videos.find((v) => v.id === videoId);
    if (!target) return;

    const isLikedNow = !target.isLiked;

    setVideos((prev) =>
      prev.map((v) => {
        if (v.id === videoId) {
          return {
            ...v,
            isLiked: isLikedNow,
            likesCount: isLikedNow ? v.likesCount + 1 : v.likesCount - 1,
          };
        }
        return v;
      })
    );

    // Sync like state with Firestore
    const currentUserId = user ? user.uid : 'guest_user';
    toggleLikeInFirestore(videoId, currentUserId, isLikedNow);
  };

  // Toggle Bookmark / Save on a video
  const handleBookmarkToggle = (videoId: string) => {
    setVideos((prev) =>
      prev.map((v) => {
        if (v.id === videoId) {
          return {
            ...v,
            isBookmarked: !v.isBookmarked,
          };
        }
        return v;
      })
    );
  };

  // Toggle Follow on creator
  const handleFollowToggle = (creatorId: string) => {
    setVideos((prev) =>
      prev.map((v) => {
        if (v.creator.id === creatorId) {
          return {
            ...v,
            creator: {
              ...v.creator,
              isFollowing: !v.creator.isFollowing,
            },
          };
        }
        return v;
      })
    );
  };

  // Add Comment to video
  const handleAddComment = (videoId: string, text: string) => {
    setVideos((prev) =>
      prev.map((v) => {
        if (v.id === videoId) {
          return {
            ...v,
            commentsCount: v.commentsCount + 1,
          };
        }
        return v;
      })
    );
  };

  // Publish new Short Video from Creator Studio
  const handlePublishNewVideo = (newVideo: ShortVideo) => {
    setVideos([newVideo, ...videos]);
    setCurrentVideoIndex(0);
    setActiveTab('home');
  };

  // Switch videos in feed
  const goToNextVideo = () => {
    if (currentVideoIndex < videos.length - 1) {
      setCurrentVideoIndex((prev) => prev + 1);
    } else {
      setCurrentVideoIndex(0); // loop back
    }
  };

  const goToPrevVideo = () => {
    if (currentVideoIndex > 0) {
      setCurrentVideoIndex((prev) => prev - 1);
    }
  };

  const currentVideo = videos[currentVideoIndex] || videos[0];

  const userUploadedVideos = videos.filter((v) => v.creator.id === activeCreator.id);
  const likedVideos = videos.filter((v) => v.isLiked);
  const bookmarkedVideos = videos.filter((v) => v.isBookmarked);

  const unreadNotifsCount = notifications.filter((n) => !n.isRead).length;

  return (
    <AndroidFrame activeTabTitle={activeTab}>
      {/* Top Header Account / Auth Status Bar */}
      <div className="absolute top-2.5 right-4 z-40 flex items-center gap-2 pointer-events-auto">
        <button
          onClick={() => setIsAuthModalOpen(true)}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900/80 border border-slate-700/80 text-white backdrop-blur-md hover:bg-slate-800 transition-colors cursor-pointer text-xs font-bold shadow-md"
        >
          {user && profile ? (
            <>
              <img src={profile.avatar} alt="" className="w-4 h-4 rounded-full object-cover" />
              <span className="truncate max-w-[80px]">@{profile.handle}</span>
            </>
          ) : (
            <>
              <LogIn className="w-3.5 h-3.5 text-amber-400" />
              <span>Login</span>
            </>
          )}
        </button>
      </div>

      {/* Main Screen Content Router */}
      <div className="relative flex-1 flex flex-col overflow-hidden bg-black">
        {/* Tab 1: HOME VERTICAL VIDEO FEED */}
        {activeTab === 'home' && currentVideo && (
          <div className="relative flex-1 w-full h-full">
            <FeedVideoPlayer
              video={currentVideo}
              isActive={activeTab === 'home'}
              onLikeToggle={handleLikeToggle}
              onBookmarkToggle={handleBookmarkToggle}
              onOpenComments={(v) => setCommentsVideo(v)}
              onOpenShare={(v) => setShareVideo(v)}
              onFollowToggle={handleFollowToggle}
              onSelectCreator={() => setActiveTab('profile')}
              onSelectSound={() => setActiveTab('sounds')}
            />

            {/* Vertical Feed Navigation Controls (Arrows) */}
            <div className="absolute left-3 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-2 pointer-events-auto">
              <button
                onClick={goToPrevVideo}
                disabled={currentVideoIndex === 0}
                className="p-2 rounded-full bg-black/50 border border-white/10 text-white/80 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer backdrop-blur-md"
              >
                <ChevronUp className="w-5 h-5" />
              </button>
              <button
                onClick={goToNextVideo}
                className="p-2 rounded-full bg-black/50 border border-white/10 text-white/80 hover:text-white cursor-pointer backdrop-blur-md animate-bounce"
              >
                <ChevronDown className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: DISCOVER / SEARCH */}
        {activeTab === 'discover' && (
          <ExploreView
            videos={videos}
            onSelectVideo={(v) => {
              const idx = videos.findIndex((item) => item.id === v.id);
              if (idx !== -1) setCurrentVideoIndex(idx);
              setActiveTab('home');
            }}
          />
        )}

        {/* Tab 3: SOUNDS LIBRARY */}
        {activeTab === 'sounds' && (
          <SoundLibraryView
            sounds={INITIAL_SOUNDS}
            onUseSound={(snd) => {
              setActiveTab('upload');
            }}
          />
        )}

        {/* Tab 4: NOTIFICATIONS / INBOX */}
        {activeTab === 'notifications' && (
          <NotificationsView
            notifications={notifications}
            onMarkAllRead={() => {
              setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
            }}
          />
        )}

        {/* Tab 5: PROFILE VIEW */}
        {activeTab === 'profile' && (
          <ProfileView
            user={activeCreator}
            userVideos={userUploadedVideos}
            likedVideos={likedVideos}
            bookmarkedVideos={bookmarkedVideos}
            onSelectVideo={(v) => {
              const idx = videos.findIndex((item) => item.id === v.id);
              if (idx !== -1) setCurrentVideoIndex(idx);
              setActiveTab('home');
            }}
            onUpdateUser={(updated) => {
              updateUserProfile(updated);
            }}
            onOpenAuthModal={() => setIsAuthModalOpen(true)}
          />
        )}
      </div>

      {/* Global Modals */}
      {/* 1. Auth Login / Signup Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      {/* 2. Comments Drawer */}
      {commentsVideo && (
        <CommentsDrawer
          video={commentsVideo}
          isOpen={!!commentsVideo}
          onClose={() => setCommentsVideo(null)}
          onAddComment={handleAddComment}
        />
      )}

      {/* 3. Share Sheet Modal */}
      {shareVideo && (
        <ShareModal
          video={shareVideo}
          isOpen={!!shareVideo}
          onClose={() => setShareVideo(null)}
        />
      )}

      {/* 4. Upload Studio Modal */}
      <UploadModal
        isOpen={activeTab === 'upload'}
        onClose={() => setActiveTab('home')}
        onPublish={handlePublishNewVideo}
        currentUser={activeCreator}
      />

      {/* Bottom Android Navigation Bar */}
      <BottomNavBar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        unreadCount={unreadNotifsCount}
      />
    </AndroidFrame>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
