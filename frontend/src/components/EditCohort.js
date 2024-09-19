import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const EditCohort = () => {
  const { id } = useParams(); // Extract cohort ID from route params
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchCohort = async () => {
      if (!id) {
        setErrorMessage('Cohort ID is not provided.');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`http://localhost:5000/cohort/${id}`);
        console.log('Cohort Data:', response.data); // Debugging line
        const cohortData = response.data;

        if (cohortData) {
          setName(cohortData.Name || '');
          setDescription(cohortData.Description || '');
        } else {
          setErrorMessage('Cohort not found.');
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching cohort data:', error.response ? error.response.data : error.message);
        setErrorMessage('Failed to load cohort data.');
        setLoading(false);
      }
    };

    fetchCohort();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.put(`http://localhost:5000/cohort/${id}`, {
        CohortID: id,
        Name: name,
        Description: description
      });

      navigate('/cohorts');
    } catch (error) {
      console.error('Error updating cohort data:', error.response ? error.response.data : error.message);
      setErrorMessage('Failed to update cohort data.');
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-3xl font-semibold mb-6 text-gray-800">Edit Cohort</h2>
      {errorMessage && <div className="text-red-600 mb-4">{errorMessage}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Enter cohort name"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Enter cohort description"
            rows="4"
            required
          />
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition duration-300"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditCohort;
