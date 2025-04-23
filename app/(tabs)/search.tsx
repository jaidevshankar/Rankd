import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme } from 'react-native';
import { searchService, SearchResult } from '../services/search';

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  useEffect(() => {
    const search = async () => {
      if (searchQuery.trim() === '') {
        setResults([]);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const searchResults = await searchService.searchAll(searchQuery);
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
  }, [searchQuery]);

  const renderItem = ({ item }: { item: SearchResult }) => (
    <TouchableOpacity 
      style={[
        styles.resultItem,
        { backgroundColor: '#1C1C1E' }
      ]}
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
          <Text style={[styles.resultTitle, { color: '#FFFFFF' }]}>
            {item.title}
          </Text>
          <View style={styles.typeBadge}>
            <Text style={styles.typeText}>{item.type}</Text>
          </View>
        </View>
        {item.artist && (
          <Text style={[styles.resultArtist, { color: '#8E8E93' }]}>
            {item.artist}
          </Text>
        )}
        {item.rating && (
          <Text style={[styles.resultRating, { color: '#FFD700' }]}>
            {item.rating.toFixed(1)} ★
          </Text>
        )}
        {item.year && (
          <Text style={[styles.resultYear, { color: '#8E8E93' }]}>
            {item.year}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: '#000000' }]}>
      <View style={styles.searchContainer}>
        <TextInput
          style={[
            styles.searchInput,
            { 
              backgroundColor: '#1C1C1E',
              color: '#FFFFFF',
              borderColor: '#FFD700'
            }
          ]}
          placeholder="Search movies, TV shows, albums, and restaurants..."
          placeholderTextColor="#8E8E93"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FFD700" />
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: '#FFFFFF' }]}>
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
                <Text style={[styles.emptyText, { color: '#FFFFFF' }]}>
                  No results found
                </Text>
              </View>
            ) : null
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
  searchContainer: {
    padding: 16,
  },
  searchInput: {
    height: 40,
    borderRadius: 10,
    paddingHorizontal: 16,
    fontSize: 16,
    borderWidth: 2,
  },
  resultsList: {
    paddingHorizontal: 16,
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
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
    marginBottom: 4,
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
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  typeBadge: {
    backgroundColor: '#2C2C2E',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  typeText: {
    color: '#8E8E93',
    fontSize: 12,
    fontWeight: '600',
  },
});
