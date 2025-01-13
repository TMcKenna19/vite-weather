import './App.css';
import Weather from './Components/Weather';
import Greeting from './Components/Greeting';
import ZipCode from './Components/ZipCode';

function App() {

  return (
    <>
      <Greeting/>
      <Weather/>
      <ZipCode/>
    </>
  )
}

export default App

//[x] Weather by city
//[x] Time of day greeting 
//[x] Weather by zip
//[ ] Weather by location
//[ ] (x)Day forcast 
//[ ] Hourly forcast 
//[ ] Background change time of day / weather