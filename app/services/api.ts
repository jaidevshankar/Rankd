import axios from 'axios';
import { Platform } from 'react-native';
import { getApiBaseUrl } from './getApiBaseUrl';

// For Android devices, use 10.0.2.2 to connect to host's localhost
// For iOS simulator, localhost works
// For physical devices, you need your computer's IP address on the local network
const getBaseUrl = () => {
  // Use the host's IP address for all platforms in development
  if (__DEV__) {
    return 'http://10.193.129.73:8001';
  } else {
    // Production fallback
    if (Platform.OS === 'android') {
      // Special IP for Android emulator to connect to host localhost
      return 'http://10.0.2.2:8001';
    } else if (Platform.OS === 'ios') {
      // iOS simulator can use localhost
      return 'http://localhost:8001';
    } else {
      // For web or fallback
      return 'http://127.0.0.1:8001';
    }
  }
};

// For development, always use the explicit IP
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || getBaseUrl();

export interface RankingItem {
  user_id: number;
  item_id: number;
  topic_name: string;
}

export interface ComparisonResponse {
  user_id: number;
  new_item_id: number;
  comparison_item_id: number;
  topic_name: string;
  is_better: boolean;
}

export interface RankingResponse {
  status: string;
  message: string;
  ranking?: any[];
  new_item?: { id: number; name: string };
  comparison_item?: { id: number; name: string };
}

export const rankingService = {
  // Compare items
  compareItems: async (data: RankingItem): Promise<RankingResponse> => {
    const baseUrl = await getApiBaseUrl();
    try {
      const response = await axios.post(`${baseUrl}/compare`, data);
      return response.data;
    } catch (error) {
      console.error('Error comparing items:', error);
      throw error;
    }
  },

  // Get rankings for a topic
  getRankings: async (topic: string, userId: number): Promise<RankingResponse> => {
    const baseUrl = await getApiBaseUrl();
    try {
      const response = await axios.get(`${baseUrl}/rankings`, {
        params: { topic, user_id: userId }
      });
      return response.data;
    } catch (error) {
      console.error('Error getting rankings:', error);
      throw error;
    }
  },

  // Respond to comparison question
  respondComparison: async (data: ComparisonResponse): Promise<RankingResponse> => {
    const baseUrl = await getApiBaseUrl();
    try {
      const response = await axios.post(`${baseUrl}/respond_comparison`, data);
      return response.data;
    } catch (error) {
      console.error('Error responding to comparison:', error);
      throw error;
    }
  },

  // Rerank an item
  rerankItem: async (data: RankingItem): Promise<RankingResponse> => {
    const baseUrl = await getApiBaseUrl();
    try {
      const response = await axios.post(`${baseUrl}/rerank`, data);
      return response.data;
    } catch (error) {
      console.error('Error reranking item:', error);
      throw error;
    }
  },

  // Remove an item
  removeItem: async (data: RankingItem): Promise<{ message: string }> => {
    const baseUrl = await getApiBaseUrl();
    try {
      const response = await axios.post(`${baseUrl}/remove`, data);
      return response.data;
    } catch (error) {
      console.error('Error removing item:', error);
      throw error;
    }
  },

  // Get all topics
  getTopics: async (): Promise<string[]> => {
    const baseUrl = await getApiBaseUrl();
    try {
      const response = await axios.get(`${baseUrl}/topics`);
      if (response.data && Array.isArray(response.data.topics)) {
        return response.data.topics;
      }
      return ["Movies", "TV Shows", "Albums", "Books", "Video Games", "Restaurants"];
    } catch (error) {
      console.error('Error getting topics:', error);
      // Fallback to default topics if API fails
      return ["Movies", "TV Shows", "Albums", "Books", "Video Games", "Restaurants"];
    }
  }
};

export const friendsService = {
  // Get all accepted friends for a user
  getFriends: async (userId: number) => {
    const baseUrl = await getApiBaseUrl();
    const response = await axios.get(`${baseUrl}/friends`, { params: { user_id: userId } });
    return response.data;
  },
  // Fuzzy search for users to add as friends
  searchUsers: async (query: string, excludeUserId: number) => {
    const baseUrl = await getApiBaseUrl();
    const response = await axios.get(`${baseUrl}/friends/search`, { params: { query, exclude_user_id: excludeUserId } });
    return response.data;
  },
  // Send a friend request
  sendFriendRequest: async (userId: number, friendId: number) => {
    const baseUrl = await getApiBaseUrl();
    const response = await axios.post(`${baseUrl}/friends/request`, { user_id: userId, friend_id: friendId });
    return response.data;
  },
  // Accept a friend request
  acceptFriendRequest: async (userId: number, friendId: number) => {
    const baseUrl = await getApiBaseUrl();
    const response = await axios.post(`${baseUrl}/friends/accept`, { user_id: userId, friend_id: friendId });
    return response.data;
  },
  // Get outgoing and incoming friend requests
  getFriendRequests: async (userId: number) => {
    const baseUrl = await getApiBaseUrl();
    const response = await axios.get(`${baseUrl}/friends/requests`, { params: { user_id: userId } });
    return response.data;
  },
};

export default {}; 