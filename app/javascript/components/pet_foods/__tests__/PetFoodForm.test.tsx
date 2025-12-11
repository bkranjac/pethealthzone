import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { PetFoodForm } from '../PetFoodForm';
import { PetFood } from '../../../types/petFood';
import { Pet } from '../../../types/pet';
import { Food } from '../../../types/food';
import { Frequency } from '../../../types/frequency';

const renderWithRouter = (mode: 'new' | 'edit', petFoodId?: number) => {
  const path = mode === 'new' ? '/pet_foods/new' : `/pet_foods/${petFoodId}/edit`;
  const routePath = mode === 'new' ? '/pet_foods/new' : '/pet_foods/:id/edit';

  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path={routePath} element={<PetFoodForm mode={mode} />} />
        <Route path="/pet_foods/:id" element={<div>Pet Food Show Page</div>} />
        <Route path="/pet_foods" element={<div>Pet Foods Index Page</div>} />
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

const mockPets: Pet[] = [
  { id: 1, name: 'Buddy', pet_type: 'Dog', breed: 'Labrador', birthday: '2020-01-01', date_admitted: '2020-01-15' },
  { id: 2, name: 'Whiskers', pet_type: 'Cat', breed: 'Siamese', birthday: '2021-01-01', date_admitted: '2021-01-15' },
];

const mockFoods: Food[] = [
  { id: 1, name: 'Dry Dog Food', brand: 'Purina', ingredients: 'Chicken, rice' },
  { id: 2, name: 'Wet Cat Food', brand: 'Fancy Feast', ingredients: 'Salmon, gravy' },
];

const mockFrequencies: Frequency[] = [
  { id: 1, interval_days: 7 },
  { id: 2, interval_days: 30 },
];

describe('PetFoodForm', () => {
  beforeEach(() => {
    (global.fetch as jest.Mock).mockClear();
  });

  describe('New Mode', () => {
    it('renders form in new mode', async () => {
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({ ok: true, json: async () => mockPets })
        .mockResolvedValueOnce({ ok: true, json: async () => mockFoods })
        .mockResolvedValueOnce({ ok: true, json: async () => mockFrequencies });

      renderWithRouter('new');

      expect(screen.getByText('New Pet Food')).toBeInTheDocument();

      await waitFor(() => {
        expect(screen.getByLabelText(/Pet/)).toBeInTheDocument();
        expect(screen.getByLabelText(/Food/)).toBeInTheDocument();
        expect(screen.getByLabelText(/Frequency/)).toBeInTheDocument();
      });

      expect(screen.getByLabelText(/Date Started/)).toBeInTheDocument();
      expect(screen.getByText('Create Pet Food')).toBeInTheDocument();
    });

    it('submits form with valid data', async () => {
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({ ok: true, json: async () => mockPets })
        .mockResolvedValueOnce({ ok: true, json: async () => mockFoods })
        .mockResolvedValueOnce({ ok: true, json: async () => mockFrequencies })
        .mockResolvedValueOnce({ ok: true, json: async () => mockPetFood });

      renderWithRouter('new');

      await waitFor(() => {
        expect(screen.getByLabelText(/Pet/)).toBeInTheDocument();
      });

      const petSelect = screen.getByLabelText(/Pet/);
      const foodSelect = screen.getByLabelText(/Food/);
      const frequencySelect = screen.getByLabelText(/Frequency/);
      const dateInput = screen.getByLabelText(/Date Started/);

      fireEvent.change(petSelect, { target: { value: '1' } });
      fireEvent.change(foodSelect, { target: { value: '1' } });
      fireEvent.change(frequencySelect, { target: { value: '1' } });
      fireEvent.change(dateInput, { target: { value: '2025-01-01' } });

      const submitButton = screen.getByText('Create Pet Food');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith('/api/v1/pet_foods', expect.objectContaining({
          method: 'POST',
        }));
      });
    });
  });

  describe('Edit Mode', () => {
    it('fetches and displays existing pet food data', async () => {
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({ ok: true, json: async () => mockPets })
        .mockResolvedValueOnce({ ok: true, json: async () => mockFoods })
        .mockResolvedValueOnce({ ok: true, json: async () => mockFrequencies })
        .mockResolvedValueOnce({ ok: true, json: async () => mockPetFood });

      renderWithRouter('edit', 1);

      await waitFor(() => {
        const petSelect = screen.getByLabelText(/Pet/) as HTMLSelectElement;
        expect(petSelect.value).toBe('1');
      });

      expect(screen.getByText('Edit Pet Food')).toBeInTheDocument();
    });

    it('submits updated data', async () => {
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({ ok: true, json: async () => mockPets })
        .mockResolvedValueOnce({ ok: true, json: async () => mockFoods })
        .mockResolvedValueOnce({ ok: true, json: async () => mockFrequencies })
        .mockResolvedValueOnce({ ok: true, json: async () => mockPetFood })
        .mockResolvedValueOnce({ ok: true, json: async () => ({ ...mockPetFood, notes: 'Updated notes' }) });

      renderWithRouter('edit', 1);

      await waitFor(() => {
        expect(screen.getByDisplayValue('Morning feeding')).toBeInTheDocument();
      });

      const notesInput = screen.getByLabelText(/Notes/);
      fireEvent.change(notesInput, { target: { value: 'Updated notes' } });

      const submitButton = screen.getByText('Update Pet Food');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith('/api/v1/pet_foods/1', expect.objectContaining({
          method: 'PUT',
        }));
      });
    });
  });

  describe('Navigation', () => {
    it('displays back button linking to pet foods index', async () => {
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({ ok: true, json: async () => mockPets })
        .mockResolvedValueOnce({ ok: true, json: async () => mockFoods })
        .mockResolvedValueOnce({ ok: true, json: async () => mockFrequencies });

      renderWithRouter('new');

      await waitFor(() => {
        const backLink = screen.getByText('Back');
        expect(backLink).toHaveAttribute('href', '/pet_foods');
      });
    });
  });
});
