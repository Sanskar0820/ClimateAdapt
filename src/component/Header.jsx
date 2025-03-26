import { StatusBar, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import Entypo from '@expo/vector-icons/Entypo';
import { useMenu } from '../context/MenuContext';
import { useTranslation } from 'react-i18next';
import i18n, { changeLanguage } from '../app/i18n';

const Header = () => {
  const { isMenuOpen, toggleMenu } = useMenu();
  const { t } = useTranslation();
  const [language, setLanguage] = useState(i18n.language);

  const handleMenuPress = () => {
    toggleMenu();
  };

  const switchLanguage = async () => {
    const newLanguage = language === 'en' ? 'hi' : language === 'hi' ? 'ta' : language === 'ta' ? 'mr' : 'en';
    setLanguage(newLanguage);
    await changeLanguage(newLanguage);
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={"black"} barStyle={"light-content"} />
      
      {/* Title */}
      <Text style={styles.title}>ClimateAdapt</Text>

      {/* Language Toggle Button */}
      <TouchableOpacity onPress={switchLanguage} style={styles.langButton}>
        <Text style={styles.langText}>{language.toUpperCase()}</Text>
      </TouchableOpacity>

      {/* Menu Button */}
      <TouchableOpacity onPress={handleMenuPress} style={styles.menuButton}>
        {isMenuOpen ? (
          <Entypo name="cross" size={30} color="black" />
        ) : (
          <Ionicons name="reorder-three" size={36} color="black" />
        )}
      </TouchableOpacity>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    height: "8%",
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: '#fff',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  title: {
    fontSize: 25,
    fontWeight: "bold"
  },
  langButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  langText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold"
  },
  menuButton: {
    padding: 10,
  },
});
