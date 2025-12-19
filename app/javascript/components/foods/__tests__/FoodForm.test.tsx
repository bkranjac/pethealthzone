import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { FoodForm } from '../FoodForm';
import { Food } from '../../../types/food';

// Helper to render component with router
const renderWithRouter = (mode: 'new' | 'edit', foodId?: number) => {
  const path = mode === 'new' ? '/foods/new' : `/foods/${foodId}/edit`;
  const routePath = mode === 'new' ? '/foods/new' : '/foods/:id/edit';

  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path={routePath} element={<FoodForm mode={mode} />} />
        <Route path="/foods/:id" element={<div>Food Show Page</div>} />
        <Route path="/foods" element={<div>Foods Index Page</div>} />
      </Routes>
    </MemoryRouter>
  );
};

const mockFood: Food = {
  id: 1,
  name: 'Premium Dog Food',
  food_type: 'Dry Food',
  amount: '2 cups',
  description: 'High quality dry food',
  purpose: 'Daily nutrition',
  notes: 'Feed twice daily',
};

describe('FoodForm', () => {
  beforeEach(() => {
    (global.fetch as jest.Mock).mockClear();
  });

  describe('New Mode', () => {
    it('renders form in new mode', () => {
      renderWithRouter('new');

      expect(screen.getByText('New Food')).toBeInTheDocument();
      expect(screen.getByLabelText(/Name/)).toBeInTheDocument();
      expect(screen.getByLabelText(/Food Type/)).toBeInTheDocument();
      expect(screen.getByLabelText(/Amount/)).toBeInTheDocument();
      expect(screen.getByText('Create Food')).toBeInTheDocument();
    });

    it('submits form with valid data', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ ...mockFood }),
      });

      renderWithRouter('new');

      const nameInput = screen.getByLabelText(/Name/);
      const foodTypeInput = screen.getByLabelText(/Food Type/);
      const amountInput = screen.getByLabelText(/Amount/);

      fireEvent.change(nameInput, { target: { value: 'Premium Dog Food' } });
      fireEvent.change(foodTypeInput, { target: { value: 'Dry Food' } });
      fireEvent.change(amountInput, { target: { value: '2 cups' } });

      const submitButton = screen.getByText('Create Food');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith('/api/v1/foods', expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          }),
          body: expect.stringContaining('"name":"Premium Dog Food"'),
        }));
      });
    });

    it('displays error message when submission fails', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: async () => ({ errors: ['Name is required'] }),
      });

      renderWithRouter('new');

      const nameInput = screen.getByLabelText(/Name/);
      const foodTypeInput = screen.getByLabelText(/Food Type/);

      fireEvent.change(nameInput, { target: { value: 'Test Food' } });
      fireEvent.change(foodTypeInput, { target: { value: 'Test Type' } });

      const submitButton = screen.getByText('Create Food');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/Name is required/)).toBeInTheDocument();
      });
    });

    it('disables submit button while submitting', async () => {
      (global.fetch as jest.Mock).mockImplementation(() =>
        new Promise(() => {}) // Never resolves
      );

      renderWithRouter('new');

      const nameInput = screen.getByLabelText(/Name/);
      const foodTypeInput = screen.getByLabelText(/Food Type/);

      fireEvent.change(nameInput, { target: { value: 'Test Food' } });
      fireEvent.change(foodTypeInput, { target: { value: 'Test Type' } });

      const submitButton = screen.getByText('Create Food');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Saving...')).toBeInTheDocument();
        expect(submitButton).toBeDisabled();
      });
    });
  });

  describe('Edit Mode', () => {
    it('fetches and displays existing food data', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockFood,
      });

      renderWithRouter('edit', 1);

      await waitFor(() => {
        const nameInput = screen.getByLabelText(/Name/) as HTMLInputElement;
        expect(nameInput.value).toBe('Premium Dog Food');
      });

      const foodTypeInput = screen.getByLabelText(/Food Type/) as HTMLInputElement;
      const amountInput = screen.getByLabelText(/Amount/) as HTMLInputElement;

      expect(foodTypeInput.value).toBe('Dry Food');
      expect(amountInput.value).toBe('2 cups');
      expect(screen.getByText('Edit Food')).toBeInTheDocument();
    });

    it('submits updated data', async () => {
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockFood,
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ ...mockFood, food_type: 'Wet Food' }),
        });

      renderWithRouter('edit', 1);

      await waitFor(() => {
        expect(screen.getByDisplayValue('Dry Food')).toBeInTheDocument();
      });

      const foodTypeInput = screen.getByLabelText(/Food Type/);
      fireEvent.change(foodTypeInput, { target: { value: 'Wet Food' } });

      const submitButton = screen.getByText('Update Food');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith('/api/v1/foods/1', expect.objectContaining({
          method: 'PUT',
          body: expect.stringContaining('"food_type":"Wet Food"'),
        }));
      });
    });

    it('displays error when fetch fails', async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Failed to fetch food'));

      renderWithRouter('edit', 1);

      await waitFor(() => {
        expect(screen.getByText(/Failed to fetch food/)).toBeInTheDocument();
      });
    });
  });

  describe('Navigation', () => {
    it('displays back button linking to foods index', () => {
      renderWithRouter('new');

      const backLink = screen.getByText('Back');
      expect(backLink).toHaveAttribute('href', '/foods');
    });
  });
});
