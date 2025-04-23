import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import RankingList from '../components/RankingList';
import { rankingService } from '../services/api';

// Default topics as fallback
const DEFAULT_TOPICS = ['Movies', 'TV Shows', 'Albums', 'Books', 'Video Games', 'Restaurants'];

export default function RankingsScreen() {
  const [topics, setTopics] = useState<string[]>(DEFAULT_TOPICS);
  const [selectedTopic, setSelectedTopic] = useState<string>('');
  const [loading, setLoading] = useState(true);

  // In a real app, we'd get the user ID from authentication
  // For now, we'll use a fixed user ID 
  const userId = 1;

  useEffect(() => {
    // Load topics when component mounts
    async function loadTopics() {
      try {
        setLoading(true);
        const fetchedTopics = await rankingService.getTopics();
        
        if (fetchedTopics && fetchedTopics.length > 0) {
          setTopics(fetchedTopics);
          // Select the first topic by default
          if (!selectedTopic) {
            setSelectedTopic(fetchedTopics[0]);
          }
        }
      } catch (error) {
        console.error('Failed to load topics:', error);
        // Use default topics as fallback
        if (!selectedTopic && DEFAULT_TOPICS.length > 0) {
          setSelectedTopic(DEFAULT_TOPICS[0]);
        }
      } finally {
        setLoading(false);
      }
    }

    loadTopics();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FFD700" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Rankings</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.topicScrollContainer}
        >
          {topics.map((topic) => (
            <TouchableOpacity
              key={topic}
              onPress={() => setSelectedTopic(topic)}
              style={[
                styles.topicButton,
                selectedTopic === topic && styles.selectedTopicButton,
              ]}
            >
              <Text
                style={[
                  styles.topicButtonText,
                  selectedTopic === topic && styles.selectedTopicButtonText,
                ]}
              >
                {topic}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      {selectedTopic ? (
        <RankingList topic={selectedTopic} userId={userId} />
      ) : (
        <View style={styles.noTopicContainer}>
          <Text style={styles.noTopicText}>Select a topic to view rankings</Text>
        </View>
      )}
    </View>
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
  header: {
    padding: 16,
    paddingTop: 48,
    backgroundColor: '#1C1C1E',
    borderBottomWidth: 1,
    borderBottomColor: '#2C2C2E',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  topicScrollContainer: {
    paddingRight: 16,
  },
  topicContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  topicButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: '#2C2C2E',
    marginRight: 8,
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
  noTopicContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  noTopicText: {
    color: '#8E8E93',
    fontSize: 16,
    textAlign: 'center',
  },
});
