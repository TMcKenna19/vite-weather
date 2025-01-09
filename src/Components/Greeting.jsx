import React from 'react';
import { useState, useEffect } from 'react';

const Greeting = () => {
    const [greeting, setGreeting] = useState('');
    useEffect(() => {
      const currentHour = new Date().getHours();
      if(currentHour >= 5 && currentHour < 12) {
        setGreeting('Good Morning');
      }else if (currentHour >= 12 && currentHour < 18) {
        setGreeting('Good Afternoon');
      }else {
        setGreeting('Good Evening')
      }
    }, []);

  return (
    <div>
      <h1>{greeting}</h1>
    </div>
  )
}

export default Greeting;