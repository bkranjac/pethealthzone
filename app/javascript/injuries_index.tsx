import React from 'react';
import { createRoot } from 'react-dom/client';
import { InjuriesIndex } from './components/injuries/InjuriesIndex';

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('injuries_index');
  if (container) {
    const root = createRoot(container);
    root.render(<InjuriesIndex />);
  }
});
