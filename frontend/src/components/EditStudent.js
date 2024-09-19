import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const EditStudent = () => {
  const { studentId } = useParams(); // Extract studentId from route params
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [selectedCohortName, setSelectedCohortName] = useState('');
  const [cohorts, setCohorts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchStudentAndCohorts = async () => {
      if (!studentId) {
        setErrorMessage('Student ID is not provided.');
        setLoading(false);
        return;
      }

      try {
        // Fetch all students
        const studentsResponse = await axios.get('http://localhost:5000/students');
        console.log('Students Response:', studentsResponse.data);

        // Find the specific student
        const studentData = studentsResponse.data.find(student => student.StudentID === studentId);
        console.log('Student Data:', studentData);

        if (studentData) {
          setName(studentData.Name);
          setEmail(studentData.Email);

          // Fetch cohorts for the dropdown
          const cohortResponse = await axios.get('http://localhost:5000/cohorts');
          console.log('Cohorts Response:', cohortResponse.data);

          setCohorts(cohortResponse.data);

          // Set selected cohort name based on student's CohortID
          const studentCohort = cohortResponse.data.find(c => c.CohortID === studentData.CohortID);
          setSelectedCohortName(studentCohort ? studentCohort.Name : '');
        } else {
          setErrorMessage('Student not found.');
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching student or cohort data:', error.response ? error.response.data : error.message);
        setErrorMessage('Failed to load student or cohort data.');
        setLoading(false);
      }
    };

    fetchStudentAndCohorts();
  }, [studentId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Make the PUT request to update student data
      await axios.put(`http://localhost:5000/students/${studentId}`, {
        Name: name,
        Email: email,
        CohortID: cohorts.find(c => c.Name === selectedCohortName)?.CohortID
      });
      // Redirect to the students list page after a successful update
      navigate('/students');
    } catch (error) {
      console.error('Error updating student data:', error.response ? error.response.data : error.message);
      setErrorMessage('Failed to update student data.');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Edit Student</h2>
      {errorMessage && <div className="text-red-600 mb-4">{errorMessage}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Cohort</label>
          <select
            value={selectedCohortName}
            onChange={(e) => setSelectedCohortName(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
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
          Save
        </button>
      </form>
    </div>
  );
};

export default EditStudent;
