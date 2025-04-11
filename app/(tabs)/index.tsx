"use client"

import { useState } from "react"
import { StyleSheet, View, Text, Image, TouchableOpacity, ScrollView } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { SafeAreaView } from "react-native-safe-area-context"

type TabType = "Movies" | "Albums";

// Define placeholder images
const PLACEHOLDER_IMAGES = {
  movie: require('../../assets/images/icon.png'),
} as const;

export default function HomePage() {
  const [selectedTab, setSelectedTab] = useState<TabType>("Movies")

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      {/* Content Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            { backgroundColor: selectedTab === "Albums" ? '#f6f6f6' : '#f6f6f6' }
          ]}
          onPress={() => setSelectedTab("Albums")}
        >
          <Text style={styles.tabText}>Albums</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tabButton,
            { backgroundColor: selectedTab === "Movies" ? 'black' : '#f6f6f6' }
          ]}
          onPress={() => setSelectedTab("Movies")}
        >
          <Text style={[
            styles.tabText,
            { color: selectedTab === "Movies" ? 'white' : 'black' }
          ]}>Movies</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.addButton}>
          <Ionicons name="add" size={20} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <ScrollView style={styles.content}>
        <Text style={styles.title}>Pick the Better Movie</Text>

        {/* Movie 1 */}
        <View style={styles.movieContainer}>
          <View style={styles.movieImageContainer}>
            <Image
              source={PLACEHOLDER_IMAGES.movie}
              style={styles.movieImage}
              resizeMode="cover"
            />
          </View>
          <Text style={styles.movieTitle}>Akira</Text>
        </View>

        {/* Movie 2 */}
        <View style={styles.movieContainer}>
          <View style={styles.movieImageContainer}>
            <Image
              source={PLACEHOLDER_IMAGES.movie}
              style={styles.movieImage}
              resizeMode="cover"
            />
          </View>
          <Text style={styles.movieTitle}>Everything Everywhere All at Once</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 16,
    marginTop: 16,
  },
  tabButton: {
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 20,
  },
  tabText: {
    color: 'black',
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f6f6f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    paddingHorizontal: 16,
    marginTop: 32,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  movieContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  movieImageContainer: {
    width: 192,
    height: 256,
    overflow: 'hidden',
    marginBottom: 8,
  },
  movieImage: {
    width: 192,
    height: 256,
    borderRadius: 6,
  },
  movieTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
})
