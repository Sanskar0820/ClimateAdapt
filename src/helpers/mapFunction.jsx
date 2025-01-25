import { Dimensions } from 'react-native';

export const mapCenter = {
  latitude: 23,
  longitude: 84,
};

export const mapBounds = {
  northEast: {
    latitude: 45,
    longitude: 110,
  },
  southWest: {
    latitude: 4,
    longitude: 60,
  },
};

export const setInitialMapZoom = () => {
  const viewportWidth = Dimensions.get('window').width;
  if (viewportWidth <= 767) {
    return 4;
  } else if (viewportWidth >= 1600) {
    return 5;
  }
  return 4.3;
};

export const mapStyles = [
  {
    name: "Standard",
    style: [],
  },
  {
    name: "Hybrid",
    style: [
      {
        featureType: "all",
        stylers: [
          { saturation: 0 },
          { hue: "#e7ecf0" }
        ]
      }
    ]
  },
  {
    name: "Terrain",
    style: [
      {
        featureType: "landscape.natural",
        stylers: [
          { visibility: "on" },
          { color: "#e8e8e8" }
        ]
      }
    ]
  }
];

export const initialRegion = {
  ...mapCenter,
  latitudeDelta: 20,
  longitudeDelta: 20,
}; 