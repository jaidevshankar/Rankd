import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { friendsService } from './services/api';
import { useRouter } from 'expo-router';

export default function AddFriendScreen() {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [sendingId, setSendingId] = useState<number | null>(null);

  const handleSearch = async () => {
    if (!query || !user) return;
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const data = await friendsService.searchUsers(query, user.user_id);
      setResults(data);
    } catch (err) {
      setError('Failed to search users');
    } finally {
      setLoading(false);
    }
  };

  const handleSendRequest = async (friendId: number) => {
    if (!user) return;
    setSendingId(friendId);
    setError(null);
    setSuccess(null);
    try {
      await friendsService.sendFriendRequest(user.user_id, friendId);
      setSuccess('Friend request sent!');
      router.replace('/friends');
    } catch (err: any) {
      setError(err?.response?.data?.detail || 'Failed to send friend request');
    } finally {
      setSendingId(null);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF', paddingTop: 32, paddingBottom: 16 }]}> 
      <View style={styles.header}>
        <Text style={[styles.title, { color: isDark ? '#FFF' : '#000' }]}>Add Friend</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={{ color: '#FFD700', fontWeight: 'bold' }}>{'< Back'}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.searchContainer}>
        <TextInput
          style={[styles.searchInput, { color: isDark ? '#FFF' : '#000', backgroundColor: isDark ? '#2C2C2E' : '#F2F2F7' }]}
          placeholder="Search by username or email..."
          placeholderTextColor={isDark ? '#8E8E93' : '#6C6C70'}
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={handleSearch}
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Text style={{ color: '#1C1C1E', fontWeight: 'bold' }}>Search</Text>
        </TouchableOpacity>
      </View>
      {loading && <ActivityIndicator color="#FFD700" style={{ marginTop: 16 }} />}
      {error && <Text style={{ color: 'red', textAlign: 'center', marginTop: 8 }}>{error}</Text>}
      {success && <Text style={{ color: 'green', textAlign: 'center', marginTop: 8 }}>{success}</Text>}
      <FlatList
        data={results}
        keyExtractor={item => item.user_id.toString()}
        renderItem={({ item }) => (
          <View style={[styles.resultItem, { backgroundColor: isDark ? '#2C2C2E' : '#F2F2F7' }]}> 
            <View style={{ flex: 1 }}>
              <Text style={{ color: isDark ? '#FFF' : '#000', fontWeight: 'bold' }}>{item.username}</Text>
              <Text style={{ color: isDark ? '#8E8E93' : '#6C6C70' }}>{item.email}</Text>
            </View>
            <TouchableOpacity
              style={[styles.addButton, { backgroundColor: '#FFD700' }]}
              onPress={() => handleSendRequest(item.user_id)}
              disabled={sendingId === item.user_id}
            >
              <Text style={{ color: '#1C1C1E', fontWeight: 'bold' }}>{sendingId === item.user_id ? 'Sending...' : 'Add'}</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={!loading && query ? <Text style={{ color: isDark ? '#FFF' : '#000', textAlign: 'center', marginTop: 32 }}>No users found.</Text> : null}
        style={{ flex: 1 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 32, paddingBottom: 16 },
  header: { flexDirection: 'row', alignItems: 'center', padding: 16, justifyContent: 'space-between' },
  title: { fontSize: 24, fontWeight: 'bold' },
  backButton: { padding: 8 },
  searchContainer: { flexDirection: 'row', alignItems: 'center', padding: 16 },
  searchInput: { flex: 1, height: 40, borderRadius: 10, paddingHorizontal: 16, fontSize: 16, borderWidth: 1, borderColor: '#E5E5EA', marginRight: 8 },
  searchButton: { backgroundColor: '#FFD700', borderRadius: 8, padding: 10 },
  resultItem: { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 10, marginBottom: 8, marginHorizontal: 16 },
  addButton: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 8 },
}); 