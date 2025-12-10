import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { NotFound } from './components/common/NotFound';

// Import existing Pet components
import { PetsIndex } from './components/pets/PetsIndex';
import { PetShow } from './components/pets/PetShow';
import { PetForm } from './components/pets/PetForm';

// Import existing Injury components
import { InjuriesIndex } from './components/injuries/InjuriesIndex';
import { InjuryShow } from './components/injuries/InjuryShow';
import { InjuryForm } from './components/injuries/InjuryForm';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          {/* Root redirects to pets */}
          <Route path="/" element={<Navigate to="/pets" replace />} />

          {/* Pets routes */}
          <Route path="/pets" element={<PetsIndex />} />
          <Route path="/pets/new" element={<PetForm mode="new" />} />
          <Route path="/pets/:id" element={<PetShow />} />
          <Route path="/pets/:id/edit" element={<PetForm mode="edit" />} />

          {/* Injuries routes */}
          <Route path="/injuries" element={<InjuriesIndex />} />
          <Route path="/injuries/new" element={<InjuryForm mode="new" />} />
          <Route path="/injuries/:id" element={<InjuryShow />} />
          <Route path="/injuries/:id/edit" element={<InjuryForm mode="edit" />} />

          {/* 404 Not Found */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
};
