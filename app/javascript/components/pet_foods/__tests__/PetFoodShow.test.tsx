import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { PetFoodShow } from '../PetFoodShow';
import { PetFood } from '../../../types/petFood';

const renderWithRouter = (petFoodId: number) => {
  return render(
    <MemoryRouter initialEntries={[`/pet_foods/${petFoodId}`]}>
      <Routes>
        <Route path="/pet_foods/:id" element={<PetFoodShow />} />
      </Routes>
    </MemoryRouter>
  );
};

const mockPetFood: PetFood = {
  id: 1,
  pet_id: 1,
  food_id: 1,
  frequency_id: 1,
  date_started: '2025-01-01',
  notes: 'Morning feeding',
};

describe('PetFoodShow', () => {
  beforeEach(() => {
    (global.fetch as jest.Mock).mockClear();
    (global.confirm as jest.Mock).mockClear();
  });

  it('displays loading state initially', () => {
    (global.fetch as jest.Mock).mockImplementation(() =>
      new Promise(() => {})
    );

    renderWithRouter(1);
    expect(screen.getByText('Loading pet food...')).toBeInTheDocument();
  });

  it('fetches and displays pet food details', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockPetFood,
    });

    renderWithRouter(1);

    await waitFor(() => {
      expect(screen.getByText('Pet Food #1')).toBeInTheDocument();
      expect(screen.getByText('Morning feeding')).toBeInTheDocument();
    });
  });

  it('displays error message when fetch fails', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ errors: ['Failed to fetch pet food'] }),
    });

    renderWithRouter(1);

    await waitFor(() => {
      expect(screen.getByText(/Failed to fetch pet food/)).toBeInTheDocument();
    });
  });

  it('calls fetch with correct URL', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockPetFood,
    });

    renderWithRouter(1);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/v1/pet_foods/1', {
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
      json: async () => mockPetFood,
    });

    renderWithRouter(1);

    await waitFor(() => {
      expect(screen.getByText('Edit this pet food')).toBeInTheDocument();
      expect(screen.getByText('Destroy this pet food')).toBeInTheDocument();
    });

    const editLink = screen.getByText('Edit this pet food');
    expect(editLink).toHaveAttribute('href', '/pet_foods/1/edit');
  });

  it('handles delete with confirmation', async () => {
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockPetFood,
      })
      .mockResolvedValueOnce({
        ok: true,
        status: 204,
        json: async () => null,
      });

    (global.confirm as jest.Mock).mockReturnValue(true);

    renderWithRouter(1);

    await waitFor(() => {
      expect(screen.getByText('Pet Food #1')).toBeInTheDocument();
    });

    const deleteButton = screen.getByText('Destroy this pet food');
    fireEvent.click(deleteButton);

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
      json: async () => mockPetFood,
    });

    (global.confirm as jest.Mock).mockReturnValue(false);

    renderWithRouter(1);

    await waitFor(() => {
      expect(screen.getByText('Pet Food #1')).toBeInTheDocument();
    });

    const deleteButton = screen.getByText('Destroy this pet food');
    fireEvent.click(deleteButton);

    expect(global.confirm).toHaveBeenCalled();

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });
  });

  it('displays back link', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockPetFood,
    });

    renderWithRouter(1);

    await waitFor(() => {
      const backLink = screen.getByText('Back');
      expect(backLink).toHaveAttribute('href', '/pet_foods');
    });
  });
});
