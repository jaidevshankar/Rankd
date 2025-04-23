import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000';

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
}

export const rankingService = {
  // Compare items
  compareItems: async (data: RankingItem): Promise<RankingResponse> => {
    try {
      const response = await axios.post(`${API_BASE_URL}/compare`, data);
      return response.data;
    } catch (error) {
      console.error('Error comparing items:', error);
      throw error;
    }
  },

  // Rerank an item
  rerankItem: async (data: RankingItem): Promise<RankingResponse> => {
    try {
      const response = await axios.post(`${API_BASE_URL}/rerank`, data);
      return response.data;
    } catch (error) {
      console.error('Error reranking item:', error);
      throw error;
    }
  },

  // Remove an item
  removeItem: async (data: RankingItem): Promise<{ message: string }> => {
    try {
      const response = await axios.post(`${API_BASE_URL}/remove`, data);
      return response.data;
    } catch (error) {
      console.error('Error removing item:', error);
      throw error;
    }
  },

  // Get rankings for a topic
  getRankings: async (topic: string): Promise<RankingResponse> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/rankings?topic=${topic}`);
      return response.data;
    } catch (error) {
      console.error('Error getting rankings:', error);
      throw error;
    }
  },
}; 