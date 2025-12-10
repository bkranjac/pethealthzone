import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { FoodShow } from '../FoodShow';
import { Food } from '../../../types/food';

// Helper to render component with router
const renderWithRouter = (foodId: number) => {
  return render(
    <MemoryRouter initialEntries={[`/foods/${foodId}`]}>
      <Routes>
        <Route path="/foods/:id" element={<FoodShow />} />
      </Routes>
    </MemoryRouter>
  );
};

const mockFood: Food = {
  id: 1,
  name: 'Premium Dog Food',
  brand: 'PetBrand',
  ingredients: 'Chicken, rice, vegetables',
};

describe('FoodShow', () => {
  beforeEach(() => {
    (global.fetch as jest.Mock).mockClear();
    (global.confirm as jest.Mock).mockClear();
  });

  it('displays loading state initially', () => {
    (global.fetch as jest.Mock).mockImplementation(() =>
      new Promise(() => {}) // Never resolves
    );

    renderWithRouter(1);
    expect(screen.getByText('Loading food...')).toBeInTheDocument();
  });

  it('fetches and displays food details', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockFood,
    });

    renderWithRouter(1);

    await waitFor(() => {
      expect(screen.getByText('Premium Dog Food')).toBeInTheDocument();
    });

    expect(screen.getByText('PetBrand')).toBeInTheDocument();
    expect(screen.getByText('Chicken, rice, vegetables')).toBeInTheDocument();
  });

  it('displays error message when fetch fails', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ errors: ['Failed to fetch food'] }),
    });

    renderWithRouter(1);

    await waitFor(() => {
      expect(screen.getByText(/Failed to fetch food/)).toBeInTheDocument();
    });
  });

  it('calls fetch with correct URL', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockFood,
    });

    renderWithRouter(1);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/v1/foods/1', {
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
      json: async () => mockFood,
    });

    renderWithRouter(1);

    await waitFor(() => {
      expect(screen.getByText('Edit this food')).toBeInTheDocument();
      expect(screen.getByText('Destroy this food')).toBeInTheDocument();
    });

    const editLink = screen.getByText('Edit this food');
    expect(editLink).toHaveAttribute('href', '/foods/1/edit');
  });

  it('handles delete with confirmation', async () => {
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockFood,
      })
      .mockResolvedValueOnce({
        ok: true,
        status: 204,
        json: async () => null,
      });

    (global.confirm as jest.Mock).mockReturnValue(true);

    renderWithRouter(1);

    await waitFor(() => {
      expect(screen.getByText('Premium Dog Food')).toBeInTheDocument();
    });

    const deleteButton = screen.getByText('Destroy this food');
    fireEvent.click(deleteButton);

    expect(global.confirm).toHaveBeenCalledWith('Are you sure you want to delete this food?');

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/v1/foods/1', expect.objectContaining({
        method: 'DELETE',
      }));
    });
  });

  it('does not delete when confirmation is cancelled', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockFood,
    });

    (global.confirm as jest.Mock).mockReturnValue(false);

    renderWithRouter(1);

    await waitFor(() => {
      expect(screen.getByText('Premium Dog Food')).toBeInTheDocument();
    });

    const deleteButton = screen.getByText('Destroy this food');
    fireEvent.click(deleteButton);

    expect(global.confirm).toHaveBeenCalled();

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1); // Only the initial fetch
    });
  });

  it('displays back to foods link', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockFood,
    });

    renderWithRouter(1);

    await waitFor(() => {
      const backLink = screen.getByText('Back');
      expect(backLink).toHaveAttribute('href', '/foods');
    });
  });
});
