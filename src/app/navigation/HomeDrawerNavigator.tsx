import React, { useEffect } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ConfigureScreen from '../screens/ConfigureScreen';
import ProfileDrawer from '../components/ProfileDrawer';

const Drawer = createDrawerNavigator();

const renderDrawerContent = (props: any) => <ProfileDrawer {...props} />;

const HomeDrawerNavigator = () => {
  const navigation = useNavigation();

  useEffect(() => {
    // Listen for tab navigation changes
    const unsubscribe = navigation.addListener('blur', () => {
      // Close drawer when navigating away from Home tab
      navigation.getParent()?.getState();
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <Drawer.Navigator
      drawerContent={renderDrawerContent}
      screenOptions={{
        headerShown: false,
        drawerPosition: 'left',
        drawerType: 'slide',
        drawerStyle: {
          width: 280,
        },
        swipeEnabled: true,
      }}
    >
      <Drawer.Screen 
        name="HomeFeed" 
        component={HomeScreen}
        listeners={({ navigation: drawerNav }) => ({
          blur: () => {
            // Close drawer when switching tabs
            if (drawerNav.getState().type === 'drawer') {
              drawerNav.closeDrawer();
            }
          },
        })}
      />
      <Drawer.Screen name="Profile" component={ProfileScreen} />
      <Drawer.Screen name="Settings" component={ConfigureScreen} />
    </Drawer.Navigator>
  );
};

export default HomeDrawerNavigator;
