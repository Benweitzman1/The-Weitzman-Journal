import React from 'react';
import LogoImage from './Logo.png';

const Logo = () => {
  return (
    <div
      className="logoContainer"
      style={{
        background: `url(${LogoImage}) no-repeat`,
        backgroundSize: 'cover',
        width: '100%',
        height: '100%',
      }}
    />
  );
};

export default Logo;



