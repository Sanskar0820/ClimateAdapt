import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CartesianChart, Bars } from 'victory-native';
import { yearsArray } from '../helpers/functions';

const ExtremesConditionsCharts = ({
  selectedDistrict,
  selectedTehsil,
  selectedMapData,
  selectedTehsilID,
  selectedVariable,
}) => {
  if (!selectedMapData || !selectedMapData.Data) {
    return <Text>No data available.</Text>;
  }

  const filteredData = selectedMapData.Data.find(
    (item) => item.ID === selectedTehsilID
  );

  if (!filteredData || !filteredData[selectedVariable.value]) {
    return <Text>No valid data for the selected variable.</Text>;
  }

  const chartData = yearsArray.map((year, index) => ({
    year,
    frequency: filteredData[selectedVariable.value]?.[index] || 0, // Ensure no undefined values
  }));

  const getTitle = () => {
    if (selectedVariable.value === 'pcp') {
      return 'Frequency of extreme precipitation (exceeding 95th percentile rainy days threshold)';
    } else if (selectedVariable.value === 'temp') {
      return 'Frequency of extreme temperature (exceeding 95th percentile threshold of temperature for March-May)';
    }
    return 'Extreme Conditions Frequency';
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {selectedDistrict} - {selectedTehsil}
      </Text>
      <Text style={styles.subtitle}>{getTitle()}</Text>

      <CartesianChart
        data={chartData}
        xKey="year"
        domainPadding={{ left: 20, right: 20 }}
        padding={{ left: 60, bottom: 50, top: 20, right: 20 }}
        xAxis={{
          label: 'Years',
          labelOffset: 30,
        }}
      >
        {({ points, chartBounds }) => {
          if (!points || !points.frequency) {
            return <Text>No chart data available.</Text>; // Prevent undefined errors
          }

          return (
            <Bars
              points={points.frequency} // Corrected points reference
              chartBounds={chartBounds}
              color="#4299E1"
              barWidth={8}
            />
          );
        }}
      </CartesianChart>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
    textAlign: 'center',
  },
});

export default ExtremesConditionsCharts;
