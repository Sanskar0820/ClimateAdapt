import { StyleSheet, Text, View, SafeAreaView, ScrollView, Image } from 'react-native'
import React, { useState, useEffect } from 'react'
import Header from '../../../component/Header'
import { useSelectedFeature } from '../../../context/SelectedFeatureContext'
import PlaceAttributes from '../../../../assets/PlaceAttributes.json'
import Hydrological_Images from '../../../../assets/Hydrological_Images.json'
import { Picker } from '@react-native-picker/picker'

const HydrologicalScreen = () => {
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
      let item = Hydrological_Images.find((item) => item.TEHSIL === selectedTehsil);
      setSelectedImage(item);
    }
  }, [selectedTehsil]);

  const renderLegendText = (text) => {
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
              style={styles.hydrologicalImage}
              resizeMode="contain"
            />
            <View style={styles.legendContainer}>
              <Text style={styles.legendTitle}>Soil-Moisture Percentile:</Text>
              <Text style={styles.legendText}>
                Soil-moisture percentile shows the current soil moisture conditions (dry/wet) compared to all past measurements. For examples, If current soil-moisture is 90th percentile, that means it is wetter than 90% of all past measurements. If it is 10th percentile, the soil is drier than 90% of all past measurements.
              </Text>

              <Text style={styles.legendTitle}>Legend</Text>
              <View style={styles.tableContainer}>
                <View style={styles.tableRow}>
                  <Text style={styles.tableHeader}>Dry Condition:</Text>
                  <Text style={styles.tableHeader}>Wet Condition:</Text>
                </View>
                <View style={styles.tableRow}>
                  <View style={styles.tableCell}>
                    <Text>{renderLegendText('30th﹤Percentile ≤ 70th')} (Normal Conditions)</Text>
                    <Text>{renderLegendText('20th﹤Percentile ≤ 30th')} <Text style={styles.redText}>(Abnormally Dry)</Text></Text>
                    <Text>{renderLegendText('10th﹤Percentile ≤ 20th')} <Text style={styles.redText}>(Moderate Dry)</Text></Text>
                    <Text>{renderLegendText('5th﹤Percentile ≤ 10th')} <Text style={styles.redText}>(Severe Dry)</Text></Text>
                    <Text>{renderLegendText('2nd﹤Percentile ≤ 5th')} <Text style={styles.redText}>(Extreme Dry)</Text></Text>
                    <Text>{renderLegendText('0th﹤Percentile ≤ 2nd')} <Text style={styles.redText}>(Exceptional Dry)</Text></Text>
                  </View>
                  <View style={styles.tableCell}>
                    <Text>{renderLegendText('70th﹤Percentile ≤ 80th')} <Text style={styles.blueText}>(Abnormally Wet)</Text></Text>
                    <Text>{renderLegendText('80th﹤Percentile ≤ 90th')} <Text style={styles.blueText}>(Moderate Wet)</Text></Text>
                    <Text>{renderLegendText('90th﹤Percentile ≤ 95th')} <Text style={styles.blueText}>(Severe Wet)</Text></Text>
                    <Text>{renderLegendText('95nd﹤Percentile ≤ 98th')} <Text style={styles.blueText}>(Extreme Wet)</Text></Text>
                    <Text>{renderLegendText('98th﹤Percentile ≤ 100th')} <Text style={styles.blueText}>(Exceptional Wet)</Text></Text>
                  </View>
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

export default HydrologicalScreen

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
  hydrologicalImage: {
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
  },
  redText: {
    color: 'red',
  },
  blueText: {
    color: 'blue',
  },
  placeholder: {
    padding: 20,
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
  }
}) 