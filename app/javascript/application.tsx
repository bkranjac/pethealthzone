// Entry point for the build script in your package.json
import React from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';

document.addEventListener('DOMContentLoaded', () => {
  const rootElement = document.getElementById('root');
  if (rootElement) {
    const root = createRoot(rootElement);
    root.render(<App />);
  }
});
