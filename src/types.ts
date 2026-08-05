export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  text: string;
  timestamp: string;
  likes: number;
  isLiked?: boolean;
}

export interface Sound {
  id: string;
  title: string;
  artist: string;
  coverUrl: string;
  duration: string;
  usageCount: number;
  audioUrl?: string;
}

export interface Creator {
  id: string;
  handle: string;
  name: string;
  avatar: string;
  isVerified: boolean;
  isFollowing?: boolean;
  bio: string;
  followers: number;
  following: number;
  totalLikes: number;
}

export interface ShortVideo {
  id: string;
  videoUrl: string;
  thumbnailUrl: string;
  creator: Creator;
  caption: string;
  hashtags: string[];
  sound: Sound;
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  viewsCount: number;
  isLiked?: boolean;
  isBookmarked?: boolean;
  createdAt: string;
  filterPreset?: string;
  aspectRatio?: string;
}

export interface NotificationItem {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'system';
  userAvatar?: string;
  userName?: string;
  actionText: string;
  timestamp: string;
  thumbnailUrl?: string;
  isRead: boolean;
}

export type ActiveTab = 'home' | 'discover' | 'upload' | 'notifications' | 'profile' | 'sounds';
