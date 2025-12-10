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

// Import Frequency components
import { FrequenciesIndex } from './components/frequencies/FrequenciesIndex';
import { FrequencyShow } from './components/frequencies/FrequencyShow';
import { FrequencyForm } from './components/frequencies/FrequencyForm';

// Import Food components
import { FoodsIndex } from './components/foods/FoodsIndex';
import { FoodShow } from './components/foods/FoodShow';
import { FoodForm } from './components/foods/FoodForm';

// Import Medication components
import { MedicationsIndex } from './components/medications/MedicationsIndex';
import { MedicationShow } from './components/medications/MedicationShow';
import { MedicationForm } from './components/medications/MedicationForm';

// Import Vaccine components
import { VaccinesIndex } from './components/vaccines/VaccinesIndex';
import { VaccineShow } from './components/vaccines/VaccineShow';
import { VaccineForm } from './components/vaccines/VaccineForm';

// Import Check components
import { ChecksIndex } from './components/checks/ChecksIndex';
import { CheckShow } from './components/checks/CheckShow';
import { CheckForm } from './components/checks/CheckForm';

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

          {/* Frequencies routes */}
          <Route path="/frequencies" element={<FrequenciesIndex />} />
          <Route path="/frequencies/new" element={<FrequencyForm mode="new" />} />
          <Route path="/frequencies/:id" element={<FrequencyShow />} />
          <Route path="/frequencies/:id/edit" element={<FrequencyForm mode="edit" />} />

          {/* Foods routes */}
          <Route path="/foods" element={<FoodsIndex />} />
          <Route path="/foods/new" element={<FoodForm mode="new" />} />
          <Route path="/foods/:id" element={<FoodShow />} />
          <Route path="/foods/:id/edit" element={<FoodForm mode="edit" />} />

          {/* Medications routes */}
          <Route path="/medications" element={<MedicationsIndex />} />
          <Route path="/medications/new" element={<MedicationForm mode="new" />} />
          <Route path="/medications/:id" element={<MedicationShow />} />
          <Route path="/medications/:id/edit" element={<MedicationForm mode="edit" />} />

          {/* Vaccines routes */}
          <Route path="/vaccines" element={<VaccinesIndex />} />
          <Route path="/vaccines/new" element={<VaccineForm mode="new" />} />
          <Route path="/vaccines/:id" element={<VaccineShow />} />
          <Route path="/vaccines/:id/edit" element={<VaccineForm mode="edit" />} />

          {/* Checks routes */}
          <Route path="/checks" element={<ChecksIndex />} />
          <Route path="/checks/new" element={<CheckForm mode="new" />} />
          <Route path="/checks/:id" element={<CheckShow />} />
          <Route path="/checks/:id/edit" element={<CheckForm mode="edit" />} />

          {/* 404 Not Found */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
};
