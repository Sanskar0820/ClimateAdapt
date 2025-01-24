import React from "react";
import { View, Text, StyleSheet, Pressable, ImageBackground } from "react-native";
import Header from '../../../component/Header'

const HomeScreen = ({ isMenuOpen, toggleMenu }) => {
  return (
    <View style={styles.mainPageContainer}>
      <Header isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} />
      <ImageBackground
        source={require("../../../../assets/images/background.jpg")}
        style={styles.backgroundImage}
      >
        <View style={styles.bannerContent}>
          <Text style={styles.bannerText}>
            Climate{"\n"}Adapt
          </Text>
          <Pressable
            style={styles.homeBtn}
            android_ripple={{ color: "#FFC72C" }}
          >
            <Text style={styles.btnText}>Get Started</Text>
          </Pressable>
        </View>
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
    justifyContent: "center",
    alignItems: "center",
    resizeMode: "cover",
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
    backgroundColor: "rgba(0, 0, 0, 0)",
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  homeBtn: {
    backgroundColor: "#FFC72C",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  btnText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#003580",
    textAlign: "center",
  },
});

export default HomeScreen; 