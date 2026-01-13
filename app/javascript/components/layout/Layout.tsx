import React, { useState } from 'react';
import { Header, TabType } from './Header';
import { Sidebar } from './Sidebar';
import { Footer } from './Footer';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<TabType>('pets');

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#e5e7eb' }}>
      <Header activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="flex flex-1">
        <Sidebar activeTab={activeTab} />
        <main
          className="flex-1 overflow-y-auto bg-white"
          style={{
            borderRadius: '16px 16px 0 0',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
            position: 'relative',
          }}
        >
          {/* Inward rounded corner on top-left */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '16px',
              height: '16px',
              background: '#818cf8',
              borderBottomRightRadius: '16px'
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '16px',
                height: '16px',
                background: '#e5e7eb',
                borderTopLeftRadius: '16px'
              }}
            />
          </div>
          {/* Inward rounded corner on bottom-left */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              width: '16px',
              height: '16px',
              background: '#4f46e5',
              borderTopRightRadius: '16px'
            }}
          >
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                width: '16px',
                height: '16px',
                background: '#e5e7eb',
                borderBottomLeftRadius: '16px'
              }}
            />
          </div>
          <div style={{ padding: '24px' }}>
            {children}
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};
