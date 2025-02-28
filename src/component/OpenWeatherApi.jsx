import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View, Image, ScrollView } from 'react-native'
import axios from 'axios'
// import { currentWeatherData } from "../assets/weatherapiData/openWeather"
// import { forecastData } from "../assets/weatherapiData/openWeather"

// Import weather icons
const weatherIcons = {
  humidity: require('../../assets/weather-icons/humidity.png'),
  temp: require('../../assets/weather-icons/thermometer-1-2.png'),
  minTemp: require('../../assets/weather-icons/thermometer-0.png'),
  maxTemp: require('../../assets/weather-icons/thermometer-full.png'),
  windPressure: require('../../assets/weather-icons/wind-pressure.png'),
  visibility: require('../../assets/weather-icons/visibility.png'),
  feelsLike: require('../../assets/weather-icons/feels-like.png'),
  location: require('../../assets/weather-icons/location.png'),
  wind: require('../../assets/weather-icons/wind.png'),
  sunrise: require('../../assets/weather-icons/sunrise.png'),
  sunset: require('../../assets/weather-icons/sunset.png'),
};

const OpenWeatherApi = ({ panchyatSelectedItem }) => {
  const [forecastData, setForecastData] = useState(null)
  const [currentWeatherData, setCurrentWeatherData] = useState(null)

  const fetchCurrentWeatherData = async (selectedItem) => {
    if (selectedItem && selectedItem.LAT) {
      const lat = selectedItem.LAT;
      const lon = selectedItem.LONG;
      const apiKey = process.env.EXPO_PUBLIC_OPENWEATHER_API_KEY;
      try {
        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
        const response = await axios.get(apiUrl);
        if (response.data) {
          setCurrentWeatherData(response.data);
        }
      } catch (error) {
        console.error("Error fetching current weather:", error);
      }
    }
  };

  const fetchForecastWeatherData = async (selectedItem) => {
    if (selectedItem && selectedItem.LAT) {
      const lat = selectedItem.LAT;
      const lon = selectedItem.LONG;
      const apiKey = process.env.EXPO_PUBLIC_OPENWEATHER_API_KEY;
      try {
        const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
        const response = await axios.get(apiUrl);
        if (response.data) {
          setForecastData(response.data);
        }
      } catch (error) {
        console.error("Error fetching forecast:", error);
      }
    }
  };

  useEffect(() => {
    if (panchyatSelectedItem && panchyatSelectedItem.LAT) {
      fetchCurrentWeatherData(panchyatSelectedItem);
      fetchForecastWeatherData(panchyatSelectedItem);
    }
  }, [panchyatSelectedItem]);

  const formatForecastDateTime = (timestamp, timezone) => {
    const date = new Date((timestamp + timezone) * 1000);
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'long' });
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${day} ${month}, ${hours}:${minutes}`;
  };

  if (!currentWeatherData || !currentWeatherData.main) {
    return (
      <View style={styles.placeholder}>
        <Text>Loading weather data...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.cardHeading}>
        <Text style={styles.headingText}>Current Weather</Text>
      </View>

      <View style={styles.mainContainer}>
        <View style={styles.weatherCard}>
          <Image 
            source={{ uri: `https://openweathermap.org/img/wn/${currentWeatherData.weather[0].icon}.png` }}
            style={styles.weatherIcon}
          />
          <View style={styles.weatherContent}>
            <Text style={styles.weatherText}>
              {currentWeatherData.weather[0].main}, {currentWeatherData.weather[0].description}
            </Text>
            <Text style={styles.weatherValue}>
              {formatForecastDateTime(currentWeatherData.dt, currentWeatherData.timezone)}
            </Text>
          </View>
        </View>

        <View style={styles.weatherCard}>
          <Image style={styles.icon} source={weatherIcons.location} />
          <View style={styles.weatherContent}>
            <Text style={styles.weatherText}>Location</Text>
            <Text style={styles.weatherValue}>
              {panchyatSelectedItem.PANCHAYAT}, {panchyatSelectedItem.DISTRICT}
            </Text>
          </View>
        </View>

        <View style={styles.weatherCard}>
          <Image style={styles.icon} source={weatherIcons.temp} />
          <View style={styles.weatherContent}>
            <Text style={styles.weatherText}>Temperature</Text>
            <Text style={styles.weatherValue}>{currentWeatherData.main.temp} °C</Text>
          </View>
        </View>

        <View style={styles.weatherCard}>
          <Image style={styles.icon} source={weatherIcons.feelsLike} />
          <View style={styles.weatherContent}>
            <Text style={styles.weatherText}>Feels Like</Text>
            <Text style={styles.weatherValue}>{currentWeatherData.main.feels_like} °C</Text>
          </View>
        </View>

        <View style={styles.weatherCard}>
          <Image style={styles.icon} source={weatherIcons.minTemp} />
          <View style={styles.weatherContent}>
            <Text style={styles.weatherText}>Min Temp</Text>
            <Text style={styles.weatherValue}>{currentWeatherData.main.temp_min} °C</Text>
          </View>
        </View>

        <View style={styles.weatherCard}>
          <Image style={styles.icon} source={weatherIcons.maxTemp} />
          <View style={styles.weatherContent}>
            <Text style={styles.weatherText}>Max Temp</Text>
            <Text style={styles.weatherValue}>{currentWeatherData.main.temp_max} °C</Text>
          </View>
        </View>
      </View>

      <View style={styles.cardHeading}>
        <Text style={styles.headingText}>3 Hour Forecast (5 days)</Text>
      </View>

      {forecastData && forecastData.list.length > 0 ? (
        <ScrollView horizontal style={styles.forecastContainer}>
          {forecastData.list.map((item, index) => (
            <View key={index} style={styles.forecastCard}>
              <View style={styles.weatherCard}>
                <Image 
                  source={{ uri: `https://openweathermap.org/img/wn/${item.weather[0].icon}.png` }}
                  style={styles.weatherIcon}
                />
                <View style={styles.weatherContent}>
                  <Text style={styles.weatherText}>
                    {item.weather[0].main}, {item.weather[0].description}
                  </Text>
                  <Text style={styles.weatherValue}>
                    {formatForecastDateTime(item.dt, forecastData.city.timezone)}
                  </Text>
                </View>
              </View>

              <View style={styles.weatherCard}>
                <Image style={styles.icon} source={weatherIcons.temp} />
                <View style={styles.weatherContent}>
                  <Text style={styles.weatherText}>Temperature</Text>
                  <Text style={styles.weatherValue}>{item.main.temp} °C</Text>
                </View>
              </View>

              <View style={styles.weatherCard}>
                <Image style={styles.icon} source={weatherIcons.windPressure} />
                <View style={styles.weatherContent}>
                  <Text style={styles.weatherText}>Pressure</Text>
                  <Text style={styles.weatherValue}>{item.main.pressure} hPa</Text>
                </View>
              </View>

              <View style={styles.weatherCard}>
                <Image style={styles.icon} source={weatherIcons.humidity} />
                <View style={styles.weatherContent}>
                  <Text style={styles.weatherText}>Humidity</Text>
                  <Text style={styles.weatherValue}>{item.main.humidity} %</Text>
                </View>
              </View>

              <View style={styles.weatherCard}>
                <Image style={styles.icon} source={weatherIcons.minTemp} />
                <View style={styles.weatherContent}>
                  <Text style={styles.weatherText}>Min Temp</Text>
                  <Text style={styles.weatherValue}>{item.main.temp_min} °C</Text>
                </View>
              </View>

              <View style={styles.weatherCard}>
                <Image style={styles.icon} source={weatherIcons.feelsLike} />
                <View style={styles.weatherContent}>
                  <Text style={styles.weatherText}>Feels Like</Text>
                  <Text style={styles.weatherValue}>{item.main.feels_like} °C</Text>
                </View>
              </View>

              <View style={styles.weatherCard}>
                <Image style={styles.icon} source={weatherIcons.visibility} />
                <View style={styles.weatherContent}>
                  <Text style={styles.weatherText}>Visibility</Text>
                  <Text style={styles.weatherValue}>{(item.visibility / 1000).toFixed(2)} km</Text>
                </View>
              </View>

              <View style={styles.weatherCard}>
                <Image style={styles.icon} source={weatherIcons.maxTemp} />
                <View style={styles.weatherContent}>
                  <Text style={styles.weatherText}>Max Temp</Text>
                  <Text style={styles.weatherValue}>{item.main.temp_max} °C</Text>
                </View>
              </View>

              <View style={styles.weatherCard}>
                <Image style={styles.icon} source={weatherIcons.wind} />
                <View style={styles.weatherContent}>
                  <Text style={styles.weatherText}>Wind Speed</Text>
                  <Text style={styles.weatherValue}>{(item.wind.speed * 3.6).toFixed(2)} km/h</Text>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
      ) : (
        <View style={styles.rightPanelContainer}>
          <Text>Please select a location.</Text>
        </View>
      )}
    </ScrollView>
  );
};

export default OpenWeatherApi;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  placeholder: {
    padding: 20,
    alignItems: 'center',
  },
  cardHeading: {
    padding: 15,
    backgroundColor: '#f5f5f5',
  },
  headingText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  mainContainer: {
    padding: 10,
  },
  weatherCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  weatherIcon: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  icon: {
    width: 25,
    height: 25,
    marginRight: 10,
  },
  weatherContent: {
    flex: 1,
  },
  weatherText: {
    fontSize: 16,
    color: '#666',
  },
  weatherValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  forecastContainer: {
    padding: 10,
    flexDirection: 'row',
  },
  forecastCard: {
    width: 300,
    marginRight: 10,
  },
  rightPanelContainer: {
    padding: 20,
    alignItems: 'center',
  },
});