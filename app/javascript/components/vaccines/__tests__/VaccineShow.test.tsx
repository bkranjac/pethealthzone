import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { VaccineShow } from '../VaccineShow';
import { Vaccine } from '../../../types/vaccine';

const renderWithRouter = (vaccineId: number) => {
  return render(
    <MemoryRouter initialEntries={[`/vaccines/${vaccineId}`]}>
      <Routes>
        <Route path="/vaccines/:id" element={<VaccineShow />} />
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

describe('VaccineShow', () => {
  beforeEach(() => {
    (global.fetch as jest.Mock).mockClear();
    (global.confirm as jest.Mock).mockClear();
  });

  it('displays loading state initially', () => {
    (global.fetch as jest.Mock).mockImplementation(() =>
      new Promise(() => {})
    );

    renderWithRouter(1);
    expect(screen.getByText('Loading vaccine...')).toBeInTheDocument();
  });

  it('fetches and displays vaccine details', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockVaccine,
    });

    renderWithRouter(1);

    await waitFor(() => {
      expect(screen.getByText('Rabies Vaccine')).toBeInTheDocument();
    });

    expect(screen.getByText('Rabies prevention vaccine')).toBeInTheDocument();
  });

  it('displays error message when fetch fails', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ errors: ['Failed to fetch vaccine'] }),
    });

    renderWithRouter(1);

    await waitFor(() => {
      expect(screen.getByText(/Failed to fetch vaccine/)).toBeInTheDocument();
    });
  });

  it('calls fetch with correct URL', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockVaccine,
    });

    renderWithRouter(1);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/v1/vaccines/1', {
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
      json: async () => mockVaccine,
    });

    renderWithRouter(1);

    await waitFor(() => {
      expect(screen.getByText('Edit this vaccine')).toBeInTheDocument();
      expect(screen.getByText('Destroy this vaccine')).toBeInTheDocument();
    });

    const editLink = screen.getByText('Edit this vaccine');
    expect(editLink).toHaveAttribute('href', '/vaccines/1/edit');
  });

  it('handles delete with confirmation', async () => {
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockVaccine,
      })
      .mockResolvedValueOnce({
        ok: true,
        status: 204,
        json: async () => null,
      });

    (global.confirm as jest.Mock).mockReturnValue(true);

    renderWithRouter(1);

    await waitFor(() => {
      expect(screen.getByText('Rabies Vaccine')).toBeInTheDocument();
    });

    const deleteButton = screen.getByText('Destroy this vaccine');
    fireEvent.click(deleteButton);

    expect(global.confirm).toHaveBeenCalledWith('Are you sure you want to delete this vaccine?');

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/v1/vaccines/1', expect.objectContaining({
        method: 'DELETE',
      }));
    });
  });

  it('does not delete when confirmation is cancelled', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockVaccine,
    });

    (global.confirm as jest.Mock).mockReturnValue(false);

    renderWithRouter(1);

    await waitFor(() => {
      expect(screen.getByText('Rabies Vaccine')).toBeInTheDocument();
    });

    const deleteButton = screen.getByText('Destroy this vaccine');
    fireEvent.click(deleteButton);

    expect(global.confirm).toHaveBeenCalled();

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });
  });

  it('displays back to vaccines link', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockVaccine,
    });

    renderWithRouter(1);

    await waitFor(() => {
      const backLink = screen.getByText('Back');
      expect(backLink).toHaveAttribute('href', '/vaccines');
    });
  });
});
