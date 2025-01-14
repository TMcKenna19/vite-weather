import React from 'react'
import { useState } from 'react';
import axios from 'axios';
const API_KEY = import.meta.env.VITE_API_KEY;


const Weather = () => {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  // console.log(API_KEY);
  
  const fetchWeatherData = async () => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=imperial`
      );
      console.log(city);
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
        <p>Weather API</p>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter City Name"
          value={city}
          onChange={(event) => setCity(event.target.value)}
        />
        {/* <button type="submit">Get Weather</button> */}
      </form>
      {weatherData && (
        <div>
          <h1>{weatherData.name}</h1>

          <img className='weather-icon' src={`http://openweathermap.org/img/w/${weatherData.weather[0].icon}.png`} alt="" />
          <h2>Forcast: {weatherData.weather[0].description}</h2>
          <h2>Current Temperature: {Math.round((weatherData.main.temp))}</h2>
          <h2>Low: {Math.round((weatherData.main.temp_min))} / High: {Math.round((weatherData.main.temp_max))}</h2>
        </div>
      )}
    </div>

  )
}

export default Weather;
