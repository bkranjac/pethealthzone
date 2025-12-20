import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { FrequenciesIndex } from '../FrequenciesIndex';
import { Frequency } from '../../../types/frequency';

// Helper to render component with router
const renderWithRouter = () => {
  return render(
    <MemoryRouter>
      <FrequenciesIndex />
    </MemoryRouter>
  );
};

const mockFrequencies: Frequency[] = [
  {
    id: 1,
    name: 'Weekly',
    interval_days: 7,
  },
  {
    id: 2,
    name: 'Monthly',
    interval_days: 30,
  },
];

describe('FrequenciesIndex', () => {
  beforeEach(() => {
    (global.fetch as jest.Mock).mockClear();
  });

  it('displays loading state initially', () => {
    (global.fetch as jest.Mock).mockImplementation(() =>
      new Promise(() => {}) // Never resolves
    );

    renderWithRouter();
    expect(screen.getByText('Loading frequencies...')).toBeInTheDocument();
  });

  it('fetches and displays frequencies', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockFrequencies,
    });

    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByText('Every 7 days')).toBeInTheDocument();
      expect(screen.getByText('Every 30 days')).toBeInTheDocument();
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

  it('displays "no frequencies found" message when array is empty', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });

    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByText(/No frequencies found/i)).toBeInTheDocument();
    });
  });

  it('calls fetch with correct URL', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockFrequencies,
    });

    renderWithRouter();

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/v1/frequencies', {
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
        json: async () => mockFrequencies,
      })
      .mockResolvedValueOnce({
        ok: true,
        status: 204,
        json: async () => null,
      });

    (global.confirm as jest.Mock).mockReturnValue(true);

    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByText('Every 7 days')).toBeInTheDocument();
    });

    const deleteButtons = screen.getAllByText('Delete');
    fireEvent.click(deleteButtons[0]);

    expect(global.confirm).toHaveBeenCalledWith('Are you sure you want to delete this frequency?');

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/v1/frequencies/1', expect.objectContaining({
        method: 'DELETE',
      }));
    });

    await waitFor(() => {
      expect(screen.queryByText('Every 7 days')).not.toBeInTheDocument();
    });
  });

  it('does not delete when confirmation is cancelled', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockFrequencies,
    });

    (global.confirm as jest.Mock).mockReturnValue(false);

    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByText('Every 7 days')).toBeInTheDocument();
    });

    const deleteButtons = screen.getAllByText('Delete');
    fireEvent.click(deleteButtons[0]);

    expect(global.confirm).toHaveBeenCalled();
    expect(screen.getByText('Every 7 days')).toBeInTheDocument();
  });

  it('displays correct links for each frequency', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockFrequencies,
    });

    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByText('Every 7 days')).toBeInTheDocument();
    });

    const viewLinks = screen.getAllByText('View');
    const editLinks = screen.getAllByText('Edit');

    expect(viewLinks[0]).toHaveAttribute('href', '/frequencies/1');
    expect(editLinks[0]).toHaveAttribute('href', '/frequencies/1/edit');
  });

  it('displays new frequency link', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockFrequencies,
    });

    renderWithRouter();

    await waitFor(() => {
      const newLink = screen.getByText(/add.*frequency/i);
      expect(newLink).toHaveAttribute('href', '/frequencies/new');
    });
  });
});
