import React from 'react';
import { createRoot } from 'react-dom/client';
import { PetsIndex } from './components/pets/PetsIndex';
import { PetShow } from './components/pets/PetShow';
import { PetForm } from './components/pets/PetForm';

document.addEventListener('DOMContentLoaded', () => {
  const indexContainer = document.getElementById('pets-index-root');
  if (indexContainer) {
    const root = createRoot(indexContainer);
    root.render(<PetsIndex />);
  }

  const showContainer = document.getElementById('pet-show-root');
  if (showContainer) {
    const petId = parseInt(showContainer.dataset.petId || '0', 10);
    const root = createRoot(showContainer);
    root.render(<PetShow petId={petId} />);
  }

  const newContainer = document.getElementById('pet-new-root');
  if (newContainer) {
    const root = createRoot(newContainer);
    root.render(<PetForm mode="new" />);
  }

  const editContainer = document.getElementById('pet-edit-root');
  if (editContainer) {
    const petId = parseInt(editContainer.dataset.petId || '0', 10);
    const root = createRoot(editContainer);
    root.render(<PetForm mode="edit" petId={petId} />);
  }
});
