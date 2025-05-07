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
  item_id: string;
  topic_name: string;
}

export interface RankingResponse {
  message: string;
  ranking: Array<{
    item_id: number;
    item_name: string;
    score: number | null;
    category?: string;
  }>;
  status?: string;
  item_id?: number;
  item_name?: string;
  new_item?: {
    id: number | string;
    name: string;
  };
  comparison_item?: {
    id: number | string;
    name: string;
  };
  category?: string;
}

export interface CalibrationRequest {
  user_id: number;
  item_id: number;
  topic_name: string;
  category: string;
}

export interface ComparisonResponse {
  user_id: number;
  new_item_id: number;
  comparison_item_id: number;
  topic_name: string;
  is_better: boolean;
  category?: string;
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

  // Set category for an item (calibration phase)
  setCategory: async (data: CalibrationRequest): Promise<RankingResponse> => {
    const baseUrl = await getApiBaseUrl();
    try {
      const response = await axios.post(`${baseUrl}/set_category`, data);
      return response.data;
    } catch (error) {
      console.error('Error setting category:', error);
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

  // Get rankings for a topic
  getRankings: async (topic: string, userId: number = 1): Promise<RankingResponse> => {
    const baseUrl = await getApiBaseUrl();
    try {
      console.log(`Fetching rankings from: ${baseUrl}/rankings for topic: ${topic}, userId: ${userId}`);
      
      const response = await axios.get(`${baseUrl}/rankings`, {
        params: {
          topic: topic,
          user_id: userId
        },
        timeout: 10000 // 10 second timeout
      });
      
      // Make sure we return a valid response even if the backend returns unexpected data
      if (!response.data || !response.data.ranking) {
        console.error('Invalid response format from rankings API:', response.data);
        return { message: 'Invalid response format', ranking: [] };
      }
      
      console.log(`Successfully retrieved ${response.data.ranking.length} rankings`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.code === 'ERR_NETWORK') {
          console.error(`Network error connecting to ${baseUrl}. Is the server running?`);
        } else if (error.response) {
          console.error(`Server returned error ${error.response.status}:`, error.response.data);
        } else if (error.request) {
          console.error('Request was made but no response was received', error.request);
        }
      }
      console.error('Error getting rankings:', error);
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
  },

  // Check if user is in calibration mode
  checkCalibration: async (topic: string, userId: number = 1): Promise<{ is_calibration: boolean, item_count: number, items_needed: number }> => {
    const baseUrl = await getApiBaseUrl();
    try {
      const response = await axios.get(`${baseUrl}/check_calibration`, {
        params: {
          topic: topic,
          user_id: userId
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error checking calibration status:', error);
      // Default to calibration mode if there's an error
      return { is_calibration: true, item_count: 0, items_needed: 10 };
    }
  }
};

export default {}; 