import React, { createContext, useContext, useState } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

const AlertContext = createContext(undefined);

// Export the hook
export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlert must be used within an AlertProvider');
  }
  return context;
};

// Export the provider
export const AlertProvider = ({ children }) => {
  const [alertMessage, setAlertMessage] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (showAlert) {
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.delay(3000),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => setShowAlert(false));
    }
  }, [showAlert, fadeAnim]);

  const value = React.useMemo(() => ({
    setAlertMessage,
    setShowAlert,
  }), []);

  return (
    <AlertContext.Provider value={value}>
      {children}
      {showAlert && (
        <Animated.View style={[styles.alert, { opacity: fadeAnim }]}>
          <Text style={styles.alertText}>{alertMessage}</Text>
        </Animated.View>
      )}
    </AlertContext.Provider>
  );
};

const styles = StyleSheet.create({
  alert: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: 15,
    borderRadius: 8,
    elevation: 5,
  },
  alertText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
  },
}); 