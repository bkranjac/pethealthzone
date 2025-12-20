import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { CheckForm } from '../CheckForm';
import { Check } from '../../../types/check';
import { Frequency } from '../../../types/frequency';

const renderWithRouter = (mode: 'new' | 'edit', checkId?: number) => {
  const path = mode === 'new' ? '/checks/new' : `/checks/${checkId}/edit`;
  const routePath = mode === 'new' ? '/checks/new' : '/checks/:id/edit';

  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path={routePath} element={<CheckForm mode={mode} />} />
        <Route path="/checks/:id" element={<div>Check Show Page</div>} />
        <Route path="/checks" element={<div>Checks Index Page</div>} />
      </Routes>
    </MemoryRouter>
  );
};

const mockCheck: Check = {
  id: 1,
  check_type: 'Heart Check',
  frequency_id: 1,
};

const mockFrequencies: Frequency[] = [
  { id: 1, name: 'Weekly', interval_days: 7 },
  { id: 2, name: 'Monthly', interval_days: 30 },
];

describe('CheckForm', () => {
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

      expect(screen.getByText('New Check')).toBeInTheDocument();
      expect(screen.getByLabelText(/Check Type/)).toBeInTheDocument();

      await waitFor(() => {
        expect(screen.getByLabelText(/How Often/i)).toBeInTheDocument();
      });

      expect(screen.getByText('Create Check')).toBeInTheDocument();
    });

    it('submits form with valid data', async () => {
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockFrequencies,
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockCheck,
        });

      renderWithRouter('new');

      await waitFor(() => {
        expect(screen.getByLabelText(/How Often/i)).toBeInTheDocument();
      });

      const nameInput = screen.getByLabelText(/Check Type/);
      const frequencySelect = screen.getByLabelText(/How Often/i);

      fireEvent.change(nameInput, { target: { value: 'Heart Check' } });
      fireEvent.change(frequencySelect, { target: { value: '1' } });

      const submitButton = screen.getByText('Create Check');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith('/api/v1/checks', expect.objectContaining({
          method: 'POST',
          body: expect.stringContaining('"check_type":"Heart Check"'),
        }));
      });
    });
  });

  describe('Edit Mode', () => {
    it('fetches and displays existing check data', async () => {
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockFrequencies,
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockCheck,
        });

      renderWithRouter('edit', 1);

      await waitFor(() => {
        const nameInput = screen.getByLabelText(/Check Type/) as HTMLInputElement;
        expect(nameInput.value).toBe('Heart Check');
      });

      expect(screen.getByText('Edit Check')).toBeInTheDocument();
    });

    it('submits updated data', async () => {
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockFrequencies,
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockCheck,
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ ...mockCheck, check_type: 'Updated Check' }),
        });

      renderWithRouter('edit', 1);

      await waitFor(() => {
        expect(screen.getByDisplayValue('Heart Check')).toBeInTheDocument();
      });

      const nameInput = screen.getByLabelText(/Check Type/);
      fireEvent.change(nameInput, { target: { value: 'Updated Check' } });

      const submitButton = screen.getByText('Update Check');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith('/api/v1/checks/1', expect.objectContaining({
          method: 'PUT',
          body: expect.stringContaining('"check_type":"Updated Check"'),
        }));
      });
    });
  });

  describe('Navigation', () => {
    it('displays cancel button linking to checks index', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockFrequencies,
      });

      renderWithRouter('new');

      await waitFor(() => {
        const cancelLink = screen.getByText('Cancel');
        expect(cancelLink).toHaveAttribute('href', '/checks');
      });
    });
  });
});
