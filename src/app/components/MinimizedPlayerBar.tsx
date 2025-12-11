import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Video from 'react-native-video';
import PlayIcon from '../components/icons/PlayIcon';
import PauseIcon from '../components/icons/PauseIcon';
import CloseIcon from '../components/icons/CloseIcon';
import { useMinimizedPlayer } from '../context/MinimizedPlayerContext';

const MinimizedPlayerBar = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const {
    minimizedVideo,
    isMinimized,
    currentPlayTime,
    videoDuration,
    paused,
    closePlayer,
    updatePlayback,
    updateDuration,
    togglePlayPause,
    videoRef,
  } = useMinimizedPlayer();

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handlePlayerTap = () => {
    if (minimizedVideo) {
      (navigation as any).navigate('VideoPage', {
        videoPost: {
          ...minimizedVideo,
          currentTime: currentPlayTime,
        },
      });
    }
  };

  if (!isMinimized || !minimizedVideo) {
    return null;
  }

  return (
    <>
      {/* Background Video - Hidden */}
      <View style={styles.hiddenVideoContainer}>
        <Video
          ref={videoRef}
          source={{ uri: minimizedVideo.videoUrl || '' }}
          style={styles.hiddenVideo}
          resizeMode="contain"
          repeat={true}
          paused={paused}
          muted={false}
          playInBackground={true}
          playWhenInactive={true}
          controls={false}
          ignoreSilentSwitch="ignore"
          onProgress={(data) => {
            updatePlayback(data.currentTime, paused);
          }}
          onLoad={(data) => {
            updateDuration(data.duration);
            if (minimizedVideo.currentTime && videoRef.current) {
              videoRef.current.seek(minimizedVideo.currentTime);
            }
          }}
        />
      </View>

      {/* Player Bar */}
      <View style={[styles.playerBar, { paddingBottom: insets.bottom }]}>
        {/* Seek Line */}
        <View style={styles.seekLineContainer}>
          <View
            style={[
              styles.seekLine,
              { width: `${videoDuration > 0 ? (currentPlayTime / videoDuration) * 100 : 0}%` },
            ]}
          />
        </View>

        {/* Player Controls */}
        <TouchableOpacity
          style={styles.playerControls}
          onPress={handlePlayerTap}
          activeOpacity={0.9}
        >
          <TouchableOpacity onPress={togglePlayPause} style={styles.playPauseButton}>
            {paused ? (
              <PlayIcon color="#fff" size={24} />
            ) : (
              <PauseIcon color="#fff" size={24} />
            )}
          </TouchableOpacity>

          <View style={styles.playerInfo}>
            <Text style={styles.playerTitle} numberOfLines={1}>
              {minimizedVideo.title}
            </Text>
            <Text style={styles.playerTime}>
              {formatTime(currentPlayTime)} / {formatTime(videoDuration)}
            </Text>
          </View>

          <TouchableOpacity
            onPress={(e) => {
              e.stopPropagation();
              closePlayer();
            }}
            style={styles.closePlayerButton}
          >
            <CloseIcon color="#fff" size={20} />
          </TouchableOpacity>
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  hiddenVideoContainer: {
    position: 'absolute',
    width: 1,
    height: 1,
    opacity: 0,
    overflow: 'hidden',
  },
  hiddenVideo: {
    width: 1,
    height: 1,
  },
  playerBar: {
    backgroundColor: '#1a1a1a',
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  seekLineContainer: {
    height: 2,
    backgroundColor: '#444',
  },
  seekLine: {
    height: '100%',
    backgroundColor: '#1D9BF0',
  },
  playerControls: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 12,
    minHeight: 56,
  },
  playPauseButton: {
    padding: 4,
  },
  playerInfo: {
    flex: 1,
  },
  playerTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 2,
  },
  playerTime: {
    fontSize: 11,
    color: '#aaa',
  },
  closePlayerButton: {
    padding: 4,
  },
});

export default MinimizedPlayerBar;
