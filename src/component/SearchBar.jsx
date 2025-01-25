import React from 'react';
import { StyleSheet, View } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { Ionicons } from '@expo/vector-icons';

const SearchBar = ({ onLocationSelect }) => {
  return (
    <View style={styles.container}>
      <GooglePlacesAutocomplete
        placeholder='Search location'
        onPress={(data, details = null) => {
          if (details) {
            onLocationSelect({
              latitude: details.geometry.location.lat,
              longitude: details.geometry.location.lng,
              latitudeDelta: 0.05,
              longitudeDelta: 0.05,
            });
          }
        }}
        query={{
          key: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY,
          language: 'en',
          components: 'country:in', // Restrict to India
        }}
        fetchDetails={true}
        styles={{
          container: styles.searchContainer,
          textInput: styles.input,
          listView: styles.listView,
          row: styles.row,
        }}
        enablePoweredByContainer={false}
        renderLeftButton={() => (
          <View style={styles.searchIcon}>
            <Ionicons name="search" size={20} color="#666" />
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
    zIndex: 1,
  },
  searchContainer: {
    flex: 0,
    backgroundColor: 'transparent',
  },
  input: {
    height: 45,
    fontSize: 16,
    backgroundColor: 'white',
    paddingLeft: 40,
    borderRadius: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  listView: {
    backgroundColor: 'white',
    borderRadius: 8,
    marginTop: 5,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  row: {
    padding: 13,
    height: 44,
  },
  searchIcon: {
    position: 'absolute',
    top: 12,
    left: 12,
    zIndex: 2,
  },
});

export default SearchBar; 