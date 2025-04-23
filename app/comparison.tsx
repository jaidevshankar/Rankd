import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { rankingService } from './services/api';

export default function ComparisonScreen() {
  const router = useRouter();
  const { 
    newItemId, 
    newItemName, 
    comparisonItemId, 
    comparisonItemName,
    topic,
    category 
  } = useLocalSearchParams<{
    newItemId: string;
    newItemName: string;
    comparisonItemId: string;
    comparisonItemName: string;
    topic: string;
    category?: string;
  }>();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleComparisonResponse = async (isBetter: boolean) => {
    if (!newItemId || !comparisonItemId || !topic) {
      setError('Missing item information');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Call API to respond to the comparison
      const response = await rankingService.respondComparison({
        user_id: 1, // Default user ID
        new_item_id: parseInt(newItemId),
        comparison_item_id: parseInt(comparisonItemId),
        topic_name: topic,
        is_better: isBetter,
        category: category || undefined
      });

      // Handle different response statuses
      if (response.status === 'comparison_needed') {
        // Need another comparison
        router.push({
          pathname: '/comparison',
          params: {
            newItemId: newItemId,
            newItemName: newItemName,
            comparisonItemId: response.comparison_item.id.toString(),
            comparisonItemName: response.comparison_item.name,
            topic,
            category: category || undefined
          }
        });
      } else {
        // No more comparisons needed, go to rankings
        router.push({
          pathname: '/(tabs)/rankings',
          params: { topic }
        });
      }
    } catch (error) {
      console.error('Error with comparison:', error);
      setError('Failed to process comparison. Please try again.');
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
        <Text style={styles.headerTitle}>Compare Items</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.questionText}>Which is better?</Text>
        
        {error && <Text style={styles.errorText}>{error}</Text>}
        
        {loading ? (
          <ActivityIndicator size="large" color="#FFD700" style={styles.loader} />
        ) : (
          <View style={styles.comparisonContainer}>
            <View style={styles.itemsContainer}>
              <View style={styles.itemBox}>
                <Text style={styles.itemName}>{newItemName}</Text>
                <Text style={styles.itemLabel}>New Item</Text>
              </View>
              
              <Text style={styles.vsText}>VS</Text>
              
              <View style={styles.itemBox}>
                <Text style={styles.itemName}>{comparisonItemName}</Text>
                <Text style={styles.itemLabel}>Existing Item</Text>
              </View>
            </View>
            
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.comparisonButton}
                onPress={() => handleComparisonResponse(true)}
              >
                <Text style={styles.buttonText}>First item is better</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.comparisonButton}
                onPress={() => handleComparisonResponse(false)}
              >
                <Text style={styles.buttonText}>Second item is better</Text>
              </TouchableOpacity>
            </View>
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
  questionText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 32,
  },
  comparisonContainer: {
    width: '100%',
  },
  itemsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  itemBox: {
    flex: 1,
    backgroundColor: '#2C2C2E',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 120,
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  itemLabel: {
    fontSize: 14,
    color: '#8E8E93',
  },
  vsText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFD700',
    marginHorizontal: 16,
  },
  buttonContainer: {
    gap: 16,
  },
  comparisonButton: {
    backgroundColor: '#FFD700',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1C1C1E',
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