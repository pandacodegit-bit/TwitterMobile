import React, { createContext, useContext, useState } from 'react';
import { Animated } from 'react-native';

interface HeaderContextType {
  headerTranslateY: Animated.Value;
  handleScroll: (event: any) => void;
  scrollY: Animated.Value;
}

const HeaderContext = createContext<HeaderContextType | undefined>(undefined);

export const HeaderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const scrollY = new Animated.Value(0);
  const headerTranslateY = new Animated.Value(0);
  let lastScrollY = 0;

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    {
      useNativeDriver: true,
      listener: (event: any) => {
        const currentScrollY = event.nativeEvent.contentOffset.y;
        const diff = currentScrollY - lastScrollY;

        if (diff > 0 && currentScrollY > 50) {
          // Scrolling down - hide header
          Animated.timing(headerTranslateY, {
            toValue: -100,
            duration: 200,
            useNativeDriver: true,
          }).start();
        } else if (diff < 0) {
          // Scrolling up - show header
          Animated.timing(headerTranslateY, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }).start();
        }

        lastScrollY = currentScrollY;
      },
    }
  );

  return (
    <HeaderContext.Provider value={{ headerTranslateY, handleScroll, scrollY }}>
      {children}
    </HeaderContext.Provider>
  );
};

export const useHeader = () => {
  const context = useContext(HeaderContext);
  if (!context) {
    throw new Error('useHeader must be used within HeaderProvider');
  }
  return context;
};
