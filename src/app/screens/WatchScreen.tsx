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

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList<Section>);

const WatchScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { getVideoTime } = useVideo();
  
  const [sections, setSections] = useState<Section[]>([]);
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

  const renderSectionRow = ({ item }: { item: Section }) => (
    <View style={styles.sectionContainer}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{item.title}</Text>
        <TouchableOpacity 
          style={styles.viewAllButton}
          onPress={() => (navigation as any).navigate('SectionVideos', {
            title: item.title,
            videos: item.data,
          })}
          activeOpacity={0.7}
        >
          <Text style={styles.viewAllText}>View all</Text>
        </TouchableOpacity>
      </View>
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

  const renderMainItem = ({ item }: { item: Section }) => {
    return renderSectionRow({ item });
  };

  const keyExtractor = (item: Section) => item.id;

  return (
    <View style={styles.container}>
      <CustomHeader title="Watch" />
      <AnimatedFlatList
        data={sections}
        renderItem={renderMainItem}
        keyExtractor={keyExtractor}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.listContent, { paddingTop: insets.top + 64 + 16 }]}
        refreshing={loading}
        onRefresh={loadVideos}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      />
      {loading && sections.length === 0 && (
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
});

export default WatchScreen;
