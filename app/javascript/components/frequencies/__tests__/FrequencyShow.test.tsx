import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { FrequencyShow } from '../FrequencyShow';
import { Frequency } from '../../../types/frequency';

// Helper to render component with router
const renderWithRouter = (frequencyId: number) => {
  return render(
    <MemoryRouter initialEntries={[`/frequencies/${frequencyId}`]}>
      <Routes>
        <Route path="/frequencies/:id" element={<FrequencyShow />} />
      </Routes>
    </MemoryRouter>
  );
};

const mockFrequency: Frequency = {
  id: 1,
  name: 'Test Frequency',
  interval_days: 7,
};

describe('FrequencyShow', () => {
  beforeEach(() => {
    (global.fetch as jest.Mock).mockClear();
    (global.confirm as jest.Mock).mockClear();
  });

  it('displays loading state initially', () => {
    (global.fetch as jest.Mock).mockImplementation(() =>
      new Promise(() => {}) // Never resolves
    );

    renderWithRouter(1);
    expect(screen.getByText('Loading frequency...')).toBeInTheDocument();
  });

  it('fetches and displays frequency details', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockFrequency,
    });

    renderWithRouter(1);

    await waitFor(() => {
      expect(screen.getByText('Every 7 days')).toBeInTheDocument();
    });

    expect(screen.getByText('7')).toBeInTheDocument();
  });

  it('displays error message when fetch fails', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ errors: ['Failed to fetch frequency'] }),
    });

    renderWithRouter(1);

    await waitFor(() => {
      expect(screen.getByText(/Failed to fetch frequency/)).toBeInTheDocument();
    });
  });

  it('calls fetch with correct URL', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockFrequency,
    });

    renderWithRouter(1);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/v1/frequencies/1', {
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
      json: async () => mockFrequency,
    });

    renderWithRouter(1);

    await waitFor(() => {
      expect(screen.getByText('Edit this frequency')).toBeInTheDocument();
      expect(screen.getByText('Destroy this frequency')).toBeInTheDocument();
    });

    const editLink = screen.getByText('Edit this frequency');
    expect(editLink).toHaveAttribute('href', '/frequencies/1/edit');
  });

  it('handles delete with confirmation', async () => {
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockFrequency,
      })
      .mockResolvedValueOnce({
        ok: true,
        status: 204,
        json: async () => null,
      });

    (global.confirm as jest.Mock).mockReturnValue(true);

    renderWithRouter(1);

    await waitFor(() => {
      expect(screen.getByText('Every 7 days')).toBeInTheDocument();
    });

    const deleteButton = screen.getByText('Destroy this frequency');
    fireEvent.click(deleteButton);

    expect(global.confirm).toHaveBeenCalledWith('Are you sure you want to delete this frequency?');

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/v1/frequencies/1', expect.objectContaining({
        method: 'DELETE',
      }));
    });
  });

  it('does not delete when confirmation is cancelled', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockFrequency,
    });

    (global.confirm as jest.Mock).mockReturnValue(false);

    renderWithRouter(1);

    await waitFor(() => {
      expect(screen.getByText('Every 7 days')).toBeInTheDocument();
    });

    const deleteButton = screen.getByText('Destroy this frequency');
    fireEvent.click(deleteButton);

    expect(global.confirm).toHaveBeenCalled();

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1); // Only the initial fetch
    });
  });

  it('displays back to frequencies link', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockFrequency,
    });

    renderWithRouter(1);

    await waitFor(() => {
      const backLink = screen.getByText('Back');
      expect(backLink).toHaveAttribute('href', '/frequencies');
    });
  });
});
