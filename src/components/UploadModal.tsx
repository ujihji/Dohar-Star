import React, { useState, useRef } from 'react';
import { X, Sparkles, Wand2, Music, Upload, Video, Film, AlertCircle, FileVideo, CheckCircle2 } from 'lucide-react';
import { ShortVideo, Sound, Creator } from '../types';
import { INITIAL_SOUNDS } from '../data/mockData';
import { uploadVideoToStorage, saveVideoToFirestore } from '../services/videoService';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPublish: (newVideo: ShortVideo) => void;
  currentUser: Creator;
}

export const UploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  onClose,
  onPublish,
  currentUser,
}) => {
  const [uploadType, setUploadType] = useState<'device' | 'sample'>('device');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [caption, setCaption] = useState('');
  const [hashtags, setHashtags] = useState('#DoharStar #Shorts #Bangladesh');
  const [selectedFilter, setSelectedFilter] = useState('contrast-105');
  const [selectedSound, setSelectedSound] = useState<Sound>(INITIAL_SOUNDS[0]);

  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedVideoSample, setSelectedVideoSample] = useState(
    'https://assets.mixkit.co/videos/preview/mixkit-young-woman-dancing-under-neon-lights-42918-large.mp4'
  );

  if (!isOpen) return null;

  const sampleVideos = [
    {
      name: 'Neon Vibes',
      url: 'https://assets.mixkit.co/videos/preview/mixkit-girl-in-neon-sign-1232-large.mp4',
      thumb: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=300&q=80',
    },
    {
      name: 'Dance Groove',
      url: 'https://assets.mixkit.co/videos/preview/mixkit-young-woman-dancing-under-neon-lights-42918-large.mp4',
      thumb: 'https://images.unsplash.com/photo-1545128485-c400e7702796?auto=format&fit=crop&w=300&q=80',
    },
    {
      name: 'Tech Mobile',
      url: 'https://assets.mixkit.co/videos/preview/mixkit-hands-holding-a-smartphone-with-a-green-screen-41525-large.mp4',
      thumb: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=300&q=80',
    },
    {
      name: 'River Sunset',
      url: 'https://assets.mixkit.co/videos/preview/mixkit-sunset-over-a-calm-sea-4122-large.mp4',
      thumb: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=300&q=80',
    },
  ];

  const filterPresets = [
    { id: 'contrast-105', name: 'Normal' },
    { id: 'hue-rotate-30 saturate-150', name: 'Cyberpunk' },
    { id: 'sepia contrast-125', name: 'Vintage' },
    { id: 'grayscale contrast-150', name: 'B&W Film' },
    { id: 'brightness-110 saturate-200', name: 'Warm Glow' },
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setFilePreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!caption.trim()) return;

    setIsUploading(true);
    setUploadProgress(10);

    try {
      let finalVideoUrl = selectedVideoSample;

      if (uploadType === 'device' && selectedFile) {
        // Real upload to Firebase Storage!
        finalVideoUrl = await uploadVideoToStorage(selectedFile, (progress) => {
          setUploadProgress(Math.round(progress));
        });
      } else {
        setUploadProgress(100);
      }

      const parsedTags = hashtags.split(' ').filter((tag) => tag.startsWith('#'));

      const createdVideo: ShortVideo = {
        id: 'user_vid_' + Date.now(),
        videoUrl: finalVideoUrl,
        thumbnailUrl:
          filePreviewUrl ||
          sampleVideos.find((v) => v.url === selectedVideoSample)?.thumb ||
          'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80',
        creator: currentUser,
        caption: caption.trim() + ' ' + hashtags.trim(),
        hashtags: parsedTags.length ? parsedTags : ['#DoharStar', '#Shorts'],
        sound: selectedSound,
        likesCount: 1,
        commentsCount: 0,
        sharesCount: 0,
        viewsCount: 1,
        isLiked: true,
        isBookmarked: false,
        createdAt: 'Just now',
        filterPreset: selectedFilter,
      };

      // Save record in Firestore!
      await saveVideoToFirestore(createdVideo);

      onPublish(createdVideo);
      onClose();
    } catch (err) {
      console.error('Upload error:', err);
      alert('Upload failed. Please check network connection.');
    } finally {
      setIsUploading(false);
      setUploadProgress(null);
    }
  };

  return (
    <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-md flex flex-col justify-end animate-fade-in">
      <div className="bg-slate-900 border-t border-slate-800 rounded-t-3xl h-[92%] flex flex-col shadow-2xl overflow-hidden">
        {/* Top Header */}
        <div className="px-5 py-3 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-2">
            <Film className="w-5 h-5 text-amber-400" />
            <span className="font-bold text-sm text-slate-100">Dohar Creator Studio</span>
          </div>
          <button onClick={onClose} className="p-1 rounded-full text-slate-400 hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Upload Mode Selector */}
        <div className="px-4 pt-3 flex gap-2">
          <button
            type="button"
            onClick={() => setUploadType('device')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
              uploadType === 'device' ? 'bg-amber-500 text-black shadow-xs' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Upload className="w-3.5 h-3.5" /> Upload From Phone
          </button>
          <button
            type="button"
            onClick={() => setUploadType('sample')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
              uploadType === 'sample' ? 'bg-amber-500 text-black shadow-xs' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Video className="w-3.5 h-3.5" /> Camera Samples
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 space-y-5">
          {/* Step 1: Select or Pick Video */}
          {uploadType === 'device' ? (
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Upload className="w-3.5 h-3.5 text-amber-400" /> Choose Local Video File
              </label>

              <input
                ref={fileInputRef}
                type="file"
                accept="video/*"
                onChange={handleFileChange}
                className="hidden"
              />

              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-700 hover:border-amber-400 rounded-2xl p-6 text-center bg-slate-800/50 cursor-pointer transition-colors flex flex-col items-center justify-center gap-2 group"
              >
                {selectedFile ? (
                  <div className="space-y-2">
                    <FileVideo className="w-10 h-10 text-amber-400 mx-auto" />
                    <p className="text-xs font-bold text-slate-200">{selectedFile.name}</p>
                    <p className="text-[10px] text-slate-400">
                      {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • Tap to change
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Upload className="w-6 h-6" />
                    </div>
                    <p className="text-xs font-bold text-slate-200">Tap to select video from device</p>
                    <p className="text-[10px] text-slate-500">Supports MP4, MOV, WEBM (Up to 100MB)</p>
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Video className="w-3.5 h-3.5 text-amber-400" /> Select Studio Video Sample
              </label>
              <div className="grid grid-cols-4 gap-2">
                {sampleVideos.map((s) => (
                  <button
                    type="button"
                    key={s.name}
                    onClick={() => setSelectedVideoSample(s.url)}
                    className={`relative aspect-[9/16] rounded-xl overflow-hidden border-2 cursor-pointer transition-all ${
                      selectedVideoSample === s.url
                        ? 'border-amber-400 ring-2 ring-amber-400/30 scale-95'
                        : 'border-slate-800 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={s.thumb} alt={s.name} className="w-full h-full object-cover" />
                    <span className="absolute bottom-1 left-1 right-1 text-[9px] font-bold text-white bg-black/70 px-1 py-0.5 rounded text-center truncate">
                      {s.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Video Filter Preset */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Wand2 className="w-3.5 h-3.5 text-amber-400" /> Video Filter Preset
            </label>
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
              {filterPresets.map((f) => (
                <button
                  type="button"
                  key={f.id}
                  onClick={() => setSelectedFilter(f.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors ${
                    selectedFilter === f.id
                      ? 'bg-amber-400 text-black'
                      : 'bg-slate-800 text-slate-300 border border-slate-700'
                  }`}
                >
                  {f.name}
                </button>
              ))}
            </div>
          </div>

          {/* Step 3: Sound Track */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Music className="w-3.5 h-3.5 text-amber-400" /> Select Audio Track
            </label>
            <div className="grid grid-cols-2 gap-2">
              {INITIAL_SOUNDS.map((snd) => (
                <button
                  type="button"
                  key={snd.id}
                  onClick={() => setSelectedSound(snd)}
                  className={`p-2.5 rounded-xl border flex items-center gap-2 text-left cursor-pointer transition-all ${
                    selectedSound.id === snd.id
                      ? 'bg-amber-500/10 border-amber-400 text-amber-300'
                      : 'bg-slate-800/80 border-slate-700/60 text-slate-300'
                  }`}
                >
                  <img src={snd.coverUrl} alt={snd.title} className="w-8 h-8 rounded-lg object-cover" />
                  <div className="flex-1 truncate">
                    <div className="text-xs font-bold truncate">{snd.title}</div>
                    <div className="text-[10px] text-slate-400 truncate">{snd.artist}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Step 4: Caption & Hashtags */}
          <div className="space-y-3">
            <div>
              <label className="text-xs font-bold text-slate-300 mb-1 block">Caption</label>
              <textarea
                rows={3}
                placeholder="Write a catchy caption for Dohar Star creators..."
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                className="w-full bg-slate-800 text-slate-100 text-xs p-3 rounded-xl border border-slate-700 focus:outline-none focus:border-amber-400 placeholder:text-slate-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 mb-1 block">Hashtags</label>
              <input
                type="text"
                placeholder="#DoharStar #Viral #Shorts"
                value={hashtags}
                onChange={(e) => setHashtags(e.target.value)}
                className="w-full bg-slate-800 text-slate-100 text-xs px-3 py-2 rounded-xl border border-slate-700 focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          {/* Upload Progress Bar */}
          {uploadProgress !== null && (
            <div className="space-y-1.5 bg-slate-800 p-3 rounded-xl border border-slate-700">
              <div className="flex justify-between text-xs font-bold text-amber-400">
                <span>Uploading to Firebase Storage...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-400 transition-all duration-150"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!caption.trim() || isUploading || (uploadType === 'device' && !selectedFile)}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 disabled:opacity-40 text-black font-extrabold text-sm shadow-lg hover:scale-[1.01] active:scale-95 transition-transform flex items-center justify-center gap-2 cursor-pointer"
          >
            {isUploading ? (
              <span>Publishing Video...</span>
            ) : (
              <>
                <Sparkles className="w-4 h-4 fill-black" />
                <span>Publish to Dohar Star</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
