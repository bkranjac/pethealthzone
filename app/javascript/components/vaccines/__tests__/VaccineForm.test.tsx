import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { VaccineForm } from '../VaccineForm';
import { Vaccine } from '../../../types/vaccine';
import { Frequency } from '../../../types/frequency';

const renderWithRouter = (mode: 'new' | 'edit', vaccineId?: number) => {
  const path = mode === 'new' ? '/vaccines/new' : `/vaccines/${vaccineId}/edit`;
  const routePath = mode === 'new' ? '/vaccines/new' : '/vaccines/:id/edit';

  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path={routePath} element={<VaccineForm mode={mode} />} />
        <Route path="/vaccines/:id" element={<div>Vaccine Show Page</div>} />
        <Route path="/vaccines" element={<div>Vaccines Index Page</div>} />
      </Routes>
    </MemoryRouter>
  );
};

const mockVaccine: Vaccine = {
  id: 1,
  name: 'Rabies Vaccine',
  description: 'Rabies prevention vaccine',
  frequency_id: 1,
};

const mockFrequencies: Frequency[] = [
  { id: 1, interval_days: 7 },
  { id: 2, interval_days: 30 },
];

describe('VaccineForm', () => {
  beforeEach(() => {
    (global.fetch as jest.Mock).mockClear();
  });

  describe('New Mode', () => {
    it('renders form in new mode', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockFrequencies,
      });

      renderWithRouter('new');

      expect(screen.getByText('New Vaccine')).toBeInTheDocument();
      expect(screen.getByLabelText(/Name/)).toBeInTheDocument();
      expect(screen.getByLabelText(/Description/)).toBeInTheDocument();

      await waitFor(() => {
        expect(screen.getByLabelText(/Frequency/)).toBeInTheDocument();
      });

      expect(screen.getByText('Create Vaccine')).toBeInTheDocument();
    });

    it('submits form with valid data', async () => {
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockFrequencies,
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockVaccine,
        });

      renderWithRouter('new');

      await waitFor(() => {
        expect(screen.getByLabelText(/Frequency/)).toBeInTheDocument();
      });

      const nameInput = screen.getByLabelText(/Name/);
      const descriptionInput = screen.getByLabelText(/Description/);
      const frequencySelect = screen.getByLabelText(/Frequency/);

      fireEvent.change(nameInput, { target: { value: 'Rabies Vaccine' } });
      fireEvent.change(descriptionInput, { target: { value: 'Rabies prevention vaccine' } });
      fireEvent.change(frequencySelect, { target: { value: '1' } });

      const submitButton = screen.getByText('Create Vaccine');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith('/api/v1/vaccines', expect.objectContaining({
          method: 'POST',
          body: expect.stringContaining('"name":"Rabies Vaccine"'),
        }));
      });
    });
  });

  describe('Edit Mode', () => {
    it('fetches and displays existing vaccine data', async () => {
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockFrequencies,
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockVaccine,
        });

      renderWithRouter('edit', 1);

      await waitFor(() => {
        const nameInput = screen.getByLabelText(/Name/) as HTMLInputElement;
        expect(nameInput.value).toBe('Rabies Vaccine');
      });

      const descriptionInput = screen.getByLabelText(/Description/) as HTMLInputElement;
      expect(descriptionInput.value).toBe('Rabies prevention vaccine');
      expect(screen.getByText('Edit Vaccine')).toBeInTheDocument();
    });

    it('submits updated data', async () => {
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockFrequencies,
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockVaccine,
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ ...mockVaccine, name: 'Updated Vaccine' }),
        });

      renderWithRouter('edit', 1);

      await waitFor(() => {
        expect(screen.getByDisplayValue('Rabies Vaccine')).toBeInTheDocument();
      });

      const nameInput = screen.getByLabelText(/Name/);
      fireEvent.change(nameInput, { target: { value: 'Updated Vaccine' } });

      const submitButton = screen.getByText('Update Vaccine');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith('/api/v1/vaccines/1', expect.objectContaining({
          method: 'PUT',
          body: expect.stringContaining('"name":"Updated Vaccine"'),
        }));
      });
    });
  });

  describe('Navigation', () => {
    it('displays back button linking to vaccines index', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockFrequencies,
      });

      renderWithRouter('new');

      await waitFor(() => {
        const backLink = screen.getByText('Back');
        expect(backLink).toHaveAttribute('href', '/vaccines');
      });
    });
  });
});
