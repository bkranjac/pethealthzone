import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { TabType } from './Header';

interface SidebarProps {
  activeTab: TabType;
}

interface NavItem {
  path: string;
  label: string;
  icon: string;
  indented?: boolean;
}

const getSidebarItems = (tab: TabType): NavItem[] => {
  switch (tab) {
    case 'pets':
      return [
        { path: '/pets', label: 'Pets', icon: '🐾' },
        { path: '/pets', label: 'All Pets', icon: '', indented: true },
        { path: '/injuries/new', label: 'Report an Injury', icon: '', indented: true },
        { path: '/checks/new', label: 'Perform a Check', icon: '', indented: true },
        { path: '/pet_foods/new', label: 'Assign Food', icon: '', indented: true },
        { path: '/vaccination_schedules/new', label: 'Vaccinations', icon: '', indented: true },
        { path: '/pets/adopted=true', label: 'Adoptions', icon: '', indented: true },
      ];
    case 'checkups':
      return [
        { path: '/checks', label: 'Checkups', icon: '🏥' },
        { path: '/checks', label: 'Show all checkups', icon: '', indented: true },
        { path: '/checks_schedules', label: 'Checkup Schedules', icon: '', indented: true },
      ];
    case 'injuries':
      return [
        { path: '/injuries', label: 'Injuries', icon: '🩹' },
        { path: '/injury_reports', label: 'Injury Reports', icon: '📋' },
      ];
    case 'vaccines':
      return [
        { path: '/vaccines', label: 'Vaccines', icon: '💉' },
        { path: '/vaccination_schedules', label: 'Vaccination Schedules', icon: '📅' },
      ];
    case 'food':
      return [
        { path: '/foods', label: 'Foods', icon: '🍖' },
        { path: '/pet_foods', label: 'Pet Specific Foods', icon: '🍽️' },
      ];
    case 'schedules':
      return [
        { path: '/medication_schedules', label: 'Medication Schedules', icon: '📅' },
        { path: '/vaccination_schedules', label: 'Vaccination Schedules', icon: '📅' },
        { path: '/checks_schedules', label: 'Check Schedules', icon: '📅' },
        { path: '/frequencies', label: 'Frequencies', icon: '🔄' },
      ];
    default:
      return [];
  }
};

export const Sidebar: React.FC<SidebarProps> = ({ activeTab }) => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname.startsWith(path);

  const navItems = getSidebarItems(activeTab);

  return (
    <aside
      className="text-white flex-shrink-0 overflow-y-auto"
      style={{
        width: '250px',
        background: 'linear-gradient(180deg, #818cf8 0%, #6366f1 50%, #4f46e5 100%)',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        position: 'relative'
      }}
    >
      <nav className="py-6 px-3">
        {navItems.map((item, index) => {
          const itemIsActive = isActive(item.path);
          const isMainItem = !item.indented;

          return (
            <Link
              key={`${item.path}-${index}`}
              to={item.path}
              className="flex items-center transition-all"
              style={{
                padding: isMainItem ? '1rem 1.25rem' : '0.75rem 1rem 0.75rem 2.5rem',
                marginBottom: isMainItem ? '0.75rem' : '0.5rem',
                backgroundColor: itemIsActive && isMainItem
                  ? '#ffffff'
                  : itemIsActive && !isMainItem
                  ? 'rgba(255, 255, 255, 0.25)'
                  : 'rgba(255, 255, 255, 0.1)',
                borderRadius: isMainItem ? '12px' : '8px',
                border: itemIsActive && isMainItem
                  ? '2px solid #ffffff'
                  : '2px solid transparent',
                color: itemIsActive && isMainItem ? '#4f46e5' : '#ffffff',
                fontWeight: itemIsActive && isMainItem ? '700' : itemIsActive ? '600' : '500',
                fontSize: isMainItem ? '1rem' : '0.9rem',
                textDecoration: 'none',
                boxShadow: itemIsActive && isMainItem
                  ? '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                  : 'none',
                transform: itemIsActive && isMainItem ? 'translateX(4px)' : 'translateX(0)',
              }}
            >
              {item.icon && (
                <span
                  className="mr-3"
                  style={{
                    fontSize: isMainItem ? '1.5rem' : '1rem',
                    filter: itemIsActive && isMainItem ? 'none' : 'brightness(1.2)'
                  }}
                >
                  {item.icon}
                </span>
              )}
              <span style={{ fontWeight: 'inherit' }}>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};
