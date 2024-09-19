import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => (
  <aside className="w-48 bg-gray-800 text-white p-4 flex flex-col">
    <ul className="flex-1">
      <li className="mb-2">
        <Link
          to="/"
          className="block py-2 px-4 rounded-md text-lg font-semibold hover:bg-gray-700 transition-colors"
        >
          Dashboard
        </Link>
      </li>
      <li className="mb-2">
        <Link
          to="/students"
          className="block py-2 px-4 rounded-md text-lg font-semibold hover:bg-gray-700 transition-colors"
        >
          Students
        </Link>
      </li>
      <li className="mb-2">
        <Link
          to="/cohorts"
          className="block py-2 px-4 rounded-md text-lg font-semibold hover:bg-gray-700 transition-colors"
        >
          Cohorts
        </Link>
      </li>

      <li className="mb-2">
        <Link
          to="/attendance"
          className="block py-2 px-4 rounded-md text-lg font-semibold hover:bg-gray-700 transition-colors"
        >
          Attendance
        </Link>
      </li>
      <li className="mb-2">
        <Link
          to="#"
          className="block py-2 px-4 rounded-md text-lg font-semibold hover:bg-gray-700 transition-colors"
        >
          Assigments
        </Link>
      </li>


    </ul>
  </aside>
);

export default Sidebar;

