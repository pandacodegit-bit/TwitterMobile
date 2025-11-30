import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Post } from '../types/Post';
import { postRepository } from '../repositories/PostRepository';
import VideoPostCard from '../components/VideoPostCard';
import TextPostCard from '../components/TextPostCard';
import ImagePostCard from '../components/ImagePostCard';
import MapPinIcon from '../components/icons/MapPinIcon';
import CalendarIcon from '../components/icons/CalendarIcon';
import ArrowLeftIcon from '../components/icons/ArrowLeftIcon';
import GearIcon from '../components/icons/GearIcon';

const COVER_HEIGHT = 190;
const PROFILE_IMAGE_SIZE = 100;
const TAB_BAR_HEIGHT = 50;

interface TabBarProps {
  activeTab: 'posts' | 'videos' | 'playlists';
  onTabChange: (tab: 'posts' | 'videos' | 'playlists') => void;
}

const TabBar = ({ activeTab, onTabChange }: TabBarProps) => (
  <View style={styles.tabBar}>
    <TouchableOpacity
      style={[styles.tab, activeTab === 'posts' && styles.activeTab]}
      onPress={() => onTabChange('posts')}
      activeOpacity={0.7}
    >
      <Text style={[styles.tabText, activeTab === 'posts' && styles.activeTabText]}>
        Posts
      </Text>
      {activeTab === 'posts' && <View style={styles.tabIndicator} />}
    </TouchableOpacity>
    <TouchableOpacity
      style={[styles.tab, activeTab === 'videos' && styles.activeTab]}
      onPress={() => onTabChange('videos')}
      activeOpacity={0.7}
    >
      <Text style={[styles.tabText, activeTab === 'videos' && styles.activeTabText]}>
        Videos
      </Text>
      {activeTab === 'videos' && <View style={styles.tabIndicator} />}
    </TouchableOpacity>
    <TouchableOpacity
      style={[styles.tab, activeTab === 'playlists' && styles.activeTab]}
      onPress={() => onTabChange('playlists')}
      activeOpacity={0.7}
    >
      <Text style={[styles.tabText, activeTab === 'playlists' && styles.activeTabText]}>
        Playlists
      </Text>
      {activeTab === 'playlists' && <View style={styles.tabIndicator} />}
    </TouchableOpacity>
  </View>
);

const ProfileHeaderComponent = ({ onBackPress, onSettingsPress }: { onBackPress: () => void; onSettingsPress: () => void }) => (
  <View>
    <View style={styles.coverPhotoContainer}>
      <Image
        source={{ uri: 'https://picsum.photos/800/400?random=cover' }}
        style={styles.coverPhoto}
        resizeMode="cover"
      />
      <TouchableOpacity 
        style={styles.backButton}
        onPress={onBackPress}
        activeOpacity={0.7}
      >
        <ArrowLeftIcon color="#fff" size={20} />
      </TouchableOpacity>
    </View>
    <View style={styles.profileImageContainer}>
      <Image
        source={{ uri: 'https://i.pravatar.cc/150?img=1' }}
        style={styles.profileImage}
      />
      <TouchableOpacity 
        style={styles.settingsButton}
        onPress={onSettingsPress}
        activeOpacity={0.7}
      >
        <GearIcon color="#000" size={28} />
      </TouchableOpacity>
    </View>
    <View style={styles.profileInfo}>
      <Text style={styles.userName}>John Doe</Text>
      <Text style={styles.userId}>@johndoe</Text>
      <Text style={styles.description}>
        Software engineer passionate about mobile development and design.
      </Text>
      <View style={styles.metaRow}>
        <View style={styles.metaItem}>
          <MapPinIcon color="#536471" size={16} />
          <Text style={styles.metaText}>San Francisco, CA</Text>
        </View>
        <Text style={styles.metaDot}>•</Text>
        <View style={styles.metaItem}>
          <CalendarIcon color="#536471" size={16} />
          <Text style={styles.metaText}>Joined March 2020</Text>
        </View>
      </View>
      <View style={styles.statsRow}>
        <TouchableOpacity style={styles.statItem} activeOpacity={0.7}>
          <Text style={styles.statNumber}>256</Text>
          <Text style={styles.statLabel}> Following</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.statItem} activeOpacity={0.7}>
          <Text style={styles.statNumber}>1.2K</Text>
          <Text style={styles.statLabel}> Followers</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
);

const ProfileScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<'posts' | 'videos' | 'playlists'>('posts');
  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const [videos, setVideos] = useState<Post[]>([]);
  const [playlists, setPlaylists] = useState<Post[]>([]);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    const [postsResponse, followingResponse] = await Promise.all([
      postRepository.fetchPosts(20),
      postRepository.fetchFollowingPosts(10),
    ]);
    
    const combined = [...postsResponse.posts, ...followingResponse.posts];
    setAllPosts(combined.filter(post => post.type === 'text' || post.type === 'image'));
    setVideos(combined.filter(post => post.type === 'video'));
    setPlaylists(combined.filter(post => post.type === 'video'));
  };

  const renderPostItem = (item: Post) => {
    
    if (item.type === 'video' && item.videoUrl) {
      return (
        <VideoPostCard
          key={item.id}
          id={item.id}
          profileImage={item.profileImage}
          userName={item.userName}
          userId={item.userId}
          timestamp={item.timestamp}
          title={item.title}
          text={item.text}
          videoUrl={item.videoUrl}
          thumbnailUrl={item.thumbnailUrl}
          comments={item.comments}
          reposts={item.reposts}
          likes={item.likes}
          analytics={item.analytics}
          isVisible={false}
        />
      );
    }
    
    if (item.type === 'image' && item.imageUrl) {
      return (
        <ImagePostCard
          key={item.id}
          id={item.id}
          profileImage={item.profileImage}
          userName={item.userName}
          userId={item.userId}
          timestamp={item.timestamp}
          title={item.title}
          text={item.text}
          imageUrl={item.imageUrl}
          comments={item.comments}
          reposts={item.reposts}
          likes={item.likes}
          analytics={item.analytics}
        />
      );
    }
    
    if (item.type === 'text' && item.text) {
      return (
        <TextPostCard
          key={item.id}
          id={item.id}
          profileImage={item.profileImage}
          userName={item.userName}
          userId={item.userId}
          timestamp={item.timestamp}
          title={item.title}
          text={item.text}
          comments={item.comments}
          reposts={item.reposts}
          likes={item.likes}
          analytics={item.analytics}
        />
      );
    }
    
    return null;
  };

  const getCurrentData = () => {
    switch (activeTab) {
      case 'posts':
        return allPosts;
      case 'videos':
        return videos;
      case 'playlists':
        return playlists;
      default:
        return allPosts;
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={[1]}
        contentContainerStyle={{ paddingTop: insets.top }}
      >
        <ProfileHeaderComponent 
          onBackPress={() => navigation.goBack()} 
          onSettingsPress={() => (navigation as any).navigate('EditProfile')}
        />
        <TabBar activeTab={activeTab} onTabChange={setActiveTab} />
        <View style={styles.postsContainer}>
          {getCurrentData().map((item) => renderPostItem(item))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  backButton: {
    position: 'absolute',
    top: 16,
    left: 12,
    zIndex: 10,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingsButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  coverPhotoContainer: {
    width: '100%',
    height: COVER_HEIGHT,
    backgroundColor: '#E1E8ED',
    position: 'relative',
  },
  coverPhoto: {
    width: '100%',
    height: '100%',
  },
  profileImageContainer: {
    marginTop: -PROFILE_IMAGE_SIZE / 2,
    paddingLeft: 16,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingRight: 16,
  },
  profileImage: {
    width: PROFILE_IMAGE_SIZE,
    height: PROFILE_IMAGE_SIZE,
    borderRadius: PROFILE_IMAGE_SIZE / 2,
    backgroundColor: '#E1E8ED',
    borderWidth: 4,
    borderColor: '#fff',
  },
  profileInfo: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0F1419',
    marginBottom: 4,
  },
  userId: {
    fontSize: 15,
    color: '#536471',
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    color: '#0F1419',
    lineHeight: 20,
    marginBottom: 12,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 14,
    color: '#536471',
  },
  metaDot: {
    fontSize: 14,
    color: '#536471',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 16,
  },
  statItem: {
    flexDirection: 'row',
  },
  statNumber: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F1419',
  },
  statLabel: {
    fontSize: 15,
    color: '#536471',
  },
  tabBar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#EFF3F4',
    height: TAB_BAR_HEIGHT,
    backgroundColor: '#fff',
  },
  tab: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  activeTab: {},
  tabText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#536471',
  },
  activeTabText: {
    fontWeight: '700',
    color: '#0F1419',
  },
  tabIndicator: {
    position: 'absolute',
    bottom: 0,
    left: '10%',
    right: '10%',
    height: 3,
    backgroundColor: '#1D9BF0',
    borderRadius: 2,
  },
  postsContainer: {
    backgroundColor: '#fff',
  },
});

export default ProfileScreen;
