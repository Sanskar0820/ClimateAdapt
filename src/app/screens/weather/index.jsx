import { StyleSheet, Text, View, SafeAreaView, ScrollView } from 'react-native';
import React, { useState } from 'react';
import Header from '../../../component/Header';
import { Picker } from '@react-native-picker/picker';
import weatherPlaces from '../../../../assets/weatherPlaces.json';
import OpenWeatherApi from '../../../component/OpenWeatherApi';
import TomorrowApi from '../../../component/TomorrowApi';
import AccuWeatherApi from '../../../component/AccWeatherApi';
import { useTranslation } from 'react-i18next';

const WeatherScreen = () => {
  const { t } = useTranslation();
  const [selectedApi, setSelectedApi] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedTehsil, setSelectedTehsil] = useState(null);
  const [selectedPanchyat, setSelectedPanchyat] = useState(null);
  const [panchyatSelectedItem, setPanchyatSelectedItem] = useState(null);
  const [tehsilList, setTehsilList] = useState([]);
  const [panchyatList, setPanchyatList] = useState([]);

  const handleDistrictSelect = (value) => {
    let items = weatherPlaces.filter((item) => item.DISTRICT === value);
    items = [...new Set(items.map((item) => item))];
    items.sort();

    setTehsilList(items);
    setSelectedDistrict(value);
    setSelectedTehsil(null);
    setSelectedPanchyat(null);
    setPanchyatSelectedItem(null);
  };

  const handleTehsilSelect = (value) => {
    setSelectedTehsil(value);
    let items = weatherPlaces.filter((item) => item.BLOCK === value);
    items = [...new Set(items.map((item) => item))];
    items.sort();
    setPanchyatList(items);
    setSelectedPanchyat(null);
    setPanchyatSelectedItem(null);
  };

  const handlePanchyatSelect = (value) => {
    setSelectedPanchyat(value);
    let item = panchyatList.find((item) => item.PANCHAYAT === value);
    setPanchyatSelectedItem(item);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <ScrollView style={styles.content}>
        <View style={styles.selectionContainer}>
          <Text style={styles.label}>{t('data.select_district')}</Text>
          <Picker
            selectedValue={selectedDistrict}
            style={styles.picker}
            onValueChange={handleDistrictSelect}
          >
            <Picker.Item label={t('data.select_placeholder')} value="" />
            {[...new Set(weatherPlaces.map((item) => item.DISTRICT))].map((district, index) => (
              <Picker.Item key={index} label={t(`location.${district}`)} value={district} />
            ))}
          </Picker>

          <Text style={styles.label}>{t('data.select_block')}</Text>
          <Picker
            selectedValue={selectedTehsil}
            style={styles.picker}
            enabled={tehsilList.length > 0}
            onValueChange={handleTehsilSelect}
          >
            <Picker.Item label={t('data.select_placeholder')} value="" />
            {[...new Set(tehsilList.map((item) => item.BLOCK))].map((block, index) => (
              <Picker.Item key={index} label={t(`location.${block}`)} value={block} />
            ))}
          </Picker>

          <Text style={styles.label}>{t('data.select_panchayat')}</Text>
          <Picker
            selectedValue={selectedPanchyat}
            style={styles.picker}
            enabled={panchyatList.length > 0}
            onValueChange={handlePanchyatSelect}
          >
            <Picker.Item label={t('data.select_placeholder')} value="" />
            {[...new Set(panchyatList.map((item) => ({
              key: item.PANCHAYAT,
              label: t(`location.${item.PANCHAYAT}`) // Fetching translations
            })))].map((item, index) => (
              <Picker.Item key={index} label={item.label} value={item.key} />
            ))}
          </Picker>

          <Text style={styles.label}>{t('data.select_api')}</Text>
          <Picker
            selectedValue={selectedApi}
            style={styles.picker}
            onValueChange={(value) => setSelectedApi(value)}
          >
            <Picker.Item label={t('data.select_placeholder')} value="" />
            <Picker.Item label="Tomorrow.io API" value="tomorrow" />
            <Picker.Item label="Accuweather API" value="accuweather" />
            <Picker.Item label="Open Weather API" value="open_weather" />
          </Picker>
        </View>

        <View style={styles.apiContainer}>
          {panchyatSelectedItem ? (
            <>
              {selectedApi === "accuweather" ? (
                <AccuWeatherApi panchyatSelectedItem={panchyatSelectedItem} />
              ) : selectedApi === "open_weather" ? (
                <OpenWeatherApi panchyatSelectedItem={panchyatSelectedItem} />
              ) : selectedApi === "tomorrow" ? (
                <TomorrowApi panchyatSelectedItem={panchyatSelectedItem} />
              ) : (
                <Text style={styles.placeholder}>{t('data.select_api_placeholder')}</Text>
              )}
            </>
          ) : (
            <Text style={styles.placeholder}>{t('data.select_location_placeholder')}</Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default WeatherScreen;

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
  apiContainer: {
    padding: 20,
  },
  placeholder: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
  }
});
