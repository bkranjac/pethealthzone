import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { InjuryReportForm } from '../InjuryReportForm';
import { InjuryReport } from '../../../types/injuryReport';
import { Pet } from '../../../types/pet';
import { Injury } from '../../../types/injury';

const renderWithRouter = (mode: 'new' | 'edit', reportId?: number) => {
  const path = mode === 'new' ? '/injury_reports/new' : `/injury_reports/${reportId}/edit`;
  const routePath = mode === 'new' ? '/injury_reports/new' : '/injury_reports/:id/edit';

  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path={routePath} element={<InjuryReportForm mode={mode} />} />
        <Route path="/injury_reports/:id" element={<div>Report Show Page</div>} />
        <Route path="/injury_reports" element={<div>Reports Index Page</div>} />
      </Routes>
    </MemoryRouter>
  );
};

const mockReport: InjuryReport = {
  id: 1,
  pet_id: 1,
  injury_id: 1,
  report_date: '2025-01-01',
  notes: 'First injury report',
};

const mockPets: Pet[] = [
  { id: 1, name: 'Buddy', pet_type: 'Dog', breed: 'Labrador', birthday: '2020-01-01', date_admitted: '2020-01-15' },
  { id: 2, name: 'Whiskers', pet_type: 'Cat', breed: 'Siamese', birthday: '2021-01-01', date_admitted: '2021-01-15' },
];

const mockInjuries: Injury[] = [
  { id: 1, description: 'Broken leg', severity: 'High' },
  { id: 2, description: 'Cut paw', severity: 'Low' },
];

describe('InjuryReportForm', () => {
  beforeEach(() => {
    (global.fetch as jest.Mock).mockClear();
  });

  describe('New Mode', () => {
    it('renders form in new mode', async () => {
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({ ok: true, json: async () => mockPets })
        .mockResolvedValueOnce({ ok: true, json: async () => mockInjuries });

      renderWithRouter('new');

      expect(screen.getByText('New Injury Report')).toBeInTheDocument();

      await waitFor(() => {
        expect(screen.getByLabelText(/Pet/)).toBeInTheDocument();
        expect(screen.getByLabelText(/Injury/)).toBeInTheDocument();
      });

      expect(screen.getByLabelText(/Report Date/)).toBeInTheDocument();
      expect(screen.getByText('Create Injury Report')).toBeInTheDocument();
    });

    it('submits form with valid data', async () => {
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({ ok: true, json: async () => mockPets })
        .mockResolvedValueOnce({ ok: true, json: async () => mockInjuries })
        .mockResolvedValueOnce({ ok: true, json: async () => mockReport });

      renderWithRouter('new');

      await waitFor(() => {
        expect(screen.getByLabelText(/Pet/)).toBeInTheDocument();
      });

      const petSelect = screen.getByLabelText(/Pet/);
      const injurySelect = screen.getByLabelText(/Injury/);
      const dateInput = screen.getByLabelText(/Report Date/);

      fireEvent.change(petSelect, { target: { value: '1' } });
      fireEvent.change(injurySelect, { target: { value: '1' } });
      fireEvent.change(dateInput, { target: { value: '2025-01-01' } });

      const submitButton = screen.getByText('Create Injury Report');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith('/api/v1/injury_reports', expect.objectContaining({
          method: 'POST',
        }));
      });
    });
  });

  describe('Edit Mode', () => {
    it('fetches and displays existing report data', async () => {
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({ ok: true, json: async () => mockPets })
        .mockResolvedValueOnce({ ok: true, json: async () => mockInjuries })
        .mockResolvedValueOnce({ ok: true, json: async () => mockReport });

      renderWithRouter('edit', 1);

      await waitFor(() => {
        const petSelect = screen.getByLabelText(/Pet/) as HTMLSelectElement;
        expect(petSelect.value).toBe('1');
      });

      expect(screen.getByText('Edit Injury Report')).toBeInTheDocument();
    });

    it('submits updated data', async () => {
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({ ok: true, json: async () => mockPets })
        .mockResolvedValueOnce({ ok: true, json: async () => mockInjuries })
        .mockResolvedValueOnce({ ok: true, json: async () => mockReport })
        .mockResolvedValueOnce({ ok: true, json: async () => ({ ...mockReport, notes: 'Updated notes' }) });

      renderWithRouter('edit', 1);

      await waitFor(() => {
        expect(screen.getByDisplayValue('First injury report')).toBeInTheDocument();
      });

      const notesInput = screen.getByLabelText(/Notes/);
      fireEvent.change(notesInput, { target: { value: 'Updated notes' } });

      const submitButton = screen.getByText('Update Injury Report');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith('/api/v1/injury_reports/1', expect.objectContaining({
          method: 'PUT',
        }));
      });
    });
  });

  describe('Navigation', () => {
    it('displays back button linking to reports index', async () => {
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({ ok: true, json: async () => mockPets })
        .mockResolvedValueOnce({ ok: true, json: async () => mockInjuries });

      renderWithRouter('new');

      await waitFor(() => {
        const backLink = screen.getByText('Back');
        expect(backLink).toHaveAttribute('href', '/injury_reports');
      });
    });
  });
});
