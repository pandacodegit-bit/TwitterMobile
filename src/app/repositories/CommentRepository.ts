import { Comment, CommentsResponse } from '../types/Comment';
import { SAMPLE_COMMENTS } from '../data/sampleComments';

const USE_MOCK_DATA = __DEV__;

class CommentRepository {
  private static instance: CommentRepository;

  private constructor() {}

  public static getInstance(): CommentRepository {
    if (!CommentRepository.instance) {
      CommentRepository.instance = new CommentRepository();
    }
    return CommentRepository.instance;
  }

  async fetchComments(postId: string, limit: number = 20): Promise<CommentsResponse> {
    if (USE_MOCK_DATA) {
      return this.fetchMockComments(postId, limit);
    }
    // TODO: Replace with actual API call
    return this.fetchCommentsFromAPI(postId, limit);
  }

  async addComment(postId: string, text: string): Promise<Comment> {
    if (USE_MOCK_DATA) {
      return this.addMockComment(postId, text);
    }
    // TODO: Replace with actual API call
    return this.addCommentToAPI(postId, text);
  }

  async addReply(postId: string, commentId: string, text: string): Promise<Comment> {
    if (USE_MOCK_DATA) {
      return this.addMockReply(postId, commentId, text);
    }
    // TODO: Replace with actual API call
    return this.addReplyToAPI(postId, commentId, text);
  }

  async toggleCommentLike(commentId: string): Promise<{ isLiked: boolean; likes: number }> {
    if (USE_MOCK_DATA) {
      return this.toggleMockCommentLike(commentId);
    }
    // TODO: Replace with actual API call
    return this.toggleCommentLikeAPI(commentId);
  }

  // Mock implementations
  private async fetchMockComments(postId: string, limit: number): Promise<CommentsResponse> {
    await new Promise<void>(resolve => setTimeout(resolve, 500));
    
    // Filter comments by postId
    const filteredComments = SAMPLE_COMMENTS.filter(c => c.postId === postId);
    const commentsToReturn = filteredComments.slice(0, limit);
    
    return {
      comments: commentsToReturn,
      hasMore: filteredComments.length > limit,
    };
  }

  private async addMockComment(postId: string, text: string): Promise<Comment> {
    await new Promise<void>(resolve => setTimeout(resolve, 300));
    
    const newComment: Comment = {
      id: `c${Date.now()}`,
      postId,
      userId: 'currentUser',
      username: '@you',
      userDisplayName: 'You',
      userAvatar: 'https://i.pravatar.cc/150?img=1',
      text,
      timestamp: 'Just now',
      likes: 0,
      isLiked: false,
      replyCount: 0,
      replies: [],
    };
    
    return newComment;
  }

  private async addMockReply(postId: string, commentId: string, text: string): Promise<Comment> {
    await new Promise<void>(resolve => setTimeout(resolve, 300));
    
    const newReply: Comment = {
      id: `r${Date.now()}`,
      postId,
      userId: 'currentUser',
      username: '@you',
      userDisplayName: 'You',
      userAvatar: 'https://i.pravatar.cc/150?img=1',
      text,
      timestamp: 'Just now',
      likes: 0,
      isLiked: false,
      replyCount: 0,
      replies: [],
    };
    
    return newReply;
  }

  private async toggleMockCommentLike(_commentId: string): Promise<{ isLiked: boolean; likes: number }> {
    await new Promise<void>(resolve => setTimeout(resolve, 200));
    
    // In a real app, this would update the backend
    // For now, we'll just return mock toggle state
    return {
      isLiked: Math.random() > 0.5,
      likes: Math.floor(Math.random() * 100),
    };
  }

  // API implementations (placeholders)
  private async fetchCommentsFromAPI(postId: string, limit: number): Promise<CommentsResponse> {
    const response = await fetch(`/api/posts/${postId}/comments?limit=${limit}`);
    const data = await response.json();
    return data;
  }

  private async addCommentToAPI(postId: string, text: string): Promise<Comment> {
    const response = await fetch(`/api/posts/${postId}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });
    const data = await response.json();
    return data;
  }

  private async addReplyToAPI(postId: string, commentId: string, text: string): Promise<Comment> {
    const response = await fetch(`/api/posts/${postId}/comments/${commentId}/replies`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });
    const data = await response.json();
    return data;
  }

  private async toggleCommentLikeAPI(commentId: string): Promise<{ isLiked: boolean; likes: number }> {
    const response = await fetch(`/api/comments/${commentId}/like`, {
      method: 'POST',
    });
    const data = await response.json();
    return data;
  }
}

export const commentRepository = CommentRepository.getInstance();
