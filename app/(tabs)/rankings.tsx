import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import RankingList from '../components/RankingList';

const topics = ['Movies', 'TV Shows', 'Albums', 'Restaurants'];

export default function RankingsScreen() {
  const [selectedTopic, setSelectedTopic] = useState(topics[0]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Rankings</Text>
        <View style={styles.topicContainer}>
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
        </View>
      </View>
      <RankingList topic={selectedTopic} userId={1} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  topicContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  topicButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#2C2C2E',
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
});
