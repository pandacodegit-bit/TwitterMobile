import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ArrowLeftIcon from '../components/icons/ArrowLeftIcon';

const MonetisationScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ArrowLeftIcon color="#0F1419" size={20} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Monetisation</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}>
        <View style={styles.content}>
          <Text style={styles.title}>Make Money</Text>
          <Text style={styles.description}>
            Get paid to write articles and share your expertise with millions of readers. Turn your passion into income and build your audience while earning from your content.
          </Text>

          <TouchableOpacity style={styles.ctaButton} activeOpacity={0.8}>
            <Text style={styles.ctaButtonText}>Become a Premium Creator</Text>
          </TouchableOpacity>

          <View style={styles.infoSection}>
            <Text style={styles.infoTitle}>Benefits of becoming a creator:</Text>
            <View style={styles.benefitsList}>
              <View style={styles.benefitItem}>
                <Text style={styles.bulletPoint}>•</Text>
                <Text style={styles.benefitText}>Earn money from your articles and content</Text>
              </View>
              <View style={styles.benefitItem}>
                <Text style={styles.bulletPoint}>•</Text>
                <Text style={styles.benefitText}>Get priority support and verification</Text>
              </View>
              <View style={styles.benefitItem}>
                <Text style={styles.bulletPoint}>•</Text>
                <Text style={styles.benefitText}>Access to advanced analytics</Text>
              </View>
              <View style={styles.benefitItem}>
                <Text style={styles.bulletPoint}>•</Text>
                <Text style={styles.benefitText}>Exclusive creator resources and tools</Text>
              </View>
            </View>
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
  content: {
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#0F1419',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: '#536471',
    lineHeight: 24,
    marginBottom: 32,
  },
  ctaButton: {
    backgroundColor: '#1D9BF0',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  ctaButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  infoSection: {
    backgroundColor: '#F7F9F9',
    borderRadius: 16,
    padding: 20,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F1419',
    marginBottom: 16,
  },
  benefitsList: {
    gap: 12,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  bulletPoint: {
    fontSize: 18,
    color: '#1D9BF0',
    fontWeight: '700',
  },
  benefitText: {
    flex: 1,
    fontSize: 15,
    color: '#0F1419',
    lineHeight: 22,
  },
});

export default MonetisationScreen;
