import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme } from 'react-native';
import axios from 'axios';

// Sample data - in a real app, this would come from your backend
const RANKINGS_DATA = {
  movies: [
    { id: '1', title: 'Akira', rank: 1, rating: 9.5, image: require('../../assets/images/icon.png') },
    { id: '2', title: 'Everything Everywhere All at Once', rank: 2, rating: 9.2, image: require('../../assets/images/icon.png') },
    { id: '3', title: 'Inception', rank: 3, rating: 9.0, image: require('../../assets/images/icon.png') },
    { id: '4', title: 'The Matrix', rank: 4, rating: 8.8, image: require('../../assets/images/icon.png') },
    { id: '5', title: 'Interstellar', rank: 5, rating: 8.7, image: require('../../assets/images/icon.png') },
  ],
  albums: [
    { id: '1', title: 'Thriller', artist: 'Michael Jackson', rank: 1, rating: 9.8, image: require('../../assets/images/icon.png') },
    { id: '2', title: 'Abbey Road', artist: 'The Beatles', rank: 2, rating: 9.6, image: require('../../assets/images/icon.png') },
    { id: '3', title: 'Dark Side of the Moon', artist: 'Pink Floyd', rank: 3, rating: 9.5, image: require('../../assets/images/icon.png') },
    { id: '4', title: 'Rumours', artist: 'Fleetwood Mac', rank: 4, rating: 9.4, image: require('../../assets/images/icon.png') },
    { id: '5', title: 'Back in Black', artist: 'AC/DC', rank: 5, rating: 9.3, image: require('../../assets/images/icon.png') },
  ],
};

type RankingItem = {
  id: string;
  title: string;
  rank: number;
  rating: number;
  image: any;
  artist?: string;
  topic: string;
};

export default function RankingsScreen() {
  const [activeTab, setActiveTab] = useState<'movies' | 'albums'>('movies');
  const [rankings, setRankings] = useState<RankingItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<RankingItem | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  useEffect(() => {
    console.log('Fetching rankings for tab:', activeTab);
    fetchRankings();
  }, [activeTab]);

  const fetchRankings = async () => {
    try {
      setIsLoading(true);
      console.log('Making API call to fetch rankings...');
      const response = await axios.get(`http://localhost:8000/rankings?topic=${activeTab}`);
      console.log('Received rankings:', response.data);
      setRankings(response.data.ranking);
    } catch (error) {
      console.error('Error fetching rankings:', error);
      Alert.alert('Error', 'Failed to fetch rankings. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleItemClick = async (item: RankingItem) => {
    try {
      console.log('Selected item:', item);
      setSelectedItem(item);
      setIsLoading(true);
      
      console.log('Making API call to update ranking...');
      const response = await axios.post('http://localhost:8000/compare', {
        user_id: 1,
        item_id: item.id,
        topic_name: activeTab === 'movies' ? 'Movies' : 'Albums'
      });

      console.log('Received updated rankings:', response.data);
      setRankings(response.data.ranking);
      setSelectedItem(null);
      
      Alert.alert('Success', 'Ranking updated successfully!');
    } catch (error) {
      console.error('Error updating ranking:', error);
      Alert.alert('Error', 'Failed to update ranking. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderItem = ({ item }: { item: RankingItem }) => (
    <TouchableOpacity 
      style={[
        styles.rankingItem,
        { backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF' },
        selectedItem?.id === item.id && { backgroundColor: isDark ? '#2C2C2E' : '#F2F2F7' }
      ]}
      onPress={() => handleItemClick(item)}
      disabled={isLoading}
    >
      <View style={styles.rankContainer}>
        <Text style={[styles.rankText, { color: isDark ? '#FFFFFF' : '#000000' }]}>
          #{item.rank}
        </Text>
      </View>
      <Image source={item.image} style={styles.rankingImage} />
      <View style={styles.rankingTextContainer}>
        <Text style={[styles.rankingTitle, { color: isDark ? '#FFFFFF' : '#000000' }]}>
          {item.title}
        </Text>
        {item.artist && (
          <Text style={[styles.rankingArtist, { color: isDark ? '#8E8E93' : '#666' }]}>
            {item.artist}
          </Text>
        )}
        <Text style={[styles.rankingRating, { color: isDark ? '#FFD700' : '#FFA500' }]}>
          {item.rating.toFixed(1)} ★
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#000000' : '#FFFFFF' }]}>
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      )}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'movies' && styles.activeTab,
            { backgroundColor: isDark ? '#1C1C1E' : '#F2F2F7' }
          ]}
          onPress={() => setActiveTab('movies')}
        >
          <Text style={[
            styles.tabText,
            { color: isDark ? '#FFFFFF' : '#000000' },
            activeTab === 'movies' && styles.activeTabText
          ]}>
            Movies
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'albums' && styles.activeTab,
            { backgroundColor: isDark ? '#1C1C1E' : '#F2F2F7' }
          ]}
          onPress={() => setActiveTab('albums')}
        >
          <Text style={[
            styles.tabText,
            { color: isDark ? '#FFFFFF' : '#000000' },
            activeTab === 'albums' && styles.activeTabText
          ]}>
            Albums
          </Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={rankings}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.rankingsList}
        ListEmptyComponent={
          <Text style={[styles.emptyText, { color: isDark ? '#FFFFFF' : '#000000' }]}>
            No rankings available
          </Text>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 8,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#007AFF',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  rankingsList: {
    padding: 16,
  },
  rankingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
  },
  rankContainer: {
    width: 40,
    alignItems: 'center',
    marginRight: 12,
  },
  rankText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  rankingImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  rankingTextContainer: {
    flex: 1,
  },
  rankingTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  rankingArtist: {
    fontSize: 14,
    marginBottom: 4,
  },
  rankingRating: {
    fontSize: 14,
    fontWeight: '600',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
});
