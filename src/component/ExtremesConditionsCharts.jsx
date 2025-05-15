import React from 'react';
import { View, Text, Dimensions, StyleSheet, ScrollView } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { yearsArray } from '../helpers/functions';

const screenWidth = Dimensions.get('window').width;

const ExtremesConditionsCharts = ({
  selectedDistrict,
  selectedTehsil,
  selectedMapData,
  selectedTehsilID,
  selectedVariable,
}) => {
  if (!selectedMapData || !selectedMapData.Data) return null;

  const filteredData = selectedMapData.Data.find(item => item.ID === selectedTehsilID);
  if (!filteredData || !filteredData[selectedVariable.value]) return null;

  const frequencyData = yearsArray.map((_, i) => filteredData[selectedVariable.value][i] || 0);

  const maxLabels = 6;
  const totalYears = yearsArray.length;
  const interval = Math.ceil(totalYears / (maxLabels - 1));
  const spacedLabels = yearsArray.map((year, index) =>
    index % interval === 0 || index === totalYears - 1 ? String(year) : ''
  );

  const getTitle = () => {
    if (selectedVariable.value === 'pcp') {
      return 'Frequency of extreme precipitation (95th percentile rainy days)';
    } else if (selectedVariable.value === 'temp') {
      return 'Frequency of extreme temperature (March-May > 95th percentile)';
    }
    return 'Extreme Conditions Frequency';
  };

  const getLegend = () => {
    if (selectedVariable.value === 'pcp') {
      return '95th percentile rainy days';
    } else if (selectedVariable.value === 'temp') {
      return 'March-May > 95th percentile temperature';
    }
    return 'Extreme frequency';
  };

  return (
    <ScrollView horizontal style={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>{selectedDistrict} - {selectedTehsil}</Text>
        <Text style={styles.subtitle}>{getTitle()}</Text>

        <LineChart
          data={{
            labels: spacedLabels,
            datasets: [
              {
                data: frequencyData,
                strokeWidth: 2,
                color: () => '#4287f5',
              },
            ],
            legend: [getLegend()],
          }}
          width={screenWidth * 1.2}
          height={260}
          yAxisLabel=""
          chartConfig={{
            backgroundColor: '#fff',
            backgroundGradientFrom: '#fff',
            backgroundGradientTo: '#fff',
            decimalPlaces: 0,
            color: () => '#4287f5',
            labelColor: () => '#333',
            propsForDots: {
              r: '0', // Hide dots
              strokeWidth: '0',
              stroke: '#4287f5',
            },
            propsForBackgroundLines: {
              stroke: '#fff',
            },
          }}
          bezier
          fromZero
          withDots={false}
          withInnerLines={true}
          withHorizontalLabels={true}
          style={styles.chartStyle}
        />
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
});

export default ExtremesConditionsCharts;
