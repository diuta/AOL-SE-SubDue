import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Image,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

// Define Tab Bar Height for padding
const TAB_BAR_HEIGHT = Platform.OS === 'ios' ? 88 : 72;

// Mock data for recommended apps by category
const recommendedApps = {
  Streaming: [
    {
      name: "Netflix",
      price: "$15.49/month",
      rating: 4.8,
      website: "https://www.netflix.com",
      logo: require("../../assets/images/netflix_logo.png"),
    },
    {
      name: "Disney+",
      price: "$7.99/month",
      rating: 4.7,
      website: "https://www.disneyplus.com",
      logo: require("../../assets/images/DisneyPlus_Logo.png"),
    },
    {
      name: "HBO Max",
      price: "$14.99/month",
      rating: 4.6,
      website: "https://www.hbomax.com",
      logo: require("../../assets/images/hbomax_logo.png"),
    },
    {
      name: "Prime Video",
      price: "$8.99/month",
      rating: 4.5,
      website: "https://www.primevideo.com",
      logo: require("../../assets/images/PrimeVideo_logo.png"),
    },
  ],
  Entertainment: [
    {
      name: "Spotify",
      price: "$9.99/month",
      rating: 4.8,
      website: "https://www.spotify.com",
      logo: require("../../assets/images/spotify_logo.png"),
    },
    {
      name: "Apple Music",
      price: "$9.99/month",
      rating: 4.7,
      website: "https://www.apple.com/apple-music/",
      logo: require("../../assets/images/Apple_Logo.png"),
    },
    {
      name: "YouTube Music",
      price: "$9.99/month",
      rating: 4.6,
      website: "https://music.youtube.com",
      logo: require("../../assets/images/youtube_logo.png"),
    },
    {
      name: "Tidal",
      price: "$9.99/month",
      rating: 4.5,
      website: "https://tidal.com",
      logo: require("../../assets/images/tidal_logo.png"),
    },
  ],
  "Video Editing": [
    {
      name: "Premiere Pro",
      price: "$20.99/month",
      rating: 4.9,
      website: "https://www.adobe.com/products/premiere.html",
      logo: require("../../assets/images/Pr_Logo.png"),
    },
    {
      name: "Final Cut Pro",
      price: "$299.99/year",
      rating: 4.8,
      website: "https://www.apple.com/final-cut-pro/",
      logo: require("../../assets/images/FinalCut_logo.png"),
    },
    {
      name: "DaVinci Resolve",
      price: "$295/year",
      rating: 4.7,
      website: "https://www.blackmagicdesign.com/products/davinciresolve/",
      logo: require("../../assets/images/Davinci_logo.png"),
    },
    {
      name: "Filmora",
      price: "$49.99/year",
      rating: 4.6,
      website: "https://filmora.wondershare.com/",
      logo: require("../../assets/images/filmora_logo.png"),
    },
  ],
  "Photo Editing": [
    {
      name: "Photoshop",
      price: "$20.99/month",
      rating: 4.9,
      website: "https://www.adobe.com/products/photoshop.html",
      logo: require("../../assets/images/photoshop_logo.png"),
    },
    {
      name: "Lightroom",
      price: "$9.99/month",
      rating: 4.8,
      website: "https://www.adobe.com/products/photoshop-lightroom.html",
      logo: require("../../assets/images/Lightroom_Logo.png"),
    },
    {
      name: "Canva Pro",
      price: "$12.99/month",
      rating: 4.7,
      website: "https://www.canva.com/pro/",
      logo: require("../../assets/images/Canva_logo.png"),
    },
    {
      name: "Figma",
      price: "$12/month",
      rating: 4.6,
      website: "https://www.figma.com",
      logo: require("../../assets/images/figma_logo.png"),
    },
  ],
  "Graphic Design": [
    {
      name: "Illustrator",
      price: "$20.99/month",
      rating: 4.9,
      website: "https://www.adobe.com/products/illustrator.html",
      logo: require("../../assets/images/ai_logo.png"),
    },
    {
      name: "InDesign",
      price: "$20.99/month",
      rating: 4.8,
      website: "https://www.adobe.com/products/indesign.html",
      logo: require("../../assets/images/indesign_logo.png"),
    },
    {
      name: "Affinity Designer",
      price: "$54.99",
      rating: 4.7,
      website: "https://affinity.serif.com/designer/",
      logo: require("../../assets/images/affinity_logo.png"),
    },
    {
      name: "CorelDRAW",
      price: "$249/year",
      rating: 4.6,
      website: "https://www.coreldraw.com",
      logo: require("../../assets/images/coreldraw_logo.png"),
    },
  ],
  Productivity: [
    {
      name: "Microsoft 365",
      price: "$6.99/month",
      rating: 4.8,
      website: "https://www.microsoft.com/microsoft-365",
      logo: require("../../assets/images/Microsoft_365_logo.png"),
    },
    {
      name: "Notion",
      price: "$8/month",
      rating: 4.7,
      website: "https://www.notion.so",
      logo: require("../../assets/images/Notion_logo.png"),
    },
    {
      name: "Todoist",
      price: "$4/month",
      rating: 4.6,
      website: "https://todoist.com",
      logo: require("../../assets/images/todoist_logo.png"),
    },
    {
      name: "Evernote",
      price: "$7.99/month",
      rating: 4.5,
      website: "https://evernote.com",
      logo: require("../../assets/images/evernote_logo.png"),
    },
  ],
  "AI Tools": [
    {
      name: "ChatGPT Plus",
      price: "$20/month",
      rating: 4.9,
      website: "https://chat.openai.com",
      logo: require("../../assets/images/chatgpt_logo.png"),
    },
    {
      name: "Midjourney",
      price: "$10/month",
      rating: 4.8,
      website: "https://www.midjourney.com",
      logo: require("../../assets/images/midjourney_logo.png"),
    },
    {
      name: "Grammarly",
      price: "$12/month",
      rating: 4.7,
      website: "https://www.grammarly.com",
      logo: require("../../assets/images/grammarly_logo.png"),
    },
    {
      name: "Copy.ai",
      price: "$49/month",
      rating: 4.6,
      website: "https://www.copy.ai",
      logo: require("../../assets/images/copyai_logo.png"),
    },
  ],
  "Development Tools": [
    {
      name: "GitHub Pro",
      price: "$4/month",
      rating: 4.9,
      website: "https://github.com",
      logo: require("../../assets/images/Github_logo.png"),
    },
    {
      name: "JetBrains",
      price: "$149/year",
      rating: 4.8,
      website: "https://www.jetbrains.com",
      logo: require("../../assets/images/jetbrains_logo.png"),
    },
    {
      name: "VS Code",
      price: "Free",
      rating: 4.7,
      website: "https://code.visualstudio.com",
      logo: require("../../assets/images/VSCode_Logo.png"),
    },
    {
      name: "Figma",
      price: "$12/month",
      rating: 4.6,
      website: "https://www.figma.com",
      logo: require("../../assets/images/figma_logo.png"),
    },
  ],
};

interface App {
  name: string;
  price: string;
  rating: number;
  website: string;
  logo: any;
}

const RecommendationCard = ({ app }: { app: App }) => {
  const router = useRouter();

  const handleAddSubscription = () => {
    router.push({
      pathname: "/AddSubscription",
      params: { name: app.name, price: app.price },
    });
  };

  const handleVisitWebsite = () => {
    Linking.openURL(app.website);
  };

  return (
    <View style={styles.card}>
      <View style={styles.logoContainer}>
        <Image
          source={app.logo}
          style={styles.appLogo}
          resizeMode="contain"
        />
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.websiteButton]}
          onPress={handleVisitWebsite}
        >
          <Ionicons name="globe-outline" size={16} color="#FFFFFF" />
          <Text style={styles.buttonText}>Website</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.addButton]}
          onPress={handleAddSubscription}
        >
          <Ionicons name="add-circle-outline" size={16} color="#FFFFFF" />
          <Text style={styles.buttonText}>Add</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const CategorySection = ({ title, apps }: { title: string; apps: App[] }) => (
  <View style={styles.categorySection}>
    <Text style={styles.categoryTitle}>{title}</Text>
    <View style={styles.appsGrid}>
      {apps.map((app, index) => (
        <RecommendationCard key={index} app={app} />
      ))}
    </View>
  </View>
);

export default function Recommendations() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Recommended Apps</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        {Object.entries(recommendedApps).map(([category, apps]) => (
          <CategorySection key={category} title={category} apps={apps} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#050511",
    paddingBottom: TAB_BAR_HEIGHT + 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#2B2C4B",
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  scrollView: {
    flex: 1,
  },
  categorySection: {
    padding: 16,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#FFFFFF",
  },
  appsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
  },
  card: {
    width: "48%",
    aspectRatio: 1,
    backgroundColor: "#2B2C4B",
    borderRadius: 16,
    padding: 12,
    justifyContent: "space-between",
  },
  logoContainer: {
    width: "100%",
    height: "70%",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  appLogo: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  button: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 8,
    borderRadius: 6,
    gap: 4,
  },
  websiteButton: {
    backgroundColor: "#4649E5",
  },
  addButton: {
    backgroundColor: "#2B2C4B",
    borderWidth: 1,
    borderColor: "#4649E5",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingBottom: TAB_BAR_HEIGHT + 20,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: TAB_BAR_HEIGHT + 20,
  },
});

