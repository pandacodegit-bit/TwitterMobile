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

const HomeScreen = () => {
    const insets = useSafeAreaInsets();
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [nextCursor, setNextCursor] = useState<string | undefined>();
    const [activeTab, setActiveTab] = useState<'forYou' | 'following'>('forYou');
    const [switchingTab, setSwitchingTab] = useState(false);
    const [visibleVideoIds, setVisibleVideoIds] = useState<Set<string>>(new Set());
    const scrollY = useRef(new Animated.Value(0)).current;
    const lastScrollY = useRef(0);
    const isInitialMount = useRef(true);

    const loadPosts = useCallback(async (isTabSwitch: boolean = false) => {
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
            const response = activeTab === 'forYou' 
                ? await postRepository.fetchPosts(10)
                : await postRepository.fetchFollowingPosts(10);
            setPosts(response.posts);
            setHasMore(response.hasMore);
            setNextCursor(response.nextCursor);
        } catch (error) {
            console.error('Error loading posts:', error);
        } finally {
            if (isTabSwitch) {
                setSwitchingTab(false);
            } else {
                setLoading(false);
            }
        }
    }, [activeTab]);

    // Initial load only
    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            loadPosts();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onRefresh = async () => {
        try {
            setRefreshing(true);
            const response = activeTab === 'forYou'
                ? await postRepository.fetchPosts(10)
                : await postRepository.fetchFollowingPosts(10);
            setPosts(response.posts);
            setHasMore(response.hasMore);
            setNextCursor(response.nextCursor);
        } catch (error) {
            console.error('Error refreshing posts:', error);
        } finally {
            setRefreshing(false);
        }
    };

    const loadMorePosts = async () => {
        if (loadingMore || !hasMore) return;

        try {
            setLoadingMore(true);
            const response = activeTab === 'forYou'
                ? await postRepository.fetchPosts(10, nextCursor)
                : await postRepository.fetchFollowingPosts(10, nextCursor);
            setPosts(prevPosts => [...prevPosts, ...response.posts]);
            setHasMore(response.hasMore);
            setNextCursor(response.nextCursor);
        } catch (error) {
            console.error('Error loading more posts:', error);
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
                    // Scrolling down - hide header and tab bar (total height ~116)
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
        console.log('Visible video IDs:', Array.from(visibleIds));
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

    const handleTabSwitch = useCallback((tab: 'forYou' | 'following') => {
        if (tab === activeTab) return;
        setActiveTab(tab);
        // Trigger reload with tab switch flag
        setTimeout(() => {
            loadPosts(true);
        }, 0);
    }, [activeTab, loadPosts]);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#1DA1F2" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <CustomHeader title="Home" />
            <Animated.View 
                style={[
                    styles.tabBar,
                    { 
                        top: insets.top + 64,
                        transform: [{ translateY: headerTranslateY }],
                    }
                ]}
            >
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'forYou' && styles.activeTab]}
                    onPress={() => handleTabSwitch('forYou')}
                >
                    <Text style={[styles.tabText, activeTab === 'forYou' && styles.activeTabText]}>
                        For you
                    </Text>
                    {activeTab === 'forYou' && <View style={styles.tabIndicator} />}
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'following' && styles.activeTab]}
                    onPress={() => handleTabSwitch('following')}
                >
                    <Text style={[styles.tabText, activeTab === 'following' && styles.activeTabText]}>
                        Following
                    </Text>
                    {activeTab === 'following' && <View style={styles.tabIndicator} />}
                </TouchableOpacity>
            </Animated.View>
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
                    <ActivityIndicator size="large" color="#14171A" />
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
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    footerLoader: {
        paddingVertical: 20,
        alignItems: 'center',
    },
    tabBar: {
        position: 'absolute',
        left: 0,
        right: 0,
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#EFF3F4',
        zIndex: 999,
        height: 52,
    },
    tab: {
        flex: 1,
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
        height: 4,
        width: '100%',
        backgroundColor: '#14171A',
        borderRadius: 2,
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
});

export default HomeScreen;
