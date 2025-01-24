import React, { createContext, useContext, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

const LoaderContext = createContext();

export function useLoader() {
  const context = useContext(LoaderContext);
  if (context === undefined) {
    throw new Error('useLoader must be used within a LoaderProvider');
  }
  return context;
}

export function LoaderProvider({ children }) {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <LoaderContext.Provider value={{ setIsLoading }}>
      {isLoading && (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#003580" />
        </View>
      )}
      {children}
    </LoaderContext.Provider>
  );
}

const styles = StyleSheet.create({
  loaderContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
}); 