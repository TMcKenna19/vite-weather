import React from 'react'
import { useState} from 'react';
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

const ZipCode = () => {
  const [zipCode, setZipCode] = useState("");
  const [currentWeather, setCurrentWeather] = useState(null);
  const [hourlyForecast, setHourlyForecast] = useState([]);
  const [dailyForecast, setDailyForecast] = useState([]);
  const [localTime, setLocalTime] = useState(null);
  const [stateAbbr, setStateAbbr] = useState('');
 
  const fetchWeatherData = async () => {
    try {
      const zipResponse = await axios.get(`https://api.openweathermap.org/geo/1.0/zip`, {
        params: { zip: `${zipCode},US`, appid: API_KEY },
      });
      const { lat, lon } = zipResponse.data;
      const reverseGeoResponse = await axios.get(`https://api.openweathermap.org/geo/1.0/reverse`, {
        params: { lat, lon, limit: 1, appid: API_KEY },
      });
      const state = reverseGeoResponse.data[0]?.state || "Unknown State";

      const [weatherData, forecast] = await Promise.all([
        axios.get(`https://api.openweathermap.org/data/2.5/weather?zip=${zipCode},us&appid=${API_KEY}&units=imperial`),
        axios.get(`https://api.openweathermap.org/data/2.5/forecast?zip=${zipCode},us&appid=${API_KEY}&units=imperial`)
      ]);
      console.log(weatherData.data);
      setCurrentWeather(weatherData.data);
      const hourlyData = forecast.data.list.slice(0, 5);
      setHourlyForecast(hourlyData);
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

      const abbreviation = stateAbbreviations[state] || state;
      setStateAbbr(abbreviation);
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
          placeholder="Search Zip Code"
          value={zipCode}
          onChange={(event) => setZipCode(event.target.value)}
        />
      </form>
      {currentWeather && (
        <div className='zip-weather-container'>
          <div className='zip-time'>
            <h1>{currentWeather.name}, {stateAbbr}</h1>
            <h2>{localTime}</h2>
          </div>
          <div className='zip-current-weather'>
            <h2 className="temp">{Math.round((currentWeather.main.temp))}°F</h2>
            <img className='weather-icon' src={`http://openweathermap.org/img/w/${currentWeather.weather[0].icon}.png`} alt="" />
            <h2 className="feels-like">Feels like {Math.round(currentWeather.main.feels_like)}°F</h2>
            <h2 className="humidity">Humidity: {currentWeather.main.humidity}%</h2>
            <h2 className="description">{currentWeather.weather[0].description}</h2>
            <h2 className="high-low">L: {Math.round((currentWeather.main.temp_min))}°F / H: {Math.round((currentWeather.main.temp_max))}°F</h2>
            <h2 className="sunrise">Sunrise: {new Date((currentWeather.sys.sunrise + currentWeather.timezone) * 1000).toLocaleTimeString("en-US", {
              timeZone: "UTC",
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
          })}</h2>
          <h2 className="sunset">Sunset: {new Date((currentWeather.sys.sunset + currentWeather.timezone) * 1000).toLocaleTimeString("en-US", {
            timeZone: "UTC",
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          })}</h2>
          </div>
        </div>
      )}
      <div className="forecast-container">
          {dailyForecast.length > 0 && (
            <div className="five-day-forecast">
              <h2>Your 5 Day Forecast</h2>
              <div className="five-day-table">
                {dailyForecast.map((day, index) => (
                  <tbody key={index} className="five-day-row">
                    <tr>
                      <th>
                        <img
                          src={`http://openweathermap.org/img/w/${day.weather[0].icon}.png`}
                          alt={day.weather[0].description}
                        />
                      </th>
                      <th>{new Date(day.dt * 1000).toLocaleDateString("en-US", { weekday: "long" })}</th>
                      <th>{Math.round(day.main.temp)}°F</th>
                      <th>{day.weather[0].description}</th>
                    </tr>
                  </tbody>
                ))}
              </div>
            </div>
          )}
          {hourlyForecast.length > 0 && (
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
                    <p>{Math.round(hour.main.temp)}°F</p>
                    <p>{hour.weather[0].description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
    </div>
  )
}

export default ZipCode

