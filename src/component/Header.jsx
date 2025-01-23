import { StatusBar, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Ionicons from '@expo/vector-icons/Ionicons';

const Header = () => {
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={"black"} barStyle={"light-content"}/>
      <Text style={styles.title}>ClimateAdapt Dashboard</Text>
      <Ionicons name="reorder-three" size={26} color="black" />
    </View>
  )
}

export default Header

const styles = StyleSheet.create({
    container:{
        height:55,
        width:"100%",
        flexDirection:"row",
        justifyContent:"space-around",
        alignItems:"center",
    },
    title:{
        fontSize:25,
        fontWeight:"bold"
    }
})