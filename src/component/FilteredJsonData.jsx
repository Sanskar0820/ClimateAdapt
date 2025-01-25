import React, { useEffect } from 'react';
import { Polygon } from 'react-native-maps';

const FilteredJsonData = ({
  mapRef,
  filteredIndiaDistrict,
  selectedTehsilID,
  DistrictStyle
}) => {
  useEffect(() => {
    if (filteredIndiaDistrict?.features?.length > 0) {
      const coordinates = [];
      
      if (selectedTehsilID) {
        const filteredTehsil = filteredIndiaDistrict.features.find(
          item => item.properties.ID === selectedTehsilID
        );
        if (filteredTehsil) {
          filteredTehsil.geometry.coordinates[0].forEach(coord => {
            coordinates.push({
              latitude: coord[1],
              longitude: coord[0]
            });
          });
        }
      } else {
        filteredIndiaDistrict.features.forEach(feature => {
          feature.geometry.coordinates[0].forEach(coord => {
            coordinates.push({
              latitude: coord[1],
              longitude: coord[0]
            });
          });
        });
      }

      if (coordinates.length > 0) {
        const bounds = coordinates.reduce(
          (acc, coord) => ({
            minLat: Math.min(acc.minLat, coord.latitude),
            maxLat: Math.max(acc.maxLat, coord.latitude),
            minLng: Math.min(acc.minLng, coord.longitude),
            maxLng: Math.max(acc.maxLng, coord.longitude),
          }),
          {
            minLat: coordinates[0].latitude,
            maxLat: coordinates[0].latitude,
            minLng: coordinates[0].longitude,
            maxLng: coordinates[0].longitude,
          }
        );

        mapRef.current?.animateToRegion({
          latitude: (bounds.minLat + bounds.maxLat) / 2,
          longitude: (bounds.minLng + bounds.maxLng) / 2,
          latitudeDelta: (bounds.maxLat - bounds.minLat) * 1.5,
          longitudeDelta: (bounds.maxLng - bounds.minLng) * 1.5,
        }, 1000);
      }
    }
  }, [filteredIndiaDistrict, selectedTehsilID]);

  if (!filteredIndiaDistrict?.features) return null;

  return filteredIndiaDistrict.features.map((feature, index) => {
    const coordinates = feature.geometry.coordinates[0].map(coord => ({
      latitude: coord[1],
      longitude: coord[0],
    }));

    const style = DistrictStyle(feature);

    return (
      <Polygon
        key={`${feature.properties.ID}-${index}`}
        coordinates={coordinates}
        strokeColor={style.color}
        strokeWidth={style.weight}
        fillColor={style.fillColor}
        fillOpacity={style.fillOpacity}
      />
    );
  });
};

export default FilteredJsonData; 