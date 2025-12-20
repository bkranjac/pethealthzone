import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { ChecksScheduleForm } from '../ChecksScheduleForm';
import { ChecksSchedule } from '../../../types/checksSchedule';
import { Pet } from '../../../types/pet';
import { Check } from '../../../types/check';

const renderWithRouter = (mode: 'new' | 'edit', scheduleId?: number) => {
  const path = mode === 'new' ? '/checks_schedules/new' : `/checks_schedules/${scheduleId}/edit`;
  const routePath = mode === 'new' ? '/checks_schedules/new' : '/checks_schedules/:id/edit';

  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path={routePath} element={<ChecksScheduleForm mode={mode} />} />
        <Route path="/checks_schedules/:id" element={<div>Schedule Show Page</div>} />
        <Route path="/checks_schedules" element={<div>Schedules Index Page</div>} />
      </Routes>
    </MemoryRouter>
  );
};

const mockSchedule: ChecksSchedule = {
  id: 1,
  pet_id: 1,
  check_id: 1,
  date_created: '2025-01-01',
  notes: 'Regular checkup',
  performed: false,
};

const mockPets: Pet[] = [
  { id: 1, name: 'Buddy', pet_type: 'Dog', breed: 'Labrador', birthday: '2020-01-01', date_admitted: '2020-01-15' },
  { id: 2, name: 'Whiskers', pet_type: 'Cat', breed: 'Siamese', birthday: '2021-01-01', date_admitted: '2021-01-15' },
];

const mockChecks: Check[] = [
  { id: 1, check_type: 'Annual Physical', frequency_id: 1 },
  { id: 2, check_type: 'Dental Checkup', frequency_id: 2 },
];

describe('ChecksScheduleForm', () => {
  beforeEach(() => {
    (global.fetch as jest.Mock).mockClear();
  });

  describe('New Mode', () => {
    it('renders form in new mode', async () => {
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({ ok: true, json: async () => mockPets })
        .mockResolvedValueOnce({ ok: true, json: async () => mockChecks });

      renderWithRouter('new');

      expect(screen.getByText('New Checks Schedule')).toBeInTheDocument();

      await waitFor(() => {
        expect(screen.getByLabelText(/Pet/)).toBeInTheDocument();
        expect(screen.getByLabelText(/Check/)).toBeInTheDocument();
      });

      expect(screen.getByLabelText(/Date Created/i)).toBeInTheDocument();
      expect(screen.getByText('Create Checks Schedule')).toBeInTheDocument();
    });

    it('submits form with valid data', async () => {
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({ ok: true, json: async () => mockPets })
        .mockResolvedValueOnce({ ok: true, json: async () => mockChecks })
        .mockResolvedValueOnce({ ok: true, json: async () => mockSchedule });

      renderWithRouter('new');

      await waitFor(() => {
        expect(screen.getByLabelText(/Pet/)).toBeInTheDocument();
      });

      const petSelect = screen.getByLabelText(/Pet/);
      const checkSelect = screen.getByLabelText(/Check/);
      const dateCreatedInput = screen.getByLabelText(/Date Created/i);

      fireEvent.change(petSelect, { target: { value: '1' } });
      fireEvent.change(checkSelect, { target: { value: '1' } });
      fireEvent.change(dateCreatedInput, { target: { value: '2025-01-01' } });

      const submitButton = screen.getByText('Create Checks Schedule');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith('/api/v1/checks_schedules', expect.objectContaining({
          method: 'POST',
        }));
      });
    });
  });

  describe('Edit Mode', () => {
    it('fetches and displays existing schedule data', async () => {
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({ ok: true, json: async () => mockPets })
        .mockResolvedValueOnce({ ok: true, json: async () => mockChecks })
        .mockResolvedValueOnce({ ok: true, json: async () => mockSchedule });

      renderWithRouter('edit', 1);

      await waitFor(() => {
        const petSelect = screen.getByLabelText(/Pet/) as HTMLSelectElement;
        expect(petSelect.value).toBe('1');
      });

      expect(screen.getByText('Edit Checks Schedule')).toBeInTheDocument();
    });

    it('submits updated data', async () => {
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({ ok: true, json: async () => mockPets })
        .mockResolvedValueOnce({ ok: true, json: async () => mockChecks })
        .mockResolvedValueOnce({ ok: true, json: async () => mockSchedule })
        .mockResolvedValueOnce({ ok: true, json: async () => ({ ...mockSchedule, notes: 'Updated notes' }) });

      renderWithRouter('edit', 1);

      await waitFor(() => {
        expect(screen.getByDisplayValue('Regular checkup')).toBeInTheDocument();
      });

      const notesInput = screen.getByLabelText(/Notes/);
      fireEvent.change(notesInput, { target: { value: 'Updated notes' } });

      const submitButton = screen.getByText('Update Checks Schedule');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith('/api/v1/checks_schedules/1', expect.objectContaining({
          method: 'PUT',
        }));
      });
    });
  });

  describe('Navigation', () => {
    it('displays back button linking to schedules index', async () => {
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({ ok: true, json: async () => mockPets })
        .mockResolvedValueOnce({ ok: true, json: async () => mockChecks });

      renderWithRouter('new');

      await waitFor(() => {
        const backLink = screen.getByText('Back');
        expect(backLink).toHaveAttribute('href', '/checks_schedules');
      });
    });
  });
});
