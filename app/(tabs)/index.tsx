"use client"

import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, ActivityIndicator, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { rankingService } from '../services/api';
import { Picker } from '@react-native-picker/picker';
import { AntDesign } from '@expo/vector-icons';

export default function HomeScreen() {
  const [topics, setTopics] = useState<string[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

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
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FFD700" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Image 
            source={require('../../assets/images/logo.png')} 
            style={styles.logo} 
            resizeMode="contain"
          />
        </View>
        <Text style={styles.title}>Rankd</Text>
        <Text style={styles.subtitle}>What would you like to rank today?</Text>
      </View>

      <View style={styles.selectionContainer}>
        <Text style={styles.dropdownLabel}>Category:</Text>
        
        <View style={styles.pickerContainer}>
          {Platform.OS === 'ios' ? (
            <Picker
              selectedValue={selectedTopic}
              onValueChange={(itemValue: string) => setSelectedTopic(itemValue)}
              style={styles.picker}
              itemStyle={styles.pickerItem}
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
                style={styles.picker}
                dropdownIconColor="#FFD700"
                mode="dropdown"
              >
                {topics.map((topic) => (
                  <Picker.Item 
                    key={topic} 
                    label={topic} 
                    value={topic} 
                    style={styles.androidPickerItem}
                  />
                ))}
              </Picker>
              <AntDesign name="caretdown" size={16} color="#FFD700" style={styles.dropdownIcon} />
            </View>
          )}
        </View>

        <TouchableOpacity
          style={styles.continueButton}
          onPress={handleTopicSelect}
        >
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C1C1E',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1C1C1E',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  logoContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#2C2C2E',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 60
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 24,
  },
  selectionContainer: {
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  dropdownLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
    alignSelf: 'flex-start',
  },
  pickerContainer: {
    width: '100%',
    backgroundColor: '#2C2C2E',
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
    color: '#FFFFFF',
    backgroundColor: 'transparent',
    height: Platform.OS === 'ios' ? 150 : 50
  },
  pickerItem: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600'
  },
  androidPickerItem: {
    color: '#FFFFFF',
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
    backgroundColor: '#FFD700',
    paddingVertical: 16,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
  },
  continueButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1C1C1E',
  },
});
