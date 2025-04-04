import { StyleSheet, View, Text, TouchableOpacity } from "react-native"
import { Link } from "expo-router"
import { SafeAreaView } from "react-native-safe-area-context"

export default function LoginScreen() {
  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <View style={styles.contentContainer}>
        <Text style={styles.title}>Rankd</Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={[styles.button, styles.buttonPrimary]}>
            <Text style={styles.buttonText}></Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.button, styles.buttonSecondary]}>
            <Text style={styles.buttonText}></Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.button, styles.buttonTertiary]}>
            <Text style={styles.buttonText}></Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.button, styles.buttonQuaternary]}>
            <Text style={styles.buttonText}></Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          <Link href="/login" style={styles.link}>
            Login
          </Link>
          {" or "}
          <Link href="/signup" style={styles.link}>
            Sign Up
          </Link>
        </Text>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 48,
  },
  buttonContainer: {
    width: "100%",
    maxWidth: 300,
    gap: 16,
  },
  button: {
    width: "100%",
    paddingVertical: 12,
    borderRadius: 24,
  },
  buttonPrimary: {
    backgroundColor: "#ff9500",
  },
  buttonSecondary: {
    backgroundColor: "rgba(217, 217, 217, 0.8)",
  },
  buttonTertiary: {
    backgroundColor: "rgba(128, 128, 128, 0.8)",
  },
  buttonQuaternary: {
    backgroundColor: "rgba(128, 128, 128, 0.6)",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
    color: "#24262b",
  },
  footer: {
    padding: 24,
    alignItems: "center",
  },
  footerText: {
    color: "#ffffff",
    fontSize: 16,
  },
  link: {
    textDecorationLine: "underline",
    color: "#ffffff",
  },
})

