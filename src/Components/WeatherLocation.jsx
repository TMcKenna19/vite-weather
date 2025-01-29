import React from 'react';
import {useState, useEffect, useCallback} from 'react';
import axios from 'axios';
const API_KEY = import.meta.env.VITE_API_KEY;

const WeatherLocation = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [localTime, setLocalTime] = useState(null);
  const fetchWeatherData = useCallback((latitude, longitude) => {
    axios.get("https://api.openweathermap.org/data/2.5/weather", {
        params: { lat: latitude, lon: longitude, appid: API_KEY },
      })
      .then((response) => {
        setWeatherData(response.data);
        console.log("Weather Data:", response.data);
        const timezoneOffset = response.data.timezone;
        const utcDate = new Date();
        const localDate = new Date(utcDate.getTime() + timezoneOffset * 1000);
        setLocalTime(
          localDate.toLocaleString("en-US", {
            timeZone: "UTC",
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          })
        );
      })
      .catch((error) => {
        console.error("Error fetching weather data:", error);
      });
  }, []);

  useEffect(() => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      ({ coords: { latitude, longitude } }) => fetchWeatherData(latitude, longitude),
      (error) => console.error("Error getting location:", error)
    );
  }, [fetchWeatherData]);

  return (
    <div>
      {weatherData ? (
        <div className='weather-card'>
          <h1>{weatherData.name}</h1>
          <h2>{localTime}</h2>
          <h2>{Math.round((weatherData.main.temp - 273.15) * 1.8 + 32)} &deg;F</h2>
          <h2>{weatherData.weather[0].description}</h2>
          <img className='weather-icon' src={`http://openweathermap.org/img/w/${weatherData.weather[0].icon}.png`} alt="" />
          <h2>Low: {Math.round((weatherData.main.temp_min -273.15) * 1.8 + 32) } / High: {Math.round((weatherData.main.temp_max -273.15) * 1.8 + 32)}</h2>
        </div>
      ) : (<p>Loading Weather Data...</p>)}
    </div>

  )
}

export default WeatherLocation;
