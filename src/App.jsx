import './App.css';
import Weather from './Components/Weather';
import Greeting from './Components/Greeting';
import ZipCode from './Components/ZipCode';

function App() {

  return (
    <>
      {/* <Weather/> */}
      <Greeting/>
      <ZipCode/>
    </>
  )
}

export default App

//[x] Weather by city
//[x] Time of day greeting 
//[x] Weather by zip
//[x] As of current time 
//[ ] Weather by location
//[ ] (x)Day forcast 
//[ ] Hourly forcast 
//[ ] Background change time of day / weather