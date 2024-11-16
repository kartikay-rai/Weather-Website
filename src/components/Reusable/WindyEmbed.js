import React from 'react';

const WindyEmbed = () => {
  return (
    <iframe
      title="Windy Weather"
      width="100%"
      height="500" // Increased the height to 500px
      src="https://embed.windy.com/embed2.html?lat=20.5937&lon=78.9629&zoom=4&overlay=wind"
      frameBorder="0"
      style={{ borderRadius: '8px', marginTop: '2rem' }}
    ></iframe>
  );
};

export default WindyEmbed;
