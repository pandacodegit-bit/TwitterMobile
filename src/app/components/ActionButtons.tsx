import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Pressable } from 'react-native';
import ChatIcon from './icons/ChatIcon';
import RepeatIcon from './icons/RepeatIcon';
import HeartIcon from './icons/HeartIcon';
import ExportIcon from './icons/ExportIcon';
import ChartIcon from './icons/ChartIcon';
import BookmarkIcon from './icons/BookmarkIcon';
import LinkIcon from './icons/LinkIcon';
import EnvelopeIcon from './icons/EnvelopeIcon';
import CommentsList from './CommentsList';

interface ActionButtonsProps {
  postId: string;
  comments?: number;
  reposts?: number;
  likes?: number;
  analytics?: number;
  onComment?: () => void;
  onRepost?: () => void;
  onLike?: () => void;
}

const ActionButtons = ({
  postId,
  comments = 0,
  reposts = 0,
  likes = 0,
  analytics = 0,
  onComment,
  onRepost,
  onLike,
}: ActionButtonsProps) => {
  const [shareMenuVisible, setShareMenuVisible] = useState(false);
  const [commentsVisible, setCommentsVisible] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isReposted, setIsReposted] = useState(false);

  const formatCount = (count: number): string => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  };

  const handleShareAction = (action: string) => {
    setShareMenuVisible(false);
    console.log(`Share action: ${action}`);
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    onLike?.();
  };

  const handleRepost = () => {
    setIsReposted(!isReposted);
    onRepost?.();
  };

  const handleCommentPress = () => {
    setCommentsVisible(true);
    onComment?.();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.actionButton} onPress={handleCommentPress}>
        <ChatIcon color="#536471" size={18} />
        {comments > 0 && <Text style={styles.count}>{formatCount(comments)}</Text>}
      </TouchableOpacity>

      <TouchableOpacity style={styles.actionButton} onPress={handleRepost}>
        <RepeatIcon color={isReposted ? '#00BA7C' : '#536471'} size={18} />
        {reposts > 0 && (
          <Text style={[styles.count, isReposted && styles.repostedText]}>
            {formatCount(reposts)}
          </Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity style={styles.actionButton} onPress={handleLike}>
        <HeartIcon color={isLiked ? '#F91880' : '#536471'} size={18} filled={isLiked} />
        {likes > 0 && (
          <Text style={[styles.count, isLiked && styles.likedText]}>
            {formatCount(likes)}
          </Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity style={styles.actionButton} onPress={() => setShareMenuVisible(true)}>
        <ExportIcon color="#536471" size={18} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.actionButton}>
        <ChartIcon color="#536471" size={18} />
        {analytics > 0 && <Text style={styles.count}>{formatCount(analytics)}</Text>}
      </TouchableOpacity>

      <Modal
        transparent
        visible={shareMenuVisible}
        animationType="fade"
        onRequestClose={() => setShareMenuVisible(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setShareMenuVisible(false)}>
          <View style={styles.sharePopup}>
            <TouchableOpacity
              style={styles.shareItem}
              onPress={() => handleShareAction('bookmark')}
            >
              <BookmarkIcon color="#0F1419" size={20} />
              <Text style={styles.shareItemText}>Bookmark</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.shareItem}
              onPress={() => handleShareAction('link')}
            >
              <LinkIcon color="#0F1419" size={20} />
              <Text style={styles.shareItemText}>Share link</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.shareItem}
              onPress={() => handleShareAction('dm')}
            >
              <EnvelopeIcon color="#0F1419" size={20} />
              <Text style={styles.shareItemText}>Share via Direct Message</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>

      <CommentsList
        visible={commentsVisible}
        onClose={() => setCommentsVisible(false)}
        postId={postId}
        currentUserAvatar="https://i.pravatar.cc/150?img=1"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  count: {
    fontSize: 13,
    color: '#536471',
  },
  repostedText: {
    color: '#00BA7C',
  },
  likedText: {
    color: '#F91880',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sharePopup: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 8,
    minWidth: 250,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  shareItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 12,
  },
  shareItemText: {
    fontSize: 16,
    color: '#0F1419',
  },
});

export default ActionButtons;
