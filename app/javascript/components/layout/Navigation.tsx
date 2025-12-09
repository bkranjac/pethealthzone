import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export const Navigation: React.FC = () => {
  const location = useLocation();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const isActive = (path: string) => location.pathname.startsWith(path);

  const toggleDropdown = (name: string) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  const closeDropdowns = () => {
    setOpenDropdown(null);
  };

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Brand/Logo */}
          <Link
            to="/"
            className="text-xl font-bold hover:text-blue-200 transition-colors"
            onClick={closeDropdowns}
          >
            PetHealthZone
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-1">
            {/* Pets */}
            <Link
              to="/pets"
              className={`px-3 py-2 rounded transition-colors ${
                isActive('/pets')
                  ? 'bg-blue-700 text-white'
                  : 'hover:bg-blue-700'
              }`}
              onClick={closeDropdowns}
            >
              Pets
            </Link>

            {/* Injuries */}
            <Link
              to="/injuries"
              className={`px-3 py-2 rounded transition-colors ${
                isActive('/injuries')
                  ? 'bg-blue-700 text-white'
                  : 'hover:bg-blue-700'
              }`}
              onClick={closeDropdowns}
            >
              Injuries
            </Link>

            {/* Medical Dropdown */}
            <div className="relative">
              <button
                onClick={() => toggleDropdown('medical')}
                className={`px-3 py-2 rounded transition-colors ${
                  isActive('/medications') ||
                  isActive('/vaccines') ||
                  isActive('/checks')
                    ? 'bg-blue-700 text-white'
                    : 'hover:bg-blue-700'
                }`}
              >
                Medical ▾
              </button>
              {openDropdown === 'medical' && (
                <div className="absolute top-full left-0 mt-1 bg-white text-gray-800 rounded shadow-lg py-1 min-w-48 z-50">
                  <Link
                    to="/medications"
                    className="block px-4 py-2 hover:bg-gray-100"
                    onClick={closeDropdowns}
                  >
                    Medications
                  </Link>
                  <Link
                    to="/vaccines"
                    className="block px-4 py-2 hover:bg-gray-100"
                    onClick={closeDropdowns}
                  >
                    Vaccines
                  </Link>
                  <Link
                    to="/checks"
                    className="block px-4 py-2 hover:bg-gray-100"
                    onClick={closeDropdowns}
                  >
                    Health Checks
                  </Link>
                </div>
              )}
            </div>

            {/* Schedules Dropdown */}
            <div className="relative">
              <button
                onClick={() => toggleDropdown('schedules')}
                className={`px-3 py-2 rounded transition-colors ${
                  isActive('/medication_schedules') ||
                  isActive('/vaccination_schedules') ||
                  isActive('/checks_schedules')
                    ? 'bg-blue-700 text-white'
                    : 'hover:bg-blue-700'
                }`}
              >
                Schedules ▾
              </button>
              {openDropdown === 'schedules' && (
                <div className="absolute top-full left-0 mt-1 bg-white text-gray-800 rounded shadow-lg py-1 min-w-56 z-50">
                  <Link
                    to="/medication_schedules"
                    className="block px-4 py-2 hover:bg-gray-100"
                    onClick={closeDropdowns}
                  >
                    Medication Schedules
                  </Link>
                  <Link
                    to="/vaccination_schedules"
                    className="block px-4 py-2 hover:bg-gray-100"
                    onClick={closeDropdowns}
                  >
                    Vaccination Schedules
                  </Link>
                  <Link
                    to="/checks_schedules"
                    className="block px-4 py-2 hover:bg-gray-100"
                    onClick={closeDropdowns}
                  >
                    Check Schedules
                  </Link>
                </div>
              )}
            </div>

            {/* More Dropdown */}
            <div className="relative">
              <button
                onClick={() => toggleDropdown('more')}
                className={`px-3 py-2 rounded transition-colors ${
                  isActive('/foods') ||
                  isActive('/pet_foods') ||
                  isActive('/frequencies') ||
                  isActive('/injury_reports')
                    ? 'bg-blue-700 text-white'
                    : 'hover:bg-blue-700'
                }`}
              >
                More ▾
              </button>
              {openDropdown === 'more' && (
                <div className="absolute top-full right-0 mt-1 bg-white text-gray-800 rounded shadow-lg py-1 min-w-48 z-50">
                  <Link
                    to="/foods"
                    className="block px-4 py-2 hover:bg-gray-100"
                    onClick={closeDropdowns}
                  >
                    Foods
                  </Link>
                  <Link
                    to="/pet_foods"
                    className="block px-4 py-2 hover:bg-gray-100"
                    onClick={closeDropdowns}
                  >
                    Pet Foods
                  </Link>
                  <Link
                    to="/frequencies"
                    className="block px-4 py-2 hover:bg-gray-100"
                    onClick={closeDropdowns}
                  >
                    Frequencies
                  </Link>
                  <Link
                    to="/injury_reports"
                    className="block px-4 py-2 hover:bg-gray-100"
                    onClick={closeDropdowns}
                  >
                    Injury Reports
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Overlay to close dropdowns when clicking outside */}
      {openDropdown && (
        <div
          className="fixed inset-0 z-40"
          onClick={closeDropdowns}
        ></div>
      )}
    </nav>
  );
};
