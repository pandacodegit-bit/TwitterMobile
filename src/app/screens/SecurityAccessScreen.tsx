import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ArrowLeftIcon from '../components/icons/ArrowLeftIcon';
import ChevronRightIcon from '../components/icons/ChevronRightIcon';

const SecurityAccessScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [showAppSessions, setShowAppSessions] = useState(false);
  const [rotateAnim] = useState(new Animated.Value(0));

  const appSessions = [
    {
      id: '1',
      device: 'iPhone 15 Pro',
      location: 'San Francisco, CA',
      lastActive: '2 minutes ago',
      isCurrent: true,
    },
    {
      id: '2',
      device: 'MacBook Pro',
      location: 'San Francisco, CA',
      lastActive: '1 hour ago',
      isCurrent: false,
    },
    {
      id: '3',
      device: 'iPad Air',
      location: 'Los Angeles, CA',
      lastActive: '2 days ago',
      isCurrent: false,
    },
  ];

  const toggleAppSessions = () => {
    const toValue = !showAppSessions ? 1 : 0;
    
    Animated.timing(rotateAnim, {
      toValue,
      duration: 300,
      useNativeDriver: true,
    }).start();
    
    setShowAppSessions(!showAppSessions);
  };

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '90deg'],
  });

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ArrowLeftIcon color="#0F1419" size={20} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Security and account access</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}>
        <Text style={styles.sectionDescription}>
          Manage your account's security and keep track of your account's usage, including apps that you have connected to your account.
        </Text>

        {/* Two-factor authentication */}
        <View style={styles.optionItem}>
          <View style={styles.optionContent}>
            <Text style={styles.optionLabel}>Two-factor authentication</Text>
            <Text style={styles.optionDescription}>Add an extra layer of security to your account</Text>
          </View>
          <Switch
            value={twoFactorEnabled}
            onValueChange={setTwoFactorEnabled}
            trackColor={{ false: '#D1D5DB', true: '#1D9BF0' }}
            thumbColor="#fff"
            ios_backgroundColor="#D1D5DB"
          />
        </View>

        {/* App sessions */}
        <TouchableOpacity
          style={styles.optionItem}
          onPress={toggleAppSessions}
          activeOpacity={0.7}
        >
          <View style={styles.optionContent}>
            <Text style={styles.optionLabel}>App sessions</Text>
            <Text style={styles.optionDescription}>See apps connected to your account</Text>
          </View>
          <Animated.View style={{ transform: [{ rotate }] }}>
            <ChevronRightIcon 
              color="#536471" 
              size={20}
            />
          </Animated.View>
        </TouchableOpacity>

        {/* App sessions list */}
        {showAppSessions && (
          <View style={styles.sessionsContainer}>
            <Text style={styles.sessionsTitle}>Active Sessions</Text>
            {appSessions.map((session) => (
              <View key={session.id} style={styles.sessionItem}>
                <View style={styles.sessionInfo}>
                  <View style={styles.sessionHeader}>
                    <Text style={styles.sessionDevice}>{session.device}</Text>
                    {session.isCurrent && (
                      <View style={styles.currentBadge}>
                        <Text style={styles.currentBadgeText}>Current</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.sessionLocation}>{session.location}</Text>
                  <Text style={styles.sessionTime}>Last active: {session.lastActive}</Text>
                </View>
              </View>
            ))}
          </View>
        )}
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
  sessionsContainer: {
    backgroundColor: '#F7F9F9',
    paddingVertical: 12,
  },
  sessionsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F1419',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  sessionItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EFF3F4',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 12,
  },
  sessionInfo: {
    flex: 1,
  },
  sessionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  sessionDevice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F1419',
    flex: 1,
  },
  currentBadge: {
    backgroundColor: '#1D9BF0',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  currentBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  sessionLocation: {
    fontSize: 14,
    color: '#536471',
    marginBottom: 2,
  },
  sessionTime: {
    fontSize: 13,
    color: '#536471',
  },
});

export default SecurityAccessScreen;
