import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Comment } from '../types/Comment';
import HeartIcon from './icons/HeartIcon';
import ChatIcon from './icons/ChatIcon';

interface CommentItemProps {
  comment: Comment;
  level: number;
  onLike: (commentId: string) => void;
  onReply: (commentId: string) => void;
  onShowReplies: (commentId: string) => void;
}

const CommentItem: React.FC<CommentItemProps> = ({ comment, level, onLike, onReply, onShowReplies }) => {
  const isNested = level > 0;

  return (
    <View style={[styles.container, isNested && styles.nestedContainer]}>
      <Image source={{ uri: comment.userAvatar }} style={styles.avatar} />
      <View style={styles.content}>
        <View style={styles.card}>
          <View style={styles.cardContent}>
            <View style={styles.header}>
              <View style={styles.userInfo}>
                <Text style={styles.displayName}>{comment.userDisplayName}</Text>
                <Text style={styles.username}>{comment.username}</Text>
              </View>
              <Text style={styles.timestamp}>{comment.timestamp}</Text>
            </View>
            <Text style={styles.text}>{comment.text}</Text>
          </View>
        </View>
        
        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionButton} onPress={() => onLike(comment.id)}>
            <HeartIcon 
              color={comment.isLiked ? '#F91880' : '#536471'} 
              size={16} 
              filled={comment.isLiked}
            />
            {comment.likes > 0 && (
              <Text style={[styles.actionText, comment.isLiked && styles.likedText]}>
                {comment.likes}
              </Text>
            )}
          </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton} onPress={() => onReply(comment.id)}>
              <ChatIcon color="#536471" size={16} />
              <Text style={styles.actionText}>Reply</Text>
            </TouchableOpacity>

          {comment.replyCount > 0 && (
            <TouchableOpacity style={styles.actionButton} onPress={() => onShowReplies(comment.id)}>
              <Text style={styles.repliesText}>
                {comment.replyCount} {comment.replyCount === 1 ? 'reply' : 'replies'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EFF3F4',
  },
  nestedContainer: {
    paddingLeft: 68,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E1E8ED',
  },
  content: {
    flex: 1,
    gap: 8,
  },
  card: {
    backgroundColor: '#EFF3F4',
    borderRadius: 16,
    padding: 12,
  },
  cardContent: {
    gap: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  userInfo: {
    flex: 1,
    gap: 2,
  },
  displayName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F1419',
  },
  username: {
    fontSize: 14,
    color: '#536471',
  },
  timestamp: {
    fontSize: 14,
    color: '#536471',
  },
  text: {
    fontSize: 15,
    color: '#0F1419',
    lineHeight: 20,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginLeft: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionText: {
    fontSize: 13,
    color: '#536471',
  },
  likedText: {
    color: '#F91880',
  },
  repliesText: {
    fontSize: 13,
    color: '#1D9BF0',
    fontWeight: '500',
  },
});

export default CommentItem;
