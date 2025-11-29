import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Animated, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Post } from '../types/Post';
import { postRepository } from '../repositories/PostRepository';
import { useVideo } from '../context/VideoContext';
import { headerTranslateY, CustomHeader } from '../navigation/BottomTabNavigator';
import PlayIcon from '../components/icons/PlayIcon';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface Section {
  id: string;
  title: string;
  data: Post[];
}

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList<Section | Post>);

const WatchScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { getVideoTime } = useVideo();
  
  const [sections, setSections] = useState<Section[]>([]);
  const [regularVideos, setRegularVideos] = useState<Post[]>([]);
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
    
    // Reuse same videos for all sections and regular videos
    const sectionsToShow = [
      { id: 'trending', title: 'Trending', data: videoOnly },
      { id: 'continue', title: 'Continue Watching', data: videoOnly },
      { id: 'following', title: 'Following', data: videoOnly },
      { id: 'history', title: 'History', data: videoOnly },
      { id: 'playlist', title: 'Playlist', data: videoOnly },
    ];
    
    setSections(sectionsToShow);
    setRegularVideos(videoOnly);
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

  const renderHorizontalVideoItem = ({ item }: { item: Post }) => (
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
      </View>
      <Text style={styles.horizontalVideoTitle} numberOfLines={2}>
        {item.title}
      </Text>
      <Text style={styles.horizontalVideoMeta} numberOfLines={1}>
        {item.userName} · {item.analytics} views
      </Text>
    </TouchableOpacity>
  );

  const renderVerticalVideoItem = ({ item }: { item: Post }) => (
    <TouchableOpacity 
      style={styles.videoItem} 
      onPress={() => handleVideoPress(item)}
      activeOpacity={0.9}
    >
      <View style={styles.videoContainer}>
        <Image
          source={{ uri: item.thumbnailUrl || 'https://picsum.photos/800/450?random=' + item.id }}
          style={styles.videoThumbnail}
          resizeMode="contain"
        />
        <View style={styles.playIconOverlay}>
          <View style={styles.playIcon}>
            <PlayIcon color="#fff" size={32} filled={false} />
          </View>
        </View>
      </View>
      
      <View style={styles.videoInfoRow}>
        <Image 
          source={{ uri: item.profileImage }} 
          style={styles.profileImage} 
        />
        <View style={styles.videoInfo}>
          {item.title && (
            <Text style={styles.videoTitle} numberOfLines={2}>
              {item.title}
            </Text>
          )}
          <View style={styles.metaRow}>
            <Text style={styles.userName}>{item.userName}</Text>
            <Text style={styles.dot}>·</Text>
            <Text style={styles.analytics}>{item.analytics} views</Text>
            {item.timestamp && (
              <>
                <Text style={styles.dot}>·</Text>
                <Text style={styles.timestamp}>{item.timestamp}</Text>
              </>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderSectionRow = ({ item }: { item: Section }) => (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>{item.title}</Text>
      <FlatList
        data={item.data}
        renderItem={renderHorizontalVideoItem}
        keyExtractor={(video) => video.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.horizontalList}
      />
    </View>
  );

  const renderMainItem = ({ item }: { item: Section | Post }) => {
    if ('title' in item && 'data' in item) {
      // It's a section
      return renderSectionRow({ item: item as Section });
    } else {
      // It's a regular video
      return renderVerticalVideoItem({ item: item as Post });
    }
  };

  const mainData = [...sections, ...regularVideos];
  const keyExtractor = (item: Section | Post) => {
    if ('data' in item) {
      return (item as Section).id;
    }
    return (item as Post).id;
  };

  return (
    <View style={styles.container}>
      <CustomHeader title="Watch" />
      <AnimatedFlatList
        data={mainData}
        renderItem={renderMainItem}
        keyExtractor={keyExtractor}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.listContent, { paddingTop: insets.top + 64 + 16 }]}
        refreshing={loading}
        onRefresh={loadVideos}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      />
      {loading && mainData.length === 0 && (
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
  listContent: {
    paddingBottom: 16,
  },
  sectionContainer: {
    marginBottom: 5,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0F1419',
    paddingHorizontal: 16,
    marginBottom: 12,
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
  videoItem: {
    marginBottom: 10,
    paddingBottom: 16,
  },
  videoContainer: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: '#000',
    position: 'relative',
  },
  videoThumbnail: {
    width: '100%',
    height: '100%',
    backgroundColor: '#000',
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
  videoInfoRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 4,
    backgroundColor: '#E1E8ED',
    marginRight: 12,
  },
  videoInfo: {
    flex: 1,
  },
  videoTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F1419',
    marginBottom: 6,
    lineHeight: 20,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  userName: {
    fontSize: 13,
    fontWeight: '400',
    color: '#536471',
    marginRight: 4,
  },
  analytics: {
    fontSize: 13,
    color: '#536471',
    marginRight: 4,
  },
  dot: {
    fontSize: 13,
    color: '#536471',
    marginHorizontal: 4,
  },
  timestamp: {
    fontSize: 13,
    color: '#536471',
  },
});

export default WatchScreen;
