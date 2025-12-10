import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { MedicationShow } from '../MedicationShow';
import { Medication } from '../../../types/medication';

// Helper to render component with router
const renderWithRouter = (medicationId: number) => {
  return render(
    <MemoryRouter initialEntries={[`/medications/${medicationId}`]}>
      <Routes>
        <Route path="/medications/:id" element={<MedicationShow />} />
      </Routes>
    </MemoryRouter>
  );
};

const mockMedication: Medication = {
  id: 1,
  name: 'Aspirin',
  amount: '100mg',
  purpose: 'Pain relief',
  expiration_date: '2025-12-31',
};

describe('MedicationShow', () => {
  beforeEach(() => {
    (global.fetch as jest.Mock).mockClear();
    (global.confirm as jest.Mock).mockClear();
  });

  it('displays loading state initially', () => {
    (global.fetch as jest.Mock).mockImplementation(() =>
      new Promise(() => {}) // Never resolves
    );

    renderWithRouter(1);
    expect(screen.getByText('Loading medication...')).toBeInTheDocument();
  });

  it('fetches and displays medication details', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockMedication,
    });

    renderWithRouter(1);

    await waitFor(() => {
      expect(screen.getByText('Aspirin')).toBeInTheDocument();
    });

    expect(screen.getByText('100mg')).toBeInTheDocument();
    expect(screen.getByText('Pain relief')).toBeInTheDocument();
    expect(screen.getByText(/\d{1,2}\/\d{1,2}\/\d{4}/)).toBeInTheDocument();
  });

  it('displays error message when fetch fails', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ errors: ['Failed to fetch medication'] }),
    });

    renderWithRouter(1);

    await waitFor(() => {
      expect(screen.getByText(/Failed to fetch medication/)).toBeInTheDocument();
    });
  });

  it('calls fetch with correct URL', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockMedication,
    });

    renderWithRouter(1);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/v1/medications/1', {
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': 'test-csrf-token',
        },
      });
    });
  });

  it('displays edit and delete buttons', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockMedication,
    });

    renderWithRouter(1);

    await waitFor(() => {
      expect(screen.getByText('Edit this medication')).toBeInTheDocument();
      expect(screen.getByText('Destroy this medication')).toBeInTheDocument();
    });

    const editLink = screen.getByText('Edit this medication');
    expect(editLink).toHaveAttribute('href', '/medications/1/edit');
  });

  it('handles delete with confirmation', async () => {
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockMedication,
      })
      .mockResolvedValueOnce({
        ok: true,
        status: 204,
        json: async () => null,
      });

    (global.confirm as jest.Mock).mockReturnValue(true);

    renderWithRouter(1);

    await waitFor(() => {
      expect(screen.getByText('Aspirin')).toBeInTheDocument();
    });

    const deleteButton = screen.getByText('Destroy this medication');
    fireEvent.click(deleteButton);

    expect(global.confirm).toHaveBeenCalledWith('Are you sure you want to delete this medication?');

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/v1/medications/1', expect.objectContaining({
        method: 'DELETE',
      }));
    });
  });

  it('does not delete when confirmation is cancelled', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockMedication,
    });

    (global.confirm as jest.Mock).mockReturnValue(false);

    renderWithRouter(1);

    await waitFor(() => {
      expect(screen.getByText('Aspirin')).toBeInTheDocument();
    });

    const deleteButton = screen.getByText('Destroy this medication');
    fireEvent.click(deleteButton);

    expect(global.confirm).toHaveBeenCalled();

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1); // Only the initial fetch
    });
  });

  it('displays back to medications link', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockMedication,
    });

    renderWithRouter(1);

    await waitFor(() => {
      const backLink = screen.getByText('Back');
      expect(backLink).toHaveAttribute('href', '/medications');
    });
  });
});
