import React from 'react';
import { createRoot } from 'react-dom/client';
import { InjuryForm } from './components/injuries/InjuryForm';

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('injury_form');
  if (container) {
    const mode = (container.dataset.mode || 'new') as 'new' | 'edit';
    const injuryId = container.dataset.injuryId ? parseInt(container.dataset.injuryId, 10) : undefined;
    const root = createRoot(container);
    root.render(<InjuryForm mode={mode} injuryId={injuryId} />);
  }
});
