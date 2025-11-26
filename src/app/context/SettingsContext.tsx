import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type DefaultTab = 'forYou' | 'following';

interface SettingsContextType {
  defaultTab: DefaultTab;
  setDefaultTab: (tab: DefaultTab) => Promise<void>;
  selectedInterests: string[];
  setSelectedInterests: (interests: string[]) => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

const STORAGE_KEY_DEFAULT_TAB = '@default_tab';
const STORAGE_KEY_INTERESTS = '@selected_interests';

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [defaultTab, setDefaultTabState] = useState<DefaultTab>('forYou');
  const [selectedInterests, setSelectedInterestsState] = useState<string[]>([]);

  // Load settings from storage on mount
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const [storedTab, storedInterests] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEY_DEFAULT_TAB),
        AsyncStorage.getItem(STORAGE_KEY_INTERESTS),
      ]);

      if (storedTab) {
        setDefaultTabState(storedTab as DefaultTab);
      }
      if (storedInterests) {
        setSelectedInterestsState(JSON.parse(storedInterests));
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const setDefaultTab = async (tab: DefaultTab) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY_DEFAULT_TAB, tab);
      setDefaultTabState(tab);
    } catch (error) {
      console.error('Error saving default tab:', error);
    }
  };

  const setSelectedInterests = async (interests: string[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY_INTERESTS, JSON.stringify(interests));
      setSelectedInterestsState(interests);
    } catch (error) {
      console.error('Error saving interests:', error);
    }
  };

  return (
    <SettingsContext.Provider
      value={{
        defaultTab,
        setDefaultTab,
        selectedInterests,
        setSelectedInterests,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
