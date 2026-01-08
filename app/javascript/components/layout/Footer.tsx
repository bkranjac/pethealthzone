import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer
      className="text-white py-4 mt-auto"
      style={{ background: 'linear-gradient(90deg, #4f46e5 0%, #6366f1 50%, #818cf8 100%)' }}
    >
      <div className="container mx-auto px-6 text-center">
        <p className="text-sm font-semibold" style={{ color: 'white', textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}>
          Copyright &copy; by PetZone 2025
        </p>
      </div>
    </footer>
  );
};
