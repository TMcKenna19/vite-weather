import './App.css';
import WeatherLocation from './Components/WeatherLocation';
import Greeting from './Components/Greeting';
import ZipCode from './Components/ZipCode';

function App() {

  return (
    <>
      <Greeting/>
      <WeatherLocation/>
      {/* <ZipCode/> */}
    </>
  )
}

export default App

//[x] Weather by city
//[x] Time of day greeting 
//[x] Weather by zip
//[x] As of current time
//[x] Weather by location
//[ ] Five day forcast 
//[ ] Weather icon library 
//[ ] (x)Day forcast 
//[ ] Hourly forcast 
//[ ] Background change time of day / weather