import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import ActionButtons from './ActionButtons';

interface TextPostCardProps {
  id: string;
  profileImage: string;
  userName: string;
  userId: string;
  timestamp?: string;
  title?: string;
  text: string;
  comments?: number;
  reposts?: number;
  likes?: number;
  analytics?: number;
}

const TextPostCard = React.memo(({
  id,
  profileImage,
  userName,
  userId,
  timestamp,
  title,
  text,
  comments,
  reposts,
  likes,
  analytics,
}: TextPostCardProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.contentRow}>
        <Image source={{ uri: profileImage }} style={styles.profileImage} />
        
        <View style={styles.contentColumn}>
          <View style={styles.headerRow}>
            <Text style={styles.userName}>{userName}</Text>
            <Text style={styles.userId}> @{userId}</Text>
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
          
          <Text style={styles.textBody}>{text}</Text>
          
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
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EFF3F4',
  },
  contentRow: {
    flexDirection: 'row',
  },
  profileImage: {
    width: 40,
    height: 40,
    // borderRadius: 20,
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
    fontSize: 16,
    fontWeight: '700',
    color: '#000000',
    marginRight: 4,
  },
  userId: {
    fontSize: 16,
    color: '#536471',
    fontWeight: '400',
    marginRight: 4,
  },
  dot: {
    fontSize: 16,
    color: '#536471',
    marginHorizontal: 4,
    fontWeight: '400',
  },
  timestamp: {
    fontSize: 16,
    color: '#536471',
    fontWeight: '400',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0F1419',
    marginBottom: 4,
  },
  textBody: {
    fontSize: 15,
    lineHeight: 20,
    color: '#0F1419',
    marginBottom: 12,
  },
  actions: {
    marginTop: 4,
  },
});

export default TextPostCard;
