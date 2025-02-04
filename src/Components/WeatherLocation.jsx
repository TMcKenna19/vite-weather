import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_KEY = import.meta.env.VITE_API_KEY;

// Utility Function for Temperature Conversion
const kelvinToFahrenheit = (kelvin) => Math.round((kelvin - 273.15) * 1.8 + 32);

const WeatherLocation = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState([]);
  const [localTime, setLocalTime] = useState('');
  const [error, setError] = useState(null);

  const fetchWeatherAndForecast = async (latitude, longitude) => {
    try {
      const [currentWeather, forecast] = await Promise.all([
        axios.get("https://api.openweathermap.org/data/2.5/weather", {
          params: { lat: latitude, lon: longitude, appid: API_KEY },
        }),
        axios.get("https://api.openweathermap.org/data/2.5/forecast", {
          params: { lat: latitude, lon: longitude, appid: API_KEY, units: "metric" },
        }),
      ]);

      console.log("currentWeather.data", currentWeather);
      setWeatherData(currentWeather.data);
      const timezoneOffset = currentWeather.data.timezone;
      const utcDate = new Date();
      const localDate = new Date(utcDate.getTime() + timezoneOffset * 1000);
      setLocalTime(localDate.toLocaleString("en-US", { 
        timeZone: "UTC",
        hour: "numeric", 
        minute: "2-digit", 
        hour12: true 
      }
      ));

      const dailyForecast = forecast.data.list
        .filter(item => item.dt_txt.includes("12:00:00"))
        .slice(0, 5);
      setForecastData(dailyForecast);

    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to load weather data. Please try again later.");
    }
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        ({ coords: { latitude, longitude } }) => fetchWeatherAndForecast(latitude, longitude),
        (err) => setError("Unable to retrieve your location.")
      );
    } else {
      setError("Geolocation is not supported by your browser.");
    }
  }, []);

  if (error) return <p>{error}</p>;
  if (!weatherData) return <p>Loading Weather Data...</p>;

  return (
    <div>
      <div className="current-weather">
        <h1>{weatherData.name}</h1>
        <h2>{localTime}</h2>
        <h2>{kelvinToFahrenheit(weatherData.main.temp)} &deg;F</h2>
        <h2>{weatherData.weather[0].description}</h2>
        <img
          className="weather-icon"
          src={`http://openweathermap.org/img/w/${weatherData.weather[0].icon}.png`}
          alt={weatherData.weather[0].description}
        />
        <h2>
          Low: {kelvinToFahrenheit(weatherData.main.temp_min)} / 
          High: {kelvinToFahrenheit(weatherData.main.temp_max)}
        </h2>
      </div>

      <div className="forecast-container">
        <h2>Your 5 Day Forecast</h2>
        <div className="forecast-grid">
          {forecastData.map((day, index) => (
            <div key={index} className="forecast-card">
              <h3>{new Date(day.dt * 1000).toLocaleDateString("en-US", { weekday: "long" })}</h3>
              <img
                src={`http://openweathermap.org/img/w/${day.weather[0].icon}.png`}
                alt={day.weather[0].description}
              />
              <p>{Math.round(day.main.temp * 1.8 + 32)} &deg;F</p>
              <p>{day.weather[0].description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WeatherLocation;
