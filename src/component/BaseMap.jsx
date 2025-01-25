import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Polygon, Marker } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { mapStyles, initialRegion, mapCenter, setInitialMapZoom } from '../helpers/mapFunction';
import SearchBar from './SearchBar';

const BaseMap = ({ 
  children, 
  onRegionChange,
  selectedDistrict,
  selectedTehsil,
  tehsilBoundaries
}) => {
  const mapRef = useRef(null);
  const [mapType, setMapType] = useState('standard');
  const [currentPosition, setCurrentPosition] = useState(null);

  const handleMapPress = (e) => {
    setCurrentPosition(e.nativeEvent.coordinate);
  };

  const handleZoomToCenter = () => {
    mapRef.current?.animateToRegion({
      ...mapCenter,
      latitudeDelta: 20,
      longitudeDelta: 20,
    }, 1000);
  };

  const toggleMapType = () => {
    setMapType(prev => prev === 'standard' ? 'hybrid' : 'standard');
  };

  const handleLocationSelect = (region) => {
    mapRef.current?.animateToRegion(region, 1000);
  };

  const renderTehsilBoundaries = () => {
    if (!tehsilBoundaries) return null;

    return tehsilBoundaries.features.map((feature, index) => {
      const coordinates = feature.geometry.coordinates[0].map(coord => ({
        latitude: coord[1],
        longitude: coord[0],
      }));

      return (
        <Polygon
          key={index}
          coordinates={coordinates}
          strokeColor="red"
          strokeWidth={2}
          fillColor="rgba(255,0,0,0.1)"
        />
      );
    });
  };

  return (
    <View style={styles.container}>
      <SearchBar onLocationSelect={handleLocationSelect} />
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={initialRegion}
        mapType={mapType}
        onRegionChange={onRegionChange}
        onPress={handleMapPress}
        minZoomLevel={4}
        maxZoomLevel={12}
      >
        {renderTehsilBoundaries()}
        {children}
      </MapView>

      <View style={styles.controls}>
        <TouchableOpacity 
          style={styles.controlButton} 
          onPress={handleZoomToCenter}
        >
          <Ionicons name="home" size={24} color="#003580" />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.controlButton} 
          onPress={toggleMapType}
        >
          <Ionicons name="layers" size={24} color="#003580" />
        </TouchableOpacity>
      </View>

      {currentPosition && (
        <View style={styles.infoCard}>
          <Text style={styles.infoText}>
            Lat: {currentPosition.latitude.toFixed(4)}{'\n'}
            Long: {currentPosition.longitude.toFixed(4)}
          </Text>
        </View>
      )}

      {selectedDistrict && (
        <View style={styles.locationCard}>
          <Text style={styles.locationTitle}>Location Info</Text>
          <Text style={styles.locationText}>
            District: {selectedDistrict}
            {selectedTehsil ? `\nTehsil: ${selectedTehsil}` : ''}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    borderRadius: 15,
    overflow: 'hidden',
    backgroundColor: '#f5f5f5',
  },
  map: {
    width: '100%',
    height: '100%',
    borderRadius: 15,
  },
  controls: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: 'transparent',
    zIndex: 1,
    gap: 10,
  },
  controlButton: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    alignItems: 'center',
    justifyContent: 'center',
    width: 48,
    height: 48,
    transform: [{ scale: 1 }], // For press animation
  },
  infoCard: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: 15,
    borderRadius: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    minWidth: 150,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  infoText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
    lineHeight: 20,
  },
  locationCard: {
    position: 'absolute',
    top: 20,
    left: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: 15,
    borderRadius: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    minWidth: 200,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  locationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#003580',
    marginBottom: 8,
  },
  locationText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
    lineHeight: 20,
  },
  // Add press animation styles
  '@media (hover: hover)': {
    controlButton: {
      ':hover': {
        transform: [{ scale: 1.05 }],
      },
    },
  },
  // Add responsive styles
  '@media (max-width: 768px)': {
    locationCard: {
      minWidth: 150,
    },
    infoCard: {
      minWidth: 120,
    },
  },
});

export default BaseMap; 