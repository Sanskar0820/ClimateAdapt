import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Header from '../../../component/Header'

const DashboardScreen = ({ isMenuOpen, toggleMenu }) => {
  return (
    <View style={styles.container}>
      <Header isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} />
      <View style={styles.content}>
        <Text style={styles.title}>Dashboard</Text>
      </View>
    </View>
  )
}

export default DashboardScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  }
}) 