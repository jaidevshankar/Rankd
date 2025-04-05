import { StyleSheet, View, Text, TouchableOpacity } from "react-native"
import { Link, Stack } from "expo-router"
import { SafeAreaView } from "react-native-safe-area-context"

export default function SignupScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Sign Up" }} />
      <SafeAreaView style={styles.container} edges={["bottom"]}>
        <View style={styles.contentContainer}>
          <Text style={styles.title}>Create Account</Text>

          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>

          <Text style={styles.footerText}>
            Already have an account?{" "}
            <Link href="/login" style={styles.link}>
              Login
            </Link>
          </Text>
        </View>
      </SafeAreaView>
    </>
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
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#24262b",
    marginBottom: 32,
  },
  button: {
    width: "100%",
    maxWidth: 300,
    backgroundColor: "#ff9500",
    paddingVertical: 12,
    borderRadius: 24,
    marginBottom: 24,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
    color: "#24262b",
  },
  footerText: {
    color: "#24262b",
    fontSize: 16,
  },
  link: {
    textDecorationLine: "underline",
    color: "#ff9500",
  },
})
