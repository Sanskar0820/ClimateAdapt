import React, { useState, useRef, forwardRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Polygon } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { mapStyles, initialRegion, mapCenter } from '../helpers/mapFunction';
import SearchBar from './SearchBar';

const BaseMap = forwardRef(({ children, onRegionChange, selectedDistrict, selectedTehsil, tehsilBoundaries }, ref) => {
  const [mapType, setMapType] = useState('standard');
  const [currentPosition, setCurrentPosition] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    setRefreshKey(prevKey => prevKey + 1);
  }, [tehsilBoundaries]);

  const handleMapPress = (e) => {
    setCurrentPosition(e.nativeEvent.coordinate);
  };

  const handleZoomToCenter = () => {
    if (ref.current) {
      ref.current.animateToRegion(
        {
          ...mapCenter,
          latitudeDelta: 20,
          longitudeDelta: 20,
        },
        1000
      );
    }
  };

  const toggleMapType = () => {
    setMapType(prev => (prev === 'standard' ? 'hybrid' : 'standard'));
  };

  const handleLocationSelect = (region) => {
    if (ref.current) {
      ref.current.animateToRegion(region, 1000);
    }
  };

  const renderTehsilBoundaries = () => {
    if (!tehsilBoundaries?.features) return null;
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
    <View style={styles.container} key={refreshKey}>
      <SearchBar onLocationSelect={handleLocationSelect} />
      <MapView
        ref={ref}
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
        <TouchableOpacity style={styles.controlButton} onPress={handleZoomToCenter}>
          <Ionicons name="home" size={24} color="#003580" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.controlButton} onPress={toggleMapType}>
          <Ionicons name="layers" size={24} color="#003580" />
        </TouchableOpacity>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 15,
    overflow: 'hidden',
    backgroundColor: '#f5f5f5',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  controls: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 10,
  },
  controlButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 10,
    borderRadius: 50,
    marginBottom: 10,
  },
});

export default BaseMap;