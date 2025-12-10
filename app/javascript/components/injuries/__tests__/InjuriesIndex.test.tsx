import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { InjuriesIndex } from '../InjuriesIndex';
import { Injury } from '../../../types/injury';

// Helper to render component with router
const renderWithRouter = () => {
  return render(
    <MemoryRouter>
      <InjuriesIndex />
    </MemoryRouter>
  );
};

const mockInjuries: Injury[] = [
  {
    id: 1,
    description: 'Broken leg',
    severity: 'high',
  },
  {
    id: 2,
    description: 'Minor cut',
    severity: 'low',
  },
];

describe('InjuriesIndex', () => {
  beforeEach(() => {
    (global.fetch as jest.Mock).mockClear();
  });

  it('displays loading state initially', () => {
    (global.fetch as jest.Mock).mockImplementation(() =>
      new Promise(() => {}) // Never resolves
    );

    renderWithRouter();
    expect(screen.getByText('Loading injuries...')).toBeInTheDocument();
  });

  it('fetches and displays injuries', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockInjuries,
    });

    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByText('Injury #1')).toBeInTheDocument();
      expect(screen.getByText('Injury #2')).toBeInTheDocument();
    });

    expect(screen.getByText('Broken leg')).toBeInTheDocument();
    expect(screen.getByText('Minor cut')).toBeInTheDocument();
    expect(screen.getByText('high')).toBeInTheDocument();
    expect(screen.getByText('low')).toBeInTheDocument();
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

  it('displays "no injuries found" message when injuries array is empty', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });

    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByText('No injuries found.')).toBeInTheDocument();
    });
  });

  it('calls fetch with correct URL', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockInjuries,
    });

    renderWithRouter();

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/v1/injuries', {
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
        json: async () => mockInjuries,
      })
      .mockResolvedValueOnce({
        ok: true,
        status: 204,
        json: async () => null,
      });

    (global.confirm as jest.Mock).mockReturnValue(true);

    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByText('Injury #1')).toBeInTheDocument();
    });

    const deleteButtons = screen.getAllByText('Delete');
    fireEvent.click(deleteButtons[0]);

    expect(global.confirm).toHaveBeenCalledWith('Are you sure you want to delete this injury?');

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/v1/injuries/1', expect.objectContaining({
        method: 'DELETE',
      }));
    });

    await waitFor(() => {
      expect(screen.queryByText('Injury #1')).not.toBeInTheDocument();
    });
  });

  it('does not delete when confirmation is cancelled', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockInjuries,
    });

    (global.confirm as jest.Mock).mockReturnValue(false);

    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByText('Injury #1')).toBeInTheDocument();
    });

    const deleteButtons = screen.getAllByText('Delete');
    fireEvent.click(deleteButtons[0]);

    expect(global.confirm).toHaveBeenCalled();
    expect(screen.getByText('Injury #1')).toBeInTheDocument();
  });

  it('displays correct links for each injury', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockInjuries,
    });

    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByText('Injury #1')).toBeInTheDocument();
    });

    const viewLinks = screen.getAllByText('View');
    const editLinks = screen.getAllByText('Edit');

    expect(viewLinks[0]).toHaveAttribute('href', '/injuries/1');
    expect(editLinks[0]).toHaveAttribute('href', '/injuries/1/edit');
  });

  it('displays new injury link', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockInjuries,
    });

    renderWithRouter();

    await waitFor(() => {
      const newLink = screen.getByText('New injury');
      expect(newLink).toHaveAttribute('href', '/injuries/new');
    });
  });

  it('applies correct styling based on severity', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockInjuries,
    });

    renderWithRouter();

    await waitFor(() => {
      const highSeverity = screen.getByText('high');
      const lowSeverity = screen.getByText('low');

      expect(highSeverity).toHaveClass('bg-orange-100', 'text-orange-800');
      expect(lowSeverity).toHaveClass('bg-green-100', 'text-green-800');
    });
  });
});
