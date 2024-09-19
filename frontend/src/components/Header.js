import React from 'react';
import logo from '../assets/logo.jpeg'; // Going up one directory to access assets

const Header = () => (
  <header className="bg-white p-4 shadow-lg border-b border-gray-200 flex items-center justify-between">
    {/* Logo */}
    <img 
      src={logo} 
      alt="Nebula Logo" 
      className="h-8 md:h-10 object-contain"
    />
  </header>
);

export default Header;
