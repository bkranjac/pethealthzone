import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { MedicationsIndex } from '../MedicationsIndex';
import { Medication } from '../../../types/medication';

// Helper to render component with router
const renderWithRouter = () => {
  return render(
    <MemoryRouter>
      <MedicationsIndex />
    </MemoryRouter>
  );
};

const mockMedications: Medication[] = [
  {
    id: 1,
    name: 'Aspirin',
    amount: '100mg',
    purpose: 'Pain relief',
    expiration_date: '2025-12-31',
  },
  {
    id: 2,
    name: 'Antibiotic',
    amount: '250mg',
    purpose: 'Infection treatment',
    expiration_date: '2026-06-30',
  },
];

describe('MedicationsIndex', () => {
  beforeEach(() => {
    (global.fetch as jest.Mock).mockClear();
  });

  it('displays loading state initially', () => {
    (global.fetch as jest.Mock).mockImplementation(() =>
      new Promise(() => {}) // Never resolves
    );

    renderWithRouter();
    expect(screen.getByText('Loading medications...')).toBeInTheDocument();
  });

  it('fetches and displays medications', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockMedications,
    });

    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByText('Aspirin')).toBeInTheDocument();
      expect(screen.getByText('Antibiotic')).toBeInTheDocument();
      expect(screen.getByText('100mg')).toBeInTheDocument();
      expect(screen.getByText('Pain relief')).toBeInTheDocument();
    });
  });

  it('displays error message when fetch fails', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(
      new Error('Failed to fetch data')
    );

    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByText(/Failed to fetch data/)).toBeInTheDocument();
    });
  });

  it('displays "no medications found" message when array is empty', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });

    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByText(/No medications found/i)).toBeInTheDocument();
    });
  });

  it('calls fetch with correct URL', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockMedications,
    });

    renderWithRouter();

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/v1/medications', {
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': 'test-csrf-token',
        },
      });
    });
  });

  it('handles delete with confirmation', async () => {
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockMedications,
      })
      .mockResolvedValueOnce({
        ok: true,
        status: 204,
        json: async () => null,
      });

    (global.confirm as jest.Mock).mockReturnValue(true);

    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByText('Aspirin')).toBeInTheDocument();
    });

    const deleteButtons = screen.getAllByText('Delete');
    fireEvent.click(deleteButtons[0]);

    expect(global.confirm).toHaveBeenCalledWith('Are you sure you want to delete this medication?');

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/v1/medications/1', expect.objectContaining({
        method: 'DELETE',
      }));
    });

    await waitFor(() => {
      expect(screen.queryByText('Aspirin')).not.toBeInTheDocument();
    });
  });

  it('does not delete when confirmation is cancelled', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockMedications,
    });

    (global.confirm as jest.Mock).mockReturnValue(false);

    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByText('Aspirin')).toBeInTheDocument();
    });

    const deleteButtons = screen.getAllByText('Delete');
    fireEvent.click(deleteButtons[0]);

    expect(global.confirm).toHaveBeenCalled();
    expect(screen.getByText('Aspirin')).toBeInTheDocument();
  });

  it('displays correct links for each medication', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockMedications,
    });

    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByText('Aspirin')).toBeInTheDocument();
    });

    const viewLinks = screen.getAllByText('View');
    const editLinks = screen.getAllByText('Edit');

    expect(viewLinks[0]).toHaveAttribute('href', '/medications/1');
    expect(editLinks[0]).toHaveAttribute('href', '/medications/1/edit');
  });

  it('displays new medication link', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockMedications,
    });

    renderWithRouter();

    await waitFor(() => {
      const newLink = screen.getByText(/add.*medication/i);
      expect(newLink).toHaveAttribute('href', '/medications/new');
    });
  });
});
