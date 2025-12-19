import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { InjuryReportShow } from '../InjuryReportShow';
import { InjuryReport } from '../../../types/injuryReport';

const renderWithRouter = (reportId: number) => {
  return render(
    <MemoryRouter initialEntries={[`/injury_reports/${reportId}`]}>
      <Routes>
        <Route path="/injury_reports/:id" element={<InjuryReportShow />} />
      </Routes>
    </MemoryRouter>
  );
};

const mockReport: InjuryReport = {
  id: 1,
  pet_id: 1,
  injury_id: 1,
  date: '2025-01-01',
  body_part: 'Left leg',
  description: 'First injury report',
};

describe('InjuryReportShow', () => {
  beforeEach(() => {
    (global.fetch as jest.Mock).mockClear();
    (global.confirm as jest.Mock).mockClear();
  });

  it('displays loading state initially', () => {
    (global.fetch as jest.Mock).mockImplementation(() =>
      new Promise(() => {})
    );

    renderWithRouter(1);
    expect(screen.getByText('Loading injury report...')).toBeInTheDocument();
  });

  it('fetches and displays injury report details', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockReport,
    });

    renderWithRouter(1);

    await waitFor(() => {
      expect(screen.getByText('Injury Report #1')).toBeInTheDocument();
      expect(screen.getByText('First injury report')).toBeInTheDocument();
    });
  });

  it('displays error message when fetch fails', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ errors: ['Failed to fetch injury report'] }),
    });

    renderWithRouter(1);

    await waitFor(() => {
      expect(screen.getByText(/Failed to fetch injury report/)).toBeInTheDocument();
    });
  });

  it('calls fetch with correct URL', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockReport,
    });

    renderWithRouter(1);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/v1/injury_reports/1', {
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
      json: async () => mockReport,
    });

    renderWithRouter(1);

    await waitFor(() => {
      expect(screen.getByText('Edit this injury report')).toBeInTheDocument();
      expect(screen.getByText('Destroy this injury report')).toBeInTheDocument();
    });

    const editLink = screen.getByText('Edit this injury report');
    expect(editLink).toHaveAttribute('href', '/injury_reports/1/edit');
  });

  it('handles delete with confirmation', async () => {
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockReport,
      })
      .mockResolvedValueOnce({
        ok: true,
        status: 204,
        json: async () => null,
      });

    (global.confirm as jest.Mock).mockReturnValue(true);

    renderWithRouter(1);

    await waitFor(() => {
      expect(screen.getByText('Injury Report #1')).toBeInTheDocument();
    });

    const deleteButton = screen.getByText('Destroy this injury report');
    fireEvent.click(deleteButton);

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
      json: async () => mockReport,
    });

    (global.confirm as jest.Mock).mockReturnValue(false);

    renderWithRouter(1);

    await waitFor(() => {
      expect(screen.getByText('Injury Report #1')).toBeInTheDocument();
    });

    const deleteButton = screen.getByText('Destroy this injury report');
    fireEvent.click(deleteButton);

    expect(global.confirm).toHaveBeenCalled();

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });
  });

  it('displays back link', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockReport,
    });

    renderWithRouter(1);

    await waitFor(() => {
      const backLink = screen.getByText('Back');
      expect(backLink).toHaveAttribute('href', '/injury_reports');
    });
  });
});
