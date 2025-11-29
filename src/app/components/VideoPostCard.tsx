import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Video from 'react-native-video';
import ActionButtons from './ActionButtons';
import { useVideo } from '../context/VideoContext';

interface VideoPostCardProps {
  id: string;
  profileImage: string;
  userName: string;
  userId: string;
  timestamp?: string;
  title?: string;
  text?: string;
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
  text,
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
    console.log('Video pressed, navigating to VideoPage');
    try {
      (navigation as any).navigate('VideoPage', {
        videoPost: {
          id,
          type: 'video',
          profileImage,
          userName,
          userId,
          timestamp,
          title,
          text,
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
      <View style={styles.contentRow}>
        <Image source={{ uri: profileImage }} style={styles.profileImage} />
        
        <View style={styles.contentColumn}>

            <View style={styles.headerRow}>
            <Text style={styles.userName}>{userName}</Text>
            <Text style={styles.userId}> @{userId}</Text>
            {timestamp && (
              <>
                <Text style={styles.dot}>· </Text>
                <Text style={styles.timestamp}>{timestamp}</Text>
              </>
            )}
          </View>

          {title && <Text 
          numberOfLines={1}
          style={styles.title}
          >{title}</Text>}
          
          {/* <View style={styles.headerRow}>
            <Text style={styles.userName}>{userName}</Text>
            <Text style={styles.userId}>@{userId}</Text>
            {timestamp && (
              <>
                <Text style={styles.dot}>·</Text>
                <Text style={styles.timestamp}>{timestamp}</Text>
              </>
            )}
          </View> */}
          
          {/* {text && <Text style={styles.description}>{text}</Text>} */}
          
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
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#EFF3F4',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  contentRow: {
    flexDirection: 'row',
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 4,
    backgroundColor: '#E1E8ED',
    marginRight: 12,
  },
  contentColumn: {
    flex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0F1419',
    marginBottom: 4,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    flexWrap: 'wrap',
  },
  userName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000000',
    marginRight: 4,
    
  },
  userId: {
    fontSize: 16,
    color: '#536471',
    fontWeight: '400',
    marginRight: 4,
  },
  dot: {
    fontSize: 16,
    color: '#536471',
    marginHorizontal: 4,
    fontWeight: '400',
  },
  timestamp: {
    fontSize: 16,
    color: '#536471',
    fontWeight: '400',
  },
  description: {
    fontSize: 15,
    lineHeight: 20,
    color: '#0F1419',
    fontWeight: '400',
    marginBottom: 12,
  },
  videoContainer: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: '#000',
    position: 'relative',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 0,
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
    marginTop: 0,
  },
});

export default VideoPostCard;
