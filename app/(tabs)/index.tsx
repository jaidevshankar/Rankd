"use client"

import { useState } from "react"
import { StyleSheet, View, Text, Image, TouchableOpacity } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

type ContentType = "Movies" | "Albums";

type MovieItem = {
  id: string;
  title: string;
  image: any;
};

type AlbumItem = {
  id: string;
  title: string;
  artist: string;
  image: any;
};

type ContentItem = MovieItem | AlbumItem;

// Define placeholder images
const PLACEHOLDER_IMAGES = {
  movie: require('../../assets/images/icon.png'),
  album: require('../../assets/images/icon.png'),
} as const;

// Sample content data
const CONTENT: Record<ContentType, ContentItem[]> = {
  Movies: [
    { id: '1', title: 'Akira', image: PLACEHOLDER_IMAGES.movie },
    { id: '2', title: 'Everything Everywhere All at Once', image: PLACEHOLDER_IMAGES.movie },
  ],
  Albums: [
    { id: '1', title: 'Thriller', artist: 'Michael Jackson', image: PLACEHOLDER_IMAGES.album },
    { id: '2', title: 'Abbey Road', artist: 'The Beatles', image: PLACEHOLDER_IMAGES.album },
  ],
} as const;

export default function HomePage() {
  const [contentType, setContentType] = useState<ContentType>("Movies");

  const currentContent = CONTENT[contentType];

  const isAlbum = (item: ContentItem): item is AlbumItem => {
    return 'artist' in item;
  };

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <View style={styles.content}>
        {/* Tab Buttons */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[
              styles.tabButton,
              contentType === "Movies" && styles.activeTabButton
            ]}
            onPress={() => setContentType("Movies")}
          >
            <Text style={[
              styles.tabText,
              contentType === "Movies" && styles.activeTabText
            ]}>Movies</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tabButton,
              contentType === "Albums" && styles.activeTabButton
            ]}
            onPress={() => setContentType("Albums")}
          >
            <Text style={[
              styles.tabText,
              contentType === "Albums" && styles.activeTabText
            ]}>Albums</Text>
          </TouchableOpacity>
        </View>

        {/* Content Container */}
        <View style={styles.itemsContainer}>
          {/* First Item */}
          <View style={styles.itemContainer}>
            <View style={styles.imageContainer}>
              <Image
                source={currentContent[0].image}
                style={styles.image}
                resizeMode="cover"
              />
            </View>
            <Text style={styles.title}>{currentContent[0].title}</Text>
            {isAlbum(currentContent[0]) && (
              <Text style={styles.artist}>{currentContent[0].artist}</Text>
            )}
          </View>

          {/* Second Item */}
          <View style={styles.itemContainer}>
            <View style={styles.imageContainer}>
              <Image
                source={currentContent[1].image}
                style={styles.image}
                resizeMode="cover"
              />
            </View>
            <Text style={styles.title}>{currentContent[1].title}</Text>
            {isAlbum(currentContent[1]) && (
              <Text style={styles.artist}>{currentContent[1].artist}</Text>
            )}
          </View>
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
    marginTop: 40,
  },
  tabButton: {
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f6f6f6',
  },
  activeTabButton: {
    backgroundColor: 'black',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
    color: 'black',
  },
  activeTabText: {
    color: 'white',
  },
  itemsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 32,
  },
  itemContainer: {
    width: '100%',
    maxWidth: 280,
    alignItems: 'center',
  },
  imageContainer: {
    width: 224,
    height: 224,
    borderRadius: 13,
    overflow: 'hidden',
    backgroundColor: '#f6f6f6',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 10,
    textAlign: 'center',
  },
  artist: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
    textAlign: 'center',
  },
});
