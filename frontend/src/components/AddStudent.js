// src/components/AddStudent.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddStudent = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [selectedCohortName, setSelectedCohortName] = useState('');
  const [cohorts, setCohorts] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCohorts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/cohorts');
        setCohorts(response.data);
      } catch (error) {
        console.error('Error fetching cohorts:', error.response ? error.response.data : error.message);
        setErrorMessage('Failed to load cohort data.');
      }
    };

    fetchCohorts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post('http://localhost:5000/students', {
        Name: name,
        Email: email,
        CohortID: cohorts.find(c => c.Name === selectedCohortName)?.CohortID
      });

      navigate('/students');
    } catch (error) {
      console.error('Error adding student:', error.response ? error.response.data : error.message);
      setErrorMessage('Failed to add student.');
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Add Student</h2>
      {errorMessage && <div className="text-red-600 mb-4">{errorMessage}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Cohort</label>
          <select
            value={selectedCohortName}
            onChange={(e) => setSelectedCohortName(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            required
          >
            <option value="">Select a cohort</option>
            {cohorts.map(cohort => (
              <option key={cohort.CohortID} value={cohort.Name}>
                {cohort.Name}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          Add Student
        </button>
      </form>
    </div>
  );
};

export default AddStudent;
