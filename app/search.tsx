import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme } from 'react-native';
import { searchService, SearchResult } from './services/search';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { rankingService } from './services/api';
import { useAuth } from '../contexts/AuthContext';

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  
  // Get the topic from route params
  const { topic } = useLocalSearchParams<{ topic: string }>();
  
  const { user } = useAuth();
  
  useEffect(() => {
    const search = async () => {
      if (searchQuery.trim() === '') {
        setResults([]);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        // Search specifically for the topic type
        let searchResults: SearchResult[] = [];
        
        switch (topic) {
          case 'Movies':
            searchResults = await searchService.searchMovies(searchQuery);
            break;
          case 'TV Shows':
            searchResults = await searchService.searchTVShows(searchQuery);
            break;
          case 'Albums':
            searchResults = await searchService.searchAlbums(searchQuery);
            break;
          case 'Restaurants':
            searchResults = await searchService.searchRestaurants(searchQuery);
            break;
          case 'Books':
            // For books search
            searchResults = await searchService.searchAll(searchQuery);
            searchResults = searchResults.filter(item => item.type === 'book' || item.type === 'movie');
            break;
          case 'Video Games':
            // For games search
            searchResults = await searchService.searchAll(searchQuery);
            searchResults = searchResults.filter(item => item.type === 'game' || item.type === 'movie');
            break;
          default:
            searchResults = await searchService.searchAll(searchQuery);
        }
        
        setResults(searchResults);
      } catch (err) {
        setError('Failed to search. Please try again.');
        console.error('Search error:', err);
      } finally {
        setLoading(false);
      }
    };

    // Add a small delay to prevent too many API calls
    const timeoutId = setTimeout(search, 500);
    return () => clearTimeout(timeoutId);
  }, [searchQuery, topic]);

  const handleSelectItem = async (item: SearchResult) => {
    try {
      setLoading(true);
      
      if (!user) {
        setError('User not logged in');
        setLoading(false);
        return;
      }
      
      // Extract the real item ID (remove any type prefixes like "movie-", "album-", etc.)
      const itemId = item.id.includes('-') ? item.id.split('-')[1] : item.id;
      
      // Call the backend to compare the item
      const response = await rankingService.compareItems({
        user_id: user.user_id,
        item_id: itemId,
        topic_name: topic as string
      });
      
      if (response.status === 'comparison_needed') {
        // Navigate to comparison screen
        router.push({
          pathname: '/comparison',
          params: {
            newItemId: response.new_item?.id.toString() || '',
            newItemName: response.new_item?.name || item.title,
            comparisonItemId: response.comparison_item?.id.toString() || '',
            comparisonItemName: response.comparison_item?.name || '',
            topic: topic as string,
            userId: user.user_id.toString(),
            remainingComparisons: '4', // Start with 2 remaining comparisons (3 total)
            comparisonCount: '0'
          }
        });
      } else {
        // Navigate to rankings
        router.push({
          pathname: '/(tabs)/rankings',
          params: { topic: topic as string, userId: user.user_id.toString() }
        });
      }
    } catch (error) {
      if (error.response) {
        console.error('Error comparing items:', error.response.data);
      } else {
        console.error('Error comparing items:', error);
      }
      setError('Failed to compare item. Please try again.');
      setLoading(false);
    }
  };

  const renderItem = ({ item }: { item: SearchResult }) => (
    <TouchableOpacity 
      style={styles.resultItem}
      onPress={() => handleSelectItem(item)}
    >
      {item.image ? (
        <Image 
          source={{ uri: item.image }} 
          style={styles.resultImage} 
          defaultSource={require('../assets/images/icon.png')}
        />
      ) : (
        <Image 
          source={require('../assets/images/icon.png')} 
          style={styles.resultImage} 
        />
      )}
      <View style={styles.resultTextContainer}>
        <Text style={styles.resultTitle}>{item.title}</Text>
        
        {item.artist && (
          <Text style={styles.resultArtist}>{item.artist}</Text>
        )}
        
        {item.rating && (
          <Text style={styles.resultRating}>{item.rating.toFixed(1)} ★</Text>
        )}
        
        {item.year && (
          <Text style={styles.resultYear}>{item.year}</Text>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Search {topic || 'Items'}</Text>
      </View>
      
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder={`Search ${topic || 'items'}...`}
          placeholderTextColor="#8E8E93"
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoFocus
        />
      </View>
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FFD700" />
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : (
        <FlatList
          data={results}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.resultsList}
          ListEmptyComponent={
            searchQuery ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No results found</Text>
              </View>
            ) : (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>
                  Search for {topic || 'items'} to add to your rankings
                </Text>
              </View>
            )
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C1C1E',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
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
  searchContainer: {
    padding: 16,
  },
  searchInput: {
    height: 40,
    borderRadius: 10,
    paddingHorizontal: 16,
    fontSize: 16,
    borderWidth: 2,
    backgroundColor: '#2C2C2E',
    color: '#FFFFFF',
    borderColor: '#FFD700',
  },
  resultsList: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
    backgroundColor: '#2C2C2E',
  },
  resultImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 12,
  },
  resultTextContainer: {
    flex: 1,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  resultArtist: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 4,
  },
  resultRating: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFD700',
  },
  resultYear: {
    fontSize: 14,
    color: '#8E8E93',
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
    padding: 16,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#FF3B30',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    marginTop: 40,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#FFFFFF',
  },
}); 