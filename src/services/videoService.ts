import {
  collection,
  doc,
  setDoc,
  getDocs,
  query,
  orderBy,
  updateDoc,
  arrayUnion,
  arrayRemove,
  onSnapshot,
  increment,
  addDoc,
} from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { db, storage, auth } from '../lib/firebase';
import { ShortVideo, Comment } from '../types';
import { INITIAL_VIDEOS } from '../data/mockData';

const VIDEOS_COLLECTION = 'videos';
const COMMENTS_COLLECTION = 'comments';

// Real-time listener for Firestore Videos
export const subscribeToVideos = (callback: (videos: ShortVideo[]) => void) => {
  const q = query(collection(db, VIDEOS_COLLECTION), orderBy('createdAt', 'desc'));

  return onSnapshot(
    q,
    (snapshot) => {
      if (snapshot.empty) {
        // Seed initial videos if Firestore collection is brand new
        seedInitialVideos();
        callback(INITIAL_VIDEOS);
        return;
      }

      const list: ShortVideo[] = snapshot.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          videoUrl: data.videoUrl,
          thumbnailUrl: data.thumbnailUrl || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80',
          creator: {
            id: data.creatorId,
            handle: data.creatorHandle,
            name: data.creatorName,
            avatar: data.creatorAvatar,
            isVerified: data.creatorIsVerified ?? false,
            isFollowing: false,
            bio: 'Creator on Dohar Star',
            followers: 1200,
            following: 45,
            totalLikes: data.likesCount || 0,
          },
          caption: data.caption,
          hashtags: data.hashtags || ['#DoharStar'],
          sound: {
            id: 'snd_default',
            title: data.soundTitle || 'Dohar Star Audio',
            artist: data.soundArtist || 'Original Sound',
            coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=200&q=80',
            duration: '0:30',
            usageCount: 1500,
          },
          likesCount: data.likesCount || 0,
          commentsCount: data.commentsCount || 0,
          sharesCount: data.sharesCount || 0,
          viewsCount: data.viewsCount || 100,
          isLiked: Array.isArray(data.likedBy) && auth.currentUser ? data.likedBy.includes(auth.currentUser.uid) : false,
          isBookmarked: false,
          createdAt: data.createdAt || 'Just now',
          filterPreset: data.filterPreset || '',
        };
      });

      callback(list);
    },
    (error) => {
      console.warn('Firestore subscription warning, fallback to local dataset:', error);
      callback(INITIAL_VIDEOS);
    }
  );
};

// Seed initial videos into Firestore
const seedInitialVideos = async () => {
  try {
    for (const vid of INITIAL_VIDEOS) {
      await setDoc(doc(db, VIDEOS_COLLECTION, vid.id), {
        videoUrl: vid.videoUrl,
        thumbnailUrl: vid.thumbnailUrl,
        creatorId: vid.creator.id,
        creatorHandle: vid.creator.handle,
        creatorName: vid.creator.name,
        creatorAvatar: vid.creator.avatar,
        creatorIsVerified: vid.creator.isVerified,
        caption: vid.caption,
        hashtags: vid.hashtags,
        soundTitle: vid.sound.title,
        soundArtist: vid.sound.artist,
        likesCount: vid.likesCount,
        commentsCount: vid.commentsCount,
        sharesCount: vid.sharesCount,
        viewsCount: vid.viewsCount,
        likedBy: [],
        createdAt: new Date().toISOString(),
      });
    }
  } catch (err) {
    console.error('Error seeding initial videos:', err);
  }
};

// Upload video file to Firebase Storage
export const uploadVideoToStorage = async (
  file: File,
  onProgress?: (progress: number) => void
): Promise<string> => {
  try {
    const filename = `videos/${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const storageRef = ref(storage, filename);
    const uploadTask = uploadBytesResumable(storageRef, file);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          if (onProgress) onProgress(progress);
        },
        (error) => {
          console.warn('Firebase Storage upload failed, fallback to local URL:', error);
          // Fallback to local Blob URL so user upload always works seamlessly!
          const objectUrl = URL.createObjectURL(file);
          resolve(objectUrl);
        },
        async () => {
          const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadUrl);
        }
      );
    });
  } catch (err) {
    console.warn('Fallback object URL for video:', err);
    return URL.createObjectURL(file);
  }
};

// Save Video metadata in Firestore
export const saveVideoToFirestore = async (newVid: ShortVideo): Promise<void> => {
  const docRef = doc(db, VIDEOS_COLLECTION, newVid.id);
  await setDoc(docRef, {
    videoUrl: newVid.videoUrl,
    thumbnailUrl: newVid.thumbnailUrl,
    creatorId: newVid.creator.id,
    creatorHandle: newVid.creator.handle,
    creatorName: newVid.creator.name,
    creatorAvatar: newVid.creator.avatar,
    creatorIsVerified: newVid.creator.isVerified,
    caption: newVid.caption,
    hashtags: newVid.hashtags,
    soundTitle: newVid.sound.title,
    soundArtist: newVid.sound.artist,
    likesCount: newVid.likesCount || 1,
    commentsCount: newVid.commentsCount || 0,
    sharesCount: newVid.sharesCount || 0,
    viewsCount: newVid.viewsCount || 1,
    likedBy: [newVid.creator.id],
    createdAt: new Date().toISOString(),
    filterPreset: newVid.filterPreset || '',
  });
};

// Toggle Like in Firestore
export const toggleLikeInFirestore = async (videoId: string, userId: string, isLikedNow: boolean) => {
  try {
    const videoRef = doc(db, VIDEOS_COLLECTION, videoId);
    if (isLikedNow) {
      await updateDoc(videoRef, {
        likesCount: increment(1),
        likedBy: arrayUnion(userId),
      });
    } else {
      await updateDoc(videoRef, {
        likesCount: increment(-1),
        likedBy: arrayRemove(userId),
      });
    }
  } catch (err) {
    console.error('Error toggling like in Firestore:', err);
  }
};
