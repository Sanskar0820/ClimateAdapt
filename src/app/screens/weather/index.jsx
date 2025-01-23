import { StyleSheet, Text, View, SafeAreaView } from 'react-native'
import React from 'react'
import Header from '../../../component/Header'

const TimeseriesScreen = ({ isMenuOpen, toggleMenu }) => {
  return (
    <SafeAreaView style={styles.container}>
      <Header isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} />
      <View style={styles.content}>
        <Text style={styles.title}>Time Series Data</Text>
      </View>
    </SafeAreaView>
  )
}

export default TimeseriesScreen

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