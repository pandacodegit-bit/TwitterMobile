import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface NewsHeadlineCardProps {
  id: string;
  profileImage: string;
  timestamp: string;
  category: string;
  postCount: string;
  text: string;
  onPress: () => void;
}

const NewsHeadlineCard: React.FC<NewsHeadlineCardProps> = ({
  timestamp,
  category,
  // postCount,
  text,
  onPress,
}) => {
  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.95}
    >
      <Text style={styles.headline} numberOfLines={2}>
        {text}
      </Text>
      <View style={styles.metaRow}>
        <Text style={styles.timestamp}>{timestamp}</Text>
        <Text style={styles.dot}>·</Text>
        <Text style={styles.category}>{category}</Text>
        {/* <Text style={styles.dot}>·</Text> */}
        {/* <Text style={styles.postCount}>{postCount}</Text> */}
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
    paddingVertical: 16,
  },
  headline: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0F1419',
    lineHeight: 22,
    marginBottom: 12,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timestamp: {
    fontSize: 13,
    color: '#536471',
    marginRight: 4,
  },
  dot: {
    fontSize: 13,
    color: '#536471',
    marginHorizontal: 4,
  },
  category: {
    fontSize: 13,
    color: '#536471',
    marginRight: 4,
  },
  postCount: {
    fontSize: 13,
    color: '#536471',
  },
});

export default NewsHeadlineCard;
