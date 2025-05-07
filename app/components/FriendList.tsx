import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { friendsService } from '../services/api';

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

type FriendListProps = {
  userId: number;
};

export default function FriendList({ userId }: FriendListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isDark } = useTheme();

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

  const filteredFriends = friends.filter(friend =>
    friend.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    friend.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
        <Text style={styles.friendStatus}>{item.email}</Text>
      </View>
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
              backgroundColor: isDark ? '#2C2C2E' : '#F2F2F7',
              color: isDark ? '#FFFFFF' : '#000000',
              borderColor: isDark ? '#3A3A3C' : '#E5E5EA'
            }
          ]}
          placeholder="Search friends..."
          placeholderTextColor={isDark ? '#8E8E93' : '#6C6C70'}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      <FlatList
        data={filteredFriends}
        renderItem={renderItem}
        keyExtractor={item => item.user_id.toString()}
        contentContainerStyle={styles.friendsList}
        ListEmptyComponent={<Text style={{ color: isDark ? '#FFF' : '#000', textAlign: 'center', marginTop: 32 }}>No friends found.</Text>}
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
  friendStatus: {
    fontSize: 14,
  },
}); 