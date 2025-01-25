import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { VictoryChart, VictoryBar, VictoryLine, VictoryAxis, VictoryLegend } from 'victory-native';
import { yearsArray } from '../helpers/functions';

const AnnualTimeSeriesChart = ({ 
  selectedDistrict, 
  selectedTehsil, 
  selectedMapData, 
  selectedTehsilID, 
  selectedVariable 
}) => {
  const filteredData = selectedMapData.Data.find(item => item.ID === selectedTehsilID);

  const chartData = yearsArray.map((year, index) => ({
    year,
    value: filteredData[selectedVariable.value][index],
    trendline: filteredData[`${selectedVariable.value}_trendline`][index]
  }));

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {selectedDistrict} - {selectedTehsil}
      </Text>
      <Text style={styles.subtitle}>
        {`${selectedVariable.name} (${selectedVariable.unit})`}
        {`\nChange: ${filteredData[`${selectedVariable.value}_change`]}%, h: ${filteredData[`${selectedVariable.value}_h`]}`}
      </Text>

      <VictoryChart
        width={Dimensions.get('window').width - 40}
        height={300}
        padding={{ top: 20, bottom: 50, left: 60, right: 20 }}
      >
        <VictoryAxis
          tickFormat={(t) => t}
          label="Years"
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
        <VictoryBar
          data={chartData}
          x="year"
          y="value"
          style={{
            data: { fill: "#4299E1" }
          }}
        />
        <VictoryLine
          data={chartData}
          x="year"
          y="trendline"
          style={{
            data: { stroke: "red" }
          }}
        />
      </VictoryChart>

      <View style={styles.legend}>
        <VictoryLegend
          orientation="horizontal"
          data={[
            { name: selectedVariable.name, symbol: { fill: "#4299E1" } },
            { name: "Trendline", symbol: { fill: "red" } }
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

export default AnnualTimeSeriesChart; 