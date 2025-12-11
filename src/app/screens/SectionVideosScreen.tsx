import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Post } from '../types/Post';
import { useVideo } from '../context/VideoContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import PlayIcon from '../components/icons/PlayIcon';
import ArrowLeftIcon from '../components/icons/ArrowLeftIcon';

type SectionVideosRouteProp = RouteProp<{
  SectionVideos: {
    title: string;
    videos: Post[];
  };
}, 'SectionVideos'>;

const SectionVideosScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<SectionVideosRouteProp>();
  const insets = useSafeAreaInsets();
  const { getVideoTime } = useVideo();
  
  const { title, videos } = route.params;

  const handleVideoPress = (video: Post) => {
    const currentTime = getVideoTime(video.id);
    (navigation as any).navigate('VideoPage', {
      videoPost: {
        ...video,
        currentTime,
      },
    });
  };

  const renderVideoItem = ({ item }: { item: Post }) => (
    <TouchableOpacity 
      style={styles.videoItem} 
      onPress={() => handleVideoPress(item)}
      activeOpacity={0.9}
    >
      {/* Header with profile and meta info */}
      <View style={styles.contentRow}>
        <TouchableOpacity onPress={() => (navigation as any).navigate('Profile', { isOwnProfile: false })} activeOpacity={0.7}>
          <Image source={{ uri: item.profileImage }} style={styles.profileImage} />
        </TouchableOpacity>
        
        <View style={styles.contentColumn}>
          {item.title && (
            <Text numberOfLines={1} style={styles.videoTitle}>
              {item.title}
            </Text>
          )}
          <View style={styles.headerRow}>
            <Text style={styles.userId}>{item.userId}</Text>
            {item.timestamp && (
              <>
                <Text style={styles.dot}> · </Text>
                <Text style={styles.timestamp}>{item.timestamp}</Text>
              </>
            )}
          </View>
        </View>
      </View>

      {/* Video thumbnail with padding */}
      <View style={styles.videoWrapper}>
        <View style={styles.videoContainer}>
          <Image
            source={{ uri: item.thumbnailUrl || 'https://picsum.photos/800/450?random=' + item.id }}
            style={styles.videoThumbnail}
            resizeMode="cover"
          />
          <View style={styles.playIconOverlay}>
            <View style={styles.playIcon}>
              <PlayIcon color="#fff" size={32} filled={false} />
            </View>
          </View>
          {/* Runtime Badge */}
          <View style={styles.runtimeBadge}>
            <Text style={styles.runtimeText}>12:34</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <ArrowLeftIcon color="#0F1419" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{title}</Text>
      </View>
      
      <FlatList
        data={videos}
        renderItem={renderVideoItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EFF3F4',
    backgroundColor: '#fff',
  },
  backButton: {
    marginRight: 16,
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0F1419',
  },
  listContent: {
    paddingTop: 8,
  },
  videoItem: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#EFF3F4',
    paddingTop: 12,
    paddingBottom: 0,
  },
  contentRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 4,
    alignItems: 'center',
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
  videoTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0F1419',
    marginBottom: 2,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
    flexWrap: 'wrap',
  },
  userId: {
    fontSize: 14,
    color: '#000',
    fontWeight: '400',
    marginRight: 4,
  },
  dot: {
    fontSize: 14,
    color: '#000',
    marginHorizontal: 4,
    fontWeight: '400',
  },
  timestamp: {
    fontSize: 14,
    color: '#000',
    fontWeight: '400',
  },
  videoWrapper: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  videoContainer: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: '#000',
    position: 'relative',
    borderRadius: 16,
    overflow: 'hidden',
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
});

export default SectionVideosScreen;
