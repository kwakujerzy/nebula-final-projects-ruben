// src/components/StatsCard.js
import React from 'react';

const StatsCard = ({ title, value }) => (
  <div className="bg-white p-4 rounded-lg shadow-md">
    <h3 className="text-xl font-semibold">{title}</h3>
    <p className="text-2xl font-bold mt-2">{value}</p>
  </div>
);

export default StatsCard;
