import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { InjuryShow } from '../InjuryShow';
import { Injury } from '../../../types/injury';

// Helper to render component with router
const renderWithRouter = (injuryId: number) => {
  return render(
    <MemoryRouter initialEntries={[`/injuries/${injuryId}`]}>
      <Routes>
        <Route path="/injuries/:id" element={<InjuryShow />} />
      </Routes>
    </MemoryRouter>
  );
};

const mockInjury: Injury = {
  id: 1,
  description: 'Broken leg from fall',
  severity: 'high',
  created_at: '2024-01-15T10:00:00Z',
  updated_at: '2024-01-16T12:00:00Z',
};

describe('InjuryShow', () => {
  beforeEach(() => {
    (global.fetch as jest.Mock).mockClear();
    (global.confirm as jest.Mock).mockClear();
  });

  it('displays loading state initially', () => {
    (global.fetch as jest.Mock).mockImplementation(() =>
      new Promise(() => {}) // Never resolves
    );

    renderWithRouter(1);
    expect(screen.getByText('Loading injury...')).toBeInTheDocument();
  });

  it('fetches and displays injury details', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockInjury,
    });

    renderWithRouter(1);

    await waitFor(() => {
      expect(screen.getByText('Injury #1')).toBeInTheDocument();
    });

    expect(screen.getByText('Broken leg from fall')).toBeInTheDocument();
    expect(screen.getByText('high')).toBeInTheDocument();
  });

  it('displays error message when fetch fails', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ errors: ['Failed to fetch injury'] }),
    });

    renderWithRouter(1);

    await waitFor(() => {
      expect(screen.getByText(/Failed to fetch injury/)).toBeInTheDocument();
    });
  });

  it('calls fetch with correct URL', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockInjury,
    });

    renderWithRouter(1);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/v1/injuries/1', {
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': 'test-csrf-token',
        },
      });
    });
  });

  it('displays created and updated timestamps', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockInjury,
    });

    renderWithRouter(1);

    await waitFor(() => {
      expect(screen.getByText('Injury #1')).toBeInTheDocument();
    });

    const createdDate = new Date('2024-01-15T10:00:00Z').toLocaleString();
    const updatedDate = new Date('2024-01-16T12:00:00Z').toLocaleString();

    expect(screen.getByText(createdDate)).toBeInTheDocument();
    expect(screen.getByText(updatedDate)).toBeInTheDocument();
  });

  it('displays edit and delete buttons', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockInjury,
    });

    renderWithRouter(1);

    await waitFor(() => {
      expect(screen.getByText('Edit this injury')).toBeInTheDocument();
      expect(screen.getByText('Destroy this injury')).toBeInTheDocument();
    });

    const editLink = screen.getByText('Edit this injury');
    expect(editLink).toHaveAttribute('href', '/injuries/1/edit');
  });

  it('handles delete with confirmation', async () => {
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockInjury,
      })
      .mockResolvedValueOnce({
        ok: true,
        status: 204,
        json: async () => null,
      });

    (global.confirm as jest.Mock).mockReturnValue(true);

    renderWithRouter(1);

    await waitFor(() => {
      expect(screen.getByText('Injury #1')).toBeInTheDocument();
    });

    const deleteButton = screen.getByText('Destroy this injury');
    fireEvent.click(deleteButton);

    expect(global.confirm).toHaveBeenCalledWith('Are you sure you want to delete this injury?');

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/v1/injuries/1', expect.objectContaining({
        method: 'DELETE',
      }));
    });

    // Note: Navigation via window.location.assign() cannot be tested in JSDOM
    // The delete functionality is verified by confirming the DELETE API call was made
  });

  it('does not delete when confirmation is cancelled', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockInjury,
    });

    (global.confirm as jest.Mock).mockReturnValue(false);

    renderWithRouter(1);

    await waitFor(() => {
      expect(screen.getByText('Injury #1')).toBeInTheDocument();
    });

    const deleteButton = screen.getByText('Destroy this injury');
    fireEvent.click(deleteButton);

    expect(global.confirm).toHaveBeenCalled();

    // Verify that fetch was NOT called when user cancels
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1); // Only the initial fetch for injury data
    });
  });

  it('displays back to injuries link', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockInjury,
    });

    renderWithRouter(1);

    await waitFor(() => {
      const backLink = screen.getByText('Back');
      expect(backLink).toHaveAttribute('href', '/injuries');
    });
  });

  it('applies correct severity styling', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockInjury,
    });

    renderWithRouter(1);

    await waitFor(() => {
      const severityBadge = screen.getByText('high');
      expect(severityBadge).toHaveClass('bg-orange-100', 'text-orange-800');
    });
  });
});
