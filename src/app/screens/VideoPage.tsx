import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, SafeAreaView } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import Video from 'react-native-video';
import { Post } from '../types/Post';
import RepeatIcon from '../components/icons/RepeatIcon';
import HeartIcon from '../components/icons/HeartIcon';
import ChartIcon from '../components/icons/ChartIcon';
import CloseIcon from '../components/icons/CloseIcon';
import ChatIcon from '../components/icons/ChatIcon';
import { useVideo } from '../context/VideoContext';

interface VideoPageParams {
  videoPost: Post & { currentTime?: number };
}

interface Comment {
  id: string;
  userName: string;
  userId: string;
  profileImage: string;
  text: string;
  timestamp: string;
  likes: number;
  replies?: Comment[];
}

const VideoPage = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const params = route.params as VideoPageParams | undefined;
  const { getVideoTime } = useVideo();
  
  const [seekTime, setSeekTime] = useState<number | null>(null);
  const [paused, setPaused] = useState(false);
  const videoRef = useRef<any>(null);

  useEffect(() => {
    if (params?.videoPost) {
      // Get the current playback time from the previous screen
      const time = params.videoPost.currentTime || getVideoTime(params.videoPost.id);
      setSeekTime(time);
      // Ensure video starts playing
      setPaused(false);
    }
  }, [params?.videoPost, getVideoTime]);

  const handleClose = () => {
    navigation.goBack();
  };

  if (!params?.videoPost) {
    return null;
  }

  const video = params.videoPost;

  // Mock comments data with replies
  const comments: Comment[] = [
    {
      id: '1',
      userName: 'Sarah Johnson',
      userId: 'sarahjay',
      profileImage: 'https://i.pravatar.cc/150?img=20',
      text: 'This is amazing! Thanks for sharing 🔥',
      timestamp: '2h',
      likes: 24,
      replies: [
        {
          id: '1-1',
          userName: 'Mike Chen',
          userId: 'mikechen',
          profileImage: 'https://i.pravatar.cc/150?img=21',
          text: 'Totally agree! Best tutorial I\'ve seen',
          timestamp: '1h',
          likes: 5,
        },
        {
          id: '1-2',
          userName: 'Emma Wilson',
          userId: 'emmaw',
          profileImage: 'https://i.pravatar.cc/150?img=22',
          text: 'Same here! Very helpful',
          timestamp: '45m',
          likes: 3,
        },
      ],
    },
    {
      id: '2',
      userName: 'Tech Guru',
      userId: 'techguru',
      profileImage: 'https://i.pravatar.cc/150?img=23',
      text: 'Really helpful content, keep it up!',
      timestamp: '4h',
      likes: 12,
      replies: [
        {
          id: '2-1',
          userName: 'Alex Chen',
          userId: 'alexchen',
          profileImage: 'https://i.pravatar.cc/150?img=24',
          text: 'Couldn\'t have said it better!',
          timestamp: '3h',
          likes: 2,
        },
      ],
    },
    {
      id: '3',
      userName: 'David Lee',
      userId: 'davidlee',
      profileImage: 'https://i.pravatar.cc/150?img=25',
      text: 'Love this! Can you make more like this?',
      timestamp: '6h',
      likes: 8,
    },
  ];

  const renderComment = (comment: Comment, isReply: boolean = false) => (
    <View key={comment.id} style={[styles.commentItem, isReply && styles.replyItem]}>
      <Image 
        source={{ uri: comment.profileImage }} 
        style={styles.commentProfileImage} 
      />
      <View style={styles.commentContent}>
        <View style={styles.commentHeaderRow}>
          <Text style={styles.commentUserName}>{comment.userName}</Text>
          <Text style={styles.commentUserId}>@{comment.userId}</Text>
          <Text style={styles.commentDot}>·</Text>
          <Text style={styles.commentTimestamp}>{comment.timestamp}</Text>
        </View>
        <Text style={styles.commentText}>{comment.text}</Text>
        <View style={styles.commentActions}>
          <TouchableOpacity style={styles.commentActionButton}>
            <ChatIcon color="#aaa" size={14} />
            <Text style={styles.commentActionText}>Reply</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.commentActionButton}>
            <HeartIcon color="#aaa" size={14} />
            <Text style={styles.commentActionText}>{comment.likes}</Text>
          </TouchableOpacity>
        </View>
        {comment.replies && comment.replies.length > 0 && (
          <View style={styles.repliesContainer}>
            {comment.replies.map(reply => renderComment(reply, true))}
          </View>
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
          <CloseIcon color="#fff" size={24} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.videoWrapper}>
          <Video
            ref={videoRef}
            source={{ uri: video.videoUrl || '' }}
            style={styles.video}
            resizeMode="contain"
            repeat={true}
            paused={paused}
            muted={false}
            playInBackground={false}
            playWhenInactive={false}
            controls={true}
            ignoreSilentSwitch="ignore"
            onLoad={() => {
              if (seekTime !== null && videoRef.current) {
                videoRef.current.seek(seekTime);
                setSeekTime(null);
              }
              // Ensure video plays after loading
              setPaused(false);
            }}
          />
        </View>

        <View style={styles.infoContainer}>
          {video.title && (
            <Text style={styles.title}>{video.title}</Text>
          )}

          {video.text && (
            <Text style={styles.description}>{video.text}</Text>
          )}

          <View style={styles.userInfo}>
            <Image 
              source={{ uri: video.profileImage }} 
              style={styles.profileImage} 
            />
            <View style={styles.textInfo}>
              <Text style={styles.userName}>{video.userName}</Text>
              <Text style={styles.userId}>@{video.userId} · {video.timestamp}</Text>
            </View>
          </View>

          <View style={styles.actionsRow}>
            <TouchableOpacity style={styles.actionButton}>
              <HeartIcon color="#fff" size={20} />
              <Text style={styles.actionText}>{video.likes}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <RepeatIcon color="#fff" size={20} />
              <Text style={styles.actionText}>{video.reposts}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <ChartIcon color="#fff" size={20} />
              <Text style={styles.actionText}>{video.analytics}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.commentSection}>
            <Text style={styles.commentSectionTitle}>
              Comments ({video.comments || comments.length})
            </Text>
            <View style={styles.commentsList}>
              {comments.map(comment => renderComment(comment))}
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  closeButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  videoWrapper: {
    width: '100%',
    backgroundColor: '#000',
  },
  video: {
    width: '100%',
    aspectRatio: 16 / 9,
  },
  infoContainer: {
    padding: 16,
    paddingTop: 20,
    backgroundColor: '#000',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 4,
    marginRight: 12,
  },
  textInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 2,
  },
  userId: {
    fontSize: 13,
    color: '#aaa',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    lineHeight: 20,
    color: '#fff',
    marginBottom: 30,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#333',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  actionText: {
    fontSize: 13,
    color: '#fff',
    marginLeft: 4,
  },
  commentSection: {
    marginTop: 16,
    paddingBottom: 32,
  },
  commentSectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 16,
  },
  commentsList: {
    marginTop: 0,
  },
  commentItem: {
    flexDirection: 'row',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  replyItem: {
    marginLeft: 0,
    marginTop: 12,
    borderBottomWidth: 0,
    paddingBottom: 0,
  },
  commentProfileImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 12,
  },
  commentContent: {
    flex: 1,
  },
  commentHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: 4,
  },
  commentUserName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
    marginRight: 4,
  },
  commentUserId: {
    fontSize: 13,
    color: '#fff',
    marginRight: 4,
  },
  commentDot: {
    fontSize: 13,
    color: '#fff',
    marginHorizontal: 4,
  },
  commentTimestamp: {
    fontSize: 13,
    color: '#fff',
  },
  commentText: {
    fontSize: 14,
    lineHeight: 18,
    color: '#fff',
    marginBottom: 8,
  },
  commentActions: {
    flexDirection: 'row',
    gap: 16,
  },
  commentActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  commentActionText: {
    fontSize: 12,
    color: '#fff',
    marginLeft: 4,
  },
  repliesContainer: {
    marginTop: 12,
    paddingLeft: 44,
    borderLeftWidth: 2,
    borderLeftColor: '#333',
  },
});

export default VideoPage;
