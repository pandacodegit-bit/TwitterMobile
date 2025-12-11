import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const SettingsScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            console.log('User logged out');
          },
        },
      ],
      { cancelable: true }
    );
  };

  const settingsOptions = [
    {
      title: 'Your account',
      description: 'See information about your account, download an archive of your data or learn about your account deactivation options.',
      onPress: () => navigation.navigate('YourAccount' as never),
    },
    {
      title: 'Security and account access',
      description: "Manage your account's security and keep track of your account's usage, including apps that you have connected to your account.",
      onPress: () => navigation.navigate('SecurityAccess' as never),
    },
    {
      title: 'Premium',
      description: "See what's included in Premium and manage your settings",
      onPress: () => navigation.navigate('Premium' as never),
    },
    {
      title: 'Privacy and safety',
      description: 'Manage what information you see and share.',
      onPress: () => navigation.navigate('PrivacySafety' as never),
    },
    {
      title: 'Notifications',
      description: 'Select the kinds of notification you get about your activities, interests and recommendations.',
      onPress: () => navigation.navigate('NotificationsSettings' as never),
    },
    {
      title: 'Accessibility, display and languages',
      description: 'Manage how content is displayed to you.',
      onPress: () => navigation.navigate('Accessibility' as never),
    },
  ];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Settings</Text>
          <Text style={styles.headerSubtitle}>@Panda182505</Text>
        </View>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}>
        {settingsOptions.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={styles.settingItem}
            onPress={option.onPress}
            activeOpacity={0.7}
          >
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>{option.title}</Text>
              <Text style={styles.settingDescription}>{option.description}</Text>
            </View>
          </TouchableOpacity>
        ))}

        {/* Logout */}
        <TouchableOpacity
          style={styles.logoutItem}
          onPress={handleLogout}
          activeOpacity={0.7}
        >
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
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
    paddingVertical: 8,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#EFF3F4',
  },
  backButton: {
    padding: 4,
    width: 40,
  },
  backButtonText: {
    fontSize: 28,
    color: '#0F1419',
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'flex-start',
    marginLeft: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0F1419',
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#536471',
    marginTop: 2,
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  settingItem: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#EFF3F4',
    backgroundColor: '#fff',
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F1419',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: '#536471',
    lineHeight: 20,
  },
  logoutItem: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#EFF3F4',
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#F4212E',
  },
});

export default SettingsScreen;
