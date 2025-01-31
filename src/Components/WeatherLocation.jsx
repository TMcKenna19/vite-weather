import React from 'react';
import {useState, useEffect, useCallback} from 'react';
import axios from 'axios';
const API_KEY = import.meta.env.VITE_API_KEY;

const WeatherLocation = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState([]);
  const [localTime, setLocalTime] = useState(null);

  const fetchWeatherData = useCallback((latitude, longitude) => {
    //fetch current weather
    axios.get("https://api.openweathermap.org/data/2.5/weather", {
        params: { lat: latitude, lon: longitude, appid: API_KEY },
      })
      .then((response) => {
        setWeatherData(response.data);
        console.log("Weather Data:", response.data);
        // handle local time
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
      // weather forcast 
      axios.get("https://api.openweathermap.org/data/2.5/forecast", {
        params: { lat: latitude, lon: longitude, appid: API_KEY, units: "metric" },
      })
      .then((response) => {
        console.log("Forecast Data:", response.data);
        // Extract one forecast per day (e.g., 12:00 PM)
        const dailyForecast = response.data.list.filter((item) =>
          item.dt_txt.includes("12:00:00")
        ).slice(0, 5); // Get 5 days
        setForecastData(dailyForecast);
      })
      .catch((error) => console.error("Error fetching forecast data:", error));
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
    <>
      <div>
        {weatherData ? (
          <div className="current-weather">
            <h1>{weatherData.name}</h1>
            <h2>{localTime}</h2>
            <h2>{Math.round((weatherData.main.temp - 273.15) * 1.8 + 32)} &deg;F</h2>
            <h2>{weatherData.weather[0].description}</h2>
            <img
              className="weather-icon"
              src={`http://openweathermap.org/img/w/${weatherData.weather[0].icon}.png`}
              alt={weatherData.weather[0].description}
            />
            <h2>
              Low: {Math.round((weatherData.main.temp_min - 273.15) * 1.8 + 32)} / 
              High: {Math.round((weatherData.main.temp_max - 273.15) * 1.8 + 32)}
            </h2>
          </div>
        ) : (
          <p>Loading Weather Data...</p>
        )}
      </div>
  
      {/* 5-Day Forecast Section */}
      {forecastData.length > 0 && (
        <div className="forecast-container">
          <h2>Your 5 Day Forecast</h2>
          <div className="forecast-grid">
            {forecastData.map((day, index) => (
              <div key={index} className="forecast-card">
                <h3>
                  {new Date(day.dt * 1000).toLocaleDateString("en-US", {
                    weekday: "long",
                  })}
                </h3>
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
      )}
    </>
  );
  
}

export default WeatherLocation;
