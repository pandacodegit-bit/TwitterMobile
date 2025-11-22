import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import UserSection from './UserSection';
import ActionButtons from './ActionButtons';

interface ImagePostCardProps {
  id: string;
  profileImage: string;
  userName: string;
  userId: string;
  timestamp?: string;
  title?: string;
  imageUrl: string;
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
  imageUrl,
  comments,
  reposts,
  likes,
  analytics,
}: ImagePostCardProps) => {
  return (
    <View style={styles.container}>
      <UserSection
        profileImage={profileImage}
        userName={userName}
        userId={userId}
        timestamp={timestamp}
      />
      
      {title && <Text style={styles.title}>{title}</Text>}
      
      <Image
        source={{ uri: imageUrl }}
        style={styles.image}
        resizeMode="cover"
      />
      
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
  title: {
    fontSize: 15,
    lineHeight: 20,
    color: '#0F1419',
    marginBottom: 12,
  },
  image: {
    width: '100%',
    height: 300,
    borderRadius: 16,
    backgroundColor: '#EFF3F4',
    marginBottom: 8,
  },
});

export default ImagePostCard;
