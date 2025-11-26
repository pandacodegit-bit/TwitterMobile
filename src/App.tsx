/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BottomTabNavigator from './app/navigation/BottomTabNavigator';
import VideoPage from './app/screens/VideoPage';
import SettingsScreen from './app/screens/SettingsScreen';
import { VideoProvider } from './app/context/VideoContext';
import { SettingsProvider } from './app/context/SettingsContext';

const Stack = createNativeStackNavigator();

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <SettingsProvider>
        <VideoProvider>
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
                component={SettingsScreen}
                options={{
                  presentation: 'modal',
                  animation: 'slide_from_right',
                }}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </VideoProvider>
      </SettingsProvider>
    </SafeAreaProvider>
  );
}

export default App;
