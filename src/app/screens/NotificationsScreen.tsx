import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CustomHeader } from '../navigation/BottomTabNavigator';

const NotificationsScreen = () => {
  return (
    <View style={styles.container}>
      <CustomHeader title="Notifications" />
      <View style={styles.content}>
        <Text style={styles.text}>Notifications</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default NotificationsScreen;
