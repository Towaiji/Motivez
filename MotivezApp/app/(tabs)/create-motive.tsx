import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Switch,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CreateMotiveScreen() {
  // form state
  const [step, setStep] = useState(0);
  const [image, setImage] = useState<string | null>(null);
  const [location, setLocation] = useState('');
  const [price, setPrice] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [description, setDescription] = useState('');

  // categories/chips state
  const categories = ["🎉 Fun", "🌿 Chill", "⚽ Sports", "🎵 Music", "📚 Study", "🍔 Food"];
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const pickImage = async () => {
    const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!granted) {
      return Alert.alert('Permission Required', 'We need access to your gallery.');
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSubmit = () => {
    if (!image || !location || !price || !selectedCategory) {
      return Alert.alert('Missing Info', 'Please fill out all required fields and choose a vibe.');
    }
    // your submit logic here...
    console.log({
      image,
      location,
      price,
      privacy: isPublic ? 'Public' : 'Friends Only',
      description,
      category: selectedCategory,
    });
    Alert.alert('Success', 'Motive posted!');
  };

  const steps = ['Photo', 'Details', 'Preview'];

  return (
    <SafeAreaView style={styles.safeContainer}>
      {/* Step Indicator */}
      <View style={styles.stepIndicator}>
        {steps.map((label, i) => (
          <View key={i} style={styles.stepWrapper}>
            <View style={[
              styles.stepCircle,
              i === step && styles.stepCircleActive
            ]}>
              <Text style={[
                styles.stepNumber,
                i === step && styles.stepNumberActive
              ]}>{i + 1}</Text>
            </View>
            <Text style={[
              styles.stepLabel,
              i === step && styles.stepLabelActive
            ]}>{label}</Text>
          </View>
        ))}
      </View>

      {/* Title */}
      <View style={styles.headerRow}>
        <Text style={styles.headerTitle}>{steps[step]}</Text>
      </View>

      {/* Content */}
      <ScrollView contentContainerStyle={styles.container}>
        {/* Step 1: Photo */}
        {step === 0 && (
          <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
            {image
              ? <Image source={{ uri: image }} style={styles.image} />
              : <Text style={styles.imagePlaceholder}>Tap to select photo</Text>
            }
          </TouchableOpacity>
        )}

        {/* Step 2: Details */}
        {step === 1 && (
          <>
            <TextInput
              placeholder="Location"
              style={styles.input}
              value={location}
              onChangeText={setLocation}
            />
            <TextInput
              placeholder="Price (CAD)"
              style={styles.input}
              keyboardType="numeric"
              value={price}
              onChangeText={setPrice}
            />
            <TextInput
              placeholder="Description (optional)"
              style={[styles.input, { height: 80 }]}
              multiline
              value={description}
              onChangeText={setDescription}
            />

            {/* Category Chips */}
            <Text style={styles.subheading}>Choose a vibe</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.chipRow}
            >
              {categories.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.chip,
                    selectedCategory === cat && styles.chipSelected,
                  ]}
                  onPress={() =>
                    setSelectedCategory(selectedCategory === cat ? null : cat)
                  }
                >
                  <Text
                    style={[
                      styles.chipText,
                      selectedCategory === cat && styles.chipTextSelected,
                    ]}
                  >
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <View style={styles.switchRow}>
              <Text style={styles.label}>Friends Only</Text>
              <Switch value={isPublic} onValueChange={setIsPublic} />
              <Text style={styles.label}>Public</Text>
            </View>
          </>
        )}

        {/* Step 3: Preview */}
        {step === 2 && (
          <View style={styles.preview}>
            {image && <Image source={{ uri: image }} style={styles.previewImage} />}
            <Text style={styles.previewText}>
              <Text style={styles.bold}>Location:</Text> {location}
            </Text>
            <Text style={styles.previewText}>
              <Text style={styles.bold}>Price:</Text> ${price}
            </Text>
            <Text style={styles.previewText}>
              <Text style={styles.bold}>Privacy:</Text> {isPublic ? 'Public' : 'Friends Only'}
            </Text>
            <Text style={styles.previewText}>
              <Text style={styles.bold}>Vibe:</Text> {selectedCategory}
            </Text>
            {description.length > 0 && (
              <Text style={styles.previewText}>
                <Text style={styles.bold}>Description:</Text> {description}
              </Text>
            )}
          </View>
        )}
      </ScrollView>

      {/* Navigation Buttons */}
      <View style={styles.navRow}>
        {step > 0 && (
          <TouchableOpacity
            onPress={() => setStep(step - 1)}
            style={styles.navBtn}
          >
            <Text style={styles.navText}>Back</Text>
          </TouchableOpacity>
        )}
        {step < steps.length - 1 ? (
          <TouchableOpacity
            onPress={() => setStep(step + 1)}
            style={[styles.navBtn, styles.nextBtn]}
          >
            <Text style={[styles.navText, styles.nextText]}>Next</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={handleSubmit}
            style={[styles.navBtn, styles.submitBtn]}
          >
            <Text style={[styles.navText, styles.submitText]}>Post</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: { flex: 1, backgroundColor: '#f4f6f8', paddingTop: 50 },
  stepIndicator: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    backgroundColor: '#fff',
  },
  stepWrapper: { alignItems: 'center' },
  stepCircle: {
    width: 24, height: 24, borderRadius: 12,
    backgroundColor: '#ddd', justifyContent: 'center', alignItems: 'center',
  },
  stepCircleActive: { backgroundColor: '#e91e63' },
  stepNumber: { color: '#444', fontSize: 12 },
  stepNumberActive: { color: '#fff', fontWeight: 'bold' },
  stepLabel: { fontSize: 10, color: '#666', marginTop: 2 },
  stepLabelActive: { color: '#e91e63', fontWeight: '600' },

  headerRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 20, paddingBottom: 4,
  },
  headerTitle: {
    fontSize: 24, fontWeight: 'bold', color: '#333',
    marginLeft: 10,
  },

  container: {
    padding: 20, flexGrow: 1, alignItems: 'center',
  },
  imagePicker: {
    width: '100%', height: 200, backgroundColor: '#ddd',
    borderRadius: 12, justifyContent: 'center',
    alignItems: 'center', overflow: 'hidden', marginBottom: 20,
  },
  imagePlaceholder: { color: '#666' },
  image: { width: '100%', height: '100%' },

  input: {
    width: '100%', backgroundColor: '#fff',
    padding: 12, borderRadius: 8, marginBottom: 15, fontSize: 16,
  },
  subheading: {
    alignSelf: 'flex-start',
    marginBottom: 8,
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  chipRow: {
    width: '100%',
    marginBottom: 20,
    paddingVertical: 50,
  },
  chip: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
  },
  chipSelected: {
    backgroundColor: '#e91e63',
  },
  chipText: {
    color: '#444',
    fontSize: 14,
  },
  chipTextSelected: {
    color: '#fff',
    fontWeight: '600',
  },

  switchRow: {
    flexDirection: 'row', alignItems: 'center',
    marginBottom: 20,
  },
  label: { marginHorizontal: 8, color: '#444' },

  preview: { alignItems: 'flex-start', width: '100%' },
  previewImage: {
    width: '100%', height: 200, borderRadius: 12, marginBottom: 15,
  },
  previewText: { fontSize: 16, color: '#333', marginBottom: 6 },
  bold: { fontWeight: '600' },

  navRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingVertical: 10, paddingBottom: 80,
  },
  navBtn: {
    paddingVertical: 10, paddingHorizontal: 20,
    borderRadius: 8, backgroundColor: '#ddd',
  },
  navText: { fontSize: 16, color: '#444' },
  nextBtn: { backgroundColor: '#e91e63' },
  nextText: { color: '#fff' },
  submitBtn: { backgroundColor: '#4CAF50' },
  submitText: { color: '#fff', fontWeight: 'bold' },
});
