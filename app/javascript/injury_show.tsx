import React from 'react';
import { createRoot } from 'react-dom/client';
import { InjuryShow } from './components/injuries/InjuryShow';

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('injury_show');
  if (container) {
    const injuryId = parseInt(container.dataset.injuryId || '0', 10);
    const root = createRoot(container);
    root.render(<InjuryShow injuryId={injuryId} />);
  }
});
