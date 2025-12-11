import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Post } from '../types/Post';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import PlayIcon from '../components/icons/PlayIcon';
import ArrowLeftIcon from '../components/icons/ArrowLeftIcon';

type PlaylistsRouteProp = RouteProp<{
  Playlists: {
    title: string;
    playlists: Post[];
  };
}, 'Playlists'>;

const PlaylistsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<PlaylistsRouteProp>();
  const insets = useSafeAreaInsets();
  
  const { title, playlists } = route.params;

  const handlePlaylistPress = (playlist: Post) => {
    (navigation as any).navigate('SectionVideos', {
      title: playlist.title || 'Playlist',
      videos: playlists,
    });
  };

  const renderPlaylistItem = ({ item }: { item: Post }) => (
    <TouchableOpacity 
      style={styles.playlistItem} 
      onPress={() => handlePlaylistPress(item)}
      activeOpacity={0.9}
    >
      <View style={styles.playlistContainer}>
        <Image
          source={{ uri: item.thumbnailUrl || 'https://picsum.photos/800/450?random=' + item.id }}
          style={styles.playlistThumbnail}
          resizeMode="cover"
        />
        
        {/* Play Icon Overlay */}
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
      
      {/* Playlist Info */}
      {item.title && (
        <Text style={styles.playlistTitle} numberOfLines={2}>
          {item.title}
        </Text>
      )}
      <Text style={styles.playlistMeta} numberOfLines={1}>
        {item.userName} · {item.analytics} views
      </Text>
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
        data={playlists}
        renderItem={renderPlaylistItem}
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
    paddingHorizontal: 20,
    paddingBottom: 16,
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
  playlistItem: {
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  playlistContainer: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: '#000',
    position: 'relative',
    borderRadius: 12,
    overflow: 'hidden',
  },
  playlistThumbnail: {
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
    zIndex: 4,
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
    zIndex: 4,
  },
  runtimeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  playlistTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0F1419',
    marginTop: 8,
    marginBottom: 4,
    lineHeight: 18,
  },
  playlistMeta: {
    fontSize: 12,
    color: '#536471',
  },
});

export default PlaylistsScreen;
