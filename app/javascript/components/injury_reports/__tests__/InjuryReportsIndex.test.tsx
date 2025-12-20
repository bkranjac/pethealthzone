import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { InjuryReportsIndex } from '../InjuryReportsIndex';
import { InjuryReport } from '../../../types/injuryReport';

const renderWithRouter = () => {
  return render(
    <MemoryRouter>
      <InjuryReportsIndex />
    </MemoryRouter>
  );
};

const mockReports: InjuryReport[] = [
  {
    id: 1,
    pet_id: 1,
    injury_id: 1,
    date: '2025-01-01',
    body_part: 'Left leg',
    description: 'First injury report',
  },
  {
    id: 2,
    pet_id: 2,
    injury_id: 2,
    date: '2025-02-01',
    body_part: 'Right paw',
    description: 'Second injury report',
  },
];

describe('InjuryReportsIndex', () => {
  beforeEach(() => {
    (global.fetch as jest.Mock).mockClear();
  });

  it('displays loading state initially', () => {
    (global.fetch as jest.Mock).mockImplementation(() =>
      new Promise(() => {})
    );

    renderWithRouter();
    expect(screen.getByText('Loading injury reports...')).toBeInTheDocument();
  });

  it('fetches and displays injury reports', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockReports,
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

  it('displays "no reports found" message when array is empty', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });

    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByText(/no.*injury.*reports.*found/i)).toBeInTheDocument();
    });
  });

  it('calls fetch with correct URL', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockReports,
    });

    renderWithRouter();

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/v1/injury_reports', {
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
        json: async () => mockReports,
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

    expect(global.confirm).toHaveBeenCalledWith('Are you sure you want to delete this injury report?');

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/v1/injury_reports/1', expect.objectContaining({
        method: 'DELETE',
      }));
    });
  });

  it('does not delete when confirmation is cancelled', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockReports,
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

  it('displays correct links for each report', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockReports,
    });

    renderWithRouter();

    await waitFor(() => {
      const petIdLabels = screen.getAllByText('Pet ID:');
      expect(petIdLabels.length).toBeGreaterThan(0);
    });

    const viewLinks = screen.getAllByText('View');
    const editLinks = screen.getAllByText('Edit');

    expect(viewLinks[0]).toHaveAttribute('href', '/injury_reports/1');
    expect(editLinks[0]).toHaveAttribute('href', '/injury_reports/1/edit');
  });

  it('displays new report link', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockReports,
    });

    renderWithRouter();

    await waitFor(() => {
      const newLink = screen.getByText(/add.*report/i);
      expect(newLink).toHaveAttribute('href', '/injury_reports/new');
    });
  });
});
