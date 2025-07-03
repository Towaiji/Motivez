import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  Alert,
  Switch,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import ProgressBar from '../../components/ProgressBar';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from "../../lib/supabaseClient";
import { useRouter } from "expo-router";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import Constants from 'expo-constants';
import 'react-native-get-random-values';

export default function CreateMotiveScreen() {
  // form state
  const [step, setStep] = useState(0);
  const [image, setImage] = useState<string | null>(null);
  const [location, setLocation] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [modeSelected, setModeSelected] = useState<'friends' | 'public' | null>(null);
  const [requiresApproval, setRequiresApproval] = useState(false);
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  // categories/chips state
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const [selectedPlace, setSelectedPlace] = useState<{
    name: string;
    coordinates: { latitude: number; longitude: number };
  } | null>(null);

  const placesRef = useRef<any>(null);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

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

  const router = useRouter();

  // ensure location text persists when navigating back to step 2
  useEffect(() => {
    if (step === 1 && placesRef.current) {
      placesRef.current.setAddressText(location);
    }
  }, [step]);


  const handleSubmit = async () => {
    if (!title || !location || !price || !selectedCategory) {
      return Alert.alert("Missing Info", "Please fill out all required fields.");
    }

    // Get logged-in user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return Alert.alert("Error", "Unable to identify user.");
    }

    // Insert into Supabase
    const { error } = await supabase.from("motives").insert([
      {
        user_id: user.id,
        title,
        description,
        category: selectedCategory,
        image_url: image || null,
        privacy: modeSelected === 'public' ? 'Public' : 'Friends',
        notes,
        start_time: startTime?.toISOString() ?? null,
        end_time: endTime?.toISOString() ?? null,
        latitude: selectedPlace?.coordinates.latitude ?? null,
        longitude: selectedPlace?.coordinates.longitude ?? null,
        requires_approval: modeSelected === 'public' ? requiresApproval : false,
      }
    ]);

    if (error) {
      console.error("Supabase insert error:", error);
      return Alert.alert("Error", "Failed to post motive.");
    }

    router.push("/motive-success");
  };

  const steps = ['Photo', 'Details', 'Preview'];

  if (!modeSelected) {
    return (
      <SafeAreaView style={styles.safeContainer}>
        <View style={{ alignItems: 'center', marginTop: 150 }}>
          <Text style={{ fontSize: 35, fontWeight: 'bold', marginBottom: 20 }}>
            Create a Motive
          </Text>

          <Text style={{ fontSize: 16, color: '#666', marginBottom: 40, textAlign: 'center' }}>
            Is this just for the crew, or for the world?
          </Text>

          <View style={{ flexDirection: 'row', gap: 16, marginTop: 40 }}>
            <TouchableOpacity
              style={styles.bubbleBtn}
              onPress={() => {
                setModeSelected('friends');
                setStep(0);
              }}
            >
              <Text style={styles.bubbleText}>Friends</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.bubbleBtn}
              onPress={() => {
                setModeSelected('public');
                setStep(0);
              }}
            >
              <Text style={styles.bubbleText}>Public</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeContainer}>
      {/* Step Indicator */}
      <ProgressBar steps={steps} currentStep={step} />

      {/* Title */}
      <View style={styles.headerRow}>
        <Text style={styles.headerTitle}>{steps[step]}</Text>
      </View>

      {/* Content */}
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        {/* Step 1: Photo */}
        {step === 0 && (
          <>
            <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
              {image
                ? <Image source={{ uri: image }} style={styles.image} />
                : <Text style={styles.imagePlaceholder}>Tap to select photo</Text>
              }
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setModeSelected(null);
                setStep(0);
                setImage(null);
              }}
              style={{ marginBottom: 20 }}
            >
              <Text style={{ color: '#e91e63', textAlign: 'center' }}>← Change mode (Friends/Public)</Text>
            </TouchableOpacity>
          </>
        )}

        {/* Step 2: Details */}
        {step === 1 && (
          <>
            <TextInput
              placeholder="Give your motive a title"
              style={styles.titleInput}
              value={title}
              onChangeText={setTitle}
              placeholderTextColor="#aaa"
              textAlign="left"
            />

            <Text style={styles.subheading}>Where's it happening?</Text>

            <View style={styles.locationContainer}>
              <GooglePlacesAutocomplete
                ref={placesRef}
                placeholder="Location"
                fetchDetails
                query={{
                  key: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY,
                  language: 'en',
                }}
                onPress={(data, details = null) => {
                  const name = data.description;
                  setLocation(name);
                  if (details?.geometry?.location) {
                    setSelectedPlace({
                      name,
                      coordinates: {
                        latitude: details.geometry.location.lat,
                        longitude: details.geometry.location.lng,
                      },
                    });
                  }
                }}
                enablePoweredByContainer={false}
                styles={{
                  textInput: styles.titleInput,
                  listView: { backgroundColor: '#fff', zIndex: 999 },
                  container: { flex: 0, zIndex: 999 },
                }}
                predefinedPlaces={[]}
                textInputProps={{
                  value: location,
                  onChangeText: setLocation,
                }}
                minLength={1}
              />
            </View>



            {/* Display selected location */}
            {selectedPlace && (
              <View style={styles.selectedLocationCard}>
                <Ionicons name="location" size={16} color="#ed5b77" />
                <Text style={styles.selectedLocationText} numberOfLines={2}>
                  {selectedPlace.name}
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    setLocation('');
                    setSelectedPlace(null);
                  }}
                  style={styles.clearLocationBtn}
                >
                  <Ionicons name="close-circle" size={20} color="#999" />
                </TouchableOpacity>
              </View>
            )}

            <Text style={styles.subheading}>When does it start and end?</Text>

            <View style={styles.timeRow}>
              {/* START TIME */}
              <TouchableOpacity
                style={[
                  styles.timeCard,
                  startTime && styles.timeCardSelected,
                ]}
                onPress={() => setShowStartPicker(true)}
              >
                <Ionicons name="time-outline" size={20} color={startTime ? '#ed5b77' : '#aaa'} />
                <Text style={styles.timeLabel}>Start</Text>
                <Text style={styles.timeValue}>
                  {startTime ? formatTime(startTime) : 'Select'}
                </Text>
              </TouchableOpacity>

              {/* END TIME */}
              <TouchableOpacity
                style={[
                  styles.timeCard,
                  endTime && styles.timeCardSelected,
                ]}
                onPress={() => setShowEndPicker(true)}
              >
                <Ionicons name="time-outline" size={20} color={endTime ? '#ed5b77' : '#aaa'} />
                <Text style={styles.timeLabel}>End</Text>
                <Text style={styles.timeValue}>
                  {endTime ? formatTime(endTime) : 'Select'}
                </Text>
              </TouchableOpacity>
            </View>

            <DateTimePickerModal
              isVisible={showStartPicker}
              mode="time"
              onConfirm={(date) => {
                setStartTime(date);
                setShowStartPicker(false);
              }}
              onCancel={() => setShowStartPicker(false)}
            />

            <DateTimePickerModal
              isVisible={showEndPicker}
              mode="time"
              onConfirm={(date) => {
                setEndTime(date);
                setShowEndPicker(false);
              }}
              onCancel={() => setShowEndPicker(false)}
            />

            <TextInput
              placeholder="Budget"
              style={styles.titleInput}
              keyboardType="numeric"
              value={price}
              onChangeText={setPrice}
              placeholderTextColor="#aaa"
              textAlign="left"
            />


            <TextInput
              placeholder="Description"
              style={[styles.titleInput, { height: 80 }]}
              multiline
              value={description}
              onChangeText={setDescription}
              placeholderTextColor="#aaa"
              textAlign="left"
            />

            <TextInput
              placeholder="Additional Notes"
              style={[styles.titleInput, { height: 60 }]}
              multiline
              value={notes}
              onChangeText={setNotes}
              placeholderTextColor="#aaa"
              textAlign="left"
            />


            {/* Category Chips */}
            <Text style={styles.subheading}>Choose a vibe</Text>
            <View style={styles.gridContainer}>
              {[
                { name: 'Fun', icon: 'sparkles' },
                { name: 'Chill', icon: 'cafe-outline' },
                { name: 'Sports', icon: 'football-outline' },
                { name: 'Music', icon: 'musical-notes-outline' },
                { name: 'Adventurous', icon: 'walk-outline' },
                { name: 'Food', icon: 'restaurant-outline' },
              ].map((category) => (
                <TouchableOpacity
                  key={category.name}
                  style={[
                    styles.chip,
                    selectedCategory === category.name && styles.chipSelected,
                  ]}
                  onPress={() =>
                    setSelectedCategory(selectedCategory === category.name ? null : category.name)
                  }
                >
                  <Ionicons
                    name={category.icon as any}
                    size={28}
                    color={selectedCategory === category.name ? '#fff' : '#333'}
                    style={{ marginBottom: 6 }}
                  />
                  <Text
                    style={[
                      styles.chipText,
                      selectedCategory === category.name && styles.chipTextSelected,
                    ]}
                  >
                    {category.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Privacy Switch */}
            {modeSelected === 'public' && (
              <View style={styles.segmentedContainer}>
                <TouchableOpacity
                  onPress={() => setRequiresApproval(false)}
                  style={[
                    styles.segmentedOption,
                    !requiresApproval && styles.segmentedSelected,
                  ]}
                >
                  <Ionicons
                    name="earth-outline"
                    size={18}
                    color={!requiresApproval ? '#fff' : '#333'}
                    style={{ marginBottom: 4 }}
                  />
                  <Text
                    style={[
                      styles.segmentedText,
                      !requiresApproval && styles.segmentedTextSelected,
                    ]}
                  >
                    Allow anyone
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setRequiresApproval(true)}
                  style={[
                    styles.segmentedOption,
                    requiresApproval && styles.segmentedSelected,
                  ]}
                >
                  <Ionicons
                    name="lock-closed-outline"
                    size={18}
                    color={requiresApproval ? '#fff' : '#333'}
                    style={{ marginBottom: 4 }}
                  />
                  <Text
                    style={[
                      styles.segmentedText,
                      requiresApproval && styles.segmentedTextSelected,
                    ]}
                  >
                    Require approval
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </>
        )}

        {/* Step 3: Preview */}
        {step === 2 && (
          <View style={styles.preview}>
            {image && <Image source={{ uri: image }} style={styles.previewImage} />}
            <Text style={styles.previewText}>
              <Text style={styles.bold}>Title:</Text> {title}
            </Text>
            <Text style={styles.previewText}>
              <Text style={styles.bold}>Location:</Text> {location}
            </Text>
            <Text style={styles.previewText}>
              <Text style={styles.bold}>Price:</Text> ${price}
            </Text>
            <Text style={styles.previewText}>
              <Text style={styles.bold}>Privacy:</Text> {modeSelected === 'public' ? 'Public' : 'Friends Only'}
            </Text>
            <Text style={styles.previewText}>
              <Text style={styles.bold}>Vibe:</Text> {selectedCategory}
            </Text>
            {startTime && (
              <Text style={styles.previewText}>
                <Text style={styles.bold}>Start Time:</Text> {formatTime(startTime)}
              </Text>
            )}
            {endTime && (
              <Text style={styles.previewText}>
                <Text style={styles.bold}>End Time:</Text> {formatTime(endTime)}
              </Text>
            )}
            {description.length > 0 && (
              <Text style={styles.previewText}>
                <Text style={styles.bold}>Description:</Text> {description}
              </Text>
            )}
            {notes.length > 0 && (
              <Text style={styles.previewText}>
                <Text style={styles.bold}>Notes:</Text> {notes}
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
    width: '100%',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16,
  },
  subheading: {
    alignSelf: 'flex-start',
    marginBottom: 8,
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  titleInput: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 16,
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
    marginBottom: 24,
    textAlign: 'left',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },

  // Location styles
  locationContainer: {
    width: '100%',
    marginBottom: 20,
    zIndex: 1000,
  },
  selectedLocationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 16,
    borderLeftWidth: 3,
    borderLeftColor: '#ed5b77',
  },
  selectedLocationText: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    marginLeft: 8,
    fontWeight: '500',
  },
  clearLocationBtn: {
    padding: 4,
  },

  chipRow: {
    width: '100%',
    marginBottom: 20,
    paddingVertical: 10,
  },
  chip: {
    width: 100,
    height: 100,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  chipSelected: {
    backgroundColor: '#ed5b77',
  },
  chipText: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
    fontWeight: '500',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  chipTextSelected: {
    color: '#fff',
    fontWeight: '600',
  },
  segmentedContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: '#f2f2f2',
    borderRadius: 12,
    padding: 4,
    marginVertical: 16,
  },
  segmentedOption: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentedSelected: {
    backgroundColor: '#ed5b77',
  },
  segmentedText: {
    fontSize: 13,
    color: '#333',
    fontWeight: '500',
    textAlign: 'center',
  },
  segmentedTextSelected: {
    color: '#fff',
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    marginBottom: 20,
    gap: 16,
  },
  timeCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  timeCardSelected: {
    borderColor: '#ed5b77',
    borderWidth: 1.5,
  },
  timeLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 6,
  },
  timeValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginTop: 2,
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

  bubbleBtn: {
    backgroundColor: '#e91e63',
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bubbleText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});