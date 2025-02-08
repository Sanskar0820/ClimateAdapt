import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CartesianChart, Bar, Line } from 'victory-native';
import { yearsArray } from '../helpers/functions';
import { Skia } from "@shopify/react-native-skia";

console.log("SKIA IS ---> ",Skia); // Check if Skia is defined


const AnnualTimeSeriesChart = ({
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
    return <Text>No valid data available for the selected variable.</Text>;
  }

  const chartData = yearsArray.map((year, index) => ({
    year,
    value: filteredData[selectedVariable.value][index] || 0,
    trendline: filteredData[`${selectedVariable.value}_trendline`]?.[index] || 0,
  }));

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {selectedDistrict} - {selectedTehsil}
      </Text>
      <Text style={styles.subtitle}>
        {`${selectedVariable.name} (${selectedVariable.unit})`}
        {`\nChange: ${filteredData[`${selectedVariable.value}_change`] || 0}%, h: ${
          filteredData[`${selectedVariable.value}_h`] || 0
        }`}
      </Text>

      <CartesianChart
        data={chartData}
        xKey="year"
        yKeys={['value', 'trendline']}
        domainPadding={{ left: 20, right: 20 }}
        padding={{ left: 60, bottom: 50, top: 20, right: 20 }}
        xAxis={[
          {
            label: 'Years',
            labelOffset: 30,
          },
        ]}
        yAxis={[
          {
            label: `${selectedVariable.name} (${selectedVariable.unit})`,
            labelOffset: 40,
          },
        ]}
      >
        {({ points, chartBounds }) => (
          <>
            <Bar
              points={points.value}
              chartBounds={chartBounds}
              color="#4299E1"
            />
            <Line
              points={points.trendline}
              chartBounds={chartBounds}
              color="red"
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

export default AnnualTimeSeriesChart;
