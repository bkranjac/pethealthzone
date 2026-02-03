import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { PublicLayout } from './components/layout/PublicLayout';
import { StaffLayout } from './components/layout/StaffLayout';
import { NotFound } from './components/common/NotFound';

// Import Public components
import { PublicHome } from './components/public/PublicHome';
import { AdoptablePets } from './components/public/AdoptablePets';
import { PetDetail } from './components/public/PetDetail';

// Import existing Pet components (Staff)
import { PetsIndex } from './components/pets/PetsIndex';
import { PetShow } from './components/pets/PetShow';
import { PetForm } from './components/pets/PetForm';
import { PetDashboard } from './components/pets/PetDashboard';

// Import existing Injury components (Staff)
import { InjuriesIndex } from './components/injuries/InjuriesIndex';
import { InjuryShow } from './components/injuries/InjuryShow';
import { InjuryForm } from './components/injuries/InjuryForm';

// Import Frequency components (Staff)
import { FrequenciesIndex } from './components/frequencies/FrequenciesIndex';
import { FrequencyShow } from './components/frequencies/FrequencyShow';
import { FrequencyForm } from './components/frequencies/FrequencyForm';

// Import Food components (Staff)
import { FoodsIndex } from './components/foods/FoodsIndex';
import { FoodShow } from './components/foods/FoodShow';
import { FoodForm } from './components/foods/FoodForm';

// Import Medication components (Staff)
import { MedicationsIndex } from './components/medications/MedicationsIndex';
import { MedicationShow } from './components/medications/MedicationShow';
import { MedicationForm } from './components/medications/MedicationForm';

// Import Vaccine components (Staff)
import { VaccinesIndex } from './components/vaccines/VaccinesIndex';
import { VaccineShow } from './components/vaccines/VaccineShow';
import { VaccineForm } from './components/vaccines/VaccineForm';

// Import Check components (Staff)
import { ChecksIndex } from './components/checks/ChecksIndex';
import { CheckShow } from './components/checks/CheckShow';
import { CheckForm } from './components/checks/CheckForm';

// Import MedicationSchedule components (Staff)
import { MedicationSchedulesIndex } from './components/medication_schedules/MedicationSchedulesIndex';
import { MedicationScheduleShow } from './components/medication_schedules/MedicationScheduleShow';
import { MedicationScheduleForm } from './components/medication_schedules/MedicationScheduleForm';

// Import VaccinationSchedule components (Staff)
import { VaccinationSchedulesIndex } from './components/vaccination_schedules/VaccinationSchedulesIndex';
import { VaccinationScheduleShow } from './components/vaccination_schedules/VaccinationScheduleShow';
import { VaccinationScheduleForm } from './components/vaccination_schedules/VaccinationScheduleForm';

// Import PetFood components (Staff)
import { PetFoodsIndex } from './components/pet_foods/PetFoodsIndex';
import { PetFoodShow } from './components/pet_foods/PetFoodShow';
import { PetFoodForm } from './components/pet_foods/PetFoodForm';

// Import ChecksSchedule components (Staff)
import { ChecksSchedulesIndex } from './components/checks_schedules/ChecksSchedulesIndex';
import { ChecksScheduleShow } from './components/checks_schedules/ChecksScheduleShow';
import { ChecksScheduleForm } from './components/checks_schedules/ChecksScheduleForm';

// Import InjuryReport components (Staff)
import { InjuryReportsIndex } from './components/injury_reports/InjuryReportsIndex';
import { InjuryReportShow } from './components/injury_reports/InjuryReportShow';
import { InjuryReportForm } from './components/injury_reports/InjuryReportForm';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<PublicLayout><PublicHome /></PublicLayout>} />
        <Route path="/adopt" element={<PublicLayout><AdoptablePets /></PublicLayout>} />
        <Route path="/adopt/:id" element={<PublicLayout><PetDetail /></PublicLayout>} />

        {/* Staff Routes - All under /staff prefix */}
        <Route path="/staff" element={<Navigate to="/staff/pets" replace />} />

        {/* Staff Pets routes */}
        <Route path="/staff/pets" element={<StaffLayout><PetsIndex /></StaffLayout>} />
        <Route path="/staff/pets/new" element={<StaffLayout><PetForm mode="new" /></StaffLayout>} />
        <Route path="/staff/pets/:id" element={<StaffLayout><PetDashboard /></StaffLayout>} />
        <Route path="/staff/pets/:id/show" element={<StaffLayout><PetShow /></StaffLayout>} />
        <Route path="/staff/pets/:id/edit" element={<StaffLayout><PetForm mode="edit" /></StaffLayout>} />

        {/* Staff Injuries routes */}
        <Route path="/staff/injuries" element={<StaffLayout><InjuriesIndex /></StaffLayout>} />
        <Route path="/staff/injuries/new" element={<StaffLayout><InjuryForm mode="new" /></StaffLayout>} />
        <Route path="/staff/injuries/:id" element={<StaffLayout><InjuryShow /></StaffLayout>} />
        <Route path="/staff/injuries/:id/edit" element={<StaffLayout><InjuryForm mode="edit" /></StaffLayout>} />

        {/* Staff Frequencies routes */}
        <Route path="/staff/frequencies" element={<StaffLayout><FrequenciesIndex /></StaffLayout>} />
        <Route path="/staff/frequencies/new" element={<StaffLayout><FrequencyForm mode="new" /></StaffLayout>} />
        <Route path="/staff/frequencies/:id" element={<StaffLayout><FrequencyShow /></StaffLayout>} />
        <Route path="/staff/frequencies/:id/edit" element={<StaffLayout><FrequencyForm mode="edit" /></StaffLayout>} />

        {/* Staff Foods routes */}
        <Route path="/staff/foods" element={<StaffLayout><FoodsIndex /></StaffLayout>} />
        <Route path="/staff/foods/new" element={<StaffLayout><FoodForm mode="new" /></StaffLayout>} />
        <Route path="/staff/foods/:id" element={<StaffLayout><FoodShow /></StaffLayout>} />
        <Route path="/staff/foods/:id/edit" element={<StaffLayout><FoodForm mode="edit" /></StaffLayout>} />

        {/* Staff Medications routes */}
        <Route path="/staff/medications" element={<StaffLayout><MedicationsIndex /></StaffLayout>} />
        <Route path="/staff/medications/new" element={<StaffLayout><MedicationForm mode="new" /></StaffLayout>} />
        <Route path="/staff/medications/:id" element={<StaffLayout><MedicationShow /></StaffLayout>} />
        <Route path="/staff/medications/:id/edit" element={<StaffLayout><MedicationForm mode="edit" /></StaffLayout>} />

        {/* Staff Vaccines routes */}
        <Route path="/staff/vaccines" element={<StaffLayout><VaccinesIndex /></StaffLayout>} />
        <Route path="/staff/vaccines/new" element={<StaffLayout><VaccineForm mode="new" /></StaffLayout>} />
        <Route path="/staff/vaccines/:id" element={<StaffLayout><VaccineShow /></StaffLayout>} />
        <Route path="/staff/vaccines/:id/edit" element={<StaffLayout><VaccineForm mode="edit" /></StaffLayout>} />

        {/* Staff Checks routes */}
        <Route path="/staff/checks" element={<StaffLayout><ChecksIndex /></StaffLayout>} />
        <Route path="/staff/checks/new" element={<StaffLayout><CheckForm mode="new" /></StaffLayout>} />
        <Route path="/staff/checks/:id" element={<StaffLayout><CheckShow /></StaffLayout>} />
        <Route path="/staff/checks/:id/edit" element={<StaffLayout><CheckForm mode="edit" /></StaffLayout>} />

        {/* Staff Medication Schedules routes */}
        <Route path="/staff/medication_schedules" element={<StaffLayout><MedicationSchedulesIndex /></StaffLayout>} />
        <Route path="/staff/medication_schedules/new" element={<StaffLayout><MedicationScheduleForm mode="new" /></StaffLayout>} />
        <Route path="/staff/medication_schedules/:id" element={<StaffLayout><MedicationScheduleShow /></StaffLayout>} />
        <Route path="/staff/medication_schedules/:id/edit" element={<StaffLayout><MedicationScheduleForm mode="edit" /></StaffLayout>} />

        {/* Staff Vaccination Schedules routes */}
        <Route path="/staff/vaccination_schedules" element={<StaffLayout><VaccinationSchedulesIndex /></StaffLayout>} />
        <Route path="/staff/vaccination_schedules/new" element={<StaffLayout><VaccinationScheduleForm mode="new" /></StaffLayout>} />
        <Route path="/staff/vaccination_schedules/:id" element={<StaffLayout><VaccinationScheduleShow /></StaffLayout>} />
        <Route path="/staff/vaccination_schedules/:id/edit" element={<StaffLayout><VaccinationScheduleForm mode="edit" /></StaffLayout>} />

        {/* Staff Pet Foods routes */}
        <Route path="/staff/pet_foods" element={<StaffLayout><PetFoodsIndex /></StaffLayout>} />
        <Route path="/staff/pet_foods/new" element={<StaffLayout><PetFoodForm mode="new" /></StaffLayout>} />
        <Route path="/staff/pet_foods/:id" element={<StaffLayout><PetFoodShow /></StaffLayout>} />
        <Route path="/staff/pet_foods/:id/edit" element={<StaffLayout><PetFoodForm mode="edit" /></StaffLayout>} />

        {/* Staff Checks Schedules routes */}
        <Route path="/staff/checks_schedules" element={<StaffLayout><ChecksSchedulesIndex /></StaffLayout>} />
        <Route path="/staff/checks_schedules/new" element={<StaffLayout><ChecksScheduleForm mode="new" /></StaffLayout>} />
        <Route path="/staff/checks_schedules/:id" element={<StaffLayout><ChecksScheduleShow /></StaffLayout>} />
        <Route path="/staff/checks_schedules/:id/edit" element={<StaffLayout><ChecksScheduleForm mode="edit" /></StaffLayout>} />

        {/* Staff Injury Reports routes */}
        <Route path="/staff/injury_reports" element={<StaffLayout><InjuryReportsIndex /></StaffLayout>} />
        <Route path="/staff/injury_reports/new" element={<StaffLayout><InjuryReportForm mode="new" /></StaffLayout>} />
        <Route path="/staff/injury_reports/:id" element={<StaffLayout><InjuryReportShow /></StaffLayout>} />
        <Route path="/staff/injury_reports/:id/edit" element={<StaffLayout><InjuryReportForm mode="edit" /></StaffLayout>} />

        {/* 404 Not Found */}
        <Route path="*" element={<PublicLayout><NotFound /></PublicLayout>} />
      </Routes>
    </BrowserRouter>
  );
};
