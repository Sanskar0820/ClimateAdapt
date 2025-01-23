import React from "react";
import { View, Text, StyleSheet, Pressable, ImageBackground } from "react-native";
import Header from "../component/Header";

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.mainPageContainer}>
      <Header />
      {/* Background Image */}
      <ImageBackground
        source={{uri:"data:image/jpeg;base64,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"}} // Path to your background image
        style={styles.backgroundImage}
      >
        <View style={styles.bannerContent}>
          <Text style={styles.bannerText}>
            Real-Time Hydro-Meteorological{"\n"}Monitoring and Forecast
          </Text>
        </View>

        {/* Uncomment the button below and use navigation for routing */}
        {/* <Pressable style={styles.homeBtn} onPress={() => navigation.navigate("MapViewer")}>
          <Text style={styles.btnText}>Map Viewer</Text>
        </Pressable> */}
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  mainPageContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  backgroundImage: {
    flex: 1,
    justifyContent: "center", // Centers content vertically
    alignItems: "center", // Centers content horizontally
    resizeMode: "cover", // Ensures the image covers the entire screen
  },
  bannerContent: {
    alignItems: "center",
    marginBottom: 20,
  },
  bannerText: {
    fontSize: 60,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    backgroundColor: "rgba(0, 0, 0, 0)", // Semi-transparent background for better text visibility
    padding: 10,
    borderRadius: 5,
  },
  homeBtn: {
    backgroundColor: "#FFC72C",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  btnText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#003580",
    textAlign: "center",
  },
});

export default HomeScreen;
