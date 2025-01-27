import React from 'react'
import { useState } from 'react';
import axios from 'axios';
import { useEffect } from 'react';
const API_KEY = import.meta.env.VITE_API_KEY;


const WeatherLocation = () => {
  const [location, setLocation] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [localTime, setLocalTime] = useState(null);
 
  useEffect(() => {
    if (!navigator.geolocation) {
      alert("Your browser does not support geolocation. Please update your browser.");
      return;
    }

    const fetchLocationAndWeather = () => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          setLocation({ latitude, longitude });
          // Fetch weather data using the coordinates
          fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`)
            .then((response) => response.json())
            .then((data) => {
              setWeatherData(data);
              console.log("Weather Data:", data);
              const timezoneOffset = data.timezone;
              const utcDate = new Date();
              const localDate = new Date(utcDate.getTime() + timezoneOffset * 1000);
              const formattedLocalTime = localDate.toLocaleString("en-US", {
                timeZone: "UTC",
                hour: "numeric",
                minute: "2-digit",
                hour12: true
              });
      setLocalTime(formattedLocalTime);
            })
            .catch((error) => console.error("Error fetching weather data:", error));
        },
        (error) => {
          switch (error.code) {
            case error.PERMISSION_DENIED:
              console.log("User denied the request for Geolocation.");
              break;
            case error.POSITION_UNAVAILABLE:
              console.log("Location information is unavailable.");
              break;
            case error.TIMEOUT:
              console.log("The request to get user location timed out.");
              break;
            default:
              console.log("An unknown error occurred.");
              break;
          }
        }
      );
    };

    fetchLocationAndWeather();
  }, [API_KEY]); // Dependencies: Runs only once unless API_KEY changes
  
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
