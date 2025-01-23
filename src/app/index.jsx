import React from "react";
import { View, StyleSheet } from "react-native";
import { usePathname } from "expo-router";
import HomeScreen from "./screens/home";
import DashboardScreen from "./screens/dashboard";
import DroughtScreen from "./screens/drought";
import HydrologicalScreen from "./screens/hydrological";
import ContactScreen from "./screens/contact";
import TimeseriesScreen from "./screens/timeseries";
import MeteorologicalScreen from "./screens/meteorological";
import InfoScreen from "./screens/info";
import Header from "../component/Header";

const AppRouter = () => {
  const pathname = usePathname();

  const renderScreen = () => {
    switch (pathname) {
      case '/':
        return <HomeScreen />;
      case '/screens/dashboard':
        return <DashboardScreen />;
      case '/screens/drought':
        return <DroughtScreen />;
      case '/screens/hydrological':
        return <HydrologicalScreen />;
      case '/screens/contact':
        return <ContactScreen />;
      case '/screens/timeseries':
        return <TimeseriesScreen />;
      case '/screens/meteorological':
        return <MeteorologicalScreen />;
      case '/screens/info':
        return <InfoScreen />;
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
