import React, { useState, useEffect } from 'react';
import { View, FlatList, Modal, StyleSheet, Text, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';
import { Comment } from '../types/Comment';
import CommentInput from './CommentInput';
import CommentItem from './CommentItem';
import { commentRepository } from '../repositories/CommentRepository';

interface CommentsListProps {
  visible: boolean;
  onClose: () => void;
  postId: string;
  currentUserAvatar: string;
}

const CommentsList: React.FC<CommentsListProps> = ({ 
  visible, 
  onClose, 
  postId, 
  currentUserAvatar 
}) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set());
  const [replyingTo, setReplyingTo] = useState<string | null>(null);

  useEffect(() => {
    if (visible) {
      loadComments();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, postId]);

  const loadComments = async () => {
    try {
      setLoading(true);
      const response = await commentRepository.fetchComments(postId);
      setComments(response.comments);
    } catch (error) {
      console.error('Error loading comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async (text: string) => {
    try {
      const newComment = await commentRepository.addComment(postId, text);
      setComments([newComment, ...comments]);
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleAddReply = async (commentId: string, text: string) => {
    try {
      const newReply = await commentRepository.addReply(postId, commentId, text);
      
      setComments(comments.map(comment => {
        if (comment.id === commentId) {
          return {
            ...comment,
            replies: [...comment.replies, newReply],
            replyCount: comment.replyCount + 1,
          };
        }
        return comment;
      }));
      setReplyingTo(null);
      setExpandedComments(new Set([...expandedComments, commentId]));
    } catch (error) {
      console.error('Error adding reply:', error);
    }
  };

  const handleLike = async (commentId: string) => {
    try {
      // Optimistically update UI
      setComments(comments.map(comment => {
        if (comment.id === commentId) {
          return {
            ...comment,
            isLiked: !comment.isLiked,
            likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1,
          };
        }
        // Check replies
        if (comment.replies.some(r => r.id === commentId)) {
          return {
            ...comment,
            replies: comment.replies.map(reply => {
              if (reply.id === commentId) {
                return {
                  ...reply,
                  isLiked: !reply.isLiked,
                  likes: reply.isLiked ? reply.likes - 1 : reply.likes + 1,
                };
              }
              return reply;
            }),
          };
        }
        return comment;
      }));

      // Make API call
      await commentRepository.toggleCommentLike(commentId);
    } catch (error) {
      console.error('Error toggling like:', error);
      // Revert optimistic update on error
      loadComments();
    }
  };

  const handleReply = (commentId: string) => {
    setReplyingTo(commentId);
  };

  const handleShowReplies = (commentId: string) => {
    const newExpanded = new Set(expandedComments);
    if (newExpanded.has(commentId)) {
      newExpanded.delete(commentId);
    } else {
      newExpanded.add(commentId);
    }
    setExpandedComments(newExpanded);
  };

  const renderComment = ({ item }: { item: Comment }) => {
    const isExpanded = expandedComments.has(item.id);
    const isReplying = replyingTo === item.id;

    return (
      <View>
        <CommentItem
          comment={item}
          level={0}
          onLike={handleLike}
          onReply={handleReply}
          onShowReplies={handleShowReplies}
        />
        
        {isReplying && (
          <View style={styles.replyInputContainer}>
            <CommentInput
              userAvatar={currentUserAvatar}
              placeholder="Post your reply"
              onSubmit={(text) => handleAddReply(item.id, text)}
            />
          </View>
        )}

        {isExpanded && item.replies.map((reply) => (
          <CommentItem
            key={reply.id}
            comment={reply}
            level={1}
            onLike={handleLike}
            onReply={handleReply}
            onShowReplies={handleShowReplies}
          />
        ))}
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Comments</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>
        </View>

        <CommentInput
          userAvatar={currentUserAvatar}
          onSubmit={handleAddComment}
        />

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#1D9BF0" />
          </View>
        ) : (
          <FlatList
            data={comments}
            keyExtractor={(item) => item.id}
            renderItem={renderComment}
            style={styles.list}
            showsVerticalScrollIndicator={false}
          />
        )}
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EFF3F4',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0F1419',
  },
  closeButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeText: {
    fontSize: 24,
    color: '#0F1419',
  },
  list: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  replyInputContainer: {
    backgroundColor: '#F7F9F9',
    borderBottomWidth: 1,
    borderBottomColor: '#EFF3F4',
  },
});

export default CommentsList;
