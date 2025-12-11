import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import RepeatIcon from './icons/RepeatIcon';
import HeartIcon from './icons/HeartIcon';
import ChatIcon from './icons/ChatIcon';

interface NewsCardProps {
  id: string;
  profileImage: string;
  userName: string;
  userId: string;
  timestamp: string;
  text: string;
  comments: number;
  reposts: number;
  likes: number;
  analytics: number;
  onPress: () => void;
}

const NewsCard: React.FC<NewsCardProps> = ({
  profileImage,
  userName,
  userId,
  timestamp,
  text,
  comments,
  reposts,
  likes,
  onPress,
}) => {
  const [liked, setLiked] = React.useState(false);
  const [likeCount, setLikeCount] = React.useState(likes);

  const handleLike = () => {
    setLiked(!liked);
    setLikeCount(liked ? likeCount - 1 : likeCount + 1);
  };

  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.95}
    >
      <View style={styles.header}>
        <Image source={{ uri: profileImage }} style={styles.profileImage} />
        <View style={styles.userInfo}>
          <View style={styles.nameRow}>
            <Text style={styles.userId}>{userId}</Text>
            <Text style={styles.timestamp}>· {timestamp}</Text>
          </View>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.newsText} numberOfLines={6}>
          {text}
        </Text>
        <Text style={styles.readMore}>Read more</Text>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={handleLike}
          activeOpacity={0.7}
        >
          <HeartIcon color={liked ? '#E0245E' : '#536471'} size={18} filled={liked} />
          <Text style={[styles.actionText, liked && styles.likedText]}>{likeCount}</Text>
        </TouchableOpacity>
        <View style={styles.actionButton}>
          <ChatIcon color="#536471" size={18} />
          <Text style={styles.actionText}>{comments}</Text>
        </View>
        <View style={styles.actionButton}>
          <RepeatIcon color="#536471" size={18} />
          <Text style={styles.actionText}>{reposts}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#EFF3F4',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  header: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 4,
    backgroundColor: '#E1E8ED',
  },
  userInfo: {
    marginLeft: 12,
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  userName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F1419',
    marginRight: 4,
  },
  userId: {
    fontSize: 13,
    color: '#000',
    marginRight: 4,
  },
  timestamp: {
    fontSize: 13,
    color: '#000',
  },
  content: {
    marginTop: 4,
    marginBottom: 12,
  },
  newsText: {
    fontSize: 15,
    lineHeight: 20,
    color: '#0F1419',
  },
  readMore: {
    fontSize: 15,
    color: '#000',
    fontWeight: '400',
    marginTop: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    maxWidth: 425,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionText: {
    fontSize: 13,
    color: '#536471',
  },
  likedText: {
    color: '#E0245E',
  },
});

export default NewsCard;
