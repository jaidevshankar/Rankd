import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme } from 'react-native';

// Sample data - in a real app, this would come from your backend
const SAMPLE_DATA = {
  movies: [
    { id: '1', title: 'Akira', type: 'movie', image: require('../../assets/images/icon.png') },
    { id: '2', title: 'Everything Everywhere All at Once', type: 'movie', image: require('../../assets/images/icon.png') },
    { id: '3', title: 'Inception', type: 'movie', image: require('../../assets/images/icon.png') },
    { id: '4', title: 'The Matrix', type: 'movie', image: require('../../assets/images/icon.png') },
  ],
  albums: [
    { id: '1', title: 'Thriller', artist: 'Michael Jackson', type: 'album', image: require('../../assets/images/icon.png') },
    { id: '2', title: 'Abbey Road', artist: 'The Beatles', type: 'album', image: require('../../assets/images/icon.png') },
    { id: '3', title: 'Dark Side of the Moon', artist: 'Pink Floyd', type: 'album', image: require('../../assets/images/icon.png') },
    { id: '4', title: 'Rumours', artist: 'Fleetwood Mac', type: 'album', image: require('../../assets/images/icon.png') },
  ],
};

type SearchItem = {
  id: string;
  title: string;
  type: 'movie' | 'album';
  image: any;
  artist?: string;
};

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<SearchItem[]>([]);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setResults([]);
      return;
    }

    const query = searchQuery.toLowerCase();
    const allItems = [...SAMPLE_DATA.movies, ...SAMPLE_DATA.albums];
    const filtered = allItems.filter(item => 
      item.title.toLowerCase().includes(query) ||
      (item.type === 'album' && (item as any).artist.toLowerCase().includes(query))
    );
    setResults(filtered);
  }, [searchQuery]);

  const renderItem = ({ item }: { item: SearchItem }) => (
    <TouchableOpacity 
      style={[
        styles.resultItem,
        { backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF' }
      ]}
    >
      <Image source={item.image} style={styles.resultImage} />
      <View style={styles.resultTextContainer}>
        <Text style={[styles.resultTitle, { color: isDark ? '#FFFFFF' : '#000000' }]}>
          {item.title}
        </Text>
        {item.type === 'album' && (
          <Text style={[styles.resultArtist, { color: isDark ? '#8E8E93' : '#666' }]}>
            {(item as any).artist}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#000000' : '#FFFFFF' }]}>
      <View style={styles.searchContainer}>
        <TextInput
          style={[
            styles.searchInput,
            { 
              backgroundColor: isDark ? '#1C1C1E' : '#F2F2F7',
              color: isDark ? '#FFFFFF' : '#000000'
            }
          ]}
          placeholder="Search movies and albums..."
          placeholderTextColor={isDark ? '#8E8E93' : '#8E8E93'}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      <FlatList
        data={results}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.resultsList}
      />
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
  },
});
