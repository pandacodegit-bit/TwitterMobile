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
    borderRadius: 20,
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

export default SectionVideosScreen;
