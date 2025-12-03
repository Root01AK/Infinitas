// app/career/CareerClient.js
"use client";

import React, { useRef } from 'react';

export default function CareerClient({ initialData }) {
  const listRef = useRef(null);
  
  // Use default values if no data is provided
  const careerData = initialData || {
    bannerImage: "/abt1.jpg",
    bannerTitle: "Careers at Infinitas",
    buttonText: "See Open Positions",
    description: "Currently there is No Open Positions, Mail your CV & we'll get back to you."
  };

  const down = () => {
    if (listRef.current) {
      listRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className='careers-container'>
      <div 
        className="careers-section"
        style={{
          backgroundImage: `url("${careerData.bannerImage}")`,
        }}
      >
        <div className="careers-heading">
          <h1>{careerData.bannerTitle}</h1>
        </div>
      </div>
      <div className="careers-open-position">
        <button type="button" onClick={down}>
          {careerData.buttonText}
        </button>
      </div>
      <div className="careers-list" ref={listRef}>
        <p>{careerData.description}</p>
        <a href='mailto:info@infinitasadvisory.com'>info@infinitasadvisory.com</a>
      </div>
    </div>
  );
}