import { StyleSheet, Text, View, SafeAreaView, ScrollView, Image } from 'react-native'
import React, { useState, useEffect } from 'react'
import Header from '../../../component/Header'
import { useSelectedFeature } from '../../../context/SelectedFeatureContext'
import PlaceAttributes from '../../../../assets/PlaceAttributes.json'
import Meteorological_Images from '../../../../assets/Meteorologgical_Images.json'
import {Picker} from '@react-native-picker/picker';

const MeteorologicalScreen = () => {
  const { 
    handleDistrictSelect, 
    handleTehsilSelect, 
    selectedDistrict, 
    selectedTehsil, 
    tehsilList 
  } = useSelectedFeature();

  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    if (selectedTehsil && selectedTehsil !== '') {
      let item = Meteorological_Images.find((item) => item.TEHSIL === selectedTehsil);
      setSelectedImage(item);
    }
  }, [selectedTehsil]);

  const renderLegendText = (text) => {
    // Helper function to safely render text with comparison operators
    return text.replace(/</g, '‹').replace(/>/g, '›');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <ScrollView style={styles.content}>
        <View style={styles.selectionContainer}>
          <Text style={styles.label}>Select district</Text>
          <Picker
            selectedValue={selectedDistrict}
            style={styles.picker}
            onValueChange={(itemValue) => handleDistrictSelect(itemValue)}
          >
            <Picker.Item label="Select" value="" />
            {[...new Set(PlaceAttributes.map((item) => item.DISTRICT))].map((item, index) => (
              <Picker.Item key={index} label={item} value={item} />
            ))}
          </Picker>

          <Text style={styles.label}>Select taluka</Text>
          <Picker
            selectedValue={selectedTehsil}
            style={styles.picker}
            enabled={tehsilList && tehsilList.length > 0}
            onValueChange={(itemValue) => handleTehsilSelect(itemValue)}
          >
            <Picker.Item label="Select" value="" />
            {[...new Set(tehsilList && tehsilList.map((item) => item.TEHSIL))].map((item, index) => (
              <Picker.Item key={index} label={item} value={item} />
            ))}
          </Picker>
        </View>

        {selectedImage ? (
          <View style={styles.imageContainer}>
            <Image 
              source={{ uri: selectedImage.url }}
              style={styles.meteorologicalImage}
              resizeMode="contain"
            />
            <View style={styles.legendContainer}>
              <Text style={styles.legendTitle}>Departure/Anomaly:</Text>
              <Text style={styles.legendText}>
                Difference between the current rainfall/temperature and the average (or normal) rainfall/temperature for a specific period and location. This metric is used to assess whether a region is experiencing above-average or below-average rainfall/temperature.
              </Text>

              <Text style={styles.legendTitle}>Legend</Text>
              <View style={styles.tableContainer}>
                <View style={styles.tableRow}>
                  <Text style={styles.tableHeader}>Temperature Condition</Text>
                  <Text style={styles.tableHeader}>Rainfall Remark</Text>
                </View>
                <View style={styles.tableRow}>
                  <Text style={[styles.tableCell, { color: 'red' }]}>
                    {renderLegendText('Temperature Anomaly > 2 (High temperature)')}
                  </Text>
                  <Text style={[styles.tableCell, { color: 'blue' }]}>
                    {renderLegendText('Departure > 0 (Surplus)')}
                  </Text>
                </View>
                <View style={styles.tableRow}>
                  <Text style={[styles.tableCell, { color: 'blue' }]}>
                    {renderLegendText('Temperature Anomaly < -2 (Low temperature)')}
                  </Text>
                  <Text style={[styles.tableCell, { color: 'red' }]}>
                    {renderLegendText('Departure < 0 (Deficit)')}
                  </Text>
                </View>
                <View style={styles.tableRow}>
                  <Text style={[styles.tableCell, { color: 'green' }]}>
                    {renderLegendText('-2 <= Temperature Anomaly <= 2 (Normal temperature)')}
                  </Text>
                  <Text style={styles.tableCell}>
                    Very Light to Light Rainfall (0.1 - 15.5 mm){'\n'}
                    Moderate Rainfall (15.6 - 64.4 mm){'\n'}
                    Heavy Rainfall (64.5 - 115.5 mm){'\n'}
                    Very Heavy Rainfall (115.6 - 204.4 mm){'\n'}
                    Extremely Heavy Rainfall (≥ 204.5 mm)
                  </Text>
                </View>
              </View>
            </View>
          </View>
        ) : (
          <Text style={styles.placeholder}>Please select location.</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

export default MeteorologicalScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
  },
  selectionContainer: {
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    color: '#333',
  },
  picker: {
    backgroundColor: '#fff',
    marginBottom: 16,
    height: 50,
    borderRadius: 8,
  },
  imageContainer: {
    padding: 20,
  },
  meteorologicalImage: {
    width: '100%',
    height: 300,
    marginBottom: 20,
  },
  legendContainer: {
    padding: 15,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  legendTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#003580',
  },
  legendText: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
    color: '#444',
  },
  tableContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
    marginTop: 10,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tableHeader: {
    flex: 1,
    padding: 10,
    fontWeight: 'bold',
    backgroundColor: '#003580',
    color: '#fff',
    textAlign: 'center',
  },
  tableCell: {
    flex: 1,
    padding: 10,
    fontSize: 14,
  },
  placeholder: {
    padding: 20,
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
  }
}) 