import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme } from 'react-native';
import { searchService, SearchResult } from '../services/search';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { rankingService } from '../services/api';
import { AntDesign } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isDark } = useTheme();
  const router = useRouter();
  
  // Get the topic from route params
  const { topic } = useLocalSearchParams<{ topic: string }>();
  
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
            // If you have a books search function
            searchResults = await searchService.searchAll(searchQuery);
            searchResults = searchResults.filter(item => item.type === 'book');
            break;
          case 'Video Games':
            // If you have a games search function
            searchResults = await searchService.searchAll(searchQuery);
            searchResults = searchResults.filter(item => item.type === 'game');
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
      
      // Extract the real item ID (remove any type prefixes like "movie-", "album-", etc.)
      const itemId = item.id.includes('-') ? item.id.split('-')[1] : item.id;
      
      // Call the backend to compare the item
      const response = await rankingService.compareItems({
        user_id: 1, // Default user ID
        item_id: itemId,
        topic_name: topic as string
      });
      
      if (response.status === 'calibration_needed') {
        // Navigate to calibration screen
        router.push({
          pathname: '/calibration',
          params: { 
            itemId: response.item_id.toString(),
            itemName: response.item_name,
            topic: topic as string
          }
        });
      } else if (response.status === 'comparison_needed') {
        // Navigate to comparison screen
        router.push({
          pathname: '/comparison',
          params: {
            newItemId: response.new_item.id.toString(),
            newItemName: response.new_item.name,
            comparisonItemId: response.comparison_item.id.toString(),
            comparisonItemName: response.comparison_item.name,
            topic: topic as string,
            category: response.category || ''
          }
        });
      } else if (response.status === 'completed') {
        // Navigate to rankings
        router.push({
          pathname: '/(tabs)/rankings',
          params: { topic: topic as string }
        });
      }
    } catch (error) {
      console.error('Error adding item:', error);
      setError('Failed to add item. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }: { item: SearchResult }) => (
    <TouchableOpacity 
      style={[
        styles.resultItem,
        { backgroundColor: isDark ? '#2C2C2E' : '#F2F2F7' }
      ]}
      onPress={() => handleSelectItem(item)}
    >
      {item.image ? (
        <Image 
          source={{ uri: item.image }} 
          style={styles.resultImage} 
          defaultSource={require('../../assets/images/icon.png')}
        />
      ) : (
        <Image 
          source={require('../../assets/images/icon.png')} 
          style={styles.resultImage} 
        />
      )}
      <View style={styles.resultTextContainer}>
        <View style={styles.titleContainer}>
          <Text style={[styles.resultTitle, { color: isDark ? '#FFFFFF' : '#000000' }]}>
            {item.title}
          </Text>
          <View style={styles.typeBadge}>
            <Text style={[styles.typeText, { color: isDark ? '#8E8E93' : '#6C6C70' }]}>{item.type}</Text>
          </View>
        </View>
        {item.artist && (
          <Text style={[styles.resultArtist, { color: isDark ? '#8E8E93' : '#6C6C70' }]}>
            {item.artist}
          </Text>
        )}
        {item.rating && (
          <Text style={[styles.resultRating, { color: isDark ? '#FFD700' : '#FFD700' }]}>
            {item.rating.toFixed(1)} ★
          </Text>
        )}
        {item.year && (
          <Text style={[styles.resultYear, { color: isDark ? '#8E8E93' : '#6C6C70' }]}>
            {item.year}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF' }]}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <AntDesign name="arrowleft" size={24} color={isDark ? '#FFD700' : '#FFD700'} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: isDark ? '#FFFFFF' : '#000000' }]}>Search {topic || 'Items'}</Text>
      </View>
      <View style={styles.searchContainer}>
        <View style={styles.searchInputWrapper}>
          <AntDesign name="search1" size={20} color={isDark ? '#8E8E93' : '#8E8E93'} style={styles.searchIcon} />
          <TextInput
            style={[
              styles.searchInput,
              { 
                backgroundColor: isDark ? '#2C2C2E' : '#F2F2F7',
                color: isDark ? '#FFFFFF' : '#000000',
                borderColor: isDark ? '#3A3A3C' : '#E5E5EA'
              }
            ]}
            placeholder={`Search ${topic || 'items'}...`}
            placeholderTextColor={isDark ? '#8E8E93' : '#6C6C70'}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus
          />
        </View>
      </View>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={isDark ? '#FFD700' : '#FFD700'} />
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: isDark ? '#FFFFFF' : '#000000' }]}>
            {error}
          </Text>
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
                <Text style={[styles.emptyText, { color: isDark ? '#FFFFFF' : '#000000' }]}>
                  No results found
                </Text>
              </View>
            ) : (
              <View style={styles.emptyContainer}>
                <Text style={[styles.emptyText, { color: isDark ? '#FFFFFF' : '#000000' }]}>
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
    borderRadius: 20,
    backgroundColor: 'rgba(28, 28, 30, 0.8)',
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
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
  searchInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1C1C1E',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FFD700',
    shadowColor: "#FFD700",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  searchIcon: {
    marginLeft: 12,
  },
  searchInput: {
    height: 45,
    borderRadius: 10,
    paddingHorizontal: 16,
    fontSize: 16,
    flex: 1,
    paddingLeft: 8,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  typeBadge: {
    backgroundColor: '#FFD700',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  typeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#000000',
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
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderLeftWidth: 3,
    borderLeftColor: '#FFD700',
  },
  resultImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 12,
  },
  resultTextContainer: {
    flex: 1,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    flex: 1,
  },
  resultArtist: {
    fontSize: 14,
    marginBottom: 4,
  },
  resultRating: {
    fontSize: 14,
    fontWeight: '600',
  },
  resultYear: {
    fontSize: 14,
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
  },
});
