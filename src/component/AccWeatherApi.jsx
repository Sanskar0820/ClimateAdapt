import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, ScrollView, Linking } from 'react-native';
import axios from 'axios';
import { useAlertContext } from '../context/AlertContext';

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
  const [hourlyForecast1, setHourlyForecast1] = useState(null);
  const [dailyForecast1, setDailyForecast1] = useState(null);
  const [currentWeatherData1, setCurrentWeatherData1] = useState(null);
  const { setAlertMessage, setShowAlert } = useAlertContext();

  const fetchCurrentWeatherData = async (selectedItem) => {
    if (selectedItem && selectedItem.LAT) {
      const locationKey = selectedItem.AccuWAPI_LocationKey;
      const apiKey = process.env.EXPO_PUBLIC_ACCUWEATHER_API_KEY;
      try {
        const apiUrl = `https://dataservice.accuweather.com/currentconditions/v1/${locationKey}?apikey=${apiKey}&details=true&metric=true`;
        const response = await axios.get(apiUrl);
        if (response.data) {
          setCurrentWeatherData1(response.data[0]);
        } else {
          setCurrentWeatherData1(null);
        }
      } catch (error) {
        setAlertMessage("Error fetching data:", error);
        setShowAlert(true);
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
          setDailyForecast1(response.data.DailyForecasts);
        } else {
          setDailyForecast1(null);
        }
      } catch (error) {
        setAlertMessage("Error fetching forecast data:", error);
        setShowAlert(true);
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
        } else {
          setHourlyForecast1(null);
        }
      } catch (error) {
        setAlertMessage("Error fetching forecast data:", error);
        setShowAlert(true);
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
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'long' });
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
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
      <View style={styles.cardHeading}>
        <Text style={styles.headingText}>Current Weather</Text>
      </View>

        <View style={styles.mainContainer}>
          {/* Current Weather Card */}
          <View style={styles.weatherCard}>
            <Image
              style={styles.weatherIcon}
              source={{
                uri: `https://developer.accuweather.com/sites/default/files/${currentWeatherData1.WeatherIcon.toString().padStart(2, '0')}-s.png`
              }}
            />
            <View style={styles.weatherContent}>
              <Text style={styles.weatherText}>{currentWeatherData1.WeatherText}</Text>
              <Text style={styles.weatherValue}>
                {formatForecastDateTime(currentWeatherData1.LocalObservationDateTime)}
              </Text>
            </View>
          </View>

          {/* Temperature Card */}
          <View style={styles.weatherCard}>
          <Image style={styles.icon} source={weatherIcons.temp} />
            <View style={styles.weatherContent}>
              <Text style={styles.weatherText}>Temperature</Text>
              <Text style={styles.weatherValue}>{currentWeatherData1.Temperature.Metric.Value} °C</Text>
            </View>
          </View>

        {/* Feels Like Card */}
        <View style={styles.weatherCard}>
          <Image style={styles.icon} source={weatherIcons.feelsLike} />
          <View style={styles.weatherContent}>
            <Text style={styles.weatherText}>Feels Like</Text>
            <Text style={styles.weatherValue}>{currentWeatherData1.RealFeelTemperature.Metric.Value} °C</Text>
          </View>
        </View>

        {/* Location Card */}
        <View style={styles.weatherCard}>
          <Image style={styles.icon} source={weatherIcons.location} />
          <View style={styles.weatherContent}>
            <Text style={styles.weatherText}>Location</Text>
            <Text style={styles.weatherValue}>{panchyatSelectedItem.PANCHAYAT}, {panchyatSelectedItem.DISTRICT}</Text>
          </View>
        </View>

        {/* Dew Point Card */}
        <View style={styles.weatherCard}>
          <Image style={styles.icon} source={weatherIcons.dewPoint} />
          <View style={styles.weatherContent}>
            <Text style={styles.weatherText}>Dew Point</Text>
            <Text style={styles.weatherValue}>{currentWeatherData1.DewPoint.Metric.Value} °C</Text>
          </View>
        </View>

        {/* Pressure Card */}
        <View style={styles.weatherCard}>
          <Image style={styles.icon} source={weatherIcons.windPressure} />
          <View style={styles.weatherContent}>
            <Text style={styles.weatherText}>Pressure</Text>
            <Text style={styles.weatherValue}>{currentWeatherData1.Pressure.Metric.Value} mb</Text>
          </View>
        </View>

        {/* Humidity Card */}
        <View style={styles.weatherCard}>
          <Image style={styles.icon} source={weatherIcons.humidity} />
          <View style={styles.weatherContent}>
            <Text style={styles.weatherText}>Relative Humidity</Text>
            <Text style={styles.weatherValue}>{currentWeatherData1.RelativeHumidity} %</Text>
          </View>
        </View>

        {/* Wind Speed Card */}
        <View style={styles.weatherCard}>
          <Image style={styles.icon} source={weatherIcons.wind} />
          <View style={styles.weatherContent}>
            <Text style={styles.weatherText}>Wind Speed</Text>
            <Text style={styles.weatherValue}>{currentWeatherData1.Wind.Speed.Metric.Value} km/h</Text>
          </View>
        </View>

        {/* Wind Direction Card */}
        <View style={styles.weatherCard}>
          <Image style={styles.icon} source={weatherIcons.windDirection} />
          <View style={styles.weatherContent}>
            <Text style={styles.weatherText}>Wind Direction</Text>
            <Text style={styles.weatherValue}>{currentWeatherData1.Wind.Direction.Degrees}° {currentWeatherData1.Wind.Direction.Localized}</Text>
          </View>
        </View>

        {/* UV Index Card */}
        <View style={styles.weatherCard}>
          <Image style={styles.icon} source={weatherIcons.uvIndex} />
          <View style={styles.weatherContent}>
            <Text style={styles.weatherText}>UV Index</Text>
            <Text style={styles.weatherValue}>{currentWeatherData1.UVIndex} ({currentWeatherData1.UVIndexText})</Text>
          </View>
        </View>

        {/* Visibility Card */}
        <View style={styles.weatherCard}>
          <Image style={styles.icon} source={weatherIcons.visibility} />
          <View style={styles.weatherContent}>
            <Text style={styles.weatherText}>Visibility</Text>
            <Text style={styles.weatherValue}>{currentWeatherData1.Visibility.Metric.Value} km</Text>
          </View>
        </View>

        {/* Cloud Ceiling Card */}
        <View style={styles.weatherCard}>
          <Image style={styles.icon} source={weatherIcons.cloudCeiling} />
          <View style={styles.weatherContent}>
            <Text style={styles.weatherText}>Ceiling (cloud)</Text>
            <Text style={styles.weatherValue}>{currentWeatherData1.Ceiling.Metric.Value} m</Text>
          </View>
        </View>

        {/* Cloud Cover Card */}
        <View style={styles.weatherCard}>
          <Image style={styles.icon} source={weatherIcons.cloudCover} />
          <View style={styles.weatherContent}>
            <Text style={styles.weatherText}>Cloud Cover</Text>
            <Text style={styles.weatherValue}>{currentWeatherData1.CloudCover} %</Text>
          </View>
        </View>

        {/* Precipitation Summary */}
        <View style={styles.weatherCard}>
          <Image style={styles.icon} source={weatherIcons.rainfall} />
          <View style={styles.weatherContent}>
            <Text style={styles.weatherText}>Precipitation (Past Hour)</Text>
            <Text style={styles.weatherValue}>{currentWeatherData1.PrecipitationSummary.PastHour.Metric.Value} mm</Text>
          </View>
        </View>
      </View>

      {/* Hourly Forecast (12 Hours) */}
      <View style={styles.cardHeading}>
        <Text style={styles.headingText}>Hourly Forecast (12 Hours)</Text>
      </View>
      <ScrollView horizontal style={styles.mainContainer}>
        {hourlyForecast1 && hourlyForecast1.map((item, index) => (
          <View key={index} style={styles.forecastCard}>
            <View style={styles.weatherCard}>
              <Image
                style={styles.weatherIcon}
                source={{
                  uri: `https://developer.accuweather.com/sites/default/files/${item.WeatherIcon.toString().padStart(2, '0')}-s.png`
                }}
              />
              <View style={styles.weatherContent}>
                <Text style={styles.weatherText}>{item.IconPhrase}</Text>
                <Text style={styles.weatherValue}>
                  {formatForecastDateTime(item.DateTime)}
                </Text>
                <Text style={styles.weatherValue}>Temp: {item.Temperature.Value} °C</Text>
              </View>
            </View>

            <View style={styles.weatherCard}>
              <Image style={styles.icon} source={weatherIcons.feelsLike} />
              <View style={styles.weatherContent}>
                <Text style={styles.weatherText}>Feels Like</Text>
                <Text style={styles.weatherValue}>{item.RealFeelTemperature.Value} °C</Text>
              </View>
            </View>

            <View style={styles.weatherCard}>
              <Image style={styles.icon} source={weatherIcons.dewPoint} />
              <View style={styles.weatherContent}>
                <Text style={styles.weatherText}>Dew Point</Text>
                <Text style={styles.weatherValue}>{item.DewPoint.Value} °C</Text>
              </View>
            </View>

            <View style={styles.weatherCard}>
              <Image style={styles.icon} source={weatherIcons.humidity} />
              <View style={styles.weatherContent}>
                <Text style={styles.weatherText}>Relative Humidity</Text>
                <Text style={styles.weatherValue}>{item.RelativeHumidity} %</Text>
              </View>
            </View>

            <View style={styles.weatherCard}>
              <Image style={styles.icon} source={weatherIcons.wind} />
              <View style={styles.weatherContent}>
                <Text style={styles.weatherText}>Wind Speed</Text>
                <Text style={styles.weatherValue}>{item.Wind.Speed.Value} km/h</Text>
              </View>
            </View>

            <View style={styles.weatherCard}>
              <Image style={styles.icon} source={weatherIcons.windDirection} />
              <View style={styles.weatherContent}>
                <Text style={styles.weatherText}>Wind Direction</Text>
                <Text style={styles.weatherValue}>{item.Wind.Direction.Degrees}° {item.Wind.Direction.Localized}</Text>
              </View>
            </View>

            <View style={styles.weatherCard}>
              <Image style={styles.icon} source={weatherIcons.uvIndex} />
              <View style={styles.weatherContent}>
                <Text style={styles.weatherText}>UV Index</Text>
                <Text style={styles.weatherValue}>{item.UVIndex} ({item.UVIndexText})</Text>
              </View>
            </View>

            <View style={styles.weatherCard}>
              <Image style={styles.icon} source={weatherIcons.visibility} />
              <View style={styles.weatherContent}>
                <Text style={styles.weatherText}>Visibility</Text>
                <Text style={styles.weatherValue}>{item.Visibility.Value} km</Text>
              </View>
            </View>

            <View style={styles.weatherCard}>
              <Image style={styles.icon} source={weatherIcons.cloudCeiling} />
              <View style={styles.weatherContent}>
                <Text style={styles.weatherText}>Ceiling (cloud)</Text>
                <Text style={styles.weatherValue}>{item.Ceiling.Value} m</Text>
              </View>
            </View>

            <View style={styles.weatherCard}>
              <Image style={styles.icon} source={weatherIcons.rainfall} />
              <View style={styles.weatherContent}>
                <Text style={styles.weatherText}>Rain Probability</Text>
                <Text style={styles.weatherValue}>{item.RainProbability} %</Text>
              </View>
            </View>

            <View style={styles.weatherCard}>
              <Image style={styles.icon} source={weatherIcons.evapotranspiration} />
              <View style={styles.weatherContent}>
                <Text style={styles.weatherText}>Evapotranspiration</Text>
                <Text style={styles.weatherValue}>{item.Evapotranspiration.Value} mm</Text>
              </View>
            </View>

            <View style={styles.linkContainer}>
              <Text style={styles.linkText} onPress={() => Linking.openURL(item.Link)}>Know More</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Daily Forecast (5 Days) */}
      <View style={styles.cardHeading}>
        <Text style={styles.headingText}>Daily Forecast (5 Days)</Text>
      </View>
      <ScrollView horizontal style={styles.mainContainer}>
        {dailyForecast1 && dailyForecast1.map((day, index) => (
          <View key={index} style={styles.forecastCard}>
            <View style={styles.weatherCard}>
              <Image
                style={styles.weatherIcon}
                source={{
                  uri: `https://developer.accuweather.com/sites/default/files/${day.Day.Icon.toString().padStart(2, '0')}-s.png`
                }}
              />
              <View style={styles.weatherContent}>
                <Text style={styles.weatherText}>{day.Day.IconPhrase}</Text>
                <Text style={styles.weatherValue}>
                  {formatForecastDateTime(day.Date)}
                </Text>
                <Text style={styles.weatherValue}>Min: {day.Temperature.Minimum.Value} °C</Text>
                <Text style={styles.weatherValue}>Max: {day.Temperature.Maximum.Value} °C</Text>
              </View>
            </View>

            <View style={styles.weatherCard}>
              <Image style={styles.icon} source={weatherIcons.sunrise} />
              <View style={styles.weatherContent}>
                <Text style={styles.weatherText}>Sunrise</Text>
                <Text style={styles.weatherValue}>
                  {formatForecastDateTime(day.Sun.Rise)}
                </Text>
              </View>
            </View>

            <View style={styles.weatherCard}>
              <Image style={styles.icon} source={weatherIcons.sunset} />
              <View style={styles.weatherContent}>
                <Text style={styles.weatherText}>Sunset</Text>
                <Text style={styles.weatherValue}>
                  {formatForecastDateTime(day.Sun.Set)}
                </Text>
              </View>
            </View>

            <View style={styles.weatherCard}>
              <Image style={styles.icon} source={weatherIcons.feelsLike} />
              <View style={styles.weatherContent}>
                <Text style={styles.weatherText}>Feels Like</Text>
                <Text style={styles.weatherValue}>{day.RealFeelTemperature.Maximum.Value} °C</Text>
              </View>
            </View>

            <View style={styles.border}>
              <Text style={styles.sectionTitle}>Day</Text>
              <View style={styles.column}>
                <View style={styles.weatherCard}>
                  <Image
                    style={styles.weatherIcon}
                    source={{
                      uri: `https://developer.accuweather.com/sites/default/files/${day.Day.Icon.toString().padStart(2, '0')}-s.png`
                    }}
                  />
                  <View style={styles.weatherContent}>
                    <Text style={styles.weatherText}>{day.Day.IconPhrase}</Text>
                  </View>
                </View>
                <View style={styles.weatherCard}>
                  <Image style={styles.icon} source={weatherIcons.wind} />
                  <View style={styles.weatherContent}>
                    <Text style={styles.weatherText}>Wind Speed</Text>
                    <Text style={styles.weatherValue}>{day.Day.Wind.Speed.Value} km/h</Text>
                  </View>
                </View>
                <View style={styles.weatherCard}>
                  <Image style={styles.icon} source={weatherIcons.rainfall} />
                  <View style={styles.weatherContent}>
                    <Text style={styles.weatherText}>Precipitation Probability</Text>
                    <Text style={styles.weatherValue}>{day.Day.PrecipitationProbability} %</Text>
                  </View>
                </View>
                <View style={styles.weatherCard}>
                  <Image style={styles.icon} source={weatherIcons.windDirection} />
                  <View style={styles.weatherContent}>
                    <Text style={styles.weatherText}>Wind Direction</Text>
                    <Text style={styles.weatherValue}>{day.Day.Wind.Direction.Degrees}° {day.Day.Wind.Direction.Localized}</Text>
                  </View>
                </View>
                <View style={styles.weatherCard}>
                  <Image style={styles.icon} source={weatherIcons.humidity} />
                  <View style={styles.weatherContent}>
                    <Text style={styles.weatherText}>Relative Humidity</Text>
                    <Text style={styles.weatherValue}>{day.Day.RelativeHumidity.Average} %</Text>
                  </View>
                </View>
                <View style={styles.weatherCard}>
                  <Image style={styles.icon} source={weatherIcons.evapotranspiration} />
                  <View style={styles.weatherContent}>
                    <Text style={styles.weatherText}>Evapotranspiration</Text>
                    <Text style={styles.weatherValue}>{day.Day.Evapotranspiration.Value} mm</Text>
                  </View>
                </View>
              </View>
            </View>
            <View style={styles.border}>
              <Text style={styles.sectionTitle}>Night</Text>
              <View style={styles.column}>
                <View style={styles.weatherCard}>
                  <Image
                    style={styles.weatherIcon}
                    source={{
                      uri: `https://developer.accuweather.com/sites/default/files/${day.Night.Icon.toString().padStart(2, '0')}-s.png`
                    }}
                  />
                  <View style={styles.weatherContent}>
                    <Text style={styles.weatherText}>{day.Night.IconPhrase}</Text>
                  </View>
                </View>
                <View style={styles.weatherCard}>
                  <Image style={styles.icon} source={weatherIcons.wind} />
                  <View style={styles.weatherContent}>
                    <Text style={styles.weatherText}>Wind Speed</Text>
                    <Text style={styles.weatherValue}>{day.Night.Wind.Speed.Value} km/h</Text>
                  </View>
                </View>
                <View style={styles.weatherCard}>
                  <Image style={styles.icon} source={weatherIcons.rainfall} />
                  <View style={styles.weatherContent}>
                    <Text style={styles.weatherText}>Precipitation Probability</Text>
                    <Text style={styles.weatherValue}>{day.Night.PrecipitationProbability} %</Text>
                  </View>
                </View>
                <View style={styles.weatherCard}>
                  <Image style={styles.icon} source={weatherIcons.windDirection} />
                  <View style={styles.weatherContent}>
                    <Text style={styles.weatherText}>Wind Direction</Text>
                    <Text style={styles.weatherValue}>{day.Night.Wind.Direction.Degrees}° {day.Night.Wind.Direction.Localized}</Text>
                  </View>
                </View>
                <View style={styles.weatherCard}>
                  <Image style={styles.icon} source={weatherIcons.humidity} />
                  <View style={styles.weatherContent}>
                    <Text style={styles.weatherText}>Relative Humidity</Text>
                    <Text style={styles.weatherValue}>{day.Night.RelativeHumidity.Average} %</Text>
                  </View>
                </View>
                <View style={styles.weatherCard}>
                  <Image style={styles.icon} source={weatherIcons.evapotranspiration} />
                  <View style={styles.weatherContent}>
                    <Text style={styles.weatherText}>Evapotranspiration</Text>
                    <Text style={styles.weatherValue}>{day.Night.Evapotranspiration.Value} mm</Text>
                  </View>
                </View>
              </View>
            </View>
            <View style={styles.linkContainer}>
              <Text style={styles.linkText} onPress={() => Linking.openURL(day.Link)}>Know More</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
  forecastCard: {
    width: 300, // Set a fixed width for each forecast card
    marginRight: 10,
  },
  column: {
    flexDirection: 'column',
  },
  weatherIcon: {
    width: 50,
    height: 50,
    marginRight: 15,
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
  sectionTitle: {
    textAlign: 'center',
    fontSize: 20,
    marginVertical: 10,
  },
  border: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginVertical: 10,
  },
  linkContainer: {
    alignItems: 'flex-end',
    padding: 10,
  },
  linkText: {
    color: '#007BFF',
    textDecorationLine: 'underline',
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
});

export default AccWeatherApi;
