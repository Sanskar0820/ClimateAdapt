import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useTranslation } from 'react-i18next';
import MapView, { Polygon } from 'react-native-maps';
import FilteredJsonData from '../../../component/FilteredJsonData';
import PlaceAttributes from '../../../../assets/PlaceAttributes.json';
import indiaTehsilsFiltered from '../../../../assets/data/indiaTehsilsFiltered.json';
import { AnnualData } from '../../../../assets/data/AnnualData';
import { ClimatologyData } from '../../../../assets/data/ClimatologyData';
import { ExtremesConditionsData } from '../../../../assets/data/ExtremesConditionsData';
import Header from '@/src/component/Header';
import BaseMap from '../../../component/BaseMap';
import indiaStates from '../../../../assets/data/indiaStates.json';
import AnnualTimeSeriesChart from '../../../component/AnnualTimeSeriesChart';
import ClimatologyTimeSeriesChart from '../../../component/ClimatologyTimeSeriesChart';
import ExtremesConditionsCharts from '../../../component/ExtremesConditionsCharts';

const MapDatasetOptions = [
  {
    DataName: 'Annual data',
    DataValue: 'annual_data',
    Data: AnnualData,
    variables: [
      { name: 'Rainfall', value: 'pcp', unit: 'mm' },
      { name: 'Max. temperature', value: 't_max', unit: '°C' },
      { name: 'Min. temperature', value: 't_min', unit: '°C' },
    ],
  },
  {
    DataName: 'Climatology data',
    DataValue: 'climatology_data',
    Data: ClimatologyData,
    variables: [
      { name: 'Daily rainfall', value: 'pcp', unit: 'mm' },
      { name: 'Daily max. temperature', value: 'T_max', unit: '°C' },
      { name: 'Daily min. temperature', value: 'T_min', unit: '°C' },
    ],
  },
  {
    DataName: 'Extreme conditions',
    DataValue: 'extreme_condition',
    Data: ExtremesConditionsData,
    variables: [
      { name: 'Rainfall', value: 'pcp', unit: 'mm' },
      { name: 'Temperature', value: 'temp', unit: '°C' },
    ],
  },
];

export default function DashboardScreen() {
  const { t } = useTranslation();
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedTehsil, setSelectedTehsil] = useState('');
  const [tehsilList, setTehsilList] = useState([]);
  const [tehsilSelectedItem, setTehsilSelectedItem] = useState(null);
  const [selectedMapData, setSelectedMapData] = useState(null);
  const [selectedVariable, setSelectedVariable] = useState(null);
  const [filteredIndiaDistrict, setFilteredIndiaDistrict] = useState(null);
  const [showTimeseries, setShowTimeseries] = useState(false);
  const mapRef = useRef(null);

  const handleDistrictSelect = (value) => {
    setSelectedDistrict(value);
    const items = PlaceAttributes.filter((item) => item.DISTRICT === value);
    const uniqueTehsils = Array.from(new Map(items.map(item => [item.TEHSIL, item])).values());
    setTehsilList(uniqueTehsils);
    setSelectedTehsil('');
    setTehsilSelectedItem(null);
    setSelectedMapData(null);

    const filteredDistrictFeatures = indiaTehsilsFiltered.features.filter(
      (feature) => feature.properties.DISTRICT === value &&
        feature.properties.STATE === items[0]?.STATE
    );

    setFilteredIndiaDistrict({
      type: "FeatureCollection",
      features: filteredDistrictFeatures,
    });
  };

  const handleTehsilSelect = (value) => {
    setSelectedTehsil(value);
    const item = tehsilList.find((item) => item.TEHSIL === value);
    setTehsilSelectedItem(item);
    setSelectedMapData(null);
    setSelectedVariable(null);
  };

  const handleMapDataSelect = (value) => {
    const data = MapDatasetOptions.find(item => item.DataValue === value);
    setSelectedMapData(data);
    setSelectedVariable(null);
    setShowTimeseries(false);
  };

  const handleVariableSelect = (value) => {
    if (!selectedMapData || !tehsilSelectedItem) return;
   
    const variable = selectedMapData.variables.find(v => v.value === value);
    if (!variable) return;

    const tehsilData = selectedMapData.Data?.find(
      item => item.ID === tehsilSelectedItem?.ID
    );
    if (tehsilData && tehsilData[variable.value]) {
      setSelectedVariable(variable);
    } else {
      setShowTimeseries(false);
    }
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
    }
    return {
      fillColor: "rgba(0, 0, 0, 0.00001)",
      weight: 2,
      color: 'red',
      fillOpacity: 0.00001
    };
  };

  const renderStateBoundaries = () => {
    return indiaStates.features.map((feature, featureIndex) => {
      if (feature.geometry.type === "MultiPolygon") {
        return feature.geometry.coordinates.map((polygon, polygonIndex) => {
          const coordinates = polygon[0].map(coord => ({
            latitude: coord[1],
            longitude: coord[0],
          }));

          return (
            <Polygon
              key={`${featureIndex}-${polygonIndex}`}
              coordinates={coordinates}
              strokeColor="black"
              strokeWidth={1}
              fillColor="transparent"
            />
          );
        });
      }

      if (feature.geometry.type === "Polygon") {
        const coordinates = feature.geometry.coordinates[0].map(coord => ({
          latitude: coord[1],
          longitude: coord[0],
        }));

        return (
          <Polygon
            key={featureIndex}
            coordinates={coordinates}
            strokeColor="black"
            strokeWidth={1}
            fillColor="transparent"
          />
        );
      }

      return null;
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Selection Controls */}
        <View style={styles.selectionContainer}>
          {/* 1. Select District */}
          <Text style={styles.label}>{t('data.select_district')}</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedDistrict}
              style={styles.picker}
              onValueChange={handleDistrictSelect}
            >
              <Picker.Item label={t('data.select_placeholder')} value="" />

            {[...new Set(PlaceAttributes.map(i => i.DISTRICT))]
              .filter(d => d !== "BARAN" && d !== "USMANABAD") // 🚀 Filter out these items
              .map((d, idx) => (
              <Picker.Item key={idx} label={t(`location.${d}`)} value={d} />
            ))}

            </Picker>
          </View>

          {/* 2. Select Block */}
          <Text style={styles.label}>{t('data.select_block')}</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedTehsil}
              enabled={!!selectedDistrict}
              style={[styles.picker, !selectedDistrict && styles.disabledPicker]}
              onValueChange={handleTehsilSelect}
            >
              <Picker.Item label={t('data.select_placeholder')} value="" />
              {tehsilList.map((item, idx) => (
                <Picker.Item
                  key={idx}
                  label={t(`location.${item.TEHSIL}`)}
                  value={item.TEHSIL}
                />
              ))}
            </Picker>
          </View>

          {/* 3. Select Data */}
          <Text style={styles.label}>{t('dashboard.select_data')}</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedMapData?.DataValue || ''}
              enabled={!!selectedTehsil}
              style={[styles.picker, !selectedTehsil && styles.disabledPicker]}
              onValueChange={handleMapDataSelect}
            >
              <Picker.Item label={t('data.select_placeholder')} value="" />
              {MapDatasetOptions.map((data) => (
                <Picker.Item
                  key={data.DataValue}
                  label={t(`dashboard.${data.DataName}`)}
                  value={data.DataValue}
                />
              ))}
            </Picker>
          </View>

          {/* 4. Select Parameter */}
          <Text style={styles.label}>{t('dashboard.select_parameter')}</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedVariable?.value || ''}
              enabled={!!selectedMapData}
              style={[styles.picker, !selectedMapData && styles.disabledPicker]}
              onValueChange={handleVariableSelect}
            >
              <Picker.Item label={t('data.select_placeholder')} value="" />
              {selectedMapData?.variables?.map(v => (
                <Picker.Item
                  key={v.value}
                  label={`${t(`dashboard.${v.name}`)} (${v.unit})`}
                  value={v.value}
                />
              ))}
            </Picker>
          </View>

          <TouchableOpacity
            style={[
              styles.toggleButton,
              (!selectedDistrict || !selectedTehsil || !selectedMapData || !selectedVariable) && styles.buttonDisabled
            ]}
            onPress={() => setShowTimeseries(!showTimeseries)}
            disabled={
              !selectedDistrict || !selectedTehsil || !selectedMapData || !selectedVariable
            }
          >
            <Text style={styles.buttonText}>
              {showTimeseries
                ? t('dashboard.hide_timeseries')
                : t('dashboard.show_timeseries')}
            </Text>
          </TouchableOpacity>
        </View>


        {/* Timeseries Charts */}
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


        {/* Map Container */}
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
              renderStateBoundaries()
            )}
          </BaseMap>
        </View>

        
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 30,
  },
  selectionContainer: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 6,
    marginTop: 12,
    color: '#333',
  },
  pickerContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 12,
    elevation: 2,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
  disabledPicker: {
    opacity: 0.5,
  },
  mapContainer: {
    height: 500,
    backgroundColor: '#eaeaea',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 16,
  },
  toggleButton: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#cccccc',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    textAlign: 'center',
  },
  timeseriesContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 5,
    marginBottom: 16,
  },
});