import React, { useState } from 'react';
import { View, Text, Dimensions, StyleSheet, ScrollView, TouchableWithoutFeedback } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { daysInYear } from '../helpers/functions';

const screenWidth = Dimensions.get('window').width;

const ClimatologyTimeSeriesChart = ({
  selectedDistrict,
  selectedTehsil,
  selectedMapData,
  selectedTehsilID,
  selectedVariable,
}) => {
  const [selectedIndex, setSelectedIndex] = useState(null);

  if (!selectedMapData || !selectedMapData.Data) return <Text>No data available.</Text>;

  const filteredData = selectedMapData.Data.find(item => item.ID === selectedTehsilID);
  if (!filteredData || !filteredData[selectedVariable.value]) {
    return <Text>No valid data for the selected variable.</Text>;
  }

  const climatology = daysInYear.map((_, i) => filteredData[selectedVariable.value][i] || 0);
  const standardDeviation = daysInYear.map((_, i) => {
    const base = filteredData[selectedVariable.value][i] || 0;
    const sd = filteredData[`${selectedVariable.value}_SD`]?.[i] || 0;
    return base + sd;
  });
  const currentYear = daysInYear.map((_, i) => filteredData[`daily_${selectedVariable.value}_2024`]?.[i] || 0);

  const maxLabels = 10;
  const interval = Math.ceil(daysInYear.length / (maxLabels - 1));
  const spacedLabels = daysInYear.map((day, index) =>
    index % interval === 0 || index === daysInYear.length - 1 ? String(day) : ''
  );

  const handleDataPointClick = ({ index }) => {
    setSelectedIndex(index);
  };

  return (
    <ScrollView horizontal>
      <View style={styles.container}>
        <Text style={styles.title}>{selectedDistrict} - {selectedTehsil}</Text>
        <Text style={styles.subtitle}>{`${selectedVariable.name} (${selectedVariable.unit})`}</Text>

        <TouchableWithoutFeedback onPressOut={() => setSelectedIndex(null)}>
          <LineChart
            data={{
              labels: spacedLabels,
              datasets: [
                {
                  data: climatology,
                  color: () => 'blue',
                  strokeWidth: 2,
                },
                {
                  data: standardDeviation,
                  color: () => 'rgba(0, 200, 0, 0.3)',
                  strokeWidth: 1,
                },
                {
                  data: currentYear,
                  color: () => 'red',
                  strokeWidth: 2,
                },
              ],
            }}
            width={screenWidth}
            height={260}
            chartConfig={{
              backgroundColor: '#fff',
              backgroundGradientFrom: '#fff',
              backgroundGradientTo: '#fff',
              decimalPlaces: 1,
              color: () => '#333',
              labelColor: () => '#333',
              propsForDots: {
                r: '0',
                strokeWidth: '0',
                stroke: 'transparent',
              },
              propsForBackgroundLines: {
                stroke: '#e3e3e3',
              },
            }}
            withShadow={false}
            withInnerLines={false}
            withOuterLines={false}
            bezier
            onDataPointClick={handleDataPointClick}
            style={styles.chartStyle}
          />
        </TouchableWithoutFeedback>

        {selectedIndex !== null && (
          <View style={styles.tooltip}>
            <Text style={styles.tooltipText}>
              Day: {daysInYear[selectedIndex]}{'\n'}
              {selectedVariable.name}: {climatology[selectedIndex]} {selectedVariable.unit}{'\n'}
              Current: {currentYear[selectedIndex]}{'\n'}
              +SD: {standardDeviation[selectedIndex]}
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    margin: 10,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 10,
  },
  chartStyle: {
    borderRadius: 8,
  },
  tooltip: {
    marginTop: 10,
    backgroundColor: '#f2f2f2',
    padding: 10,
    borderRadius: 8,
    alignSelf: 'center',
  },
  tooltipText: {
    fontSize: 14,
    color: '#333',
    fontFamily: 'monospace',
  },
});

export default ClimatologyTimeSeriesChart;
