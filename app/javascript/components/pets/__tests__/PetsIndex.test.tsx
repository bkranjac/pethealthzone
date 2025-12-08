import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { PetsIndex } from '../PetsIndex';
import { Pet } from '../../../types/pet';

const mockPets: Pet[] = [
  {
    id: 1,
    name: 'Buddy',
    nickname: 'Bud',
    pet_type: 'Dog',
    breed: 'Labrador',
    gender: 'Male',
    birthday: '2020-01-15',
    date_admitted: '2020-02-01',
    notes: 'Friendly dog',
  },
  {
    id: 2,
    name: 'Whiskers',
    nickname: 'Whisk',
    pet_type: 'Cat',
    breed: 'Siamese',
    gender: 'Female',
    birthday: '2019-05-20',
    date_admitted: '2019-06-10',
  },
];

describe('PetsIndex', () => {
  beforeEach(() => {
    (global.fetch as jest.Mock).mockClear();
  });

  it('displays loading state initially', () => {
    (global.fetch as jest.Mock).mockImplementation(() =>
      new Promise(() => {}) // Never resolves
    );

    render(<PetsIndex />);
    expect(screen.getByText('Loading pets...')).toBeInTheDocument();
  });

  it('fetches and displays pets', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockPets,
    });

    render(<PetsIndex />);

    await waitFor(() => {
      expect(screen.getByText('Buddy')).toBeInTheDocument();
      expect(screen.getByText('Whiskers')).toBeInTheDocument();
    });

    expect(screen.getByText('"Bud"')).toBeInTheDocument();
    expect(screen.getByText('"Whisk"')).toBeInTheDocument();
    expect(screen.getAllByText('Type:').length).toBeGreaterThan(0);
    expect(screen.getByText('Dog')).toBeInTheDocument();
    expect(screen.getAllByText('Breed:').length).toBeGreaterThan(0);
    expect(screen.getByText('Labrador')).toBeInTheDocument();
  });

  it('displays error message when fetch fails', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(
      new Error('Failed to fetch data')
    );

    render(<PetsIndex />);

    await waitFor(() => {
      expect(screen.getByText(/Failed to fetch data/)).toBeInTheDocument();
    });
  });

  it('displays "no pets found" message when pets array is empty', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });

    render(<PetsIndex />);

    await waitFor(() => {
      expect(screen.getByText('No pets found.')).toBeInTheDocument();
    });
  });

  it('calls fetch with correct URL', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockPets,
    });

    render(<PetsIndex />);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/v1/pets', {
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
        json: async () => mockPets,
      })
      .mockResolvedValueOnce({
        ok: true,
      });

    (global.confirm as jest.Mock).mockReturnValue(true);

    render(<PetsIndex />);

    await waitFor(() => {
      expect(screen.getByText('Buddy')).toBeInTheDocument();
    });

    const deleteButtons = screen.getAllByText('Delete');
    fireEvent.click(deleteButtons[0]);

    expect(global.confirm).toHaveBeenCalledWith('Are you sure you want to delete this pet?');

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/v1/pets/1', expect.objectContaining({
        method: 'DELETE',
      }));
    });

    await waitFor(() => {
      expect(screen.queryByText('Buddy')).not.toBeInTheDocument();
    });
  });

  it('does not delete when confirmation is cancelled', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockPets,
    });

    (global.confirm as jest.Mock).mockReturnValue(false);

    render(<PetsIndex />);

    await waitFor(() => {
      expect(screen.getByText('Buddy')).toBeInTheDocument();
    });

    const deleteButtons = screen.getAllByText('Delete');
    fireEvent.click(deleteButtons[0]);

    expect(global.confirm).toHaveBeenCalled();
    expect(screen.getByText('Buddy')).toBeInTheDocument();
  });

  it('displays correct links for each pet', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockPets,
    });

    render(<PetsIndex />);

    await waitFor(() => {
      expect(screen.getByText('Buddy')).toBeInTheDocument();
    });

    const viewLinks = screen.getAllByText('View');
    const editLinks = screen.getAllByText('Edit');

    expect(viewLinks[0]).toHaveAttribute('href', '/pets/1');
    expect(editLinks[0]).toHaveAttribute('href', '/pets/1/edit');
  });

  it('displays new pet link', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockPets,
    });

    render(<PetsIndex />);

    await waitFor(() => {
      const newLink = screen.getByText('New pet');
      expect(newLink).toHaveAttribute('href', '/pets/new');
    });
  });
});
