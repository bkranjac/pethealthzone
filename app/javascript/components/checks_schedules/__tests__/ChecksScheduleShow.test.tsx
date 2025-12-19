import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { ChecksScheduleShow } from '../ChecksScheduleShow';
import { ChecksSchedule } from '../../../types/checksSchedule';

const renderWithRouter = (scheduleId: number) => {
  return render(
    <MemoryRouter initialEntries={[`/checks_schedules/${scheduleId}`]}>
      <Routes>
        <Route path="/checks_schedules/:id" element={<ChecksScheduleShow />} />
      </Routes>
    </MemoryRouter>
  );
};

const mockSchedule: ChecksSchedule = {
  id: 1,
  pet_id: 1,
  check_id: 1,
  date_created: '2025-01-01',
  notes: 'Regular checkup',
  performed: false,
};

describe('ChecksScheduleShow', () => {
  beforeEach(() => {
    (global.fetch as jest.Mock).mockClear();
    (global.confirm as jest.Mock).mockClear();
  });

  it('displays loading state initially', () => {
    (global.fetch as jest.Mock).mockImplementation(() =>
      new Promise(() => {})
    );

    renderWithRouter(1);
    expect(screen.getByText('Loading checks schedule...')).toBeInTheDocument();
  });

  it('fetches and displays checks schedule details', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockSchedule,
    });

    renderWithRouter(1);

    await waitFor(() => {
      expect(screen.getByText('Checks Schedule #1')).toBeInTheDocument();
      expect(screen.getByText('Regular checkup')).toBeInTheDocument();
    });
  });

  it('displays error message when fetch fails', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ errors: ['Failed to fetch checks schedule'] }),
    });

    renderWithRouter(1);

    await waitFor(() => {
      expect(screen.getByText(/Failed to fetch checks schedule/)).toBeInTheDocument();
    });
  });

  it('calls fetch with correct URL', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockSchedule,
    });

    renderWithRouter(1);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/v1/checks_schedules/1', {
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
      expect(screen.getByText('Edit this checks schedule')).toBeInTheDocument();
      expect(screen.getByText('Destroy this checks schedule')).toBeInTheDocument();
    });

    const editLink = screen.getByText('Edit this checks schedule');
    expect(editLink).toHaveAttribute('href', '/checks_schedules/1/edit');
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
      expect(screen.getByText('Checks Schedule #1')).toBeInTheDocument();
    });

    const deleteButton = screen.getByText('Destroy this checks schedule');
    fireEvent.click(deleteButton);

    expect(global.confirm).toHaveBeenCalledWith('Are you sure you want to delete this checks schedule?');

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/v1/checks_schedules/1', expect.objectContaining({
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
      expect(screen.getByText('Checks Schedule #1')).toBeInTheDocument();
    });

    const deleteButton = screen.getByText('Destroy this checks schedule');
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
      expect(backLink).toHaveAttribute('href', '/checks_schedules');
    });
  });
});
