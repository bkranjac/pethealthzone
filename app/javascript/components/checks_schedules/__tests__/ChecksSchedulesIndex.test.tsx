import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ChecksSchedulesIndex } from '../ChecksSchedulesIndex';
import { ChecksSchedule } from '../../../types/checksSchedule';

const renderWithRouter = () => {
  return render(
    <MemoryRouter>
      <ChecksSchedulesIndex />
    </MemoryRouter>
  );
};

const mockSchedules: ChecksSchedule[] = [
  {
    id: 1,
    pet_id: 1,
    check_id: 1,
    date_created: '2025-01-01',
    notes: 'Regular checkup',
    performed: false,
  },
  {
    id: 2,
    pet_id: 2,
    check_id: 2,
    date_created: '2025-02-01',
    performed: true,
  },
];

describe('ChecksSchedulesIndex', () => {
  beforeEach(() => {
    (global.fetch as jest.Mock).mockClear();
  });

  it('displays loading state initially', () => {
    (global.fetch as jest.Mock).mockImplementation(() =>
      new Promise(() => {})
    );

    renderWithRouter();
    expect(screen.getByText('Loading checks schedules...')).toBeInTheDocument();
  });

  it('fetches and displays checks schedules', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockSchedules,
    });

    renderWithRouter();

    await waitFor(() => {
      const petIdLabels = screen.getAllByText('Pet ID:');
      expect(petIdLabels.length).toBeGreaterThan(0);
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

  it('displays "no schedules found" message when array is empty', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });

    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByText(/No checks schedules found/i)).toBeInTheDocument();
    });
  });

  it('calls fetch with correct URL', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockSchedules,
    });

    renderWithRouter();

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/v1/checks_schedules', {
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
        json: async () => mockSchedules,
      })
      .mockResolvedValueOnce({
        ok: true,
        status: 204,
        json: async () => null,
      });

    (global.confirm as jest.Mock).mockReturnValue(true);

    renderWithRouter();

    await waitFor(() => {
      const petIdLabels = screen.getAllByText('Pet ID:');
      expect(petIdLabels.length).toBeGreaterThan(0);
    });

    const deleteButtons = screen.getAllByText('Delete');
    fireEvent.click(deleteButtons[0]);

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
      json: async () => mockSchedules,
    });

    (global.confirm as jest.Mock).mockReturnValue(false);

    renderWithRouter();

    await waitFor(() => {
      const petIdLabels = screen.getAllByText('Pet ID:');
      expect(petIdLabels.length).toBeGreaterThan(0);
    });

    const deleteButtons = screen.getAllByText('Delete');
    fireEvent.click(deleteButtons[0]);

    expect(global.confirm).toHaveBeenCalled();
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it('displays correct links for each schedule', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockSchedules,
    });

    renderWithRouter();

    await waitFor(() => {
      const petIdLabels = screen.getAllByText('Pet ID:');
      expect(petIdLabels.length).toBeGreaterThan(0);
    });

    const viewLinks = screen.getAllByText('View');
    const editLinks = screen.getAllByText('Edit');

    expect(viewLinks[0]).toHaveAttribute('href', '/checks_schedules/1');
    expect(editLinks[0]).toHaveAttribute('href', '/checks_schedules/1/edit');
  });

  it('displays new schedule link', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockSchedules,
    });

    renderWithRouter();

    await waitFor(() => {
      const newLink = screen.getByText('New checks schedule');
      expect(newLink).toHaveAttribute('href', '/checks_schedules/new');
    });
  });
});
