import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ActionButtons from './ActionButtons';

interface ImagePostCardProps {
  id: string;
  profileImage: string;
  userName: string;
  userId: string;
  timestamp?: string;
  title?: string;
  text?: string;
  imageUrl?: string;
  imageUrls?: string[];
  comments?: number;
  reposts?: number;
  likes?: number;
  analytics?: number;
}

const ImagePostCard = React.memo(({
  id,
  profileImage,
  userName,
  userId,
  timestamp,
  title,
  text,
  imageUrl,
  imageUrls,
  comments,
  reposts,
  likes,
  analytics,
}: ImagePostCardProps) => {
  const navigation = useNavigation();
  const images = imageUrls || (imageUrl ? [imageUrl] : []);
  const imageCount = images.length;

  const renderImages = () => {
    if (imageCount === 0) return null;

    if (imageCount === 1) {
      return (
        <Image
          source={{ uri: images[0] }}
          style={styles.singleImage}
          resizeMode="cover"
        />
      );
    }

    if (imageCount === 2) {
      return (
        <View style={styles.twoImagesContainer}>
          <Image
            source={{ uri: images[0] }}
            style={styles.twoImages}
            resizeMode="cover"
          />
          <Image
            source={{ uri: images[1] }}
            style={styles.twoImages}
            resizeMode="cover"
          />
        </View>
      );
    }

    if (imageCount >= 4) {
      return (
        <View style={styles.fourImagesContainer}>
          <View style={styles.fourImagesRow}>
            <Image
              source={{ uri: images[0] }}
              style={styles.fourImages}
              resizeMode="cover"
            />
            <Image
              source={{ uri: images[1] }}
              style={styles.fourImages}
              resizeMode="cover"
            />
          </View>
          <View style={styles.fourImagesRow}>
            <Image
              source={{ uri: images[2] }}
              style={styles.fourImages}
              resizeMode="cover"
            />
            <Image
              source={{ uri: images[3] }}
              style={styles.fourImages}
              resizeMode="cover"
            />
          </View>
        </View>
      );
    }

    return null;
  };

  return (
    <View style={styles.container}>
      <View style={styles.contentRow}>
        <TouchableOpacity onPress={() => (navigation as any).navigate('Profile', { isOwnProfile: false })} activeOpacity={0.7}>
          <Image source={{ uri: profileImage }} style={styles.profileImage} />
        </TouchableOpacity>
        
        <View style={styles.contentColumn}>
          <View style={styles.headerRow}>
            <Text style={styles.userId}>{userId}</Text>
            {timestamp && (
              <>
                <Text style={styles.dot}>· </Text>
                <Text style={styles.timestamp}>{timestamp}</Text>
              </>
            )}
          </View>

          {title && <Text 
            numberOfLines={1}
            style={styles.title}
          >{title}</Text>}
          
          {text && <Text style={styles.description}>{text}</Text>}
          
          {renderImages()}
        </View>
      </View>
      
      <View style={styles.actions}>
        <ActionButtons
          postId={id}
          comments={comments}
          reposts={reposts}
          likes={likes}
          analytics={analytics}
        />
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#EFF3F4',
    paddingTop: 12,
    paddingBottom: 0,
  },
  contentRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 8,
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
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    flexWrap: 'wrap',
  },
  userName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#000000',
    marginRight: 4,
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
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0F1419',
    marginBottom: 4,
  },
  description: {
    fontSize: 15,
    lineHeight: 20,
    color: '#0F1419',
    fontWeight: '400',
    marginBottom: 12,
  },
  singleImage: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: '#EFF3F4',
    borderRadius: 16,
    marginBottom: 12,
  },
  twoImagesContainer: {
    flexDirection: 'row',
    gap: 2,
    marginBottom: 12,
    borderRadius: 16,
    overflow: 'hidden',
  },
  twoImages: {
    flex: 1,
    aspectRatio: 3 / 4,
    backgroundColor: '#EFF3F4',
  },
  fourImagesContainer: {
    gap: 2,
    marginBottom: 12,
    borderRadius: 16,
    overflow: 'hidden',
  },
  fourImagesRow: {
    flexDirection: 'row',
    gap: 2,
  },
  fourImages: {
    flex: 1,
    aspectRatio: 1,
    backgroundColor: '#EFF3F4',
  },
  actions: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
});

export default ImagePostCard;
