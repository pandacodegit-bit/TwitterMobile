import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ArrowLeftIcon from '../components/icons/ArrowLeftIcon';

const NotificationsSettingsScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ArrowLeftIcon color="#0F1419" size={20} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}>
        <Text style={styles.sectionDescription}>
          Select the kinds of notification you get about your activities, interests and recommendations.
        </Text>

        <View style={styles.optionItem}>
          <View style={styles.optionContent}>
            <Text style={styles.optionLabel}>Allow notifications</Text>
            <Text style={styles.optionDescription}>
              Receive push notifications for mentions, likes, and other activities
            </Text>
          </View>
          <Switch
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
            trackColor={{ false: '#D1D5DB', true: '#1D9BF0' }}
            thumbColor="#fff"
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
});

export default NotificationsSettingsScreen;
