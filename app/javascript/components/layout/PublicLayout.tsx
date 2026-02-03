import React from 'react';
import { PublicNavigation } from './PublicNavigation';
import { Footer } from './Footer';

interface PublicLayoutProps {
  children: React.ReactNode;
}

export const PublicLayout: React.FC<PublicLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <PublicNavigation />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
};
