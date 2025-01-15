import React from 'react'
import { useState } from 'react';
import axios from 'axios';
const API_KEY = import.meta.env.VITE_API_KEY;


const Weather = () => {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState(null);

  const now = new Date();
  const hours = now.getHours();
  const ampm = hours >= 12 ? 'PM' : 'AM'
  const hour = hours % 12 || 12;
  const minutes = now.getMinutes();
  const formatMinutes = minutes < 10 ? '0' + minutes : minutes;
  const timeString = `${hour}:${formatMinutes} ${ampm}`
  
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
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter City Name"
          value={city}
          onChange={(event) => setCity(event.target.value)}
        />
        {/* <button type="submit">Get Weather</button> */}
      </form>
        <br />
      {weatherData && (
        <div className='weather-card'>
          <h1>{weatherData.name} {timeString}</h1>
          <h2>{Math.round((weatherData.main.temp))} &deg;F</h2>
          <h2>{weatherData.weather[0].description}</h2>
          <img className='weather-icon' src={`http://openweathermap.org/img/w/${weatherData.weather[0].icon}.png`} alt="" />
          <h2>Low: {Math.round((weatherData.main.temp_min)) } / High: {Math.round((weatherData.main.temp_max))}</h2>
        </div>
      )}
    </div>

  )
}

export default Weather;
