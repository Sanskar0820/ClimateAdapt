import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CartesianChart, Line, Area } from 'victory-native';
import { daysInYear } from '../helpers/functions';

const ClimatologyTimeSeriesChart = ({
  selectedDistrict,
  selectedTehsil,
  selectedMapData,
  selectedTehsilID,
  selectedVariable,
}) => {
  console.log('Rendering ClimatologyTimeSeriesChart');
  console.log('Props:', {
    selectedDistrict,
    selectedTehsil,
    selectedMapData,
    selectedTehsilID,
    selectedVariable,
  });

  if (!selectedMapData || !selectedMapData.Data) {
    return <Text>No data available.</Text>;
  }

  const filteredData = selectedMapData.Data.find(
    (item) => item.ID === selectedTehsilID
  );

  if (!filteredData || !filteredData[selectedVariable.value]) {
    return <Text>No valid data for the selected variable.</Text>;
  }

  const chartData = daysInYear.map((day, index) => ({
    day,
    value: filteredData[selectedVariable.value][index] || 0,
    sd: filteredData[`${selectedVariable.value}_SD`]?.[index] || 0,
    current: filteredData[`daily_${selectedVariable.value}_2024`]?.[index] || 0,
  }));

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {selectedDistrict} - {selectedTehsil}
      </Text>
      <Text style={styles.subtitle}>
        {`${selectedVariable.name} (${selectedVariable.unit})`}
      </Text>

      <CartesianChart
        data={chartData}
        xKey="day"
        domainPadding={{ left: 20, right: 20 }}
        padding={{ left: 60, bottom: 50, top: 20, right: 20 }}
        xAxis={{
          label: 'Days',
          labelOffset: 30,
        }}
      >
        {({ points, chartBounds }) => (
          <>
            {/* Main Climatology Line */}
            <Line
              points={points.value}
              chartBounds={chartBounds}
              color="blue"
              strokeWidth={2}
            />

            {/* Standard Deviation Area */}
            <Area
              points={points.sd}
              chartBounds={chartBounds}
              color="green"
              opacity={0.3}
            />

            {/* Current Year Data */}
            <Line
              points={points.current}
              chartBounds={chartBounds}
              color="red"
              strokeWidth={2}
            />
          </>
        )}
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

export default ClimatologyTimeSeriesChart;
