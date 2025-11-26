import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Import screens
import HomeScreen from '../screens/HomeScreen';
import DiscoverScreen from '../screens/DiscoverScreen';
import WatchScreen from '../screens/WatchScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import MessagesScreen from '../screens/MessagesScreen';
import { Colors } from '../style/colors';

// Import icon components
import HomeIcon from '../components/icons/HomeIcon';
import SearchIcon from '../components/icons/SearchIcon';
import PlayIcon from '../components/icons/PlayIcon';
import BellIcon from '../components/icons/BellIcon';
import ProfileIcon from '../components/icons/ProfileIcon';
import MessageIcon from '../components/icons/MessageIcon';
import GearIcon from '../components/icons/GearIcon';

const Tab = createBottomTabNavigator();

// Shared animated value for header translation
const headerTranslateY = new Animated.Value(0);

// Custom Header Component
const CustomHeader = ({ title, showGear = false }: { title: string; showGear?: boolean }) => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  
  return (
    <Animated.View 
      style={[
        styles.header, 
        { 
          paddingTop: insets.top + 12,
          transform: [{ translateY: headerTranslateY }],
        }
      ]}
    >
      <TouchableOpacity
        onPress={() => navigation.navigate('Profile' as never)}
        style={styles.headerButton}
      >
        <ProfileIcon color="#000" size={24} />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>{title}</Text>
      {showGear ? (
        <TouchableOpacity
          onPress={() => (navigation as any).navigate('Settings')}
          style={styles.headerButton}
        >
          <GearIcon color="#000" size={24} />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={styles.headerButton}
          disabled
        >
          {/* Empty space to maintain layout balance */}
        </TouchableOpacity>
      )}
    </Animated.View>
  );
};

export { headerTranslateY, CustomHeader };

const getTabBarIcon = ({ color, size, routeName, focused }: {
  color: string;
  size: number;
  routeName: string;
  focused: boolean;
}) => {
  switch (routeName) {
    case 'Home':
      return <HomeIcon color={color} size={size} filled={focused} />;
    case 'Discover':
      return <SearchIcon color={color} size={size} filled={focused} />;
    case 'Watch':
      return <PlayIcon color={color} size={size} filled={focused} />;
    case 'Notifications':
      return <BellIcon color={color} size={size} filled={focused} />;
    case 'Messages':
      return <MessageIcon color={color} size={size} filled={focused} />;
    default:
      return <HomeIcon color={color} size={size} filled={focused} />;
  }
};

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size, focused }) => 
          getTabBarIcon({ color, size, routeName: route.name, focused }),
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.primary,
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 2,
          borderTopColor: '#e1e8ed',
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
          paddingEnd: 4,
          paddingStart: 4
        },
      })}
      screenListeners={{
        state: () => {
          // Reset header position when navigating between tabs
          Animated.timing(headerTranslateY, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }).start();
        },
      }}
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
        name="Watch" 
        component={WatchScreen}
      />
      <Tab.Screen 
        name="Notifications" 
        component={NotificationsScreen}
      />
      <Tab.Screen 
        name="Messages" 
        component={MessagesScreen}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingBottom: 12,
    zIndex: 1000,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
    flex: 1,
    textAlign: 'center',
  },
  headerButton: {
    padding: 8,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default BottomTabNavigator;
