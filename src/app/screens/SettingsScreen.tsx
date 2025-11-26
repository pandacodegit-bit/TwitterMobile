import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSettings } from '../context/SettingsContext';

const SettingsScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { defaultTab, setDefaultTab, selectedInterests, setSelectedInterests } = useSettings();
  
  const [localDefaultTab, setLocalDefaultTab] = useState(defaultTab);
  const [localSelectedChips, setLocalSelectedChips] = useState<string[]>(selectedInterests);

  const chipOptions = [
    'Technology',
    'Sports',
    'Entertainment',
    'News',
    'Gaming',
    'Music',
    'Art',
    'Science',
    'Travel',
    'Food',
    'Fashion',
    'Health',
    'Business',
    'Finance',
    'Politics',
    'Education',
    'Fitness',
    'Movies',
    'TV Shows',
    'Books',
    'Photography',
    'Design',
    'Programming',
    'Startups',
    'Crypto',
    'AI & ML',
    'Space',
    'Nature',
    'Animals',
    'Cars',
    'Beauty',
    'Comedy',
    'History',
    'Philosophy',
    'Psychology',
    'Meditation',
  ];

  useEffect(() => {
    setLocalDefaultTab(defaultTab);
    setLocalSelectedChips(selectedInterests);
  }, [defaultTab, selectedInterests]);

  const handleDefaultTabChange = async (tab: 'forYou' | 'following') => {
    setLocalDefaultTab(tab);
    await setDefaultTab(tab);
  };

  const toggleChip = async (chip: string) => {
    const newChips = localSelectedChips.includes(chip)
      ? localSelectedChips.filter(c => c !== chip)
      : [...localSelectedChips, chip];
    
    setLocalSelectedChips(newChips);
    await setSelectedInterests(newChips);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
        <TouchableOpacity 
          style={styles.closeButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Text style={styles.closeIcon}>✕</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Default Tab Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Default Tab</Text>
          <Text style={styles.sectionDescription}>
            Choose which tab to show when you open the app
          </Text>
          
          <View style={styles.tabOptions}>
            <TouchableOpacity
              style={[
                styles.tabOption,
                localDefaultTab === 'forYou' && styles.tabOptionSelected
              ]}
              onPress={() => handleDefaultTabChange('forYou')}
              activeOpacity={0.7}
            >
              <View style={styles.radioOuter}>
                {localDefaultTab === 'forYou' && <View style={styles.radioInner} />}
              </View>
              <Text style={[
                styles.tabOptionText,
                localDefaultTab === 'forYou' && styles.tabOptionTextSelected
              ]}>
                For You
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.tabOption,
                localDefaultTab === 'following' && styles.tabOptionSelected
              ]}
              onPress={() => handleDefaultTabChange('following')}
              activeOpacity={0.7}
            >
              <View style={styles.radioOuter}>
                {localDefaultTab === 'following' && <View style={styles.radioInner} />}
              </View>
              <Text style={[
                styles.tabOptionText,
                localDefaultTab === 'following' && styles.tabOptionTextSelected
              ]}>
                Following
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Interests Chips */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Interests</Text>
          <Text style={styles.sectionDescription}>
            Select topics you're interested in
          </Text>
          
          <View style={styles.chipsContainer}>
            {chipOptions.map((chip) => (
              <TouchableOpacity
                key={chip}
                style={[
                  styles.chip,
                  localSelectedChips.includes(chip) && styles.chipSelected
                ]}
                onPress={() => toggleChip(chip)}
                activeOpacity={0.7}
              >
                <Text style={[
                  styles.chipText,
                  localSelectedChips.includes(chip) && styles.chipTextSelected
                ]}>
                  {chip}
                </Text>
              </TouchableOpacity>
            ))}
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
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EFF3F4',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0F1419',
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F7F9F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeIcon: {
    fontSize: 20,
    color: '#0F1419',
    fontWeight: '400',
  },
  content: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 16,
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#EFF3F4',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F1419',
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#536471',
    marginBottom: 16,
    lineHeight: 20,
  },
  tabOptions: {
    gap: 12,
  },
  tabOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CFD9DE',
    backgroundColor: '#fff',
  },
  tabOptionSelected: {
    borderColor: '#1D9BF0',
    backgroundColor: '#F0F8FF',
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#536471',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#1D9BF0',
  },
  tabOptionText: {
    fontSize: 16,
    color: '#0F1419',
    fontWeight: '500',
  },
  tabOptionTextSelected: {
    color: '#1D9BF0',
    fontWeight: '600',
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#CFD9DE',
    backgroundColor: '#fff',
  },
  chipSelected: {
    backgroundColor: '#1D9BF0',
    borderColor: '#1D9BF0',
  },
  chipText: {
    fontSize: 14,
    color: '#0F1419',
    fontWeight: '500',
  },
  chipTextSelected: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default SettingsScreen;
