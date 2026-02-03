import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const serif = "'EB Garamond', Georgia, serif";
const sans = "'Inter', system-ui, sans-serif";

export const PublicNavigation: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const linkStyle = (path: string): React.CSSProperties => ({
    fontFamily: sans,
    fontSize: '12px',
    fontWeight: 500,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    textDecoration: 'none',
    color: isActive(path) ? '#1a1919' : '#888',
    borderBottom: isActive(path) ? '1.5px solid #1a1919' : '1.5px solid transparent',
    paddingBottom: '2px',
    transition: 'color 0.2s, border-color 0.2s',
  });

  return (
    <nav style={{ backgroundColor: '#fff', borderBottom: '1px solid #eee' }}>
      <div style={{ maxWidth: '1140px', margin: '0 auto', padding: '20px 20px 0' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '16px' }}>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <span
              style={{
                fontFamily: serif,
                fontSize: '32px',
                fontWeight: 300,
                color: '#1a1919',
                letterSpacing: '0.04em',
              }}
            >
              PetHealthZone
            </span>
          </Link>
        </div>

        {/* Navigation Links */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '40px',
            paddingBottom: '16px',
          }}
        >
          <Link to="/" style={linkStyle('/')}>
            Home
          </Link>
          <Link to="/adopt" style={linkStyle('/adopt')}>
            Pets
          </Link>
          <Link to="/about" style={linkStyle('/about')}>
            About
          </Link>
          <a
            href="/users/sign_in"
            style={{
              fontFamily: sans,
              fontSize: '12px',
              fontWeight: 500,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              color: '#fff',
              backgroundColor: '#1a1919',
              padding: '6px 18px',
              borderRadius: '2px',
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#333'; }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#1a1919'; }}
          >
            Staff Login
          </a>
        </div>
      </div>
    </nav>
  );
};
