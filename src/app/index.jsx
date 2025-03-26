import React from "react";
import { View, StyleSheet } from "react-native";
import { usePathname } from "expo-router";
import HomeScreen from "./screens/home";
import DashboardScreen from "./screens/dashboard";
import DroughtScreen from "./screens/drought";
import HydrologicalScreen from "./screens/hydrological";
import ContactScreen from "./screens/contact";
import MeteorologicalScreen from "./screens/meteorological";
import InfoScreen from "./screens/info";
import AdvisoryScreen from "./screens/advisory";
import Header from "../component/Header";
import WeatherScreen from "./screens/weather";
import FeedbackScreen from "./screens/feedback";
import 'react-native-polyfill-globals/auto';

const AppRouter = () => {
  const pathname = usePathname();

  const renderScreen = () => {
    switch (pathname) {
      case '/':
        return <HomeScreen />;
      case '/screens/meteorological':
        return <MeteorologicalScreen title="Meteorological Condition" />;
      case '/screens/hydrological':
        return <HydrologicalScreen title="Hydrological Condition" />;
      case '/screens/drought':
        return <DroughtScreen title="Drought Condition" />;
      case '/screens/weather':
        return <WeatherScreen title="Weather Condition" />;
      case '/screens/dashboard':
        return <DashboardScreen />;
      case '/screens/info':
        return <InfoScreen />;
      case '/screens/contact':
        return <ContactScreen />;
      case '/screens/feedback':
        return <FeedbackScreen />;
        case '/screens/advisory':
          return <AdvisoryScreen />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <View style={styles.container}>
      {/* <Header /> */}
      {renderScreen()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default AppRouter;
