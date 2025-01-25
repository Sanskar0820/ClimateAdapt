import React from "react";
import { View, Text, StyleSheet, Pressable, ImageBackground } from "react-native";
import Header from '../../../component/Header'
import { useRouter } from 'expo-router'

const HomeScreen = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Header />
      <ImageBackground
        source={require("../../../../assets/images/background.jpg")}
        style={styles.backgroundImage}
      >
        <View style={styles.overlay}>
          <View style={styles.content}>
            <Text style={styles.title}>
              Real-Time{'\n'}
              Hydro-{'\n'}
              Meteorological{'\n'}
              Monitoring and Forecast
            </Text>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  content: {
    maxWidth: 800,
    alignItems: 'center',
  },
  title: {
    fontSize: 48,
    fontWeight: '900',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
    letterSpacing: 1,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
});

export default HomeScreen; 