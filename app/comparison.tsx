import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ActivityIndicator, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { rankingService, RankingResponse } from './services/api';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { FontAwesome } from '@expo/vector-icons';

export default function ComparisonScreen() {
  const router = useRouter();
  const { 
    newItemId, 
    newItemName, 
    comparisonItemId, 
    comparisonItemName,
    topic,
    userId: paramUserId,
    remainingComparisons: paramRemainingComparisons,
    comparisonCount: paramComparisonCount,
  } = useLocalSearchParams<{
    newItemId: string;
    newItemName: string;
    comparisonItemId: string;
    comparisonItemName: string;
    topic: string;
    userId?: string;
    remainingComparisons?: string;
    comparisonCount?: string
  }>();
  const initialCount = paramComparisonCount ? parseInt(paramComparisonCount, 10) : 0;
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [comparisonCount, setComparisonCount] = useState(initialCount);
  const [modalVisible, setModalVisible] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleComparisonResponse = async (isBetter: boolean) => {
    const user_id = user?.user_id || (paramUserId ? parseInt(paramUserId) : undefined);
    if (!newItemId || !comparisonItemId || !topic || !user_id) {
      setError('Missing item or user information');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Call API to respond to the comparison
      const response = await rankingService.respondComparison({
        user_id,
        new_item_id: Number(newItemId),
        comparison_item_id: Number(comparisonItemId),
        topic_name: topic,
        is_better: isBetter
      });

      // Increment comparison count
      const newComparisonCount = comparisonCount + 1;

      // If we've reached 5 comparisons, show success screen
      if (newComparisonCount >= 5) {
        setLoading(false);
        setShowSuccess(true);
        return;
      }

      // Handle different response statuses
      if (response.status === 'comparison_needed' && response.comparison_item) {
        // Need another comparison
        setModalVisible(false);
        setComparisonCount(newComparisonCount);
        router.push({
          pathname: '/comparison',
          params: {
            newItemId: newItemId,
            newItemName: newItemName,
            comparisonItemId: response.comparison_item.id.toString(),
            comparisonItemName: response.comparison_item.name,
            topic,
            userId: user_id.toString(),
            remainingComparisons: (5 - newComparisonCount).toString(),
            comparisonCount: newComparisonCount.toString(),
          }
        });
      } else {
        // No more comparisons needed, go to home
        router.push({
          pathname: '/(tabs)',
          params: { topic }
        });
      }
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        console.error('Error with comparison:', err.response.data);
      } else {
        console.error('Error with comparison:', err);
      }
      setError('Failed to process comparison. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const goToHome = () => {
    setShowSuccess(false);
    setModalVisible(false);
    router.replace({
      pathname: '/(tabs)',
      params: { topic }
    });
  };

  const goToRankings = () => {
    setShowSuccess(false);
    setModalVisible(false);
    router.replace({
      pathname: '/(tabs)/rankings',
      params: { topic }
    });
  };

  const renderSuccessScreen = () => {
    return (
      <View style={styles.successContainer}>
        <View style={styles.successIconContainer}>
          <FontAwesome name="check-circle" size={80} color="#FFD700" />
        </View>
        
        <Text style={styles.successTitle}>Ranking Complete!</Text>
        <Text style={styles.successMessage}>
          You've successfully added {newItemName} to your {topic} rankings.
        </Text>
        
        <View style={styles.successButtonsContainer}>
          <TouchableOpacity 
            style={[styles.successButton, styles.primaryButton]} 
            onPress={goToRankings}
          >
            <Text style={styles.primaryButtonText}>View Rankings</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.successButton, styles.secondaryButton]} 
            onPress={goToHome}
          >
            <Text style={styles.secondaryButtonText}>Rank Another Item</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  
  return (
    <Modal
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => router.back()}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          {!showSuccess && (
            <>
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
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#FFD700" style={styles.loader} />
                  </View>
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
            </>
          )}
          
          {showSuccess && renderSuccessScreen()}
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#1C1C1E',
  },
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
    backgroundColor: '#1C1C1E',
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1C1C1E',
  },
  loader: {
    marginTop: 32,
  },
  // Success screen styles
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#1C1C1E',
  },
  successIconContainer: {
    marginBottom: 24,
  },
  successTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
    textAlign: 'center',
  },
  successMessage: {
    fontSize: 18,
    color: '#AEAEB2',
    marginBottom: 36,
    textAlign: 'center',
    lineHeight: 26,
  },
  successButtonsContainer: {
    width: '100%',
    gap: 16,
  },
  successButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButton: {
    backgroundColor: '#FFD700',
  },
  secondaryButton: {
    backgroundColor: '#2C2C2E',
  },
  primaryButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1C1C1E',
  },
  secondaryButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
}); 