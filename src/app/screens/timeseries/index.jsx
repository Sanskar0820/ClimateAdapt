import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, ScrollView, Picker, Dimensions } from 'react-native';
import Plotly from 'react-native-plotly';
import PlaceAttributes from '../../../../assets/PlaceAttributes.json';
import Header from '../../../component/Header';
import { useLoader } from '../../../context/LoaderContext';

const TimeseriesScreen = () => {
  const [startYear, setStartYear] = useState(null);
  const [endYear, setEndYear] = useState(null);
  const [selectedSession, setSelectedSession] = useState(null);
  const [tehsilList, setTehsilList] = useState([]);
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
    let items = PlaceAttributes.filter((item) => item.DISTRICT === value);
    items = [...new Set(items.map((item) => item))];
    items.sort();
    setTehsilList(items);
  };

  const handleTehsilSelect = (value) => {
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
      <Plotly
        data={[
          {
            x: plotData.map(entry => entry.year),
            y: plotData.map(entry => entry.value),
            type: 'scatter',
            mode: 'lines+markers',
            marker: { color: 'red' },
          },
        ]}
        layout={{
          width: screenWidth - 40,
          height: 220,
          title: 'Drought Time Series',
          xaxis: { title: 'Year' },
          yaxis: { title: 'Drought Value' },
        }}
        style={{ marginVertical: 8, borderRadius: 16 }}
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
            <Picker.Item label="Select District" value="" />
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
            <Picker.Item label="Select Tehsil" value="" />
            {tehsilList.map((item, index) => (
              <Picker.Item key={index} label={item.TEHSIL} value={item.TEHSIL} />
            ))}
          </Picker>

          <Text style={styles.label}>Select Start Year</Text>
          <Picker
            selectedValue={startYear}
            style={styles.picker}
            onValueChange={(value) => setStartYear(value)}
          >
            <Picker.Item label="Select Start Year" value="" />
            {Array.from({ length: 2020 - 1900 }, (_, index) => `${1901 + index}`).map((year, index) => (
              <Picker.Item key={index} label={year} value={year} />
            ))}
          </Picker>

          <Text style={styles.label}>Select End Year</Text>
          <Picker
            selectedValue={endYear}
            style={styles.picker}
            onValueChange={(value) => setEndYear(value)}
          >
            <Picker.Item label="Select End Year" value="" />
            {Array.from({ length: 2020 - 1900 }, (_, index) => `${1901 + index}`).map((year, index) => (
              <Picker.Item key={index} label={year} value={year} />
            ))}
          </Picker>

          <Text style={styles.label}>Select Session</Text>
          <Picker
            selectedValue={selectedSession}
            style={styles.picker}
            onValueChange={(value) => setSelectedSession(value)}
          >
            <Picker.Item label="Select Session" value="" />
            {["Summer Monsoon", "Winter Monsoon", "Calendar Year", "Water Year"].map((session, index) => (
              <Picker.Item key={index} label={session} value={session} />
            ))}
          </Picker>
        </View>

        <View style={styles.chartContainer}>
          {renderChart()}
        </View>
      </ScrollView>
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
  picker: {
    backgroundColor: '#fff',
    marginBottom: 16,
    height: 50,
    borderRadius: 8,
  },
  chartContainer: {
    padding: 20,
    alignItems: 'center',
  },
});

export default TimeseriesScreen; 