import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { friendsService } from '../services/api';
import { useFocusEffect, useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';

// Sample data - in a real app, this would come from your backend
const FRIENDS_DATA = [
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
  user_id: number;
  username: string;
  email: string;
};

interface FriendListProps {
  userId: number;
}

export default function FriendList({ userId }: FriendListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isDark } = useTheme();
  const router = useRouter();

  const fetchFriends = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await friendsService.getFriends(userId);
      setFriends(data);
    } catch (err) {
      setError('Failed to load friends');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchFriends();
  }, [fetchFriends]);

  useFocusEffect(
    useCallback(() => {
      fetchFriends();
    }, [fetchFriends])
  );

  const filteredFriends = friends.filter(friend =>
    friend.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    friend.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const navigateToFriendRankings = (friendId: number, friendName: string) => {
    router.push({
      pathname: '/friend-rankings',
      params: {
        friendId: friendId.toString(),
        friendName
      }
    } as any);
  };

  const renderItem = ({ item }: { item: Friend }) => (
    <View
      style={[
        styles.friendItem,
        { backgroundColor: isDark ? '#2C2C2E' : '#F2F2F7' }
      ]}
    >
      <View style={styles.friendInfo}>
        <Text style={[styles.friendName, { color: isDark ? '#FFFFFF' : '#000000' }]}> 
          {item.username}
        </Text>
        <Text style={styles.friendEmail}>{item.email}</Text>
      </View>
      <TouchableOpacity 
        style={styles.viewRankingsButton}
        onPress={() => navigateToFriendRankings(item.user_id, item.username)}
      >
        <FontAwesome name="list-ol" size={16} color="#1C1C1E" />
        <Text style={styles.viewRankingsText}>View Rankings</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return <Text style={{ color: isDark ? '#FFF' : '#000', textAlign: 'center', marginTop: 32 }}>Loading friends...</Text>;
  }
  if (error) {
    return <Text style={{ color: 'red', textAlign: 'center', marginTop: 32 }}>{error}</Text>;
  }

  return (
    <View style={styles.container}>
      <View style={[styles.searchContainer, { backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF' }]}> 
        <TextInput
          style={[
            styles.searchInput,
            { 
              backgroundColor: isDark ? '#2C2C2E' : '#E5E5EA',
              color: isDark ? '#FFFFFF' : '#000000'
            }
          ]}
          placeholder="Search friends..."
          placeholderTextColor={isDark ? '#8E8E93' : '#8E8E93'}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      <FlatList
        data={filteredFriends}
        renderItem={renderItem}
        keyExtractor={(item) => item.user_id.toString()}
        contentContainerStyle={styles.friendsList}
        ListEmptyComponent={
          <Text style={{ 
            color: isDark ? '#8E8E93' : '#8E8E93', 
            textAlign: 'center', 
            marginTop: 32,
            marginBottom: 16
          }}>
            No friends found. Add friends from the Add Friend tab.
          </Text>
        }
      />
    </View>
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
    borderWidth: 1,
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
  },
  friendInfo: {
    flex: 1,
  },
  friendName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  friendEmail: {
    fontSize: 14,
    color: '#FFD700',
  },
  viewRankingsButton: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewRankingsText: {
    color: '#1C1C1E',
    fontWeight: '600',
    fontSize: 14,
    marginLeft: 4,
  },
}); 