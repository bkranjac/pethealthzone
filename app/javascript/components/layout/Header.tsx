import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export type TabType = 'pets' | 'checkups' | 'injuries' | 'vaccines' | 'food' | 'schedules';

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

        {/* Navigation tabs in the center */}
        <nav className="flex items-center" style={{ gap: '0.75rem' }}>
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => onTabChange(tab.key)}
              className="transition-all"
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: activeTab === tab.key ? '#ffffff' : 'rgba(255, 255, 255, 0.15)',
                borderRadius: '12px',
                color: activeTab === tab.key ? '#4f46e5' : '#ffffff',
                border: activeTab === tab.key ? '2px solid #ffffff' : '2px solid transparent',
                cursor: 'pointer',
                fontSize: '1.05rem',
                fontWeight: activeTab === tab.key ? '700' : '500',
                boxShadow: activeTab === tab.key
                  ? '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                  : 'none',
                transform: activeTab === tab.key ? 'translateY(-2px)' : 'translateY(0)',
              }}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
};
