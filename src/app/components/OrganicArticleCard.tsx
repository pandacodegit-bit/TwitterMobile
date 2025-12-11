import React from 'react';
import { Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

interface OrganicArticleCardProps {
  id: string;
  profileImage: string;
  userName: string;
  userId: string;
  timestamp: string;
  title: string;
  articleContent: string;
  comments: number;
  reposts: number;
  likes: number;
  analytics: number;
}

const OrganicArticleCard = ({
  id,
  profileImage,
  userName,
  userId,
  timestamp,
  title,
  articleContent,
  comments,
  reposts,
  likes,
  analytics,
}: OrganicArticleCardProps) => {
  const navigation = useNavigation();

  const handlePress = () => {
    // Navigate to article detail page
    (navigation as any).navigate('NewsArticle', {
      newsPost: {
        id,
        type: 'organic-article',
        profileImage,
        userName,
        userId,
        timestamp,
        title,
        text: title,
        articleContent,
        comments,
        reposts,
        likes,
        analytics,
      },
    });
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress} activeOpacity={0.95}>
      {/* Title */}
      <Text style={styles.title} numberOfLines={3}>
        {title}
      </Text>

      {/* Article Content */}
      <Text style={styles.content} numberOfLines={4}>
        {articleContent}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EFF3F4',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0F1419',
    lineHeight: 26,
    marginBottom: 12,
  },
  content: {
    fontSize: 15,
    lineHeight: 22,
    color: '#0F1419',
    marginBottom: 12,
  },
});

export default OrganicArticleCard;
