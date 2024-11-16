import React from 'react';

const WindyEmbed = () => {
  return (
    <iframe
      title="Windy Weather"
      width="100%"
      height="300" // Adjust the height as needed
      src="https://embed.windy.com/embed2.html?lat=50.4&lon=14.3&zoom=5&overlay=wind"
      frameBorder="0"
      style={{ borderRadius: '8px', marginTop: '2rem' }}
    ></iframe>
  );
};

export default WindyEmbed;
