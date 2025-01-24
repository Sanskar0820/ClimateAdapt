import { StyleSheet, Text, View, SafeAreaView, ScrollView, Image } from 'react-native'
import React, { useState, useEffect } from 'react'
import Header from '../../../component/Header'
import { useSelectedFeature } from '../../../context/SelectedFeatureContext'
import PlaceAttributes from '../../../../assets/PlaceAttributes.json'
import Drought_Images from '../../../../assets/Drought_Images.json'
import { Picker } from '@react-native-picker/picker'

const DroughtScreen = () => {
  const { 
    handleDistrictSelect,
    selectedDistrict,
  } = useSelectedFeature();

  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    if (selectedDistrict && selectedDistrict !== '') {
      let item = Drought_Images.find((item) => item.DISTRICT === selectedDistrict);
      setSelectedImage(item);
    }
  }, [selectedDistrict]);

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
        </View>

        {selectedImage ? (
          <View style={styles.imageContainer}>
            <Image 
              source={{ uri: selectedImage.url }}
              style={styles.droughtImage}
              resizeMode="contain"
            />
          </View>
        ) : (
          <View style={styles.placeholderContainer}>
            <Text style={styles.placeholder}>Please select location.</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

export default DroughtScreen

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
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
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
    alignItems: 'center',
  },
  droughtImage: {
    width: '100%',
    height: 400,
    marginBottom: 20,
  },
  placeholderContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 200,
  },
  placeholder: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  }
}) 