import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { rankingService, RankingResponse } from './services/api';
import axios from 'axios';

const topics = ["Albums", "Movies", "TV Shows", "Books", "Video Games", "Restaurants"];

export default function FriendRankingsScreen() {
  const router = useRouter();
  const { friendId, friendName } = useLocalSearchParams<{
    friendId: string;
    friendName: string;
  }>();
  
  const [selectedTopic, setSelectedTopic] = useState("Albums");
  const [rankings, setRankings] = useState<RankingResponse['ranking']>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    loadRankings();
  }, [selectedTopic, friendId]);
  
  const loadRankings = async () => {
    if (!friendId) return;
    
    try {
      setLoading(true);
      const response = await rankingService.getRankings(selectedTopic, parseInt(friendId));
      // Sort rankings by score in descending order
      const sortedRankings = [...(response.ranking || [])].sort((a, b) => {
        const scoreA = a.score ?? 0;
        const scoreB = b.score ?? 0;
        return scoreB - scoreA;
      });
      setRankings(sortedRankings);
      setError(null);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.code === 'ERR_NETWORK') {
          setError('Cannot connect to the server');
        } else if (err.response) {
          setError(`Server error: ${err.response.status}`);
        }
      } else {
        setError('Failed to load rankings');
      }
      console.error('Error loading rankings:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const renderItem = ({ item, index }: { item: any; index: number }) => (
    <View style={styles.rankingItem}>
      <View style={styles.rankNumberContainer}>
        <Text style={styles.rankNumber}>{index + 1}</Text>
      </View>
      <View style={styles.itemDetails}>
        <Text style={styles.itemName}>{item.item_name}</Text>
        {item.score !== null && item.score !== undefined && (
          <Text style={styles.itemScore}>{typeof item.score === 'number' ? item.score.toFixed(2) : '—'}</Text>
        )}
      </View>
    </View>
  );
  
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{friendName}'s Rankings</Text>
        </View>
        
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.topicsScrollView} contentContainerStyle={styles.topicScrollContainer}>
          {topics.map((topic) => (
            <TouchableOpacity
              key={topic}
              style={[
                styles.topicButton,
                selectedTopic === topic && styles.selectedTopicButton
              ]}
              onPress={() => setSelectedTopic(topic)}
            >
              <Text
                style={[
                  styles.topicButtonText,
                  selectedTopic === topic && styles.selectedTopicButtonText
                ]}
              >
                {topic}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        
        <View style={styles.content}>
          <Text style={styles.sectionTitle}>Top 10 {selectedTopic}</Text>
          
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#FFD700" />
            </View>
          ) : error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : !rankings || rankings.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No {selectedTopic} rankings found</Text>
            </View>
          ) : (
            <FlatList
              data={rankings.slice(0, 10)} // Only show top 10
              renderItem={renderItem}
              keyExtractor={item => item.item_id.toString()}
              contentContainerStyle={styles.rankingsList}
            />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#1C1C1E',
  },
  container: {
    flex: 1,
    backgroundColor: '#1C1C1E',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    fontSize: 24,
    color: '#FFD700',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  topicsScrollView: {
    maxHeight: 44,
    paddingHorizontal: 16,
  },
  topicScrollContainer: {
    paddingRight: 16,
  },
  topicButton: {
    backgroundColor: '#2C2C2E',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    marginRight: 8,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedTopicButton: {
    backgroundColor: '#FFD700',
  },
  topicButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  selectedTopicButtonText: {
    color: '#1C1C1E',
  },
  content: {
    justifyContent: "flex-start",
    flex: 1,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 16,
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyText: {
    color: '#8E8E93',
    fontSize: 16,
    textAlign: 'center',
  },
  rankingsList: {
    paddingBottom: 24,
  },
  rankingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2C2C2E',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  rankNumberContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#3A3A3C',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  rankNumber: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  itemScore: {
    color: '#FFD700',
    fontSize: 14,
  },
}); 