import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { VictoryChart, VictoryBar, VictoryLine, VictoryAxis, VictoryLegend } from 'victory-native';
import { daysInYear } from '../helpers/functions';

const ClimatologyTimeSeriesChart = ({ 
  selectedDistrict, 
  selectedTehsil, 
  selectedMapData, 
  selectedTehsilID, 
  selectedVariable 
}) => {
  const filteredData = selectedMapData.Data.find(item => item.ID === selectedTehsilID);

  const chartData = daysInYear.map((day, index) => ({
    day,
    value: filteredData[selectedVariable.value][index],
    sd: filteredData[`${selectedVariable.value}_SD`][index],
    current: filteredData[`daily_${selectedVariable.value}_2024`][index]
  }));

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {selectedDistrict} - {selectedTehsil}
      </Text>
      <Text style={styles.subtitle}>
        {`${selectedVariable.name} (${selectedVariable.unit})`}
      </Text>

      <VictoryChart
        width={Dimensions.get('window').width - 40}
        height={300}
        padding={{ top: 20, bottom: 50, left: 60, right: 20 }}
      >
        <VictoryAxis
          tickFormat={(t) => t}
          label="Days"
          style={{
            axisLabel: { padding: 30 }
          }}
        />
        <VictoryAxis
          dependentAxis
          label={`${selectedVariable.name} (${selectedVariable.unit})`}
          style={{
            axisLabel: { padding: 40 }
          }}
        />
        <VictoryLine
          data={chartData}
          x="day"
          y="value"
          style={{
            data: { stroke: "#4299E1" }
          }}
        />
        <VictoryBar
          data={chartData}
          x="day"
          y="sd"
          style={{
            data: { fill: "purple", opacity: 0.3 }
          }}
        />
        <VictoryLine
          data={chartData}
          x="day"
          y="current"
          style={{
            data: { stroke: "red" }
          }}
        />
      </VictoryChart>

      <View style={styles.legend}>
        <VictoryLegend
          orientation="horizontal"
          data={[
            { name: "Climatology", symbol: { fill: "#4299E1" } },
            { name: "SD", symbol: { fill: "purple", opacity: 0.3 } },
            { name: "2024", symbol: { fill: "red" } }
          ]}
        />
      </View>
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
  legend: {
    alignItems: 'center',
    marginTop: 10,
  }
});

export default ClimatologyTimeSeriesChart; 