import React from "react";
import { 
  View, 
  Text, 
  Image, 
  StyleSheet, 
  ScrollView, 
  Dimensions,
  TouchableOpacity 
} from "react-native";
import { SharedElement } from "react-navigation-shared-element";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

const { width, height } = Dimensions.get("window");

type RootStackParamList = {
  tabs: undefined;
  detail: {
    id: string;
    title: string;
    description?: string;
    image: string;
  };
};

type DetailScreenRouteProp = RouteProp<RootStackParamList, 'detail'>;
type DetailScreenNavigationProp = StackNavigationProp<RootStackParamList, 'detail'>;

export default function DetailScreen() {
  const navigation = useNavigation<DetailScreenNavigationProp>();
  const route = useRoute<DetailScreenRouteProp>();
  
  const { id, title, description, image } = route.params;

  return (
    <ScrollView style={styles.container}>
      <SharedElement id={`item.${id}.photo`}>
        <Image source={{ uri: image }} style={styles.image} />
      </SharedElement>
      
      <TouchableOpacity 
        style={styles.backButton} 
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>
      
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>
          {description ?? "Lorem ipsum dolor sit amet, consectetur adipiscing elit..."}
        </Text>
      </View>
    </ScrollView>
  );
}

// CRITICAL: This is the key part that was missing proper configuration
DetailScreen.sharedElements = (route: DetailScreenRouteProp) => {
  const { id } = route.params;
  return [
    {
      id: `item.${id}.photo`,
      animation: 'move',
      resize: 'clip',
      align: 'center-top',
    }
  ];
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  image: {
    width: width,
    height: height * 0.5,
    resizeMode: 'cover',
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    zIndex: 1,
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: "#444",
  },
});