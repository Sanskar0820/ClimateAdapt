import { StyleSheet, Text, View, Image, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
// import { currentWeather } from "../assets/weatherapiData/accuweather"
// import { dailyForecast } from "../assets/weatherapiData/accuweather"
// import { hourlyForecasr } from "../assets/weatherapiData/accuweather"
import HumidityIcon from "../../assets/weather-icons/humidity.svg";
import TempIcon from "../../assets/weather-icons/thermometer-1-2.svg";
import MinTempIcon from "../../assets/weather-icons/thermometer-0.svg";
import MaxTempIcon from "../../assets/weather-icons/thermometer-full.svg";
import WindPressureIcon from "../../assets/weather-icons/wind-pressure.png";
import VisibilityIcon from "../../assets/weather-icons/visibility.png";
import FeelsLikeIcon from "../../assets/weather-icons/feels-like.png";
import LocationIcon from "../../assets/weather-icons/location.png";
import WindIcon from "../../assets/weather-icons/wind.svg";
import SunriseIcon from "../../assets/weather-icons/sunrise.svg";
import SunsetIcon from "../../assets/weather-icons/sunset.svg";
import DewPoint from "../../assets/weather-icons/dew-point.png";
import UVIndex from "../../assets/weather-icons/uv-index.png";
import WindDirection from "../../assets/weather-icons/wind-direction.png";
import CloudCeiling from "../../assets/weather-icons/ceiling_cloud.png";
import Rainfall from "../../assets/weather-icons/raining.png";
import Evapotranspiration from "../../assets/weather-icons/Evapotranspiration.png";
import Calendar from "../../assets/weather-icons/calendar.png";
import CloudCover from "../../assets/weather-icons/cloud-cover.png";

import axios from 'axios';


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
  dewPoint: require('../../assets/weather-icons/dew-point.png'),
  uvIndex: require('../../assets/weather-icons/uv-index.png'),
  windDirection: require('../../assets/weather-icons/wind-direction.png'),
  cloudCeiling: require('../../assets/weather-icons/ceiling_cloud.png'),
  rainfall: require('../../assets/weather-icons/raining.png'),
  evapotranspiration: require('../../assets/weather-icons/Evapotranspiration.png'),
  calendar: require('../../assets/weather-icons/calendar.png'),
  cloudCover: require('../../assets/weather-icons/cloud-cover.png'),
};

const AccWeatherApi = ({ panchyatSelectedItem }) => {
  const [hourlyForecast1, setHourlyForecast1] = useState(null)
  const [dailyForecast1, setDailyForecast1] = useState(null)
  const [currentWeatherData1, setCurrentWeatherData1] = useState(null)

  // const currentWeatherData1 = currentWeather[0]
  // const dailyForecast1 = dailyForecast
  // const hourlyForecast1 = hourlyForecasr

  const fetchCurrentWeatherData = async (selectedItem) => {
    if (selectedItem && selectedItem.LAT) {
      const locationKey = selectedItem.AccuWAPI_LocationKey;
      const apiKey = process.env.EXPO_PUBLIC_ACCUWEATHER_API_KEY;
      try {
        const apiUrl = `https://dataservice.accuweather.com/currentconditions/v1/${locationKey}?apikey=${apiKey}&details=true&metric=true`;
        const response = await axios.get(apiUrl);
        if (response.data) {
          setCurrentWeatherData1(response.data[0]);
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  const fetchDailyForecastWeatherData = async (selectedItem) => {
    if (selectedItem && selectedItem.LAT) {
      const locationKey = selectedItem.AccuWAPI_LocationKey;
      const apiKey = process.env.EXPO_PUBLIC_ACCUWEATHER_API_KEY;
      try {
        const apiUrl = `https://dataservice.accuweather.com/forecasts/v1/daily/5day/${locationKey}?apikey=${apiKey}&details=true&metric=true`;
        const response = await axios.get(apiUrl);
        if (response.data) {
          setDailyForecast1(response.data);
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  const fetchHourlyForecastWeatherData = async (selectedItem) => {
    if (selectedItem && selectedItem.LAT) {
      const locationKey = selectedItem.AccuWAPI_LocationKey;
      const apiKey = process.env.EXPO_PUBLIC_ACCUWEATHER_API_KEY;
      try {
        const apiUrl = `https://dataservice.accuweather.com/forecasts/v1/hourly/12hour/${locationKey}?apikey=${apiKey}&details=true&metric=true`;
        const response = await axios.get(apiUrl);
        if (response.data) {
          setHourlyForecast1(response.data);
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  useEffect(() => {
    if (panchyatSelectedItem && panchyatSelectedItem.LAT) {
      fetchCurrentWeatherData(panchyatSelectedItem);
      fetchHourlyForecastWeatherData(panchyatSelectedItem);
      fetchDailyForecastWeatherData(panchyatSelectedItem);
    }
  }, [panchyatSelectedItem]);

  const formatForecastDateTime = (dateTimeStr) => {
    const date = new Date(dateTimeStr);

    // Format the day and month
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'long' });

    // Format the time in HH:MM
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    // Return formatted date and time
    return `${day} ${month}, ${hours}:${minutes}`;
  };

  if (!currentWeatherData1) {
    return (
      <View style={styles.placeholder}>
        <Text>Loading weather data...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Add your mobile UI components here */}
    </ScrollView>
  );
};

export default AccWeatherApi;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  placeholder: {
    padding: 20,
    alignItems: 'center',
  },
  // Add more styles as needed
});
