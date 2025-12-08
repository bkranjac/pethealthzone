require('@testing-library/jest-dom');

// Mock CSRF token
Object.defineProperty(document, 'querySelector', {
  writable: true,
  value: jest.fn((selector) => {
    if (selector === 'meta[name="csrf-token"]') {
      return { content: 'test-csrf-token' };
    }
    return null;
  }),
});

// Mock window.confirm
global.confirm = jest.fn(() => true);

// Mock window.alert
global.alert = jest.fn();

// Mock fetch
global.fetch = jest.fn();
