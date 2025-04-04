import { Tabs } from "expo-router"
import { useColorScheme } from "@/hooks/useColorScheme"
import { Ionicons, FontAwesome } from "@expo/vector-icons"
import Colors from "@/constants/Colors"

export default function TabLayout() {
  const colorScheme = useColorScheme()

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: "#dadada",
          height: 60,
          paddingBottom: 10,
        },
        headerStyle: {
          backgroundColor: "#ffffff",
        },
        headerTitleStyle: {
          fontWeight: "bold",
          fontSize: 20,
        },
        headerTitleAlign: "center",
        headerLeft: () => <Ionicons name="menu-outline" size={24} color="#24262b" style={{ marginLeft: 15 }} />,
        headerRight: () => <FontAwesome name="user-circle" size={24} color="#24262b" style={{ marginRight: 15 }} />,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Rankd",
          tabBarIcon: ({ color }) => <Ionicons name="home-outline" size={24} color={color} />,
          tabBarLabel: "",
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "Rankd",
          tabBarIcon: ({ color }) => <Ionicons name="search-outline" size={24} color={color} />,
          tabBarLabel: "",
        }}
      />
      <Tabs.Screen
        name="people"
        options={{
          title: "Rankd",
          tabBarIcon: ({ color }) => <Ionicons name="people-outline" size={24} color={color} />,
          tabBarLabel: "",
        }}
      />
      <Tabs.Screen
        name="rankings"
        options={{
          title: "Rankd",
          tabBarIcon: ({ color }) => <Ionicons name="list-outline" size={24} color={color} />,
          tabBarLabel: "",
        }}
      />
    </Tabs>
  )
}

