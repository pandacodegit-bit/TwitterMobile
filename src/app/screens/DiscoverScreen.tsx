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

type TabType = 'forYou' | 'trending' | 'news' | 'sports' | 'entertainment';

const TABS: { id: TabType; label: string }[] = [
  { id: 'forYou', label: 'For You' },
  { id: 'trending', label: 'Trending' },
  { id: 'news', label: 'News' },
  { id: 'sports', label: 'Sports' },
  { id: 'entertainment', label: 'Entertainment' },
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
  const [activeTab, setActiveTab] = useState<TabType>('forYou');
  const [switchingTab, setSwitchingTab] = useState(false);
  const scrollY = useRef(new Animated.Value(0)).current;
  const lastScrollY = useRef(0);
  const isInitialMount = useRef(true);
  const flatListRef = useRef<FlatList<Post>>(null);

  // Initial load
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      loadPosts();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadPosts = useCallback(async (isTabSwitch: boolean = false, tab?: TabType) => {
    try {
      if (isTabSwitch) {
        setSwitchingTab(true);
        // Ensure header is visible when switching tabs
        Animated.timing(headerTranslateY, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }).start();
      } else {
        setLoading(true);
      }
      const currentTab = tab || activeTab;
      console.log('Loading discover posts for tab:', currentTab);
      // In a real app, you would pass the tab to the API
      // For now, we'll use the same data but you can modify the API call based on tab
      const response = await postRepository.fetchDiscoverPosts(10);
      setPosts(response.posts);
      setHasMore(response.hasMore);
      setNextCursor(response.nextCursor);
    } catch (error) {
      console.error('Error loading discover posts:', error);
    } finally {
      if (isTabSwitch) {
        setSwitchingTab(false);
      } else {
        setLoading(false);
      }
      setInitialLoading(false);
    }
  }, [activeTab]);

  // Set first video as visible when posts load
  useEffect(() => {
    if (posts.length > 0 && !loading) {
      const firstVideo = posts.find(p => p.type === 'video');
      if (firstVideo) {
        setVisibleVideoIds(new Set([firstVideo.id]));
      }
    }
  }, [posts, loading]);

  const handleTabSwitch = useCallback((tab: TabType) => {
    if (tab === activeTab) return;
    setActiveTab(tab);
    // Scroll to top when switching tabs
    flatListRef.current?.scrollToOffset({ offset: 0, animated: false });
    // Trigger reload with tab switch flag and pass the new tab explicitly
    setTimeout(() => {
      loadPosts(true, tab);
    }, 0);
  }, [activeTab, loadPosts]);

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
        const currentScrollY = event.nativeEvent.contentOffset.y;
        const diff = currentScrollY - lastScrollY.current;

        if (diff > 5 && currentScrollY > 50) {
          // Scrolling down - hide header and tab bar
          Animated.timing(headerTranslateY, {
            toValue: -150,
            duration: 150,
            useNativeDriver: true,
          }).start();
        } else if (diff < -5) {
          // Scrolling up - show header and tab bar
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

  const renderTab = useCallback(({ item }: { item: typeof TABS[0] }) => (
    <TouchableOpacity
      style={[styles.tab, activeTab === item.id && styles.activeTab]}
      onPress={() => handleTabSwitch(item.id)}
      activeOpacity={0.7}
    >
      <Text style={[styles.tabText, activeTab === item.id && styles.activeTabText]}>
        {item.label}
      </Text>
      {activeTab === item.id && <View style={styles.tabIndicator} />}
    </TouchableOpacity>
  ), [activeTab, handleTabSwitch]);

  return (
    <View style={styles.container}>
      <CustomHeader title="Discover" />
      <Animated.View 
        style={[
          styles.tabBar,
          { 
            top: insets.top + 64,
            transform: [{ translateY: headerTranslateY }],
          }
        ]}
      >
        <FlatList
          data={TABS}
          renderItem={renderTab}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabBarContent}
        />
      </Animated.View>
      <AnimatedFlatList
        ref={flatListRef}
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
        contentContainerStyle={{ paddingTop: insets.top + 64 + 52 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors.primary}
            colors={[Colors.primary]}
            progressViewOffset={insets.top + 64 + 52}
          />
        }
        onEndReached={loadMorePosts}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
      />
      {switchingTab && (
        <View style={styles.switchingOverlay}>
          <ActivityIndicator size="large" color="#000000" />
        </View>
      )}
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
  tabBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    zIndex: 999,
    height: 52,
  },
  tabBarContent: {
    paddingHorizontal: 4,
    alignItems: 'center',
  },
  tab: {
    paddingHorizontal: 16,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  activeTab: {
    // Active tab styling handled by indicator
  },
  tabText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#536471',
  },
  activeTabText: {
    color: '#0F1419',
    fontWeight: '700',
  },
  tabIndicator: {
    position: 'absolute',
    bottom: 0,
    left: '40%',
    right: '40%',
    height: 3,
    backgroundColor: '#000000',
    borderRadius: 20,
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  switchingOverlay: {
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
