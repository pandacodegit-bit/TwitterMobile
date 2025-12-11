import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ArrowLeftIcon from '../components/icons/ArrowLeftIcon';
import ChevronRightIcon from '../components/icons/ChevronRightIcon';

const PrivacySafetyScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const [protectPosts, setProtectPosts] = useState(false);
  const [markMediaNSFW, setMarkMediaNSFW] = useState(false);
  const [locationEnabled, setLocationEnabled] = useState(false);
  const [thirdPartyData, setThirdPartyData] = useState(false);
  const [dmPermission, setDmPermission] = useState('everyone');

  const dmOptions = [
    { value: 'none', label: 'No one' },
    { value: 'followers', label: 'Followers' },
    { value: 'verified', label: 'Verified users' },
    { value: 'everyone', label: 'Everyone' },
  ];

  const handleNavigateToBlockedAccounts = () => {
    navigation.navigate('BlockedAccounts' as never);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ArrowLeftIcon color="#0F1419" size={20} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacy and safety</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}>
        <Text style={styles.sectionDescription}>
          Manage what information you see and share.
        </Text>

        {/* Protect your posts */}
        <View style={styles.optionItem}>
          <View style={styles.optionContent}>
            <Text style={styles.optionLabel}>Protect your posts</Text>
            <Text style={styles.optionDescription}>
              Only current followers can view your posts
            </Text>
          </View>
          <Switch
            value={protectPosts}
            onValueChange={setProtectPosts}
            trackColor={{ false: '#D1D5DB', true: '#1D9BF0' }}
            thumbColor="#fff"
            ios_backgroundColor="#D1D5DB"
          />
        </View>

        {/* Mark media as NSFW */}
        <View style={styles.optionItem}>
          <View style={styles.optionContent}>
            <Text style={styles.optionLabel}>Mark media as NSFW</Text>
            <Text style={styles.optionDescription}>
              Mark your content or media as sensitive
            </Text>
          </View>
          <Switch
            value={markMediaNSFW}
            onValueChange={setMarkMediaNSFW}
            trackColor={{ false: '#D1D5DB', true: '#1D9BF0' }}
            thumbColor="#fff"
            ios_backgroundColor="#D1D5DB"
          />
        </View>

        {/* Blocked accounts */}
        <TouchableOpacity
          style={styles.optionItem}
          onPress={handleNavigateToBlockedAccounts}
          activeOpacity={0.7}
        >
          <View style={styles.optionContent}>
            <Text style={styles.optionLabel}>Blocked accounts</Text>
            <Text style={styles.optionDescription}>
              Manage accounts you've blocked
            </Text>
          </View>
          <ChevronRightIcon color="#536471" size={20} />
        </TouchableOpacity>

        {/* Direct messages section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Direct messages</Text>
          <Text style={styles.sectionSubtitle}>Who can message you</Text>
          {dmOptions.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={styles.radioOption}
              onPress={() => setDmPermission(option.value)}
              activeOpacity={0.7}
            >
              <View style={styles.radioButton}>
                {dmPermission === option.value && <View style={styles.radioButtonInner} />}
              </View>
              <Text style={styles.radioLabel}>{option.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Location information */}
        <View style={styles.optionItem}>
          <View style={styles.optionContent}>
            <Text style={styles.optionLabel}>Location information</Text>
            <Text style={styles.optionDescription}>
              Personalise based on your location
            </Text>
          </View>
          <Switch
            value={locationEnabled}
            onValueChange={setLocationEnabled}
            trackColor={{ false: '#D1D5DB', true: '#1D9BF0' }}
            thumbColor="#fff"
            ios_backgroundColor="#D1D5DB"
          />
        </View>

        {/* Third party data collection */}
        <View style={styles.optionItem}>
          <View style={styles.optionContent}>
            <Text style={styles.optionLabel}>Third-party data sharing</Text>
            <Text style={styles.optionDescription}>
              Allow third party collaborators to collect public data
            </Text>
          </View>
          <Switch
            value={thirdPartyData}
            onValueChange={setThirdPartyData}
            trackColor={{ false: '#D1D5DB', true: '#1D9BF0' }}
            thumbColor="#fff"
            ios_backgroundColor="#D1D5DB"
          />
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
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#EFF3F4',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0F1419',
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
  section: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#EFF3F4',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F1419',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#536471',
    marginBottom: 16,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#1D9BF0',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#1D9BF0',
  },
  radioLabel: {
    fontSize: 15,
    color: '#0F1419',
  },
});

export default PrivacySafetyScreen;
