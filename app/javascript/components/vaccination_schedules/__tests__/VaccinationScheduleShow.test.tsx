import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { VaccinationScheduleShow } from '../VaccinationScheduleShow';
import { VaccinationSchedule } from '../../../types/vaccinationSchedule';

const renderWithRouter = (scheduleId: number) => {
  return render(
    <MemoryRouter initialEntries={[`/vaccination_schedules/${scheduleId}`]}>
      <Routes>
        <Route path="/vaccination_schedules/:id" element={<VaccinationScheduleShow />} />
      </Routes>
    </MemoryRouter>
  );
};

const mockSchedule: VaccinationSchedule = {
  id: 1,
  pet_id: 1,
  vaccine_id: 1,
  frequency_id: 1,
  date_given: '2025-01-01',
  notes: 'First vaccination',
};

describe('VaccinationScheduleShow', () => {
  beforeEach(() => {
    (global.fetch as jest.Mock).mockClear();
    (global.confirm as jest.Mock).mockClear();
  });

  it('displays loading state initially', () => {
    (global.fetch as jest.Mock).mockImplementation(() =>
      new Promise(() => {})
    );

    renderWithRouter(1);
    expect(screen.getByText('Loading vaccination schedule...')).toBeInTheDocument();
  });

  it('fetches and displays vaccination schedule details', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockSchedule,
    });

    renderWithRouter(1);

    await waitFor(() => {
      expect(screen.getByText('Vaccination Schedule #1')).toBeInTheDocument();
      expect(screen.getByText('First vaccination')).toBeInTheDocument();
    });
  });

  it('displays error message when fetch fails', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ errors: ['Failed to fetch vaccination schedule'] }),
    });

    renderWithRouter(1);

    await waitFor(() => {
      expect(screen.getByText(/Failed to fetch vaccination schedule/)).toBeInTheDocument();
    });
  });

  it('calls fetch with correct URL', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockSchedule,
    });

    renderWithRouter(1);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/v1/vaccination_schedules/1', {
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
      json: async () => mockSchedule,
    });

    renderWithRouter(1);

    await waitFor(() => {
      expect(screen.getByText('Edit this vaccination schedule')).toBeInTheDocument();
      expect(screen.getByText('Destroy this vaccination schedule')).toBeInTheDocument();
    });

    const editLink = screen.getByText('Edit this vaccination schedule');
    expect(editLink).toHaveAttribute('href', '/vaccination_schedules/1/edit');
  });

  it('handles delete with confirmation', async () => {
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockSchedule,
      })
      .mockResolvedValueOnce({
        ok: true,
        status: 204,
        json: async () => null,
      });

    (global.confirm as jest.Mock).mockReturnValue(true);

    renderWithRouter(1);

    await waitFor(() => {
      expect(screen.getByText('Vaccination Schedule #1')).toBeInTheDocument();
    });

    const deleteButton = screen.getByText('Destroy this vaccination schedule');
    fireEvent.click(deleteButton);

    expect(global.confirm).toHaveBeenCalledWith('Are you sure you want to delete this vaccination schedule?');

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/v1/vaccination_schedules/1', expect.objectContaining({
        method: 'DELETE',
      }));
    });
  });

  it('does not delete when confirmation is cancelled', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockSchedule,
    });

    (global.confirm as jest.Mock).mockReturnValue(false);

    renderWithRouter(1);

    await waitFor(() => {
      expect(screen.getByText('Vaccination Schedule #1')).toBeInTheDocument();
    });

    const deleteButton = screen.getByText('Destroy this vaccination schedule');
    fireEvent.click(deleteButton);

    expect(global.confirm).toHaveBeenCalled();

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });
  });

  it('displays back link', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockSchedule,
    });

    renderWithRouter(1);

    await waitFor(() => {
      const backLink = screen.getByText('Back');
      expect(backLink).toHaveAttribute('href', '/vaccination_schedules');
    });
  });
});
