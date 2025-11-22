import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import UserSection from './UserSection';
import ActionButtons from './ActionButtons';
import PlayIcon from './icons/PlayIcon';

interface VideoPostCardProps {
  id: string;
  profileImage: string;
  userName: string;
  userId: string;
  timestamp?: string;
  title?: string;
  videoUrl: string;
  thumbnailUrl?: string;
  comments?: number;
  reposts?: number;
  likes?: number;
  analytics?: number;
}

const VideoPostCard = React.memo(({
  id,
  profileImage,
  userName,
  userId,
  timestamp,
  title,
  videoUrl,
  thumbnailUrl,
  comments,
  reposts,
  likes,
  analytics,
}: VideoPostCardProps) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    // Video playback logic will be added here
    console.log('Play/Pause video:', videoUrl);
  };

  return (
    <View style={styles.container}>
      <UserSection
        profileImage={profileImage}
        userName={userName}
        userId={userId}
        timestamp={timestamp}
      />
      
      {title && <Text style={styles.title}>{title}</Text>}
      
      <TouchableOpacity style={styles.videoContainer} onPress={handlePlayPause}>
        {thumbnailUrl && (
          <Image
            source={{ uri: thumbnailUrl }}
            style={styles.thumbnail}
            resizeMode="cover"
          />
        )}
        <View style={styles.playButton}>
          <PlayIcon color="#000" size={32} />
        </View>
      </TouchableOpacity>
      
      <ActionButtons
        postId={id}
        comments={comments}
        reposts={reposts}
        likes={likes}
        analytics={analytics}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EFF3F4',
  },
  title: {
    fontSize: 15,
    lineHeight: 20,
    color: '#0F1419',
    marginBottom: 12,
  },
  videoContainer: {
    width: '100%',
    height: 300,
    borderRadius: 16,
    backgroundColor: '#000',
    marginBottom: 8,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  playButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default VideoPostCard;
