/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = "#24262b"
const tintColorDark = "#fff"

export default {
  light: {
    text: "#24262b",
    background: "#ffffff",
    tint: tintColorLight,
    tabIconDefault: "#d9d9d9",
    tabIconSelected: tintColorLight,
    border: "#dadada",
    muted: "#f6f6f6",
    primary: "#ff9500",
  },
  dark: {
    text: "#fff",
    background: "#000",
    tint: tintColorDark,
    tabIconDefault: "#ccc",
    tabIconSelected: tintColorDark,
    border: "#444",
    muted: "#222",
    primary: "#ff9500",
  },
}


