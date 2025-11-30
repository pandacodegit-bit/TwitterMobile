import React, { useCallback, useEffect, useState, useRef } from 'react';
import { FlatList, StyleSheet, View, ActivityIndicator, RefreshControl, Animated, TouchableOpacity, Text } from 'react-native';
import TextPostCard from '../components/TextPostCard';
import ImagePostCard from '../components/ImagePostCard';
import VideoPostCard from '../components/VideoPostCard';
import { Post } from '../types/Post';
import { postRepository } from '../repositories/PostRepository';
import { Colors } from '../style/colors';
import { headerTranslateY, CustomHeader } from '../navigation/BottomTabNavigator';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList<Post>);

type Category = {
  id: string;
  label: string;
};

const CATEGORIES: Category[] = [
  { id: 'trending', label: 'Trending' },
  { id: 'foryou', label: 'For You' },
  { id: 'technology', label: 'Technology' },
  { id: 'sports', label: 'Sports' },
  { id: 'entertainment', label: 'Entertainment' },
  { id: 'news', label: 'News' },
  { id: 'gaming', label: 'Gaming' },
  { id: 'music', label: 'Music' },
];

const DiscoverScreen = () => {
  const insets = useSafeAreaInsets();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [nextCursor, setNextCursor] = useState<string | undefined>();
  const [visibleVideoIds, setVisibleVideoIds] = useState<Set<string>>(new Set());
  const [selectedCategory, setSelectedCategory] = useState<string>('trending');
  const scrollY = useRef(new Animated.Value(0)).current;
  const lastScrollY = useRef(0);

  // Initial load
  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async (category?: string) => {
    try {
      setLoading(true);
      // Ensure header is visible when loading
      Animated.timing(headerTranslateY, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }).start();
      // In a real app, you would pass the category to the API
      // For now, we'll use the same data but you can modify the API call
      const response = await postRepository.fetchDiscoverPosts(10);
      setPosts(response.posts);
      setHasMore(response.hasMore);
      setNextCursor(response.nextCursor);
    } catch (error) {
      console.error('Error loading discover posts:', error);
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  };

  const handleCategoryChange = (categoryId: string) => {
    if (categoryId === selectedCategory) return;
    setSelectedCategory(categoryId);
    loadPosts(categoryId);
  };

  const onRefresh = async () => {
    try {
      setRefreshing(true);
      const response = await postRepository.fetchDiscoverPosts(10);
      setPosts(response.posts);
      setHasMore(response.hasMore);
      setNextCursor(response.nextCursor);
    } catch (error) {
      console.error('Error refreshing discover posts:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const loadMorePosts = async () => {
    if (loadingMore || !hasMore) return;

    try {
      setLoadingMore(true);
      const response = await postRepository.fetchDiscoverPosts(10, nextCursor);
      setPosts(prevPosts => [...prevPosts, ...response.posts]);
      setHasMore(response.hasMore);
      setNextCursor(response.nextCursor);
    } catch (error) {
      console.error('Error loading more discover posts:', error);
    } finally {
      setLoadingMore(false);
    }
  };

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    {
      useNativeDriver: true,
      listener: (event: any) => {
        // Don't hide header while loading
        if (loading) return;

        const currentScrollY = event.nativeEvent.contentOffset.y;
        const diff = currentScrollY - lastScrollY.current;

        if (diff > 5 && currentScrollY > 50) {
          // Scrolling down - hide header
          Animated.timing(headerTranslateY, {
            toValue: -100,
            duration: 150,
            useNativeDriver: true,
          }).start();
        } else if (diff < -5) {
          // Scrolling up - show header
          Animated.timing(headerTranslateY, {
            toValue: 0,
            duration: 150,
            useNativeDriver: true,
          }).start();
        }

        lastScrollY.current = currentScrollY;
      },
    }
  );

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    const visibleIds = new Set<string>();
    viewableItems.forEach((item: any) => {
      if (item.isViewable && item.item.type === 'video') {
        visibleIds.add(item.item.id);
      }
    });
    setVisibleVideoIds(visibleIds);
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  const renderPost = useCallback(({ item }: { item: Post }) => {
    switch (item.type) {
      case 'text':
        return (
          <TextPostCard
            id={item.id}
            profileImage={item.profileImage}
            userName={item.userName}
            userId={item.userId}
            timestamp={item.timestamp}
            title={item.title}
            text={item.text || ''}
            comments={item.comments}
            reposts={item.reposts}
            likes={item.likes}
            analytics={item.analytics}
          />
        );
      case 'image':
        return (
          <ImagePostCard
            id={item.id}
            profileImage={item.profileImage}
            userName={item.userName}
            userId={item.userId}
            timestamp={item.timestamp}
            title={item.title}
            text={item.text}
            imageUrl={item.imageUrl || ''}
            comments={item.comments}
            reposts={item.reposts}
            likes={item.likes}
            analytics={item.analytics}
          />
        );
      case 'video':
        return (
          <VideoPostCard
            id={item.id}
            profileImage={item.profileImage}
            userName={item.userName}
            userId={item.userId}
            timestamp={item.timestamp}
            title={item.title}
            text={item.text}
            videoUrl={item.videoUrl || ''}
            thumbnailUrl={item.thumbnailUrl}
            comments={item.comments}
            reposts={item.reposts}
            likes={item.likes}
            analytics={item.analytics}
            isVisible={visibleVideoIds.has(item.id)}
          />
        );
      default:
        return null;
    }
  }, [visibleVideoIds]);

  const keyExtractor = useCallback((item: Post) => item.id, []);

  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color="#1DA1F2" />
      </View>
    );
  };

  const renderCategoryChip = ({ item }: { item: Category }) => (
    <TouchableOpacity
      style={[
        styles.chip,
        selectedCategory === item.id && styles.chipSelected,
      ]}
      onPress={() => handleCategoryChange(item.id)}
      activeOpacity={0.7}
    >
      <Text
        style={[
          styles.chipText,
          selectedCategory === item.id && styles.chipTextSelected,
        ]}
      >
        {item.label}
      </Text>
    </TouchableOpacity>
  );

  const renderListHeader = () => (
    <View style={styles.chipsContainer}>
      <FlatList
        data={CATEGORIES}
        renderItem={renderCategoryChip}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipsList}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <CustomHeader title="Discover" />
      <AnimatedFlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={keyExtractor}
        removeClippedSubviews={false}
        maxToRenderPerBatch={3}
        updateCellsBatchingPeriod={50}
        initialNumToRender={2}
        windowSize={3}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingTop: insets.top + 64 }}
        ListHeaderComponent={renderListHeader}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors.primary}
            colors={[Colors.primary]}
            progressViewOffset={insets.top + 64}
          />
        }
        onEndReached={loadMorePosts}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
      />
      {(loading && initialLoading) && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#000000" />
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
  chipsContainer: {
    backgroundColor: '#fff',
    paddingVertical: 8,
  },
  chipsList: {
    paddingHorizontal: 12,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#000000',
    marginHorizontal: 4,
  },
  chipSelected: {
    backgroundColor: '#000000',
    borderColor: '#000000',
  },
  chipText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
  },
  chipTextSelected: {
    color: '#FFFFFF',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 998,
  },
});

export default DiscoverScreen;
