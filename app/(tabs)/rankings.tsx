import { StyleSheet, View, Text, Image, ScrollView } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

export default function RankingsScreen() {
  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={styles.title}>Your Ranking:</Text>

        <View style={styles.rankingItem}>
          <Text style={styles.rankingNumber}>1.</Text>
          <Image source={{ uri: "https://via.placeholder.com/128x128" }} style={styles.rankingImage} />
        </View>

        <View style={styles.rankingItem}>
          <Text style={styles.rankingNumber}>2.</Text>
          <Image source={{ uri: "https://via.placeholder.com/128x128" }} style={styles.rankingImage} />
        </View>

        <View style={styles.rankingItem}>
          <Text style={styles.rankingNumber}>3.</Text>
          <Image source={{ uri: "https://via.placeholder.com/128x128" }} style={styles.rankingImage} />
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
  contentContainer: {
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 24,
    color: "#24262b",
  },
  rankingItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  rankingNumber: {
    fontSize: 20,
    fontWeight: "bold",
    marginRight: 16,
    color: "#24262b",
  },
  rankingImage: {
    width: 128,
    height: 128,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#dadada",
  },
})
