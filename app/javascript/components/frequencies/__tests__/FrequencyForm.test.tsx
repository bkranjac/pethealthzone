import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { FrequencyForm } from '../FrequencyForm';
import { Frequency } from '../../../types/frequency';

// Helper to render component with router
const renderWithRouter = (mode: 'new' | 'edit', frequencyId?: number) => {
  const path = mode === 'new' ? '/frequencies/new' : `/frequencies/${frequencyId}/edit`;
  const routePath = mode === 'new' ? '/frequencies/new' : '/frequencies/:id/edit';

  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path={routePath} element={<FrequencyForm mode={mode} />} />
        <Route path="/frequencies/:id" element={<div>Frequency Show Page</div>} />
        <Route path="/frequencies" element={<div>Frequencies Index Page</div>} />
      </Routes>
    </MemoryRouter>
  );
};

const mockFrequency: Frequency = {
  id: 1,
  interval_days: 7,
};

describe('FrequencyForm', () => {
  beforeEach(() => {
    (global.fetch as jest.Mock).mockClear();
  });

  describe('New Mode', () => {
    it('renders form in new mode', () => {
      renderWithRouter('new');

      expect(screen.getByText('New Frequency')).toBeInTheDocument();
      expect(screen.getByLabelText(/Interval Days/)).toBeInTheDocument();
      expect(screen.getByText('Create Frequency')).toBeInTheDocument();
    });

    it('submits form with valid data', async () => {
      const user = userEvent.setup();

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ ...mockFrequency }),
      });

      renderWithRouter('new');

      const input = screen.getByLabelText(/Interval Days/);
      await user.clear(input);
      await user.type(input, '7');

      const submitButton = screen.getByText('Create Frequency');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith('/api/v1/frequencies', expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          }),
          body: expect.stringContaining('"interval_days":7'),
        }));
      });
    });

    it('displays error message when submission fails', async () => {
      const user = userEvent.setup();

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: async () => ({ errors: ['Interval days is required'] }),
      });

      renderWithRouter('new');

      const input = screen.getByLabelText(/Interval Days/);
      await user.clear(input);
      await user.type(input, '7');

      const submitButton = screen.getByText('Create Frequency');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/Interval days is required/)).toBeInTheDocument();
      });
    });

    it('disables submit button while submitting', async () => {
      const user = userEvent.setup();

      (global.fetch as jest.Mock).mockImplementation(() =>
        new Promise(() => {}) // Never resolves
      );

      renderWithRouter('new');

      const input = screen.getByLabelText(/Interval Days/);
      await user.clear(input);
      await user.type(input, '7');

      const submitButton = screen.getByText('Create Frequency');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Saving...')).toBeInTheDocument();
        expect(submitButton).toBeDisabled();
      });
    });
  });

  describe('Edit Mode', () => {
    it('fetches and displays existing frequency data', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockFrequency,
      });

      renderWithRouter('edit', 1);

      await waitFor(() => {
        const input = screen.getByLabelText(/Interval Days/) as HTMLInputElement;
        expect(input.value).toBe('7');
      });

      expect(screen.getByText('Edit Frequency')).toBeInTheDocument();
    });

    it('submits updated data', async () => {
      const user = userEvent.setup();

      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockFrequency,
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ ...mockFrequency, interval_days: 14 }),
        });

      renderWithRouter('edit', 1);

      await waitFor(() => {
        expect(screen.getByDisplayValue('7')).toBeInTheDocument();
      });

      const input = screen.getByLabelText(/Interval Days/);
      await user.clear(input);
      await user.type(input, '14');

      const submitButton = screen.getByText('Update Frequency');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith('/api/v1/frequencies/1', expect.objectContaining({
          method: 'PUT',
          body: expect.stringContaining('"interval_days":14'),
        }));
      });
    });

    it('displays error when fetch fails', async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Failed to fetch frequency'));

      renderWithRouter('edit', 1);

      await waitFor(() => {
        expect(screen.getByText(/Failed to fetch frequency/)).toBeInTheDocument();
      });
    });
  });

  describe('Navigation', () => {
    it('displays back button linking to frequencies index', () => {
      renderWithRouter('new');

      const backLink = screen.getByText('Back');
      expect(backLink).toHaveAttribute('href', '/frequencies');
    });
  });
});
