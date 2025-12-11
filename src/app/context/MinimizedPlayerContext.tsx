import React, { createContext, useContext, useState, useRef } from 'react';
import { Post } from '../types/Post';

interface MinimizedPlayerContextType {
  minimizedVideo: (Post & { currentTime?: number }) | null;
  isMinimized: boolean;
  currentPlayTime: number;
  videoDuration: number;
  paused: boolean;
  minimizeVideo: (video: Post & { currentTime?: number }, currentTime: number, duration: number, isPaused: boolean) => void;
  closePlayer: () => void;
  updatePlayback: (currentTime: number, isPaused: boolean) => void;
  updateDuration: (duration: number) => void;
  togglePlayPause: () => void;
  videoRef: React.MutableRefObject<any>;
}

const MinimizedPlayerContext = createContext<MinimizedPlayerContextType | undefined>(undefined);

export const MinimizedPlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [minimizedVideo, setMinimizedVideo] = useState<(Post & { currentTime?: number }) | null>(null);
  const [isMinimized, setIsMinimized] = useState(false);
  const [currentPlayTime, setCurrentPlayTime] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);
  const [paused, setPaused] = useState(false);
  const videoRef = useRef<any>(null);

  const minimizeVideo = (video: Post & { currentTime?: number }, currentTime: number, duration: number, isPaused: boolean) => {
    setMinimizedVideo(video);
    setIsMinimized(true);
    setCurrentPlayTime(currentTime);
    setVideoDuration(duration);
    setPaused(isPaused);
  };

  const closePlayer = () => {
    setIsMinimized(false);
    setMinimizedVideo(null);
    setCurrentPlayTime(0);
    setVideoDuration(0);
    setPaused(true);
  };

  const updatePlayback = (currentTime: number, isPaused: boolean) => {
    setCurrentPlayTime(currentTime);
    setPaused(isPaused);
  };

  const updateDuration = (duration: number) => {
    setVideoDuration(duration);
  };

  const togglePlayPause = () => {
    setPaused(!paused);
  };

  return (
    <MinimizedPlayerContext.Provider
      value={{
        minimizedVideo,
        isMinimized,
        currentPlayTime,
        videoDuration,
        paused,
        minimizeVideo,
        closePlayer,
        updatePlayback,
        updateDuration,
        togglePlayPause,
        videoRef,
      }}
    >
      {children}
    </MinimizedPlayerContext.Provider>
  );
};

export const useMinimizedPlayer = () => {
  const context = useContext(MinimizedPlayerContext);
  if (context === undefined) {
    throw new Error('useMinimizedPlayer must be used within a MinimizedPlayerProvider');
  }
  return context;
};
