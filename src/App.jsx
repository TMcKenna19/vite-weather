import './App.css';
import WeatherLocation from './Components/WeatherLocation';
import Greeting from './Components/Greeting';
import ZipCode from './Components/ZipCode';

function App() {

  return (
    <>
      <Greeting/> 
      <ZipCode/>
      {/* <WeatherLocation/> */}
    </>
  )
}

export default App

//[x] Weather by city
//[x] Time of day greeting 
//[x] Weather by zip
//[x] Current time
//[x] Weather by location
//[x] Five day forcast 
//[x] Hourly forcast 
//[ ] Weather icon library 
//[ ] Background change time of day / weather