import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AssignmentsForm = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [assignmentName, setAssignmentName] = useState('');
  const [completionStatus, setCompletionStatus] = useState('Incomplete');
  const [dueDate, setDueDate] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get('http://localhost:5000/students');
        console.log('Fetched students:', response.data); // Log the response data
        setStudents(response.data);
      } catch (error) {
        console.error('Error fetching students:', error);
        setErrorMessage('Failed to load students.');
      }
    };

    fetchStudents();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    try {
      await axios.post('http://localhost:5000/assignments', {
        assignmentId: Date.now(),
        studentId: selectedStudentId,
        assignmentName,
        completionStatus,
        dueDate,
      });
      setSuccessMessage('Assignment created successfully!');
      // Reset form fields
      setSelectedStudentId('');
      setAssignmentName('');
      setDueDate('');
    } catch (error) {
      console.error('Error creating assignment:', error);
      setErrorMessage('Failed to create assignment.');
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Add Assignment</h2>
      {errorMessage && <div className="text-red-600 mb-4">{errorMessage}</div>}
      {successMessage && <div className="text-green-600 mb-4">{successMessage}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700" htmlFor="studentId">
            Select Student
          </label>
          <select
            id="studentId"
            value={selectedStudentId}
            onChange={(e) => setSelectedStudentId(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-500"
            required
          >
            <option value="">Select a student</option>
            {students.map(student => (
              <option key={student.StudentID} value={student.StudentID}>
                {student.Name}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700" htmlFor="assignmentName">
            Assignment Name
          </label>
          <input
            type="text"
            id="assignmentName"
            value={assignmentName}
            onChange={(e) => setAssignmentName(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700" htmlFor="completionStatus">
            Completion Status
          </label>
          <select
            id="completionStatus"
            value={completionStatus}
            onChange={(e) => setCompletionStatus(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-500"
          >
            <option value="Incomplete">Incomplete</option>
            <option value="Complete">Complete</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700" htmlFor="dueDate">
            Due Date
          </label>
          <input
            type="date"
            id="dueDate"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-500"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Add Assignment
        </button>
      </form>
    </div>
  );
};

export default AssignmentsForm;
