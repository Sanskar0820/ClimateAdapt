import React, { useState } from 'react';
import { View, Text, Dimensions, StyleSheet, ScrollView, TouchableWithoutFeedback } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { yearsArray } from '../helpers/functions';

const screenWidth = Dimensions.get('window').width;

const AnnualTimeSeriesChart = ({
  selectedDistrict,
  selectedTehsil,
  selectedMapData,
  selectedTehsilID,
  selectedVariable,
}) => {
  const [selectedIndex, setSelectedIndex] = useState(null);

  if (!selectedMapData || !selectedMapData.Data) return null;

  const filteredData = selectedMapData.Data.find(item => item.ID === selectedTehsilID);
  if (!filteredData || !filteredData[selectedVariable.value]) return null;

  const values = yearsArray.map((_, i) => filteredData[selectedVariable.value][i] || 0);
  const trendline = yearsArray.map((_, i) => filteredData[`${selectedVariable.value}_trendline`]?.[i] || 0);

  const maxLabels = 6;
  const totalYears = yearsArray.length;
  const interval = Math.ceil(totalYears / (maxLabels - 1));
  const change = filteredData[`${selectedVariable.value}_change`] || 0;
  const h = filteredData[`${selectedVariable.value}_h`] || 0;
  const spacedLabels = yearsArray.map((year, index) =>
    index % interval === 0 || index === totalYears - 1 ? String(year) : ''
  );

  const handleDataPointClick = ({ index }) => {
    setSelectedIndex(index);
  };

  return (
    <ScrollView horizontal style={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>{selectedDistrict} - {selectedTehsil}</Text>
        <Text style={styles.subtitle}>
          {`${selectedVariable.name} (${selectedVariable.unit})\nChange: ${change}%, h: ${h}`}
        </Text>
        <TouchableWithoutFeedback onPressOut={() => setSelectedIndex(null)}>
          <LineChart
            data={{
              labels: spacedLabels,
              datasets: [
                {
                  data: values,
                  color: () => '#4287f5',
                  strokeWidth: 0,
                  withDots: false
                },
                {
                  data: trendline,
                  color: () => 'red',
                  strokeWidth: 2
                }
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
                stroke: 'transparent'
              },
              propsForBackgroundLines: {
                stroke: 'transparent'
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
              Year: {yearsArray[selectedIndex]}{'\n'}
              {selectedVariable.name}: {values[selectedIndex]} {selectedVariable.unit}{'\n'}
              Trendline: {trendline[selectedIndex]}
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
  scrollContainer: {
    flexDirection: 'row',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
    textAlign: 'center',
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

export default AnnualTimeSeriesChart;
