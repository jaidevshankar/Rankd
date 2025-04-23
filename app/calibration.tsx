import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { rankingService } from './services/api';

export default function CalibrationScreen() {
  const router = useRouter();
  const { itemId, itemName, topic } = useLocalSearchParams<{ itemId: string; itemName: string; topic: string }>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCategorySelect = async (category: 'Loved' | 'Liked' | 'Disliked') => {
    if (!itemId || !topic) {
      setError('Missing item information');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Call API to set the category for this item
      const response = await rankingService.setCategory({
        user_id: 1, // Default user ID
        item_id: parseInt(itemId),
        topic_name: topic,
        category
      });

      // Handle different response statuses
      if (response.status === 'comparison_needed') {
        // Need to do comparison with another item
        router.push({
          pathname: '/comparison',
          params: {
            newItemId: itemId,
            newItemName: itemName || '',
            comparisonItemId: response.comparison_item.id.toString(),
            comparisonItemName: response.comparison_item.name,
            topic,
            category
          }
        });
      } else {
        // No comparison needed, go to rankings
        router.push({
          pathname: '/(tabs)/rankings',
          params: { topic }
        });
      }
    } catch (error) {
      console.error('Error setting category:', error);
      setError('Failed to set category. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>How do you feel about this?</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.itemName}>{itemName}</Text>
        
        {error && <Text style={styles.errorText}>{error}</Text>}
        
        {loading ? (
          <ActivityIndicator size="large" color="#FFD700" style={styles.loader} />
        ) : (
          <View style={styles.categoryContainer}>
            <TouchableOpacity
              style={[styles.categoryButton, styles.lovedButton]}
              onPress={() => handleCategorySelect('Loved')}
            >
              <Text style={styles.categoryButtonText}>Loved</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.categoryButton, styles.likedButton]}
              onPress={() => handleCategorySelect('Liked')}
            >
              <Text style={styles.categoryButtonText}>Liked</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.categoryButton, styles.dislikedButton]}
              onPress={() => handleCategorySelect('Disliked')}
            >
              <Text style={styles.categoryButtonText}>Disliked</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C1C1E',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    fontSize: 24,
    color: '#FFD700',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 32,
  },
  itemName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 48,
  },
  categoryContainer: {
    width: '100%',
    gap: 16,
  },
  categoryButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  lovedButton: {
    backgroundColor: '#4CD964', // Green
  },
  likedButton: {
    backgroundColor: '#5AC8FA', // Blue
  },
  dislikedButton: {
    backgroundColor: '#FF9500', // Orange
  },
  categoryButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
  },
  errorText: {
    color: '#FF3B30',
    marginBottom: 16,
    textAlign: 'center',
  },
  loader: {
    marginTop: 32,
  },
}); 