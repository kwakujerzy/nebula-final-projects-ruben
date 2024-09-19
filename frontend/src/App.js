import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import StatsCard from './components/StatsCard';
import StudentList from './components/StudentList';
import CohortList from './components/CohortList';
import AddCohort from './components/AddCohort';
import EditCohort from './components/EditCohort';
import AddStudent from './components/AddStudent';
import EditStudent from './components/EditStudent';
import Dropdown from './components/Dropdown';
import AttendanceList from './components/AttendanceList';
import AddAttendance from './components/AddAttendance';
import EditAttendance from './components/EditAttendance';

import axios from 'axios';

const App = () => {
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedCohort, setSelectedCohort] = useState(null);
  const [totalStudents, setTotalStudents] = useState(0);
  const [totalCohorts, setTotalCohorts] = useState(0);
  const [attendanceRate, setAttendanceRate] = useState('N/A');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const studentsResponse = await axios.get('http://localhost:5000/students');
        const cohortsResponse = await axios.get('http://localhost:5000/cohorts');

        setTotalStudents(studentsResponse.data.length);
        setTotalCohorts(cohortsResponse.data.length);
        setAttendanceRate('95%'); // Placeholder value
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <Router>
      <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
        {/* Sidebar */}
        <button 
          className="p-4 bg-blue-600 text-white md:hidden" 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
          {isSidebarOpen ? 'Close Menu' : 'Open Menu'}
        </button>
        {isSidebarOpen && <Sidebar />}
        <Sidebar className="hidden md:block" />

        {/* Main Content */}
        <div className="flex-1">
          <Header />
          <main className="p-6 bg-gray-100 min-h-screen">
            <Routes>
              <Route
                path="/"
                element={
                  <>
                    {/* Welcome Message */}
                    <h2 className="text-4xl md:text-5xl font-bold mb-6 text-center text-gray-900">Welcome to Nebula Dashboard</h2>
                    
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      <StatsCard title="Total Students" value={totalStudents} />
                      <StatsCard title="Cohorts" value={totalCohorts} />
                      <StatsCard title="Attendance Rate" value={attendanceRate} />
                    </div>

                    {/* Dropdowns */}
                    <div className="mt-8">
                      <Dropdown
                        endpoint="students"
                        setSelected={setSelectedStudent}
                        placeholder="Choose a student..."
                        label="Select a Student"
                      />
                      <Dropdown
                        endpoint="cohorts"
                        setSelected={setSelectedCohort}
                        placeholder="Choose a cohort..."
                        label="Select a Cohort"
                      />
                    </div>

                    {/* Selection Summary */}
                    <div className="mt-6 p-4 bg-white rounded-lg shadow-md">
                      <h3 className="text-xl font-bold">Selection Summary</h3>
                      <p className="mt-2 text-gray-700">
                        {selectedStudent
                          ? `Selected Student: ${selectedStudent.label}`
                          : 'No student selected.'}
                      </p>
                      <p className="mt-2 text-gray-700">
                        {selectedCohort
                          ? `Selected Cohort: ${selectedCohort.label}`
                          : 'No cohort selected.'}
                      </p>
                    </div>
                  </>
                }
              />
              <Route path="/students" element={<StudentList />} />
              <Route path="/add-student" element={<AddStudent />} />
              <Route path="/edit-student/:studentId" element={<EditStudent />} />
              <Route path="/cohorts" element={<CohortList />} />
              <Route path="/cohorts/add" element={<AddCohort />} />
              <Route path="/cohorts/edit/:id" element={<EditCohort />} />
              <Route path="/attendance" element={<AttendanceList />} />
              <Route path="/add-attendance/:studentId" element={<AddAttendance />} />
              <Route path="/edit-attendance/:attendanceId" element={<EditAttendance />} />
              <Route path="/attendance/:studentName" component={AttendanceList} />
              <Route path="/add-attendance/:studentName" component={AddAttendance} />  
              
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
};

export default App;
