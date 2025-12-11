import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { MedicationScheduleShow } from '../MedicationScheduleShow';
import { MedicationSchedule } from '../../../types/medicationSchedule';

const renderWithRouter = (scheduleId: number) => {
  return render(
    <MemoryRouter initialEntries={[`/medication_schedules/${scheduleId}`]}>
      <Routes>
        <Route path="/medication_schedules/:id" element={<MedicationScheduleShow />} />
      </Routes>
    </MemoryRouter>
  );
};

const mockSchedule: MedicationSchedule = {
  id: 1,
  pet_id: 1,
  medication_id: 1,
  frequency_id: 1,
  date_started: '2025-01-01',
  notes: 'Morning dose',
};

describe('MedicationScheduleShow', () => {
  beforeEach(() => {
    (global.fetch as jest.Mock).mockClear();
    (global.confirm as jest.Mock).mockClear();
  });

  it('displays loading state initially', () => {
    (global.fetch as jest.Mock).mockImplementation(() =>
      new Promise(() => {})
    );

    renderWithRouter(1);
    expect(screen.getByText('Loading medication schedule...')).toBeInTheDocument();
  });

  it('fetches and displays medication schedule details', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockSchedule,
    });

    renderWithRouter(1);

    await waitFor(() => {
      expect(screen.getByText('Medication Schedule #1')).toBeInTheDocument();
      expect(screen.getByText('Morning dose')).toBeInTheDocument();
    });
  });

  it('displays error message when fetch fails', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ errors: ['Failed to fetch medication schedule'] }),
    });

    renderWithRouter(1);

    await waitFor(() => {
      expect(screen.getByText(/Failed to fetch medication schedule/)).toBeInTheDocument();
    });
  });

  it('calls fetch with correct URL', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockSchedule,
    });

    renderWithRouter(1);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/v1/medication_schedules/1', {
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
      expect(screen.getByText('Edit this medication schedule')).toBeInTheDocument();
      expect(screen.getByText('Destroy this medication schedule')).toBeInTheDocument();
    });

    const editLink = screen.getByText('Edit this medication schedule');
    expect(editLink).toHaveAttribute('href', '/medication_schedules/1/edit');
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
      expect(screen.getByText('Medication Schedule #1')).toBeInTheDocument();
    });

    const deleteButton = screen.getByText('Destroy this medication schedule');
    fireEvent.click(deleteButton);

    expect(global.confirm).toHaveBeenCalledWith('Are you sure you want to delete this medication schedule?');

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/v1/medication_schedules/1', expect.objectContaining({
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
      expect(screen.getByText('Medication Schedule #1')).toBeInTheDocument();
    });

    const deleteButton = screen.getByText('Destroy this medication schedule');
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
      expect(backLink).toHaveAttribute('href', '/medication_schedules');
    });
  });
});
