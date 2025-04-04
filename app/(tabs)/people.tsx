import { StyleSheet, View, Text } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

export default function PeopleScreen() {
  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <View style={styles.contentContainer}>
        <Text style={styles.title}>People</Text>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#24262b",
  },
})

