/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

/**
 * Color scheme for the subscription tracking app
 * Using a modern, vibrant palette with dark mode support
 */

const primaryLight = "#6C5CE7"; // Vibrant purple
const primaryDark = "#7D6EE7"; // Slightly lighter purple for dark mode
const accentLight = "#00CCBC"; // Teal accent
const accentDark = "#00D8C6"; // Brighter teal for dark mode

export const Colors = {
  light: {
    text: "#2D3748",
    textSecondary: "#718096",
    background: "#F7FAFC",
    card: "#FFFFFF",
    cardBorder: "#E2E8F0",
    primary: primaryLight,
    secondary: "#FC8181", // Soft coral
    accent: accentLight,
    success: "#48BB78",
    danger: "#F56565",
    warning: "#ECC94B",
    tabIconDefault: "#A0AEC0",
    tabIconSelected: primaryLight,
  },
  dark: {
    text: "#F7FAFC",
    textSecondary: "#CBD5E0",
    background: "#171923",
    card: "#2D3748",
    cardBorder: "#4A5568",
    primary: primaryDark,
    secondary: "#FC8181", // Soft coral
    accent: accentDark,
    success: "#68D391",
    danger: "#FC8181",
    warning: "#F6E05E",
    tabIconDefault: "#A0AEC0",
    tabIconSelected: primaryDark,
  },
};
