import React from 'react'
import { useState } from 'react';
import axios from 'axios';
const apiKey = import.meta.env.VITE_API_KEY;


const Weather = () => {
  console.log(apiKey);
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState(null);

  const fetchWeatherData = async () => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`
      );
      console.log(response.data);
      setWeatherData(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    fetchWeatherData();
  };

  return (
    <div>
        <h1>Weather API</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter city name"
          value={city}
          onChange={(event) => setCity(event.target.value)}
        />
        <button type="submit">Get Weather</button>
      </form>
      {weatherData && (
        <div>
          <h2>{weatherData.name}</h2>
          <p>Forcast: {weatherData.weather[0].description}</p>
          <p>Current Temperature: {Math.round((weatherData.main.temp - 273.15) * 1.8 + 32)}</p>
          <p>Low: {Math.round((weatherData.main.temp_min -273.15) * 1.8 + 32) } / High: {Math.round((weatherData.main.temp_max -273.15) * 1.8 + 32)}</p>
        </div>
      )}
    </div>

  )
}

export default Weather;
