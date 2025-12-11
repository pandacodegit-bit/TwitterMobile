import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ActionButtons from './ActionButtons';
import LinkIcon from './icons/LinkIcon';

interface LinkedArticleCardProps {
  id: string;
  profileImage: string;
  userName: string;
  userId: string;
  timestamp: string;
  text: string;
  imageUrl?: string;
  linkSource: string;
  comments: number;
  reposts: number;
  likes: number;
  analytics: number;
}

const LinkedArticleCard = ({
  id,
  profileImage,
  userName,
  userId,
  timestamp,
  text,
  imageUrl,
  linkSource,
  comments,
  reposts,
  likes,
  analytics,
}: LinkedArticleCardProps) => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {/* Profile Section */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => (navigation as any).navigate('Profile', { isOwnProfile: false })} activeOpacity={0.7}>
          <Image source={{ uri: profileImage }} style={styles.profileImage} />
        </TouchableOpacity>
        <View style={styles.userInfo}>
          <Text style={styles.userId}>{userId} · {timestamp}</Text>
        </View>
      </View>

      {/* Text Content */}
      <Text style={styles.text} numberOfLines={2}>
        {text}
      </Text>

      {/* Article Image */}
      {imageUrl && (
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: imageUrl }} 
            style={styles.articleImage}
            resizeMode="cover"
          />
        </View>
      )}

      {/* Link Source */}
      <View style={styles.linkContainer}>
        <LinkIcon color="#536471" size={14} />
        <Text style={styles.linkText}>From {linkSource}</Text>
      </View>

      {/* Action Buttons */}
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
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingTop: 12,
    paddingBottom: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#EFF3F4',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    paddingHorizontal: 16,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 4,
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F1419',
  },
  userId: {
    fontSize: 12,
    color: '#000',
  },
  text: {
    fontSize: 15,
    lineHeight: 20,
    color: '#0F1419',
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  imageContainer: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  articleImage: {
    width: '100%',
    aspectRatio: 16 / 10,
    borderRadius: 12,
    backgroundColor: '#EFF3F4',
  },
  linkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    marginBottom: 8,
    paddingHorizontal: 16,
  },
  linkText: {
    fontSize: 13,
    color: '#536471',
    marginLeft: 6,
  },
  actions: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
});

export default LinkedArticleCard;
