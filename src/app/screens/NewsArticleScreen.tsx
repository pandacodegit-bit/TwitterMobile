import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Image
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ArrowLeftIcon from '../components/icons/ArrowLeftIcon';
import BookmarkIcon from '../components/icons/BookmarkIcon';
import ExportIcon from '../components/icons/ExportIcon';
import HeartIcon from '../components/icons/HeartIcon';
import ChatIcon from '../components/icons/ChatIcon';
import RepeatIcon from '../components/icons/RepeatIcon';
import { Post } from '../types/Post';

interface NewsArticleParams {
  newsPost: Post;
}

interface RelatedPost {
  id: string;
  profileImage: string;
  userName: string;
  userId: string;
  text: string;
  imageUrl?: string;
  timestamp: string;
  views: string;
  likes: number;
  comments: number;
  reposts: number;
}

const RELATED_POSTS: RelatedPost[] = [
  {
    id: 'rp1',
    profileImage: 'https://i.pravatar.cc/150?img=50',
    userName: 'Tech Insider',
    userId: 'techinsider',
    text: 'AI is transforming healthcare with faster diagnostics.',
    imageUrl: 'https://picsum.photos/600/400?random=100',
    timestamp: '2h',
    views: '12.5K',
    likes: 245,
    comments: 34,
    reposts: 12,
  },
  {
    id: 'rp2',
    profileImage: 'https://i.pravatar.cc/150?img=51',
    userName: 'News Daily',
    userId: 'newsdaily',
    text: 'Major breakthrough in quantum computing announced today.',
    timestamp: '3h',
    views: '8.2K',
    likes: 189,
    comments: 27,
    reposts: 8,
  },
  {
    id: 'rp3',
    profileImage: 'https://i.pravatar.cc/150?img=52',
    userName: 'Science Hub',
    userId: 'sciencehub',
    text: 'New study reveals surprising benefits of morning exercise.',
    imageUrl: 'https://picsum.photos/600/400?random=101',
    timestamp: '4h',
    views: '15.3K',
    likes: 312,
    comments: 45,
    reposts: 19,
  },
  {
    id: 'rp4',
    profileImage: 'https://i.pravatar.cc/150?img=53',
    userName: 'World Report',
    userId: 'worldreport',
    text: 'Global summit addresses climate change initiatives.',
    timestamp: '5h',
    views: '22.1K',
    likes: 567,
    comments: 89,
    reposts: 45,
  },
  {
    id: 'rp5',
    profileImage: 'https://i.pravatar.cc/150?img=54',
    userName: 'Innovation Weekly',
    userId: 'innovationweekly',
    text: 'Electric vehicles now account for 40% of new car sales.',
    imageUrl: 'https://picsum.photos/600/400?random=102',
    timestamp: '6h',
    views: '18.7K',
    likes: 423,
    comments: 56,
    reposts: 28,
  },
  {
    id: 'rp6',
    profileImage: 'https://i.pravatar.cc/150?img=55',
    userName: 'Finance Today',
    userId: 'financetoday',
    text: 'Stock markets hit record highs amid economic recovery.',
    timestamp: '7h',
    views: '9.8K',
    likes: 178,
    comments: 23,
    reposts: 11,
  },
  {
    id: 'rp7',
    profileImage: 'https://i.pravatar.cc/150?img=56',
    userName: 'Health News',
    userId: 'healthnews',
    text: 'New vaccine shows 95% effectiveness in clinical trials.',
    imageUrl: 'https://picsum.photos/600/400?random=103',
    timestamp: '8h',
    views: '31.2K',
    likes: 892,
    comments: 134,
    reposts: 67,
  },
  {
    id: 'rp8',
    profileImage: 'https://i.pravatar.cc/150?img=57',
    userName: 'Space Daily',
    userId: 'spacedaily',
    text: 'NASA discovers potentially habitable exoplanet.',
    timestamp: '9h',
    views: '45.6K',
    likes: 1234,
    comments: 201,
    reposts: 98,
  },
  {
    id: 'rp9',
    profileImage: 'https://i.pravatar.cc/150?img=58',
    userName: 'Education Now',
    userId: 'educationnow',
    text: 'Online learning platforms see unprecedented growth.',
    imageUrl: 'https://picsum.photos/600/400?random=104',
    timestamp: '10h',
    views: '12.9K',
    likes: 267,
    comments: 38,
    reposts: 15,
  },
  {
    id: 'rp10',
    profileImage: 'https://i.pravatar.cc/150?img=59',
    userName: 'Business Wire',
    userId: 'businesswire',
    text: 'Tech startups raise record funding in Q4.',
    timestamp: '11h',
    views: '7.4K',
    likes: 145,
    comments: 19,
    reposts: 7,
  },
];

const NewsArticleScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const params = route.params as NewsArticleParams | undefined;
  const newsPost = params?.newsPost;

  // State for managing post interactions
  const [postStates, setPostStates] = useState<{
    [key: string]: {
      liked: boolean;
      likeCount: number;
      reposted: boolean;
      repostCount: number;
      bookmarked: boolean;
    };
  }>(() => {
    // Initialize state for all related posts
    const initialState: any = {};
    RELATED_POSTS.forEach(post => {
      initialState[post.id] = {
        liked: false,
        likeCount: post.likes,
        reposted: false,
        repostCount: post.reposts,
        bookmarked: false,
      };
    });
    return initialState;
  });

  if (!newsPost) {
    return null;
  }

  const handleBookmark = () => {
    console.log('Bookmark article');
  };

  const handleShare = () => {
    console.log('Share article');
  };

  // Article content - use provided articleContent or default
  const articleContent = newsPost.articleContent || 'Artificial intelligence is rapidly transforming industries across the globe, from healthcare and finance to education and entertainment. The technology has evolved from simple automation to sophisticated systems capable of learning, adapting, and making complex decisions. Machine learning algorithms now power everything from personalized recommendations to autonomous vehicles, reshaping how we interact with technology daily.\n\nOne of the most significant impacts of AI has been in the medical field, where algorithms can now detect diseases earlier and more accurately than traditional methods. Researchers have developed neural networks that can identify cancerous tumors in medical imaging with remarkable precision, often surpassing human radiologists in both speed and accuracy. This advancement promises to save countless lives through earlier intervention and more effective treatment planning.\n\nThe integration of AI into our daily lives raises important questions about privacy, ethics, and the future of work. As machines become more capable of performing tasks traditionally done by humans, society must grapple with how to ensure these technologies benefit everyone. Regulatory frameworks are still catching up with the rapid pace of innovation, creating uncertainty about how AI will be governed and controlled.\n\nLooking ahead, experts predict that AI will continue to evolve at an exponential rate, potentially leading to breakthroughs we can barely imagine today. From solving climate change to unlocking the mysteries of the universe, artificial intelligence represents one of humanity\'s most powerful tools for addressing the challenges of the future.';

  // For organic articles, don't show related posts
  const showRelatedPosts = newsPost.type !== 'organic-article';

  const handlePostLike = (postId: string) => {
    setPostStates(prev => ({
      ...prev,
      [postId]: {
        ...prev[postId],
        liked: !prev[postId].liked,
        likeCount: prev[postId].liked ? prev[postId].likeCount - 1 : prev[postId].likeCount + 1,
      },
    }));
  };

  const handlePostComment = (postId: string) => {
    const post = RELATED_POSTS.find(p => p.id === postId);
    if (post) {
      (navigation as any).navigate('PostComments', {
        postId: post.id,
        postAuthor: {
          profileImage: post.profileImage,
          userName: post.userName,
          userId: post.userId,
        },
        postText: post.text,
        postImage: post.imageUrl,
        commentsCount: post.comments,
      });
    }
  };

  const handlePostRepost = (postId: string) => {
    setPostStates(prev => ({
      ...prev,
      [postId]: {
        ...prev[postId],
        reposted: !prev[postId].reposted,
        repostCount: prev[postId].reposted ? prev[postId].repostCount - 1 : prev[postId].repostCount + 1,
      },
    }));
  };

  const handlePostBookmark = (postId: string) => {
    setPostStates(prev => ({
      ...prev,
      [postId]: {
        ...prev[postId],
        bookmarked: !prev[postId].bookmarked,
      },
    }));
  };

  const handlePostShare = (postId: string) => {
    console.log('Share post:', postId);
    // In a real app, this would open a share sheet
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <ArrowLeftIcon color="#0F1419" size={24} />
        </TouchableOpacity>
        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={styles.headerIconButton}
            onPress={handleBookmark}
            activeOpacity={0.7}
          >
            <BookmarkIcon color="#0F1419" size={22} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.headerIconButton}
            onPress={handleShare}
            activeOpacity={0.7}
          >
            <ExportIcon color="#0F1419" size={22} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
      >

        {/* Article Image */}
        {newsPost.imageUrl && (
          <View style={styles.articleImageContainer}>
            <Image
              source={{ uri: newsPost.imageUrl }}
              style={styles.articleImage}
              resizeMode="cover"
            />
          </View>
        )}
        {/* Article Title - max 3 lines */}
        <View style={styles.articleHeader}>
          <Text style={styles.articleTitle} numberOfLines={3}>{newsPost.text}</Text>
          
          {/* Author info */}
          <View style={styles.authorSection}>
            <Image 
              source={{ uri: newsPost.profileImage || 'https://i.pravatar.cc/150?img=1' }} 
              style={styles.authorImage} 
            />
            <View style={styles.authorInfo}>
              <Text style={styles.authorName}>{newsPost.userName || 'John Doe'}</Text>
              <Text style={styles.authorMeta}>
                {newsPost.timestamp || '2h'} · {(newsPost as any).views || '12.5K'} views
              </Text>
            </View>
          </View>
        </View>

        {/* Article Content - single paragraph */}
        <View style={styles.articleContent}>
          <Text style={styles.articleText}>{articleContent}</Text>
        </View>
      </ScrollView>
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
    backgroundColor: '#fff',
  },
  backButton: {
    padding: 4,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  headerIconButton: {
    padding: 4,
  },
  content: {
    flex: 1,
  },
  articleHeader: {
    padding: 20,
    paddingBottom: 16,
  },
  articleTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#0F1419',
    lineHeight: 36,
    marginBottom: 16,
  },
  authorSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  authorImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E1E8ED',
    marginRight: 12,
  },
  authorInfo: {
    flex: 1,
  },
  authorName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F1419',
    marginBottom: 2,
  },
  authorMeta: {
    fontSize: 14,
    color: '#536471',
  },
  articleImageContainer: {
    // paddingHorizontal: 20,
  },
  articleImage: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: '#EFF3F4',
    // borderRadius: 12,
  },
  articleContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  articleText: {
    fontSize: 17,
    lineHeight: 28,
    color: '#0F1419',
  },
});

export default NewsArticleScreen;
