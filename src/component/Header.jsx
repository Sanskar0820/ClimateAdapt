import { StatusBar, StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import Ionicons from '@expo/vector-icons/Ionicons';
import Entypo from '@expo/vector-icons/Entypo';
import { useMenu } from '../context/MenuContext';

const Header = () => {
  const { isMenuOpen, toggleMenu } = useMenu();

  const handleMenuPress = () => {
    toggleMenu();
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={"black"} barStyle={"light-content"}/>
      <Text style={styles.title}>ClimateAdapt Dashboard</Text>
      <TouchableOpacity 
        onPress={handleMenuPress}
        style={styles.menuButton}
      >
        {isMenuOpen ? (
          <Entypo name="cross" size={24} color="black" />
        ) : (
          <Ionicons name="reorder-three" size={26} color="black" />
        )}
      </TouchableOpacity>
    </View>
  )
}

export default Header

const styles = StyleSheet.create({
    container:{
        height: 55,
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
    menuButton: {
        padding: 10,
    },
    title:{
        fontSize: 25,
        fontWeight: "bold"
    }
})