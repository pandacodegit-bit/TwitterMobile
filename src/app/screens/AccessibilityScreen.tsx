import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ArrowLeftIcon from '../components/icons/ArrowLeftIcon';

const AccessibilityScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const [videoAutoplay, setVideoAutoplay] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);

  const languages = [
    'English',
    'Spanish',
    'French',
    'German',
    'Italian',
    'Portuguese',
    'Chinese (Simplified)',
    'Chinese (Traditional)',
    'Japanese',
    'Korean',
    'Arabic',
    'Hindi',
    'Russian',
    'Dutch',
    'Turkish',
    'Swedish',
    'Polish',
    'Indonesian',
    'Thai',
    'Vietnamese',
  ];

  const handleLanguageSelect = (language: string) => {
    setSelectedLanguage(language);
    setShowLanguageDropdown(false);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ArrowLeftIcon color="#0F1419" size={20} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Accessibility, display and languages</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}>
        <Text style={styles.sectionDescription}>
          Manage how content is displayed to you.
        </Text>

        {/* Video autoplay */}
        <View style={styles.optionItem}>
          <View style={styles.optionContent}>
            <Text style={styles.optionLabel}>Video autoplay</Text>
            <Text style={styles.optionDescription}>
              Automatically play videos when scrolling through your feed
            </Text>
          </View>
          <Switch
            value={videoAutoplay}
            onValueChange={setVideoAutoplay}
            trackColor={{ false: '#D1D5DB', true: '#1D9BF0' }}
            thumbColor="#fff"
            ios_backgroundColor="#D1D5DB"
          />
        </View>

        {/* Dark mode */}
        <View style={styles.optionItem}>
          <View style={styles.optionContent}>
            <Text style={styles.optionLabel}>Dark mode</Text>
            <Text style={styles.optionDescription}>
              Adjust the appearance of the app
            </Text>
          </View>
          <Switch
            value={darkMode}
            onValueChange={setDarkMode}
            trackColor={{ false: '#D1D5DB', true: '#1D9BF0' }}
            thumbColor="#fff"
            ios_backgroundColor="#D1D5DB"
          />
        </View>

        {/* Language */}
        <TouchableOpacity 
          style={styles.optionItem}
          onPress={() => setShowLanguageDropdown(true)}
          activeOpacity={0.7}
        >
          <View style={styles.optionContent}>
            <Text style={styles.optionLabel}>Language</Text>
            <View style={styles.languageSelector}>
              <Text style={styles.optionValue}>{selectedLanguage}</Text>
              <Text style={styles.dropdownArrow}>▼</Text>
            </View>
          </View>
        </TouchableOpacity>
      </ScrollView>

      {/* Language Selection Modal */}
      <Modal
        visible={showLanguageDropdown}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setShowLanguageDropdown(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowLanguageDropdown(false)}
        >
          <View style={styles.dropdownModal}>
            <View style={styles.dropdownHeader}>
              <Text style={styles.dropdownTitle}>Select Language</Text>
              <TouchableOpacity onPress={() => setShowLanguageDropdown(false)}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.dropdownScrollView}>
              {languages.map((language, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.dropdownOption}
                  onPress={() => handleLanguageSelect(language)}
                  activeOpacity={0.7}
                >
                  <Text style={[
                    styles.dropdownOptionText,
                    selectedLanguage === language && styles.dropdownOptionSelected
                  ]}>
                    {language}
                  </Text>
                  {selectedLanguage === language && (
                    <Text style={styles.checkmark}>✓</Text>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
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
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#EFF3F4',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F1419',
    flex: 1,
    marginLeft: 12,
  },
  placeholder: {
    width: 28,
  },
  scrollView: {
    flex: 1,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#536471',
    lineHeight: 20,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EFF3F4',
    backgroundColor: '#fff',
  },
  optionContent: {
    flex: 1,
    marginRight: 12,
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F1419',
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 14,
    color: '#536471',
    lineHeight: 18,
  },
  optionValue: {
    fontSize: 14,
    color: '#536471',
    marginTop: 4,
  },
  languageSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dropdownArrow: {
    fontSize: 12,
    color: '#536471',
    marginLeft: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  dropdownModal: {
    backgroundColor: '#fff',
    borderRadius: 12,
    width: '100%',
    maxHeight: '70%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  dropdownHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EFF3F4',
  },
  dropdownTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F1419',
  },
  closeButton: {
    fontSize: 24,
    color: '#536471',
    paddingHorizontal: 8,
  },
  dropdownScrollView: {
    maxHeight: 400,
  },
  dropdownOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#EFF3F4',
  },
  dropdownOptionText: {
    fontSize: 16,
    color: '#0F1419',
  },
  dropdownOptionSelected: {
    fontWeight: '700',
    color: '#1D9BF0',
  },
  checkmark: {
    fontSize: 20,
    color: '#1D9BF0',
    fontWeight: '700',
  },
});

export default AccessibilityScreen;
