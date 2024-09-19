import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get('http://localhost:5000/students');
        setStudents(response.data);
        setFilteredStudents(response.data); // Set filtered list as well
        setLoading(false);
      } catch (error) {
        console.error('Error fetching students:', error.response ? error.response.data : error.message);
        setErrorMessage('Failed to load student data.');
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  // Search filter function
  useEffect(() => {
    if (searchTerm) {
      const filtered = students.filter(student =>
        student.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.Email.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredStudents(filtered);
    } else {
      setFilteredStudents(students);
    }
  }, [searchTerm, students]);

  const handleDelete = async (studentID) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await axios.delete(`http://localhost:5000/students/${studentID}`);
        setStudents(students.filter(student => student.StudentID !== studentID));
        setFilteredStudents(filteredStudents.filter(student => student.StudentID !== studentID));
      } catch (error) {
        console.error('Error deleting student:', error.response ? error.response.data : error.message);
        setErrorMessage('Failed to delete student.');
      }
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Student List</h2>
        <Link
          to="/add-student"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Add Student
        </Link>
      </div>
      <input
        type="text"
        placeholder="Search by name or email..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4 p-2 w-full border border-gray-300 rounded"
      />
      {errorMessage && <div className="text-red-600 mb-4">{errorMessage}</div>}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 table-auto">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cohort</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredStudents.length > 0 ? (
              filteredStudents.map(student => (
                <tr key={student.StudentID}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{student.Name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.Email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.CohortID}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link to={`/edit-student/${student.StudentID}`} className="text-indigo-600 hover:text-indigo-900 mr-4">
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(student.StudentID)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                  No students found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentList;
