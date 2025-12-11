import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Animated, ActivityIndicator, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Post } from '../types/Post';
import { postRepository } from '../repositories/PostRepository';
import { useVideo } from '../context/VideoContext';
import { headerTranslateY, CustomHeader } from '../navigation/BottomTabNavigator';
import PlayIcon from '../components/icons/PlayIcon';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);

const WatchScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { getVideoTime } = useVideo();
  
  const [followingVideos, setFollowingVideos] = useState<Post[]>([]);
  const [trendingVideos, setTrendingVideos] = useState<Post[]>([]);
  const [continueWatchingVideos, setContinueWatchingVideos] = useState<Post[]>([]);
  const [historyVideos, setHistoryVideos] = useState<Post[]>([]);
  const [liveVideos, setLiveVideos] = useState<Post[]>([]);
  const [channelVideos, setChannelVideos] = useState<Post[]>([]);
  const [playlistVideos, setPlaylistVideos] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const scrollY = useRef(new Animated.Value(0)).current;
  const lastScrollY = useRef(0);

  const loadVideos = useCallback(async () => {
    setLoading(true);
    // Reset header position when loading
    Animated.timing(headerTranslateY, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start();
    const response = await postRepository.fetchPosts(20);
    const videoOnly = response.posts.filter(post => post.type === 'video');
    
    setFollowingVideos(videoOnly);
    setTrendingVideos(videoOnly);
    setContinueWatchingVideos(videoOnly);
    setHistoryVideos(videoOnly);
    setLiveVideos(videoOnly);
    setChannelVideos(videoOnly);
    setPlaylistVideos(videoOnly);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadVideos();
  }, [loadVideos]);

  const handleVideoPress = (video: Post) => {
    const currentTime = getVideoTime(video.id);
    (navigation as any).navigate('VideoPage', {
      videoPost: {
        ...video,
        currentTime,
      },
    });
  };

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    {
      useNativeDriver: true,
      listener: (event: any) => {
        const currentScrollY = event.nativeEvent.contentOffset.y;
        const diff = currentScrollY - lastScrollY.current;

        if (diff > 0 && currentScrollY > 50) {
          // Scrolling down - hide header
          Animated.timing(headerTranslateY, {
            toValue: -100,
            duration: 200,
            useNativeDriver: true,
          }).start();
        } else if (diff < 0) {
          // Scrolling up - show header
          Animated.timing(headerTranslateY, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }).start();
        }

        lastScrollY.current = currentScrollY;
      },
    }
  );

  // Renderer for horizontal video items; section determines extra overlays
  const renderHorizontalVideoItem = (item: Post, section: string) => {
    // compute progress for continue watching if available
    const currentTime = (item as any).currentTime as number | undefined;
    const duration = (item as any).duration as number | undefined;
    let progressPercent: number | null = null;
    if (typeof currentTime === 'number' && typeof duration === 'number' && duration > 0) {
      progressPercent = Math.max(0, Math.min(1, currentTime / duration));
    }

    return (
      <TouchableOpacity 
        style={styles.horizontalVideoItem} 
        onPress={() => handleVideoPress(item)}
        activeOpacity={0.9}
      >
        <View style={styles.horizontalVideoContainer}>
          <Image
            source={{ uri: item.thumbnailUrl || 'https://picsum.photos/800/450?random=' + item.id }}
            style={styles.horizontalThumbnail}
            resizeMode="cover"
          />
          <View style={styles.playIconOverlay}>
            <View style={styles.playIcon}>
              <PlayIcon color="#fff" size={24} filled={false} />
            </View>
          </View>

          {/* Runtime Badge */}
          <View style={styles.runtimeBadge}>
            <Text style={styles.runtimeText}>12:34</Text>
          </View>

          {/* Section-specific overlays */}
          {section === 'Continue Watching' && (
            <View style={styles.seekBarContainer} pointerEvents="none">
              <View style={styles.seekBarBackground} />
              <View
                style={[
                  styles.seekBarProgress,
                  // if no progress available, show a default 40%
                  { width: progressPercent !== null ? `${Math.round(progressPercent * 100)}%` : '40%' },
                ]}
              />
            </View>
          )}

          {section === 'Live' && (
            <View style={styles.liveBadge}>
              <Text style={styles.liveBadgeText}>LIVE</Text>
            </View>
          )}
        </View>
        <Text style={styles.horizontalVideoTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.horizontalVideoMeta} numberOfLines={1}>
          {item.userName} · {item.analytics} views
        </Text>
      </TouchableOpacity>
    );
  };

  const renderPlaylistItem = (item: Post) => {
    return (
      <TouchableOpacity 
        style={styles.horizontalVideoItem} 
        onPress={() => (navigation as any).navigate('SectionVideos', {
          title: item.title || 'Playlist',
          videos: playlistVideos,
        })}
        activeOpacity={0.9}
      >
        <View style={styles.horizontalVideoContainer}>
          <Image
            source={{ uri: item.thumbnailUrl || 'https://picsum.photos/800/450?random=' + item.id }}
            style={styles.horizontalThumbnail}
            resizeMode="cover"
          />
          <View style={styles.playIconOverlay}>
            <View style={styles.playIcon}>
              <PlayIcon color="#fff" size={24} filled={false} />
            </View>
          </View>
          {/* Runtime Badge */}
          <View style={styles.runtimeBadge}>
            <Text style={styles.runtimeText}>12:34</Text>
          </View>
        </View>
        <Text style={styles.horizontalVideoTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.horizontalVideoMeta} numberOfLines={1}>
          {item.userName} · {item.analytics} views
        </Text>
      </TouchableOpacity>
    );
  };

  const renderSection = (title: string, videos: Post[]) => (
    <View style={styles.sectionContainer}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <TouchableOpacity 
          style={styles.viewAllButton}
          onPress={() => (navigation as any).navigate('SectionVideos', {
            title: title,
            videos: videos,
          })}
          activeOpacity={0.7}
        >
          <Text style={styles.viewAllText}>View all</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={videos}
        renderItem={({ item }) => renderHorizontalVideoItem(item, title)}
        keyExtractor={(video) => video.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.horizontalList}
      />
    </View>
  );

  const renderPlaylistSection = (title: string, videos: Post[]) => (
    <View style={styles.sectionContainer}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <TouchableOpacity 
          style={styles.viewAllButton}
          onPress={() => (navigation as any).navigate('Playlists', {
            title: title,
            playlists: videos,
          })}
          activeOpacity={0.7}
        >
          <Text style={styles.viewAllText}>View all</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={videos}
        renderItem={({ item }) => renderPlaylistItem(item)}
        keyExtractor={(video) => video.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.horizontalList}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <CustomHeader title="Watch" />
      <AnimatedScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 64 + 16 }]}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {/* Following Section */}
        {renderSection('Following', followingVideos)}
        
        {/* Trending Section */}
        {renderSection('Trending', trendingVideos)}
        
        {/* Continue Watching Section */}
        {renderSection('Continue Watching', continueWatchingVideos)}
        
        {/* History Section */}
        {renderSection('History', historyVideos)}
        
        {/* Live Section */}
        {renderSection('Live', liveVideos)}
        
        {/* Channel Section */}
        {renderSection('Channel', channelVideos)}
        
        {/* Playlist Section */}
        {renderPlaylistSection('Playlist', playlistVideos)}
      </AnimatedScrollView>
      {loading && followingVideos.length === 0 && (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#1D9BF0" />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loaderContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  scrollContent: {
    paddingBottom: 16,
  },
  sectionContainer: {
    marginBottom: 5,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
  },
  viewAllButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  viewAllText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000',
  },
  horizontalList: {
    paddingHorizontal: 12,
  },
  horizontalVideoItem: {
    width: 200,
    marginHorizontal: 4,
  },
  horizontalVideoContainer: {
    width: 200,
    height: 112,
    backgroundColor: '#000',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 8,
    position: 'relative',
  },
  horizontalThumbnail: {
    width: '100%',
    height: '100%',
  },
  horizontalVideoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0F1419',
    marginBottom: 4,
    lineHeight: 18,
  },
  horizontalVideoMeta: {
    fontSize: 12,
    color: '#536471',
  },
  playIconOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  runtimeBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  runtimeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  // Continue Watching seek bar
  seekBarContainer: {
    position: 'absolute',
    left: 8,
    right: 8,
    bottom: 6,
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
    zIndex: 5,
  },
  seekBarBackground: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  seekBarProgress: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: '#1D9BF0',
  },
  // Live badge
  liveBadge: {
    position: 'absolute',
    left: 8,
    bottom: 8,
    backgroundColor: '#F32222',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    zIndex: 6,
  },
  liveBadgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },
});

export default WatchScreen;
