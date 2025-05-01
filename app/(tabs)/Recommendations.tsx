import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

// Mock data for recommended apps by category
const recommendedApps = {
  Streaming: [
    {
      name: "Netflix",
      price: "$15.49/month",
      rating: 4.8,
      website: "https://www.netflix.com",
      logo: "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg",
    },
    {
      name: "Disney+",
      price: "$7.99/month",
      rating: 4.7,
      website: "https://www.disneyplus.com",
      logo: "https://upload.wikimedia.org/wikipedia/commons/3/3e/Disney%2B_logo.svg",
    },
    {
      name: "HBO Max",
      price: "$14.99/month",
      rating: 4.6,
      website: "https://www.hbomax.com",
      logo: "https://upload.wikimedia.org/wikipedia/commons/1/17/HBO_Max_Logo.svg",
    },
    {
      name: "Prime Video",
      price: "$8.99/month",
      rating: 4.5,
      website: "https://www.primevideo.com",
      logo: "https://upload.wikimedia.org/wikipedia/commons/1/11/Amazon_Prime_Video_logo.svg",
    },
  ],
  Entertainment: [
    {
      name: "Spotify",
      price: "$9.99/month",
      rating: 4.8,
      website: "https://www.spotify.com",
      logo: "https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg",
    },
    {
      name: "Apple Music",
      price: "$9.99/month",
      rating: 4.7,
      website: "https://www.apple.com/apple-music/",
      logo: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg",
    },
    {
      name: "YouTube Music",
      price: "$9.99/month",
      rating: 4.6,
      website: "https://music.youtube.com",
      logo: "https://upload.wikimedia.org/wikipedia/commons/0/09/YouTube_full-color_icon_%282017%29.svg",
    },
    {
      name: "Tidal",
      price: "$9.99/month",
      rating: 4.5,
      website: "https://tidal.com",
      logo: "https://upload.wikimedia.org/wikipedia/commons/8/8a/Tidal_logo.svg",
    },
  ],
  "Video Editing": [
    {
      name: "Premiere Pro",
      price: "$20.99/month",
      rating: 4.9,
      website: "https://www.adobe.com/products/premiere.html",
      logo: "https://upload.wikimedia.org/wikipedia/commons/4/4b/Adobe_Premiere_Pro_CC_icon.svg",
    },
    {
      name: "Final Cut Pro",
      price: "$299.99/year",
      rating: 4.8,
      website: "https://www.apple.com/final-cut-pro/",
      logo: "https://upload.wikimedia.org/wikipedia/commons/0/0c/Final_Cut_Pro_icon.svg",
    },
    {
      name: "DaVinci Resolve",
      price: "$295/year",
      rating: 4.7,
      website: "https://www.blackmagicdesign.com/products/davinciresolve/",
      logo: "https://upload.wikimedia.org/wikipedia/commons/9/90/DaVinci_Resolve_17_logo.svg",
    },
    {
      name: "Filmora",
      price: "$49.99/year",
      rating: 4.6,
      website: "https://filmora.wondershare.com/",
      logo: "https://upload.wikimedia.org/wikipedia/commons/9/9e/Filmora_logo.svg",
    },
  ],
  "Photo Editing": [
    {
      name: "Photoshop",
      price: "$20.99/month",
      rating: 4.9,
      website: "https://www.adobe.com/products/photoshop.html",
      logo: "https://upload.wikimedia.org/wikipedia/commons/a/af/Adobe_Photoshop_CC_icon.svg",
    },
    {
      name: "Lightroom",
      price: "$9.99/month",
      rating: 4.8,
      website: "https://www.adobe.com/products/photoshop-lightroom.html",
      logo: "https://upload.wikimedia.org/wikipedia/commons/5/56/Adobe_Photoshop_Lightroom_Classic_CC_icon.svg",
    },
    {
      name: "Canva Pro",
      price: "$12.99/month",
      rating: 4.7,
      website: "https://www.canva.com/pro/",
      logo: "https://upload.wikimedia.org/wikipedia/commons/0/08/Canva_icon_2021.svg",
    },
    {
      name: "Figma",
      price: "$12/month",
      rating: 4.6,
      website: "https://www.figma.com",
      logo: "https://upload.wikimedia.org/wikipedia/commons/3/33/Figma-logo.svg",
    },
  ],
  "Graphic Design": [
    {
      name: "Illustrator",
      price: "$20.99/month",
      rating: 4.9,
      website: "https://www.adobe.com/products/illustrator.html",
      logo: "https://upload.wikimedia.org/wikipedia/commons/f/fb/Adobe_Illustrator_CC_icon.svg",
    },
    {
      name: "InDesign",
      price: "$20.99/month",
      rating: 4.8,
      website: "https://www.adobe.com/products/indesign.html",
      logo: "https://upload.wikimedia.org/wikipedia/commons/4/48/Adobe_InDesign_CC_icon.svg",
    },
    {
      name: "Affinity Designer",
      price: "$54.99",
      rating: 4.7,
      website: "https://affinity.serif.com/designer/",
      logo: "https://upload.wikimedia.org/wikipedia/commons/4/4b/Affinity_Designer_icon.svg",
    },
    {
      name: "CorelDRAW",
      price: "$249/year",
      rating: 4.6,
      website: "https://www.coreldraw.com",
      logo: "https://upload.wikimedia.org/wikipedia/commons/9/9f/CorelDRAW_logo.svg",
    },
  ],
  Productivity: [
    {
      name: "Microsoft 365",
      price: "$6.99/month",
      rating: 4.8,
      website: "https://www.microsoft.com/microsoft-365",
      logo: "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg",
    },
    {
      name: "Notion",
      price: "$8/month",
      rating: 4.7,
      website: "https://www.notion.so",
      logo: "https://upload.wikimedia.org/wikipedia/commons/4/45/Notion_app_logo.png",
    },
    {
      name: "Todoist",
      price: "$4/month",
      rating: 4.6,
      website: "https://todoist.com",
      logo: "https://upload.wikimedia.org/wikipedia/commons/5/5d/Todoist_logo.svg",
    },
    {
      name: "Evernote",
      price: "$7.99/month",
      rating: 4.5,
      website: "https://evernote.com",
      logo: "https://upload.wikimedia.org/wikipedia/commons/8/8d/Evernote_logo.svg",
    },
  ],
  "AI Tools": [
    {
      name: "ChatGPT Plus",
      price: "$20/month",
      rating: 4.9,
      website: "https://chat.openai.com",
      logo: "https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg",
    },
    {
      name: "Midjourney",
      price: "$10/month",
      rating: 4.8,
      website: "https://www.midjourney.com",
      logo: "https://upload.wikimedia.org/wikipedia/commons/5/5d/Midjourney_logo.svg",
    },
    {
      name: "Grammarly",
      price: "$12/month",
      rating: 4.7,
      website: "https://www.grammarly.com",
      logo: "https://upload.wikimedia.org/wikipedia/commons/3/34/Grammarly_logo.svg",
    },
    {
      name: "Copy.ai",
      price: "$49/month",
      rating: 4.6,
      website: "https://www.copy.ai",
      logo: "https://upload.wikimedia.org/wikipedia/commons/9/9c/Copy.ai_logo.svg",
    },
  ],
  "Development Tools": [
    {
      name: "GitHub Pro",
      price: "$4/month",
      rating: 4.9,
      website: "https://github.com",
      logo: "https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg",
    },
    {
      name: "JetBrains",
      price: "$149/year",
      rating: 4.8,
      website: "https://www.jetbrains.com",
      logo: "https://upload.wikimedia.org/wikipedia/commons/1/1a/JetBrains_Logo_2016.svg",
    },
    {
      name: "VS Code",
      price: "Free",
      rating: 4.7,
      website: "https://code.visualstudio.com",
      logo: "https://upload.wikimedia.org/wikipedia/commons/9/9a/Visual_Studio_Code_1.35_icon.svg",
    },
    {
      name: "Figma",
      price: "$12/month",
      rating: 4.6,
      website: "https://www.figma.com",
      logo: "https://upload.wikimedia.org/wikipedia/commons/3/33/Figma-logo.svg",
    },
  ],
};

interface App {
  name: string;
  price: string;
  rating: number;
  website: string;
  logo: string;
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
      <Image
        source={{ uri: app.logo }}
        style={styles.appLogo}
        resizeMode="contain"
      />
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
  appLogo: {
    width: "100%",
    height: "70%",
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
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
});
