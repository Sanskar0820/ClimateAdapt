import { StyleSheet, Text, View, SafeAreaView, ScrollView } from 'react-native'
import React, { useState, useEffect } from 'react'
import Header from '../../../component/Header'
import { Picker } from '@react-native-picker/picker'
import { LineChart } from 'react-native-chart-kit'
import { useLoader } from '../../../context/LoaderContext'
import PlaceAttributes from '../../../../assets/PlaceAttributes.json'
import { Dimensions } from 'react-native'
// import { Button } from '@rneui/themed'

const TimeseriesScreen = () => {
  const [startYear, setStartYear] = useState(null);
  const [endYear, setEndYear] = useState(null);
  const [selectedSession, setSelectedSession] = useState(null);
  const [tehsilList, setTehsilList] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedTehsil, setSelectedTehsil] = useState('');
  const [tehsilSelectedItem, setTehsilSelectedItem] = useState([]);
  const [selectedData, setSelectedData] = useState(null);
  const [droughtArea, setDroughtArea] = useState(null);
  const [droughtIntensity, setDroughtIntensity] = useState(null);
  const { setIsLoading } = useLoader();

  const screenWidth = Dimensions.get('window').width;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const droughtAreaResponse = await fetch('https://wcl-iitgn.github.io/india-drought-atlas-data/Area.json');
        const droughtArea = await droughtAreaResponse.json();

        const droughtIntensityResponse = await fetch('https://wcl-iitgn.github.io/india-drought-atlas-data/Intensity.json');
        const droughtIntensity = await droughtIntensityResponse.json();

        setDroughtArea(droughtArea);
        setDroughtIntensity(droughtIntensity);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedSession && startYear && endYear && tehsilSelectedItem.length > 0) {
      const fetchData = async () => {
        try {
          setIsLoading(true);
          const formattedSession = selectedSession.replace(/\s+/g, '_');
          const response = await fetch(`https://wcl-iitgn.github.io/india-drought-atlas-data/${formattedSession}.json`);
          const droughtData = await response.json();
          const filteredDroughtData = droughtData.filter(data => data.ID === tehsilSelectedItem[0].ID.toString());
          setSelectedData(filteredDroughtData);
          setIsLoading(false);
        } catch (error) {
          console.error("Error fetching data:", error);
          setIsLoading(false);
        }
      };
      fetchData();
    }
  }, [selectedSession, startYear, endYear, tehsilSelectedItem]);

  const handleDistrictSelect = (value) => {
    setSelectedDistrict(value);
    let items = PlaceAttributes.filter((item) => item.DISTRICT === value);
    items = [...new Set(items.map((item) => item))];
    items.sort();
    setTehsilList(items);
  };

  const handleTehsilSelect = (value) => {
    setSelectedTehsil(value);
    let item = tehsilList.filter((item) => item.TEHSIL === value);
    setTehsilSelectedItem(item);
  };

  const renderChart = () => {
    if (!selectedData || selectedData.length === 0) return null;

    const plotData = Object.entries(selectedData[0])
      .filter(([key, value]) => key !== "ID" && parseInt(key) >= startYear && parseInt(key) <= endYear)
      .map(([year, droughtValue]) => ({
        year: parseInt(year),
        value: parseFloat(droughtValue),
      }));

    return (
      <LineChart
        data={{
          labels: plotData.map(d => d.year.toString()),
          datasets: [{
            data: plotData.map(d => d.value)
          }]
        }}
        width={screenWidth - 40}
        height={220}
        chartConfig={{
          backgroundColor: '#fff',
          backgroundGradientFrom: '#fff',
          backgroundGradientTo: '#fff',
          decimalPlaces: 2,
          color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`,
          style: {
            borderRadius: 16
          }
        }}
        style={{
          marginVertical: 8,
          borderRadius: 16
        }}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <ScrollView style={styles.content}>
        <View style={styles.selectionContainer}>
          <Text style={styles.label}>Select District</Text>
          <Picker
            selectedValue={selectedDistrict}
            style={styles.picker}
            onValueChange={handleDistrictSelect}
          >
            <Picker.Item label="Select" value="" />
            {[...new Set(PlaceAttributes.map((item) => item.DISTRICT))].map((item, index) => (
              <Picker.Item key={index} label={item} value={item} />
            ))}
          </Picker>

          <Text style={styles.label}>Select Tehsil</Text>
          <Picker
            selectedValue={selectedTehsil}
            style={styles.picker}
            enabled={tehsilList.length > 0}
            onValueChange={handleTehsilSelect}
          >
            <Picker.Item label="Select" value="" />
            {tehsilList.map((item, index) => (
              <Picker.Item key={index} label={item.TEHSIL} value={item.TEHSIL} />
            ))}
          </Picker>

          {/* Add more selection components */}
        </View>

        <View style={styles.chartContainer}>
          {renderChart()}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default TimeseriesScreen;

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
  chartContainer: {
    padding: 20,
    alignItems: 'center',
  }
}); 