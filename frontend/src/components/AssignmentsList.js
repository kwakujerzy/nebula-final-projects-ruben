import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';

const AssignmentsList = () => {
  const { studentId } = useParams();
  const [assignments, setAssignments] = useState([]);
  const [studentName, setStudentName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const assignmentsResponse = await axios.get(`http://localhost:5000/assignments/${studentId}`);
        setAssignments(assignmentsResponse.data);
        
        // Fetch the student's name based on studentId
        const studentResponse = await axios.get(`http://localhost:5000/students/${studentId}`);
        setStudentName(studentResponse.data.Name);
      } catch (error) {
        console.error('Error fetching assignments:', error.response ? error.response.data : error.message);
        setErrorMessage('Failed to load assignments.');
      }
    };

    fetchAssignments();
  }, [studentId]);

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Assignments for {studentName} (ID: {studentId})</h2>
      {errorMessage && <div className="text-red-600 mb-4">{errorMessage}</div>}
      {assignments.length === 0 ? (
        <div className="text-gray-500">No assignments found.</div>
      ) : (
        <ul className="space-y-4">
          {assignments.map(assignment => (
            <li key={assignment.assignmentId} className="p-4 border border-gray-300 rounded-md">
              <h3 className="text-lg font-semibold">{assignment.assignmentName}</h3>
              <p className="text-gray-700">Status: {assignment.completionStatus}</p>
              <p className="text-gray-500">Due: {assignment.dueDate}</p>
            </li>
          ))}
        </ul>
      )}
      <Link
        to="/students" // Adjust this path based on your routing setup
        className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
      >
        Back to Student List
      </Link>
    </div>
  );
};

export default AssignmentsList;
