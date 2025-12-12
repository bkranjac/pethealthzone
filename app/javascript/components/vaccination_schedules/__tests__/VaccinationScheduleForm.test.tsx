import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { VaccinationScheduleForm } from '../VaccinationScheduleForm';
import { VaccinationSchedule } from '../../../types/vaccinationSchedule';
import { Pet } from '../../../types/pet';
import { Vaccine } from '../../../types/vaccine';
import { Frequency } from '../../../types/frequency';

const renderWithRouter = (mode: 'new' | 'edit', scheduleId?: number) => {
  const path = mode === 'new' ? '/vaccination_schedules/new' : `/vaccination_schedules/${scheduleId}/edit`;
  const routePath = mode === 'new' ? '/vaccination_schedules/new' : '/vaccination_schedules/:id/edit';

  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path={routePath} element={<VaccinationScheduleForm mode={mode} />} />
        <Route path="/vaccination_schedules/:id" element={<div>Schedule Show Page</div>} />
        <Route path="/vaccination_schedules" element={<div>Schedules Index Page</div>} />
      </Routes>
    </MemoryRouter>
  );
};

const mockSchedule: VaccinationSchedule = {
  id: 1,
  pet_id: 1,
  vaccine_id: 1,
  frequency_id: 1,
  date_started: '2025-01-01',
  notes: 'First vaccination',
};

const mockPets: Pet[] = [
  { id: 1, name: 'Buddy', pet_type: 'Dog', breed: 'Labrador', birthday: '2020-01-01', date_admitted: '2020-01-15' },
  { id: 2, name: 'Whiskers', pet_type: 'Cat', breed: 'Siamese', birthday: '2021-01-01', date_admitted: '2021-01-15' },
];

const mockVaccines: Vaccine[] = [
  { id: 1, name: 'Rabies', description: 'Rabies vaccine', frequency_id: 1 },
  { id: 2, name: 'Distemper', description: 'Distemper vaccine', frequency_id: 2 },
];

const mockFrequencies: Frequency[] = [
  { id: 1, name: 'Weekly', interval_days: 7 },
  { id: 2, name: 'Monthly', interval_days: 30 },
];

describe('VaccinationScheduleForm', () => {
  beforeEach(() => {
    (global.fetch as jest.Mock).mockClear();
  });

  describe('New Mode', () => {
    it('renders form in new mode', async () => {
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({ ok: true, json: async () => mockPets })
        .mockResolvedValueOnce({ ok: true, json: async () => mockVaccines })
        .mockResolvedValueOnce({ ok: true, json: async () => mockFrequencies });

      renderWithRouter('new');

      expect(screen.getByText('New Vaccination Schedule')).toBeInTheDocument();

      await waitFor(() => {
        expect(screen.getByLabelText(/Pet/)).toBeInTheDocument();
        expect(screen.getByLabelText(/Vaccine/)).toBeInTheDocument();
        expect(screen.getByLabelText(/Frequency/)).toBeInTheDocument();
      });

      expect(screen.getByLabelText(/Date Started/)).toBeInTheDocument();
      expect(screen.getByText('Create Vaccination Schedule')).toBeInTheDocument();
    });

    it('submits form with valid data', async () => {
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({ ok: true, json: async () => mockPets })
        .mockResolvedValueOnce({ ok: true, json: async () => mockVaccines })
        .mockResolvedValueOnce({ ok: true, json: async () => mockFrequencies })
        .mockResolvedValueOnce({ ok: true, json: async () => mockSchedule });

      renderWithRouter('new');

      await waitFor(() => {
        expect(screen.getByLabelText(/Pet/)).toBeInTheDocument();
      });

      const petSelect = screen.getByLabelText(/Pet/);
      const vaccineSelect = screen.getByLabelText(/Vaccine/);
      const frequencySelect = screen.getByLabelText(/Frequency/);
      const dateInput = screen.getByLabelText(/Date Started/);

      fireEvent.change(petSelect, { target: { value: '1' } });
      fireEvent.change(vaccineSelect, { target: { value: '1' } });
      fireEvent.change(frequencySelect, { target: { value: '1' } });
      fireEvent.change(dateInput, { target: { value: '2025-01-01' } });

      const submitButton = screen.getByText('Create Vaccination Schedule');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith('/api/v1/vaccination_schedules', expect.objectContaining({
          method: 'POST',
        }));
      });
    });
  });

  describe('Edit Mode', () => {
    it('fetches and displays existing schedule data', async () => {
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({ ok: true, json: async () => mockPets })
        .mockResolvedValueOnce({ ok: true, json: async () => mockVaccines })
        .mockResolvedValueOnce({ ok: true, json: async () => mockFrequencies })
        .mockResolvedValueOnce({ ok: true, json: async () => mockSchedule });

      renderWithRouter('edit', 1);

      await waitFor(() => {
        const petSelect = screen.getByLabelText(/Pet/) as HTMLSelectElement;
        expect(petSelect.value).toBe('1');
      });

      expect(screen.getByText('Edit Vaccination Schedule')).toBeInTheDocument();
    });

    it('submits updated data', async () => {
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({ ok: true, json: async () => mockPets })
        .mockResolvedValueOnce({ ok: true, json: async () => mockVaccines })
        .mockResolvedValueOnce({ ok: true, json: async () => mockFrequencies })
        .mockResolvedValueOnce({ ok: true, json: async () => mockSchedule })
        .mockResolvedValueOnce({ ok: true, json: async () => ({ ...mockSchedule, notes: 'Updated notes' }) });

      renderWithRouter('edit', 1);

      await waitFor(() => {
        expect(screen.getByDisplayValue('First vaccination')).toBeInTheDocument();
      });

      const notesInput = screen.getByLabelText(/Notes/);
      fireEvent.change(notesInput, { target: { value: 'Updated notes' } });

      const submitButton = screen.getByText('Update Vaccination Schedule');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith('/api/v1/vaccination_schedules/1', expect.objectContaining({
          method: 'PUT',
        }));
      });
    });
  });

  describe('Navigation', () => {
    it('displays back button linking to schedules index', async () => {
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({ ok: true, json: async () => mockPets })
        .mockResolvedValueOnce({ ok: true, json: async () => mockVaccines })
        .mockResolvedValueOnce({ ok: true, json: async () => mockFrequencies });

      renderWithRouter('new');

      await waitFor(() => {
        const backLink = screen.getByText('Back');
        expect(backLink).toHaveAttribute('href', '/vaccination_schedules');
      });
    });
  });
});
