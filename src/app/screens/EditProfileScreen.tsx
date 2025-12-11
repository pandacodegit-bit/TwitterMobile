import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput, Alert, ActionSheetIOS, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ArrowLeftIcon from '../components/icons/ArrowLeftIcon';
import CameraIcon from '../components/icons/CameraIcon';

const COVER_HEIGHT = 190;
const PROFILE_IMAGE_SIZE = 100;

const EditProfileScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [name, setName] = useState('John Doe');
  const [description, setDescription] = useState('Software engineer passionate about mobile development and design.');
  const [location, setLocation] = useState('San Francisco, CA');
  const [website, setWebsite] = useState('https://johndoe.com');
  const [dateOfBirth, setDateOfBirth] = useState('January 1, 1990');

  const handleImagePicker = (type: 'cover' | 'profile') => {
    const options = ['Take Photo', 'Choose from Library', 'Cancel'];
    const cancelButtonIndex = 2;

    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options,
          cancelButtonIndex,
        },
        (buttonIndex) => {
          if (buttonIndex === 0) {
            // Take Photo
            console.log(`Take photo for ${type}`);
          } else if (buttonIndex === 1) {
            // Choose from Library
            console.log(`Choose from library for ${type}`);
          }
        }
      );
    } else {
      Alert.alert(
        `Update ${type === 'cover' ? 'Cover' : 'Profile'} Photo`,
        'Choose an option',
        [
          { text: 'Take Photo', onPress: () => console.log(`Take photo for ${type}`) },
          { text: 'Choose from Library', onPress: () => console.log(`Choose from library for ${type}`) },
          { text: 'Cancel', style: 'cancel' },
        ]
      );
    }
  };

  const handleSave = () => {
    // Save logic here
    Alert.alert('Success', 'Profile updated successfully');
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity 
          style={styles.headerButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <ArrowLeftIcon color="#0F1419" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <TouchableOpacity 
          style={styles.saveButton}
          onPress={handleSave}
          activeOpacity={0.7}
        >
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
      >
        {/* Cover Photo */}
        <View style={styles.coverPhotoContainer}>
          <Image
            source={{ uri: 'https://picsum.photos/800/400?random=cover' }}
            style={styles.coverPhoto}
            resizeMode="cover"
          />
          <View style={styles.imageOverlay} />
          <TouchableOpacity 
            style={styles.editIconButton}
            onPress={() => handleImagePicker('cover')}
            activeOpacity={0.7}
          >
            <CameraIcon color="#fff" size={24} />
          </TouchableOpacity>
        </View>

        {/* Profile Photo */}
        <View style={styles.profileImageContainer}>
          <Image
            source={{ uri: 'https://i.pravatar.cc/150?img=1' }}
            style={styles.profileImage}
          />
          <View style={styles.profileImageOverlay} />
          <TouchableOpacity 
            style={styles.profileEditIconButton}
            onPress={() => handleImagePicker('profile')}
            activeOpacity={0.7}
          >
            <CameraIcon color="#fff" size={20} />
          </TouchableOpacity>
        </View>

        {/* Editable Profile Info */}
        <View style={styles.editSection}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Name</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Your name"
              placeholderTextColor="#536471"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Bio</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={description}
              onChangeText={setDescription}
              placeholder="Tell us about yourself"
              placeholderTextColor="#536471"
              multiline
              numberOfLines={4}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Location</Text>
            <TextInput
              style={styles.input}
              value={location}
              onChangeText={setLocation}
              placeholder="Where are you from?"
              placeholderTextColor="#536471"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Website</Text>
            <TextInput
              style={styles.input}
              value={website}
              onChangeText={setWebsite}
              placeholder="https://yourwebsite.com"
              placeholderTextColor="#536471"
              keyboardType="url"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Date of Birth</Text>
            <TouchableOpacity 
              style={styles.dateInput}
              onPress={() => Alert.alert('Date Picker', 'Date picker would open here')}
              activeOpacity={0.7}
            >
              <Text style={styles.dateInputText}>{dateOfBirth}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EFF3F4',
    backgroundColor: '#fff',
  },
  headerButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0F1419',
  },
  saveButton: {
    paddingHorizontal: 4,
    paddingVertical: 6,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  coverPhotoContainer: {
    width: '100%',
    height: COVER_HEIGHT,
    backgroundColor: '#E1E8ED',
    position: 'relative',
  },
  coverPhoto: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  editIconButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -20 }, { translateY: -20 }],
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImageContainer: {
    marginTop: -PROFILE_IMAGE_SIZE / 2,
    marginLeft: 16,
    width: PROFILE_IMAGE_SIZE,
    height: PROFILE_IMAGE_SIZE,
    position: 'relative',
  },
  profileImage: {
    width: PROFILE_IMAGE_SIZE,
    height: PROFILE_IMAGE_SIZE,
    borderRadius: PROFILE_IMAGE_SIZE / 2,
    backgroundColor: '#E1E8ED',
    borderWidth: 4,
    borderColor: '#fff',
  },
  profileImageOverlay: {
    position: 'absolute',
    top: 4,
    left: 4,
    right: 4,
    bottom: 4,
    borderRadius: (PROFILE_IMAGE_SIZE - 8) / 2,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  profileEditIconButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -16 }, { translateY: -16 }],
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editSection: {
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  inputGroup: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#536471',
    marginBottom: 8,
  },
  input: {
    fontSize: 16,
    color: '#0F1419',
    borderWidth: 1,
    borderColor: '#EFF3F4',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#fff',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  dateInput: {
    fontSize: 16,
    color: '#0F1419',
    borderWidth: 1,
    borderColor: '#EFF3F4',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  dateInputText: {
    fontSize: 16,
    color: '#0F1419',
  },
});

export default EditProfileScreen;
