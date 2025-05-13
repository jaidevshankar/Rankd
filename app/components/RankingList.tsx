import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, StyleSheet, RefreshControl } from 'react-native';
import { rankingService, RankingResponse } from '../services/api';
import axios from 'axios';
import { FontAwesome } from '@expo/vector-icons';

interface RankingListProps {
  topic: string;
  userId: number;
}

export default function RankingList({ topic, userId }: RankingListProps) {
  const [rankings, setRankings] = useState<RankingResponse['ranking']>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadRankings();
  }, [topic, userId]);

  const loadRankings = async () => {
    try {
      setLoading(true);
      const response = await rankingService.getRankings(topic, userId);
      setRankings(response.ranking || []);
      setError(null);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.code === 'ERR_NETWORK') {
          setError('Cannot connect to the server. Make sure the backend is running and your network is configured correctly.');
        } else if (err.response) {
          setError(`Server error: ${err.response.status} - ${err.response.data?.message || 'Unknown error'}`);
        } else {
          setError('Network error. Please check your connection.');
        }
      } else {
        setError('Failed to load rankings');
      }
      console.error('Error loading rankings:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadRankings();
  };

  const handleCompare = async (itemId: string) => {
    try {
      const response = await rankingService.compareItems({
        user_id: userId,
        item_id: itemId,
        topic_name: topic
      });
      if (response.ranking) {
        setRankings(response.ranking);
      }
      setError(null);
    } catch (err) {
      setError('Failed to compare items');
      console.error('Error comparing items:', err);
    }
  };

  const handleRemove = async (itemId: string) => {
    try {
      await rankingService.removeItem({
        user_id: userId,
        item_id: itemId,
        topic_name: topic
      });
      // Refresh rankings after removal
      await loadRankings();
      setError(null);
    } catch (err) {
      setError('Failed to remove item');
      console.error('Error removing item:', err);
    }
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FFD700" />
      </View>
    );
  }

  if (error && !rankings.length) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity 
          onPress={loadRankings}
          style={styles.retryButton}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!rankings.length) {
    return (
      <ScrollView 
        style={styles.container}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#FFD700"
          />
        }
      >
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No rankings found for {topic}</Text>
          <Text style={styles.emptySubtext}>Add items from the search tab to start building your ranking</Text>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor="#FFD700"
        />
      }
    >
      {error && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorBannerText}>{error}</Text>
          <TouchableOpacity onPress={() => setError(null)}>
            <Text style={styles.dismissText}>Dismiss</Text>
          </TouchableOpacity>
        </View>
      )}
      
      {rankings.map((item, index) => (
        <View key={item.item_id} style={styles.itemContainer}>
          <View style={styles.rankContainer}>
            <Text style={styles.rankNumber}>{index + 1}</Text>
          </View>
          <View style={styles.itemInfo}>
            <Text style={styles.itemName}>{item.item_name || `Item ${item.item_id}`}</Text>
            <View style={styles.detailsContainer}>
              {item.score !== null && item.score !== undefined && (
                <View style={styles.scoreContainer}>
                  <Text style={styles.scoreLabel}>Score:</Text>
                  <Text style={styles.scoreValue}>
                    {typeof item.score === 'number' ? item.score.toFixed(2) : '—'}
                  </Text>
                </View>
              )}
            </View>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              onPress={() => handleCompare(item.item_id.toString())}
              style={styles.iconButton}
            >
              <FontAwesome name="exchange" size={14} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() => handleRemove(item.item_id.toString())}
              style={[styles.iconButton, styles.removeButton]}
            >
              <FontAwesome name="trash" size={14} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C1C1E',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1C1C1E',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#1C1C1E',
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  errorBanner: {
    backgroundColor: 'rgba(255, 59, 48, 0.2)',
    padding: 12,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  errorBannerText: {
    color: '#FF3B30',
    fontSize: 14,
    flex: 1,
  },
  dismissText: {
    color: '#FFD700',
    fontSize: 14,
    fontWeight: '600',
  },
  retryButton: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#1C1C1E',
    fontWeight: '600',
  },
  emptyContainer: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtext: {
    color: '#8E8E93',
    fontSize: 14,
    textAlign: 'center',
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2C2C2E',
    backgroundColor: '#1C1C1E',
  },
  rankContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2C2C2E',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  rankNumber: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  itemInfo: {
    flex: 1,
    marginRight: 12,
  },
  itemName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  detailsContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scoreLabel: {
    color: '#8E8E93',
    fontSize: 14,
    marginRight: 4,
  },
  scoreValue: {
    color: '#FFD700',
    fontSize: 14,
    fontWeight: '600',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'flex-end',
  },
  iconButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#2C2C2E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButton: {
    backgroundColor: '#3A3A3C',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  }
}); 