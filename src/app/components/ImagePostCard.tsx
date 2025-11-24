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
      <View style={styles.header}>
        <UserSection
          profileImage={profileImage}
          userName={userName}
          userId={userId}
          timestamp={timestamp}
        />
      </View>
      
      {title && <Text style={styles.title}>{title}</Text>}
      
      <Image
        source={{ uri: imageUrl }}
        style={styles.image}
        resizeMode="cover"
      />
      
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
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  title: {
    fontSize: 15,
    lineHeight: 20,
    color: '#0F1419',
    marginBottom: 12,
    marginHorizontal: 16,
  },
  image: {
    width: '100%',
    height: 400,
    backgroundColor: '#EFF3F4',
    marginBottom: 8,
  },
  actions: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
});

export default ImagePostCard;
