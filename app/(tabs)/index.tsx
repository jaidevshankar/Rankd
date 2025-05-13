"use client"

import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, ActivityIndicator, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { rankingService } from '../services/api';
import { Picker } from '@react-native-picker/picker';
import { AntDesign } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';

export default function HomeScreen() {
  const [topics, setTopics] = useState<string[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { isDark } = useTheme();

  useEffect(() => {
    async function loadTopics() {
      try {
        setLoading(true);
        const fetchedTopics = await rankingService.getTopics();
        setTopics(fetchedTopics || []);
        if (fetchedTopics && fetchedTopics.length > 0) {
          setSelectedTopic(fetchedTopics[0]);
        }
      } catch (error) {
        console.error('Failed to load topics:', error);
        // Use default topics as fallback
        const defaultTopics = ["Movies", "TV Shows", "Albums", "Books", "Video Games", "Restaurants"];
        setTopics(defaultTopics);
        setSelectedTopic(defaultTopics[0]);
      } finally {
        setLoading(false);
      }
    }

    loadTopics();
  }, []);

  const handleTopicSelect = () => {
    if (!selectedTopic) return;
    
    // Navigate to search screen with the selected topic
    router.push({
      pathname: '/search',
      params: { topic: selectedTopic }
    });
  };

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF' }]}>
        <ActivityIndicator size="large" color="#FFD700" />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF' }]}>
      <View style={[styles.header, { backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF' }]}>
        <View style={styles.logoContainer}>
          <Image 
            source={require('../../assets/images/logo.png')} 
            style={styles.logo} 
            resizeMode="contain"
          />
          <Text style={[styles.title, { color: isDark ? '#FFFFFF' : '#000000' }]}>Rankd</Text>
        </View>
      </View>

      <View style={styles.selectionContainer}>
        <View style={[styles.pickerContainer, { backgroundColor: isDark ? '#2C2C2E' : '#F5F5F5' }]}>
          {Platform.OS === 'ios' ? (
            <Picker
              selectedValue={selectedTopic}
              onValueChange={(itemValue: string) => setSelectedTopic(itemValue)}
              style={[styles.picker, { color: isDark ? '#FFFFFF' : '#000000' }]}
              itemStyle={[styles.pickerItem, { color: isDark ? '#FFFFFF' : '#000000' }]}
            >
              {topics.map((topic) => (
                <Picker.Item key={topic} label={topic} value={topic} />
              ))}
            </Picker>
          ) : (
            <View style={styles.androidPickerWrapper}>
              <Picker
                selectedValue={selectedTopic}
                onValueChange={(itemValue: string) => setSelectedTopic(itemValue)}
                style={[styles.picker, { color: isDark ? '#FFFFFF' : '#000000' }]}
                dropdownIconColor={isDark ? '#FFD700' : '#000000'}
                mode="dropdown"
              >
                {topics.map((topic) => (
                  <Picker.Item 
                    key={topic} 
                    label={topic} 
                    value={topic} 
                    style={[styles.androidPickerItem, { color: isDark ? '#FFFFFF' : '#000000' }]}
                  />
                ))}
              </Picker>
              <AntDesign name="caretdown" size={16} color={isDark ? '#FFD700' : '#000000'} style={styles.dropdownIcon} />
            </View>
          )}
        </View>

        <TouchableOpacity
          style={[styles.continueButton, { backgroundColor: isDark ? '#FFD700' : '#000000' }]}
          onPress={handleTopicSelect}
        >
          <Text style={[styles.continueButtonText, { color: isDark ? '#1C1C1E' : '#FFFFFF' }]}>Continue</Text>
        </TouchableOpacity>
      </View>
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
    borderBottomColor: '#2C2C2E',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  selectionContainer: {
    paddingHorizontal: 24,
    alignItems: 'center',
    marginTop: 32,
  },
  pickerContainer: {
    width: '100%',
    borderRadius: 12,
    marginBottom: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#3C3C3E',
  },
  androidPickerWrapper: {
    width: '100%',
    height: 50,
    justifyContent: 'center',
    position: 'relative'
  },
  picker: {
    width: '100%',
    backgroundColor: 'transparent',
    height: Platform.OS === 'ios' ? 150 : 50
  },
  pickerItem: {
    fontSize: 18,
    fontWeight: '600'
  },
  androidPickerItem: {
    fontSize: 16,
    fontWeight: '600'
  },
  dropdownIcon: {
    position: 'absolute',
    right: 12,
    top: 17,
    zIndex: 10
  },
  continueButton: {
    paddingVertical: 16,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
  },
  continueButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
