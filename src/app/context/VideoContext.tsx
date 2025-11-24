import React, { createContext, useContext, useState, ReactNode } from 'react';

interface VideoContextType {
  videoStates: Map<string, number>;
  updateVideoTime: (videoId: string, time: number) => void;
  getVideoTime: (videoId: string) => number;
}

const VideoContext = createContext<VideoContextType | undefined>(undefined);

export const VideoProvider = ({ children }: { children: ReactNode }) => {
  const [videoStates, setVideoStates] = useState<Map<string, number>>(new Map());

  const updateVideoTime = (videoId: string, time: number) => {
    setVideoStates(prev => {
      const newMap = new Map(prev);
      newMap.set(videoId, time);
      return newMap;
    });
  };

  const getVideoTime = (videoId: string): number => {
    return videoStates.get(videoId) || 0;
  };

  return (
    <VideoContext.Provider value={{ videoStates, updateVideoTime, getVideoTime }}>
      {children}
    </VideoContext.Provider>
  );
};

export const useVideo = () => {
  const context = useContext(VideoContext);
  if (!context) {
    throw new Error('useVideo must be used within VideoProvider');
  }
  return context;
};
