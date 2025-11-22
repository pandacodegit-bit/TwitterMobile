import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Import screens
import HomeScreen from '../screens/HomeScreen';
import DiscoverScreen from '../screens/DiscoverScreen';
import WatchScreen from '../screens/WatchScreen';
import ProfileScreen from '../screens/ProfileScreen';
import CreateScreen from '../screens/CreateScreen';
import { Colors } from '../style/colors';

// Import icon components
import HomeIcon from '../components/icons/HomeIcon';
import SearchIcon from '../components/icons/SearchIcon';
import PlayIcon from '../components/icons/PlayIcon';
import PlusIcon from '../components/icons/PlusIcon';
import ProfileIcon from '../components/icons/ProfileIcon';
import MessageIcon from '../components/icons/MessageIcon';

const Tab = createBottomTabNavigator();

// Custom Header Component
const CustomHeader = ({ title }: { title: string }) => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  
  return (
    <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
      <Text style={styles.headerTitle}>{title}</Text>
      <TouchableOpacity
        onPress={() => navigation.navigate('Messages' as never)}
        style={styles.messageButton}
      >
        <MessageIcon color="#000" size={24} />
      </TouchableOpacity>
    </View>
  );
};

const getTabBarIcon = ({ color, size, routeName }: {
  color: string;
  size: number;
  routeName: string;
}) => {
  switch (routeName) {
    case 'Home':
      return <HomeIcon color={color} size={size} />;
    case 'Discover':
      return <SearchIcon color={color} size={size} />;
    case 'Create':
      return <PlusIcon color={color} size={size} />;
    case 'Watch':
      return <PlayIcon color={color} size={size} />;
    case 'Profile':
      return <ProfileIcon color={color} size={size} />;
    default:
      return <HomeIcon color={color} size={size} />;
  }
};

const BottomTabNavigator = () => {
  const renderHeader = ({ route }: any) => <CustomHeader title={route.name} />;
  
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => 
          getTabBarIcon({ color, size, routeName: route.name }),
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.tabInactive,
        headerShown: true,
        tabBarShowLabel: false,
        header: renderHeader,
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: '#e1e8ed',
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
      />
      <Tab.Screen 
        name="Discover" 
        component={DiscoverScreen}
      />
      <Tab.Screen 
        name="Create" 
        component={CreateScreen}
      />
      <Tab.Screen 
        name="Watch" 
        component={WatchScreen}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 0,
    elevation: 0,
    shadowOpacity: 0,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
  },
  messageButton: {
    padding: 8,
  },
});

export default BottomTabNavigator;
