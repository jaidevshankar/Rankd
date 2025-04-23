import { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme } from 'react-native';

// Sample data - in a real app, this would come from your backend
const FRIENDS_DATA: Friend[] = [
  { id: '1', name: 'John Doe', status: 'Online' as const },
  { id: '2', name: 'Jane Smith', status: 'Offline' as const },
  { id: '3', name: 'Mike Johnson', status: 'Online' as const },
  { id: '4', name: 'Sarah Williams', status: 'Offline' as const },
  { id: '5', name: 'David Brown', status: 'Online' as const },
  { id: '6', name: 'Emily Davis', status: 'Offline' as const },
  { id: '7', name: 'Robert Wilson', status: 'Online' as const },
  { id: '8', name: 'Lisa Anderson', status: 'Offline' as const },
];

type Friend = {
  id: string;
  name: string;
  status: 'Online' | 'Offline';
};

export default function PeopleScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const filteredFriends = FRIENDS_DATA.filter(friend =>
    friend.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderItem = ({ item }: { item: Friend }) => (
    <TouchableOpacity 
      style={[
        styles.friendItem,
        { backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF' }
      ]}
    >
      <View style={styles.friendInfo}>
        <Text style={[styles.friendName, { color: isDark ? '#FFFFFF' : '#000000' }]}>
          {item.name}
        </Text>
        <Text style={[
          styles.friendStatus,
          { color: item.status === 'Online' ? '#34C759' : '#8E8E93' }
        ]}>
          {item.status}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: '#1C1C1E' }]}>
      <View style={styles.searchContainer}>
        <TextInput
          style={[
            styles.searchInput,
            { 
              backgroundColor: '#2C2C2E',
              color: '#FFFFFF',
              borderColor: '#FFD700'
            }
          ]}
          placeholder="Search friends..."
          placeholderTextColor="#8E8E93"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      <FlatList
        data={filteredFriends}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.friendsList}
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
    borderWidth: 2,
  },
  friendsList: {
    padding: 16,
  },
  friendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
    backgroundColor: '#2C2C2E',
  },
  friendInfo: {
    flex: 1,
  },
  friendName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    color: '#FFFFFF',
  },
  friendStatus: {
    fontSize: 14,
  },
});

