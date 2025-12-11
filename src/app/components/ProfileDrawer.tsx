import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { DrawerContentComponentProps } from '@react-navigation/drawer';
import GearIcon from './icons/GearIcon';

const ProfileDrawer = ({ navigation }: DrawerContentComponentProps) => {
  const insets = useSafeAreaInsets();

  const handleProfilePress = () => {
    navigation.closeDrawer();
    navigation.navigate('Profile' as never);
  };

  const handleSettingsPress = () => {
    navigation.closeDrawer();
    navigation.navigate('SettingsPage' as never);
  };

  return (
    <View style={[styles.drawer, { paddingTop: insets.top + 16 }]}>
      {/* Profile Option */}
      <TouchableOpacity
        style={styles.drawerItem}
        onPress={handleProfilePress}
        activeOpacity={0.7}
      >
        <Image
          source={{ uri: 'https://i.pravatar.cc/150?img=1' }}
          style={styles.profileImage}
        />
        <Text style={styles.drawerItemText}>Profile</Text>
      </TouchableOpacity>

      {/* Settings Option */}
      <TouchableOpacity
        style={styles.drawerItem}
        onPress={handleSettingsPress}
        activeOpacity={0.7}
      >
        <View style={styles.iconContainer}>
          <GearIcon color="#0F1419" size={32} />
        </View>
        <Text style={styles.drawerItemText}>Settings</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  drawer: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EFF3F4',
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 16,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  drawerItemText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0F1419',
  },
});

export default ProfileDrawer;
