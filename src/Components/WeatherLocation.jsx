import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_KEY = import.meta.env.VITE_API_KEY;

// U.S. State Abbreviation Lookup
const stateAbbreviations = {
  "Alabama": "AL", "Alaska": "AK", "Arizona": "AZ", "Arkansas": "AR",
  "California": "CA", "Colorado": "CO", "Connecticut": "CT", "Delaware": "DE",
  "Florida": "FL", "Georgia": "GA", "Hawaii": "HI", "Idaho": "ID",
  "Illinois": "IL", "Indiana": "IN", "Iowa": "IA", "Kansas": "KS",
  "Kentucky": "KY", "Louisiana": "LA", "Maine": "ME", "Maryland": "MD",
  "Massachusetts": "MA", "Michigan": "MI", "Minnesota": "MN", "Mississippi": "MS",
  "Missouri": "MO", "Montana": "MT", "Nebraska": "NE", "Nevada": "NV",
  "New Hampshire": "NH", "New Jersey": "NJ", "New Mexico": "NM", "New York": "NY",
  "North Carolina": "NC", "North Dakota": "ND", "Ohio": "OH", "Oklahoma": "OK",
  "Oregon": "OR", "Pennsylvania": "PA", "Rhode Island": "RI", "South Carolina": "SC",
  "South Dakota": "SD", "Tennessee": "TN", "Texas": "TX", "Utah": "UT",
  "Vermont": "VT", "Virginia": "VA", "Washington": "WA", "West Virginia": "WV",
  "Wisconsin": "WI", "Wyoming": "WY"
};

// Utility Function for Temperature Conversion
const kelvinToFahrenheit = (kelvin) => Math.round((kelvin - 273.15) * 1.8 + 32);
const celsiusToFahrenheit = (celsius) => Math.round((celsius * 1.8 + 32));

function getDate() {
  const dayName = new Date().toLocaleString('en-us', {weekday:'long'})
  const month = new Date().toLocaleString('en-us', {month:'short'})
  const day = new Date().getDate();
  return `${dayName}, ${month} ${day}`
}

const WeatherLocation = () => {
  const [currentWeather, setCurrentWeather] = useState(null);
  const [hourlyForecast, setHourlyForecast] = useState([]);
  const [dailyForecast, setDailyForecast] = useState([]);
  const [localTime, setLocalTime] = useState('');
  const [currentDate, setCurrentDate] = useState(getDate());
  const [stateAbbr, setStateAbbr] = useState('');
  const [error, setError] = useState(null);

  const fetchWeatherAndForecast = async (latitude, longitude) => {
    try {
      const [weatherData, forecast] = await Promise.all([
        axios.get("https://api.openweathermap.org/data/2.5/weather", {
          params: { lat: latitude, lon: longitude, appid: API_KEY },
        }),
        axios.get("https://api.openweathermap.org/data/2.5/forecast", {
          params: { lat: latitude, lon: longitude, appid: API_KEY, units: "metric" },
        }),
      ]);
      setCurrentWeather(weatherData.data);
      const hourlyData = forecast.data.list.slice(0, 5);
      setHourlyForecast(hourlyData);
      console.log("location", hourlyData);
      const timezoneOffset = weatherData.data.timezone;
      const utcDate = new Date();
      const localDate = new Date(utcDate.getTime() + timezoneOffset * 1000);
      setLocalTime(localDate.toLocaleString("en-US", { 
        timeZone: "UTC",
        hour: "numeric", 
        minute: "2-digit", 
        hour12: true 
      }
      ));
      const dailyForecastData = forecast.data.list
        .filter(item => item.dt_txt.includes("12:00:00"))
        .slice(0, 5);
      setDailyForecast(dailyForecastData);

      // Fetch State Information using Reverse Geocoding API
      const geoResponse = await axios.get("https://api.openweathermap.org/geo/1.0/reverse", {
        params: { lat: latitude, lon: longitude, limit: 1, appid: API_KEY },
      });
      const locationData = geoResponse.data[0];
      const fullStateName = locationData.state || ""; 
      const abbreviation = stateAbbreviations[fullStateName] || fullStateName;
      setStateAbbr(abbreviation);
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
  if (!currentWeather) return <p>Loading Weather Data...</p>;

  return (
    <div>
      <div className="current-weather-container">
        <div className="location-time">
          <h1>{currentWeather.name}, {stateAbbr}</h1>
          <h2>{localTime}</h2>
          <h2>{currentDate}</h2>
        </div>
        <div className="current-weather">
          <h2 className="temp">{kelvinToFahrenheit(currentWeather.main.temp)}°F</h2>
          <img
            className="weather-icon"
            src={`http://openweathermap.org/img/w/${currentWeather.weather[0].icon}.png`}
            alt={currentWeather.weather[0].description}
          />
          <h2 className="feels-like">Feels like {kelvinToFahrenheit(currentWeather.main.feels_like)}°F</h2>
          <h2 className="humidity">Humidity: {currentWeather.main.humidity}%</h2>
          <h2 className="description">{currentWeather.weather[0].description}</h2>
          <h2 className="high-low">
            L: {kelvinToFahrenheit(currentWeather.main.temp_min)}°F / H: {kelvinToFahrenheit(currentWeather.main.temp_max)}°F
          </h2>
          <h2 className="sunrise">Sunrise: {new Date(currentWeather.sys.sunrise * 1000).toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          })}</h2>
          <h2 className="sunset">Sunset: {new Date(currentWeather.sys.sunset * 1000).toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          })}</h2>
        </div>
      </div>
      <div className="forecast-container">
        <div className="five-day-forecast">
          <h2>Your 5 Day Forecast</h2>
          <div className="five-day-table">
            {dailyForecast.map((day, index) => (
                <tbody key={index} className="five-day-row">
                  <tr>
                    <th><img
                      src={`http://openweathermap.org/img/w/${day.weather[0].icon}.png`}
                      alt={day.weather[0].description}
                    /></th>
                    <th>{new Date(day.dt * 1000).toLocaleDateString("en-US", { weekday: "long" })}</th>
                    <th>{celsiusToFahrenheit(day.main.temp)} &deg;F</th>
                    <th>{day.weather[0].description}</th>
                  </tr>
                </tbody>
            ))}
          </div>
        </div>
        <div className="hourly-forecast">
          <h2>Hourly Forecast</h2>
          <div className="hourly-grid">
            {hourlyForecast.map((hour, index) => (
              <div key={index} className="hourly-card">
                <h3>
                  {new Date(hour.dt * 1000).toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </h3>
                <img
                  src={`http://openweathermap.org/img/w/${hour.weather[0].icon}.png`}
                  alt={hour.weather[0].description}
                />
                <p>{celsiusToFahrenheit(hour.main.temp)}°F</p>
                <p>{hour.weather[0].description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      </div>
  );
};

export default WeatherLocation;
