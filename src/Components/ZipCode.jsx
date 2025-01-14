import React from 'react'
import { useState } from 'react';
import axios from 'axios';
const API_KEY = import.meta.env.VITE_API_KEY;


const ZipCode = () => {
  const [zipCode, setZipCode] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const date = new Date();
  const showTime = date.getHours() + ':' + date.getMinutes() 

  const fetchWeatherData = async () => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?zip=${zipCode},us&appid=${API_KEY}&units=imperial`
      );
      console.log(zipCode);
      console.log(response.data);
      setWeatherData(response.data);
      getTime();
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    fetchWeatherData()
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter Zip Code"
          value={zipCode}
          onChange={(event) => setZipCode(event.target.value)}
        />
        {/* <button type="submit">Get Weather</button> */}
      </form>
      {weatherData && (
        <div className='weather-card'>
          <p>{showTime}</p>
          <h1>{weatherData.name}</h1>
          <h2>Forcast: {weatherData.weather[0].description} <img className='weather-icon' src={`http://openweathermap.org/img/w/${weatherData.weather[0].icon}.png`} alt="" /></h2>
          <h2>Current Temperature: {Math.round((weatherData.main.temp))}</h2>
          <h2>Low: {Math.round((weatherData.main.temp_min)) } / High: {Math.round((weatherData.main.temp_max))}</h2>
        </div>
      )}
    </div>
  )
}

export default ZipCode

