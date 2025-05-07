import React, { useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import FriendList from '../components/FriendList';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'expo-router';

export default function FriendsScreen() {
  const [loading, setLoading] = useState(false);
  const { isDark } = useTheme();
  const { user } = useAuth();
  const router = useRouter();

  if (!user) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF' }]}> 
        <Text style={{ color: isDark ? '#FFFFFF' : '#000000', fontSize: 18 }}>Not logged in.</Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF' }]}> 
        <ActivityIndicator size="large" color="#FFD700" />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF' }]}> 
      <View style={[styles.header, { backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF', borderBottomColor: isDark ? '#2C2C2E' : '#E5E5EA' }]}> 
        <Text style={[styles.title, { color: isDark ? '#FFFFFF' : '#000000' }]}>Friends</Text>
        <View style={{ flexDirection: 'row', marginTop: 12 }}>
          <TouchableOpacity
            style={{ marginRight: 12, backgroundColor: '#FFD700', borderRadius: 8, padding: 8 }}
            onPress={() => router.push('/add-friend')}
          >
            <Text style={{ color: '#1C1C1E', fontWeight: 'bold' }}>Add Friend</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ backgroundColor: '#FFD700', borderRadius: 8, padding: 8 }}
            onPress={() => router.push('/pending-friends')}
          >
            <Text style={{ color: '#1C1C1E', fontWeight: 'bold' }}>Pending/Outgoing</Text>
          </TouchableOpacity>
        </View>
      </View>
      <FriendList userId={user.user_id} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 16,
    paddingTop: 48,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

