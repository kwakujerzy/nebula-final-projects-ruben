import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AllAssignments = ({ studentId }) => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/assignments/${studentId}`);
        setAssignments(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchAssignments();
  }, [studentId]);

  const filteredAssignments = assignments.filter((assignment) =>
    assignment.assignmentName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddAssignment = () => {
    // Logic to add a new assignment (can open a modal with a form)
    alert("Add Assignment clicked!");
  };

  if (loading) {
    return <p>Loading assignments...</p>;
  }

  if (error) {
    return <p>Error loading assignments: {error}</p>;
  }

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">All Assignments for Student ID: {studentId}</h2>
        <button 
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700" 
          onClick={handleAddAssignment}>
          Add Assignment
        </button>
      </div>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search assignments..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full mb-6 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />

      {/* Assignment List */}
      {filteredAssignments.length > 0 ? (
        <ul className="space-y-4">
          {filteredAssignments.map((assignment, index) => (
            <li key={index} className="border p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <p className="font-medium text-lg">Assignment Name: {assignment.assignmentName}</p>
              <p className="text-gray-700">Completion Status: {assignment.completionStatus}</p>
              <p className="text-gray-500">Due Date: {assignment.dueDate}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-600">No assignments found for this student.</p>
      )}
    </div>
  );
};

export default AllAssignments;
