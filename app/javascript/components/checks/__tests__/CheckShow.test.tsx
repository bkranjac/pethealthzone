import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { CheckShow } from '../CheckShow';
import { Check } from '../../../types/check';

const renderWithRouter = (checkId: number) => {
  return render(
    <MemoryRouter initialEntries={[`/checks/${checkId}`]}>
      <Routes>
        <Route path="/checks/:id" element={<CheckShow />} />
      </Routes>
    </MemoryRouter>
  );
};

const mockCheck: Check = {
  id: 1,
  check_type: 'Heart Check',
  frequency_id: 1,
};

describe('CheckShow', () => {
  beforeEach(() => {
    (global.fetch as jest.Mock).mockClear();
    (global.confirm as jest.Mock).mockClear();
  });

  it('displays loading state initially', () => {
    (global.fetch as jest.Mock).mockImplementation(() =>
      new Promise(() => {})
    );

    renderWithRouter(1);
    expect(screen.getByText('Loading check...')).toBeInTheDocument();
  });

  it('fetches and displays check details', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockCheck,
    });

    renderWithRouter(1);

    await waitFor(() => {
      expect(screen.getByText('Heart Check')).toBeInTheDocument();
    });
  });

  it('displays error message when fetch fails', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ errors: ['Failed to fetch check'] }),
    });

    renderWithRouter(1);

    await waitFor(() => {
      expect(screen.getByText(/Failed to fetch check/)).toBeInTheDocument();
    });
  });

  it('calls fetch with correct URL', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockCheck,
    });

    renderWithRouter(1);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/v1/checks/1', {
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
      json: async () => mockCheck,
    });

    renderWithRouter(1);

    await waitFor(() => {
      expect(screen.getByText(/edit/i)).toBeInTheDocument();
      expect(screen.getByText(/delete/i)).toBeInTheDocument();
    });

    const editLink = screen.getByText(/edit/i);
    expect(editLink).toHaveAttribute('href', '/checks/1/edit');
  });

  it('handles delete with confirmation', async () => {
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockCheck,
      })
      .mockResolvedValueOnce({
        ok: true,
        status: 204,
        json: async () => null,
      });

    (global.confirm as jest.Mock).mockReturnValue(true);

    renderWithRouter(1);

    await waitFor(() => {
      expect(screen.getByText('Heart Check')).toBeInTheDocument();
    });

    const deleteButton = screen.getByText(/delete/i);
    fireEvent.click(deleteButton);

    expect(global.confirm).toHaveBeenCalledWith('Are you sure you want to delete this check?');

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/v1/checks/1', expect.objectContaining({
        method: 'DELETE',
      }));
    });
  });

  it('does not delete when confirmation is cancelled', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockCheck,
    });

    (global.confirm as jest.Mock).mockReturnValue(false);

    renderWithRouter(1);

    await waitFor(() => {
      expect(screen.getByText('Heart Check')).toBeInTheDocument();
    });

    const deleteButton = screen.getByText(/delete/i);
    fireEvent.click(deleteButton);

    expect(global.confirm).toHaveBeenCalled();

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });
  });

  it('displays back to checks link', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockCheck,
    });

    renderWithRouter(1);

    await waitFor(() => {
      const backLink = screen.getByText(/back.*checks/i);
      expect(backLink).toHaveAttribute('href', '/checks');
    });
  });
});
