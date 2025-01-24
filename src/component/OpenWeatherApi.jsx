import { StyleSheet, Text, View, Image, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useAlert } from '../context/AlertContext'
// import { currentWeatherData } from "../assets/weatherapiData/openWeather"
// import { forecastData } from "../assets/weatherapiData/openWeather"

// Import weather icons
const weatherIcons = {
  humidity: require('../../assets/weather-icons/humidity.svg'),
  temp: require('../../assets/weather-icons/thermometer-1-2.svg'),
  minTemp: require('../../assets/weather-icons/thermometer-0.svg'),
  maxTemp: require('../../assets/weather-icons/thermometer-full.svg'),
  windPressure: require('../../assets/weather-icons/wind-pressure.png'),
  visibility: require('../../assets/weather-icons/visibility.png'),
  feelsLike: require('../../assets/weather-icons/feels-like.png'),
  location: require('../../assets/weather-icons/location.png'),
  wind: require('../../assets/weather-icons/wind.svg'),
  sunrise: require('../../assets/weather-icons/sunrise.svg'),
  sunset: require('../../assets/weather-icons/sunset.svg'),
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
      <Text style={styles.sectionTitle}>Current Weather</Text>
      
      <View style={styles.weatherCard}>
        <Image 
          source={{ uri: `https://openweathermap.org/img/wn/${currentWeatherData.weather[0].icon}.png` }}
          style={styles.weatherIcon}
        />
        <View style={styles.weatherInfo}>
          <Text style={styles.weatherText}>
            {currentWeatherData.weather[0].main}, {currentWeatherData.weather[0].description}
          </Text>
          <Text style={styles.timeText}>
            {formatForecastDateTime(currentWeatherData.dt, currentWeatherData.timezone)}
          </Text>
        </View>
      </View>

      <View style={styles.weatherCard}>
        <Image source={weatherIcons.location} style={styles.icon} />
        <View style={styles.weatherInfo}>
          <Text style={styles.label}>Location</Text>
          <Text style={styles.value}>
            {panchyatSelectedItem.PANCHAYAT}, {panchyatSelectedItem.DISTRICT}
          </Text>
        </View>
      </View>

      <View style={styles.weatherCard}>
        <Image source={weatherIcons.temp} style={styles.icon} />
        <View style={styles.weatherInfo}>
          <Text style={styles.label}>Temperature</Text>
          <Text style={styles.value}>{currentWeatherData.main.temp} °C</Text>
        </View>
      </View>

      <View style={styles.weatherCard}>
        <Image source={weatherIcons.feelsLike} style={styles.icon} />
        <View style={styles.weatherInfo}>
          <Text style={styles.label}>Feels Like</Text>
          <Text style={styles.value}>{currentWeatherData.main.feels_like} °C</Text>
        </View>
      </View>

      <View style={styles.weatherCard}>
        <Image source={weatherIcons.minTemp} style={styles.icon} />
        <View style={styles.weatherInfo}>
          <Text style={styles.label}>Min Temp</Text>
          <Text style={styles.value}>{currentWeatherData.main.temp_min} °C</Text>
        </View>
      </View>

      <View style={styles.weatherCard}>
        <Image source={weatherIcons.maxTemp} style={styles.icon} />
        <View style={styles.weatherInfo}>
          <Text style={styles.label}>Max Temp</Text>
          <Text style={styles.value}>{currentWeatherData.main.temp_max} °C</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>3 Hour Forecast (5 days)</Text>
      {forecastData && forecastData.list.map((item, index) => (
        <View key={index} style={styles.forecastCard}>
          <View style={styles.weatherCard}>
            <Image 
              source={{ uri: `https://openweathermap.org/img/wn/${item.weather[0].icon}.png` }}
              style={styles.weatherIcon}
            />
            <View style={styles.weatherInfo}>
              <Text style={styles.weatherText}>
                {item.weather[0].main}, {item.weather[0].description}
              </Text>
              <Text style={styles.timeText}>
                {formatForecastDateTime(item.dt, forecastData.city.timezone)}
              </Text>
            </View>
          </View>

          <View style={styles.weatherCard}>
            <Image source={weatherIcons.temp} style={styles.icon} />
            <View style={styles.weatherInfo}>
              <Text style={styles.label}>Temperature</Text>
              <Text style={styles.value}>{item.main.temp} °C</Text>
            </View>
          </View>

          <View style={styles.weatherCard}>
            <Image source={weatherIcons.windPressure} style={styles.icon} />
            <View style={styles.weatherInfo}>
              <Text style={styles.label}>Pressure</Text>
              <Text style={styles.value}>{item.main.pressure} hPa</Text>
            </View>
          </View>

          <View style={styles.weatherCard}>
            <Image source={weatherIcons.humidity} style={styles.icon} />
            <View style={styles.weatherInfo}>
              <Text style={styles.label}>Humidity</Text>
              <Text style={styles.value}>{item.main.humidity} %</Text>
            </View>
          </View>

          <View style={styles.weatherCard}>
            <Image source={weatherIcons.minTemp} style={styles.icon} />
            <View style={styles.weatherInfo}>
              <Text style={styles.label}>Min Temp</Text>
              <Text style={styles.value}>{item.main.temp_min} °C</Text>
            </View>
          </View>

          <View style={styles.weatherCard}>
            <Image source={weatherIcons.feelsLike} style={styles.icon} />
            <View style={styles.weatherInfo}>
              <Text style={styles.label}>Feels Like</Text>
              <Text style={styles.value}>{item.main.feels_like} °C</Text>
            </View>
          </View>

          <View style={styles.weatherCard}>
            <Image source={weatherIcons.visibility} style={styles.icon} />
            <View style={styles.weatherInfo}>
              <Text style={styles.label}>Visibility</Text>
              <Text style={styles.value}>{(item.visibility / 1000).toFixed(2)} km</Text>
            </View>
          </View>

          <View style={styles.weatherCard}>
            <Image source={weatherIcons.maxTemp} style={styles.icon} />
            <View style={styles.weatherInfo}>
              <Text style={styles.label}>Max Temp</Text>
              <Text style={styles.value}>{item.main.temp_max} °C</Text>
            </View>
          </View>

          <View style={styles.weatherCard}>
            <Image source={weatherIcons.wind} style={styles.icon} />
            <View style={styles.weatherInfo}>
              <Text style={styles.label}>Wind Speed</Text>
              <Text style={styles.value}>{(item.wind.speed * 3.6).toFixed(2)} km/h</Text>
            </View>
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

export default OpenWeatherApi;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#003580',
  },
  weatherCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  weatherIcon: {
    width: 50,
    height: 50,
  },
  icon: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
  weatherInfo: {
    flex: 1,
    marginLeft: 10,
  },
  weatherText: {
    fontSize: 16,
    color: '#333',
  },
  timeText: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  label: {
    fontSize: 14,
    color: '#666',
  },
  value: {
    fontSize: 16,
    color: '#333',
    marginTop: 2,
  },
  forecastCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  placeholder: {
    padding: 20,
    alignItems: 'center',
  },
});