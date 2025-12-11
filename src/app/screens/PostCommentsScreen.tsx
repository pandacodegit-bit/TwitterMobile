import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ArrowLeftIcon from '../components/icons/ArrowLeftIcon';
import HeartIcon from '../components/icons/HeartIcon';
import ChatIcon from '../components/icons/ChatIcon';

interface PostCommentsParams {
  postId: string;
  postAuthor: {
    profileImage: string;
    userName: string;
    userId: string;
  };
  postText: string;
  postImage?: string;
  commentsCount: number;
}

interface Comment {
  id: string;
  userName: string;
  userId: string;
  profileImage: string;
  text: string;
  timestamp: string;
  likes: number;
  liked?: boolean;
  showReplyInput?: boolean;
  replies?: Comment[];
}

const PostCommentsScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const params = route.params as PostCommentsParams | undefined;

  const [commentText, setCommentText] = useState(params ? `@${params.postAuthor.userId} ` : '');
  const [replyTexts, setReplyTexts] = useState<{ [key: string]: string }>({});
  const [comments, setComments] = useState<Comment[]>([
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
          text: 'Agreed! Very insightful.',
          timestamp: '1h',
          likes: 5,
        },
      ],
    },
    {
      id: '2',
      userName: 'Alex Martinez',
      userId: 'alexmart',
      profileImage: 'https://i.pravatar.cc/150?img=22',
      text: 'Great post! Looking forward to more content like this.',
      timestamp: '4h',
      likes: 15,
    },
    {
      id: '3',
      userName: 'David Lee',
      userId: 'davidlee',
      profileImage: 'https://i.pravatar.cc/150?img=25',
      text: 'Love this! Can you share more details?',
      timestamp: '6h',
      likes: 8,
    },
  ]);

  if (!params) {
    return null;
  }

  const { postAuthor, postText, postImage, commentsCount } = params;

  const handleBack = () => {
    navigation.goBack();
  };

  const handleSubmitComment = () => {
    if (commentText.trim()) {
      const newComment: Comment = {
        id: Date.now().toString(),
        userName: 'You',
        userId: 'you',
        profileImage: 'https://i.pravatar.cc/150?img=1',
        text: commentText,
        timestamp: 'Just now',
        likes: 0,
      };
      setComments([newComment, ...comments]);
      setCommentText(`@${postAuthor.userId} `);
    }
  };

  const handleCommentLike = (commentId: string, parentId?: string) => {
    setComments(prevComments => {
      return prevComments.map(comment => {
        if (comment.id === commentId) {
          return {
            ...comment,
            liked: !comment.liked,
            likes: comment.liked ? comment.likes - 1 : comment.likes + 1,
          };
        }
        
        // Handle replies
        if (comment.replies && parentId && comment.id === parentId) {
          return {
            ...comment,
            replies: comment.replies.map(reply => 
              reply.id === commentId 
                ? { ...reply, liked: !reply.liked, likes: reply.liked ? reply.likes - 1 : reply.likes + 1 }
                : reply
            ),
          };
        }
        
        return comment;
      });
    });
  };

  const handleReply = (commentId: string, userId: string, parentId?: string) => {
    setComments(prevComments => {
      return prevComments.map(comment => {
        if (comment.id === commentId || (parentId && comment.id === parentId)) {
          if (comment.id === commentId && !parentId) {
            return {
              ...comment,
              showReplyInput: !comment.showReplyInput,
            };
          }
          if (parentId && comment.id === parentId) {
            return {
              ...comment,
              showReplyInput: true,
            };
          }
        }
        return comment;
      });
    });
    
    const replyKey = parentId || commentId;
    setReplyTexts(prev => ({
      ...prev,
      [replyKey]: `@${userId} `,
    }));
  };

  const handleAddReply = (commentId: string) => {
    const replyText = replyTexts[commentId] || '';
    if (replyText.trim() === '') return;

    const newReply: Comment = {
      id: Date.now().toString(),
      userName: 'You',
      userId: 'you',
      profileImage: 'https://i.pravatar.cc/150?img=1',
      text: replyText,
      timestamp: 'Just now',
      likes: 0,
      liked: false,
    };

    setComments(prevComments => {
      return prevComments.map(comment => {
        if (comment.id === commentId) {
          return {
            ...comment,
            replies: [...(comment.replies || []), newReply],
            showReplyInput: false,
          };
        }
        return comment;
      });
    });

    setReplyTexts(prev => {
      const newTexts = { ...prev };
      delete newTexts[commentId];
      return newTexts;
    });
  };

  const renderComment = (comment: Comment, isReply: boolean = false, parentId?: string) => (
    <View key={comment.id} style={[styles.commentItem, isReply && styles.replyItem]}>
      <Image source={{ uri: comment.profileImage }} style={styles.commentProfileImage} />
      <View style={styles.commentContent}>
        <View style={styles.commentHeaderRow}>
          <Text style={styles.commentUserId}>{comment.userId}</Text>
          <Text style={styles.commentDot}>·</Text>
          <Text style={styles.commentTimestamp}>{comment.timestamp}</Text>
        </View>
        <Text style={styles.commentText}>{comment.text}</Text>
        <View style={styles.commentActions}>
          <TouchableOpacity 
            style={styles.commentActionButton}
            onPress={() => handleReply(comment.id, comment.userId, parentId)}
            activeOpacity={0.7}
          >
            <ChatIcon color="#536471" size={14} />
            <Text style={styles.commentActionText}>Reply</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.commentActionButton}
            onPress={() => handleCommentLike(comment.id, parentId)}
            activeOpacity={0.7}
          >
            <HeartIcon color={comment.liked ? "#F91880" : "#536471"} size={14} filled={comment.liked} />
            <Text style={styles.commentActionText}>{comment.likes}</Text>
          </TouchableOpacity>
        </View>
        
        {/* Inline Reply Input */}
        {comment.showReplyInput && (
          <View style={styles.inlineReplyContainer}>
            <Image 
              source={{ uri: 'https://i.pravatar.cc/150?img=1' }} 
              style={styles.replyInputProfileImage} 
            />
            <View style={styles.replyInputWrapper}>
              <TextInput
                style={styles.replyInput}
                placeholder={`Reply to @${comment.userId}...`}
                placeholderTextColor="#536471"
                value={replyTexts[comment.id] || ''}
                onChangeText={(text) => setReplyTexts(prev => ({ ...prev, [comment.id]: text }))}
                multiline
                autoFocus
              />
              <TouchableOpacity 
                style={[styles.replyPostButton, (!replyTexts[comment.id] || replyTexts[comment.id].trim() === '') && styles.sendButtonDisabled]}
                onPress={() => handleAddReply(comment.id)}
                disabled={!replyTexts[comment.id] || replyTexts[comment.id].trim() === ''}
                activeOpacity={0.7}
              >
                <Text style={[styles.sendButtonText, (!replyTexts[comment.id] || replyTexts[comment.id].trim() === '') && styles.sendButtonTextDisabled]}>
                  Reply
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        
        {comment.replies && comment.replies.length > 0 && (
          <View style={styles.repliesContainer}>
            {comment.replies.map((reply) => renderComment(reply, true, comment.id))}
          </View>
        )}
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <ArrowLeftIcon color="#0F1419" size={20} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Post</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.content}>
        {/* Original Post */}
        <View style={styles.originalPost}>
          <View style={styles.postHeader}>
            <Image source={{ uri: postAuthor.profileImage }} style={styles.profileImage} />
            <View style={styles.userInfo}>
              <Text style={styles.userId}>{postAuthor.userId}</Text>
            </View>
          </View>
          <Text style={styles.postText}>{postText}</Text>
          {postImage && (
            <Image source={{ uri: postImage }} style={styles.postImage} resizeMode="cover" />
          )}
        </View>

        {/* Comments Section */}
        <View style={styles.commentsSection}>
          <Text style={styles.commentsSectionTitle}>Comments ({commentsCount})</Text>
          <View style={styles.commentsList}>{comments.map((comment) => renderComment(comment))}</View>
        </View>
      </ScrollView>

      {/* Comment Input */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <View style={[styles.commentInputContainer, { paddingBottom: insets.bottom || 10 }]}>
          <Image
            source={{ uri: 'https://i.pravatar.cc/150?img=1' }}
            style={styles.inputProfileImage}
          />
          <TextInput
            style={styles.commentInput}
            placeholder="Post your reply"
            placeholderTextColor="#536471"
            value={commentText}
            onChangeText={setCommentText}
            multiline
          />
          <TouchableOpacity
            onPress={handleSubmitComment}
            disabled={!commentText.trim()}
            style={[styles.sendButton, !commentText.trim() && styles.sendButtonDisabled]}
          >
            <Text style={[styles.sendButtonText, !commentText.trim() && styles.sendButtonTextDisabled]}>
              Reply
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EFF3F4',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F1419',
  },
  headerSpacer: {
    width: 28,
  },
  content: {
    flex: 1,
  },
  originalPost: {
    padding: 16,
    borderBottomWidth: 8,
    borderBottomColor: '#F7F9F9',
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  profileImage: {
    width: 48,
    height: 48,
    borderRadius: 4,
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F1419',
  },
  userId: {
    fontSize: 14,
    color: '#000',
  },
  postText: {
    fontSize: 15,
    lineHeight: 20,
    color: '#0F1419',
    marginBottom: 12,
  },
  postImage: {
    width: '100%',
    aspectRatio: 16 / 10,
    borderRadius: 12,
    backgroundColor: '#EFF3F4',
  },
  commentsSection: {
    flex: 1,
  },
  commentsSectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F1419',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
  },
  commentsList: {
  },
  commentItem: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EFF3F4',
  },
  replyItem: {
    paddingVertical: 12,
    paddingLeft: 0,
    borderBottomWidth: 0,
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
    color: '#0F1419',
    marginRight: 4,
  },
  commentUserId: {
    fontSize: 13,
    color: '#000',
    marginRight: 4,
  },
  commentDot: {
    fontSize: 13,
    color: '#000',
    marginHorizontal: 4,
  },
  commentTimestamp: {
    fontSize: 13,
    color: '#000',
  },
  commentText: {
    fontSize: 14,
    lineHeight: 18,
    color: '#0F1419',
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
    color: '#536471',
    marginLeft: 4,
  },
  repliesContainer: {
    marginTop: 0,
    paddingLeft: 44,
    borderLeftWidth: 2,
    borderLeftColor: '#EFF3F4',
  },
  inlineReplyContainer: {
    flexDirection: 'row',
    marginTop: 8,
    paddingTop: 8,
  },
  replyInputProfileImage: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginRight: 10,
  },
  replyInputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  replyInput: {
    flex: 1,
    fontSize: 14,
    color: '#0F1419',
    minHeight: 32,
    maxHeight: 80,
    paddingVertical: 6,
    paddingHorizontal: 0,
  },
  replyPostButton: {
    backgroundColor: '#1D9BF0',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    marginLeft: 10,
  },
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#EFF3F4',
    backgroundColor: '#fff',
  },
  inputProfileImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 12,
    marginTop: 4,
  },
  commentInput: {
    flex: 1,
    fontSize: 15,
    color: '#0F1419',
    maxHeight: 100,
    paddingVertical: 8,
  },
  sendButton: {
    marginLeft: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#1D9BF0',
    borderRadius: 20,
    marginTop: 4,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  sendButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
  },
  sendButtonTextDisabled: {
    color: '#fff',
  },
});

export default PostCommentsScreen;
