import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, Dimensions, TouchableOpacity, Image } from 'react-native';
import { useRoute, useFocusEffect } from '@react-navigation/native';
import Video from 'react-native-video';
import { Post } from '../types/Post';
import { postRepository } from '../repositories/PostRepository';
import ChatIcon from '../components/icons/ChatIcon';
import RepeatIcon from '../components/icons/RepeatIcon';
import HeartIcon from '../components/icons/HeartIcon';
import ChartIcon from '../components/icons/ChartIcon';
import { useVideo } from '../context/VideoContext';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface WatchScreenParams {
  videoPost?: Post & { currentTime?: number };
  videoIndex?: number;
}

const WatchScreen = () => {
  const route = useRoute();
  const params = route.params as WatchScreenParams | undefined;
  const { getVideoTime } = useVideo();
  
  const [videos, setVideos] = useState<Post[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isScreenFocused, setIsScreenFocused] = useState(true);
  const [seekTime, setSeekTime] = useState<number | null>(null);
  const flatListRef = useRef<FlatList>(null);
  const videoRefs = useRef<Map<string, any>>(new Map());

  useFocusEffect(
    useCallback(() => {
      setIsScreenFocused(true);
      return () => {
        setIsScreenFocused(false);
      };
    }, [])
  );

  const loadVideos = useCallback(async () => {
    const response = await postRepository.fetchPosts(20);
    const videoOnly = response.posts.filter(post => post.type === 'video');
    setVideos(videoOnly);
    
    // If navigated from a specific video, find its index and seek time
    if (params?.videoPost) {
      const index = videoOnly.findIndex(v => v.id === params.videoPost?.id);
      if (index !== -1) {
        setCurrentIndex(index);
        // Get the current playback time
        const time = params.videoPost.currentTime || getVideoTime(params.videoPost.id);
        setSeekTime(time);
        
        // Use a more reliable scroll method
        setTimeout(() => {
          if (flatListRef.current) {
            try {
              flatListRef.current.scrollToIndex({ index, animated: false });
            } catch {
              // Fallback to scrollToOffset if scrollToIndex fails
              flatListRef.current.scrollToOffset({ offset: index * SCREEN_HEIGHT, animated: false });
            }
          }
        }, 100);
      }
    }
  }, [params?.videoPost, getVideoTime]);

  const onScrollToIndexFailed = (info: any) => {
    const wait = new Promise<void>(resolve => setTimeout(() => resolve(), 100));
    wait.then(() => {
      if (flatListRef.current) {
        flatListRef.current.scrollToOffset({ offset: info.index * SCREEN_HEIGHT, animated: false });
      }
    });
  };

  useEffect(() => {
    loadVideos();
  }, [loadVideos]);

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index || 0);
    }
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  const renderVideoItem = ({ item, index }: { item: Post; index: number }) => {
    const isActive = index === currentIndex && isScreenFocused;
    const shouldSeek = isActive && seekTime !== null && item.id === params?.videoPost?.id;
    
    return (
      <View style={[styles.videoContainer, { height: SCREEN_HEIGHT }]}>
        <View style={styles.videoWrapper}>
          <Video
            ref={(ref) => {
              if (ref) {
                videoRefs.current.set(item.id, ref);
              }
            }}
            source={{ uri: item.videoUrl || '' }}
            style={styles.video}
            resizeMode="contain"
            repeat={true}
            paused={!isActive}
            muted={false}
            playInBackground={false}
            playWhenInactive={false}
            controls={true}
            ignoreSilentSwitch="ignore"
            onLoad={() => {
              if (shouldSeek) {
                const videoRef = videoRefs.current.get(item.id);
                if (videoRef && seekTime) {
                  videoRef.seek(seekTime);
                  setSeekTime(null); // Clear after seeking
                }
              }
            }}
          />
        </View>
        
        <View style={styles.infoContainer}>
          <View style={styles.userInfo}>
            <Image 
              source={{ uri: item.profileImage }} 
              style={styles.profileImage} 
            />
            <View style={styles.textInfo}>
              <Text style={styles.userName}>{item.userName}</Text>
              <Text style={styles.userId}>@{item.userId} · {item.timestamp}</Text>
            </View>
          </View>
          
          {item.title && (
            <Text style={styles.description}>{item.title}</Text>
          )}
          
          <View style={styles.actionsRow}>
            <TouchableOpacity style={styles.actionButton}>
              <ChatIcon color="#fff" size={20} />
              <Text style={styles.actionText}>{item.comments}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <RepeatIcon color="#fff" size={20} />
              <Text style={styles.actionText}>{item.reposts}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <HeartIcon color="#fff" size={20} />
              <Text style={styles.actionText}>{item.likes}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <ChartIcon color="#fff" size={20} />
              <Text style={styles.actionText}>{item.analytics}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  const keyExtractor = (item: Post) => item.id;

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={videos}
        renderItem={renderVideoItem}
        keyExtractor={keyExtractor}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        snapToInterval={SCREEN_HEIGHT}
        snapToAlignment="start"
        decelerationRate="fast"
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        onScrollToIndexFailed={onScrollToIndexFailed}
        removeClippedSubviews={true}
        initialNumToRender={1}
        maxToRenderPerBatch={2}
        windowSize={3}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  videoContainer: {
    width: '100%',
    backgroundColor: '#000',
    justifyContent: 'flex-start',
  },
  videoWrapper: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: '#000',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  infoContainer: {
    padding: 16,
    paddingTop: 20,
    backgroundColor: '#000',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  textInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 2,
  },
  userId: {
    fontSize: 13,
    color: '#aaa',
  },
  description: {
    fontSize: 15,
    lineHeight: 20,
    color: '#fff',
    marginBottom: 16,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    maxWidth: 400,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  actionText: {
    fontSize: 13,
    color: '#aaa',
    marginLeft: 4,
  },
});

export default WatchScreen;
