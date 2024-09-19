// src/components/Dropdown.js
import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import axios from 'axios';

const Dropdown = ({ endpoint, setSelected, placeholder, label }) => {
  const [options, setOptions] = useState([]);
  
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/${endpoint}`);
        // Transform data to the format required by react-select
        const formattedOptions = response.data.map(item => ({
          value: item.StudentID || item.CohortID, // Use the appropriate key for value
          label: item.Name || item.CohortName, // Use the appropriate key for label
        }));
        setOptions(formattedOptions);
      } catch (error) {
        console.error('Error fetching options:', error);
      }
    };

    fetchOptions();
  }, [endpoint]);

  return (
    <div className="mb-4">
      <label className="block text-gray-700 text-sm font-bold mb-2">{label}</label>
      <Select
        options={options}
        onChange={setSelected}
        placeholder={placeholder}
        className="basic-single"
        classNamePrefix="select"
      />
    </div>
  );
};

export default Dropdown;
