import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, StyleSheet, View, ActivityIndicator, RefreshControl } from 'react-native';
import TextPostCard from '../components/TextPostCard';
import ImagePostCard from '../components/ImagePostCard';
import VideoPostCard from '../components/VideoPostCard';
import { Post } from '../types/Post';
import { postRepository } from '../repositories/PostRepository';
import { Colors } from '../style/colors';

const DiscoverScreen = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [nextCursor, setNextCursor] = useState<string | undefined>();

  // Initial load
  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const response = await postRepository.fetchDiscoverPosts(10);
      setPosts(response.posts);
      setHasMore(response.hasMore);
      setNextCursor(response.nextCursor);
    } catch (error) {
      console.error('Error loading discover posts:', error);
    } finally {
      setLoading(false);
    }
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
            videoUrl={item.videoUrl || ''}
            thumbnailUrl={item.thumbnailUrl}
            comments={item.comments}
            reposts={item.reposts}
            likes={item.likes}
            analytics={item.analytics}
          />
        );
      default:
        return null;
    }
  }, []);

  const keyExtractor = useCallback((item: Post) => item.id, []);

  const getItemLayout = useCallback(
    (_: any, index: number) => ({
      length: 400,
      offset: 400 * index,
      index,
    }),
    []
  );

  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color="#1DA1F2" />
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1DA1F2" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={keyExtractor}
        getItemLayout={getItemLayout}
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        updateCellsBatchingPeriod={50}
        initialNumToRender={5}
        windowSize={10}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors.primary}
            colors={[Colors.primary]}
          />
        }
        onEndReached={loadMorePosts}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: 'center',
  },
});

export default DiscoverScreen;
