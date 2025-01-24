import { StyleSheet, Text, View, Image, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useAlert } from '../context/AlertContext'
// import {currentWeatherData2} from "../assets/weatherapiData/tomorrowapi"
// import {forecastData} from "../assets/weatherapiData/tomorrowapi"


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

const TomorrowApi = ({ panchyatSelectedItem }) => {
  const [hourlyForecast2, setHourlyForecast2] = useState(null)
  const [dailyForecast2, setDailyForecast2] = useState(null)
  const [currentWeatherData2, setCurrentWeatherData2] = useState(null)
  const { setAlertMessage, setShowAlert } = useAlert();

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
        setAlertMessage("Error fetching weather data");
        setShowAlert(true);
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
        }
      } catch (error) {
        setAlertMessage("Error fetching weather data");
        setShowAlert(true);
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
      <div>
        <div className='card_heading'>
          <h2>Current Weather</h2>
        </div>

        {currentWeatherData2 && currentWeatherData2.data ? (
          <>
            <div className='row'>
              <div className='col-md-6 col-sm-12 col-lg-6'>
                <div className='weather_main_card'>
                  <div className='weather_card'>
                    <img src={Calendar} alt='weather_icon' />
                    <div className='weather_content'>
                      <p className="weather_card_text">
                        {/* {currentWeatherData2.weather[0].main},{" "} */}
                        {/* {currentWeatherData2.data.description} */}
                      </p>
                      <p className='weather_card_value'>{formatForecastDateTime(currentWeatherData2.data.time)}</p>
                    </div>
                  </div>

                  <div className='weather_card'>
                    <img src={TempIcon} alt='weather_icon' />
                    <div className='weather_content'>
                      <p className="weather_card_text">Temperature</p>
                      <p className='weather_card_value'>{currentWeatherData2.data.values.temperature} °C</p>
                    </div>
                  </div>

                  <div className='weather_card'>
                    <img src={FeelsLikeIcon} alt='weather_icon' />
                    <div className='weather_content'>
                      <p className="weather_card_text">Feels Like</p>
                      <p className='weather_card_value'>{currentWeatherData2.data.values.temperatureApparent} °C</p>
                    </div>
                  </div>

                  <div className='weather_card'>
                    <img src={HumidityIcon} alt='weather_icon' />
                    <div className='weather_content'>
                      <p className="weather_card_text">Humidity</p>
                      <p className='weather_card_value'> {currentWeatherData2.data.values.humidity} %</p>
                    </div>
                  </div>
                  <div className='weather_card'>
                    <img src={LocationIcon} alt='weather_icon' />
                    <div className='weather_content'>
                      <p className="weather_card_text">Location</p>
                      <p className='weather_card_value'>{panchyatSelectedItem.PANCHAYAT}, {panchyatSelectedItem.DISTRICT}</p>
                    </div>
                  </div>

                  <div className='weather_card'>
                    <img src={DewPoint} alt='weather_icon' />
                    <div className='weather_content'>
                      <p className="weather_card_text">Dew Point</p>
                      <p className='weather_card_value'>{currentWeatherData2.data.values.dewPoint} °C</p>
                    </div>
                  </div>

                  <div className='weather_card'>
                    <img src={Rainfall} alt='weather_icon' />
                    <div className='weather_content'>
                      <p className="weather_card_text">Precipitation Probability</p>
                      <p className='weather_card_value'>{currentWeatherData2.data.values.precipitationProbability} %</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className='col-md-6 col-sm-12 col-lg-6'>
                <div className='weather_main_card'>
                  <div className='weather_card'>
                    <img src={WindPressureIcon} alt='weather_icon' />
                    <div className='weather_content'>
                      <p className="weather_card_text">Pressure Surface Level</p>
                      <p className='weather_card_value'>{currentWeatherData2.data.values.pressureSurfaceLevel} hPa</p>
                    </div>
                  </div>

                  <div className='weather_card'>
                    <img src={WindIcon} alt='weather_icon' />
                    <div className='weather_content'>
                      <p className="weather_card_text">Wind Speed</p>
                      <p className='weather_card_value'>  {(currentWeatherData2.data.values.windSpeed * 3.6).toFixed(2)} km/h</p>
                    </div>
                  </div>
                  <div className='weather_card'>
                    <img src={WindDirection} alt='weather_icon' />
                    <div className='weather_content'>
                      <p className="weather_card_text">Wind Direction</p>
                      <p className='weather_card_value'>  {(currentWeatherData2.data.values.windDirection)}°  </p>
                    </div>
                  </div>

                  <div className='weather_card'>
                    <img src={CloudCover} alt='weather_icon' />
                    <div className='weather_content'>
                      <p className="weather_card_text">Cloud Cover</p>
                      <p className='weather_card_value'>{currentWeatherData2.data.values.cloudCover} % </p>
                    </div>
                  </div>

                  <div className='weather_card'>
                    <img src={UVIndex} alt='weather_icon' />
                    <div className='weather_content'>
                      <p className="weather_card_text">UV Index</p>
                      <p className='weather_card_value'>{currentWeatherData2.data.values.uvIndex}</p>
                    </div>
                  </div>

                  <div className='weather_card'>
                    <img src={VisibilityIcon} alt='weather_icon' />
                    <div className='weather_content'>
                      <p className="weather_card_text">Visibility</p>
                      <p className='weather_card_value'>{currentWeatherData2.data.values.visibility} km</p>
                    </div>
                  </div>

                  <div className='weather_card'>
                    <img src={CloudCeiling} alt='weather_icon' />
                    <div className='weather_content'>
                      <p className="weather_card_text">Cloud Ceiling</p>
                      <p className='weather_card_value'>{currentWeatherData2.data.values.cloudCeiling} km</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className='right_panel_container my-4'>
            Please select a location.
          </div>
        )}

        <div className='card_heading'>
          <h2>Hourly Forecast (120 Hours)</h2>
        </div>

        {hourlyForecast2 && hourlyForecast2.length > 0 ? (
          <div className='forecast_container'>
            {hourlyForecast2.map((item, index) => (
              <div className='col-md-6 col-sm-12 col-lg-6' key={index}>
                <div className='forecast_cards_details column_3'>
                  <div className='weather_card'>
                    <img src={Calendar} alt='weather_icon' />
                    <div className='weather_content'>
                      <p className="weather_card_text">
                        {/* {item.IconPhrase} */}
                      </p>
                      <p className='weather_card_value'>
                        {formatForecastDateTime(item.time)}
                      </p>
                    </div>
                  </div>

                  <div className='weather_card'>
                    <img src={TempIcon} alt='weather_icon' />
                    <div className='weather_content'>
                      <p className="weather_card_text">Temperature</p>
                      <p className='weather_card_value'>{item.values.temperature} °C</p>
                    </div>
                  </div>
                  <div className='weather_card'>
                    <img src={FeelsLikeIcon} alt='weather_icon' />
                    <div className='weather_content'>
                      <p className="weather_card_text">Feels Like</p>
                      <p className='weather_card_value'>{item.values.temperatureApparent} °C</p>
                    </div>
                  </div>

                  <div className='weather_card'>
                    <img src={DewPoint} alt='weather_icon' />
                    <div className='weather_content'>
                      <p className="weather_card_text">DewPoint</p>
                      <p className='weather_card_value'> {item.values.dewPoint}  °C</p>
                    </div>
                  </div>

                  <div className='weather_card'>
                    <img src={HumidityIcon} alt='weather_icon' />
                    <div className='weather_content'>
                      <p className="weather_card_text">Relative Humidity</p>
                      <p className='weather_card_value'> {item.values.humidity} %</p>
                    </div>
                  </div>

                  <div className='weather_card'>
                    <img src={WindIcon} alt='weather_icon' />
                    <div className='weather_content'>
                      <p className="weather_card_text">Wind Speed</p>
                      <p className='weather_card_value'>  {(item.values.windSpeed)} km/h</p>
                    </div>
                  </div>
                  <div className='weather_card'>
                    <img src={WindDirection} alt='weather_icon' />
                    <div className='weather_content'>
                      <p className="weather_card_text">Wind Direction</p>
                      <p className='weather_card_value'>  {(item.values.windDirection)}° </p>
                    </div>
                  </div>

                  <div className='weather_card'>
                    <img src={UVIndex} alt='weather_icon' />
                    <div className='weather_content'>
                      <p className="weather_card_text">UV Index</p>
                      <p className='weather_card_value'>  {(item.values.uvIndex)} </p>
                    </div>
                  </div>

                  <div className='weather_card'>
                    <img src={VisibilityIcon} alt='weather_icon' />
                    <div className='weather_content'>
                      <p className="weather_card_text">Visibility</p>
                      <p className='weather_card_value'>{item.values.visibility}{" "}km</p>
                    </div>
                  </div>

                  <div className='weather_card'>
                    <img src={CloudCeiling} alt='weather_icon' />
                    <div className='weather_content'>
                      <p className="weather_card_text">Ceiling (cloud)</p>
                      <p className='weather_card_value'>{item.values.cloudCeiling}{" "}km</p>
                    </div>
                  </div>

                  <div className='weather_card'>
                    <img src={Rainfall} alt='weather_icon' />
                    <div className='weather_content'>
                      <p className="weather_card_text">Rain Probability</p>
                      <p className='weather_card_value'>{item.values.precipitationProbability} %</p>
                    </div>
                  </div>

                  <div className='weather_card'>
                    <img src={WindPressureIcon} alt='weather_icon' />
                    <div className='weather_content'>
                      <p className="weather_card_text">Pressure Surface Level</p>
                      <p className='weather_card_value'>{item.values.pressureSurfaceLevel} hPa</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className='right_panel_container my-4'>
            Please select a location.
          </div>
        )}

        <div className='card_heading'>
          <h2>Daily Forecast (5 Days)</h2>
        </div>

        {dailyForecast2 && dailyForecast2.length > 0 ? (
          <div className='forecast_container'>
            {dailyForecast2.map((item, index) => (
              <div className='col-md-6 col-sm-12 col-lg-6' key={index}>
                <div className='forecast_cards_details column_3'>
                  <div className='weather_card'>
                    <img src={Calendar} alt='weather_icon' />
                    <div className='weather_content'>
                      <p className="weather_card_text">
                        {/* {item.IconPhrase} */}
                      </p>
                      <p className='weather_card_value'>
                        {formatForecastDateTime(item.time)}
                      </p>
                    </div>
                  </div>

                  <div className='weather_card'>
                    <img src={TempIcon} alt='weather_icon' />
                    <div className='weather_content'>
                      <p className="weather_card_text">Temperature</p>
                      <p className='weather_card_value'>{item.values.temperatureAvg} °C</p>
                    </div>
                  </div>
                  <div className='weather_card'>
                    <img src={FeelsLikeIcon} alt='weather_icon' />
                    <div className='weather_content'>
                      <p className="weather_card_text">Feels Like</p>
                      <p className='weather_card_value'>{item.values.temperatureApparentAvg} °C</p>
                    </div>
                  </div>

                  <div className='weather_card'>
                    <img src={DewPoint} alt='weather_icon' />
                    <div className='weather_content'>
                      <p className="weather_card_text">DewPoint</p>
                      <p className='weather_card_value'> {item.values.dewPointAvg}  °C</p>
                    </div>
                  </div>

                  <div className='weather_card'>
                    <img src={HumidityIcon} alt='weather_icon' />
                    <div className='weather_content'>
                      <p className="weather_card_text">Relative Humidity</p>
                      <p className='weather_card_value'> {item.values.humidityAvg} %</p>
                    </div>
                  </div>

                  <div className='weather_card'>
                    <img src={WindIcon} alt='weather_icon' />
                    <div className='weather_content'>
                      <p className="weather_card_text">Wind Speed</p>
                      <p className='weather_card_value'>  {(item.values.windSpeedAvg)} km/h</p>
                    </div>
                  </div>
                  <div className='weather_card'>
                    <img src={WindDirection} alt='weather_icon' />
                    <div className='weather_content'>
                      <p className="weather_card_text">Wind Direction</p>
                      <p className='weather_card_value'>  {(item.values.windDirectionAvg)}° </p>
                    </div>
                  </div>

                  <div className='weather_card'>
                    <img src={UVIndex} alt='weather_icon' />
                    <div className='weather_content'>
                      <p className="weather_card_text">UV Index</p>
                      <p className='weather_card_value'>  {(item.values.uvIndexAvg)} </p>
                    </div>
                  </div>

                  <div className='weather_card'>
                    <img src={VisibilityIcon} alt='weather_icon' />
                    <div className='weather_content'>
                      <p className="weather_card_text">Visibility</p>
                      <p className='weather_card_value'>{item.values.visibilityAvg}{" "}km</p>
                    </div>
                  </div>

                  <div className='weather_card'>
                    <img src={CloudCeiling} alt='weather_icon' />
                    <div className='weather_content'>
                      <p className="weather_card_text">Ceiling (cloud)</p>
                      <p className='weather_card_value'>{item.values.cloudCeilingAvg}{" "}km</p>
                    </div>
                  </div>

                  <div className='weather_card'>
                    <img src={Rainfall} alt='weather_icon' />
                    <div className='weather_content'>
                      <p className="weather_card_text">Rain Probability</p>
                      <p className='weather_card_value'>{item.values.precipitationProbabilityAvg} %</p>
                    </div>
                  </div>

                  <div className='weather_card'>
                    <img src={WindPressureIcon} alt='weather_icon' />
                    <div className='weather_content'>
                      <p className="weather_card_text">Pressure Surface Level</p>
                      <p className='weather_card_value'>{item.values.pressureSurfaceLevelAvg} hPa</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className='right_panel_container my-4'>
            Please select a location.
          </div>
        )}
      </div>
    </ScrollView>
  );
};

export default TomorrowApi;

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