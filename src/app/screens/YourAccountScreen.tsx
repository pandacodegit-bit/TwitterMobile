import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Modal, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ArrowLeftIcon from '../components/icons/ArrowLeftIcon';

const YourAccountScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const [accountInfo, setAccountInfo] = useState({
    username: 'Panda182505',
    phone: '+1 (555) 123-4567',
    email: 'panda@example.com',
    country: 'United States',
    password: '••••••••',
  });

  const [hasChanges, setHasChanges] = useState(false);
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);

  const countries = [
    'Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Argentina', 'Armenia', 'Australia',
    'Austria', 'Azerbaijan', 'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium',
    'Belize', 'Benin', 'Bhutan', 'Bolivia', 'Bosnia and Herzegovina', 'Botswana', 'Brazil', 'Brunei',
    'Bulgaria', 'Burkina Faso', 'Burundi', 'Cambodia', 'Cameroon', 'Canada', 'Cape Verde',
    'Central African Republic', 'Chad', 'Chile', 'China', 'Colombia', 'Comoros', 'Congo', 'Costa Rica',
    'Croatia', 'Cuba', 'Cyprus', 'Czech Republic', 'Denmark', 'Djibouti', 'Dominica', 'Dominican Republic',
    'Ecuador', 'Egypt', 'El Salvador', 'Equatorial Guinea', 'Eritrea', 'Estonia', 'Ethiopia', 'Fiji',
    'Finland', 'France', 'Gabon', 'Gambia', 'Georgia', 'Germany', 'Ghana', 'Greece', 'Grenada',
    'Guatemala', 'Guinea', 'Guinea-Bissau', 'Guyana', 'Haiti', 'Honduras', 'Hungary', 'Iceland',
    'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland', 'Israel', 'Italy', 'Jamaica', 'Japan', 'Jordan',
    'Kazakhstan', 'Kenya', 'Kiribati', 'Kuwait', 'Kyrgyzstan', 'Laos', 'Latvia', 'Lebanon', 'Lesotho',
    'Liberia', 'Libya', 'Liechtenstein', 'Lithuania', 'Luxembourg', 'Madagascar', 'Malawi', 'Malaysia',
    'Maldives', 'Mali', 'Malta', 'Marshall Islands', 'Mauritania', 'Mauritius', 'Mexico', 'Micronesia',
    'Moldova', 'Monaco', 'Mongolia', 'Montenegro', 'Morocco', 'Mozambique', 'Myanmar', 'Namibia',
    'Nauru', 'Nepal', 'Netherlands', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'North Korea',
    'North Macedonia', 'Norway', 'Oman', 'Pakistan', 'Palau', 'Palestine', 'Panama', 'Papua New Guinea',
    'Paraguay', 'Peru', 'Philippines', 'Poland', 'Portugal', 'Qatar', 'Romania', 'Russia', 'Rwanda',
    'Saint Kitts and Nevis', 'Saint Lucia', 'Saint Vincent and the Grenadines', 'Samoa', 'San Marino',
    'Sao Tome and Principe', 'Saudi Arabia', 'Senegal', 'Serbia', 'Seychelles', 'Sierra Leone',
    'Singapore', 'Slovakia', 'Slovenia', 'Solomon Islands', 'Somalia', 'South Africa', 'South Korea',
    'South Sudan', 'Spain', 'Sri Lanka', 'Sudan', 'Suriname', 'Sweden', 'Switzerland', 'Syria',
    'Taiwan', 'Tajikistan', 'Tanzania', 'Thailand', 'Timor-Leste', 'Togo', 'Tonga', 'Trinidad and Tobago',
    'Tunisia', 'Turkey', 'Turkmenistan', 'Tuvalu', 'Uganda', 'Ukraine', 'United Arab Emirates',
    'United Kingdom', 'United States', 'Uruguay', 'Uzbekistan', 'Vanuatu', 'Vatican City', 'Venezuela',
    'Vietnam', 'Yemen', 'Zambia', 'Zimbabwe',
  ];

  const handleFieldChange = (field: string, value: string) => {
    setAccountInfo(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleCountrySelect = (country: string) => {
    handleFieldChange('country', country);
    setShowCountryDropdown(false);
  };

  const handleSave = () => {
    Alert.alert(
      'Success',
      'Your account information has been updated.',
      [{ text: 'OK' }]
    );
    setHasChanges(false);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ArrowLeftIcon color="#0F1419" size={20} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Your Account</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}>
        <Text style={styles.sectionDescription}>
          See information about your account, download an archive of your data or learn about your account deactivation options.
        </Text>

        {/* Username */}
        <View style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>Username</Text>
          <TextInput
            style={styles.fieldInput}
            value={accountInfo.username}
            onChangeText={(value) => handleFieldChange('username', value)}
            placeholder="Enter username"
            placeholderTextColor="#536471"
          />
        </View>

        {/* Phone */}
        <View style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>Phone</Text>
          <TextInput
            style={styles.fieldInput}
            value={accountInfo.phone}
            onChangeText={(value) => handleFieldChange('phone', value)}
            placeholder="Enter phone number"
            placeholderTextColor="#536471"
            keyboardType="phone-pad"
          />
        </View>

        {/* Email */}
        <View style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>Email</Text>
          <TextInput
            style={styles.fieldInput}
            value={accountInfo.email}
            onChangeText={(value) => handleFieldChange('email', value)}
            placeholder="Enter email"
            placeholderTextColor="#536471"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        {/* Country */}
        <TouchableOpacity 
          style={styles.fieldContainer}
          onPress={() => setShowCountryDropdown(true)}
          activeOpacity={0.7}
        >
          <Text style={styles.fieldLabel}>Country</Text>
          <View style={styles.selectableField}>
            <Text style={styles.selectableFieldText}>{accountInfo.country}</Text>
            <Text style={styles.dropdownArrow}>▼</Text>
          </View>
        </TouchableOpacity>

        {/* Password */}
        <View style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>Password</Text>
          <TextInput
            style={styles.fieldInput}
            value={accountInfo.password}
            onChangeText={(value) => handleFieldChange('password', value)}
            placeholder="Enter password"
            placeholderTextColor="#536471"
            secureTextEntry
          />
        </View>

        {/* Save Button */}
        {hasChanges && (
          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSave}
            activeOpacity={0.8}
          >
            <Text style={styles.saveButtonText}>Save Changes</Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      {/* Country Selection Modal */}
      <Modal
        visible={showCountryDropdown}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setShowCountryDropdown(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowCountryDropdown(false)}
        >
          <View style={styles.dropdownModal}>
            <View style={styles.dropdownHeader}>
              <Text style={styles.dropdownTitle}>Select Country</Text>
              <TouchableOpacity onPress={() => setShowCountryDropdown(false)}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.dropdownScrollView}>
              {countries.map((country, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.dropdownOption}
                  onPress={() => handleCountrySelect(country)}
                  activeOpacity={0.7}
                >
                  <Text style={[
                    styles.dropdownOptionText,
                    accountInfo.country === country && styles.dropdownOptionSelected
                  ]}>
                    {country}
                  </Text>
                  {accountInfo.country === country && (
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
  fieldContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EFF3F4',
    backgroundColor: '#fff',
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#536471',
    marginBottom: 8,
  },
  fieldInput: {
    fontSize: 16,
    color: '#0F1419',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#F7F9F9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#EFF3F4',
  },
  selectableField: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#F7F9F9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#EFF3F4',
  },
  selectableFieldText: {
    fontSize: 16,
    color: '#0F1419',
    flex: 1,
  },
  dropdownArrow: {
    fontSize: 12,
    color: '#536471',
    marginLeft: 8,
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
  saveButton: {
    marginHorizontal: 16,
    marginTop: 24,
    marginBottom: 16,
    backgroundColor: '#1D9BF0',
    paddingVertical: 14,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
});

export default YourAccountScreen;
