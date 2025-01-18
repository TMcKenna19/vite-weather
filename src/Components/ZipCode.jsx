import React from 'react'
import { useState} from 'react';
import { useEffect } from 'react';

import axios from 'axios';
const API_KEY = import.meta.env.VITE_API_KEY;


const ZipCode = () => {
  const [zipCode, setZipCode] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [localTime, setLocalTime] = useState(null);
  
  const fetchWeatherData = async () => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?zip=${zipCode},us&appid=${API_KEY}&units=imperial`
      );
      // console.log("zip code:", zipCode);
      // console.log(response.data);
      setWeatherData(response.data);
      const timezoneOffset = response.data.timezone; // Offset in seconds
      // Get the current UTC time
      const utcDate = new Date();
      // Calculate the local time by adjusting the UTC time with the timezone offset
      const localDate = new Date(utcDate.getTime() + timezoneOffset * 1000);
      // Format the calculated local time for display
      const formattedLocalTime = localDate.toLocaleString("en-US", {
        timeZone: "UTC",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true, // Optional: Use 12-hour format
      });
      // Update the local time in the state
      setLocalTime(formattedLocalTime);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    fetchWeatherData()
  };

  useEffect(() => {
    console.log("Updated Local Time:", localTime);
  }, [localTime]);
  
  
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Search Zip Code"
          value={zipCode}
          onChange={(event) => setZipCode(event.target.value)}
        />
        {/* <button type="submit">Get Weather</button> */}
      </form>
      {weatherData && (
        <div className='weather-card'>
          <h1>{weatherData.name} {localTime}</h1>
          <h2>{Math.round((weatherData.main.temp))} &deg;F</h2>
          <h2>{weatherData.weather[0].description}</h2>
          <img className='weather-icon' src={`http://openweathermap.org/img/w/${weatherData.weather[0].icon}.png`} alt="" />
          <h2>Low: {Math.round((weatherData.main.temp_min)) } / High: {Math.round((weatherData.main.temp_max))}</h2>
        </div>
      )}
    </div>
  )
}

export default ZipCode

