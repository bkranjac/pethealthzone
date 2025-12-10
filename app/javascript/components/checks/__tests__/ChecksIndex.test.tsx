import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ChecksIndex } from '../ChecksIndex';
import { Check } from '../../../types/check';

const renderWithRouter = () => {
  return render(
    <MemoryRouter>
      <ChecksIndex />
    </MemoryRouter>
  );
};

const mockChecks: Check[] = [
  {
    id: 1,
    name: 'Heart Check',
    frequency_id: 1,
  },
  {
    id: 2,
    name: 'Dental Check',
    frequency_id: 2,
  },
];

describe('ChecksIndex', () => {
  beforeEach(() => {
    (global.fetch as jest.Mock).mockClear();
  });

  it('displays loading state initially', () => {
    (global.fetch as jest.Mock).mockImplementation(() =>
      new Promise(() => {})
    );

    renderWithRouter();
    expect(screen.getByText('Loading checks...')).toBeInTheDocument();
  });

  it('fetches and displays checks', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockChecks,
    });

    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByText('Heart Check')).toBeInTheDocument();
      expect(screen.getByText('Dental Check')).toBeInTheDocument();
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

  it('displays "no checks found" message when array is empty', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });

    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByText('No checks found.')).toBeInTheDocument();
    });
  });

  it('calls fetch with correct URL', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockChecks,
    });

    renderWithRouter();

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/v1/checks', {
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
        json: async () => mockChecks,
      })
      .mockResolvedValueOnce({
        ok: true,
        status: 204,
        json: async () => null,
      });

    (global.confirm as jest.Mock).mockReturnValue(true);

    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByText('Heart Check')).toBeInTheDocument();
    });

    const deleteButtons = screen.getAllByText('Delete');
    fireEvent.click(deleteButtons[0]);

    expect(global.confirm).toHaveBeenCalledWith('Are you sure you want to delete this check?');

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/v1/checks/1', expect.objectContaining({
        method: 'DELETE',
      }));
    });

    await waitFor(() => {
      expect(screen.queryByText('Heart Check')).not.toBeInTheDocument();
    });
  });

  it('does not delete when confirmation is cancelled', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockChecks,
    });

    (global.confirm as jest.Mock).mockReturnValue(false);

    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByText('Heart Check')).toBeInTheDocument();
    });

    const deleteButtons = screen.getAllByText('Delete');
    fireEvent.click(deleteButtons[0]);

    expect(global.confirm).toHaveBeenCalled();
    expect(screen.getByText('Heart Check')).toBeInTheDocument();
  });

  it('displays correct links for each check', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockChecks,
    });

    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByText('Heart Check')).toBeInTheDocument();
    });

    const viewLinks = screen.getAllByText('View');
    const editLinks = screen.getAllByText('Edit');

    expect(viewLinks[0]).toHaveAttribute('href', '/checks/1');
    expect(editLinks[0]).toHaveAttribute('href', '/checks/1/edit');
  });

  it('displays new check link', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockChecks,
    });

    renderWithRouter();

    await waitFor(() => {
      const newLink = screen.getByText('New check');
      expect(newLink).toHaveAttribute('href', '/checks/new');
    });
  });
});
