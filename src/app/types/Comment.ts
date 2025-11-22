export interface Comment {
  id: string;
  postId: string;
  userId: string;
  username: string;
  userDisplayName: string;
  userAvatar: string;
  text: string;
  timestamp: string;
  likes: number;
  isLiked: boolean;
  replies: Comment[];
  replyCount: number;
}

export interface CommentsResponse {
  comments: Comment[];
  hasMore: boolean;
  nextPage?: number;
}
