/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { StatusBar, useColorScheme, Text, TextInput } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BottomTabNavigator from './app/navigation/BottomTabNavigator';
import VideoPage from './app/screens/VideoPage';
import ConfigureScreen from './app/screens/ConfigureScreen';
import SettingsScreen from './app/screens/SettingsScreen';
import ProfileScreen from './app/screens/ProfileScreen';
import ChatScreen from './app/screens/ChatScreen';
import SectionVideosScreen from './app/screens/SectionVideosScreen';
import PlaylistsScreen from './app/screens/PlaylistsScreen';
import EditProfileScreen from './app/screens/EditProfileScreen';
import NewsArticleScreen from './app/screens/NewsArticleScreen';
import PostCommentsScreen from './app/screens/PostCommentsScreen';
import YourAccountScreen from './app/screens/YourAccountScreen';
import SecurityAccessScreen from './app/screens/SecurityAccessScreen';
import PremiumScreen from './app/screens/PremiumScreen';
import MonetisationScreen from './app/screens/MonetisationScreen';
import PrivacySafetyScreen from './app/screens/PrivacySafetyScreen';
import BlockedAccountsScreen from './app/screens/BlockedAccountsScreen';
import NotificationsSettingsScreen from './app/screens/NotificationsSettingsScreen';
import AccessibilityScreen from './app/screens/AccessibilityScreen';
import { VideoProvider } from './app/context/VideoContext';
import { SettingsProvider } from './app/context/SettingsContext';
import { MinimizedPlayerProvider } from './app/context/MinimizedPlayerContext';
import MinimizedPlayerBar from './app/components/MinimizedPlayerBar';

const Stack = createNativeStackNavigator();

// Force Roboto font for all Text components
const defaultFontFamily = { fontFamily: 'Roboto-Regular' };

// @ts-ignore - defaultProps works at runtime
if (Text.defaultProps == null) {
  // @ts-ignore
  Text.defaultProps = {};
}
// @ts-ignore
Text.defaultProps.style = defaultFontFamily;
// @ts-ignore
Text.defaultProps.allowFontScaling = false;

// Force Roboto font for all TextInput components
// @ts-ignore - defaultProps works at runtime
if (TextInput.defaultProps == null) {
  // @ts-ignore
  TextInput.defaultProps = {};
}
// @ts-ignore
TextInput.defaultProps.style = defaultFontFamily;
// @ts-ignore
TextInput.defaultProps.allowFontScaling = false;

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <SettingsProvider>
        <VideoProvider>
          <MinimizedPlayerProvider>
            <NavigationContainer>
              <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
              <Stack.Navigator
                screenOptions={{
                  headerShown: false,
                }}
              >
              <Stack.Screen 
                name="Main" 
                component={BottomTabNavigator} 
              />
              <Stack.Screen 
                name="VideoPage" 
                component={VideoPage}
                options={{
                  presentation: 'fullScreenModal',
                  animation: 'slide_from_bottom',
                }}
              />
              <Stack.Screen 
                name="Settings" 
                component={ConfigureScreen}
                options={{
                  presentation: 'card',
                  animation: 'slide_from_right',
                }}
              />
              <Stack.Screen 
                name="SettingsPage" 
                component={SettingsScreen}
                options={{
                  presentation: 'card',
                  animation: 'slide_from_right',
                  headerShown: false,
                }}
              />
              <Stack.Screen 
                name="Profile" 
                component={ProfileScreen}
                options={{
                  presentation: 'card',
                  animation: 'slide_from_right',
                }}
              />
              <Stack.Screen 
                name="ChatScreen" 
                component={ChatScreen}
                options={{
                  presentation: 'card',
                  animation: 'slide_from_right',
                }}
              />
              <Stack.Screen 
                name="SectionVideos" 
                component={SectionVideosScreen}
                options={{
                  presentation: 'card',
                  animation: 'slide_from_right',
                }}
              />
              <Stack.Screen 
                name="Playlists" 
                component={PlaylistsScreen}
                options={{
                  presentation: 'card',
                  animation: 'slide_from_right',
                }}
              />
              <Stack.Screen 
                name="EditProfile" 
                component={EditProfileScreen}
                options={{
                  presentation: 'card',
                  animation: 'slide_from_right',
                }}
              />
              <Stack.Screen 
                name="NewsArticle" 
                component={NewsArticleScreen}
                options={{
                  presentation: 'card',
                  animation: 'slide_from_right',
                }}
              />
              <Stack.Screen 
                name="PostComments" 
                component={PostCommentsScreen}
                options={{
                  presentation: 'card',
                  animation: 'slide_from_right',
                }}
              />
              <Stack.Screen 
                name="YourAccount" 
                component={YourAccountScreen}
                options={{
                  presentation: 'card',
                  animation: 'slide_from_right',
                }}
              />
              <Stack.Screen 
                name="SecurityAccess" 
                component={SecurityAccessScreen}
                options={{
                  presentation: 'card',
                  animation: 'slide_from_right',
                }}
              />
              <Stack.Screen 
                name="Premium" 
                component={PremiumScreen}
                options={{
                  presentation: 'card',
                  animation: 'slide_from_right',
                }}
              />
              <Stack.Screen 
                name="Monetisation" 
                component={MonetisationScreen}
                options={{
                  presentation: 'card',
                  animation: 'slide_from_right',
                }}
              />
              <Stack.Screen 
                name="PrivacySafety" 
                component={PrivacySafetyScreen}
                options={{
                  presentation: 'card',
                  animation: 'slide_from_right',
                }}
              />
              <Stack.Screen 
                name="BlockedAccounts" 
                component={BlockedAccountsScreen}
                options={{
                  presentation: 'card',
                  animation: 'slide_from_right',
                }}
              />
              <Stack.Screen 
                name="NotificationsSettings" 
                component={NotificationsSettingsScreen}
                options={{
                  presentation: 'card',
                  animation: 'slide_from_right',
                }}
              />
              <Stack.Screen 
                name="Accessibility" 
                component={AccessibilityScreen}
                options={{
                  presentation: 'card',
                  animation: 'slide_from_right',
                }}
              />
            </Stack.Navigator>
            <MinimizedPlayerBar />
          </NavigationContainer>
          </MinimizedPlayerProvider>
        </VideoProvider>
      </SettingsProvider>
    </SafeAreaProvider>
  );
}

export default App;
