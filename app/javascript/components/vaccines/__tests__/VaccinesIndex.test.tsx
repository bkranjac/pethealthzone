import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { VaccinesIndex } from '../VaccinesIndex';
import { Vaccine } from '../../../types/vaccine';

// Helper to render component with router
const renderWithRouter = () => {
  return render(
    <MemoryRouter>
      <VaccinesIndex />
    </MemoryRouter>
  );
};

const mockVaccines: Vaccine[] = [
  {
    id: 1,
    name: 'Rabies Vaccine',
    description: 'Rabies prevention vaccine',
    frequency_id: 1,
  },
  {
    id: 2,
    name: 'Distemper Vaccine',
    description: 'Distemper prevention vaccine',
    frequency_id: 2,
  },
];

describe('VaccinesIndex', () => {
  beforeEach(() => {
    (global.fetch as jest.Mock).mockClear();
  });

  it('displays loading state initially', () => {
    (global.fetch as jest.Mock).mockImplementation(() =>
      new Promise(() => {}) // Never resolves
    );

    renderWithRouter();
    expect(screen.getByText('Loading vaccines...')).toBeInTheDocument();
  });

  it('fetches and displays vaccines', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockVaccines,
    });

    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByText('Rabies Vaccine')).toBeInTheDocument();
      expect(screen.getByText('Distemper Vaccine')).toBeInTheDocument();
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

  it('displays "no vaccines found" message when array is empty', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });

    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByText('No vaccines found.')).toBeInTheDocument();
    });
  });

  it('calls fetch with correct URL', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockVaccines,
    });

    renderWithRouter();

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/v1/vaccines', {
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
        json: async () => mockVaccines,
      })
      .mockResolvedValueOnce({
        ok: true,
        status: 204,
        json: async () => null,
      });

    (global.confirm as jest.Mock).mockReturnValue(true);

    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByText('Rabies Vaccine')).toBeInTheDocument();
    });

    const deleteButtons = screen.getAllByText('Delete');
    fireEvent.click(deleteButtons[0]);

    expect(global.confirm).toHaveBeenCalledWith('Are you sure you want to delete this vaccine?');

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/v1/vaccines/1', expect.objectContaining({
        method: 'DELETE',
      }));
    });

    await waitFor(() => {
      expect(screen.queryByText('Rabies Vaccine')).not.toBeInTheDocument();
    });
  });

  it('does not delete when confirmation is cancelled', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockVaccines,
    });

    (global.confirm as jest.Mock).mockReturnValue(false);

    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByText('Rabies Vaccine')).toBeInTheDocument();
    });

    const deleteButtons = screen.getAllByText('Delete');
    fireEvent.click(deleteButtons[0]);

    expect(global.confirm).toHaveBeenCalled();
    expect(screen.getByText('Rabies Vaccine')).toBeInTheDocument();
  });

  it('displays correct links for each vaccine', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockVaccines,
    });

    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByText('Rabies Vaccine')).toBeInTheDocument();
    });

    const viewLinks = screen.getAllByText('View');
    const editLinks = screen.getAllByText('Edit');

    expect(viewLinks[0]).toHaveAttribute('href', '/vaccines/1');
    expect(editLinks[0]).toHaveAttribute('href', '/vaccines/1/edit');
  });

  it('displays new vaccine link', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockVaccines,
    });

    renderWithRouter();

    await waitFor(() => {
      const newLink = screen.getByText('New vaccine');
      expect(newLink).toHaveAttribute('href', '/vaccines/new');
    });
  });
});
