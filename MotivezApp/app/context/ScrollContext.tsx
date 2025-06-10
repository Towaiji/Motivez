import React, { createContext, useContext, useRef } from 'react';
import { Animated } from 'react-native';

const ScrollContext = createContext<{
  scrollY: Animated.Value;
}>({
  scrollY: new Animated.Value(0),
});

export const ScrollProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const scrollY = useRef(new Animated.Value(0)).current;

  return (
    <ScrollContext.Provider value={{ scrollY }}>
      {children}
    </ScrollContext.Provider>
  );
};

export const useScroll = () => useContext(ScrollContext);

// Add default export for Expo Router
export default ScrollProvider; 