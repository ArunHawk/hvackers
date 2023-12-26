import React, { useState } from 'react';
import locJson from './drop.json'

const Dropdown = () => {
    const [location,setLocation] = useState(locJson);


    const handleAddCity = (event) => {
        if (event.key === 'Enter') {
          const newCity = event.target.value.trim();
          if (newCity !== '') {
            setLocation((prevLocation) => ({
              key: [...prevLocation.key, newCity]
            }));
            event.target.value = ''; // Clear the input field after adding the city
          }
        }
      };

  return (
    <div>
        {location.key.map((val,index)=>{
            return <p key={index}>{val}</p>
        })}
        <div>
        <input
          placeholder='Enter the city name and press Enter'
          type='text'
          style={{ width: `200px` }}
          onKeyUp={handleAddCity}
        />
        </div>
    </div>
  )
}

export default Dropdown