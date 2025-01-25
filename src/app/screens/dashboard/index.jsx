import 'react-native-get-random-values';
import { StyleSheet, Text, View, SafeAreaView, ScrollView, Dimensions } from 'react-native'
import React, { useState, useEffect, useRef } from 'react'
import Header from '../../../component/Header'
import { Picker } from '@react-native-picker/picker'
import MapView, { PROVIDER_GOOGLE, Polygon } from 'react-native-maps'
import PlaceAttributes from '../../../../assets/PlaceAttributes.json'
import { useLoader } from '../../../context/LoaderContext'
import AnnualTimeSeriesChart from '../../../component/AnnualTimeSeriesChart'
import ClimatologyTimeSeriesChart from '../../../component/ClimatologyTimeSeriesChart'
import ExtremesConditionsCharts from '../../../component/ExtremesConditionsCharts'
import BaseMap from '../../../component/BaseMap'
import { AnnualData } from '../../../../assets/data/AnnualData';
import { ClimatologyData } from '../../../../assets/data/ClimatologyData';
import { ExtremesConditionsData } from '../../../../assets/data/ExtremesConditionsData';
import FilteredJsonData from '../../../component/FilteredJsonData';
import indiaTehsilsFiltered from '../../../../assets/data/indiaTehsilsFiltered.json';
import indiaStates from '../../../../assets/data/indiaStates.json';

const MapDatasetOptions = [
  {
    DataName: "Annual data",
    DataValue: "annual_data",
    Data: AnnualData || [],
    variables: [
      {
        name: "Rainfall",
        value: "pcp",
        unit: "mm",
      },
      {
        name: "Max. temperature",
        value: "t_max",
        unit: "°C",
      },
      {
        name: "Min. temperature",
        value: "t_min",
        unit: "°C",
      },
    ]
  },
  {
    DataName: "Climatology data",
    DataValue: "climatology_data",
    Data: ClimatologyData || [],
    variables: [
      {
        name: "Daily rainfall",
        value: "pcp",
        unit: "mm",
      },
      {
        name: "Daily max. temperature",
        value: "T_max",
        unit: "°C",
      },
      {
        name: "Daily min. temperature",
        value: "T_min",
        unit: "°C",
      },
    ]
  },
  {
    DataName: "Extreme conditions",
    DataValue: "extreme_condition",
    Data: ExtremesConditionsData || [],
    variables: [
      {
        name: "Rainfall",
        value: "pcp",
        unit: "mm",
      },
      {
        name: "Temperature",
        value: "temp",
        unit: "°C",
      },
    ]
  }
];

const DashboardScreen = () => {
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedTehsil, setSelectedTehsil] = useState('');
  const [tehsilList, setTehsilList] = useState([]);
  const [tehsilSelectedItem, setTehsilSelectedItem] = useState(null);
  const [selectedMapData, setSelectedMapData] = useState(null);
  const [selectedVariable, setSelectedVariable] = useState(null);
  const [showTimeseries, setShowTimeseries] = useState(false);
  const { setIsLoading } = useLoader();
  const [filteredIndiaDistrict, setFilteredIndiaDistrict] = useState(null);
  const mapRef = useRef(null);

  const handleDistrictSelect = (value) => {
    setSelectedDistrict(value);
    let items = PlaceAttributes.filter((item) => item.DISTRICT === value);
    items = [...new Set(items.map((item) => item))];
    items.sort();
    setTehsilList(items);
    setSelectedTehsil('');
    setTehsilSelectedItem(null);
    setSelectedMapData(null);

    let filteredDistrictFeatures = indiaTehsilsFiltered.features.filter(
      (feature) => feature.properties.DISTRICT === value && 
                  feature.properties.STATE === items[0].STATE
    );

    setFilteredIndiaDistrict({
      type: "FeatureCollection",
      features: filteredDistrictFeatures,
    });
  };

  const handleTehsilSelect = (value) => {
    setSelectedTehsil(value);
    let item = tehsilList.find((item) => item.TEHSIL === value);
    setTehsilSelectedItem(item);
    setSelectedMapData(null);
    setSelectedVariable(null);
  };

  const handleSelectMapData = (value) => {
    try {
      if (!value) {
        setSelectedMapData(null);
        setSelectedVariable(null);
        setShowTimeseries(false);
        return;
      }

      const selectedData = MapDatasetOptions.find(item => item.DataValue === value);
      if (selectedData) {
        console.log('Selected Map Data:', selectedData); // Debug log
        setSelectedMapData(selectedData);
        setSelectedVariable(null);
        setShowTimeseries(false);
      }
    } catch (error) {
      console.error('Error in handleSelectMapData:', error);
      setSelectedMapData(null);
      setSelectedVariable(null);
    }
  };

  const handleSelectVariable = (value) => {
    try {
      if (!value || !selectedMapData?.variables) {
        setSelectedVariable(null);
        setShowTimeseries(false);
        return;
      }

      const variable = selectedMapData.variables.find(v => v.value === value);
      if (variable) {
        console.log('Selected Variable:', variable); // Debug log
        
        // Check if we have data for this variable
        const tehsilData = selectedMapData.Data?.find(
          item => item.ID === tehsilSelectedItem?.ID
        );

        if (tehsilData && tehsilData[variable.value]) {
          setSelectedVariable(variable);
          setShowTimeseries(true);
        } else {
          console.warn('No data available for selected variable');
          setSelectedVariable(null);
          setShowTimeseries(false);
        }
      }
    } catch (error) {
      console.error('Error in handleSelectVariable:', error);
      setSelectedVariable(null);
      setShowTimeseries(false);
    }
  };

  // Add a useEffect to monitor state changes
  useEffect(() => {
    console.log('Current State:', {
      selectedMapData,
      selectedVariable,
      tehsilSelectedItem,
      showTimeseries
    });
  }, [selectedMapData, selectedVariable, tehsilSelectedItem, showTimeseries]);

  const renderParameterPicker = () => {
    if (!selectedMapData?.variables?.length) return null;

    return (
      <>
        <Text style={styles.label}>Select Parameter</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedVariable?.value || ''}
            style={styles.picker}
            onValueChange={handleSelectVariable}
          >
            <Picker.Item label="Select Parameter" value="" />
            {selectedMapData.variables.map((variable, index) => (
              <Picker.Item 
                key={index} 
                label={`${variable.name} (${variable.unit})`} 
                value={variable.value} 
              />
            ))}
          </Picker>
        </View>
      </>
    );
  };

  const DistrictStyle = (feature) => {
    if (feature.properties.TEHSIL === selectedTehsil && 
        feature.properties.DISTRICT === selectedDistrict) {
      return {
        fillColor: "rgba(255, 255, 0, 0.7)",
        weight: 2,
        color: 'red',
        fillOpacity: 0.7
      };
    } else {
      return {
        fillColor: "rgba(0, 0, 0, 0.00001)",
        weight: 2,
        color: 'red',
        fillOpacity: 0.00001
      };
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <View style={styles.content}>
        <ScrollView style={styles.selectionContainer}>
          <Text style={styles.label}>Select District</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedDistrict}
              style={styles.picker}
              onValueChange={handleDistrictSelect}
            >
              <Picker.Item label="Select District" value="" />
              {[...new Set(PlaceAttributes.map((item) => item.DISTRICT))].map((item, index) => (
                <Picker.Item key={index} label={item} value={item} />
              ))}
            </Picker>
          </View>

          <Text style={styles.label}>Select Tehsil</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedTehsil}
              style={styles.picker}
              enabled={tehsilList.length > 0}
              onValueChange={handleTehsilSelect}
            >
              <Picker.Item label="Select Tehsil" value="" />
              {tehsilList.map((item, index) => (
                <Picker.Item key={index} label={item.TEHSIL} value={item.TEHSIL} />
              ))}
            </Picker>
          </View>

          {tehsilSelectedItem && (
            <>
              <Text style={styles.label}>Select Data Type</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={selectedMapData?.DataValue || ''}
                  style={styles.picker}
                  onValueChange={handleSelectMapData}
                >
                  <Picker.Item label="Select Data Type" value="" />
                  {MapDatasetOptions.map((item, index) => (
                    <Picker.Item key={index} label={item.DataName} value={item.DataValue} />
                  ))}
                </Picker>
              </View>
            </>
          )}

          {selectedMapData && renderParameterPicker()}
        </ScrollView>

        <View style={styles.mapContainer}>
          <BaseMap
            ref={mapRef}
            selectedDistrict={selectedDistrict}
            selectedTehsil={selectedTehsil}
          >
            {filteredIndiaDistrict ? (
              <FilteredJsonData
                mapRef={mapRef}
                filteredIndiaDistrict={filteredIndiaDistrict}
                selectedTehsilID={tehsilSelectedItem?.ID}
                DistrictStyle={DistrictStyle}
              />
            ) : (
              // Render India state boundaries
              indiaStates.features.map((feature, index) => {
                const coordinates = feature.geometry.coordinates[0].map(coord => ({
                  latitude: coord[1],
                  longitude: coord[0],
                }));
                return (
                  <Polygon
                    key={index}
                    coordinates={coordinates}
                    strokeColor="black"
                    strokeWidth={2}
                    fillColor="transparent"
                  />
                );
              })
            )}
          </BaseMap>
        </View>

        {showTimeseries && tehsilSelectedItem && selectedVariable && selectedMapData && (
          <View style={styles.timeseriesContainer}>
            {selectedMapData.DataValue === "annual_data" ? (
              <AnnualTimeSeriesChart
                selectedMapData={selectedMapData}
                selectedVariable={selectedVariable}
                selectedTehsilID={tehsilSelectedItem.ID}
                selectedDistrict={selectedDistrict}
                selectedTehsil={selectedTehsil}
              />
            ) : selectedMapData.DataValue === "climatology_data" ? (
              <ClimatologyTimeSeriesChart
                selectedMapData={selectedMapData}
                selectedVariable={selectedVariable}
                selectedTehsilID={tehsilSelectedItem.ID}
                selectedDistrict={selectedDistrict}
                selectedTehsil={selectedTehsil}
              />
            ) : (
              <ExtremesConditionsCharts
                selectedMapData={selectedMapData}
                selectedVariable={selectedVariable}
                selectedTehsilID={tehsilSelectedItem.ID}
                selectedDistrict={selectedDistrict}
                selectedTehsil={selectedTehsil}
              />
            )}
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

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
  pickerContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  picker: {
    height: 50,
  },
  mapContainer: {
    flex: 1,
    overflow: 'hidden',
  },
  timeseriesContainer: {
    padding: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  }
});

export default DashboardScreen; 