import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { FoodsIndex } from '../FoodsIndex';
import { Food } from '../../../types/food';

// Helper to render component with router
const renderWithRouter = () => {
  return render(
    <MemoryRouter>
      <FoodsIndex />
    </MemoryRouter>
  );
};

const mockFoods: Food[] = [
  {
    id: 1,
    name: 'Premium Dog Food',
    brand: 'PetBrand',
    ingredients: 'Chicken, rice, vegetables',
  },
  {
    id: 2,
    name: 'Cat Food Deluxe',
    brand: 'CatBrand',
  },
];

describe('FoodsIndex', () => {
  beforeEach(() => {
    (global.fetch as jest.Mock).mockClear();
  });

  it('displays loading state initially', () => {
    (global.fetch as jest.Mock).mockImplementation(() =>
      new Promise(() => {}) // Never resolves
    );

    renderWithRouter();
    expect(screen.getByText('Loading foods...')).toBeInTheDocument();
  });

  it('fetches and displays foods', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockFoods,
    });

    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByText('Premium Dog Food')).toBeInTheDocument();
      expect(screen.getByText('Cat Food Deluxe')).toBeInTheDocument();
      expect(screen.getByText('PetBrand')).toBeInTheDocument();
      expect(screen.getByText('Chicken, rice, vegetables')).toBeInTheDocument();
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

  it('displays "no foods found" message when array is empty', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });

    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByText('No foods found.')).toBeInTheDocument();
    });
  });

  it('calls fetch with correct URL', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockFoods,
    });

    renderWithRouter();

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/v1/foods', {
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
        json: async () => mockFoods,
      })
      .mockResolvedValueOnce({
        ok: true,
        status: 204,
        json: async () => null,
      });

    (global.confirm as jest.Mock).mockReturnValue(true);

    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByText('Premium Dog Food')).toBeInTheDocument();
    });

    const deleteButtons = screen.getAllByText('Delete');
    fireEvent.click(deleteButtons[0]);

    expect(global.confirm).toHaveBeenCalledWith('Are you sure you want to delete this food?');

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/v1/foods/1', expect.objectContaining({
        method: 'DELETE',
      }));
    });

    await waitFor(() => {
      expect(screen.queryByText('Premium Dog Food')).not.toBeInTheDocument();
    });
  });

  it('does not delete when confirmation is cancelled', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockFoods,
    });

    (global.confirm as jest.Mock).mockReturnValue(false);

    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByText('Premium Dog Food')).toBeInTheDocument();
    });

    const deleteButtons = screen.getAllByText('Delete');
    fireEvent.click(deleteButtons[0]);

    expect(global.confirm).toHaveBeenCalled();
    expect(screen.getByText('Premium Dog Food')).toBeInTheDocument();
  });

  it('displays correct links for each food', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockFoods,
    });

    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByText('Premium Dog Food')).toBeInTheDocument();
    });

    const viewLinks = screen.getAllByText('View');
    const editLinks = screen.getAllByText('Edit');

    expect(viewLinks[0]).toHaveAttribute('href', '/foods/1');
    expect(editLinks[0]).toHaveAttribute('href', '/foods/1/edit');
  });

  it('displays new food link', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockFoods,
    });

    renderWithRouter();

    await waitFor(() => {
      const newLink = screen.getByText('New food');
      expect(newLink).toHaveAttribute('href', '/foods/new');
    });
  });
});
