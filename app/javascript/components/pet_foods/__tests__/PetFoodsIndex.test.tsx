import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { PetFoodsIndex } from '../PetFoodsIndex';
import { PetFood } from '../../../types/petFood';

const renderWithRouter = () => {
  return render(
    <MemoryRouter>
      <PetFoodsIndex />
    </MemoryRouter>
  );
};

const mockPetFoods: PetFood[] = [
  {
    id: 1,
    pet_id: 1,
    food_id: 1,
    frequency_id: 1,
    started_at: '2025-01-01',
    notes: 'Morning feeding',
  },
  {
    id: 2,
    pet_id: 2,
    food_id: 2,
    frequency_id: 2,
    started_at: '2025-02-01',
  },
];

describe('PetFoodsIndex', () => {
  beforeEach(() => {
    (global.fetch as jest.Mock).mockClear();
  });

  it('displays loading state initially', () => {
    (global.fetch as jest.Mock).mockImplementation(() =>
      new Promise(() => {})
    );

    renderWithRouter();
    expect(screen.getByText('Loading pet foods...')).toBeInTheDocument();
  });

  it('fetches and displays pet foods', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockPetFoods,
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

  it('displays "no pet foods found" message when array is empty', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });

    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByText(/no.*pet.*foods.*found/i)).toBeInTheDocument();
    });
  });

  it('calls fetch with correct URL', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockPetFoods,
    });

    renderWithRouter();

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/v1/pet_foods', {
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
        json: async () => mockPetFoods,
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

    expect(global.confirm).toHaveBeenCalledWith('Are you sure you want to delete this pet food?');

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/v1/pet_foods/1', expect.objectContaining({
        method: 'DELETE',
      }));
    });
  });

  it('does not delete when confirmation is cancelled', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockPetFoods,
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

  it('displays correct links for each pet food', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockPetFoods,
    });

    renderWithRouter();

    await waitFor(() => {
      const petIdLabels = screen.getAllByText('Pet ID:');
      expect(petIdLabels.length).toBeGreaterThan(0);
    });

    const viewLinks = screen.getAllByText('View');
    const editLinks = screen.getAllByText('Edit');

    expect(viewLinks[0]).toHaveAttribute('href', '/pet_foods/1');
    expect(editLinks[0]).toHaveAttribute('href', '/pet_foods/1/edit');
  });

  it('displays new pet food link', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockPetFoods,
    });

    renderWithRouter();

    await waitFor(() => {
      const newLink = screen.getByText(/add.*pet.*food/i);
      expect(newLink).toHaveAttribute('href', '/pet_foods/new');
    });
  });
});
