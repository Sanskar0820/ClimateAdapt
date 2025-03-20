import { StyleSheet, Text, View, SafeAreaView, ScrollView, Animated, TouchableOpacity } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import Header from '../../../component/Header';
import { useSelectedFeature } from '../../../context/SelectedFeatureContext';
import PlaceAttributes from '../../../../assets/PlaceAttributes.json';
import Drought_Images from '../../../../assets/Drought_Images.json';
import { Picker } from '@react-native-picker/picker';
import { PinchGestureHandler, PanGestureHandler, State } from 'react-native-gesture-handler';

const DroughtScreen = () => {
  const { handleDistrictSelect, selectedDistrict } = useSelectedFeature();
  const [selectedImage, setSelectedImage] = useState(null);

  const scale = useRef(new Animated.Value(1)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const lastScale = useRef(1);
  const lastOffset = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (selectedDistrict && selectedDistrict !== '') {
      let item = Drought_Images.find((item) => item.DISTRICT === selectedDistrict);
      setSelectedImage(item);
    }
  }, [selectedDistrict]);

  const onZoomIn = () => {
    const newScale = Math.min(lastScale.current * 1.2, 3); // Max zoom limit
    lastScale.current = newScale;
    Animated.timing(scale, { toValue: newScale, duration: 200, useNativeDriver: true }).start();
  };

  const onZoomOut = () => {
    const newScale = Math.max(lastScale.current * 0.8, 1); // Min zoom limit
    lastScale.current = newScale;
    Animated.timing(scale, { toValue: newScale, duration: 200, useNativeDriver: true }).start();
  };

  const onPanEvent = Animated.event(
    [
      { nativeEvent: { translationX: translateX, translationY: translateY } },
    ],
    { useNativeDriver: true }
  );

  const onPanStateChange = (event) => {
    if (event.nativeEvent.state === State.END) {
      lastOffset.current.x += event.nativeEvent.translationX;
      lastOffset.current.y += event.nativeEvent.translationY;
      translateX.setValue(lastOffset.current.x);
      translateY.setValue(lastOffset.current.y);
    }
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
        </View>

        {selectedImage ? (
          <View style={styles.imageContainer}>
            <PanGestureHandler onGestureEvent={onPanEvent} onHandlerStateChange={onPanStateChange}>
              <Animated.View style={styles.imageBoundary}>
                <Animated.Image
                  source={{ uri: selectedImage.url }}
                  style={[
                    styles.droughtImage,
                    {
                      transform: [{ scale }, { translateX }, { translateY }],
                    },
                  ]}
                  resizeMode="contain"
                />
              </Animated.View>
            </PanGestureHandler>

            {/* Zoom Controls */}
            <View style={styles.zoomControls}>
              <TouchableOpacity style={styles.zoomButton} onPress={onZoomIn}>
                <Text style={styles.zoomText}>+</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.zoomButton} onPress={onZoomOut}>
                <Text style={styles.zoomText}>-</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.placeholderContainer}>
            <Text style={styles.placeholder}>Please select a location.</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default DroughtScreen;

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
  imageBoundary: {
    width: 300,
    height: 400,
    overflow: 'hidden',
  },
  droughtImage: {
    width: '100%',
    height: '100%',
  },
  zoomControls: {
    flexDirection: 'row',
    marginTop: 10,
  },
  zoomButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  zoomText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
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
  },
});