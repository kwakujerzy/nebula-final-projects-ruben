import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';

const AttendanceList = () => {
  const { studentName } = useParams();
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const searchTimeoutRef = useRef(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get('http://localhost:5000/students');
        return response.data;
      } catch (error) {
        setErrorMessage('Failed to load student data.');
        return [];
      }
    };

    const fetchAttendanceRecords = async () => {
      try {
        const response = await axios.get('http://localhost:5000/attendance');
        const attendanceData = response.data;
        const studentData = await fetchStudents();

        // Create a map for quick student name lookup
        const studentMap = {};
        studentData.forEach(student => {
          studentMap[student.StudentID] = student.Name;
        });

        // Map attendance records with student names
        const updatedRecords = attendanceData.map(record => ({
          ...record,
          studentName: studentMap[record.studentId] || 'Unknown' // Default to 'Unknown' if not found
        }));

        setAttendanceRecords(updatedRecords);
        setFilteredRecords(updatedRecords);
      } catch (error) {
        setErrorMessage('Failed to load attendance records.');
      } finally {
        setLoading(false);
      }
    };

    fetchAttendanceRecords();
  }, []);

  const handleSearch = useCallback((term) => {
    const filtered = attendanceRecords.filter(record =>
      record.date.includes(term) || record.status.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredRecords(filtered);
  }, [attendanceRecords]);

  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      handleSearch(searchTerm);
    }, 300);

    return () => {
      clearTimeout(searchTimeoutRef.current);
    };
  }, [searchTerm, handleSearch]);

  const handleDelete = async (attendanceId) => {
    if (window.confirm('Are you sure you want to delete this attendance record?')) {
      try {
        await axios.delete(`http://localhost:5000/attendance/${attendanceId}`);
        setAttendanceRecords(attendanceRecords.filter(record => record.attendanceId !== attendanceId));
        setFilteredRecords(filteredRecords.filter(record => record.attendanceId !== attendanceId));
      } catch (error) {
        setErrorMessage('Failed to delete attendance record.');
      }
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Attendance Records</h2>
        <Link
          to={`/add-attendance/${studentName}`}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Add Attendance
        </Link>
      </div>
      <input
        type="text"
        placeholder="Search by date or status..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4 p-2 w-full border border-gray-300 rounded"
      />
      {errorMessage && <div className="text-red-600 mb-4">{errorMessage}</div>}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 table-auto">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredRecords.length > 0 ? (
              filteredRecords.map(record => (
                <tr key={record.attendanceId}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{record.studentName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{record.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.status}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link to={`/edit-attendance/${record.attendanceId}`} className="text-indigo-600 hover:text-indigo-900 mr-4">
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(record.attendanceId)}
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
                  No attendance records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AttendanceList;
