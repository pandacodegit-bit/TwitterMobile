import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import UserSection from './UserSection';
import ActionButtons from './ActionButtons';

interface TextPostCardProps {
  id: string;
  profileImage: string;
  userName: string;
  userId: string;
  timestamp?: string;
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
  text,
  comments,
  reposts,
  likes,
  analytics,
}: TextPostCardProps) => {
  return (
    <View style={styles.container}>
      <UserSection
        profileImage={profileImage}
        userName={userName}
        userId={userId}
        timestamp={timestamp}
      />
      
      <Text style={styles.textBody}>{text}</Text>
      
      <ActionButtons
        postId={id}
        comments={comments}
        reposts={reposts}
        likes={likes}
        analytics={analytics}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EFF3F4',
  },
  textBody: {
    fontSize: 15,
    lineHeight: 20,
    color: '#0F1419',
    marginBottom: 8,
  },
});

export default TextPostCard;
