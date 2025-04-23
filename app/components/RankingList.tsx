import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, StyleSheet } from 'react-native';
import { rankingService, RankingResponse } from '../services/api';

interface RankingListProps {
  topic: string;
  userId: number;
}

export default function RankingList({ topic, userId }: RankingListProps) {
  const [rankings, setRankings] = useState<RankingResponse['ranking']>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadRankings();
  }, [topic]);

  const loadRankings = async () => {
    try {
      setLoading(true);
      const response = await rankingService.getRankings(topic);
      setRankings(response.ranking);
      setError(null);
    } catch (err) {
      setError('Failed to load rankings');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCompare = async (itemId: string) => {
    try {
      const response = await rankingService.compareItems({
        user_id: userId,
        item_id: itemId,
        topic_name: topic
      });
      setRankings(response.ranking);
      setError(null);
    } catch (err) {
      setError('Failed to compare items');
      console.error(err);
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
      loadRankings();
      setError(null);
    } catch (err) {
      setError('Failed to remove item');
      console.error(err);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FFD700" />
      </View>
    );
  }

  if (error) {
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

  return (
    <ScrollView style={styles.container}>
      {rankings.map((item, index) => (
        <View key={item.item_id} style={styles.itemContainer}>
          <View style={styles.rankContainer}>
            <Text style={styles.rankNumber}>{index + 1}</Text>
          </View>
          <View style={styles.itemInfo}>
            <Text style={styles.itemName}>{item.item_name}</Text>
            <View style={styles.detailsContainer}>
              {item.score !== null && (
                <View style={styles.scoreContainer}>
                  <Text style={styles.scoreLabel}>Score:</Text>
                  <Text style={styles.scoreValue}>{item.score.toFixed(2)}</Text>
                </View>
              )}
              {item.category && (
                <View style={styles.categoryContainer}>
                  <Text style={styles.categoryLabel}>Category:</Text>
                  <Text style={styles.categoryValue}>{item.category}</Text>
                </View>
              )}
            </View>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              onPress={() => handleCompare(item.item_id.toString())}
              style={styles.compareButton}
            >
              <Text style={styles.buttonText}>Compare</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() => handleRemove(item.item_id.toString())}
              style={styles.removeButton}
            >
              <Text style={styles.buttonText}>Remove</Text>
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
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryLabel: {
    color: '#8E8E93',
    fontSize: 14,
    marginRight: 4,
  },
  categoryValue: {
    color: '#8E8E93',
    fontSize: 14,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  compareButton: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  removeButton: {
    backgroundColor: '#FF3B30',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  buttonText: {
    color: '#1C1C1E',
    fontWeight: '600',
    fontSize: 14,
  },
}); 