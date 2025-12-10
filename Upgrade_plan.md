# PetHealthZone: Rails + React SPA Migration Plan

## Overview
Migrate PetHealthZone from hybrid ERB/React to a full React SPA with client-side routing using React Router.

**Current Status:**
- ✅ Wave 1: Foundation Setup (COMPLETED)
- 🔄 Wave 2: Reusable Patterns & Type Definitions (IN PROGRESS)
- ⏳ Wave 3: Incremental Resource Migration (PENDING)
- ⏳ Wave 4: Cleanup (PENDING)

---

## Architecture

### Old Architecture
```
Browser → Rails Routes → Rails Controllers → ERB Views
Tests: Controller tests + System tests
```

### New Architecture (React SPA)
```
Browser → React Router (client-side routing)
           ↓
        API calls → Rails API Controllers → JSON
Tests: Jest + React Testing Library
```

---

## Resources Overview

**Total Resources:** 13
- ✅ **Migrated (2):** Pets, Injuries
- 🔄 **In Progress (0):** -
- ⏳ **Remaining (10):** Frequencies, Foods, Medications, Vaccines, Checks, Medication Schedules, Vaccination Schedules, Pet Foods, Checks Schedules, Injury Reports

---

## Wave 1: Foundation Setup ✅ COMPLETED

### Completed Items:
- ✅ Installed React Router v7.10.1
- ✅ Created App.tsx with BrowserRouter and routes
- ✅ Created Layout component with Navigation
- ✅ Created Navigation component with dropdown menus for all 13 resources
- ✅ Created useAppNavigate hook for test-safe navigation
- ✅ Created NotFound and LoadingSpinner components
- ✅ Updated Rails routes with SPA catch-all
- ✅ Created SpaController and spa/index.html.erb view
- ✅ Updated application.tsx as main entry point
- ✅ Migrated Pets components to React Router (PetsIndex, PetShow, PetForm)
- ✅ Migrated Injuries components to React Router (InjuriesIndex, InjuryShow, InjuryForm)
- ✅ Updated all tests (66 tests passing)
- ✅ Fixed useApi hook with useCallback to prevent infinite renders
- ✅ Configured Node 24.2.0 via .node-version
- ✅ Switched to Yarn package manager
- ✅ Updated GitHub Actions CI to use Yarn with Node 24
- ✅ Removed obsolete Rails controller and system tests

### Key Files Created:
- `/app/javascript/App.tsx`
- `/app/javascript/components/layout/Layout.tsx`
- `/app/javascript/components/layout/Navigation.tsx`
- `/app/javascript/hooks/useAppNavigate.ts`
- `/app/controllers/spa_controller.rb`
- `/app/views/spa/index.html.erb`
- `/.node-version`

### Key Files Modified:
- `/config/routes.rb` - SPA catch-all routing
- `/app/javascript/application.tsx` - Main entry point
- `/app/javascript/hooks/useApi.ts` - Added useCallback
- `/package.json` - Added engines, scripts
- `/.github/workflows/ci.yml` - Yarn + Node 24

---

## Wave 2: Reusable Patterns & Type Definitions 🔄 IN PROGRESS

### Goals:
- Create TypeScript interfaces for all remaining resources
- Build reusable form components
- Establish patterns for Wave 3

### 2.1 TypeScript Interfaces

**Location:** `/app/javascript/types/`

#### Simple Resources (no foreign keys):

**frequency.ts:**
```typescript
export interface Frequency {
  id: number;
  interval_days: number;
  created_at?: string;
  updated_at?: string;
}

export interface FrequencyFormData {
  interval_days: number;
}
```

**food.ts:**
```typescript
export interface Food {
  id: number;
  name: string;
  brand: string;
  ingredients?: string;
  created_at?: string;
  updated_at?: string;
}

export interface FoodFormData {
  name: string;
  brand: string;
  ingredients?: string;
}
```

**medication.ts:**
```typescript
export interface Medication {
  id: number;
  name: string;
  amount: string;
  purpose: string;
  expiration_date: string;
  created_at?: string;
  updated_at?: string;
}

export interface MedicationFormData {
  name: string;
  amount: string;
  purpose: string;
  expiration_date: string;
}
```

#### Resources with Foreign Keys:

**vaccine.ts:**
```typescript
import { Frequency } from './frequency';

export interface Vaccine {
  id: number;
  name: string;
  description?: string;
  frequency_id: number;
  frequency?: Frequency;
  created_at?: string;
  updated_at?: string;
}

export interface VaccineFormData {
  name: string;
  description?: string;
  frequency_id: number;
}
```

**check.ts:**
```typescript
import { Frequency } from './frequency';

export interface Check {
  id: number;
  name: string;
  description?: string;
  frequency_id: number;
  frequency?: Frequency;
  created_at?: string;
  updated_at?: string;
}

export interface CheckFormData {
  name: string;
  description?: string;
  frequency_id: number;
}
```

**medicationSchedule.ts:**
```typescript
import { Pet } from './pet';
import { Medication } from './medication';
import { Frequency } from './frequency';

export interface MedicationSchedule {
  id: number;
  pet_id: number;
  medication_id: number;
  frequency_id: number;
  date_started: string;
  date_ended?: string;
  notes?: string;
  pet?: Pet;
  medication?: Medication;
  frequency?: Frequency;
  created_at?: string;
  updated_at?: string;
}

export interface MedicationScheduleFormData {
  pet_id: number;
  medication_id: number;
  frequency_id: number;
  date_started: string;
  date_ended?: string;
  notes?: string;
}
```

**vaccinationSchedule.ts:**
```typescript
import { Pet } from './pet';
import { Vaccine } from './vaccine';
import { Frequency } from './frequency';

export interface VaccinationSchedule {
  id: number;
  pet_id: number;
  vaccine_id: number;
  frequency_id: number;
  date_started: string;
  date_ended?: string;
  notes?: string;
  pet?: Pet;
  vaccine?: Vaccine;
  frequency?: Frequency;
  created_at?: string;
  updated_at?: string;
}

export interface VaccinationScheduleFormData {
  pet_id: number;
  vaccine_id: number;
  frequency_id: number;
  date_started: string;
  date_ended?: string;
  notes?: string;
}
```

**petFood.ts:**
```typescript
import { Pet } from './pet';
import { Food } from './food';
import { Frequency } from './frequency';

export interface PetFood {
  id: number;
  pet_id: number;
  food_id: number;
  frequency_id: number;
  date_started: string;
  date_ended?: string;
  notes?: string;
  pet?: Pet;
  food?: Food;
  frequency?: Frequency;
  created_at?: string;
  updated_at?: string;
}

export interface PetFoodFormData {
  pet_id: number;
  food_id: number;
  frequency_id: number;
  date_started: string;
  date_ended?: string;
  notes?: string;
}
```

**checksSchedule.ts:**
```typescript
import { Pet } from './pet';
import { Check } from './check';

export interface ChecksSchedule {
  id: number;
  pet_id: number;
  check_id: number;
  scheduled_date: string;
  completed_date?: string;
  notes?: string;
  pet?: Pet;
  check?: Check;
  created_at?: string;
  updated_at?: string;
}

export interface ChecksScheduleFormData {
  pet_id: number;
  check_id: number;
  scheduled_date: string;
  completed_date?: string;
  notes?: string;
}
```

**injuryReport.ts:**
```typescript
import { Pet } from './pet';
import { Injury } from './injury';

export interface InjuryReport {
  id: number;
  pet_id: number;
  injury_id: number;
  report_date: string;
  notes?: string;
  pet?: Pet;
  injury?: Injury;
  created_at?: string;
  updated_at?: string;
}

export interface InjuryReportFormData {
  pet_id: number;
  injury_id: number;
  report_date: string;
  notes?: string;
}
```

### 2.2 Generic Form Components

**FormField.tsx** - Generic text/date/number input:
```typescript
interface FormFieldProps {
  label: string;
  name: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  type?: 'text' | 'date' | 'number' | 'textarea';
  required?: boolean;
  placeholder?: string;
  error?: string;
}
```

**ResourceSelect.tsx** - Generic dropdown for foreign keys:
```typescript
interface ResourceSelectProps<T extends { id: number }> {
  label: string;
  name: string;
  value: number | string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: T[];
  getLabel: (item: T) => string;
  required?: boolean;
  loading?: boolean;
  placeholder?: string;
}
```

---

## Wave 3: Incremental Resource Migration ⏳ PENDING

### Migration Order (by complexity)

### Wave 3.1: Simple Lookup Resources (No foreign keys)
1. **Frequencies** - 1 field (interval_days)
2. **Foods** - 3 fields (name, brand, ingredients)
3. **Medications** - 4 fields (name, amount, purpose, expiration_date)

### Wave 3.2: Medical Reference Resources (1 foreign key)
4. **Vaccines** - has frequency_id
5. **Checks** - has frequency_id

### Wave 3.3: Schedule/Join Resources (Multiple foreign keys)
6. **Medication Schedules** - pet_id, medication_id, frequency_id
7. **Vaccination Schedules** - pet_id, vaccine_id, frequency_id
8. **Pet Foods** - pet_id, food_id, frequency_id
9. **Checks Schedules** - pet_id, check_id

### Wave 3.4: Reports
10. **Injury Reports** - pet_id, injury_id

### Component Pattern (For Each Resource)

#### Example: Medications

**Create 3 Components:**

1. **MedicationsIndex.tsx:**
```typescript
export const MedicationsIndex: React.FC = () => {
  const { data: medications, loading, error, deleteItem } =
    useResource<Medication>('/api/v1/medications');

  // Grid/card layout
  // Delete with confirmation
  // Links to new/view/edit
};
```

2. **MedicationShow.tsx:**
```typescript
export const MedicationShow: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { apiCall } = useApi();
  const navigate = useAppNavigate();

  // Fetch single medication
  // Display all fields
  // Edit and Delete buttons
};
```

3. **MedicationForm.tsx:**
```typescript
interface MedicationFormProps {
  mode: 'new' | 'edit';
}

export const MedicationForm: React.FC<MedicationFormProps> = ({ mode }) => {
  const { id } = useParams<{ id: string }>();
  const { apiCall } = useApi();
  const navigate = useAppNavigate();

  // Controlled form with useState
  // Validation
  // Submit to API
};
```

**Add Routes:**
```typescript
// In App.tsx
<Route path="/medications" element={<MedicationsIndex />} />
<Route path="/medications/new" element={<MedicationForm mode="new" />} />
<Route path="/medications/:id" element={<MedicationShow />} />
<Route path="/medications/:id/edit" element={<MedicationForm mode="edit" />} />
```

**Create Tests:**
- `MedicationsIndex.test.tsx`
- `MedicationShow.test.tsx`
- `MedicationForm.test.tsx`

### Special Handling for Resources with Foreign Keys

**Example: Medication Schedules**

```typescript
export const MedicationScheduleForm: React.FC<FormProps> = ({ mode }) => {
  // Load dropdown options
  const { data: pets } = useResource<Pet>('/api/v1/pets');
  const { data: medications } = useResource<Medication>('/api/v1/medications');
  const { data: frequencies } = useResource<Frequency>('/api/v1/frequencies');

  return (
    <form>
      <ResourceSelect
        label="Pet"
        options={pets}
        getLabel={(pet) => pet.name}
        loading={!pets}
      />
      <ResourceSelect
        label="Medication"
        options={medications}
        getLabel={(med) => med.name}
        loading={!medications}
      />
      <ResourceSelect
        label="Frequency"
        options={frequencies}
        getLabel={(freq) => `Every ${freq.interval_days} days`}
        loading={!frequencies}
      />
    </form>
  );
};
```

---

## Wave 4: Cleanup ⏳ PENDING

### After all resources migrated:

1. **Remove Old ERB Views:**
```bash
rm -rf app/views/foods app/views/medications app/views/vaccines
rm -rf app/views/checks app/views/frequencies
rm -rf app/views/medication_schedules app/views/vaccination_schedules
rm -rf app/views/pet_foods app/views/checks_schedules
rm -rf app/views/injury_reports
```

Keep only:
- `app/views/spa/index.html.erb`
- `app/views/layouts/application.html.erb` (if needed)

2. **Remove Old Bootstrap Files:**
```bash
# If any exist for other resources
rm app/javascript/foods.tsx
rm app/javascript/medications.tsx
# etc.
```

3. **Remove Traditional Rails Controllers:**
```bash
rm app/controllers/foods_controller.rb
rm app/controllers/medications_controller.rb
# etc. for all non-API controllers
```

Keep:
- `app/controllers/spa_controller.rb`
- `app/controllers/application_controller.rb`
- All `app/controllers/api/v1/*` controllers

4. **Optional: Remove Turbo** (if not needed):
```bash
npm uninstall @hotwired/turbo-rails
```

---

## Testing Strategy

### Per-Wave Testing
Before deploying each wave:
1. ✅ Write component tests (aim for 100% coverage)
2. ✅ Run full test suite: `yarn test`
3. ✅ Run Rails tests: `bin/rails test`
4. ✅ Manual smoke tests in browser

### Test Patterns
Following established patterns from Pets/Injuries:
- Mock fetch API with Jest
- Mock CSRF token (in jest.setup.js)
- Mock useNavigate for navigation tests
- Wrap components in MemoryRouter for tests
- Test loading/error/empty states
- Test user interactions (delete, submit forms)

---

## Estimated Timeline

- ✅ **Wave 1** (Foundation): 3-5 days - COMPLETED
- 🔄 **Wave 2** (Types & Patterns): 2-3 days - IN PROGRESS
- ⏳ **Wave 3.1** (Simple resources): 5-7 days
- ⏳ **Wave 3.2** (Medical resources): 4-5 days
- ⏳ **Wave 3.3** (Schedules): 8-10 days
- ⏳ **Wave 3.4** (Reports): 2-3 days
- ⏳ **Wave 4** (Cleanup): 1-2 days

**Total: ~25-35 days (5-7 weeks)**

---

## Success Criteria

- [ ] All 13 resources have React components
- [x] React Router handles all navigation (2/13 resources)
- [x] Global nav menu works
- [x] Test coverage maintained (66 tests passing)
- [ ] All CRUD operations work for all resources
- [x] Back button works correctly
- [x] No console errors
- [x] Bundle size reasonable (<500KB gzipped)

---

## Technology Stack

**Frontend:**
- React 19.2.1
- React Router 7.10.1
- TypeScript 5.9.3
- TailwindCSS 4.1.17
- Jest 30.2.0 + React Testing Library

**Backend:**
- Rails 8.0.4
- Ruby (version from .ruby-version)

**Build Tools:**
- esbuild 0.27.1
- Yarn 1.22.22
- Node 24.2.0

**CI/CD:**
- GitHub Actions
- Configured for Node 24 + Yarn

---

## Notes

- All React component tests use Jest + React Testing Library
- Old Rails controller and system tests have been removed (obsolete for SPA)
- API routes remain at `/api/v1/*` and return JSON
- Navigation is fully client-side via React Router
- CSRF protection handled via useApi hook
- All forms use controlled components pattern
