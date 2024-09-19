import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const CohortList = () => {
  const [cohorts, setCohorts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCohortName, setNewCohortName] = useState('');
  const [newCohortDescription, setNewCohortDescription] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate(); // Initialize navigate

  useEffect(() => {
    const fetchCohorts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/cohorts');
        setCohorts(response.data);
      } catch (error) {
        console.error('Error fetching cohorts:', error);
      }
    };

    fetchCohorts();
  }, []);

  const handleDelete = async (cohortID) => {
    try {
      await axios.delete(`http://localhost:5000/cohorts/${cohortID}`);
      setCohorts(cohorts.filter(cohort => cohort.CohortID !== cohortID));
    } catch (error) {
      console.error('Error deleting cohort:', error);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleAddCohort = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/cohorts', {
        Name: newCohortName,
        Description: newCohortDescription,
      });
      setShowAddForm(false);
      setNewCohortName('');
      setNewCohortDescription('');
      setErrorMessage('');
      // Refetch the cohort list
      const response = await axios.get('http://localhost:5000/cohorts');
      setCohorts(response.data);
    } catch (error) {
      console.error('Error adding cohort:', error.response ? error.response.data : error.message);
      setErrorMessage('Failed to add cohort.');
    }
  };

  const filteredCohorts = cohorts.filter(cohort =>
    cohort.Name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 bg-gray-50 rounded-lg shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Cohort List</h2>
        <button
          onClick={() => navigate('/cohorts/add')}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition duration-300"
        >
          Add Cohort
        </button>
      </div>
      <div className="mb-6">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Search cohorts..."
          className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>
      {showAddForm && (
        <form onSubmit={handleAddCohort} className="mb-8 p-6 border border-gray-300 rounded-lg shadow-sm bg-white">
          <h3 className="text-xl font-semibold mb-4">Add New Cohort</h3>
          {errorMessage && <div className="text-red-600 mb-4">{errorMessage}</div>}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              value={newCohortName}
              onChange={(e) => setNewCohortName(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={newCohortDescription}
              onChange={(e) => setNewCohortDescription(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition duration-300"
          >
            Add Cohort
          </button>
        </form>
      )}
      <ul>
        {filteredCohorts.map(cohort => (
          <li key={cohort.CohortID} className="flex justify-between items-center mb-4 p-4 border border-gray-300 rounded-lg bg-white shadow-sm">
            <div>
              <h3 className="text-xl font-semibold text-gray-800">{cohort.Name}</h3>
              <p className="text-gray-600">{cohort.Description}</p>
            </div>
            <div>
              <button
                onClick={() => navigate(`/cohorts/edit/${cohort.CohortID}`)}
                className="px-4 py-2 bg-yellow-600 text-white rounded-lg shadow-md hover:bg-yellow-700 transition duration-300 mr-2"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(cohort.CohortID)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 transition duration-300"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CohortList;
