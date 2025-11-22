import { Post, PostsResponse } from '../types/Post';
import { SAMPLE_POSTS } from '../data/samplePosts';

// Configuration flag to switch between mock and real API
// Use mock data in debug/development, real API in production
const USE_MOCK_DATA = __DEV__;

// API configuration
const API_BASE_URL = 'https://api.example.com'; // Replace with your actual API URL

class PostRepository {
  /**
   * Fetch posts from the feed
   * @param limit - Number of posts to fetch
   * @param cursor - Pagination cursor (optional)
   * @returns Promise with posts and pagination info
   */
  async fetchPosts(limit: number = 10, cursor?: string): Promise<PostsResponse> {
    if (USE_MOCK_DATA) {
      return this.fetchMockPosts(limit, cursor);
    }
    
    return this.fetchFromAPI(limit, cursor);
  }

  /**
   * Fetch discover posts (trending, recommended content)
   * @param limit - Number of posts to fetch
   * @param cursor - Pagination cursor (optional)
   * @returns Promise with posts and pagination info
   */
  async fetchDiscoverPosts(limit: number = 10, cursor?: string): Promise<PostsResponse> {
    if (USE_MOCK_DATA) {
      return this.fetchMockDiscoverPosts(limit, cursor);
    }
    
    return this.fetchDiscoverFromAPI(limit, cursor);
  }

  /**
   * Fetch a single post by ID
   * @param postId - The ID of the post to fetch
   * @returns Promise with the post
   */
  async fetchPostById(postId: string): Promise<Post | null> {
    if (USE_MOCK_DATA) {
      return this.fetchMockPostById(postId);
    }
    
    return this.fetchPostFromAPI(postId);
  }

  /**
   * Like/unlike a post
   * @param postId - The ID of the post to like
   * @param isLiked - Whether to like or unlike
   */
  async toggleLike(postId: string, isLiked: boolean): Promise<boolean> {
    if (USE_MOCK_DATA) {
      // Simulate API call
      return new Promise((resolve) => {
        setTimeout(() => resolve(true), 300);
      });
    }
    
    try {
      const response = await fetch(`${API_BASE_URL}/posts/${postId}/like`, {
        method: isLiked ? 'POST' : 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.ok;
    } catch (error) {
      console.error('Error toggling like:', error);
      return false;
    }
  }

  /**
   * Repost/unrepost a post
   * @param postId - The ID of the post to repost
   * @param isReposted - Whether to repost or unrepost
   */
  async toggleRepost(postId: string, isReposted: boolean): Promise<boolean> {
    if (USE_MOCK_DATA) {
      // Simulate API call
      return new Promise((resolve) => {
        setTimeout(() => resolve(true), 300);
      });
    }
    
    try {
      const response = await fetch(`${API_BASE_URL}/posts/${postId}/repost`, {
        method: isReposted ? 'POST' : 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.ok;
    } catch (error) {
      console.error('Error toggling repost:', error);
      return false;
    }
  }

  // Private methods for mock data
  private async fetchMockPosts(limit: number, cursor?: string): Promise<PostsResponse> {
    // Simulate network delay
    await new Promise<void>(resolve => setTimeout(() => resolve(), 500));
    
    const startIndex = cursor ? parseInt(cursor, 10) : 0;
    const endIndex = startIndex + limit;
    const posts = SAMPLE_POSTS.slice(startIndex, endIndex);
    
    return {
      posts,
      hasMore: endIndex < SAMPLE_POSTS.length,
      nextCursor: endIndex < SAMPLE_POSTS.length ? endIndex.toString() : undefined,
    };
  }

  private async fetchMockPostById(postId: string): Promise<Post | null> {
    // Simulate network delay
    await new Promise<void>(resolve => setTimeout(() => resolve(), 300));
    
    return SAMPLE_POSTS.find(post => post.id === postId) || null;
  }

  private async fetchMockDiscoverPosts(limit: number, cursor?: string): Promise<PostsResponse> {
    // Simulate network delay
    await new Promise<void>(resolve => setTimeout(() => resolve(), 500));
    
    // For discover, we can shuffle or filter the sample posts differently
    const shuffledPosts = [...SAMPLE_POSTS].sort(() => Math.random() - 0.5);
    
    const startIndex = cursor ? parseInt(cursor, 10) : 0;
    const endIndex = startIndex + limit;
    const posts = shuffledPosts.slice(startIndex, endIndex);
    
    return {
      posts,
      hasMore: endIndex < shuffledPosts.length,
      nextCursor: endIndex < shuffledPosts.length ? endIndex.toString() : undefined,
    };
  }

  // Private methods for real API calls
  private async fetchFromAPI(limit: number, cursor?: string): Promise<PostsResponse> {
    try {
      const params = new URLSearchParams({
        limit: limit.toString(),
        ...(cursor && { cursor }),
      });

      const response = await fetch(`${API_BASE_URL}/posts?${params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // Add authentication headers here
          // 'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch posts');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching posts from API:', error);
      throw error;
    }
  }

  private async fetchPostFromAPI(postId: string): Promise<Post | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/posts/${postId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // Add authentication headers here
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch post');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching post from API:', error);
      return null;
    }
  }

  private async fetchDiscoverFromAPI(limit: number, cursor?: string): Promise<PostsResponse> {
    try {
      const params = new URLSearchParams({
        limit: limit.toString(),
        ...(cursor && { cursor }),
      });

      const response = await fetch(`${API_BASE_URL}/discover?${params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // Add authentication headers here
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch discover posts');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching discover posts from API:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const postRepository = new PostRepository();
