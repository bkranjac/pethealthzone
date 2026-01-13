import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export type TabType = 'pets' | 'checkups' | 'injuries' | 'vaccines' | 'food' | 'schedules' | 'reports';

interface HeaderProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const tabs: { key: TabType; label: string }[] = [
  { key: 'pets', label: 'Pets' },
  { key: 'checkups', label: 'Checkups' },
  { key: 'injuries', label: 'Injuries' },
  { key: 'vaccines', label: 'Vaccines' },
  { key: 'food', label: 'Food' },
  { key: 'schedules', label: 'Schedules' },
  { key: 'reports', label: 'Reports' },
];

// Color palette from PostItCard
const tabColors = [
  '#fef3c7', // Yellow
  '#fce7f3', // Pink
  '#dbeafe', // Blue
  '#d1fae5', // Green
  '#e9d5ff', // Lavender
  '#fed7aa', // Peach
  '#ccfbf1', // Mint
];

export const Header: React.FC<HeaderProps> = ({ activeTab, onTabChange }) => {
  return (
    <header
      className="text-white shadow-md"
      style={{
        height: '70px',
        background: 'linear-gradient(90deg, #818cf8 0%, #6366f1 50%, #4f46e5 100%)'
      }}
    >
      <div className="h-full px-6 flex items-center justify-between">
        {/* Logo and title on the left */}
        <Link to="/" className="flex items-center hover:opacity-90 transition-opacity" style={{ gap: '1rem', textDecoration: 'none' }}>
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
            <span className="text-2xl font-bold" style={{ color: '#6366f1' }}>🐾</span>
          </div>
          <h1 className="text-2xl font-bold" style={{ color: 'white' }}>Pet Zone Health</h1>
        </Link>

        {/* Navigation tabs in the center - will connect to main content */}
        <nav className="flex items-center" style={{ gap: '0.25rem' }}>
          {tabs.map((tab, index) => {
            const isActive = activeTab === tab.key;
            const inactiveColor = tabColors[index % tabColors.length];

            return (
              <button
                key={tab.key}
                onClick={() => onTabChange(tab.key)}
                className="transition-all"
                style={{
                  padding: '1.25rem 1.5rem',
                  backgroundColor: isActive ? '#ffffff' : inactiveColor,
                  borderRadius: '12px 12px 0 0',
                  color: isActive ? '#4f46e5' : '#4f46e5',
                  border: isActive ? '2px solid #ffffff' : '2px solid transparent',
                  borderBottom: 'none',
                  cursor: 'pointer',
                  fontSize: '1.05rem',
                  fontWeight: isActive ? '700' : '500',
                  boxShadow: isActive
                    ? '0 -2px 4px rgba(0, 0, 0, 0.05)'
                    : '0 -1px 2px rgba(0, 0, 0, 0.03)',
                  marginBottom: '-2px',
                  position: 'relative',
                  zIndex: isActive ? 10 : 2,
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
