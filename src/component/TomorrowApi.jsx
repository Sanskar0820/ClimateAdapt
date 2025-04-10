import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View, Image, ScrollView } from 'react-native'
import axios from 'axios'

// import {currentWeatherData2} from "../assets/weatherapiData/tomorrowapi"
// import {forecastData} from "../assets/weatherapiData/tomorrowapi"


import HumidityIcon from "../../assets/weather-icons/humidity.png";
import TempIcon from "../../assets/weather-icons/thermometer-1-2.png";
import MinTempIcon from "../../assets/weather-icons/thermometer-0.svg";
import MaxTempIcon from "../../assets/weather-icons/thermometer-full.svg";
import WindPressureIcon from "../../assets/weather-icons/wind-pressure.png";
import VisibilityIcon from "../../assets/weather-icons/visibility.png";
import FeelsLikeIcon from "../../assets/weather-icons/feels-like.png";
import LocationIcon from "../../assets/weather-icons/location.png";
import WindIcon from "../../assets/weather-icons/wind.png";
import SunriseIcon from "../../assets/weather-icons/sunrise.svg";
import SunsetIcon from "../../assets/weather-icons/sunset.svg";
import DewPoint from "../../assets/weather-icons/dew-point.png";
import UVIndex from "../../assets/weather-icons/uv-index.png";
import WindDirection from "../../assets/weather-icons/wind-direction.png";
import CloudCeiling from "../../assets/weather-icons/cloud-cover.png";
import Rainfall from "../../assets/weather-icons/raining.png";
import Evapotranspiration from "../../assets/weather-icons/Evapotranspiration.png";
import Calendar from "../../assets/weather-icons/calendar.png";
import CloudCover from "../../assets/weather-icons/cloud-cover.png";
import { useTranslation } from 'react-i18next';

const TomorrowApi = ({ panchyatSelectedItem }) => {
  const [hourlyForecast2, setHourlyForecast2] = useState(null)
  const [dailyForecast2, setDailyForecast2] = useState(null)
  const [currentWeatherData2, setCurrentWeatherData2] = useState(null)
  const { t } = useTranslation();


  // const dailyForecast2=forecastData.timelines.daily
  // const hourlyForecast2=forecastData.timelines.hourly

  const fetchCurrentWeatherData = async (selectedItem) => {
    if (selectedItem && selectedItem.LAT) {
      const lat = selectedItem.LAT;
      const lon = selectedItem.LONG;
      const apiKey = process.env.EXPO_PUBLIC_TOMORROW_API_KEY;
      try {
        const apiUrl = `https://api.tomorrow.io/v4/weather/realtime?location=${lat},${lon}&apikey=${apiKey}&units=metric`;
        const response = await axios.get(apiUrl);
        if (response.data) {
          setCurrentWeatherData2(response.data);
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  const fetchForecastWeatherData = async (selectedItem) => {
    if (selectedItem && selectedItem.LAT) {
      const lat = selectedItem.LAT;
      const lon = selectedItem.LONG;
      const apiKey = process.env.EXPO_PUBLIC_TOMORROW_API_KEY;
      try {
        const apiUrl = `https://api.tomorrow.io/v4/weather/forecast?location=${lat},${lon}&apikey=${apiKey}&units=metric`;
        const response = await axios.get(apiUrl);
        if (response.data) {
          setDailyForecast2(response.data.timelines.daily);
          setHourlyForecast2(response.data.timelines.hourly);
          // console.log(response.data)
        }
      } catch (error) {
        console.error("Error fetching weather data", error);
      }
    }
  };

  useEffect(() => {
    if (panchyatSelectedItem && panchyatSelectedItem.LAT) {
      fetchCurrentWeatherData(panchyatSelectedItem);
      fetchForecastWeatherData(panchyatSelectedItem);
    }
  }, [panchyatSelectedItem]);

  if (!currentWeatherData2) {
    return (
      <View style={styles.placeholder}>
        <Text>Loading weather data...</Text>
      </View>
    );
  }

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

  return (
    <ScrollView style={styles.container}>
      <View style={styles.cardHeading}>
        <Text style={styles.headingText}>{t('AccWeather.currentWeather')}</Text>
      </View>

      <View style={styles.mainContainer}>
        {/* Current Weather Card */}
        <View style={styles.weatherCard}>
          <Image style={styles.icon} source={Calendar} />
          <View style={styles.weatherContent}>
            <Text style={styles.weatherText}></Text>
            <Text style={styles.weatherValue}>
              {formatForecastDateTime(currentWeatherData2.data.time)}
            </Text>
          </View>
        </View>

        <View style={styles.weatherCard}>
          <Image style={styles.icon} source={TempIcon} />
          <View style={styles.weatherContent}>
            <Text style={styles.weatherText}>{t('AccWeather.temperature')}</Text>
            <Text style={styles.weatherValue}>
              {currentWeatherData2.data.values.temperature} °C
            </Text>
          </View>
        </View>

        <View style={styles.weatherCard}>
          <Image style={styles.icon} source={FeelsLikeIcon} />
          <View style={styles.weatherContent}>
            <Text style={styles.weatherText}>{t('AccWeather.feelsLike')}</Text>
            <Text style={styles.weatherValue}>
              {currentWeatherData2.data.values.temperatureApparent} °C
            </Text>
          </View>
        </View>

        <View style={styles.weatherCard}>
          <Image style={styles.icon} source={HumidityIcon} />
          <View style={styles.weatherContent}>
            <Text style={styles.weatherText}>{t('AccWeather.humidity')}</Text>
            <Text style={styles.weatherValue}>
              {currentWeatherData2.data.values.humidity} %
            </Text>
          </View>
        </View>

        <View style={styles.weatherCard}>
          <Image style={styles.icon} source={LocationIcon} />
          <View style={styles.weatherContent}>
            <Text style={styles.weatherText}>{t('AccWeather.location')}</Text>
            <Text style={styles.weatherValue}>
              {panchyatSelectedItem.PANCHAYAT}, {panchyatSelectedItem.DISTRICT}
            </Text>
          </View>
        </View>

        <View style={styles.weatherCard}>
          <Image style={styles.icon} source={DewPoint} />
          <View style={styles.weatherContent}>
            <Text style={styles.weatherText}>{t('AccWeather.dewPoint')}</Text>
            <Text style={styles.weatherValue}>
              {currentWeatherData2.data.values.dewPoint} °C
            </Text>
          </View>
        </View>

        <View style={styles.weatherCard}>
          <Image style={styles.icon} source={Rainfall} />
          <View style={styles.weatherContent}>
            <Text style={styles.weatherText}>{t('AccWeather.precipitationSummary')}</Text>
            <Text style={styles.weatherValue}>
              {currentWeatherData2.data.values.precipitationProbability} %
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.mainContainer}>
        <View style={styles.weatherCard}>
          <Image style={styles.icon} source={WindPressureIcon} />
          <View style={styles.weatherContent}>
            <Text style={styles.weatherText}>{t('AccWeather.pressure')}</Text>
            <Text style={styles.weatherValue}>
              {currentWeatherData2.data.values.pressureSurfaceLevel} hPa
            </Text>
          </View>
        </View>

        <View style={styles.weatherCard}>
          <Image style={styles.icon} source={WindIcon} />
          <View style={styles.weatherContent}>
            <Text style={styles.weatherText}>{t('AccWeather.windSpeed')}</Text>
            <Text style={styles.weatherValue}>
              {(currentWeatherData2.data.values.windSpeed * 3.6).toFixed(2)} km/h
            </Text>
          </View>
        </View>

        <View style={styles.weatherCard}>
          <Image style={styles.icon} source={WindDirection} />
          <View style={styles.weatherContent}>
            <Text style={styles.weatherText}>{t('AccWeather.windDirection')}</Text>
            <Text style={styles.weatherValue}>
              {currentWeatherData2.data.values.windDirection}°
            </Text>
          </View>
        </View>

        <View style={styles.weatherCard}>
          <Image style={styles.icon} source={CloudCover} />
          <View style={styles.weatherContent}>
            <Text style={styles.weatherText}>{t('AccWeather.cloudCover')}</Text>
            <Text style={styles.weatherValue}>
              {currentWeatherData2.data.values.cloudCover} %
            </Text>
          </View>
        </View>

        <View style={styles.weatherCard}>
          <Image style={styles.icon} source={UVIndex} />
          <View style={styles.weatherContent}>
            <Text style={styles.weatherText}>{t('AccWeather.uvIndex')}</Text>
            <Text style={styles.weatherValue}>
              {currentWeatherData2.data.values.uvIndex}
            </Text>
          </View>
        </View>

        <View style={styles.weatherCard}>
          <Image style={styles.icon} source={VisibilityIcon} />
          <View style={styles.weatherContent}>
            <Text style={styles.weatherText}>{t('AccWeather.visibility')}</Text>
            <Text style={styles.weatherValue}>
              {currentWeatherData2.data.values.visibility} km
            </Text>
          </View>
        </View>

        <View style={styles.weatherCard}>
          <Image style={styles.icon} source={CloudCeiling} />
          <View style={styles.weatherContent}>
            <Text style={styles.weatherText}>{t('AccWeather.cloudCeiling')}</Text>
            <Text style={styles.weatherValue}>
              {currentWeatherData2.data.values.cloudCeiling} km
            </Text>
          </View>
        </View>
      </View>


      <View style={styles.cardHeading}>
        <Text style={styles.headingText}>{t('AccWeather.hourlyForecast1')}</Text>
      </View>

      {hourlyForecast2 && hourlyForecast2.length > 0 ? (
        <ScrollView horizontal style={styles.forecastContainer}>
          {hourlyForecast2.map((item, index) => (
            <View key={index} style={styles.forecastCard}>
              <View style={styles.weatherCard}>
                <Image style={styles.icon} source={Calendar} />
                <View style={styles.weatherContent}>
                  <Text style={styles.weatherText}>
                    {/* {item.IconPhrase} */}
                  </Text>
                  <Text style={styles.weatherValue}>
                    {formatForecastDateTime(item.time)}
                  </Text>
                </View>
              </View>

              <View style={styles.weatherCard}>
                <Image style={styles.icon} source={TempIcon} />
                <View style={styles.weatherContent}>
                  <Text style={styles.weatherText}>{t('AccWeather.temperature')}</Text>
                  <Text style={styles.weatherValue}>{item.values.temperature} °C</Text>
                </View>
              </View>

              <View style={styles.weatherCard}>
                <Image style={styles.icon} source={FeelsLikeIcon} />
                <View style={styles.weatherContent}>
                  <Text style={styles.weatherText}>{t('AccWeather.feelsLike')}</Text>
                  <Text style={styles.weatherValue}>{item.values.temperatureApparent} °C</Text>
                </View>
              </View>

              <View style={styles.weatherCard}>
                <Image style={styles.icon} source={DewPoint} />
                <View style={styles.weatherContent}>
                  <Text style={styles.weatherText}>{t('AccWeather.dewPoint')}</Text>
                  <Text style={styles.weatherValue}>{item.values.dewPoint} °C</Text>
                </View>
              </View>

              <View style={styles.weatherCard}>
                <Image style={styles.icon} source={HumidityIcon} />
                <View style={styles.weatherContent}>
                  <Text style={styles.weatherText}>{t('AccWeather.relativeHumidity')}</Text>
                  <Text style={styles.weatherValue}>{item.values.humidity} %</Text>
                </View>
              </View>

              <View style={styles.weatherCard}>
                <Image style={styles.icon} source={WindIcon} />
                <View style={styles.weatherContent}>
                  <Text style={styles.weatherText}>{t('AccWeather.windSpeed')}</Text>
                  <Text style={styles.weatherValue}>{item.values.windSpeed} km/h</Text>
                </View>
              </View>

              <View style={styles.weatherCard}>
                <Image style={styles.icon} source={WindDirection} />
                <View style={styles.weatherContent}>
                  <Text style={styles.weatherText}>{t('AccWeather.windDirection')}</Text>
                  <Text style={styles.weatherValue}>{item.values.windDirection}°</Text>
                </View>
              </View>

              <View style={styles.weatherCard}>
                <Image style={styles.icon} source={UVIndex} />
                <View style={styles.weatherContent}>
                  <Text style={styles.weatherText}>{t('AccWeather.uvIndex')}</Text>
                  <Text style={styles.weatherValue}>{item.values.uvIndex}</Text>
                </View>
              </View>

              <View style={styles.weatherCard}>
                <Image style={styles.icon} source={VisibilityIcon} />
                <View style={styles.weatherContent}>
                  <Text style={styles.weatherText}>{t('AccWeather.visibility')}</Text>
                  <Text style={styles.weatherValue}>{item.values.visibility} km</Text>
                </View>
              </View>

              <View style={styles.weatherCard}>
                <Image style={styles.icon} source={CloudCeiling} />
                <View style={styles.weatherContent}>
                  <Text style={styles.weatherText}>{t('AccWeather.cloudCeiling')}</Text>
                  <Text style={styles.weatherValue}>{item.values.cloudCeiling} km</Text>
                </View>
              </View>

              <View style={styles.weatherCard}>
                <Image style={styles.icon} source={Rainfall} />
                <View style={styles.weatherContent}>
                  <Text style={styles.weatherText}>{t('AccWeather.rainProbability')}</Text>
                  <Text style={styles.weatherValue}>{item.values.precipitationProbability} %</Text>
                </View>
              </View>

              <View style={styles.weatherCard}>
                <Image style={styles.icon} source={WindPressureIcon} />
                <View style={styles.weatherContent}>
                  <Text style={styles.weatherText}>{t('AccWeather.pressure')}</Text>
                  <Text style={styles.weatherValue}>{item.values.pressureSurfaceLevel} hPa</Text>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
      ) : (
        <View style={styles.rightPanelContainer}>
          <Text>{t('data.select_location_placeholder')}</Text>
        </View>
      )}

      <View style={styles.cardHeading}>
        <Text style={styles.headingText}>{t('AccWeather.dailyForecast')}</Text>
      </View>

      {dailyForecast2 && dailyForecast2.length > 0 ? (
        <ScrollView horizontal style={styles.forecastContainer}>
          {dailyForecast2.map((item, index) => (
            <View style={styles.forecastCard} key={index}>
              <View style={styles.weatherCard}>
                <Image style={styles.icon} source={Calendar} />
                <View style={styles.weatherContent}>
                  <Text style={styles.weatherText}>
                    {/* {item.IconPhrase} */}
                  </Text>
                  <Text style={styles.weatherValue}>
                    {formatForecastDateTime(item.time)}
                  </Text>
                </View>
              </View>

              <View style={styles.weatherCard}>
                <Image style={styles.icon} source={TempIcon} />
                <View style={styles.weatherContent}>
                  <Text style={styles.weatherText}>{t('AccWeather.temperature')}</Text>
                  <Text style={styles.weatherValue}>{item.values.temperatureAvg} °C</Text>
                </View>
              </View>

              <View style={styles.weatherCard}>
                <Image style={styles.icon} source={FeelsLikeIcon} />
                <View style={styles.weatherContent}>
                  <Text style={styles.weatherText}>{t('AccWeather.feelsLike')}</Text>
                  <Text style={styles.weatherValue}>{item.values.temperatureApparentAvg} °C</Text>
                </View>
              </View>

              <View style={styles.weatherCard}>
                <Image style={styles.icon} source={DewPoint} />
                <View style={styles.weatherContent}>
                  <Text style={styles.weatherText}>{t('AccWeather.dewPoint')}</Text>
                  <Text style={styles.weatherValue}>{item.values.dewPointAvg} °C</Text>
                </View>
              </View>

              <View style={styles.weatherCard}>
                <Image style={styles.icon} source={HumidityIcon} />
                <View style={styles.weatherContent}>
                  <Text style={styles.weatherText}>{t('AccWeather.relativeHumidity')}</Text>
                  <Text style={styles.weatherValue}>{item.values.humidityAvg} %</Text>
                </View>
              </View>

              <View style={styles.weatherCard}>
                <Image style={styles.icon} source={WindIcon} />
                <View style={styles.weatherContent}>
                  <Text style={styles.weatherText}>{t('AccWeather.windSpeed')}</Text>
                  <Text style={styles.weatherValue}>{item.values.windSpeedAvg} km/h</Text>
                </View>
              </View>

              <View style={styles.weatherCard}>
                <Image style={styles.icon} source={WindDirection} />
                <View style={styles.weatherContent}>
                  <Text style={styles.weatherText}>{t('AccWeather.windDirection')}</Text>
                  <Text style={styles.weatherValue}>{item.values.windDirectionAvg}°</Text>
                </View>
              </View>

              <View style={styles.weatherCard}>
                <Image style={styles.icon} source={UVIndex} />
                <View style={styles.weatherContent}>
                  <Text style={styles.weatherText}>{t('AccWeather.uvIndex')}</Text>
                  <Text style={styles.weatherValue}>{item.values.uvIndexAvg}</Text>
                </View>
              </View>

              <View style={styles.weatherCard}>
                <Image style={styles.icon} source={VisibilityIcon} />
                <View style={styles.weatherContent}>
                  <Text style={styles.weatherText}>{t('AccWeather.visibility')}</Text>
                  <Text style={styles.weatherValue}>{item.values.visibilityAvg} km</Text>
                </View>
              </View>

              <View style={styles.weatherCard}>
                <Image style={styles.icon} source={CloudCeiling} />
                <View style={styles.weatherContent}>
                  <Text style={styles.weatherText}>{t('AccWeather.cloudCeiling')}</Text>
                  <Text style={styles.weatherValue}>{item.values.cloudCeilingAvg} km</Text>
                </View>
              </View>

              <View style={styles.weatherCard}>
                <Image style={styles.icon} source={Rainfall} />
                <View style={styles.weatherContent}>
                  <Text style={styles.weatherText}>{t('AccWeather.rainProbability')}</Text>
                  <Text style={styles.weatherValue}>{item.values.precipitationProbabilityAvg} %</Text>
                </View>
              </View>

              <View style={styles.weatherCard}>
                <Image style={styles.icon} source={WindPressureIcon} />
                <View style={styles.weatherContent}>
                  <Text style={styles.weatherText}>{t('AccWeather.pressure')}</Text>
                  <Text style={styles.weatherValue}>{item.values.pressureSurfaceLevelAvg} hPa</Text>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
      ) : (
        <View style={styles.rightPanelContainer}>
          <Text>{t('data.select_location_placeholder')}</Text>
        </View>
      )}
    </ScrollView>
  );
};

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
  icon: {
    width: 30,
    height: 30,
    marginRight: 15,
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
    width: 300, // Set a fixed width for each forecast card
    marginRight: 10,
  },
  rightPanelContainer: {
    padding: 20,
    alignItems: 'center',
  },
});

export default TomorrowApi;