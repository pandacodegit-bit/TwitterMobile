import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, FlatList, TextInput } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Video from 'react-native-video';
import { Post } from '../types/Post';
import { Comment } from '../types/Comment';
import RepeatIcon from '../components/icons/RepeatIcon';
import HeartIcon from '../components/icons/HeartIcon';
import ChatIcon from '../components/icons/ChatIcon';
import PlayIcon from '../components/icons/PlayIcon';
import ChevronDownIcon from '../components/icons/ChevronDownIcon';
import CloseIcon from '../components/icons/CloseIcon';
import BookmarkIcon from '../components/icons/BookmarkIcon';
import PlusIcon from '../components/icons/PlusIcon';
import BellIcon from '../components/icons/BellIcon';
import { useVideo } from '../context/VideoContext';
import { useMinimizedPlayer } from '../context/MinimizedPlayerContext';

const VideoPage = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const params = route.params as { videoPost: Post & { currentTime?: number } } | undefined;
  const { getVideoTime } = useVideo();
  const { minimizeVideo, closePlayer: closeMinimizedPlayer } = useMinimizedPlayer();
  
  const [seekTime, setSeekTime] = useState<number | null>(null);
  const [paused, setPaused] = useState(false);
  const videoRef = useRef<any>(null);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [reposted, setReposted] = useState(false);
  const [repostCount, setRepostCount] = useState(0);
  const [relatedVideos, setRelatedVideos] = useState<Post[]>([]);
  const [showMore, setShowMore] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [currentPlayTime, setCurrentPlayTime] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState('');
  const [replyTexts, setReplyTexts] = useState<{ [key: string]: string }>({});
  const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (params?.videoPost) {
      // Get the current playback time from the previous screen
      const time = params.videoPost.currentTime || getVideoTime(params.videoPost.id);
      setSeekTime(time);
      // Ensure video starts playing
      setPaused(false);
      
      // Load mock comments
      setComments([
        {
          id: 'c1',
          postId: params.videoPost.id,
          userId: 'u2',
          username: '@johndoe',
          userDisplayName: 'John Doe',
          userAvatar: 'https://i.pravatar.cc/150?img=12',
          text: 'This is amazing! Thanks for sharing.',
          timestamp: '2h',
          likes: 24,
          isLiked: false,
          replyCount: 2,
          replies: [
            {
              id: 'c1r1',
              postId: params.videoPost.id,
              userId: 'u3',
              username: '@janedoe',
              userDisplayName: 'Jane Doe',
              userAvatar: 'https://i.pravatar.cc/150?img=45',
              text: 'I agree! This is really helpful.',
              timestamp: '1h',
              likes: 5,
              isLiked: false,
              replyCount: 0,
              replies: [],
            },
            {
              id: 'c1r2',
              postId: params.videoPost.id,
              userId: 'u4',
              username: '@bobsmith',
              userDisplayName: 'Bob Smith',
              userAvatar: 'https://i.pravatar.cc/150?img=33',
              text: 'Thanks for the tip!',
              timestamp: '30m',
              likes: 2,
              isLiked: false,
              replyCount: 0,
              replies: [],
            },
          ],
        },
        {
          id: 'c2',
          postId: params.videoPost.id,
          userId: 'u5',
          username: '@techguru',
          userDisplayName: 'Tech Guru',
          userAvatar: 'https://i.pravatar.cc/150?img=22',
          text: 'Great content! Looking forward to more.',
          timestamp: '4h',
          likes: 15,
          isLiked: false,
          replyCount: 0,
          replies: [],
        },
      ]);
    }
    
    // Mock related videos
    setRelatedVideos([
      {
        id: 'v1',
        userName: 'Tech Reviews',
        userId: 'techreviews',
        profileImage: 'https://i.pravatar.cc/150?img=30',
        text: 'Amazing new features in the latest update!',
        title: 'Top 5 Features You Must Try',
        timestamp: '1d',
        likes: 520,
        comments: 89,
        reposts: 156,
        analytics: '15K',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        thumbnailUrl: 'https://picsum.photos/800/450?random=v1',
      },
      {
        id: 'v2',
        userName: 'Code Master',
        userId: 'codemaster',
        profileImage: 'https://i.pravatar.cc/150?img=31',
        text: 'Learn this in 10 minutes!',
        title: 'Quick Tutorial: React Native Tips',
        timestamp: '2d',
        likes: 340,
        comments: 45,
        reposts: 78,
        analytics: '8.5K',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
        thumbnailUrl: 'https://picsum.photos/800/450?random=v2',
      },
      {
        id: 'v3',
        userName: 'Design Hub',
        userId: 'designhub',
        profileImage: 'https://i.pravatar.cc/150?img=32',
        text: 'Beautiful UI components showcase',
        title: 'Modern UI Design Patterns',
        timestamp: '3d',
        likes: 890,
        comments: 123,
        reposts: 234,
        analytics: '22K',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        thumbnailUrl: 'https://picsum.photos/800/450?random=v3',
      },
    ]);
  }, [params?.videoPost, getVideoTime]);

  // Initialize video interaction counts
  useEffect(() => {
    if (params?.videoPost) {
      setLikeCount(params.videoPost.likes || 0);
      setRepostCount(params.videoPost.reposts || 0);
    }
  }, [params?.videoPost]);

  const handleClose = () => {
    if (params?.videoPost) {
      minimizeVideo(params.videoPost, currentPlayTime, videoDuration, paused);
    }
    navigation.goBack();
  };

  const handleClosePlayer = () => {
    closeMinimizedPlayer();
    setPaused(true);
    navigation.goBack();
  };

  const handleVideoLike = () => {
    setLiked(!liked);
    setLikeCount(liked ? likeCount - 1 : likeCount + 1);
  };

  const handleVideoRepost = () => {
    setReposted(!reposted);
    setRepostCount(reposted ? repostCount - 1 : repostCount + 1);
  };

  const handleVideoPress = (videoItem: Post) => {
    const currentTime = getVideoTime(videoItem.id);
    (navigation as any).navigate('VideoPage', {
      videoPost: {
        ...videoItem,
        currentTime,
      },
    });
  };

  const handleCommentLike = (commentId: string) => {
    setComments(prevComments => {
      return prevComments.map(comment => {
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
      });
    });
  };

  const handleReply = (commentId: string) => {
    let username = '';
    for (const comment of comments) {
      if (comment.id === commentId) {
        username = comment.username;
        break;
      }
      // Check in replies
      for (const reply of comment.replies) {
        if (reply.id === commentId) {
          username = reply.username;
          break;
        }
      }
      if (username) break;
    }
    setReplyTexts(prev => ({
      ...prev,
      [commentId]: `${username} `,
    }));
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

  const handleAddComment = () => {
    if (commentText.trim() === '') return;

    const newComment: Comment = {
      id: Date.now().toString(),
      postId: params?.videoPost?.id || '',
      userId: 'currentuser',
      username: '@you',
      userDisplayName: 'You',
      userAvatar: 'https://i.pravatar.cc/150?img=1',
      text: commentText,
      timestamp: 'Just now',
      likes: 0,
      isLiked: false,
      replyCount: 0,
      replies: [],
    };

    setComments([newComment, ...comments]);
    setCommentText('');
  };

  const handleAddReply = (commentId: string) => {
    const replyText = replyTexts[commentId] || '';
    if (replyText.trim() === '') return;

    const newReply: Comment = {
      id: Date.now().toString(),
      postId: params?.videoPost?.id || '',
      userId: 'currentuser',
      username: '@you',
      userDisplayName: 'You',
      userAvatar: 'https://i.pravatar.cc/150?img=1',
      text: replyText,
      timestamp: 'Just now',
      likes: 0,
      isLiked: false,
      replyCount: 0,
      replies: [],
    };

    setComments(prevComments => {
      return prevComments.map(comment => {
        if (comment.id === commentId) {
          return {
            ...comment,
            replies: [...comment.replies, newReply],
            replyCount: comment.replyCount + 1,
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

  const renderRelatedVideoItem = ({ item }: { item: Post }) => (
    <TouchableOpacity 
      style={styles.videoItem} 
      onPress={() => handleVideoPress(item)}
      activeOpacity={0.9}
    >
      {/* Header with profile and meta info */}
      <View style={styles.videoInfoRow}>
        <Image 
          source={{ uri: item.profileImage }} 
          style={styles.relatedProfileImage} 
        />
        <View style={styles.videoInfo}>
          {item.title && (
            <Text style={styles.videoTitle} numberOfLines={1}>
              {item.title}
            </Text>
          )}
          <View style={styles.metaRow}>
            <Text style={styles.metaUserId}>{item.userId}</Text>
            {item.timestamp && (
              <>
                <Text style={styles.metaDot}> · </Text>
                <Text style={styles.metaTimestamp}>{item.timestamp}</Text>
              </>
            )}
          </View>
        </View>
      </View>

      {/* Video thumbnail with padding */}
      <View style={styles.relatedVideoWrapper}>
        <View style={styles.videoContainer}>
          <Image
            source={{ uri: item.thumbnailUrl || 'https://picsum.photos/800/450?random=' + item.id }}
            style={styles.videoThumbnail}
            resizeMode="cover"
          />
          <View style={styles.playIconOverlay}>
            <View style={styles.playIconContainer}>
              <PlayIcon color="#fff" size={32} filled={false} />
            </View>
          </View>
          <View style={styles.relatedRuntimeBadge}>
            <Text style={styles.runtimeText}>12:34</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (!params?.videoPost) {
    return null;
  }

  const video = params.videoPost;

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
          <ChevronDownIcon color="#fff" size={24} />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleClosePlayer} style={styles.closeButton}>
          <CloseIcon color="#fff" size={24} />
        </TouchableOpacity>
      </View>

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
          onLoad={(data) => {
            if (seekTime !== null && videoRef.current) {
              videoRef.current.seek(seekTime);
              setSeekTime(null);
            }
            setPaused(false);
            setVideoDuration(data.duration);
          }}
          onProgress={(data) => {
            setCurrentPlayTime(data.currentTime);
          }}
        />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.infoContainer}>
          {showMore && (
            <View style={styles.detailsHeader}>
              <Text style={styles.detailsHeaderTitle}>Description</Text>
              <TouchableOpacity onPress={() => setShowMore(false)} style={styles.detailsCloseButton}>
                <CloseIcon color="#fff" size={24} />
              </TouchableOpacity>
            </View>
          )}

          {showComments && (
            <View style={styles.detailsHeader}>
              <Text style={styles.detailsHeaderTitle}>Comments ({comments.length})</Text>
              <TouchableOpacity onPress={() => setShowComments(false)} style={styles.detailsCloseButton}>
                <CloseIcon color="#fff" size={24} />
              </TouchableOpacity>
            </View>
          )}

          {video.title && !showComments && (
            <Text style={styles.title} numberOfLines={showMore ? undefined : 1}>
              {video.title}
            </Text>
          )}

          {video.text && !showComments && (
            <View style={styles.descriptionContainer}>
              <Text style={styles.description} numberOfLines={showMore ? undefined : 1}>
                {video.text}
              </Text>
            </View>
          )}

          {showComments ? (
            <>
              {/* Comments View */}
              <View style={styles.commentsContainer}>
                {/* Comment Input */}
                <View style={styles.commentInputContainer}>
                  <Image
                    source={{ uri: 'https://i.pravatar.cc/150?img=1' }}
                    style={styles.commentInputAvatar}
                  />
                  <TextInput
                    style={styles.commentInput}
                    placeholder="Add a comment..."
                    placeholderTextColor="#888"
                    value={commentText}
                    onChangeText={setCommentText}
                    multiline
                  />
                  <TouchableOpacity
                    onPress={handleAddComment}
                    disabled={!commentText.trim()}
                    style={[styles.commentSendButton, !commentText.trim() && styles.commentSendButtonDisabled]}
                  >
                    <Text style={[styles.commentSendText, !commentText.trim() && styles.commentSendTextDisabled]}>
                      Post
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Comments List */}
                {comments.map((comment) => (
                  <View key={comment.id}>
                    {/* Main Comment */}
                    <View style={styles.commentItem}>
                      <Image source={{ uri: comment.userAvatar }} style={styles.commentAvatar} />
                      <View style={styles.commentContent}>
                        <View style={styles.commentCard}>
                          <View style={styles.commentCardContent}>
                            <View style={styles.commentHeader}>
                              <View style={styles.commentUserInfo}>
                                <Text style={styles.commentDisplayName}>{comment.userDisplayName}</Text>
                                <Text style={styles.commentUsername}>{comment.username}</Text>
                              </View>
                              <Text style={styles.commentTimestamp}>{comment.timestamp}</Text>
                            </View>
                            <Text style={styles.commentText}>{comment.text}</Text>
                          </View>
                        </View>

                        <View style={styles.commentActions}>
                          <TouchableOpacity style={styles.commentActionButton} onPress={() => handleCommentLike(comment.id)}>
                            <HeartIcon
                              color={comment.isLiked ? '#F91880' : '#888'}
                              size={16}
                              filled={comment.isLiked}
                            />
                            {comment.likes > 0 && (
                              <Text style={[styles.commentActionText, comment.isLiked && styles.commentLikedText]}>
                                {comment.likes}
                              </Text>
                            )}
                          </TouchableOpacity>

                          <TouchableOpacity style={styles.commentActionButton} onPress={() => handleReply(comment.id)}>
                            <ChatIcon color="#888" size={16} />
                            <Text style={styles.commentActionText}>Reply</Text>
                          </TouchableOpacity>

                          {comment.replyCount > 0 && (
                            <TouchableOpacity style={styles.commentActionButton} onPress={() => handleShowReplies(comment.id)}>
                              <Text style={styles.commentRepliesText}>
                                {comment.replyCount} {comment.replyCount === 1 ? 'reply' : 'replies'}
                              </Text>
                            </TouchableOpacity>
                          )}
                        </View>

                        {/* Reply Input */}
                        {replyTexts[comment.id] !== undefined && (
                          <View style={styles.replyInputContainer}>
                            <Image
                              source={{ uri: 'https://i.pravatar.cc/150?img=1' }}
                              style={styles.replyInputAvatar}
                            />
                            <TextInput
                              style={styles.replyInput}
                              placeholder="Write a reply..."
                              placeholderTextColor="#888"
                              value={replyTexts[comment.id]}
                              onChangeText={(text) => setReplyTexts(prev => ({ ...prev, [comment.id]: text }))}
                              multiline
                              autoFocus
                            />
                            <TouchableOpacity
                              onPress={() => handleAddReply(comment.id)}
                              disabled={!replyTexts[comment.id]?.trim()}
                              style={[styles.replySendButton, !replyTexts[comment.id]?.trim() && styles.commentSendButtonDisabled]}
                            >
                              <Text style={[styles.replySendText, !replyTexts[comment.id]?.trim() && styles.commentSendTextDisabled]}>
                                Reply
                              </Text>
                            </TouchableOpacity>
                          </View>
                        )}
                      </View>
                    </View>

                    {/* Replies */}
                    {expandedComments.has(comment.id) && comment.replies.map((reply) => (
                      <View key={reply.id} style={styles.replyItem}>
                        <Image source={{ uri: reply.userAvatar }} style={styles.commentAvatar} />
                        <View style={styles.commentContent}>
                          <View style={styles.commentCard}>
                            <View style={styles.commentCardContent}>
                              <View style={styles.commentHeader}>
                                <View style={styles.commentUserInfo}>
                                  <Text style={styles.commentDisplayName}>{reply.userDisplayName}</Text>
                                  <Text style={styles.commentUsername}>{reply.username}</Text>
                                </View>
                                <Text style={styles.commentTimestamp}>{reply.timestamp}</Text>
                              </View>
                              <Text style={styles.commentText}>{reply.text}</Text>
                            </View>
                          </View>

                          <View style={styles.commentActions}>
                            <TouchableOpacity style={styles.commentActionButton} onPress={() => handleCommentLike(reply.id)}>
                              <HeartIcon
                                color={reply.isLiked ? '#F91880' : '#888'}
                                size={16}
                                filled={reply.isLiked}
                              />
                              {reply.likes > 0 && (
                                <Text style={[styles.commentActionText, reply.isLiked && styles.commentLikedText]}>
                                  {reply.likes}
                                </Text>
                              )}
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.commentActionButton} onPress={() => handleReply(reply.id)}>
                              <ChatIcon color="#888" size={16} />
                              <Text style={styles.commentActionText}>Reply</Text>
                            </TouchableOpacity>
                          </View>

                          {/* Reply Input for nested reply */}
                          {replyTexts[reply.id] !== undefined && (
                            <View style={styles.replyInputContainer}>
                              <Image
                                source={{ uri: 'https://i.pravatar.cc/150?img=1' }}
                                style={styles.replyInputAvatar}
                              />
                              <TextInput
                                style={styles.replyInput}
                                placeholder="Write a reply..."
                                placeholderTextColor="#888"
                                value={replyTexts[reply.id]}
                                onChangeText={(text) => setReplyTexts(prev => ({ ...prev, [reply.id]: text }))}
                                multiline
                                autoFocus
                              />
                              <TouchableOpacity
                                onPress={() => handleAddReply(comment.id)}
                                disabled={!replyTexts[reply.id]?.trim()}
                                style={[styles.replySendButton, !replyTexts[reply.id]?.trim() && styles.commentSendButtonDisabled]}
                              >
                                <Text style={[styles.replySendText, !replyTexts[reply.id]?.trim() && styles.commentSendTextDisabled]}>
                                  Reply
                                </Text>
                              </TouchableOpacity>
                            </View>
                          )}
                        </View>
                      </View>
                    ))}
                  </View>
                ))}
              </View>
            </>
          ) : showMore ? (
            <>
              {/* Expanded Details View */}
              <View style={styles.detailsContainer}>
                <View style={styles.modalStatsRow}>
                  {/* Likes Chip */}
                  <View style={styles.statChip}>
                    <Text style={styles.statCount}>{likeCount}</Text>
                    <Text style={styles.statLabel}>likes</Text>
                  </View>

                  {/* Views Chip */}
                  <View style={styles.statChip}>
                    <Text style={styles.statCount}>{video.analytics}</Text>
                    <Text style={styles.statLabel}>views</Text>
                  </View>

                  {/* Timestamp Chip */}
                  <View style={styles.statChip}>
                    <Text style={styles.statCount}>{video.timestamp}</Text>
                    <Text style={styles.statLabel}>ago</Text>
                  </View>
                </View>
              </View>
            </>
          ) : (
            <>
              {/* Collapsed View */}
              <View style={styles.metaInfoRow}>
                <Text style={styles.metaText}>{video.userId}</Text>
                <Text style={styles.metaDot}>·</Text>
                <Text style={styles.metaText}>{video.analytics} views</Text>
                <Text style={styles.metaDot}>·</Text>
                <Text style={styles.metaText}>{video.timestamp}</Text>
                <TouchableOpacity onPress={() => setShowMore(true)} activeOpacity={0.7}>
                  <Text style={styles.showMoreMetaText}>...more</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.actionsSection}>
                <View style={styles.actionsRow}>
                  {/* Profile Image */}
                  <Image 
                    source={{ uri: video.profileImage }} 
                    style={styles.actionProfileImage} 
                  />

                  {/* Subscribe/Bell Icon */}
                  <TouchableOpacity style={styles.actionButton} activeOpacity={0.7}>
                    <BellIcon color="#fff" size={24} filled={false} />
                  </TouchableOpacity>

                  {/* Like Icon */}
                  <TouchableOpacity 
                    style={styles.actionButton}
                    onPress={handleVideoLike}
                    activeOpacity={0.7}
                  >
                    <HeartIcon color={liked ? "#F91880" : "#fff"} size={24} filled={liked} />
                    {/* <Text style={styles.actionCount}>{likeCount}</Text> */}
                  </TouchableOpacity>

                  {/* Repost Icon */}
                  <TouchableOpacity 
                    style={styles.actionButton}
                    onPress={handleVideoRepost}
                    activeOpacity={0.7}
                  >
                    <RepeatIcon color={reposted ? "#00BA7C" : "#fff"} size={24} />
                    {/* <Text style={styles.actionCount}>{repostCount}</Text> */}
                  </TouchableOpacity>

                  {/* Bookmark Icon */}
                  <TouchableOpacity style={styles.actionButton} activeOpacity={0.7}>
                    <BookmarkIcon color="#fff" size={24} filled={false} />
                  </TouchableOpacity>

                  {/* Add to Playlist Icon */}
                  <TouchableOpacity style={styles.actionButton} activeOpacity={0.7}>
                    <PlusIcon color="#fff" size={24} />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Comments Preview Section */}
              <View style={styles.commentsPreviewSection}>
                <View style={styles.commentsPreviewHeader}>
                  <Text style={styles.commentsPreviewTitle}>
                    Comments {comments.length > 0 && `(${comments.length})`}
                  </Text>
                </View>
                {comments.slice(0, 2).map((comment) => (
                  <View key={comment.id} style={styles.commentPreviewItem}>
                    <Image source={{ uri: comment.userAvatar }} style={styles.commentPreviewAvatar} />
                    <View style={styles.commentPreviewContent}>
                      <View style={styles.commentPreviewMeta}>
                        <Text style={styles.commentPreviewUsername}>{comment.userDisplayName}</Text>
                        <Text style={styles.commentPreviewTimestamp}>{comment.timestamp}</Text>
                      </View>
                      <Text style={styles.commentPreviewText} numberOfLines={2}>
                        {comment.text}
                      </Text>
                    </View>
                  </View>
                ))}
                {comments.length > 0 && (
                  <TouchableOpacity 
                    style={styles.viewAllCommentsButton}
                    onPress={() => setShowComments(true)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.viewAllCommentsText}>
                      View all {comments.length} comments
                    </Text>
                  </TouchableOpacity>
                )}
              </View>

              {/* Related Videos */}
              <View style={styles.relatedVideosSection}>
                <Text style={styles.relatedVideosTitle}>Related Videos</Text>
                <FlatList
                  data={relatedVideos}
                  renderItem={renderRelatedVideoItem}
                  keyExtractor={(item) => item.id}
                  scrollEnabled={false}
                  showsVerticalScrollIndicator={false}
                />
              </View>
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
    zIndex: 10,
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
    backgroundColor: '#000',
    paddingBottom: 32,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  descriptionContainer: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    lineHeight: 18,
    color: '#fff',
  },
  showMoreText: {
    fontSize: 14,
    color: '#1D9BF0',
    marginTop: 4,
  },
  detailsContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 20,
  },
  detailsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  detailsHeaderTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  detailsCloseButton: {
    padding: 4,
  },
  expandedMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
    flexWrap: 'wrap',
  },
  expandedMetaText: {
    fontSize: 13,
    color: '#fff',
    marginRight: 4,
    fontWeight: '600',
  },
  metaInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
    flexWrap: 'wrap',
  },
  metaText: {
    fontSize: 13,
    color: '#fff',
    marginRight: 4,
  },
  showMoreMetaText: {
    fontSize: 13,
    color: '#fff',
    marginRight: 4,
  },
  metaDot: {
    fontSize: 13,
    color: '#fff',
    marginHorizontal: 4,
  },
  actionsSection: {
    marginBottom: 20,
    width: '100%',
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 16,
  },
  actionProfileImage: {
    width: 36,
    height: 36,
    borderRadius: 4,
    marginRight: 4,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  actionCount: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '600',
  },
  commentsPreviewSection: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  commentsPreviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  commentsPreviewTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  commentPreviewItem: {
    flexDirection: 'row',
    marginBottom: 12,
    gap: 8,
  },
  commentPreviewAvatar: {
    width: 32,
    height: 32,
    borderRadius: 4,
    backgroundColor: '#222',
  },
  commentPreviewContent: {
    flex: 1,
  },
  commentPreviewMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  commentPreviewUsername: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginRight: 8,
  },
  commentPreviewTimestamp: {
    fontSize: 12,
    color: '#aaa',
  },
  commentPreviewText: {
    fontSize: 14,
    color: '#fff',
    lineHeight: 20,
    marginTop: 2,
  },
  viewAllCommentsButton: {
    marginTop: 4,
  },
  viewAllCommentsText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '600',
  },
  relatedVideosSection: {
    borderTopWidth: 8,
    borderTopColor: '#111',
    paddingTop: 16,
  },
  relatedVideosTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  videoItem: {
    marginBottom: 10,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  videoInfoRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 8,
    alignItems: 'center',
  },
  relatedProfileImage: {
    width: 40,
    height: 40,
    borderRadius: 4,
    backgroundColor: '#222',
    marginRight: 12,
  },
  videoInfo: {
    flex: 1,
  },
  videoTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  metaUserId: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '400',
    marginRight: 4,
  },
  metaTimestamp: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '400',
  },
  relatedVideoWrapper: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  videoContainer: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: '#111',
    position: 'relative',
    borderRadius: 16,
    overflow: 'hidden',
  },
  videoThumbnail: {
    width: '100%',
    height: '100%',
    backgroundColor: '#111',
  },
  playIconOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 12,
    paddingVertical: 8,
  },
  statChip: {
    flex: 1,
    backgroundColor: '#2a2a2a',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statCount: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    color: '#aaa',
    textTransform: 'lowercase',
  },
  commentsContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 20,
  },
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingBottom: 16,
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
    gap: 12,
  },
  commentInputAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#222',
  },
  commentInput: {
    flex: 1,
    fontSize: 14,
    color: '#fff',
    minHeight: 32,
    maxHeight: 80,
    paddingVertical: 6,
    paddingHorizontal: 0,
  },
  commentSendButton: {
    backgroundColor: '#1D9BF0',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
  },
  commentSendButtonDisabled: {
    backgroundColor: '#333',
  },
  commentSendText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  commentSendTextDisabled: {
    color: '#666',
  },
  commentItem: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 12,
  },
  replyItem: {
    flexDirection: 'row',
    marginBottom: 16,
    marginLeft: 44,
    gap: 12,
  },
  commentAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#222',
  },
  commentContent: {
    flex: 1,
    gap: 8,
  },
  commentCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 12,
  },
  commentCardContent: {
    gap: 8,
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  commentUserInfo: {
    flex: 1,
    gap: 2,
  },
  commentDisplayName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
  },
  commentUsername: {
    fontSize: 14,
    color: '#888',
  },
  commentTimestamp: {
    fontSize: 14,
    color: '#888',
  },
  commentText: {
    fontSize: 15,
    color: '#fff',
    lineHeight: 20,
  },
  commentActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginLeft: 12,
  },
  commentActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  commentActionText: {
    fontSize: 13,
    color: '#888',
  },
  commentLikedText: {
    color: '#F91880',
  },
  commentRepliesText: {
    fontSize: 13,
    color: '#1D9BF0',
    fontWeight: '500',
  },
  replyInputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginTop: 4,
  },
  replyInputAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#222',
  },
  replyInput: {
    flex: 1,
    fontSize: 14,
    color: '#fff',
    minHeight: 32,
    maxHeight: 60,
    paddingVertical: 6,
    paddingHorizontal: 0,
  },
  replySendButton: {
    backgroundColor: '#1D9BF0',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
  },
  replySendText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  relatedRuntimeBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  runtimeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
});

export default VideoPage;
