import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Video from 'react-native-video';
import UserSection from './UserSection';
import ActionButtons from './ActionButtons';
import { useVideo } from '../context/VideoContext';

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
  isVisible?: boolean;
}

const VideoPostCard = React.memo(({
  id,
  profileImage,
  userName,
  userId,
  timestamp,
  title,
  videoUrl,
  comments,
  reposts,
  likes,
  analytics,
  isVisible = false,
}: VideoPostCardProps) => {
  const videoRef = useRef<any>(null);
  const navigation = useNavigation();
  const { updateVideoTime } = useVideo();
  const [currentTime, setCurrentTime] = useState(0);

  const onLoad = () => {
    console.log(`Video ${id} loaded successfully, isVisible: ${isVisible}`);
  };

  const onError = (error: any) => {
    console.error(`Video ${id} error:`, error);
  };

  const onBuffer = ({ isBuffering }: any) => {
    console.log(`Video ${id} buffering: ${isBuffering}`);
  };

  const onProgress = (data: any) => {
    setCurrentTime(data.currentTime);
    updateVideoTime(id, data.currentTime);
  };

  const handleVideoPress = () => {
    console.log('Video pressed, navigating to Watch screen');
    try {
      (navigation as any).navigate('Watch', {
        videoPost: {
          id,
          type: 'video',
          profileImage,
          userName,
          userId,
          timestamp,
          title,
          videoUrl,
          comments,
          reposts,
          likes,
          analytics,
          currentTime,
        },
      });
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <UserSection
          profileImage={profileImage}
          userName={userName}
          userId={userId}
          timestamp={timestamp}
        />
      </View>
      
      {title && <Text style={styles.title}>{title}</Text>}
      
      <View style={styles.videoContainer}>
        <Video
          ref={videoRef}
          source={{ uri: videoUrl }}
          style={styles.video}
          resizeMode="cover"
          repeat={true}
          paused={!isVisible}
          muted={true}
          playInBackground={false}
          playWhenInactive={false}
          controls={false}
          ignoreSilentSwitch="ignore"
          onLoad={onLoad}
          onError={onError}
          onBuffer={onBuffer}
          onProgress={onProgress}
          progressUpdateInterval={250}
        />
        <TouchableOpacity 
          activeOpacity={1.0}
          onPress={handleVideoPress}
          style={styles.videoOverlay}
        />
      </View>
      
      <View style={styles.actions}>
        <ActionButtons
          postId={id}
          comments={comments}
          reposts={reposts}
          likes={likes}
          analytics={analytics}
        />
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#EFF3F4',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  title: {
    fontSize: 15,
    lineHeight: 20,
    color: '#0F1419',
    fontWeight: '400',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
  },
  videoContainer: {
    width: '100%',
    aspectRatio: 4 / 3,
    backgroundColor: '#000',
    position: 'relative',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  videoOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
  },
  actions: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 8,
  },
});

export default VideoPostCard;
