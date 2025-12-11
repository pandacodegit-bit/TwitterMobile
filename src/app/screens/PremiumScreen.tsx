import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ArrowLeftIcon from '../components/icons/ArrowLeftIcon';

const PremiumScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const plans = [
    {
      name: 'Basic',
      price: 'Free',
      features: [
        { name: 'No ads', included: false },
        { name: 'Long posts', included: false },
        { name: 'Add articles', included: false },
        { name: 'Basic features', included: true },
      ],
      buttonText: 'Current Plan',
      buttonColor: '#536471',
      isCurrentPlan: true,
    },
    {
      name: 'Premium',
      price: '$8/month',
      features: [
        { name: 'No ads', included: true },
        { name: 'Long posts', included: true },
        { name: 'Add articles', included: true },
        { name: 'All features enabled', included: true },
      ],
      buttonText: 'Subscribe to Premium',
      buttonColor: '#1D9BF0',
      isCurrentPlan: false,
    },
  ];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ArrowLeftIcon color="#0F1419" size={20} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Premium</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}>
        <Text style={styles.sectionDescription}>
          See what's included in Premium and manage your settings
        </Text>

        <View style={styles.plansContainer}>
          {plans.map((plan, index) => (
            <View key={index} style={styles.planCard}>
              <View style={styles.planHeader}>
                <Text style={styles.planName}>{plan.name}</Text>
                <Text style={styles.planPrice}>{plan.price}</Text>
              </View>

              <View style={styles.featuresContainer}>
                {plan.features.map((feature, featureIndex) => (
                  <View key={featureIndex} style={styles.featureItem}>
                    <Text style={styles.featureIcon}>
                      {feature.included ? '✓' : '✕'}
                    </Text>
                    <Text style={[
                      styles.featureText,
                      !feature.included && styles.featureTextDisabled
                    ]}>
                      {feature.name}
                    </Text>
                  </View>
                ))}
              </View>

              <TouchableOpacity
                style={[
                  styles.planButton,
                  plan.isCurrentPlan ? styles.planButtonDisabled : { backgroundColor: plan.buttonColor }
                ]}
                activeOpacity={0.7}
                disabled={plan.isCurrentPlan}
              >
                <Text style={[
                  styles.planButtonText,
                  plan.isCurrentPlan && styles.planButtonTextDisabled
                ]}>
                  {plan.buttonText}
                </Text>
              </TouchableOpacity>
            </View>
          ))}
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
  plansContainer: {
    paddingHorizontal: 16,
    gap: 16,
  },
  planCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#EFF3F4',
    padding: 20,
    marginBottom: 16,
  },
  planHeader: {
    marginBottom: 20,
  },
  planName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0F1419',
    marginBottom: 4,
  },
  planPrice: {
    fontSize: 18,
    fontWeight: '600',
    color: '#536471',
  },
  featuresContainer: {
    marginBottom: 20,
    gap: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  featureIcon: {
    fontSize: 18,
    fontWeight: '700',
    width: 24,
  },
  featureText: {
    fontSize: 15,
    color: '#0F1419',
  },
  featureTextDisabled: {
    color: '#536471',
    textDecorationLine: 'line-through',
  },
  planButton: {
    paddingVertical: 14,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  planButtonDisabled: {
    backgroundColor: '#EFF3F4',
  },
  planButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  planButtonTextDisabled: {
    color: '#536471',
  },
});

export default PremiumScreen;
