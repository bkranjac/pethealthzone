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

// Import MedicationSchedule components
import { MedicationSchedulesIndex } from './components/medication_schedules/MedicationSchedulesIndex';
import { MedicationScheduleShow } from './components/medication_schedules/MedicationScheduleShow';
import { MedicationScheduleForm } from './components/medication_schedules/MedicationScheduleForm';

// Import VaccinationSchedule components
import { VaccinationSchedulesIndex } from './components/vaccination_schedules/VaccinationSchedulesIndex';
import { VaccinationScheduleShow } from './components/vaccination_schedules/VaccinationScheduleShow';
import { VaccinationScheduleForm } from './components/vaccination_schedules/VaccinationScheduleForm';

// Import PetFood components
import { PetFoodsIndex } from './components/pet_foods/PetFoodsIndex';
import { PetFoodShow } from './components/pet_foods/PetFoodShow';
import { PetFoodForm } from './components/pet_foods/PetFoodForm';

// Import ChecksSchedule components
import { ChecksSchedulesIndex } from './components/checks_schedules/ChecksSchedulesIndex';
import { ChecksScheduleShow } from './components/checks_schedules/ChecksScheduleShow';
import { ChecksScheduleForm } from './components/checks_schedules/ChecksScheduleForm';

// Import InjuryReport components
import { InjuryReportsIndex } from './components/injury_reports/InjuryReportsIndex';
import { InjuryReportShow } from './components/injury_reports/InjuryReportShow';
import { InjuryReportForm } from './components/injury_reports/InjuryReportForm';

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

          {/* Medication Schedules routes */}
          <Route path="/medication_schedules" element={<MedicationSchedulesIndex />} />
          <Route path="/medication_schedules/new" element={<MedicationScheduleForm mode="new" />} />
          <Route path="/medication_schedules/:id" element={<MedicationScheduleShow />} />
          <Route path="/medication_schedules/:id/edit" element={<MedicationScheduleForm mode="edit" />} />

          {/* Vaccination Schedules routes */}
          <Route path="/vaccination_schedules" element={<VaccinationSchedulesIndex />} />
          <Route path="/vaccination_schedules/new" element={<VaccinationScheduleForm mode="new" />} />
          <Route path="/vaccination_schedules/:id" element={<VaccinationScheduleShow />} />
          <Route path="/vaccination_schedules/:id/edit" element={<VaccinationScheduleForm mode="edit" />} />

          {/* Pet Foods routes */}
          <Route path="/pet_foods" element={<PetFoodsIndex />} />
          <Route path="/pet_foods/new" element={<PetFoodForm mode="new" />} />
          <Route path="/pet_foods/:id" element={<PetFoodShow />} />
          <Route path="/pet_foods/:id/edit" element={<PetFoodForm mode="edit" />} />

          {/* Checks Schedules routes */}
          <Route path="/checks_schedules" element={<ChecksSchedulesIndex />} />
          <Route path="/checks_schedules/new" element={<ChecksScheduleForm mode="new" />} />
          <Route path="/checks_schedules/:id" element={<ChecksScheduleShow />} />
          <Route path="/checks_schedules/:id/edit" element={<ChecksScheduleForm mode="edit" />} />

          {/* Injury Reports routes */}
          <Route path="/injury_reports" element={<InjuryReportsIndex />} />
          <Route path="/injury_reports/new" element={<InjuryReportForm mode="new" />} />
          <Route path="/injury_reports/:id" element={<InjuryReportShow />} />
          <Route path="/injury_reports/:id/edit" element={<InjuryReportForm mode="edit" />} />

          {/* 404 Not Found */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
};
