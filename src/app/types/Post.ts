export interface Post {
  id: string;
  type: 'text' | 'image' | 'video';
  profileImage: string;
  userName: string;
  userId: string;
  timestamp: string;
  text?: string;
  title?: string;
  imageUrl?: string;
  videoUrl?: string;
  thumbnailUrl?: string;
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
