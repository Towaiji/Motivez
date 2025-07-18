import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
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
import { useTheme } from '../../lib/ThemeContext';
import { getColors } from '../../lib/colors';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

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
  const [scrollEnabled, setScrollEnabled] = useState(true);

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
      mediaTypes: ['images'], // updated to fix deprecation warning and linter error
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
        location: location, // Save the address string
        price: price,    // Save the budget/price
      }
    ]);

    if (error) {
      console.error("Supabase insert error:", error);
      return Alert.alert("Error", "Failed to post motive.");
    }

    router.push("/motive-success");
  };

  const steps = ['Photo', 'Details', 'Preview'];

  const { theme } = useTheme();
  const colors = getColors(theme);

  // Move styles here so colors is in scope
  const styles = StyleSheet.create({
    safeContainer: { flex: 1, backgroundColor: colors.background, paddingTop: 50 },
    stepIndicator: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      paddingVertical: 10,
      backgroundColor: colors.card,
    },
    stepWrapper: { alignItems: 'center' },
    stepCircle: {
      width: 24, height: 24, borderRadius: 12,
      backgroundColor: colors.inputBorder, justifyContent: 'center', alignItems: 'center',
    },
    stepCircleActive: { backgroundColor: colors.stepActiveBg },
    stepNumber: { color: colors.stepInactiveText, fontSize: 12 },
    stepNumberActive: { color: colors.chipSelectedText, fontWeight: 'bold' },
    stepLabel: { fontSize: 10, color: colors.stepInactiveLabel, marginTop: 2 },
    stepLabelActive: { color: colors.stepActiveLabel, fontWeight: '600' },
    headerRow: {
      flexDirection: 'row', alignItems: 'center',
      paddingHorizontal: 20, paddingBottom: 4,
    },
    headerTitle: {
      fontSize: 24, fontWeight: 'bold', color: colors.text,
      marginLeft: 10,
    },
    container: {
      padding: 20, flexGrow: 1, alignItems: 'center',
    },
    imagePicker: {
      width: 350, // changed from '100%' to 350 for more horizontal length
      height: 200,
      borderRadius: 12, // from first definition
      borderWidth: 1,
      borderColor: '#ccc',
      justifyContent: 'center', // centers vertically
      alignItems: 'center',     // centers horizontally
      backgroundColor: '#f9f9f9', // from second definition
      marginBottom: 20,
      overflow: 'hidden', // from first definition
    },
    image: {
      width: '100%',
      height: '100%',
      borderRadius: 10,
      resizeMode: 'cover',
    },
    imagePlaceholder: {
      color: '#888',
      fontSize: 16,
      textAlign: 'center',
      paddingHorizontal: 10,
    },
    input: {
      width: '100%',
      backgroundColor: colors.card,
      padding: 12,
      borderRadius: 8,
      marginBottom: 15,
      fontSize: 16,
      color: colors.text,
    },
    subheading: {
      alignSelf: 'flex-start',
      marginBottom: 8,
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
    },
    titleInput: {
      width: '100%',
      backgroundColor: colors.card,
      borderRadius: 12,
      paddingVertical: 16,
      paddingHorizontal: 16,
      fontSize: 16,
      fontWeight: '500',
      color: colors.text,
      marginBottom: 24,
      textAlign: 'left',
      shadowColor: colors.inputShadow,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 3,
    },
    locationContainer: {
      width: '100%',
      marginBottom: 20,
      //zIndex: 1000,
    },
    selectedLocationCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.previewBg,
      borderRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: 8,
      marginBottom: 16,
      borderLeftWidth: 3,
      borderLeftColor: colors.primaryPink,
    },
    selectedLocationText: {
      flex: 1,
      fontSize: 14,
      color: colors.text,
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
      backgroundColor: colors.chipUnselectedBg,
      borderRadius: 16,
      alignItems: 'center',
      justifyContent: 'center',
      margin: 8,
      elevation: 3,
      shadowColor: colors.inputShadow,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
    },
    chipSelected: {
      backgroundColor: colors.chipSelectedBg,
    },
    chipText: {
      fontSize: 14,
      color: colors.chipUnselectedText,
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
      color: colors.chipSelectedText,
      fontWeight: '600',
    },
    segmentedContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      backgroundColor: colors.segmentedBg,
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
      backgroundColor: colors.primaryPink,
    },
    segmentedText: {
      fontSize: 13,
      color: colors.chipUnselectedText,
      fontWeight: '500',
      textAlign: 'center',
    },
    segmentedTextSelected: {
      color: colors.chipSelectedText,
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
      backgroundColor: colors.card,
      borderRadius: 12,
      paddingVertical: 14,
      paddingHorizontal: 12,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: colors.inputShadow,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 3,
      elevation: 2,
    },
    timeCardSelected: {
      borderColor: colors.primaryPink,
      borderWidth: 1.5,
    },
    timeLabel: {
      fontSize: 12,
      color: colors.secondary,
      marginTop: 6,
    },
    timeValue: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
      marginTop: 2,
    },
    switchRow: {
      flexDirection: 'row', alignItems: 'center',
      marginBottom: 20,
    },
    label: { marginHorizontal: 8, color: colors.stepInactiveText },
    preview: { alignItems: 'flex-start', width: '100%' },
    previewImage: {
      width: '100%', height: 200, borderRadius: 12, marginBottom: 15,
    },
    previewText: { fontSize: 16, color: colors.previewText, marginBottom: 6 },
    bold: { fontWeight: '600' },
    navRow: {
      flexDirection: 'row', justifyContent: 'space-between',
      paddingHorizontal: 20, paddingVertical: 10, paddingBottom: 80,
    },
    navBtn: {
      paddingVertical: 10, paddingHorizontal: 20,
      borderRadius: 8, backgroundColor: colors.navBtnBg,
    },
    navText: { fontSize: 16, color: colors.navText },
    nextBtn: { backgroundColor: colors.nextBtnBg },
    nextText: { color: colors.nextText },
    submitBtn: { backgroundColor: colors.submitBtnBg },
    submitText: { color: colors.submitBtnText, fontWeight: 'bold' },
    bubbleBtn: {
      backgroundColor: colors.primaryPink,
      paddingHorizontal: 28,
      paddingVertical: 12,
      borderRadius: 50,
      alignItems: 'center',
      justifyContent: 'center',
    },
    bubbleText: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.chipSelectedText,
    },
  });

  if (!modeSelected) {
    return (
      <SafeAreaView style={styles.safeContainer}>
        <View style={{ alignItems: 'center', marginTop: 150 }}>
          <Text style={{ fontSize: 35, fontWeight: 'bold', marginBottom: 20, color: colors.text }}>
            Create a Motive
          </Text>

          <Text style={{ fontSize: 16, color: colors.secondary, marginBottom: 40, textAlign: 'center' }}>
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
      <View style={{ flex: 1 }}>
        <Text style={styles.headerTitle}>{steps[step]}</Text>
      </View>


      {/* Content */}
      <KeyboardAwareScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        extraScrollHeight={100}
      >
       {/* Step 1: Photo */}
{step === 0 && (
  <View>
    <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
      {image ? (
        <Image source={{ uri: image }} style={styles.image} />
      ) : (
        <Text style={styles.imagePlaceholder}>Tap to select photo</Text>
      )}
    </TouchableOpacity>

    <TouchableOpacity
      onPress={() => {
        setModeSelected(null);
        setStep(0);
        setImage(null);
      }}
      style={{ marginBottom: 20 }}
    >
      <Text style={{ color: colors.primaryPink, textAlign: 'center' }}>
        ← Change mode (Friends/Public)
      </Text>
    </TouchableOpacity>
  </View>
)}



        {/* Step 2: Details */}
        {step === 1 && (
          <>
            <TextInput
              placeholder="Give your motive a title"
              style={styles.titleInput}
              value={title}
              onChangeText={setTitle}
              placeholderTextColor={colors.inputPlaceholder}
              textAlign="left"
            />

<Text style={styles.subheading}>Where's it happening?</Text>
          <View style={[styles.locationContainer, { pointerEvents: 'auto'}]}>
          <GooglePlacesAutocomplete
                ref={placesRef}
                placeholder="Location"
                fetchDetails
                listViewDisplayed='auto'  // Add this line
                keyboardShouldPersistTaps='handled'  // Add this line
                query={{
                  key: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY,
                  language: 'en',
                }}
                onPress={(data, details = null) => {
                  console.log('Address selected:', data.description);
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
                onFail={(error) => console.log('Error:', error)}  // Add this line
                onTimeout={() => console.log('Timeout')}  // Add this line
                enablePoweredByContainer={false}
                styles={{
                  textInput: styles.titleInput,
                  listView: {
                    position: 'absolute',
                    top: 60, // adjust depending on your input height
                    left: 0,
                    right: 0,
                    backgroundColor: colors.card,
                    zIndex: 999,
                    elevation: 10,
                    borderRadius: 8,
                    shadowColor: '#000',
                    shadowOpacity: 0.1,
                    shadowOffset: { width: 0, height: 2 },
                    shadowRadius: 4,
                  },
                  container: { flex: 0, zIndex: 999, elevation: 999 },
                }} 
                predefinedPlaces={[]}
                textInputProps={{
                  placeholderTextColor: colors.inputPlaceholder,
                }}
                minLength={2}
              />
          </View>


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
                <Ionicons name="time-outline" size={20} color={startTime ? colors.primaryPink : colors.inputPlaceholder} />
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
                <Ionicons name="time-outline" size={20} color={endTime ? colors.primaryPink : colors.inputPlaceholder} />
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
              placeholderTextColor={colors.inputPlaceholder}
              textAlign="left"
            />


            <TextInput
              placeholder="Description"
              style={[styles.titleInput, { height: 80 }]}
              multiline
              value={description}
              onChangeText={setDescription}
              placeholderTextColor={colors.inputPlaceholder}
              textAlign="left"
            />

            <TextInput
              placeholder="Additional Notes"
              style={[styles.titleInput, { height: 60 }]}
              multiline
              value={notes}
              onChangeText={setNotes}
              placeholderTextColor={colors.inputPlaceholder}
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
                    color={selectedCategory === category.name ? colors.chipSelectedText : colors.chipUnselectedText}
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
                    color={!requiresApproval ? colors.chipSelectedText : colors.chipUnselectedText}
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
                    color={requiresApproval ? colors.chipSelectedText : colors.chipUnselectedText}
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
      </KeyboardAwareScrollView>

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