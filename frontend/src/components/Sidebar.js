import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => (
  <aside className="w-64 md:w-48 bg-gradient-to-b from-gray-800 to-gray-900 text-white p-4 shadow-lg transition-all duration-300 ease-in-out">
    <h2 className="text-2xl font-bold mb-6 text-center">Dashboard</h2>
    <ul className="space-y-4">
      <li>
        <Link
          to="/"
          className="flex items-center py-2 px-4 rounded-md hover:bg-gray-700 transition-colors"
        >
          Dashboard
        </Link>
      </li>
      <li>
        <Link
          to="/students"
          className="flex items-center py-2 px-4 rounded-md hover:bg-gray-700 transition-colors"
        >
          Students
        </Link>
      </li>
      <li>
        <Link
          to="/cohorts"
          className="flex items-center py-2 px-4 rounded-md hover:bg-gray-700 transition-colors"
        >
          Cohorts
        </Link>
      </li>
      <li>
        <Link
          to="/attendance"
          className="flex items-center py-2 px-4 rounded-md hover:bg-gray-700 transition-colors"
        >
          Attendance
        </Link>
      </li>
     {/* <li>
        <Link
          to="/assignments"
          className="flex items-center py-2 px-4 rounded-md hover:bg-gray-700 transition-colors"
        >
          Assignments
        </Link>
      </li>*/}
      
      <li>
        <Link
          to="/assignments/new"
          className="flex items-center py-2 px-4 rounded-md hover:bg-gray-700 transition-colors"
        >
          New Assignment
        </Link>
      </li>
    </ul>
  </aside>
);

export default Sidebar;
