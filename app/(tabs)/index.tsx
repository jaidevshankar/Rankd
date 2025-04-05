
"use client"

import { useState } from "react"
import { StyleSheet, View, Text, Image, TouchableOpacity, ScrollView } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { SafeAreaView } from "react-native-safe-area-context"

export default function HomeScreen() {
  const [activeTab, setActiveTab] = useState<"movies" | "albums">("movies")

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "albums" ? styles.activeTab : styles.inactiveTab]}
          onPress={() => setActiveTab("albums")}
        >
          <Text style={[styles.tabText, activeTab === "albums" ? styles.activeTabText : styles.inactiveTabText]}>
            Albums
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "movies" ? styles.activeTab : styles.inactiveTab]}
          onPress={() => setActiveTab("movies")}
        >
          <Text style={[styles.tabText, activeTab === "movies" ? styles.activeTabText : styles.inactiveTabText]}>
            Movies
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.addButton}>
          <Ionicons name="add" size={20} color="#24262b" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={styles.title}>{activeTab === "movies" ? "Pick the Better Movie" : "Pick the Better Album"}</Text>

        <View style={styles.itemsContainer}>
          {activeTab === "movies" ? (
            <>
              <View style={styles.itemWrapper}>
                <Image source={{ uri: "https://via.placeholder.com/160x224" }} style={styles.moviePoster} />
                <Text style={styles.itemTitle}>Akira</Text>
              </View>
              <View style={styles.itemWrapper}>
                <Image source={{ uri: "https://via.placeholder.com/160x224" }} style={styles.moviePoster} />
                <Text style={styles.itemTitle}>Everything, Everywhere,{"\n"}All at Once</Text>
              </View>
            </>
          ) : (
            <>
              <View style={styles.itemWrapper}>
                <View style={styles.albumCover} />
                <Text style={styles.itemTitle}>Album 1</Text>
              </View>
              <View style={styles.itemWrapper}>
                <View style={styles.albumCover} />
                <Text style={styles.itemTitle}>Album 2</Text>
              </View>
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  activeTab: {
    backgroundColor: "#24262b",
  },
  inactiveTab: {
    backgroundColor: "#f6f6f6",
  },
  tabText: {
    fontWeight: "500",
  },
  activeTabText: {
    color: "#ffffff",
  },
  inactiveTabText: {
    color: "#24262b",
  },
  addButton: {
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingVertical: 24,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 24,
    color: "#24262b",
  },
  itemsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 16,
  },
  itemWrapper: {
    alignItems: "center",
  },
  moviePoster: {
    width: 160,
    height: 224,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#dadada",
    marginBottom: 8,
  },
  albumCover: {
    width: 160,
    height: 160,
    backgroundColor: "#d9d9d9",
    borderRadius: 4,
    marginBottom: 8,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#24262b",
    textAlign: "center",
  },
})
