import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const { isDark } = useTheme();
  const [settingsVisible, setSettingsVisible] = useState(false);

  if (!user) {
    return (
      <View style={[styles.container, { backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF', justifyContent: 'center', alignItems: 'center' }]}> 
        <Text style={{ color: isDark ? '#FFFFFF' : '#000000', fontSize: 18 }}>Not logged in.</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF' }]}> 
      <View style={styles.header}>
        <Ionicons name="person-circle" size={80} color={isDark ? '#FFD700' : '#000000'} style={{ marginBottom: 16 }} />
        <Text style={[styles.username, { color: isDark ? '#FFFFFF' : '#000000' }]}>{user.username}</Text>
        <Text style={[styles.email, { color: isDark ? '#8E8E93' : '#6C6C70' }]}>{user.email}</Text>
      </View>
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: isDark ? '#FFD700' : '#000000' }]}>Settings</Text>
        <TouchableOpacity style={styles.settingItem} onPress={() => setSettingsVisible(true)}>
          <Ionicons name="settings-outline" size={24} color={isDark ? '#FFD700' : '#000000'} style={{ marginRight: 12 }} />
          <Text style={[styles.settingText, { color: isDark ? '#FFFFFF' : '#000000' }]}>Account Settings</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingItem} onPress={signOut}>
          <Ionicons name="log-out-outline" size={24} color={isDark ? '#FFD700' : '#000000'} style={{ marginRight: 12 }} />
          <Text style={[styles.settingText, { color: isDark ? '#FFFFFF' : '#000000' }]}>Log Out</Text>
        </TouchableOpacity>
      </View>
      <Modal
        visible={settingsVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setSettingsVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: isDark ? '#232323' : '#FFF' }]}> 
            <Text style={[styles.sectionTitle, { color: isDark ? '#FFD700' : '#000000', marginBottom: 16 }]}>Account Settings</Text>
            <Text style={{ color: isDark ? '#FFF' : '#000', marginBottom: 16 }}>Username: {user.username}</Text>
            <Text style={{ color: isDark ? '#FFF' : '#000', marginBottom: 16 }}>Email: {user.email}</Text>
            {/* Add more settings fields here */}
            <TouchableOpacity style={styles.closeButton} onPress={() => setSettingsVisible(false)}>
              <Text style={{ color: isDark ? '#FFD700' : '#000000', fontWeight: 'bold' }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingTop: 48,
    paddingBottom: 32,
    borderBottomWidth: 1,
    borderBottomColor: '#2C2C2E',
  },
  username: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    marginBottom: 8,
  },
  section: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#3C3C3E',
  },
  settingText: {
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
  },
  closeButton: {
    marginTop: 16,
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 8,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#FFD700',
  },
}); 