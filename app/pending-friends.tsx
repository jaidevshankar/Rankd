import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { friendsService } from './services/api';
import { useRouter, useFocusEffect } from 'expo-router';

export default function PendingFriendsScreen() {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [incoming, setIncoming] = useState<any[]>([]);
  const [outgoing, setOutgoing] = useState<any[]>([]);
  const [acceptingId, setAcceptingId] = useState<number | null>(null);

  const fetchRequests = async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const data = await friendsService.getFriendRequests(user.user_id);
      setIncoming(data.incoming || []);
      setOutgoing(data.outgoing || []);
    } catch (err) {
      setError('Failed to load requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleAccept = async (friendId: number) => {
    if (!user) return;
    setAcceptingId(friendId);
    setError(null);
    setSuccess(null);
    try {
      await friendsService.acceptFriendRequest(user.user_id, friendId);
      setSuccess('Friend request accepted!');
      await fetchRequests();
      router.replace('/friends');
    } catch (err: any) {
      setError(err?.response?.data?.detail || 'Failed to accept friend request');
    } finally {
      setAcceptingId(null);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchRequests();
    }, [user])
  );

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF', paddingTop: 32, paddingBottom: 16 }]}> 
      <View style={styles.header}>
        <Text style={[styles.title, { color: isDark ? '#FFF' : '#000' }]}>Pending/Outgoing Requests</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={{ color: '#FFD700', fontWeight: 'bold' }}>{'< Back'}</Text>
        </TouchableOpacity>
      </View>
      {loading && <ActivityIndicator color="#FFD700" style={{ marginTop: 16 }} />}
      {error && <Text style={{ color: 'red', textAlign: 'center', marginTop: 8 }}>{error}</Text>}
      {success && <Text style={{ color: 'green', textAlign: 'center', marginTop: 8 }}>{success}</Text>}
      <Text style={[styles.sectionTitle, { color: isDark ? '#FFD700' : '#FFD700' }]}>Incoming Requests</Text>
      <FlatList
        data={incoming}
        keyExtractor={item => item.user_id.toString()}
        renderItem={({ item }) => (
          <View style={[styles.resultItem, { backgroundColor: isDark ? '#2C2C2E' : '#F2F2F7' }]}> 
            <View style={{ flex: 1 }}>
              <Text style={{ color: isDark ? '#FFF' : '#000', fontWeight: 'bold' }}>{item.username}</Text>
              <Text style={{ color: isDark ? '#8E8E93' : '#6C6C70' }}>{item.email}</Text>
            </View>
            <TouchableOpacity
              style={[styles.acceptButton, { backgroundColor: '#FFD700' }]}
              onPress={() => handleAccept(item.user_id)}
              disabled={acceptingId === item.user_id}
            >
              <Text style={{ color: '#1C1C1E', fontWeight: 'bold' }}>{acceptingId === item.user_id ? 'Accepting...' : 'Accept'}</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={!loading ? <Text style={{ color: isDark ? '#FFF' : '#000', textAlign: 'center', marginTop: 16 }}>No incoming requests.</Text> : null}
        style={{ flexGrow: 0 }}
      />
      <Text style={[styles.sectionTitle, { color: isDark ? '#FFD700' : '#FFD700', marginTop: 24 }]}>Outgoing Requests</Text>
      <FlatList
        data={outgoing}
        keyExtractor={item => item.user_id.toString()}
        renderItem={({ item }) => (
          <View style={[styles.resultItem, { backgroundColor: isDark ? '#2C2C2E' : '#F2F2F7' }]}> 
            <View style={{ flex: 1 }}>
              <Text style={{ color: isDark ? '#FFF' : '#000', fontWeight: 'bold' }}>{item.username}</Text>
              <Text style={{ color: isDark ? '#8E8E93' : '#6C6C70' }}>{item.email}</Text>
            </View>
            <Text style={{ color: '#FFD700', fontWeight: 'bold' }}>Pending</Text>
          </View>
        )}
        ListEmptyComponent={!loading ? <Text style={{ color: isDark ? '#FFF' : '#000', textAlign: 'center', marginTop: 16 }}>No outgoing requests.</Text> : null}
        style={{ flexGrow: 0 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 32, paddingBottom: 16 },
  header: { flexDirection: 'row', alignItems: 'center', padding: 16, justifyContent: 'space-between' },
  title: { fontSize: 24, fontWeight: 'bold' },
  backButton: { padding: 8 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginLeft: 16, marginTop: 8 },
  resultItem: { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 10, marginBottom: 8, marginHorizontal: 16 },
  acceptButton: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 8 },
}); 