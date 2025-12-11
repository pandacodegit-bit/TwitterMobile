export interface Post {
  id: string;
  type: 'text' | 'image' | 'video' | 'headline' | 'linked-article' | 'organic-article';
  profileImage: string;
  userName: string;
  userId: string;
  timestamp: string;
  text?: string;
  title?: string;
  imageUrl?: string;
  imageUrls?: string[]; // Support for multiple images
  articleImage?: string; // For news article full view
  videoUrl?: string;
  thumbnailUrl?: string;
  category?: string; // For headline type: News, Entertainment, Sports, etc.
  postCount?: string; // For headline type: e.g., "1.4K posts"
  linkSource?: string; // For linked-article type: e.g., "nytimes.com"
  articleContent?: string; // For organic-article type: article paragraph content
  comments: number;
  reposts: number;
  likes: number;
  analytics: number;
}

export interface PostsResponse {
  posts: Post[];
  hasMore: boolean;
  nextCursor?: string;
}
